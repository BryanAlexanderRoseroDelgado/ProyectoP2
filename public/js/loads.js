/* // Keep track of loaded external scripts to prevent multiple DOM additions
const loadedScripts = new Set();
const scriptElements = new Map(); 

function cargarContenido(pagina, id) {
    fetch(`${pagina}`)
        .then(res => res.text())
        .then(data => {
            const container = document.getElementById(id);
            container.innerHTML = data;
            // Ejecutar scripts embebidos en orden secuencial
            const scripts = container.querySelectorAll('script');
            executeScriptsInOrder(scripts);
            //console.log(data);
        })
        .catch(error => console.error(`Error loading ${pagina}:`, error));
}

// Function to execute scripts in sequential order
async function executeScriptsInOrder(scripts) {
    for (const oldScript of scripts) {
        await executeScript(oldScript);
        // Eliminar el script viejo del contenedor
        if (oldScript.parentNode) {
            oldScript.parentNode.removeChild(oldScript);
        }
    }
}

// Function to execute a single script and return a promise
function executeScript(oldScript) {
    return new Promise((resolve, reject) => {
        if (oldScript.src) {
            // External script
            if (!loadedScripts.has(oldScript.src)) {
                const newScript = document.createElement('script');
                newScript.src = oldScript.src;
                newScript.onload = () => {
                    loadedScripts.add(oldScript.src);
                    resolve();
                };
                newScript.onerror = () => {
                    console.error(`Error loading script: ${oldScript.src}`);
                    reject(new Error(`Failed to load script: ${oldScript.src}`));
                };
                // Add data attribute to identify our scripts
                newScript.setAttribute('data-dynamic-script', 'true');
                newScript.setAttribute('data-script-src', oldScript.src);
                document.body.appendChild(newScript);
                
                // Track the script element for potential cleanup
                scriptElements.set(oldScript.src, newScript);
            } else {
                // Script already loaded, resolve immediately
                resolve();
            }
        } else {
            // Inline script
            try {
                const newScript = document.createElement('script');
                newScript.text = oldScript.textContent;
                // Add data attribute to identify our scripts
                newScript.setAttribute('data-dynamic-script', 'true');
                newScript.setAttribute('data-inline-script', 'true');
                document.body.appendChild(newScript);
                
                // Remove inline script after execution
                setTimeout(() => {
                    if (newScript.parentNode) {
                        newScript.parentNode.removeChild(newScript);
                    }
                }, 100);
                
                resolve();
            } catch (error) {
                console.error('Error executing inline script:', error);
                reject(error);
            }
        }
    });
}

// Function to clean up all dynamic scripts (if needed)
function cleanupDynamicScripts() {
    const dynamicScripts = document.querySelectorAll('script[data-dynamic-script="true"]');
    dynamicScripts.forEach(script => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    });
    loadedScripts.clear();
    scriptElements.clear();
}

// Function to get current script count (for debugging)
function getScriptCount() {
    const allScripts = document.querySelectorAll('script');
    const dynamicScripts = document.querySelectorAll('script[data-dynamic-script="true"]');
    const externalScripts = document.querySelectorAll('script[data-script-src]');
    const inlineScripts = document.querySelectorAll('script[data-inline-script="true"]');
    
    return {
        total: allScripts.length,
        dynamic: dynamicScripts.length,
        external: externalScripts.length,
        inline: inlineScripts.length,
        loadedExternal: loadedScripts.size
    };
}

document.addEventListener("DOMContentLoaded", () => {
    cargarContenido('paginas_principal/header.html', 'header');
    cargarContenido('paginas_principal/body.html', 'body');
    cargarContenido('paginas_principal/footer.html', 'footer');
    cargarContenido('paginas_principal/sidebar.html', 'sidebar');

    // Por defecto carga la página de inicio
    cargarContenido('paginas_body/Casa.html', 'contenido');
});

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "admin") {
        // Redirección al index.html
        window.location.href = "./index.html";
    } else {
        document.getElementById("login-error").style.display = "block";
    }
}



 */

//cargando el archivo header

fetch("paginas_principal/body.html")
  .then((res) => res.text())
  .then((data) => (document.getElementById("navegacion").innerHTML = data));

fetch("paginas_principal/footer.html")
  .then((res) => res.text())
  .then((data) => (document.getElementById("footer").innerHTML = data));

fetch("paginas_principal/header.html")
  .then((res) => res.text())
  .then((data) => (document.getElementById("header").innerHTML = data));

function aplicarPreferenciasUsuario() {
  const temaGuardado = localStorage.getItem("tema") || "claro";
  const selectTema = document.getElementById("tema-seleccion");

  if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
    if (selectTema) selectTema.value = "tema-oscuro";
  } else {
    document.body.classList.remove("modo-oscuro");
    if (selectTema) selectTema.value = "tema-claro";
  }
  const notiGuardado = localStorage.getItem("notificaciones") || "activadas";
  const selectNoti = document.getElementById("notificaciones-seleccion");
  if (selectNoti) selectNoti.value = notiGuardado;
}


fetch("paginas_principal/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
    aplicarPreferenciasUsuario(); 
  });

function cargarPaginas(url_paginas) {
  fetch(`paginas_body/${url_paginas}.html`)
    .then((res) => res.text())
    .then((data) => {
      const contenedor = document.getElementById("body");

      if (!contenedor) {
        console.error("No se encontró el contenedor con id 'body'");
        return;
      }

      contenedor.innerHTML = data;

      // Cargar scripts globales
      const scriptsGlobales = [
        "camara.js",
        "estilos.js",
        "localStorage.js",
        "ubicacion.js",
      ];

      scriptsGlobales.forEach((scriptName) => {
        if (
          !document.querySelector(`script[src="./public/js/${scriptName}"]`)
        ) {
          const s = document.createElement("script");
          s.src = `./public/js/${scriptName}`;
          document.body.appendChild(s);
        }
      });

      // También ejecutar scripts inline si existieran
      const scriptsInline = contenedor.querySelectorAll("script");
      scriptsInline.forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
    })
    .catch((err) => console.error("Error cargando la página:", err));
}

window.onload = () => cargarPaginas("Casa");

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    // Redirección al index.html
    window.location.href = "./index.html";
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}
