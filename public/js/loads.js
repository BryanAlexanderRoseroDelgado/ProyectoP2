// Keep track of loaded external scripts to prevent multiple DOM additions
const loadedScripts = new Set();
const scriptElements = new Map(); // Track script elements for potential cleanup

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
