<?php
// contact.php

// Configurar headers CORS
header('Access-Control-Allow-Origin: https://adricode.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit();
}

// Cargar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Cargar configuración desde archivo separado
$config = require __DIR__ . '/config.php';

define('TURNSTILE_SECRET_KEY', $config['turnstile_secret']);
define('EMAIL_TO', $config['email_to']);
define('SMTP_HOST', $config['smtp_host']);
define('SMTP_PORT', $config['smtp_port']);
define('SMTP_USER', $config['smtp_user']);
define('SMTP_PASS', $config['smtp_pass']);

// Obtener datos del formulario
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Verificar que se pudo parsear el JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'JSON inválido']);
    exit();
}

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$turnstileResponse = isset($input['cf-turnstile-response']) ? $input['cf-turnstile-response'] : '';

// Validación básica
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit();
}

if (empty($turnstileResponse)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Verificación de seguridad requerida']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit();
}

// Verificar longitud de campos
if (strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nombre demasiado largo']);
    exit();
}

if (strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Mensaje demasiado largo']);
    exit();
}

// Verificar Cloudflare Turnstile
$verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
$verifyData = [
    'secret' => TURNSTILE_SECRET_KEY,
    'response' => $turnstileResponse,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
];

$ch = curl_init($verifyUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($verifyData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$verifyResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    error_log("Turnstile verification error: " . $curlError);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al verificar seguridad']);
    exit();
}

$verifyResult = json_decode($verifyResponse, true);

if (!$verifyResult || !isset($verifyResult['success']) || !$verifyResult['success']) {
    $errorCodes = isset($verifyResult['error-codes']) ? implode(', ', $verifyResult['error-codes']) : 'unknown';
    error_log("Turnstile verification failed: " . $errorCodes);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Verificación de seguridad fallida']);
    exit();
}

// Sanitizar datos
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Preparar email con PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';

    // Remitente y destinatarios
    $mail->setFrom(SMTP_USER, 'adricode.com');
    $mail->addAddress(EMAIL_TO);
    $mail->addReplyTo($email, $name);

    // Contenido del email
    $mail->isHTML(false);
    $mail->Subject = "Nuevo mensaje de contacto - " . $name;
    
    $emailBody = "Nuevo mensaje desde el formulario de contacto de adricode.com\n\n";
    $emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $emailBody .= "NOMBRE: " . $name . "\n";
    $emailBody .= "EMAIL: " . $email . "\n\n";
    $emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $emailBody .= "MENSAJE:\n\n";
    $emailBody .= $message . "\n\n";
    $emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $emailBody .= "Información adicional:\n";
    $emailBody .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    $emailBody .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
    $emailBody .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
    
    $mail->Body = $emailBody;

    // Enviar email
    $mail->send();

    // Guardar en archivo de log
    $logDir = __DIR__ . '/logs';
    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }

    $logEntry = sprintf(
        "[%s] Mensaje de: %s (%s) - %s\n",
        date('Y-m-d H:i:s'),
        $name,
        $email,
        substr($message, 0, 50) . (strlen($message) > 50 ? '...' : '')
    );
    @file_put_contents($logDir . '/contact_log.txt', $logEntry, FILE_APPEND);

    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Mensaje enviado correctamente'
    ]);

} catch (Exception $e) {
    error_log("PHPMailer Error: {$mail->ErrorInfo}");
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde o contáctame directamente a dev@adricode.com'
    ]);
}
?>