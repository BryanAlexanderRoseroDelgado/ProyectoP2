function cambiarTema(arg) {
  const tema = arg.value;

  if (tema === "tema-oscuro") {
    document.body.classList.add("modo-oscuro");
  } else {
    document.body.classList.remove("modo-oscuro");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".hamburger-toggle");

  if (btn) {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  }
});


function saltarPaso(boton) {
    const currentSection = boton.closest(".section");
    const currentSectionIndex = Array.from(currentSection.parentElement.children).indexOf(currentSection);
    const headerSteps = document.querySelectorAll('.steps li');

    // Validar campos requeridos en esta sección
    const inputs = currentSection.querySelectorAll("input, select, textarea");
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return; // si falla la validación, no avanza
        }
    }

    // Avanzar al siguiente paso
    const nextSection = currentSection.nextElementSibling;
    if (nextSection && nextSection.classList.contains("section")) {
        currentSection.classList.remove("is-active");
        nextSection.classList.add("is-active");

        // Actualizar los pasos (headers)
        if (headerSteps[currentSectionIndex]) {
            headerSteps[currentSectionIndex].classList.remove("is-active");
        }
        if (headerSteps[currentSectionIndex + 1]) {
            headerSteps[currentSectionIndex + 1].classList.add("is-active");
        }
    }
}


function reiniciarPasos() {
    const secciones = document.querySelectorAll(".section");
    const pasos = document.querySelectorAll(".steps li");

    secciones.forEach(sec => sec.classList.remove("is-active"));
    pasos.forEach(paso => paso.classList.remove("is-active"));

    secciones[0].classList.add("is-active");
    pasos[0].classList.add("is-active");
}



function mostrarToast(mensaje, tipo = 'success') {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${tipo} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;

  container.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", () => toast.remove());
}


let cantidadNotificaciones = 0;

function agregarNotificacion(texto) {
  const notiList = document.getElementById("notiList");
  const notiBadge = document.getElementById("notiBadge");

  // Crear nuevo ítem
  const item = document.createElement("li");
  const fecha = new Date().toLocaleTimeString();

  item.innerHTML = `<div>${texto}<br><small>${fecha}</small></div>`;

  // Insertar al inicio
  notiList.insertBefore(item, notiList.children[1]); // después del header

  // Actualizar contador
  cantidadNotificaciones++;
  notiBadge.textContent = cantidadNotificaciones;
  notiBadge.style.display = "inline-block";
}

// Cuando se abre la campana, limpiar badge
document.getElementById("notiButton").addEventListener("click", () => {
  cantidadNotificaciones = 0;
  document.getElementById("notiBadge").style.display = "none";
});



document.querySelector('#contenido').classList.add('fade-in');