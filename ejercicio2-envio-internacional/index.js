/**
 * Ejercicio 2 
 */

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Datos
// Tarifas de envío internacional
const TARIFAS_POR_PAIS = {
  elsalvador: 1.5,
  guatemala: 2.0,
  honduras: 2.25,
  nicaragua: 2.5,
  costarica: 3.0,
  panama: 3.5,
};

// Equivalencia de las claves para imprimir de forma bonis
const NOMBRES_PAISES = {
  elsalvador: 'El Salvador',
  guatemala: 'Guatemala',
  honduras: 'Honduras',
  nicaragua: 'Nicaragua',
  costarica: 'Costa Rica',
  panama: 'Panamá',
};

const PESO_LIMITE_DESCUENTO = 20; // si el peso es mayor, aplica descuento
const PORCENTAJE_DESCUENTO = 0.1; // 10%
const PESO_LIMITE_RECARGO = 1; // si el peso es menor, aplica recargo
const RECARGO_FIJO = 5.0; 

// Funciones
//normalizar
function normalizarPais(pais) {
  return String(pais)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/\s+/g, '') 
    .toLowerCase();
}

//Validar datos
function validarDatosEnvio({ pais, peso }) {
  if (!pais || typeof pais !== 'string' || pais.trim() === '') {
    return { valido: false, error: 'Debe indicar un país de destino' };
  }

  if (peso === undefined || peso === null || peso === '') {
    return { valido: false, error: 'Debe indicar el peso del paquete' };
  }

  const pesoNumerico = Number(peso); 

  if (Number.isNaN(pesoNumerico)) {  
    return { valido: false, error: 'El peso debe ser un número' };
  }

  if (pesoNumerico <= 0) {           
    return { valido: false, error: 'El peso debe ser mayor a 0' };
  }

  const paisNormalizado = normalizarPais(pais);
  if (!TARIFAS_POR_PAIS.hasOwnProperty(paisNormalizado)) {
    return {
      valido: false,
      error: `País no soportado: ${pais}. Países disponibles: ${Object.values(NOMBRES_PAISES).join(', ')}`,
    };
  }

  return { valido: true, paisNormalizado, peso: pesoNumerico };
}

//Calcula el costo de envío para un país y peso ya validados.
function calcularCostoEnvio(paisNormalizado, peso) {
  const tarifaPorKg = TARIFAS_POR_PAIS[paisNormalizado];
  let costo = peso * tarifaPorKg;

  let descuentoAplicado = false;
  let recargoAplicado = false;

  // Descuento por envíos pesados
  if (peso > PESO_LIMITE_DESCUENTO) {
    costo = costo * (1 - PORCENTAJE_DESCUENTO);
    descuentoAplicado = true;
  }

  // Recargo por envíos muy livianos
  if (peso < PESO_LIMITE_RECARGO) {
    costo = costo + RECARGO_FIJO;
    recargoAplicado = true;
  }

  return {
    pais: NOMBRES_PAISES[paisNormalizado],
    peso,
    tarifaPorKg,
    descuentoAplicado,
    recargoAplicado,
    costoTotal: Number(costo.toFixed(2)),
  };
}

// Rutas
app.post('/api/envio', (req, res) => {
  try {
    const { pais, peso } = req.body || {};

    const validacion = validarDatosEnvio({ pais, peso });
    
    
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error });
    }

    const resultado = calcularCostoEnvio(validacion.paisNormalizado, validacion.peso);
    res.json(resultado);
  } catch (error) {
    console.error('Error en /api/envio:', error);
    res.status(500).json({ error: 'Ocurrió un error inesperado al calcular el envío' });
  }
});

// Lista de países permitidos
app.get('/api/paises', (req, res) => {
  try {
    res.json({ paises: Object.values(NOMBRES_PAISES) });
  } catch (error) {
    console.error('Error en /api/paises:', error);
    res.status(500).json({ error: 'Ocurrió un error inesperado' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`API de envíos internacionales corriendo en http://localhost:${PORT}`);
});

