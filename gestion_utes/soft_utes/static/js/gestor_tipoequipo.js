document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const formCard = document.getElementById("formNuevoTipo");
  const form = document.getElementById("tipoForm");
  const nombreInput = document.getElementById("nombre");
  const tipoIdInput = document.getElementById("tipo_id");
  const btnCancelar = document.getElementById("btnCancelarFormulario");

  const tabla = document.getElementById("tablaTipos");
  const buscar = document.getElementById("buscarTipos");
  const mostrar = document.getElementById("mostrar");
  const filtroEstado = document.getElementById("filtroEstado");
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let todasLasFilas = Array.from(tabla.querySelectorAll("tr"));
  let rows = [...todasLasFilas];
  let paginaActual = 1;
  let filasPorPagina = parseInt(mostrar.value);

  // Mostrar formulario
  btnMostrar.addEventListener("click", () => {
    form.reset();
    form.action = TIPOEQUIPO_CREATE_URL;
    tipoIdInput.value = "";
    formCard.style.display = "block";
    btnMostrar.style.display = "none";
  });

  // Cancelar formulario
  btnCancelar.addEventListener("click", () => {
    formCard.style.display = "none";
    btnMostrar.style.display = "inline-block";
  });

  // Editar
  document.querySelectorAll(".btn-editar").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const nombre = button.getAttribute("data-nombre");
      const url = button.getAttribute("data-url");

      nombreInput.value = nombre;
      tipoIdInput.value = id;
      form.action = url;

      formCard.style.display = "block";
      btnMostrar.style.display = "none";
    });
  });

  // Paginación
  function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    todasLasFilas.forEach(fila => fila.style.display = "none");
    rows.forEach((fila, i) => {
      if (i >= inicio && i < fin) fila.style.display = "";
    });
    actualizarInfo(pagina);
    actualizarPaginacion(pagina);
  }

  function actualizarInfo(pagina) {
    const total = rows.length;
    const inicio = (pagina - 1) * filasPorPagina + 1;
    const fin = Math.min(inicio + filasPorPagina - 1, total);
    infoRegistros.textContent = total === 0
      ? "No se encontraron resultados."
      : `Mostrando de ${inicio} a ${fin} de ${total} registros`;
  }

  function actualizarPaginacion(pagina) {
    const totalPaginas = Math.ceil(rows.length / filasPorPagina);
    paginacion.innerHTML = "";

    if (pagina > 1) {
      const prev = document.createElement("button");
      prev.textContent = "Anterior";
      prev.onclick = () => { paginaActual--; mostrarPagina(paginaActual); };
      paginacion.appendChild(prev);
    }

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === pagina) btn.classList.add("active");
      btn.onclick = () => { paginaActual = i; mostrarPagina(i); };
      paginacion.appendChild(btn);
    }

    if (pagina < totalPaginas) {
      const next = document.createElement("button");
      next.textContent = "Siguiente";
      next.onclick = () => { paginaActual++; mostrarPagina(paginaActual); };
      paginacion.appendChild(next);
    }
  }

  // Filtros combinados
  function aplicarFiltros() {
    const texto = buscar.value.toLowerCase();
    const estadoSeleccionado = filtroEstado.value; // activo / inactivo / ""

    rows = todasLasFilas.filter(row => {
      const contenido = row.textContent.toLowerCase();
      const estadoSpan = row.querySelector(".estado");
      const estadoFila = estadoSpan?.classList.contains("activo") ? "activo" : "inactivo";
      return contenido.includes(texto) && 
             (estadoSeleccionado === "" || estadoFila === estadoSeleccionado);
    });

    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  buscar.addEventListener("keyup", aplicarFiltros);
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });
  filtroEstado.addEventListener("change", aplicarFiltros);

  aplicarFiltros();
});
