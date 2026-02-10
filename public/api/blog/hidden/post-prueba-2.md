---
title: Primeros pasos con React Hooks
category: Frontend
author: adri
created: 2024-11-15 14:20:00
modified: 2024-11-16 09:30:00
excerpt: Descubriendo useState y useEffect en mis primeros proyectos con React.
---

# Primeros pasos con React Hooks

Después de trabajar un tiempo con class components, finalmente me he pasado a los hooks y la diferencia es notable.

## useState: simplicidad ante todo

El manejo de estado se vuelve mucho más directo:

```javascript
const [count, setCount] = useState(0);
```

## useEffect: el ciclo de vida reinventado

Ya no necesito recordar componentDidMount, componentDidUpdate y componentWillUnmount por separado.

```javascript
useEffect(() => {
  document.title = `Clicks: ${count}`;
}, [count]);
```

## Conclusión

Los hooks hacen el código más limpio y reutilizable. No hay vuelta atrás.