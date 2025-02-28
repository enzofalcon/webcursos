document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.getElementById("menu-container");

    if (menuContainer) {
        fetch("../menu.html")
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el menú");
                return response.text();
            })
            .then(html => {
                menuContainer.innerHTML = html;

                // Verifica si el CSS ya está agregado para evitar duplicaciones
                if (!document.querySelector('link[href="../estaticos/estilos/style.css"]')) {
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = "../estaticos/estilos/style.css";
                    document.head.appendChild(link);
                }
            })
            .catch(error => console.error("Error al cargar el menú:", error));
    }
});
