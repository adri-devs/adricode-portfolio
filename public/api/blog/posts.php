<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Permitir CORS solo para dominios específicos y métodos GET/OPTIONS

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

$postsDir = __DIR__ . '/../../blog-posts/';

if (!is_dir($postsDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Directorio de posts no encontrado']);
    exit;
}

$files = glob($postsDir . '*.md');
$lastModified = 0;
foreach ($files as $file) {
    $mtime = filemtime($file);
    if ($mtime > $lastModified) {
        $lastModified = $mtime;
    }
}

$etag = md5(serialize(array_map('basename', $files)) . $lastModified);

header('Cache-Control: public, must-revalidate, max-age=0');
header('ETag: "' . $etag . '"');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');

$ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH'], '"') : '';
if ($ifNoneMatch === $etag) {
    http_response_code(304);
    exit;
}

$posts = [];

foreach ($files as $file) {
    $content = file_get_contents($file);
    $metadata = [
        'title' => '',
        'category' => '',
        'author' => '',
        'date_created' => '',
        'created' => '',
        'excerpt' => ''
    ];

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
    } else {
        $markdownContent = $content;
    }

    $slug = basename($file, '.md');

    if (empty($metadata['excerpt'])) {
        $plainText = strip_tags($markdownContent);
        $metadata['excerpt'] = mb_substr($plainText, 0, 200);
        if (mb_strlen($plainText) > 200) {
            $metadata['excerpt'] .= '...';
        }
    }

    $dateCreated = !empty($metadata['date_created']) ? $metadata['date_created'] : $metadata['created'];

    $posts[] = [
        'slug' => $slug,
        'title' => $metadata['title'] ?: $slug,
        'category' => $metadata['category'],
        'author' => $metadata['author'],
        'date_created' => $dateCreated,
        'excerpt' => $metadata['excerpt']
    ];
}

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$order = isset($_GET['order']) && strtolower($_GET['order']) === 'asc' ? 'asc' : 'desc';

if (!empty($search)) {
    $posts = array_filter($posts, function($post) use ($search) {
        return stripos($post['title'], $search) !== false ||
               stripos($post['excerpt'], $search) !== false ||
               stripos($post['category'], $search) !== false;
    });
}

if (!empty($category)) {
    $posts = array_filter($posts, function($post) use ($category) {
        return strcasecmp($post['category'], $category) === 0;
    });
}

usort($posts, function($a, $b) use ($order) {
    $dateA = strtotime($a['date_created']);
    $dateB = strtotime($b['date_created']);
    return $order === 'asc' ? ($dateA - $dateB) : ($dateB - $dateA);
});


// Antes al filtrar se actualizaban las categorías,
// se ha cambiado para que se muestren siempre todas las categorías, 
//  independientemente de los filtros aplicados

$categories = array_unique(array_filter(array_column($posts, 'category')));
sort($categories);

$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = 10;
$total = count($posts);
$pages = ceil($total / $limit);
$offset = ($page - 1) * $limit;

$paginatedPosts = array_slice($posts, $offset, $limit);

echo json_encode([
    'success' => true,
    'posts' => array_values($paginatedPosts),
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'pages' => $pages
    ],
    'categories' => array_values($categories)
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);