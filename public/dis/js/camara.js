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