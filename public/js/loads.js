// Keep track of loaded external scripts to prevent multiple DOM additions
const loadedScripts = new Set();
const scriptElements = new Map(); 

// Configuration object mapping HTML pages to their corresponding scripts
// Can contain either script paths (string) or inline code (function)

const pageScriptConfig = {
    'paginas_body/Casa.html': () => {
        console.log('Casa page loaded');
    },
    'paginas_body/Crear.html': async () => {
        console.log('Crear page loaded');
        
        // Load all external scripts and wait for them to complete
        await Promise.all([
            loadExternalScript('./public/js/localStorage.js'),
            loadExternalScript('./public/js/estilos.js'),
            loadExternalScript('./public/js/camara.js'),
            loadExternalScript('./public/js/ubicacion.js')
        ]);
        
        // Load external Leaflet library
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
        
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        leafletJS.crossOrigin = '';
        document.body.appendChild(leafletJS);
        
        // Add map styles
        const mapStyle = document.createElement('style');
        mapStyle.textContent = '#map { height: 180px; }';
        document.head.appendChild(mapStyle);
    },
    
    'paginas_body/Crear_Pr.html': async () => {
        console.log('Crear_Pr page loaded');
        // Load all required scripts including the shared camera functionality
        await Promise.all([
            loadExternalScript('./public/js/localStorage.js'),
            loadExternalScript('./public/js/estilos.js'),
            loadExternalScript('./public/js/camara.js')
        ]);
    },
    
    'paginas_body/Ver.html': async () => {
        console.log('Ver page loaded');
        // Load both localStorage and estilos scripts first
        await Promise.all([
            loadExternalScript('./public/js/localStorage.js'),
            loadExternalScript('./public/js/estilos.js')
        ]);
        
        // Execute after scripts are loaded
        if (typeof cargarPerfiles === 'function') {
            cargarPerfiles();
        } else {
            console.log("Error de carga");
        }
    },
    
    'paginas_body/Ver_Pr.html': async () => {
        console.log('Ver_Pr page loaded');
        // Load both localStorage and estilos scripts first
        await Promise.all([
            loadExternalScript('./public/js/localStorage.js'),
            loadExternalScript('./public/js/estilos.js')
        ]);
        
        // Execute after scripts are loaded
        if (typeof cargarProductosDesdeLocalStorage === 'function') {
            cargarProductosDesdeLocalStorage('teclado', 'teclado_tabla');
            cargarProductosDesdeLocalStorage('mouse', 'mouse_tabla');
            cargarProductosDesdeLocalStorage('auricular', 'auricular_tabla');
        }
    },
    
    'paginas_body/Facturas.html': () => {
        console.log('Facturas page loaded');
        
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
        
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        leafletJS.crossOrigin = '';
        document.body.appendChild(leafletJS);
        
        // Add Facturas specific functions
        setTimeout(() => {
            window.limpiarFormularioCompleto = function() {
                document.querySelector(".form-sample").reset();
                document.getElementById("productos-container").innerHTML = "";
                document.getElementById("subtotal").textContent = "0.00";
                document.getElementById("iva").textContent = "0.00";
                document.getElementById("total").textContent = "0.00";
                document.getElementById("foto_resultado_cliente").style.display = "none";
                document.getElementById("video_cliente").style.display = "none";
                document.getElementById("capturar_cliente").style.display = "none";
                document.getElementById("latitud-cliente").value = "0";
                document.getElementById("longitud-cliente").value = "0";
            };
            
            // Camera and location variables
            let stream_cliente = null;
            let map_cliente = null;
            
            // Camera functions
            window.abrirCamaraCliente = function() {
                const video = document.getElementById("video_cliente");
                const captureBtn = document.getElementById("capturar_cliente");
                
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(stream) {
                        stream_cliente = stream;
                        video.srcObject = stream;
                        video.style.display = "block";
                        captureBtn.style.display = "block";
                        
                        // Hide file upload button when camera is active
                        document.getElementById('subir-archivo-cliente-btn').style.display = 'none';
                        document.getElementById('cambiar-foto-cliente').style.display = 'none';
                        
                        video.play();
                    })
                    .catch(function(error) {
                        console.error("Error accessing camera:", error);
                        alert("No se pudo acceder a la cámara. Verifique los permisos.");
                    });
            };
            
            window.capturarFotoCliente = function() {
                const video = document.getElementById("video_cliente");
                const canvas = document.getElementById("foto_resultado_cliente");
                const context = canvas.getContext("2d");
                
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                video.style.display = "none";
                document.getElementById("capturar_cliente").style.display = "none";
                canvas.style.display = "block";
                
                // Hide upload button and show change button
                document.getElementById('subir-archivo-cliente-btn').style.display = 'none';
                document.getElementById('cambiar-foto-cliente').style.display = 'block';
                
                if (stream_cliente) {
                    stream_cliente.getTracks().forEach(track => track.stop());
                    stream_cliente = null;
                }
            };
            
            // Location function
            window.localizarCliente = function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            
                            document.getElementById("latitud-cliente").value = lat;
                            document.getElementById("longitud-cliente").value = lng;
                            
                            if (!map_cliente) {
                                map_cliente = L.map('map_cliente').setView([lat, lng], 13);
                                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 19,
                                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                }).addTo(map_cliente);
                            } else {
                                map_cliente.setView([lat, lng], 13);
                            }
                            
                            L.marker([lat, lng]).addTo(map_cliente)
                                .bindPopup('Ubicación del cliente')
                                .openPopup();
                        },
                        function(error) {
                            console.error("Error getting location:", error);
                            alert("No se pudo obtener la ubicación. Verifique los permisos de ubicación.");
                        }
                    );
                } else {
                    alert("La geolocalización no es compatible con este navegador.");
                }
            };
            
            // File upload functions for Facturas page
            window.triggerFileUploadCliente = function() {
                const fileInput = document.getElementById('upload-photo-cliente');
                if (fileInput) {
                    fileInput.click();
                }
            };

            window.handleFileUploadCliente = function(input) {
                const file = input.files[0];
                if (!file) {
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona un archivo de imagen válido.');
                    input.value = ''; // Clear the input
                    return;
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('El archivo es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
                    input.value = ''; // Clear the input
                    return;
                }

                // Clean up any existing camera stream
                if (stream_cliente) {
                    stream_cliente.getTracks().forEach(track => track.stop());
                    stream_cliente = null;
                }

                // Use FileReader to load the image
                const reader = new FileReader();
                reader.onload = function(e) {
                    displayUploadedImageCliente(e.target.result);
                    updateButtonsForUploadCliente();
                };
                reader.readAsDataURL(file);
            };

            window.displayUploadedImageCliente = function(imageSrc) {
                const canvas = document.getElementById("foto_resultado_cliente");
                const context = canvas.getContext("2d");
                
                const img = new Image();
                img.onload = function() {
                    // Clear canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Calculate scaling to fit image in canvas while maintaining aspect ratio
                    const canvasAspect = canvas.width / canvas.height;
                    const imageAspect = img.width / img.height;
                    
                    let drawWidth, drawHeight, drawX, drawY;
                    
                    if (imageAspect > canvasAspect) {
                        // Image is wider than canvas
                        drawWidth = canvas.width;
                        drawHeight = canvas.width / imageAspect;
                        drawX = 0;
                        drawY = (canvas.height - drawHeight) / 2;
                    } else {
                        // Image is taller than canvas
                        drawHeight = canvas.height;
                        drawWidth = canvas.height * imageAspect;
                        drawX = (canvas.width - drawWidth) / 2;
                        drawY = 0;
                    }
                    
                    // Draw the image centered on canvas
                    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                    
                    // Show canvas
                    canvas.style.display = "block";
                };
                img.src = imageSrc;
            };

            window.updateButtonsForUploadCliente = function() {
                // Hide camera options
                document.getElementById('video_cliente').style.display = 'none';
                document.getElementById('capturar_cliente').style.display = 'none';
                
                // Hide upload button, show change button
                document.getElementById('subir-archivo-cliente-btn').style.display = 'none';
                document.getElementById('cambiar-foto-cliente').style.display = 'block';
            };

            window.resetFotoCliente = function() {
                // Clear file input
                const fileInput = document.getElementById('upload-photo-cliente');
                if (fileInput) {
                    fileInput.value = '';
                }
                
                // Clean up camera stream
                if (stream_cliente) {
                    stream_cliente.getTracks().forEach(track => track.stop());
                    stream_cliente = null;
                }
                
                // Hide all elements
                document.getElementById('video_cliente').style.display = 'none';
                document.getElementById('capturar_cliente').style.display = 'none';
                document.getElementById('foto_resultado_cliente').style.display = 'none';
                document.getElementById('cambiar-foto-cliente').style.display = 'none';
                
                // Show initial upload button
                document.getElementById('subir-archivo-cliente-btn').style.display = 'block';
            };

        }, 200);
    },
    
    'paginas_body/Notas.html': () => {
        console.log('Notas page loaded');

    },

        'paginas_body/VerFact.html': async () => {
        await loadExternalScript('./public/js/VerFact.js');
        cargarFacturas();
        document.getElementById("factura-select").addEventListener("change", mostrarFacturaSeleccionada);
        document.getElementById("btn-descargar").addEventListener("click", descargarFacturaPDF);
        document.getElementById("btn-eliminar").addEventListener("click", eliminarFactura);
        }


};

  function reproducirSonidomov(id = "sonidoClickmov") {
  if (localStorage.getItem("sonidos") === "off") return;

  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; 
    audio.play();
  }
}


function registerPageScript(page, callback) {
  pageScriptConfig[page] = callback;
}

function cargarContenido(pagina, id) {
    // Clean up camera state before loading new content
    if (typeof window.resetCameraForNavigation === 'function') {
        window.resetCameraForNavigation();
    }
    
    fetch(`${pagina}`)
        .then(res => res.text())
        .then(data => {
            const container = document.getElementById(id);
            container.innerHTML = data;
            
            // Normalize the page path for configuration lookup
            const normalizedPagePath = pagina.replace(/^\.\//, '');
            
            // Load associated script if configured
            const associatedScript = pageScriptConfig[normalizedPagePath];
            if (associatedScript) {
                if (typeof associatedScript === 'function') {
                    executeInlineFunction(associatedScript);
                } else if (typeof associatedScript === 'string') {
                    loadExternalScript(associatedScript);
                }
            }
        })

       

        .catch(error => console.error(`Error loading ${pagina}:`, error));
}

function executeInlineFunction(func) {
    try {
        func();
        console.log('Inline function executed successfully');
        reproducirSonidomov();
    } catch (error) {
        console.error('Error executing inline function:', error);
    }
}

function loadExternalScript(scriptPath) {
    return new Promise((resolve, reject) => {
        if (loadedScripts.has(scriptPath)) {
            // Script already loaded, resolve immediately
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = () => {
            loadedScripts.add(scriptPath);
            console.log(`Script loaded: ${scriptPath}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Error loading script: ${scriptPath}`);
            reject(new Error(`Failed to load script: ${scriptPath}`));
        };
        script.setAttribute('data-dynamic-script', 'true');
        script.setAttribute('data-script-src', scriptPath);
        document.body.appendChild(script);
        
        // Track the script element for potential cleanup
        scriptElements.set(scriptPath, script);
    });
}

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
    
    return {
        total: allScripts.length,
        dynamic: dynamicScripts.length,
        external: externalScripts.length,
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

