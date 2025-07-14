// =================== VARIABLES ===================
let facturaSeleccionada = null;

// =================== CARGAR FACTURAS ===================
function cargarFacturas() {
  const select = document.getElementById("factura-select");
  select.innerHTML = '<option value="">-- Selecciona una factura --</option>';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("factura_")) {
      const factura = JSON.parse(localStorage.getItem(key));
      const cliente = factura.cliente;
      const fecha = factura.fecha;
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `${factura.numero} - ${cliente.nombre} ${cliente.apellido} - ${fecha}`;
      select.appendChild(option);
    }
  }
}
function mostrarFacturaSeleccionada() {
  const clave = document.getElementById("factura-select").value;
  const contenedor = document.getElementById("factura-detalle");

  if (!clave) {
    contenedor.style.display = "none";
    facturaSeleccionada = null;
    return;
  }

  const factura = JSON.parse(localStorage.getItem(clave));
  facturaSeleccionada = factura;

  const cliente = factura.cliente;

  // Mostrar datos del cliente
  document.getElementById("nombre-cliente").textContent = cliente.nombre;
  document.getElementById("apellido-cliente").textContent = cliente.apellido;
  document.getElementById("cedula-cliente").textContent = cliente.cedula;
  document.getElementById("celular-cliente").textContent = cliente.celular;

  // Mostrar info factura
  document.getElementById("id-factura").textContent = factura.numero;
  document.getElementById("fecha-factura").textContent = factura.fecha;

  // Mostrar productos
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";
  factura.productos.forEach(item => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.producto.name}</td>
      <td>${item.producto.description}</td>
      <td>$${item.producto.price.toFixed(2)}</td>
      <td>${item.cantidad}</td>
      <td>$${item.subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(fila);
  });

  // Totales
  document.getElementById("subtotal").textContent = factura.subtotal.toFixed(2);
  document.getElementById("iva").textContent = factura.iva.toFixed(2);
  document.getElementById("total").textContent = factura.total.toFixed(2);

  contenedor.style.display = "block";
}

function descargarFacturaPDF() {
  if (!facturaSeleccionada) {
    alert("No hay ninguna factura cargada.");
    return;
  }

  const cliente = facturaSeleccionada.cliente;
  const nombreArchivo = `${facturaSeleccionada.numero} - ${cliente.nombre} ${cliente.apellido} - ${facturaSeleccionada.fecha}.pdf`;

  const elementoOriginal = document.querySelector(".factura-card");

  if (!elementoOriginal) {
    alert("No se encontró el elemento de la factura para exportar.");
    return;
  }

  // Clonar el contenido a imprimir
  const clon = elementoOriginal.cloneNode(true);

  // Quitar botones del clon
  clon.querySelectorAll("button, a").forEach(el => el.remove());

  // Opcional: aplicar estilos simples para asegurar legibilidad en PDF
  clon.style.fontSize = "14px";
  clon.style.backgroundColor = "#fff";
  clon.style.position = "absolute";
  clon.style.left = "-9999px";
  clon.style.top = "0";
  clon.style.width = "210mm";  // tamaño A4
  clon.style.padding = "20px";

  // Insertar el clon al DOM temporalmente
  document.body.appendChild(clon);

  // Esperar un pequeño tiempo para asegurar que el DOM esté listo
  setTimeout(() => {
    html2pdf()
      .set({
        filename: nombreArchivo,
        margin: 10,
        jsPDF: { format: 'a4' },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true
        }
      })
      .from(clon)
      .save()
      .then(() => {
        document.body.removeChild(clon);
        console.log("Factura exportada correctamente.");
      })
      .catch(err => {
        console.error("Error al generar PDF:", err);
        alert("No se pudo generar el PDF. Intenta nuevamente.");
        document.body.removeChild(clon);
      });
  }, 300);
}


function eliminarFactura() {
  const clave = document.getElementById("factura-select").value;
  if (!clave || !facturaSeleccionada) return;

  const confirmado = confirm("¿Estás seguro de eliminar esta factura?");
  if (confirmado) {
    localStorage.removeItem(clave);
    alert("Factura eliminada.");
    facturaSeleccionada = null;
    document.getElementById("factura-detalle").style.display = "none";
    cargarFacturas();
  }
}

