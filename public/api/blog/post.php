<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['https://adricode.com', 'http://localhost:5173'];
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Slug requerido']);
    exit;
}

$slug = preg_replace('/[^a-z0-9-]/', '', strtolower($slug));
$postsDir = __DIR__ . '/../../blog-posts/';
$postFile = $postsDir . $slug . '.md';

if (!file_exists($postFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Post no encontrado']);
    exit;
}

$lastModified = filemtime($postFile);
$etag = md5($slug . $lastModified . filesize($postFile));

// Actualizamos mediante etag y cache, haciendo que el navegador no vuelva a descargar el post si no ha cambiado

header('Cache-Control: public, must-revalidate, max-age=0');
header('ETag: "' . $etag . '"');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');

$ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH'], '"') : '';
if ($ifNoneMatch === $etag) {
    http_response_code(304);
    exit;
}

$content = file_get_contents($postFile);
$metadata = [
    'title' => '',
    'category' => '',
    'author' => '',
    'date_created' => '',
    'created' => '',
    'date_modified' => '',
    'modified' => '',
    'excerpt' => ''
];

$markdownContent = $content;

if (preg_match('/^---\s*\n(.*?)\n---\s*\n(.*)/s', $content, $matches)) {
    foreach (explode("\n", $matches[1]) as $line) {
        if (strpos($line, ':') !== false) {
            list($key, $value) = explode(':', $line, 2);
            $key = trim(strtolower($key));
            $value = trim($value);
            if (isset($metadata[$key])) {
                $metadata[$key] = $value;
            }
        }
    }
    $markdownContent = $matches[2];
}

$createdDate = !empty($metadata['date_created']) ? $metadata['date_created'] : $metadata['created'];
$modifiedDate = !empty($metadata['date_modified']) ? $metadata['date_modified'] : $metadata['modified'];

$createdTimestamp = strtotime($createdDate) ?: $lastModified;
$modifiedTimestamp = !empty($modifiedDate) ? strtotime($modifiedDate) : null;

$post = [
    'slug' => $slug,
    'title' => $metadata['title'] ?: $slug,
    'category' => $metadata['category'],
    'author' => $metadata['author'],
    'date_created' => [
        'iso' => date('c', $createdTimestamp),
        'timestamp' => $createdTimestamp
    ],
    'content' => trim($markdownContent),
    'excerpt' => $metadata['excerpt'],
    'file_modified' => $lastModified
];

if ($modifiedTimestamp) {
    $post['date_modified'] = [
        'iso' => date('c', $modifiedTimestamp),
        'timestamp' => $modifiedTimestamp
    ];
}

echo json_encode([
    'success' => true,
    'post' => $post
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);