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





function seleccionCarrera(arg) {
  console.log(arg.value);
  const respuesta = document.getElementById("respuestaSelect");
  const val = arg.value;

  switch (val) {
    case "Departamento de Ciencias de la Energía y Mecánica":
      respuesta.innerHTML = `<img src="https://www.unitec.mx/wp-content/uploads/2020/02/ingenieria-en-sistemas-computacionales.jpg" alt="Ingeniería en Sistemas Computacionales" width="300">`;
      break;
    case "Departamento de Ciencias de la Computación":
      respuesta.innerHTML = `<img src="https://isil.pe/blog/wp-content/uploads/2021/03/ingenieria-sistemas-informacion.jpg" alt="Ingeniería en Sistemas de Información" width="300">`;
      break;
    case "Departamento de Eléctrica, Electronica y Telecomunicaciones":
      respuesta.innerHTML = `<img src="https://www.galileo.edu/fisicc/files/2020/01/ingenieria-telecomunicaciones.jpg" alt="Ingeniería en Telecomunicaciones" width="300">`;
      break;
    case "Departamento de Ciencias de la Vida y de la Agricultura":
      respuesta.innerHTML = `<img src="https://fiqa.epn.edu.ec/images/ingenieria-agroindustrial.jpg" alt="Ingeniería Agroindustrial" width="300">`;
      break;
    case "Departamento de Ciencias Administrativas, Económicas y de Comercio":
      respuesta.innerHTML = `<img src="https://blog.up.edu.mx/hubfs/economia-contabilidad.jpg" alt="Economía y Contabilidad" width="300">`;
      break;
    case "Departamento de Ciencias de la Tierra y Construcción":
      respuesta.innerHTML = `<img src="https://facultadingenieria.uct.cl/wp-content/uploads/2020/03/ingenieria-civil-geologica.jpg" alt="Ingeniería Civil o Geología" width="300">`;
      break;
    case "Departamento de Ciencias Médicas":
      respuesta.innerHTML = `<img src="https://blog.uvm.mx/hubfs/enfermeria-vs-medicina.jpg" alt="Medicina o Enfermería" width="300">`;
      break;
    case "Departamento de Ciencias Humanas y Sociales":
      respuesta.innerHTML = `<img src="https://psicologiaymente.com/imgs/psicologia-social.jpg" alt="Psicología, Sociología o Comunicación" width="300">`;
      break;
    case "Departamento de Seguridad y Defensa":
      respuesta.innerHTML = `<img src="https://www.institucionfundetec.com/wp-content/uploads/2021/04/seguridad-integral.jpg" alt="Seguridad Integral o Gestión del Riesgo" width="300">`;
      break;
    default:
      respuesta.innerHTML = "Seleccione una carrera";
      respuesta.style.color = "black";
  }
}
