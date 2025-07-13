let map = null;

function localizar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                document.getElementById("latitud").value = latitude;
                document.getElementById("longitud").value = longitude;

                // Clean up existing map if it exists
                if (map) {
                    map.remove();
                }
                
                map = L.map('map').setView([latitude , longitude], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                
            }, error => {
                alert("Error al obtener ubicación: " + error.message);
            });
    } else {
        alert("Geolocalización no es compatible con este navegador.");
    }
}