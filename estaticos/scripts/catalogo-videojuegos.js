/* Catálogo de videojuegos del ITI — datos en juegos.json */
const URL_DATOS = "../../estaticos/datos/juegos.json";
let juegos = [];
const $ = (id) => document.getElementById(id);
const lista = $("lista-juegos");
const busqueda = $("busqueda");
const filtroAnio = $("filtro-anio");
const filtroGenero = $("filtro-genero");
const filtroCurso = $("filtro-curso");
const filtroTematica = $("filtro-tematica");
const cantidad = $("cantidad-resultados");
const sinResultados = $("sin-resultados");

function crearElemento(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function rellenarFiltro(select, valores) {
  select.replaceChildren(select.options[0]);
  valores.forEach(valor => {
    const opcion = document.createElement("option");
    opcion.value = String(valor);
    opcion.textContent = valor;
    select.appendChild(opcion);
  });
}

function cargarFiltros() {
  const unicos = (campo) => [...new Set(juegos.map(j => j[campo]).filter(v => v && v !== "Por confirmar"))];
  rellenarFiltro(filtroAnio, unicos("anio").sort((a,b) => b-a));
  rellenarFiltro(filtroGenero, unicos("genero").sort());
  rellenarFiltro(filtroCurso, unicos("curso").sort());
  rellenarFiltro(filtroTematica, unicos("tematica").sort());
}

function mostrarJuegos(resultados) {
  lista.replaceChildren();
  cantidad.textContent = `${resultados.length} videojuego${resultados.length === 1 ? "" : "s"} encontrado${resultados.length === 1 ? "" : "s"}`;
  sinResultados.hidden = resultados.length !== 0;
  resultados.forEach(juego => {
    const tarjeta = crearElemento("article", "juego-card");
    const portada = crearElemento("div", "juego-portada");
    if (juego.portada) {
      const img = document.createElement("img");
      img.src = `../../estaticos/imagenes/catalogoVideojuegos/${encodeURIComponent(juego.portada)}`;
      img.alt = `Portada de ${juego.titulo}`;
      img.loading = "lazy";
      img.onerror = () => { portada.replaceChildren(crearElemento("span", "", "Portada próximamente")); };
      portada.appendChild(img);
    } else {
      portada.appendChild(crearElemento("span", "", "Portada próximamente"));
    }
    const info = crearElemento("div", "juego-info");
    info.appendChild(crearElemento("h3", "", juego.titulo));
    info.appendChild(crearElemento("p", "juego-datos", `${juego.anio}${juego.curso !== "Por confirmar" ? " · " + juego.curso : ""}`));
    if (juego.autores?.length) info.appendChild(crearElemento("p", "juego-autores", `Autoría: ${juego.autores.join(", ")}`));
    info.appendChild(crearElemento("p", "juego-descripcion", juego.descripcion));
    const etiquetas = crearElemento("div", "juego-etiquetas");
    [juego.genero, juego.tematica].filter(v => v && v !== "Por confirmar").forEach(v => etiquetas.appendChild(crearElemento("span", "etiqueta", v)));
    info.appendChild(etiquetas);
    if (juego.descarga) {
      const enlace = crearElemento("a", "boton-juego", "Descargar videojuego");
      enlace.href = juego.descarga;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      enlace.setAttribute("aria-label", `Descargar ${juego.titulo} desde Google Drive`);
      info.appendChild(enlace);
    }
    tarjeta.append(portada, info);
    lista.appendChild(tarjeta);
  });
}

function aplicarFiltros() {
  const texto = busqueda.value.toLocaleLowerCase("es").trim();
  const resultados = juegos.filter(j => {
    const contenido = [j.titulo, j.descripcion, j.tematica, ...(j.autores || [])].join(" ").toLocaleLowerCase("es");
    return contenido.includes(texto)
      && (filtroAnio.value === "todos" || String(j.anio) === filtroAnio.value)
      && (filtroGenero.value === "todos" || j.genero === filtroGenero.value)
      && (filtroCurso.value === "todos" || j.curso === filtroCurso.value)
      && (filtroTematica.value === "todos" || j.tematica === filtroTematica.value);
  });
  mostrarJuegos(resultados);
}

[busqueda, filtroAnio, filtroGenero, filtroCurso, filtroTematica].forEach(control => {
  control.addEventListener(control === busqueda ? "input" : "change", aplicarFiltros);
});

async function iniciarCatalogo() {
  try {
    const respuesta = await fetch(URL_DATOS);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    if (!Array.isArray(datos)) throw new Error("El archivo JSON no contiene una lista");
    juegos = datos;
    cargarFiltros();
    aplicarFiltros();
  } catch (error) {
    console.error("Error al cargar el catálogo:", error);
    cantidad.textContent = "No fue posible cargar los videojuegos. Revisar juegos.json y publicar la página mediante un servidor web.";
    sinResultados.hidden = true;
  }
}

iniciarCatalogo();
