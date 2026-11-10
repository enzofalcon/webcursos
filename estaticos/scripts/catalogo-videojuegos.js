
/* ==================================================
   CATÁLOGO DE VIDEOJUEGOS DEL ITI
   Datos obtenidos desde juegos.json
================================================== */

const URL_DATOS = "../../estaticos/datos/juegos.json";

const RUTA_PORTADAS =
    "../../estaticos/imagenes/catalogoVideojuegos/Imagenes_Catalogo/";

let juegos = [];

const $ = id => document.getElementById(id);

const lista = $("lista-juegos");
const busqueda = $("busqueda");
const filtroAnio = $("filtro-anio");
const filtroGenero = $("filtro-genero");
const filtroCurso = $("filtro-curso");
const filtroTematica = $("filtro-tematica");
const cantidad = $("cantidad-resultados");
const sinResultados = $("sin-resultados");


/* ---------- CREAR ELEMENTOS ---------- */

function crearElemento(etiqueta, clase = "", texto) {
    const el = document.createElement(etiqueta);

    if (clase) {
        el.className = clase;
    }

    if (texto !== undefined) {
        el.textContent = texto;
    }

    return el;
}


/* ---------- NORMALIZAR TEXTO ---------- */

function normalizarTexto(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .trim();
}


/* ---------- OBTENER GÉNEROS ---------- */

function obtenerGeneros(juego) {
    if (Array.isArray(juego.generos)) {
        return juego.generos.filter(
            genero => genero && genero !== "Por confirmar"
        );
    }

    // Compatibilidad con registros anteriores
    if (juego.genero && juego.genero !== "Por confirmar") {
        return [juego.genero];
    }

    return [];
}


/* ---------- RELLENAR FILTROS ---------- */

function rellenarFiltro(select, valores) {
    const opcionInicial = select.options[0];

    select.replaceChildren(opcionInicial);

    valores.forEach(valor => {
        const opcion = document.createElement("option");

        opcion.value = String(valor);
        opcion.textContent = valor;

        select.appendChild(opcion);
    });
}


/* ---------- CARGAR FILTROS ---------- */

function cargarFiltros() {
    const unicos = campo => [
        ...new Set(
            juegos
                .map(juego => juego[campo])
                .filter(valor =>
                    valor !== undefined &&
                    valor !== null &&
                    valor !== "" &&
                    valor !== "Por confirmar"
                )
        )
    ];

    const generos = [
        ...new Set(
            juegos.flatMap(juego => obtenerGeneros(juego))
        )
    ];

    rellenarFiltro(
        filtroAnio,
        unicos("anio").sort((a, b) => b - a)
    );

    rellenarFiltro(
        filtroGenero,
        generos.sort((a, b) => a.localeCompare(b, "es"))
    );

    rellenarFiltro(
        filtroCurso,
        unicos("curso").sort((a, b) => a.localeCompare(b, "es"))
    );

    rellenarFiltro(
        filtroTematica,
        unicos("tematica").sort((a, b) => a.localeCompare(b, "es"))
    );
}


/* ---------- MOSTRAR VIDEOJUEGOS ---------- */

function mostrarJuegos(resultados) {
    lista.replaceChildren();

    cantidad.textContent =
        `${resultados.length} videojuego${resultados.length === 1 ? "" : "s"} encontrado${resultados.length === 1 ? "" : "s"}`;

    sinResultados.hidden = resultados.length !== 0;

    resultados.forEach(juego => {

        /* Tarjeta */

        const tarjeta = crearElemento("article", "juego-card");


        /* Portada */

        const portada = crearElemento("div", "juego-portada");

        if (juego.portada) {
            const img = document.createElement("img");

            img.src =
                RUTA_PORTADAS + encodeURIComponent(juego.portada);

            img.alt = `Portada de ${juego.titulo}`;
            img.loading = "lazy";

            img.onerror = () => {
                portada.replaceChildren(
                    crearElemento(
                        "span",
                        "",
                        "Portada próximamente"
                    )
                );
            };

            portada.appendChild(img);

        } else {
            portada.appendChild(
                crearElemento(
                    "span",
                    "",
                    "Portada próximamente"
                )
            );
        }


        /* Información */

        const info = crearElemento("div", "juego-info");

        info.appendChild(
            crearElemento("h3", "", juego.titulo)
        );

        const datos = [
            juego.anio,
            juego.curso && juego.curso !== "Por confirmar"
                ? juego.curso
                : null
        ]
            .filter(Boolean)
            .join(" · ");

        info.appendChild(
            crearElemento("p", "juego-datos", datos)
        );


        /* Autores */

        if (Array.isArray(juego.autores) && juego.autores.length) {
            info.appendChild(
                crearElemento(
                    "p",
                    "juego-autores",
                    `Autoría: ${juego.autores.join(", ")}`
                )
            );
        }


        /* Descripción */

        info.appendChild(
            crearElemento(
                "p",
                "juego-descripcion",
                juego.descripcion || "Descripción próximamente."
            )
        );


        /*
           Los géneros y las temáticas no se muestran
           en las tarjetas, pero siguen disponibles
           para los filtros.
        */


        /* Enlace de descarga */

        if (juego.descarga) {
            const enlace = crearElemento(
                "a",
                "boton-juego",
                "Descargar videojuego"
            );

            enlace.href = juego.descarga;
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";

            enlace.setAttribute(
                "aria-label",
                `Abrir descarga de ${juego.titulo} en Google Drive`
            );

            info.appendChild(enlace);
        }


        /* Agregar tarjeta al catálogo */

        tarjeta.append(portada, info);
        lista.appendChild(tarjeta);
    });
}


/* ---------- APLICAR FILTROS ---------- */

function aplicarFiltros() {
    const texto = normalizarTexto(busqueda.value);

    const resultados = juegos.filter(juego => {

        const contenido = normalizarTexto([
            juego.titulo,
            juego.descripcion,
            juego.tematica,
            juego.curso,
            ...obtenerGeneros(juego),
            ...(juego.autores || [])
        ].join(" "));

        const coincideBusqueda =
            contenido.includes(texto);

        const coincideAnio =
            filtroAnio.value === "todos" ||
            String(juego.anio) === filtroAnio.value;

        const coincideGenero =
            filtroGenero.value === "todos" ||
            obtenerGeneros(juego).includes(filtroGenero.value);

        const coincideCurso =
            filtroCurso.value === "todos" ||
            juego.curso === filtroCurso.value;

        const coincideTematica =
            filtroTematica.value === "todos" ||
            juego.tematica === filtroTematica.value;

        return (
            coincideBusqueda &&
            coincideAnio &&
            coincideGenero &&
            coincideCurso &&
            coincideTematica
        );
    });

    mostrarJuegos(resultados);
}


/* ---------- EVENTOS DE LOS FILTROS ---------- */

[
    busqueda,
    filtroAnio,
    filtroGenero,
    filtroCurso,
    filtroTematica
].forEach(control => {

    control.addEventListener(
        control === busqueda ? "input" : "change",
        aplicarFiltros
    );

});


/* ---------- INICIAR CATÁLOGO ---------- */

async function iniciarCatalogo() {
    try {
        const respuesta = await fetch(URL_DATOS);

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error(
                "El archivo JSON no contiene una lista de videojuegos"
            );
        }

        juegos = datos;

        cargarFiltros();
        aplicarFiltros();

    } catch (error) {
        console.error(
            "Error al cargar el catálogo:",
            error
        );

        cantidad.textContent =
            "No fue posible cargar los videojuegos. Revisar juegos.json y publicar la página mediante un servidor web.";

        sinResultados.hidden = true;
    }
}


/* ---------- EJECUCIÓN ---------- */

iniciarCatalogo();
