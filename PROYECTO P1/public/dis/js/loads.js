function cargarContenido(pagina, id, callback) {
    fetch(pagina)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback(); // Ejecuta el callback si se pasó
        });
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
