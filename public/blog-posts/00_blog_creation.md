---
title: Construyendo mi blog personal
category: Portfolio
author: adri
date_created: 2026-02-09
excerpt: Cómo monté el blog de mi web usando Markdown, React y una API sencilla en PHP, un viaje rápido por el desarrollo y pequeñas aventuras que he vivido.
---
Tras varias semanas de desarrollo dedicado a mi web personal, decidí que quería tener ella misma un pequeño espacio donde poder escribir mis ideas y proyectos. Lo que quiero es compartir ideas, recopilar código y entretener un rato a quienes fueran los lectores. 

Podría haber usado WordPress, Ghost, o cualquier CMS moderno, incluso mi primer pensamiento fue: base de datos. Sin embargo, ¿realmente lo necesito?
Quería algo **sencillo, facil de controlar y mío**, algo que pudiese tocar después de 6 meses y fuese fácil entender de nuevo. Además, tenía la oportunidad de buscar tecnologías que no hubiese probado antes y aprender.

El planteamiento fue el siguiente:
- Los posts son archivos `.md` almacenados en servidor
- El frontend los renderiza con React e intérpretes de Markdown
- El backend utiliza JSON
- Nada de paneles de administración ni over-engineering.

---
## Diseñando el módulo Blog 
### Markdown como única fuente de verdad

Los posts viven como archivos `.md` en el servidor, cada uno con su frontmatter:

```md
---
title: Mi primer post
category: Desarrollo
author: adri
date_created: 2026-01-20
date_modified: YYYY-MM-DD
excerpt: Un resumen corto del contenido, esto es lo que se ve antes de entrar.
---
```
La estructura es simple, predecible y fácil de versionar. Me gusta este _approach_ porque puedo escribir en cualquier editor de texto, versionar los posts con git, e incluso conectarme por SSH y editar desde fuera si quiero. Sin bases de datos, sin dependencias raras.

### Frontend: React, Vite y un render de Markdown 'decente'

La web está montada con React + Vite. Estaba bastante contento con ello, tras tanto desarrollo en Laravel, Astro... Aún así, pensando que tenía un proyecto sólido, tras las primeras impresiones de mis amigos, Mario me dice:
> ¿Por qué no estás aprovechando React y cargas el contenido con un par de renders? -

No tenía ni idea de lo que me estaba hablando. Me documenté e integré react-router en mi aplicación. Para el apartado del blog, pensé primero en cómo accedería un usuario:

- `/blog` → listado de artículos
- `/blog/:slug` → post individual

Para renderizar el contenido uso **react-markdown** con soporte para GFM (un Markdown especial de GitHub que permite funcionalidades diferentes) y resaltado de código con **react-syntax-highlighter**. El componente (_otro día hablamos de componentes, definición y usos_) del post hace algo muy simple:

El componente del post hace tres cosas: pide el contenido a la API, renderiza el Markdown, y aplica estilos.

### Imágenes: no os perdáis
Esto me dio más problemas de los que esperaba. Quería que las rutas relativas funcionaran automáticamente, pero también quería poder usar URLs completas si era necesario. 
> Oye... He estado mirando tu blog y solo usas rutas relativas en las entradas. ¿Al final no aplicaste esto? -

Primero, prefiero alojar las imágenes en mi propio servidor. Segundo, si, está implementado y no lo uso, así me gusta sobrecomplicarme constantemente.

```javascript
img({ src, ...props }) {
  const imgSrc = src?.startsWith('http') ? src : `/blog-posts/images/${src}`;
  return <img {...props} src={imgSrc} loading="lazy" />;
}
```
Lo que hace es: si la URL empieza con `http`, la usa tal cual. Si no, asume que es una ruta relativa y la busca en `/blog-posts/images/`. El `loading="lazy"` hace que las imágenes solo se carguen cuando el usuario se acerca a verlas, lo cual ayuda con el rendimiento.

## Estilos: Tailwind Typography

Aquí viene la parte interesante: el problema con renderizar Markdown en React no es solo el renderizado en sí, sino mantener el formato. Tienes que leer el archivo de manera interna, parsearlo, devolverlo como HTML válido. No solo esto si no que tienes que asegurarte de que los estilos se mantengan coherentes con el resto de la web.

No quería estar escribiendo CSS custom para cada elemento: párrafos, listas, bloques de código, títulos pero si sentía que tenía que haber cierta personalización respecto a las entradas del blog... Tras buscar varias opciones, me decanté por el plugin `@tailwindcss/typography` de la comunidad.

Con un simple:

```html
prose prose-lg dark:prose-invert max-w-none
```

…todo el contenido Markdown queda bonito. ¿Es la solución más elegante del mundo? Quizás no. ¿Funciona de maravilla? Sí.

## Listado de posts: filtros, búsqueda y rendimiento

Quería un diseño de blog moderno, pero que se sintiera algo compacto. Este portfolio está en constante evolución y sé que me tendré que enfrentar a nuevos problemas en un futuro... Pero de momento, los rasgos más característicos del blog son:

- Búsqueda por texto
- Filtro por categoría
- Orden por fecha
- Paginación

Uso `URLSearchParams` para mantener el estado sincronizado con la URL. Esto significa que puedes compartir enlaces con filtros específicos **entre personas** y funcionan como esperas.

Al principio, si escribías una letra se disparaba una petición a la API. Horrible y sobretodo: inesperado por el usuario. Así que añadí un debounce:

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchPosts();
    }
  }, 100);

  return () => clearTimeout(timer);
}, [searchTerm, currentPage, selectedCategory, order]);
```

Básicamente espera 100ms después de que dejes de escribir antes de hacer la petición. Pequeño detalle, gran diferencia en UX.

Ah, y tuve que dividir la API. Antes tenía todo en _/api/config.php_, pero ahora necesitaba endpoints separados: _/api/blog/posts.php_ para el listado y _/api/blog/post.php_ para posts individuales. También tengo _/api/contact.php_ que no tiene nada que ver con el blog. Divide y vencerás, ya sabes.

## Backend: PHP simple, sin frameworks

La API está hecha con dos scripts PHP:

- `posts.php` → devuelve el listado filtado y paginado
- `post.php` → devuelve un post en específico

El backend hace lo mínimo necesario:
- Lee archivos `.md` del directorio
- Extrae el frontmatter usando regex
- Devuelve JSON
- Controla CORS y headers de seguridad

Simple, robusto, fácil de mantener

## El problema pequeño que me hizo perder tiempo grande

Durante días estuve cambiando contenido en los posts y no veía reflejados los cambios. Modificaba fechas, ajustaba el texto, tocaba la estructura... nada. Refrescaba el navegador, limpiaba caché, revisaba el código del componente. 

Estaba convencido de que era un bug en el renderizado de Markdown, o quizás algo raro con las fechas, o el parser de frontmatter. Pasé horas debuggeando cosas que funcionaban perfectamente.

La realidad era mucho más simple:

**Tenía `VITE_API_URL` apuntando a producción.**

En local estaba leyendo los posts del servidor remoto. Hasta que no hacía deploy… no veía nada nuevo.

Una tontería absoluta. Pero me llevó a mejorar varias cosas:
- Configuré mejor los entornos de desarrollo
- Añadí scripts para limpiar caché automáticamente
- Implementé un sistema mejor para detectar cambios en los posts, a continuación hablo de él.

Día y medio perdido, ¡nunca más me pasará! _ja ja ja..._

## ETags: la solución que no conocía

Después del desastre del `.env`, pensé en añadir un botón de **"Refresh"** en la UI para forzar la recarga de posts. Lo implementé, pero se sentía... raro. Innecesario.

Investigando mejores soluciones descubrí los ETags. Básicamente, el servidor genera un hash del archivo y lo envía en los headers _(otro dolor de cabeza...)_:

- Si el archivo no cambia, el navegador usa la versión cacheada
- Si el archivo cambia, el hash cambia y el navegador descarga la nueva versión automáticamente

Implementarlo no fue especialmente complejo, eliminó completamente la necesidad del botón de refresh. Menos código, mejor UX, todo más limpio. La complejidad con estas adiciones siempre nace del conjunto: ¿Entiendes y está bien el código de los ETags? Si. ¿Funciona? No.

## Conclusión

Este blog no es el más moderno ni el más complejo del mundo. Pero es:

- Fácil de mantener
- Fácil de mover
- Fácil de entender dentro de seis meses

Y sobre todo, **me da ganas de escribir**, que era el objetivo principal.

---

*¡Que vaya bien por los códigos!*  
*— adri*
