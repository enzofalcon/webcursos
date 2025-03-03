document.addEventListener("DOMContentLoaded", function () {
    // Detectar si estamos en GitHub Pages o en local
    const basePath = window.location.hostname.includes("github.io") ? "/webcursos/" : "/";

    // Cargar el menú
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

            // Seleccionar elementos del DOM después de cargar el menú
            const menuToggle = document.getElementById("menu-toggle");
            const menuContainer = document.getElementById("menu-container");
            const menuList = document.querySelector(".menu-list"); 

            // Agregar funcionalidad para el menú responsive
            if (menuToggle && menuContainer) {
                menuToggle.addEventListener("click", function () {
                    menuContainer.classList.toggle("expanded"); // Expande el contenedor del menú
                });
            }

            // Asegurar que el menú desplegable interno funcione
            if (menuToggle && menuList) {
                menuToggle.addEventListener("click", function () {
                    menuList.classList.toggle("active"); // Activa la lista de opciones del menú
                });
            }
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    // Cargar el footer
    fetch(basePath + "footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el footer");
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("footer-container").innerHTML = html;
        })
        .catch(error => console.error("Error al cargar el footer:", error));
});
