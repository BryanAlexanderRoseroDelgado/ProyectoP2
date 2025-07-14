// Facturacion.js

// =================== VARIABLES GLOBALES ===================
let carrito = [];
let productosCargados = [];
let clienteSeleccionado = null;

// =================== CLIENTES ===================
function llenarDatosCliente() {
  const select = document.getElementById("cliente-select");
  const key = select.value;
  if (!key) return;

  const perfil = JSON.parse(localStorage.getItem(key));
  if (!perfil) return;

  clienteSeleccionado = perfil;
  document.getElementById("nombre-cliente").value = perfil.nombre;
  document.getElementById("apellido-cliente").value = perfil.apellido;
  document.getElementById("cedula-cliente").value = perfil.cedula;
  document.getElementById("celular-cliente").value = perfil.celular;
}

function cargarClientes() {
  const select = document.getElementById("cliente-select");
  select.innerHTML = '<option value="">-- Nuevo cliente --</option>';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("perfil_")) {
      const perfil = JSON.parse(localStorage.getItem(key));
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `${perfil.nombre} ${perfil.apellido}`;
      select.appendChild(option);
    }
  }
}

// =================== PRODUCTOS ===================
function cargarProductosPorTipo() {
  const tipo = document.getElementById("tipo-producto").value;
  const select = document.getElementById("producto-select");
  select.innerHTML = '<option value="">-- Selecciona un producto --</option>';
  productosCargados = [];

  if (!tipo) return;

  const productos = JSON.parse(localStorage.getItem("productos_" + tipo)) || [];
  productosCargados = productos;

  productos.forEach((producto, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = producto.name;
    select.appendChild(option);
  });

  document.getElementById("detalle-producto").style.display = "none";
}

function mostrarDetallesProducto() {
  const index = document.getElementById("producto-select").value;
  if (index === "") return;

  const producto = productosCargados[index];
  document.getElementById("descripcion-producto").textContent = producto.description;
  document.getElementById("precio-producto").textContent = producto.price.toFixed(2);
  document.getElementById("detalle-producto").style.display = "block";
}

// =================== CARRITO ===================
function agregarAlCarrito() {
  const index = document.getElementById("producto-select").value;
  const cantidad = parseInt(document.getElementById("cantidad-producto").value);

  if (index === "" || cantidad <= 0) return;

  const producto = productosCargados[index];
  const subtotal = producto.price * cantidad;

  carrito.push({ producto, cantidad, subtotal });
  renderizarCarrito();
  actualizarTotales();
}

function renderizarCarrito() {
  const tabla = document.getElementById("carrito-tabla");
  tabla.innerHTML = "";

  carrito.forEach((item, i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.producto.name}</td>
      <td>${item.producto.description}</td>
      <td>$${item.producto.price.toFixed(2)}</td>
      <td>${item.cantidad}</td>
      <td>$${item.subtotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${i})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
  actualizarTotales();
}

function actualizarTotales() {
  const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// =================== FACTURA ===================
function generarFactura() {
  if (!clienteSeleccionado || carrito.length === 0) {
    alert("Debe seleccionar un cliente y al menos un producto.");
    return;
  }

  const numero = generarNumeroFactura();
  const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  const factura = {
    numero,
    cliente: clienteSeleccionado,
    productos: carrito,
    subtotal,
    iva,
    total,
    fecha: new Date().toLocaleString()
  };

  localStorage.setItem("factura_" + numero, JSON.stringify(factura));
  alert("Factura generada exitosamente.\nNúmero: " + numero);
  limpiarFormularioCompleto();
}

function generarNumeroFactura() {
  return Math.floor(Math.random() * 10 ** 15).toString().padStart(15, "0");
}

// =================== MOSTRAR FACTURAS ===================
function cargarFacturasAlSelect() {
  const select = document.getElementById("factura-select");
  select.innerHTML = '<option value="">-- Selecciona una factura --</option>';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("factura_")) {
      const factura = JSON.parse(localStorage.getItem(key));
      const option = document.createElement("option");
      option.value = factura.numero;
      option.textContent = `${factura.numero} - ${factura.cliente.nombre} ${factura.cliente.apellido} - ${factura.fecha}`;
      select.appendChild(option);
    }
  }
}

function mostrarFacturaSeleccionada() {
  const id = document.getElementById("factura-select").value;
  const data = localStorage.getItem("factura_" + id);
  if (!data) return;
  const factura = JSON.parse(data);

  const contenedor = document.getElementById("factura-preview");
  contenedor.innerHTML = `
    <h5>Factura N.º ${factura.numero}</h5>
    <p><b>Fecha:</b> ${factura.fecha}</p>
    <p><b>Cliente:</b> ${factura.cliente.nombre} ${factura.cliente.apellido}</p>
    <hr>
    ${factura.productos.map(p => `
      <p>${p.producto.name} (${p.cantidad} × $${p.producto.price}) = $${p.subtotal.toFixed(2)}</p>
    `).join("")}
    <hr>
    <p><b>Subtotal:</b> $${factura.subtotal.toFixed(2)}</p>
    <p><b>IVA:</b> $${factura.iva.toFixed(2)}</p>
    <p><b>Total:</b> $${factura.total.toFixed(2)}</p>
  `;
}

function imprimirFactura() {
  const preview = document.getElementById("factura-preview");
  if (!preview.innerHTML.trim()) return;
  html2pdf().from(preview).save();
}

// =================== UTILIDADES ===================
function establecerFechaActual() {
  const ahora = new Date();
  const fechaFormateada = ahora.toLocaleString();
  document.getElementById("fecha-actual").value = fechaFormateada;
}

function limpiarFormularioCompleto() {
  document.querySelector("form").reset();
  carrito = [];
  productosCargados = [];
  clienteSeleccionado = null;
  renderizarCarrito();
  actualizarTotales();
  document.getElementById("detalle-producto").style.display = "none";
  establecerFechaActual();
}

// =================== REGISTRO DE PÁGINA ===================
if (typeof registerPageScript === "function") {
  registerPageScript("paginas_body/Facturas.html", () => {
    cargarClientes();
    establecerFechaActual();
  });
}


