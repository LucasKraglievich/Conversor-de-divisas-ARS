// Objeto donde voy a guardar las cotizaciones que trae la API
let cotizaciones = {
  oficial: 0,
  blue: 0,
  crypto: 0
};

// Esta función llama a la API y guarda las cotizaciones
async function obtenerCotizaciones() {
  try {
    const respuesta = await fetch('https://dolarapi.com/v1/dolares');
    const datos = await respuesta.json();

    // Recorro los datos y guardo cada cotización según su nombre
    for (let i = 0; i < datos.length; i++) {
      const item = datos[i];

      if (item.casa === 'oficial') cotizaciones.oficial = item.venta;
      if (item.casa === 'blue')    cotizaciones.blue    = item.venta;
      if (item.casa === 'cripto')  cotizaciones.crypto  = item.venta;
    }

    // Muestro las cotizaciones en las tarjetas
    document.getElementById('rate-oficial').textContent = '$' + cotizaciones.oficial;
    document.getElementById('rate-blue').textContent    = '$' + cotizaciones.blue;
    document.getElementById('rate-crypto').textContent  = '$' + cotizaciones.crypto;

    // Muestro la hora de actualización
    const ahora = new Date();
    document.getElementById('update-time').textContent = 'Actualizado a las ' + ahora.toLocaleTimeString('es-AR');

  } catch (error) {
    console.log('Error al obtener cotizaciones:', error);
    document.getElementById('update-time').textContent = 'No se pudo conectar a la API';
  }
}

// Esta función hace la conversión cuando el usuario hace clic en Convertir
function convertir() {
  const monto  = parseFloat(document.getElementById('amount').value);
  const desde  = document.getElementById('from').value;
  const hasta  = document.getElementById('to').value;
  const tipo   = document.getElementById('tipo').value;

  // Valido que el monto sea un número válido
  if (isNaN(monto) || monto <= 0) {
    document.getElementById('resultado').textContent = 'Ingresá un monto válido';
    return;
  }

  // Obtengo la cotización seleccionada
  const cotizacion = cotizaciones[tipo];

  if (cotizacion === 0) {
    document.getElementById('resultado').textContent = 'Esperá que carguen las cotizaciones';
    return;
  }

  // Primero convierto todo a ARS, después a la moneda destino
  let montoEnARS = 0;

  if (desde === 'ARS') {
    montoEnARS = monto;
  } else if (desde === 'USD') {
    montoEnARS = monto * cotizacion;
  } else if (desde === 'BRL') {
    montoEnARS = (monto / 5.05) * cotizacion;
  } else if (desde === 'EUR') {
    montoEnARS = (monto / 0.92) * cotizacion;
  }

  let resultado = 0;

  if (hasta === 'ARS') {
    resultado = montoEnARS;
  } else if (hasta === 'USD') {
    resultado = montoEnARS / cotizacion;
  } else if (hasta === 'BRL') {
    resultado = (montoEnARS / cotizacion) * 5.05;
  } else if (hasta === 'EUR') {
    resultado = (montoEnARS / cotizacion) * 0.92;
  }

  // Redondeo a 2 decimales y muestro el resultado
  resultado = Math.round(resultado * 100) / 100;
  document.getElementById('resultado').textContent = monto + ' ' + desde + ' = ' + resultado + ' ' + hasta;
}

// Llamo a la función cuando carga la página
obtenerCotizaciones();
