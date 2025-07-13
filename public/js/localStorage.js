function guardarDatosUsuario() {
  var cedula = document.getElementById("cedula").value;
  var celular = document.getElementById("celular").value;
  var postal = document.getElementById("postal").value;
  var nombre = document.getElementById("nombre").value;
  var apellido = document.getElementById("apellido").value;
  var fecha = document.getElementById("fechanacimiento").value;
  var latitud = document.getElementById("latitud").value;
  var longitud = document.getElementById("longitud").value;

  var canvas = document.getElementById("foto_resultado");
  var foto = canvas.toDataURL("image/png");

  var perfil = {
    nombre,
    apellido,
    fecha,
    latitud,
    longitud,
    foto,
    cedula,
    celular,
    postal,
  };

  localStorage.setItem(
    "perfil_" + nombre + "_" + apellido,
    JSON.stringify(perfil)
  );

  agregarNotificacion(`Se ha creado el perfil de ${nombre} ${apellido}`);

  mostrarToast("¡Perfil creado exitosamente!");
}

function cargarPerfiles() {
  const tabla = document.getElementById("tabla-perfiles");
  if (!tabla) {
    console.error("No se encontró el tbody con id 'tabla-perfiles'");
    return;
  }

  tabla.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);

    if (clave.startsWith("perfil_")) {
      const perfil = JSON.parse(localStorage.getItem(clave));

      // Calcular edad a partir de la fecha de nacimiento
      const nacimiento = new Date(perfil.fecha);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      const fila = document.createElement("tr");
      fila.classList.add("fila-perfil");
      fila.innerHTML = `
  <td>${perfil.cedula}</td>
  <td>${perfil.nombre}</td>
  <td>${perfil.apellido}</td>
  <td>${edad} años</td>
  <td>${perfil.celular}</td>
  <td>${perfil.postal}</td>
  <td>${perfil.latitud}; ${perfil.longitud}</td>
  <td><img src="${perfil.foto}" class="foto-perfil"></td>
  <td><button class="btn-eliminar" onclick="eliminarUsuario('${clave}')">Eliminar</button></td>
`;

      document.getElementById("tabla-perfiles").appendChild(fila);
    }
  }
}

function eliminarUsuario(clave) {
  localStorage.removeItem(clave);

  agregarNotificacion(`Se ha Borrado el usuario ${clave}`);

  mostrarToast("<p style='color: red;'>¡Perfil Borrado exitosamente!</p>");

  cargarPerfiles();
}

function guardarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim();
  const tipo = document.getElementById("tipoProducto").value.toLowerCase();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const descripcion = document
    .getElementById("descripcionProducto")
    .value.trim();
  const archivoImagen = document.getElementById("imagenProducto").files[0];

  if (!archivoImagen) {
    alert("Por favor selecciona una imagen.");
    return;
  }

  const lector = new FileReader();
  lector.onload = function (e) {
    const imagenBase64 = e.target.result;

    const producto = {
      name: nombre,
      type: tipo,
      price: precio,
      description: descripcion,
      image: imagenBase64,
    };

    const key = "productos_" + tipo;
    let productosGuardados = JSON.parse(localStorage.getItem(key)) || [];
    productosGuardados.push(producto);
    localStorage.setItem(key, JSON.stringify(productosGuardados));

    agregarNotificacion(`Se ha creado el producto ${nombre} exitosamente!`);

    mostrarToast("Preducto Creado exitosamente!");
    document.getElementById("form-producto").reset();
  };

  lector.readAsDataURL(archivoImagen);
}

function cargarProductosDesdeLocalStorage(tipo, containerId) {
  const productos = JSON.parse(localStorage.getItem("productos_" + tipo)) || [];
  const contenedor = document.getElementById(containerId);
  contenedor.innerHTML = "";

  productos.forEach((producto, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
  <div class="card h-100 shadow-lg rounded-4 border-0"
       style="background: var(--color-primeriocard); color: var(--color-sesion-texto);">
    <img src="${producto.image}" class="card-img-top rounded-top-4" 
         alt="${producto.name}" style="height: 200px; object-fit: cover;
         border: 3px solid var(--color-lineas2);">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title fw-bold mb-2 text-center">${producto.name}</h5>
      <p class="fw-semibold text-center mb-3">Precio: $${producto.price}</p>
      <div class="d-grid mt-auto">
       <button class="btn btn-danger btn-sm eliminar-producto"
        data-type="${producto.type}" 
        data-name="${producto.name}">
  Eliminar
</button>

        <button class="btn btn-sm ver-mas"
                style="background: var(--color-fondocont2); color: var(--color-texto); border: none;"
                onmouseover="this.style.background='var(--color-hover)'"
                onmouseout="this.style.background='var(--color-fondocont2)'"
                data-product='${JSON.stringify(producto)}'>
          Ver más
        </button>
   

      </div>
    </div>
  </div>
`;

    contenedor.appendChild(card);
  });

  document.querySelectorAll(".ver-mas").forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = JSON.parse(btn.getAttribute("data-product"));
      openProductModal(producto);
    });
  });

  document.querySelectorAll(".eliminar-producto").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-type");
      const nombre = btn.getAttribute("data-name");
      eliminarProducto(tipo, nombre);
    });
  });
}

function openProductModal(producto) {
  try {
    const modalElement = document.getElementById("productModal");

    // Limpieza previa
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style = "";

    // Verifica que los datos existan
    if (
      !producto ||
      !producto.name ||
      !producto.image ||
      !producto.description
    ) {
      alert("Producto inválido. No se puede mostrar.");
      return;
    }

    // Asignación segura
    document.getElementById("modalImage").src = producto.image;
    document.getElementById("productModalLabel").textContent = producto.name;
    document.getElementById("modalDescription").textContent =
      producto.description;
    document.getElementById("modalPrice").textContent = "$" + producto.price;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  } catch (err) {
    console.error("Error al abrir el modal:", err);
    alert("No se pudo abrir el modal.");
  }
}

function eliminarProducto(tipo, nombre) {
  const key = "productos_" + tipo;
  let productos = JSON.parse(localStorage.getItem(key)) || [];

  // Filtrar todos los que no coincidan con el nombre (eliminamos el que sí coincide)
  const nuevosProductos = productos.filter((p) => p.name !== nombre);

  localStorage.setItem(key, JSON.stringify(nuevosProductos));

  agregarNotificacion(`Se ha borrado el producto ${nombre} exitosamente!`);

  mostrarToast("<p style='color: red;'>!Producto Borrado exitosamente!</p>");

  cargarProductosDesdeLocalStorage(tipo, tipo + '_tabla');
}

// Note: cargarPerfiles() is now called directly in the HTML pages that need it
// instead of globally on every page load
