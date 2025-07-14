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

async function descargarFacturaPDF() {
  if (!facturaSeleccionada) {
    alert("No hay ninguna factura cargada.");
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  const cliente = facturaSeleccionada.cliente;
  const nombreArchivo = `${facturaSeleccionada.numero} - ${cliente.nombre} ${cliente.apellido} - ${facturaSeleccionada.fecha}.pdf`;

  let y = 10;

  doc.setFontSize(16);
  doc.text(`Factura N° ${facturaSeleccionada.numero}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Fecha: ${facturaSeleccionada.fecha}`, 10, y); y += 7;
  doc.text(`Cliente: ${cliente.nombre} ${cliente.apellido}`, 10, y); y += 7;
  doc.text(`Cédula: ${cliente.cedula}`, 10, y); y += 7;
  doc.text(`Celular: ${cliente.celular}`, 10, y); y += 10;

  doc.text("Productos:", 10, y); y += 7;

  // Encabezados de tabla
  doc.setFont(undefined, "bold");
  doc.text("Nombre", 10, y);
  doc.text("Descripción", 50, y);
  doc.text("Precio", 110, y);
  doc.text("Cant.", 140, y);
  doc.text("Subtotal", 160, y);
  doc.setFont(undefined, "normal");
  y += 6;

  facturaSeleccionada.productos.forEach(item => {
    doc.text(item.producto.name, 10, y);
    doc.text(item.producto.description, 50, y);
    doc.text(`$${item.producto.price.toFixed(2)}`, 110, y);
    doc.text(`${item.cantidad}`, 140, y);
    doc.text(`$${item.subtotal.toFixed(2)}`, 160, y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.setFont(undefined, "bold");
  doc.text(`Subtotal: $${facturaSeleccionada.subtotal.toFixed(2)}`, 130, y); y += 7;
  doc.text(`IVA: $${facturaSeleccionada.iva.toFixed(2)}`, 130, y); y += 7;
  doc.text(`Total: $${facturaSeleccionada.total.toFixed(2)}`, 130, y);

  doc.save(nombreArchivo);
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

