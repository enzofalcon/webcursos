document.addEventListener("DOMContentLoaded", function () {
    let baseURL;
    
    if (window.location.hostname.includes("github.io")) {
        baseURL = "menu.html"; // Ajustado para GitHub Pages
    } else {
        baseURL = "../menu.html"; // Para navegación desde subcarpetas en local
    }

    fetch(baseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el menú desde ${baseURL}`);
            }
            return response.text();
        })
        .then(html => {
            console.log("Contenido del menú antes de insertarlo:", html);
            const menuContainer = document.getElementById("menu-container");
            if (menuContainer) {
                menuContainer.innerHTML = html;
            } else {
                console.error("No se encontró el div #menu-container");
            }
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});
