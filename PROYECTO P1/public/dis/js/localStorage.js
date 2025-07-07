function guardarDatosUsuario(){
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var fecha = document.getElementById("fechanacimiento").value;
    var departamento = document.getElementById("Departamento").value;
    var latitud = document.getElementById("latitud").value;
    var longitud = document.getElementById("longitud").value;

    // Tomar la imagen del canvas como base64
    var canvas = document.getElementById("foto_resultado");
    var foto = canvas.toDataURL("image/png");

    //guardar como objeto
    var perfil = {
        nombre,
        apellido,
        fecha,
        departamento,
        latitud,
        longitud,
        foto
    };

    localStorage.setItem("perfil_"+nombre+"_"+apellido, JSON.stringify(perfil));

    alert("¡Perfil guardado correctamente!");
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

    fila.innerHTML = `
        <td>${perfil.nombre}</td>
        <td>${perfil.apellido}</td>
        <td>${edad} años</td>
        <td>${perfil.departamento}</td>
        <td>${perfil.latitud}; ${perfil.longitud}</td>
        <td><img src="${perfil.foto}" width="100" style="border-radius: 10%; border: 1px solid #ccc;"></td>
        <td><button class="btn btn-outline-danger" onclick="eliminarUsuario('${clave}')">Eliminar</button></td>
    `;

    tabla.appendChild(fila);
    }
  }
}


function eliminarUsuario(clave) {
  if (confirm("¿Estás seguro de que querés eliminar este perfil?")) {
    localStorage.removeItem(clave);
    cargarPerfiles(); // Recargar lista
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarPerfiles);