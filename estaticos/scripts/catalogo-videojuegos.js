/* ==================================================
   CATÁLOGO DE VIDEOJUEGOS
   JavaScript exclusivo de esta sección
================================================== */


/* ---------- DATOS PROVISORIOS ---------- */

const juegos = [

    {
        titulo: "Gato Cazador",

        curso: "2° MC",

        anio: 2026,

        genero: "Arcade",

        descripcion:
            "Un gato deberá recorrer distintos escenarios mientras intenta atrapar a las cucarachas.",

        portada: "",

        pagina: "#"
    },

    {
        titulo: "Escape Digital",

        curso: "2° ME",

        anio: 2026,

        genero: "Aventura",

        descripcion:
            "Explorá un mundo digital y resolvé diferentes desafíos para encontrar la salida.",

        portada: "",

        pagina: "#"
    },

    {
        titulo: "Pixel Run",

        curso: "2° MC",

        anio: 2026,

        genero: "Plataformas",

        descripcion:
            "Superá obstáculos y alcanzá el final de cada nivel en este juego de plataformas.",

        portada: "",

        pagina: "#"
    }

];


/* ---------- ELEMENTOS ---------- */

const listaJuegos =
    document.getElementById("lista-juegos");

const busqueda =
    document.getElementById("busqueda");

const filtroAnio =
    document.getElementById("filtro-anio");

const filtroGenero =
    document.getElementById("filtro-genero");

const filtroCurso =
    document.getElementById("filtro-curso");

const cantidadResultados =
    document.getElementById("cantidad-resultados");

const sinResultados =
    document.getElementById("sin-resultados");


/* ---------- CREAR TARJETAS ---------- */

function mostrarJuegos(lista) {

    listaJuegos.innerHTML = "";


    cantidadResultados.textContent =
        `${lista.length} videojuego(s)`;


    if (lista.length === 0) {

        sinResultados.style.display = "block";

        return;

    }


    sinResultados.style.display = "none";


    lista.forEach(juego => {

        const tarjeta =
            document.createElement("article");


        tarjeta.classList.add("juego-card");


        let portadaHTML;


        if (juego.portada !== "") {

            portadaHTML = `
                <div class="juego-portada">

                    <img
                        src="${juego.portada}"
                        alt="Portada de ${juego.titulo}"
                    >

                </div>
            `;

        } else {

            portadaHTML = `
                <div class="juego-portada">
                    Portada próximamente
                </div>
            `;

        }


        tarjeta.innerHTML = `

            ${portadaHTML}

            <div class="juego-info">

                <h3>
                    ${juego.titulo}
                </h3>

                <p class="juego-datos">
                    ${juego.curso} · ${juego.anio}
                </p>

                <p class="juego-descripcion">
                    ${juego.descripcion}
                </p>

                <div class="juego-etiquetas">

                    <span class="etiqueta">
                        ${juego.genero}
                    </span>

                    <span class="etiqueta">
                        ${juego.anio}
                    </span>

                </div>

                <a
                    href="${juego.pagina}"
                    class="boton-juego">

                    Ver videojuego

                </a>

            </div>

        `;


        listaJuegos.appendChild(tarjeta);

    });

}


/* ---------- CARGAR FILTROS ---------- */

function cargarFiltros() {

    const anios =
        [...new Set(
            juegos.map(juego => juego.anio)
        )];


    const generos =
        [...new Set(
            juegos.map(juego => juego.genero)
        )];


    const cursos =
        [...new Set(
            juegos.map(juego => juego.curso)
        )];


    anios
        .sort((a, b) => b - a)
        .forEach(anio => {

            filtroAnio.innerHTML += `
                <option value="${anio}">
                    ${anio}
                </option>
            `;

        });


    generos
        .sort()
        .forEach(genero => {

            filtroGenero.innerHTML += `
                <option value="${genero}">
                    ${genero}
                </option>
            `;

        });


    cursos
        .sort()
        .forEach(curso => {

            filtroCurso.innerHTML += `
                <option value="${curso}">
                    ${curso}
                </option>
            `;

        });

}


/* ---------- FILTRAR ---------- */

function aplicarFiltros() {

    const texto =
        busqueda.value
            .toLowerCase()
            .trim();


    const anio =
        filtroAnio.value;


    const genero =
        filtroGenero.value;


    const curso =
        filtroCurso.value;


    const resultado =
        juegos.filter(juego => {


            const coincideTexto =

                juego.titulo
                    .toLowerCase()
                    .includes(texto)

                ||

                juego.descripcion
                    .toLowerCase()
                    .includes(texto);


            const coincideAnio =

                anio === "todos"

                ||

                String(juego.anio) === anio;


            const coincideGenero =

                genero === "todos"

                ||

                juego.genero === genero;


            const coincideCurso =

                curso === "todos"

                ||

                juego.curso === curso;


            return (

                coincideTexto

                && coincideAnio

                && coincideGenero

                && coincideCurso

            );

        });


    mostrarJuegos(resultado);

}


/* ---------- EVENTOS ---------- */

busqueda.addEventListener(
    "input",
    aplicarFiltros
);


filtroAnio.addEventListener(
    "change",
    aplicarFiltros
);


filtroGenero.addEventListener(
    "change",
    aplicarFiltros
);


filtroCurso.addEventListener(
    "change",
    aplicarFiltros
);


/* ---------- INICIO ---------- */

cargarFiltros();

mostrarJuegos(juegos);

