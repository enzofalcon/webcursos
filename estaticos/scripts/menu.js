document.addEventListener("DOMContentLoaded", function () {
    // Detectar si estamos en GitHub Pages o en local
    const baseURL = window.location.hostname.includes("github.io") 
        ? "/webcursos/menu.html" 
        : "menu.html"; // O ajusta la ruta según tu estructura de carpetas

    fetch(baseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el menú");
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("menu-container").innerHTML = html;
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});
