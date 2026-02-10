---
title: Mi experiencia migrando a TypeScript
category: Backend
author: adri
created: 2025-01-08 10:45:00
modified: 2025-01-08 10:45:00
excerpt: Por qué TypeScript cambió mi forma de desarrollar en Node.js y los dolores de cabeza iniciales.
---

# Mi experiencia migrando a TypeScript

Llevaba años escuchando sobre TypeScript pero siempre lo veía como "JavaScript con pasos extra". Spoiler: estaba equivocado.

## El inicio: configuración y frustración

Los primeros días fueron duros. Entre tsconfig.json, tipos de librerías de terceros y errores que antes "funcionaban"... casi tiro la toalla.

```typescript
// Antes (JS)
function getUserData(id) {
  return fetch(`/api/users/${id}`);
}

// Ahora (TS)
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUserData(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## El momento "click"

A la tercera semana, un bug que me hubiera costado horas debuggear fue detectado en tiempo de compilación. Ahí entendí el valor real.

## ¿Vale la pena?

Absolutamente. El autocompletado, la refactorización segura y atrapar errores antes del runtime hacen que el esfuerzo inicial valga totalmente la pena.

**Consejo**: no intentes tipar todo desde el inicio. Ve migrando gradualmente y aprende sobre la marcha.