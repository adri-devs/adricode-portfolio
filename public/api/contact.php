<?php
$config = require __DIR__ . '/config.php';

// Configuración de errores
error_reporting(0);
ini_set('display_errors', 0);

// Función de logging
function logDebug($message, $data = null) {
    $logDir = __DIR__ . '/logs';
    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    
    // Formato del log: [fecha] mensaje + datos (si los hay)
    $logEntry = sprintf(
        "[%s] %s",
        date('Y-m-d H:i:s'),
        $message
    );
    
    if ($data !== null) {
        $logEntry .= "\n" . print_r($data, true);
    }
   
    // Separador para cada petición
    $logEntry .= "\n" . str_repeat('-', 80) . "\n";
    
    @file_put_contents($logDir . '/debug.log', $logEntry, FILE_APPEND);
}

// Headers CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['allowed_origins'])) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

logDebug('═══════════════════════════════════════════════════════════════');
logDebug('Nueva petición recibida', [
    'method' => $_SERVER['REQUEST_METHOD'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'no-origin',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'no-user-agent',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'no-ip'
]);

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    logDebug('Preflight request (OPTIONS) - respondiendo 200');
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logDebug('Método no permitido: ' . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit();
}

// Función de rate limiting
function checkRateLimit($ip, $config) {
    if (!$config['rate_limit_enabled']) {
        logDebug('Rate limit deshabilitado');
        return true;
    }
    
    $logFile = __DIR__ . '/logs/rate_limit.json';
    $logDir = dirname($logFile);
    
    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    
    $now = time();
    $hourAgo = $now - 3600;
    
    $data = [];
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        $data = json_decode($content, true) ?: [];
    }
    
    // Limpiar entradas antiguas
    $data = array_filter($data, function($timestamp) use ($hourAgo) {
        return $timestamp > $hourAgo;
    });
    
    // Contar requests de esta IP
    $ipRequests = array_filter($data, function($timestamp, $key) use ($ip) {
        return strpos($key, $ip . '_') === 0;
    }, ARRAY_FILTER_USE_BOTH);
    
    logDebug('Rate limit check', [
        'ip' => $ip,
        'requests_last_hour' => count($ipRequests),
        'max_allowed' => $config['max_requests_per_hour']
    ]);
    
    if (count($ipRequests) >= $config['max_requests_per_hour']) {
        logDebug('Rate limit excedido para IP: ' . $ip);
        return false;
    }
    
    // Registrar nueva petición
    $data[$ip . '_' . $now] = $now;
    @file_put_contents($logFile, json_encode($data));
    
    return true;
}

// Función para verificar Turnstile
function verifyTurnstile($token, $ip, $secret) {
    logDebug('Iniciando verificación de Turnstile', [
        'token_presente' => !empty($token),
        'token_length' => strlen($token),
        'token_preview' => substr($token, 0, 40) . '...',
        'ip' => $ip,
        'secret_length' => strlen($secret)
    ]);
    
    if (empty($token)) {
        logDebug('Token vacío');
        return false;
    }
    
    $verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $verifyData = [
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip
    ];

    logDebug('Enviando petición a Cloudflare', [
        'url' => $verifyUrl,
        'secret_length' => strlen($secret),
        'response_length' => strlen($token),
        'remoteip' => $ip
    ]);

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($verifyData),
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ];

    $context = stream_context_create($options);
    $verifyResponse = @file_get_contents($verifyUrl, false, $context);

    if ($verifyResponse === false) {
        logDebug('ERROR: No se pudo conectar con Cloudflare Turnstile');
        $error = error_get_last();
        logDebug('Error details', $error);
        return false;
    }

    logDebug('📥 Respuesta raw de Cloudflare:', $verifyResponse);

    $verifyResult = json_decode($verifyResponse, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        logDebug('Error al parsear respuesta JSON de Cloudflare: ' . json_last_error_msg());
        return false;
    }
    
    logDebug('📋 Resultado parseado de Cloudflare', $verifyResult);
    
    $isValid = $verifyResult && isset($verifyResult['success']) && $verifyResult['success'] === true;
    
    if ($isValid) {
        logDebug('Token VÁLIDO - Verificación exitosa');
    } else {
        logDebug('Token INVÁLIDO', [
            'success' => $verifyResult['success'] ?? 'no-success-field',
            'error-codes' => $verifyResult['error-codes'] ?? []
        ]);
    }
    
    return $isValid;
}

// Función para registrar contactos
function logContact($name, $email, $ip) {
    $logDir = __DIR__ . '/logs';
    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }

    $logEntry = sprintf(
        "[%s] Mensaje de: %s (%s) - IP: %s\n",
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $ip
    );
    @file_put_contents($logDir . '/contact_log.txt', $logEntry, FILE_APPEND);
}

// Obtener IP del cliente
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
logDebug('IP del cliente: ' . $clientIP);

// Verificar rate limit
if (!checkRateLimit($clientIP, $config)) {
    logDebug('Rate limit excedido para IP: ' . $clientIP);
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'error' => 'Demasiados intentos. Por favor, espera una hora.'
    ]);
    exit();
}

// Leer input
$rawInput = file_get_contents('php://input');
logDebug('Input recibido (primeros 1000 chars):', substr($rawInput, 0, 1000));

$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    logDebug('Error parseando JSON del cliente: ' . json_last_error_msg());
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos inválidos (JSON malformado)']);
    exit();
}

logDebug('Datos parseados correctamente', [
    'name' => $input['name'] ?? 'NO-NAME',
    'email' => $input['email'] ?? 'NO-EMAIL',
    'message_length' => isset($input['message']) ? strlen($input['message']) : 0,
    'has_turnstile_token' => isset($input['cf-turnstile-response']) && !empty($input['cf-turnstile-response'])
]);

// Extraer y limpiar datos
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$turnstileToken = isset($input['cf-turnstile-response']) ? trim($input['cf-turnstile-response']) : '';

// Validar campos obligatorios
if (empty($name) || empty($email) || empty($message)) {
    logDebug('Campos vacíos detectados', [
        'name_empty' => empty($name),
        'email_empty' => empty($email),
        'message_empty' => empty($message)
    ]);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit();
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logDebug('Email inválido: ' . $email);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit();
}

// Validar longitudes
if (strlen($name) > 100 || strlen($message) > 5000) {
    logDebug('Datos demasiado largos', [
        'name_length' => strlen($name),
        'message_length' => strlen($message)
    ]);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos demasiado largos']);
    exit();
}

// Verificar spam
$spamKeywords = ['casino', 'lottery', 'winner', 'viagra', 'buy now', 'shop online', 'free money'];
$messageToCheck = strtolower($message . ' ' . $name);
foreach ($spamKeywords as $keyword) {
    if (strpos($messageToCheck, $keyword) !== false) {
        logDebug('Spam detectado: ' . $keyword);
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Mensaje detectado como spam']);
        exit();
    }
}

// Verificar token de Turnstile
if (empty($turnstileToken)) {
    logDebug('Token de Turnstile vacío o ausente');
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Verificación de seguridad requerida (token ausente)']);
    exit();
}

logDebug('🔑 Token de Turnstile presente, procediendo a verificar...');

// Verificar el token con Cloudflare
if (!verifyTurnstile($turnstileToken, $clientIP, $config['TURNSTILE_SECRET_KEY'])) {
    logDebug('Verificación de Turnstile FALLIDA');
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Verificación de seguridad fallida']);
    exit();
}

logDebug('Turnstile verificado correctamente, procediendo a enviar email...');

// Sanitizar datos
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Preparar email
$subject = "Nuevo mensaje de contacto - " . $name;

$emailBody = "Nuevo mensaje desde adricode.com\n\n";
$emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$emailBody .= "NOMBRE: " . $name . "\n";
$emailBody .= "EMAIL: " . $email . "\n\n";
$emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$emailBody .= "MENSAJE:\n\n";
$emailBody .= $message . "\n\n";
$emailBody .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$emailBody .= "Información adicional:\n";
$emailBody .= "IP: " . $clientIP . "\n";
$emailBody .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
$emailBody .= "Fecha: " . date('d/m/Y H:i:s') . "\n";

$headers = "From: adricode.com <" . $config['email_from'] . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

logDebug('📧 Intentando enviar email', [
    'to' => $config['email_to'],
    'from' => $config['email_from'],
    'reply_to' => $email,
    'subject' => $subject
]);

// Enviar email
$mailSent = @mail($config['email_to'], $subject, $emailBody, $headers);

if (!$mailSent) {
    logDebug('❌ ERROR: No se pudo enviar el email');
    $lastError = error_get_last();
    logDebug('Último error de PHP', $lastError);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al enviar el mensaje. Por favor, escríbeme directamente a dev@adricode.com'
    ]);
    exit();
}

logDebug('✅ Email enviado correctamente');
logContact($name, $email, $clientIP);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Mensaje enviado correctamente'
]);

logDebug('Petición completada exitosamente');
logDebug('═══════════════════════════════════════════════════════════════');