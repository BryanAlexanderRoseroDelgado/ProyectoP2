let stream = null;
let canvas = null;
let ctx = null;
let animationId = null;
let tempVideo = null;

// Initialize camera elements
function initializeCamera(canvasId = 'foto_resultado') {
    // Always get fresh canvas reference to handle page navigation
    const targetCanvas = document.getElementById(canvasId);
    
    if (!targetCanvas) {
        console.error(`Canvas element with ID '${canvasId}' not found`);
        return false;
    }
    
    // Update global references
    canvas = targetCanvas;
    ctx = canvas.getContext('2d');
    
    // Set initial canvas background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Presiona "Activar Cámara" para comenzar', canvas.width/2, canvas.height/2);
    
    return true;
}

// Clean up camera resources
function cleanupCamera() {
    // Stop any ongoing animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Stop any active stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // Remove temporary video element
    if (tempVideo) {
        tempVideo.srcObject = null;
        tempVideo = null;
    }
    
    // Clear canvas and context references to prevent stale references
    canvas = null;
    ctx = null;
}

// Global function to reset camera state when changing pages
function resetCameraOnPageChange() {
    cleanupCamera();
    // Clear any global variables to force reinitialization
    canvas = null;
    ctx = null;
}

// Activate camera function
async function ActivarCamara(buttonPrefix = '') {
    try {
        // Clean up any existing resources first
        cleanupCamera();
        
        // Always re-initialize canvas for current page context
        const canvasId = buttonPrefix ? 'foto_resultado_producto' : 'foto_resultado';
        if (!initializeCamera(canvasId)) {
            alert('Error: No se pudo encontrar el elemento canvas');
            return;
        }
        
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Tu navegador no soporta acceso a la cámara');
            return;
        }
        
        // Choose camera type based on context
        const facingMode = buttonPrefix ? 'environment' : 'user'; // Back camera for products, front for users
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480,
                facingMode: facingMode
            } 
        });
        
        // Create a video element temporarily to capture frames
        tempVideo = document.createElement('video');
        tempVideo.srcObject = stream;
        tempVideo.autoplay = true;
        tempVideo.playsInline = true;
        tempVideo.muted = true;
        
        // Start drawing video frames on canvas when video is ready
        tempVideo.onloadedmetadata = function() {
            drawVideoFrame(tempVideo);
        };
        
        // Update button visibility
        const activarBtn = buttonPrefix ? 'activar-camara-producto-btn' : 'activar-camara-btn';
        const tomarBtn = buttonPrefix ? 'tomar-foto-producto-btn' : 'tomar-foto-btn';
        const subirBtn = buttonPrefix ? 'subir-archivo-producto-btn' : 'subir-archivo-btn';
        const cambiarBtn = buttonPrefix ? 'cambiar-archivo-producto-btn' : 'cambiar-archivo-btn';
        
        const activarElement = document.getElementById(activarBtn);
        const tomarElement = document.getElementById(tomarBtn);
        const subirElement = document.getElementById(subirBtn);
        const cambiarElement = document.getElementById(cambiarBtn);
        
        if (activarElement) activarElement.style.display = 'none';
        if (tomarElement) tomarElement.style.display = 'inline-block';
        if (subirElement) subirElement.style.display = 'none';
        if (cambiarElement) cambiarElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('No se pudo acceder a la cámara. Verifique los permisos.');
    }
}

// Draw video frame on canvas
function drawVideoFrame(video) {
    // Ensure we have valid canvas and context before drawing
    if (stream && stream.active && canvas && ctx) {
        // Draw the video frame on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(() => drawVideoFrame(video));
    }
}

// Take photo function
function TomarFoto(buttonPrefix = '') {
    if (!canvas || !stream) {
        alert('Error: Cámara no inicializada correctamente');
        return;
    }
    
    if (stream && stream.active) {
        // Stop the animation loop
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Stop video stream
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        
        // Clean up the temporary video element
        if (tempVideo) {
            tempVideo.srcObject = null;
            tempVideo = null;
        }
        
        // Update button visibility
        const tomarBtn = buttonPrefix ? 'tomar-foto-producto-btn' : 'tomar-foto-btn';
        const retomarBtn = buttonPrefix ? 'retomar-foto-producto-btn' : 'retomar-foto-btn';
        const subirBtn = buttonPrefix ? 'subir-archivo-producto-btn' : 'subir-archivo-btn';
        const cambiarBtn = buttonPrefix ? 'cambiar-archivo-producto-btn' : 'cambiar-archivo-btn';
        
        const tomarElement = document.getElementById(tomarBtn);
        const retomarElement = document.getElementById(retomarBtn);
        const subirElement = document.getElementById(subirBtn);
        const cambiarElement = document.getElementById(cambiarBtn);
        
        if (tomarElement) tomarElement.style.display = 'none';
        if (retomarElement) retomarElement.style.display = 'inline-block';
        if (subirElement) subirElement.style.display = 'none';
        if (cambiarElement) cambiarElement.style.display = 'none';
    }
}

// Retake photo function
function RetomarFoto(buttonPrefix = '') {
    resetPhotoState(buttonPrefix);
}

// Reset camera state (called when form is reset or page changes)
function resetCameraState(buttonPrefix = '') {
    resetPhotoState(buttonPrefix);
}

// Get photo data as base64 string
function getPhotoData() {
    if (!canvas) {
        console.error('Canvas not available');
        return null;
    }
    return canvas.toDataURL('image/jpeg', 0.8);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(function() {
        // Try to initialize with default canvas first
        const defaultCanvas = document.getElementById('foto_resultado');
        const productCanvas = document.getElementById('foto_resultado_producto');
        
        if (defaultCanvas) {
            initializeCamera('foto_resultado');
        } else if (productCanvas) {
            initializeCamera('foto_resultado_producto');
        }
    }, 100);
});

// Reset camera when page visibility changes or before unload
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        cleanupCamera();
    }
});

window.addEventListener('beforeunload', function() {
    cleanupCamera();
});

// Function to be called when navigating between pages
window.resetCameraForNavigation = function() {
    resetCameraOnPageChange();
};

// Also reset when form is reset or when navigating between steps
document.addEventListener('click', function(e) {
    // Reset camera when clicking on navigation elements or form reset
    if (e.target.classList.contains('btn-next') || 
        e.target.classList.contains('step') || 
        e.target.textContent === 'Reiniciar') {
        
        // Only reset if we're not in the middle of photo capture process
        const retomarBtn = document.getElementById('retomar-foto-btn');
        const isPhotoTaken = retomarBtn && retomarBtn.style.display !== 'none';
        
        if (!isPhotoTaken) {
            // Small delay to allow navigation to complete
            setTimeout(function() {
                const canvas = document.getElementById('foto_resultado');
                if (canvas) {
                    resetCameraState();
                }
            }, 100);
        }
    }
});

// File upload functionality
function triggerFileUpload(buttonPrefix = '') {
    const inputId = buttonPrefix ? 'imagenProducto' : 'upload-photo-input';
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
        fileInput.click();
    }
}

function handleFileUpload(input, buttonPrefix = '') {
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

    // Clean up any existing camera resources
    cleanupCamera();

    // Use FileReader to load the image
    const reader = new FileReader();
    reader.onload = function(e) {
        displayUploadedImage(e.target.result, buttonPrefix);
        updateButtonsForUpload(buttonPrefix);
    };
    reader.readAsDataURL(file);
}

function displayUploadedImage(imageSrc, buttonPrefix = '') {
    const canvasId = buttonPrefix ? 'foto_resultado_producto' : 'foto_resultado';
    
    // Always re-initialize canvas to ensure we have the correct reference
    if (!initializeCamera(canvasId)) {
        alert('Error: No se pudo inicializar el canvas');
        return;
    }

    const img = new Image();
    img.onload = function() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
    img.src = imageSrc;
}

function updateButtonsForUpload(buttonPrefix = '') {
    // Get button IDs based on context
    const activarBtn = buttonPrefix ? 'activar-camara-producto-btn' : 'activar-camara-btn';
    const tomarBtn = buttonPrefix ? 'tomar-foto-producto-btn' : 'tomar-foto-btn';
    const retomarBtn = buttonPrefix ? 'retomar-foto-producto-btn' : 'retomar-foto-btn';
    const subirBtn = buttonPrefix ? 'subir-archivo-producto-btn' : 'subir-archivo-btn';
    const cambiarBtn = buttonPrefix ? 'cambiar-archivo-producto-btn' : 'cambiar-archivo-btn';
    
    // Hide camera buttons - check if elements exist first
    const activarElement = document.getElementById(activarBtn);
    const tomarElement = document.getElementById(tomarBtn);
    const retomarElement = document.getElementById(retomarBtn);
    const subirElement = document.getElementById(subirBtn);
    const cambiarElement = document.getElementById(cambiarBtn);
    
    if (activarElement) activarElement.style.display = 'none';
    if (tomarElement) tomarElement.style.display = 'none';
    if (retomarElement) retomarElement.style.display = 'none';
    
    // Show file upload buttons
    if (subirElement) subirElement.style.display = 'none';
    if (cambiarElement) cambiarElement.style.display = 'inline-block';
}

function resetPhotoState(buttonPrefix = '') {
    // Get input and button IDs based on context
    const inputId = buttonPrefix ? 'imagenProducto' : 'upload-photo-input';
    const canvasId = buttonPrefix ? 'foto_resultado_producto' : 'foto_resultado';
    const activarBtn = buttonPrefix ? 'activar-camara-producto-btn' : 'activar-camara-btn';
    const tomarBtn = buttonPrefix ? 'tomar-foto-producto-btn' : 'tomar-foto-btn';
    const retomarBtn = buttonPrefix ? 'retomar-foto-producto-btn' : 'retomar-foto-btn';
    const subirBtn = buttonPrefix ? 'subir-archivo-producto-btn' : 'subir-archivo-btn';
    const cambiarBtn = buttonPrefix ? 'cambiar-archivo-producto-btn' : 'cambiar-archivo-btn';
    
    // Clear file input
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Clean up camera resources
    cleanupCamera();
    
    // Get button elements and check if they exist before manipulating
    const activarElement = document.getElementById(activarBtn);
    const tomarElement = document.getElementById(tomarBtn);
    const retomarElement = document.getElementById(retomarBtn);
    const subirElement = document.getElementById(subirBtn);
    const cambiarElement = document.getElementById(cambiarBtn);
    
    // Reset all buttons to initial state
    if (activarElement) activarElement.style.display = 'inline-block';
    if (tomarElement) tomarElement.style.display = 'none';
    if (retomarElement) retomarElement.style.display = 'none';
    if (subirElement) subirElement.style.display = 'inline-block';
    if (cambiarElement) cambiarElement.style.display = 'none';
    
    // Re-initialize canvas for current page
    initializeCamera(canvasId);
}

// Product-specific wrapper functions
function ActivarCamaraProducto() {
    return ActivarCamara('producto');
}

function TomarFotoProducto() {
    return TomarFoto('producto');
}

function RetomarFotoProducto() {
    return RetomarFoto('producto');
}

function triggerFileUploadProducto() {
    return triggerFileUpload('producto');
}

function handleFileUploadProducto(input) {
    return handleFileUpload(input, 'producto');
}

function getPhotoDataProducto() {
    return getPhotoData();
}
