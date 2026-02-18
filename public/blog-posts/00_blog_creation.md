---
title: Construyendo mi blog personal
category: Portfolio
author: adri
date_created: 2026-02-09
date_modified: 2026-02-18
excerpt: Cómo monté el blog de mi web usando Markdown, React y una API sencilla en PHP, un viaje rápido por el desarrollo y pequeñas aventuras que he vivido.
---

Bienvenido, en este artículo explico cómo desarrollé un sistema de blog ligero y completamente controlable usando archivos Markdown, React en el frontend y PHP en el backend. Mi idea era tener un flujo simple y alejarme de los CMS. Algo fácil de mantener, de entender y versionable.

## Arquitectura general

No voy a mentir, me puse con el desarrollo del blog a la brava. Llegué incluso a crear la base de datos, sin embargo, tardé poco en volver a poner los pies sobre la tierra, recapacitar y asentar unas bases:

- Los posts se almacenarían como archivos `.md` ¡quiero aprender Markdown!
- El frontend renderiza mediante React (ya lo hará de alguna manera)
- El backend lleva comunicación en JSON
- No hay paneles de administración ni complejidades para montar la app

Al final, a la raíz de mi directorio `public/` añadí:

```
/blog-posts
  /images
  post1.md
  post2.md
/src
  /components
  /pages
/api
  blog/posts.php
  blog/post.php
```

## Markdown como fuente de verdad

Cada archivo Markdown contiene un frontmatter (metadata para archivos Markdown, básicamente) en YAML:

```md
---
title: El titulo de la entrada
category: Opinion
author: adri
date_created: 2026-01-20
excerpt: Un resumen corto del contenido
---
```

Gracias a este enfoque, cualquier editor sirve para desarrollar entradas, es versionable con Git, me permite añadir fechas de creación así como de modificación y otros atributos que quiera utilizar. ¡Edición directa! Sin panel de control, ni protocolos complicados, solo necesito acceso al servidor donde se alojan mis entradas.

## Frontend: React + Vite + react-router + react-markdown

La parte visible del blog viene de varias tecnologías. En un principio, React y Vite dieron pie a que naciera la página. Recuerdo un día, cuando ya tenía un proyecto que yo pensaba *'Joer, qué bueno'*. Me dice mi amigo Mario:

> ¿Por qué no utilizas react-router? Sí, sí, para renderizar componentes dinámicamente.

Ni idea de lo que me estaba hablando. Me puse manos a la obra e implementé React Router. Ahora mi archivo principal incluye:

```jsx
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent /> {/* Header + Sidebar + Footer */}
    </BrowserRouter>
  );
}
```

Con las rutas definidas así:

```jsx
<Routes>
  <Route path="/"           element={<Hero />} />
  <Route path="/projects"   element={<Projects />} />
  <Route path="/blog"       element={<BlogList />} />
  <Route path="/blog/:slug" element={<BlogPost />} />
</Routes>
```

Y con esto podía navegar por las entradas. Vale la pena recordar que `Route` no es un tag HTML *vanilla*, sino que sale del mismo react-router, así como el `BrowserRouter` que abarca todo el contenido.

### ¿Qué es un slug?

Como podéis ver, en el caso de una entrada concreta necesitamos algún identificador. Esto es el **slug**. El término viene del mundo del periodismo en papel: era el nombre informal que se le daba a una noticia durante su producción. La historia viajaba del reportero al editor y a las rotativas siempre referenciada por ese apodo, por ejemplo `kate-and-william`.

Con el tiempo saltó al mundo web. Sistemas como Django lo usan como parte de la URL: `www.miweb.com/archives/kate-and-william`. Incluso Stack Overflow los usa, con la curiosidad de que puedes cambiar el slug de la URL por cualquier cosa aleatoria y el enlace seguirá funcionando. Puedes leer más sobre su origen [aquí](https://stackoverflow.com/questions/4230846/what-is-the-etymology-of-slug-in-a-url/4230937#4230937).

Sea como fuere, cuando estamos *webeando* nos gusta mucho utilizar términos de nicho. En este sistema el slug es simplemente el nombre del archivo `.md` sin extensión.

### ReactMarkdown y syntax highlighting

Ya tenía todo el backend. Perfecto. Ahora toca hacer que un archivo `.md` se interprete y formatee automáticamente en todos los navegadores, dentro de una aplicación que en desarrollo ejecuta un servidor y en producción otro, y además compatible para todas las vistas. *Jajan't.*

Gracias a [Espen Hovlandsdal](https://espen.codes/) y su librería [react-markdown](https://github.com/remarkjs/react-markdown), interpretar Markdown en React es sorprendentemente directo. Y gracias a [conorhastings](https://github.com/conorhastings) y [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter), los bloques de código quedan con resaltado de sintaxis: puedo escribir `código bonito` en un momento, ¡gracias a Conor!

El componente de renderizado, con lo mínimo necesario:

```jsx
<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkBreaks]}
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    },
    img({ src, ...props }) {
      const imgSrc = src?.startsWith('http') ? src : `/blog-posts/images/${src}`;
      return <img {...props} src={imgSrc} loading="lazy" />;
    }
  }}
>
  {content}
</ReactMarkdown>
```

Lo que hace es detectar si un bloque de código tiene lenguaje especificado (` ```javascript `, ` ```php `...) y si es así lo pasa a `SyntaxHighlighter`. Si no, lo trata como código _inline_. Las imágenes las resuelve automáticamente: URL absoluta si empieza por `http`, ruta relativa al directorio de imágenes si no.

En la versión completa aparecen atributos como: `wrapLongLines`, `customStyle` y `codeTagProps`. He querido evitar que presenciéis una guerra. Hasta este momento no he conseguido evitar del todo los saltos de línea dentro de los bloques de código: si escribo una línea suficientemente larga, en lugar de poder deslizar horizontalmente vas a ver cómo salta a la siguiente. 

Prueba de ello:

```txt
Si esto no está ocurriendo...                                                             ¡ya estoy arreglado!
```

Los estilos del contenido los gestiona **Tailwind Typography**, un plugin de la comunidad que expone un conjunto de clases `prose` con las que todo el Markdown renderizado queda visualmente bonito con el resto de la web sin tener que escribir CSS custom para todo.

### Parseo del frontmatter

Para cada archivo, extraigo el bloque entre `---` con una regex _(una expresión regular, para capturar patrones en las cadenas de texto)_ y almaceno los metadatos de la entrada.
Si el post no tiene `excerpt` definido en el frontmatter, lo genero automáticamente con los primeros 200 caracteres del contenido:

```php
if (empty($metadata['excerpt'])) {
    $plainText = strip_tags($markdownContent);
    $metadata['excerpt'] = mb_substr($plainText, 0, 200);
    if (mb_strlen($plainText) > 200) {
        $metadata['excerpt'] .= '...'; // Añadimos 3 dots, que el contenido continua.
    }
}
```

### Paginación y respuesta

La paginación se resuelve con un `array_slice`. Las categorías se calculan siempre sobre el listado completo, independientemente de los filtros aplicados, para que el selector no desaparezca al filtrar:

```php
$limit  = 10;
$total  = count($posts);
...

echo json_encode([
    'success'    => true,
    'posts'      => array_values($paginatedPosts),
    'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'pages' => $pages],
    'categories' => array_values($categories)
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
```

### Posts individuales: seguridad y headers

El script `post.php` empieza validando el slug antes de tocar nada del sistema de archivos. Nada de fiarse del input del usuario:

```php
// Solo caracteres seguros
$slug = preg_replace('/[^a-z0-9-_]/', '', strtolower($slug));

$postFile = $postsDir . $slug . '.md';

if (!file_exists($postFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Post no encontrado']);
    exit;
}
```

Y los headers CORS se aplican comprobando el origen contra una lista blanca:

```php
$allowedOrigins = ['https://adricode.com', 'http://localhost:5173'];
if (in_array($_SERVER['HTTP_ORIGIN'] ?? '', $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
```

---

## ETags: la caché que se actualiza sola

Durante varios días cambié contenido en los posts y no lo veía reflejado en ningñun sitio. Modificaba fechas, ajustaba el texto, tocaba la estructura... nada. Refrescaba el navegador, limpiaba caché, revisaba el código.

Estaba convencido de que era un bug en el renderizado de Markdown, o quizás algo raro con las fechas, o el parser del frontmatter. Pasé horas debuggeando cosas que funcionaban perfectamente.

La realidad era mucho más simple: **tenía `VITE_API_URL` apuntando a producción**. En local estaba leyendo los posts del servidor remoto. Hasta que no hacía deploy... no veía nada nuevo.

Una tontería absoluta. Mi primer impulso fue añadir un botón de *"Refresh"* en la UI para forzar la recarga. Lo implementé, pero se sentía raro. Innecesario. Investigando llegué a los **ETags**.

El concepto es sencillo: el servidor genera un hash del recurso y lo manda en los headers de la respuesta. El navegador lo guarda. En la siguiente petición, lo manda de vuelta. El servidor compara: si el archivo no ha cambiado, responde `304 Not Modified` y el navegador usa su copia en caché. Si cambió, manda la versión nueva.

Para un post individual, el hash combina slug, fecha de modificación y tamaño del archivo:

```php
$lastModified = filemtime($postFile);
$etag         = md5($slug . $lastModified . filesize($postFile));

header('Cache-Control: public, must-revalidate, max-age=0');
header('ETag: "' . $etag . '"');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');
```

La comprobación:

```php
$ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH'])
    ? trim($_SERVER['HTTP_IF_NONE_MATCH'], '"')
    : '';

if ($ifNoneMatch === $etag) {
    http_response_code(304);
    exit; // El navegador usa la caché, no se manda nada
}
```

Para el listado, el hash se calcula sobre el archivo `.md` más recientemente modificado del directorio:

```php
$files        = glob($postsDir . '*.md');
$lastModified = 0;

foreach ($files as $file) {
    $mtime = filemtime($file);
    if ($mtime > $lastModified) $lastModified = $mtime;
}

$etag = md5('posts-list-' . $lastModified . count($files));
```

Así, si añado un post nuevo o modifico uno existente, el hash cambia automáticamente y el navegador descarga la lista actualizada. Si no ha cambiado nada, `304` y a otra cosa. Resultado: cero peticiones innecesarias, los cambios se reflejan solos y eliminé el botón de refresh por completo.

La complejidad con estas adiciones siempre nace del conjunto: ¿Entiendes y está bien el código de los ETags? Sí. ¿Funciona a la primera? No.

Día y medio perdido. ¡Nunca más me pasará! *ja ja ja...*

---

Este blog no es el más moderno ni el más complejo del mundo. Pero es fácil de mantener, fácil de mover y fácil de entender dentro de un tiempo. Cada problema que he ido encontrando me ha llevado a aprender algo que no tenía en el radar.

Y sobre todo, **me da ganas de escribir**, que era el objetivo principal.

---

<span class="signature">
*¡Que vaya bien por los códigos!*
*— adri*
</span>