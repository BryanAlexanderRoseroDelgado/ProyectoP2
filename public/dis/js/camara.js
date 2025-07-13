<<<<<<< HEAD
let stream = null;
let canvas = null;
let ctx = null;
let animationId = null;
let tempVideo = null;

// Initialize camera elements
function initializeCamera() {
    canvas = document.getElementById('foto_resultado');
    
    if (!canvas) {
        console.error('Canvas element not found');
        return false;
    }
    
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
}

// Activate camera function
async function ActivarCamara() {
    try {
        // Clean up any existing resources first
        cleanupCamera();
        
        // Initialize elements if not already done
        if (!canvas) {
            if (!initializeCamera()) {
                alert('Error: No se pudo encontrar el elemento canvas');
                return;
            }
        }
        
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Tu navegador no soporta acceso a la cámara');
            return;
        }
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480,
                facingMode: 'user' // Front camera
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
        document.getElementById('activar-camara-btn').style.display = 'none';
        document.getElementById('tomar-foto-btn').style.display = 'inline-block';
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('No se pudo acceder a la cámara. Verifique los permisos.');
    }
}

// Draw video frame on canvas
function drawVideoFrame(video) {
    if (stream && stream.active) {
        // Draw the video frame on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(() => drawVideoFrame(video));
    }
}

// Take photo function
function TomarFoto() {
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
        
        // The current frame is already captured on canvas - DO NOT reset canvas
        // Update button visibility
        document.getElementById('tomar-foto-btn').style.display = 'none';
        document.getElementById('retomar-foto-btn').style.display = 'inline-block';
    }
}

// Retake photo function
function RetomarFoto() {
    // Clean up all resources
    cleanupCamera();
    
    // Re-initialize canvas if needed
    if (!canvas || !ctx) {
        initializeCamera();
        return;
    }
    
    // Reset canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Presiona "Activar Cámara" para comenzar', canvas.width/2, canvas.height/2);
    
    // Reset button visibility
    document.getElementById('activar-camara-btn').style.display = 'inline-block';
    document.getElementById('tomar-foto-btn').style.display = 'none';
    document.getElementById('retomar-foto-btn').style.display = 'none';
}

// Reset camera state (called when form is reset or page changes)
function resetCameraState() {
    cleanupCamera();
    
    // Reset button visibility
    const activarBtn = document.getElementById('activar-camara-btn');
    const tomarBtn = document.getElementById('tomar-foto-btn');
    const retomarBtn = document.getElementById('retomar-foto-btn');
    
    if (activarBtn) activarBtn.style.display = 'inline-block';
    if (tomarBtn) tomarBtn.style.display = 'none';
    if (retomarBtn) retomarBtn.style.display = 'none';
    
    // Re-initialize canvas
    initializeCamera();
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
        initializeCamera();
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
=======
let my_camara = null; // variable global para poder controlarla

function IniciarCamara() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        my_camara = stream;
        document.getElementById("video").srcObject = my_camara;
    }).catch(error => {
        console.error("No se pudo acceder a la cámara:", error);
    });
}
function TomarFoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("foto_resultado");
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
function PararCamara() {
    if (my_camara) {
        // Detener cada pista (track) del stream
        my_camara.getTracks().forEach(track => track.stop());
        document.getElementById("video").srcObject = null;
        my_camara = null;
    }
}
>>>>>>> 5bd587a79fb945a0decf8656dabf3cfa6d9d9664
