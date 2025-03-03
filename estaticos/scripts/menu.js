document.addEventListener("DOMContentLoaded", function () {
    // Detectar si estamos en GitHub Pages o en local
    const basePath = window.location.hostname.includes("github.io") ? "/webcursos/" : "/";

    fetch(basePath + "menu.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el menú");
            }
            return response.text();
        })
        .then(html => {
            // Crear un elemento temporal para manipular los enlaces antes de insertarlos
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // Ajustar todas las rutas en los enlaces
            tempDiv.querySelectorAll("a").forEach(link => {
                if (link.getAttribute("href") && !link.getAttribute("href").startsWith("mailto:")) {
                    link.href = basePath + link.getAttribute("href");
                }
            });

            document.getElementById("menu-container").innerHTML = tempDiv.innerHTML;
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});
