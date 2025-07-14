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
  <td>
    <button class="btn-editar" onclick="editarUsuario('${clave}')" style="background-color: #ffc107; color: white; border: none; padding: 5px 10px; margin-right: 5px; border-radius: 4px;">Editar</button>
    <button class="btn-eliminar" onclick="eliminarUsuario('${clave}')">Eliminar</button>
  </td>
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

// NEW: Edit user functionality
function editarUsuario(clave) {
  const perfil = JSON.parse(localStorage.getItem(clave));
  if (!perfil) {
    alert("Usuario no encontrado");
    return;
  }

  // Store the profile data and original key for updating
  window.editingUserKey = clave;
  window.editingUserData = perfil;
  
  // Navigate to create page for editing
  if (typeof cargarContenido === 'function') {
    cargarContenido('paginas_body/Crear.html', 'contenido');
  } else if (typeof window.cargarContenido === 'function') {
    window.cargarContenido('paginas_body/Crear.html', 'contenido');
  } else {
    alert("Error: La función cargarContenido no está disponible");
    return;
  }
  
  // Fill form and update UI after page loads
  setTimeout(() => {
    try {
      // Fill the form with current user data
      const cedulaEl = document.getElementById("cedula");
      const celularEl = document.getElementById("celular");
      const postalEl = document.getElementById("postal");
      const nombreEl = document.getElementById("nombre");
      const apellidoEl = document.getElementById("apellido");
      const fechaEl = document.getElementById("fechanacimiento");
      const latitudEl = document.getElementById("latitud");
      const longitudEl = document.getElementById("longitud");

      if (!cedulaEl) {
        // Try again after a longer delay
        setTimeout(() => fillUserForm(perfil), 500);
        return;
      }

      fillUserForm(perfil);
      
    } catch (error) {
      alert("Error al cargar los datos del usuario para editar");
    }
  }, 1000);
}

// Helper function to fill user form
function fillUserForm(perfil) {
  try {
    // Fill the form with current user data
    document.getElementById("cedula").value = perfil.cedula;
    document.getElementById("celular").value = perfil.celular;
    document.getElementById("postal").value = perfil.postal;
    document.getElementById("nombre").value = perfil.nombre;
    document.getElementById("apellido").value = perfil.apellido;
    document.getElementById("fechanacimiento").value = perfil.fecha;
    document.getElementById("latitud").value = perfil.latitud;
    document.getElementById("longitud").value = perfil.longitud;

    // Store the photo data to display later when user navigates to Step 3
    window.editingUserPhoto = perfil.foto;

    // Set up photo display for when user reaches Step 3
    setupPhotoForEditing();
    
    // Update form to show it's in edit mode
    const submitBtn = document.querySelector('button[onclick="guardarDatosUsuario()"]');
    if (submitBtn) {
      submitBtn.textContent = "Actualizar Usuario";
      submitBtn.setAttribute('onclick', 'actualizarDatosUsuario()');
    }
    
    const formTitle = document.querySelector('h2');
    if (formTitle) {
      formTitle.textContent = "Editar Perfil Estudiantil";
    }
  } catch (error) {
    alert("Error al llenar el formulario con los datos del usuario");
  }
}

// Function to set up photo display for editing mode
function setupPhotoForEditing() {
  // Find all step navigation buttons and add event listeners
  const nextButtons = document.querySelectorAll('.btn-next');
  const stepButtons = document.querySelectorAll('.steps li');
  
  // Add click listeners to step buttons for direct navigation
  stepButtons.forEach((stepBtn, index) => {
    stepBtn.addEventListener('click', function() {
      navigateToStep(index);
      if (index === 2) { // Step 3 (photo step)
        displayStoredPhoto();
      }
    });
  });
  
  // Add listeners to next buttons to detect when reaching photo step
  nextButtons.forEach((btn) => {
    btn.addEventListener('click', function() {
      // Check if we're moving to the photo step
      setTimeout(() => {
        const activeStep = document.querySelector('fieldset.section.is-active');
        const allSteps = document.querySelectorAll('fieldset.section');
        const stepIndex = Array.from(allSteps).indexOf(activeStep);
        
        if (stepIndex === 2) { // Step 3 (photo step)
          displayStoredPhoto();
        }
      }, 100);
    });
  });
}

// Function to navigate to a specific step
function navigateToStep(stepIndex) {
  const allSteps = document.querySelectorAll('fieldset.section');
  const allStepButtons = document.querySelectorAll('.steps li');
  
  // Hide all steps and deactivate all step buttons
  allSteps.forEach((step, index) => {
    step.classList.remove('is-active');
    if (allStepButtons[index]) {
      allStepButtons[index].classList.remove('is-active');
    }
  });
  
  // Show target step and activate its button
  if (allSteps[stepIndex]) {
    allSteps[stepIndex].classList.add('is-active');
  }
  if (allStepButtons[stepIndex]) {
    allStepButtons[stepIndex].classList.add('is-active');
  }
}

// Function to display the stored photo when reaching Step 3
function displayStoredPhoto() {
  if (window.editingUserPhoto) {
    setTimeout(() => {
      const canvas = document.getElementById("foto_resultado");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.style.display = "block";
        };
        img.src = window.editingUserPhoto;
      }
    }, 100);
  }
}

function actualizarDatosUsuario() {
  if (!window.editingUserKey) {
    alert("Error: No se encontró el usuario a editar");
    return;
  }

  // Get form values with error checking
  const cedulaEl = document.getElementById("cedula");
  const celularEl = document.getElementById("celular");
  const postalEl = document.getElementById("postal");
  const nombreEl = document.getElementById("nombre");
  const apellidoEl = document.getElementById("apellido");
  const fechaEl = document.getElementById("fechanacimiento");
  const latitudEl = document.getElementById("latitud");
  const longitudEl = document.getElementById("longitud");
  const canvas = document.getElementById("foto_resultado");

  if (!cedulaEl || !celularEl || !postalEl || !nombreEl || !apellidoEl || !fechaEl || !latitudEl || !longitudEl || !canvas) {
    alert("Error: No se pudieron encontrar los elementos del formulario");
    return;
  }

  var cedula = cedulaEl.value;
  var celular = celularEl.value;
  var postal = postalEl.value;
  var nombre = nombreEl.value;
  var apellido = apellidoEl.value;
  var fecha = fechaEl.value;
  var latitud = latitudEl.value;
  var longitud = longitudEl.value;

  // Always get photo from canvas (it contains the existing or new photo)
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

  // Remove old entry
  localStorage.removeItem(window.editingUserKey);
  
  // Save updated entry
  const newKey = "perfil_" + nombre + "_" + apellido;
  localStorage.setItem(newKey, JSON.stringify(perfil));

  agregarNotificacion(`Se ha actualizado el perfil de ${nombre} ${apellido}`);
  mostrarToast("¡Perfil actualizado exitosamente!");
  
  // Clean up
  delete window.editingUserKey;
  delete window.editingUserData;
  delete window.editingUserPhoto;
  
  // Navigate back to view page
  cargarContenido('paginas_body/Ver.html', 'contenido');
}

function guardarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim();
  const tipo = document.getElementById("tipoProducto").value.toLowerCase();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const descripcion = document
    .getElementById("descripcionProducto")
    .value.trim();
  
  // Try to get image from canvas first (camera/uploaded image), then from file input
  let imagenBase64 = null;
  
  // Check if we have a canvas with an image (from camera or file upload)
  if (typeof getPhotoDataProducto === 'function') {
    const canvasData = getPhotoDataProducto();
    const canvas = document.getElementById("foto_resultado_producto");
    if (canvas && canvas.style.display !== 'none' && canvasData) {
      imagenBase64 = canvasData;
    }
  }
  
  // If no canvas image, try file input (fallback for direct file selection)
  const archivoImagen = document.getElementById("imagenProducto").files[0];
  
  if (!imagenBase64 && !archivoImagen) {
    alert("Por favor selecciona o toma una imagen.");
    return;
  }
  
  // Function to save the product
  function saveProduct(imageData) {
    const producto = {
      name: nombre,
      type: tipo,
      price: precio,
      description: descripcion,
      image: imageData,
    };

    const key = "productos_" + tipo;
    let productosGuardados = JSON.parse(localStorage.getItem(key)) || [];
    productosGuardados.push(producto);
    localStorage.setItem(key, JSON.stringify(productosGuardados));

    agregarNotificacion(`Se ha creado el producto ${nombre} exitosamente!`);
    mostrarToast("Producto Creado exitosamente!");
    
    // Reset form and photo
    document.getElementById("form-producto").reset();
    if (typeof resetFotoProducto === 'function') {
      resetFotoProducto();
    }
  }
  
  // If we have canvas data, use it directly
  if (imagenBase64) {
    saveProduct(imagenBase64);
  } 
  // Otherwise, read from file input
  else if (archivoImagen) {
    const lector = new FileReader();
    lector.onload = function (e) {
      saveProduct(e.target.result);
    };
    lector.readAsDataURL(archivoImagen);
  }
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
        <button class="btn btn-warning btn-sm editar-producto mb-2"
                data-type="${producto.type}" 
                data-name="${producto.name}">
          Editar
        </button>
        
        <button class="btn btn-danger btn-sm eliminar-producto mb-2"
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

  document.querySelectorAll(".editar-producto").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-type");
      const nombre = btn.getAttribute("data-name");
      editarProducto(tipo, nombre);
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

// NEW: Edit product functionality
function editarProducto(tipo, nombre) {
  const key = "productos_" + tipo;
  let productos = JSON.parse(localStorage.getItem(key)) || [];
  
  const producto = productos.find(p => p.name === nombre);
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  // Navigate to create product page
  cargarContenido('paginas_body/Crear_Pr.html', 'contenido');
  
  // Fill form with current product data after page loads
  setTimeout(() => {
    document.getElementById("nombreProducto").value = producto.name;
    document.getElementById("tipoProducto").value = producto.type;
    document.getElementById("precioProducto").value = producto.price;
    document.getElementById("descripcionProducto").value = producto.description;

    // Display the current product image
    if (producto.image) {
      const canvas = document.getElementById("foto_resultado_producto");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.style.display = "block";
        };
        img.src = producto.image;
      }
    }

    // Store original product info for updating
    window.editingProduct = { tipo, nombre: producto.name };
    
    // Update form to show it's in edit mode
    const submitBtn = document.querySelector('button[onclick="guardarProducto()"]');
    if (submitBtn) {
      submitBtn.textContent = "Actualizar Producto";
      submitBtn.setAttribute('onclick', 'actualizarProducto()');
    }
    
    const formTitle = document.querySelector('h2');
    if (formTitle) {
      formTitle.textContent = "Editar Producto";
    }
  }, 800);
}

function actualizarProducto() {
  if (!window.editingProduct) {
    alert("Error: No se encontró el producto a editar");
    return;
  }

  const nombre = document.getElementById("nombreProducto").value.trim();
  const tipo = document.getElementById("tipoProducto").value.toLowerCase();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const descripcion = document.getElementById("descripcionProducto").value.trim();
  
  // Get image (same logic as in guardarProducto)
  let imagenBase64 = null;
  
  if (typeof getPhotoDataProducto === 'function') {
    const canvasData = getPhotoDataProducto();
    const canvas = document.getElementById("foto_resultado_producto");
    if (canvas && canvas.style.display !== 'none' && canvasData) {
      imagenBase64 = canvasData;
    }
  }
  
  const archivoImagen = document.getElementById("imagenProducto").files[0];
  
  // If no new image provided, check if canvas has existing image
  if (!imagenBase64 && !archivoImagen) {
    const canvas = document.getElementById("foto_resultado_producto");
    if (canvas && canvas.style.display !== 'none') {
      // Use existing image from canvas
      imagenBase64 = canvas.toDataURL("image/png");
    } else {
      alert("Por favor selecciona o toma una imagen.");
      return;
    }
  }
  
  function updateProduct(imageData) {
    const productoActualizado = {
      name: nombre,
      type: tipo,
      price: precio,
      description: descripcion,
      image: imageData,
    };

    // Remove old product
    const oldKey = "productos_" + window.editingProduct.tipo;
    let productos = JSON.parse(localStorage.getItem(oldKey)) || [];
    productos = productos.filter(p => p.name !== window.editingProduct.nombre);
    localStorage.setItem(oldKey, JSON.stringify(productos));

    // Add updated product
    const newKey = "productos_" + tipo;
    let productosNuevos = JSON.parse(localStorage.getItem(newKey)) || [];
    productosNuevos.push(productoActualizado);
    localStorage.setItem(newKey, JSON.stringify(productosNuevos));

    agregarNotificacion(`Se ha actualizado el producto ${nombre} exitosamente!`);
    mostrarToast("Producto actualizado exitosamente!");
    
    // Clean up
    delete window.editingProduct;
    
    // Reset form and navigate back
    document.getElementById("form-producto").reset();
    if (typeof resetFotoProducto === 'function') {
      resetFotoProducto();
    }
    
    cargarContenido('paginas_body/Ver_Pr.html', 'contenido');
  }
  
  // Save with image
  if (imagenBase64) {
    updateProduct(imagenBase64);
  } else if (archivoImagen) {
    const lector = new FileReader();
    lector.onload = function (e) {
      updateProduct(e.target.result);
    };
    lector.readAsDataURL(archivoImagen);
  }
}

// Note: cargarPerfiles() is now called directly in the HTML pages that need it
// instead of globally on every page load
