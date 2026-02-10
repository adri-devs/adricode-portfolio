---
title: Optimizando queries con índices en PostgreSQL
category: Database
author: adri
created: 2024-09-22 16:00:00
modified: 2024-12-03 11:15:00
excerpt: Cómo pasé de queries lentas a respuestas instantáneas entendiendo los índices de PostgreSQL.
---

# Optimizando queries con índices en PostgreSQL

Tenía una tabla con 500k registros y las búsquedas tardaban segundos. Spoiler: la solución estaba en los índices.

## El problema

```sql
SELECT * FROM orders 
WHERE customer_id = 12345 
AND status = 'pending';
```

Esta query simple tardaba **2.3 segundos**. Inaceptable.

## Analizando con EXPLAIN

```sql
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE customer_id = 12345 
AND status = 'pending';
```

El resultado: **Seq Scan**. PostgreSQL estaba revisando cada fila una por una.

## La solución: índices compuestos

```sql
CREATE INDEX idx_orders_customer_status 
ON orders(customer_id, status);
```

Resultado: **23ms**. De 2.3 segundos a 23 milisegundos.

## Lecciones aprendidas

1. **EXPLAIN es tu amigo**: úsalo siempre antes de optimizar
2. **El orden importa**: en índices compuestos, pon primero la columna más selectiva
3. **No indices todo**: cada índice ocupa espacio y ralentiza los INSERT/UPDATE

## Actualización (diciembre 2024)

Después de meses en producción, descubrí que agregar un índice parcial mejoró aún más:

```sql
CREATE INDEX idx_orders_pending 
ON orders(customer_id) 
WHERE status = 'pending';
```

Queries específicas para pedidos pendientes ahora van a **8ms**.