function cambiarTema(arg) {
  const tema = arg.value;

  if (tema === "tema-oscuro") {
    document.body.classList.add("modo-oscuro");
    localStorage.setItem("tema", "oscuro");
  } else {
    document.body.classList.remove("modo-oscuro");
    localStorage.setItem("tema", "claro");
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
  const currentSectionIndex = Array.from(
    currentSection.parentElement.children
  ).indexOf(currentSection);
  const headerSteps = document.querySelectorAll(".steps li");

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

  secciones.forEach((sec) => sec.classList.remove("is-active"));
  pasos.forEach((paso) => paso.classList.remove("is-active"));

  secciones[0].classList.add("is-active");
  pasos[0].classList.add("is-active");
}

function mostrarToast(mensaje, tipo = "success") {
  if (!notificacionesActivas()) return;

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
  if (!notificacionesActivas()) return;

  const notiList = document.getElementById("notiList");
  const notiBadge = document.getElementById("notiBadge");

  const item = document.createElement("li");
  const fecha = new Date().toLocaleTimeString();

  item.innerHTML = `<div>${texto}<br><small>${fecha}</small></div>`;
  notiList.insertBefore(item, notiList.children[1]);

  cantidadNotificaciones++;
  notiBadge.textContent = cantidadNotificaciones;
  notiBadge.style.display = "inline-block";
}

// Cuando se abre la campana, limpiar badge
document.getElementById("notiButton").addEventListener("click", () => {
  cantidadNotificaciones = 0;
  document.getElementById("notiBadge").style.display = "none";
});

// Guardar selección al cambiar
function configurarNotificaciones() {
  const valor = document.getElementById("notificaciones-seleccion").value;
  localStorage.setItem("notificaciones", valor);
}

// Comprobar si están activadas
function notificacionesActivas() {
  return localStorage.getItem("notificaciones") !== "desactivadas";
}

document.addEventListener("DOMContentLoaded", () => {
  const valorGuardado = localStorage.getItem("notificaciones") || "activadas";
  const select = document.getElementById("notificaciones-seleccion");
  if (select) select.value = valorGuardado;

  const temaGuardado = localStorage.getItem("tema") || "claro";

  if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
    const select = document.getElementById("tema-seleccion");
    if (select) select.value = "tema-oscuro";
  }
});

document.querySelector("#contenido").classList.add("fade-in");

/* Apis */
function cambiarFuente(fuente) {
  document.body.style.fontFamily = fuente;
  localStorage.setItem("fuente", fuente);

  // Cargar fuente si no existe
  if (!document.getElementById("fuente-dinamica")) {
    const link = document.createElement("link");
    link.id = "fuente-dinamica";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  document.getElementById(
    "fuente-dinamica"
  ).href = `https://fonts.googleapis.com/css2?family=${fuente.replace(
    / /g,
    "+"
  )}&display=swap`;
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const fuente = localStorage.getItem("fuente");
  if (fuente) cambiarFuente(fuente);
});


function reproducirSonido(id = "sonidoClick") {
  if (localStorage.getItem("sonidos") === "off") return;

  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; 
    audio.play();
  }
}


function reproducirSonidonoti(id = "sonidoClicknoti") {
  if (localStorage.getItem("sonidos") === "off") return;

  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; 
    audio.play();
  }
}

function reproducirSonidoborrar(id = "sonidoClickborrar") {
  if (localStorage.getItem("sonidos") === "off") return;

  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; 
    audio.play();
  }
}

function reproducirSonidomov(id = "sonidoClickmov") {
  if (localStorage.getItem("sonidos") === "off") return;

  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; 
    audio.play();
  }
}

function configurarSonidos(valor) {
  localStorage.setItem("sonidos", valor);
}