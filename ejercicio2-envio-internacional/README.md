# Ejercicio 2 ·

## Cómo correrla

```bash
npm install
npm start
```

Queda escuchando en **http://localhost:3002** 

  ## Ejemplos

  ```bash
  curl -X POST http://localhost:3002/api/envio \
    -H "Content-Type: application/json" \
    -d '{"pais":"elsalvador","peso":10}'
    
  curl -X POST http://localhost:3002/api/envio \
    -H "Content-Type: application/json" \
    -d '{"pais":"Costa Rica","peso":25}'

  curl -X POST http://localhost:3002/api/envio \
    -H "Content-Type: application/json" \
    -d '{"pais":"panama","peso":0.5}'

  curl -X POST http://localhost:3002/api/envio \
    -H "Content-Type: application/json" \
    -d '{"pais":"mexico","peso":5}'
  ```