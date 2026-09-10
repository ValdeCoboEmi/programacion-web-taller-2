const express = require('express');
const app = express();
const port = 3000;

// Funcion para calcular el IVA
function calcularIVA(monto) {
  return monto * 0.13;
}

// Funcion para calcular la renta
function calcularRenta(monto) {
  return monto * 0.10;
}

// Declarar la ruta
app.get("/api/calcular/:monto", (req, res) => {
  try {
    const monto = Number(req.params.monto);

    // Validaciones
    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({
        error: "El monto debe de ser un numero mayor que 0"
      });
    }

    const iva = calcularIVA(monto);
    const renta = calcularRenta(monto);

    res.json({
      monto: monto,
      iva: iva,
      renta: renta
    });
  } catch {
    return res.status(500).json({
        error: "Ocurrio un error en el servidor"
      });
  }
});

// Se declara el port
app.listen(port, () => {
    console.log(`Servidor ejecutandose en http://localhost:${port}`);
});