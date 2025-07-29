document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const form = document.getElementById("formSubarea");
  const formElement = document.getElementById("subareaForm");
  const inputId = document.getElementById("idSubarea");
  const inputNombre = document.getElementById("subarea");
  const selectArea = document.getElementById("area");
  const originalAction = SUBAREA_CREATE_URL;

  const tabla = document.getElementById("tablaSubareas");
  const buscar = document.getElementById("buscarSubareas");
  const mostrar = document.getElementById("mostrar");
  const filtroEstado = document.getElementById("filtroEstado"); // <--- Nuevo
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let todasLasFilas = Array.from(tabla.querySelectorAll("tr"));
  let rows = [...todasLasFilas];
  let paginaActual = 1;
  let filasPorPagina = parseInt(mostrar.value);

  btnMostrar.addEventListener("click", () => {
    form.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = '';
  });

  btnCancelar.addEventListener("click", () => {
    form.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = '';
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      inputId.value = btn.dataset.id;
      inputNombre.value = btn.dataset.nombre;
      selectArea.value = btn.dataset.area;
      formElement.action = `/subareas/editar/${btn.dataset.id}/`;
      form.style.display = "block";
      btnMostrar.style.display = "none";
    });
  });

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

  function aplicarFiltro() {
    const texto = buscar.value.toLowerCase();
    const estadoSeleccionado = filtroEstado.value; // activo, inactivo, o vacío

    rows = todasLasFilas.filter(row => {
      const contenido = row.textContent.toLowerCase();
      const estadoSpan = row.querySelector(".estado");
      const estado = estadoSpan ? estadoSpan.textContent.trim().toLowerCase() : "";
      const coincideTexto = contenido.includes(texto);
      const coincideEstado = estadoSeleccionado === "" || estado === estadoSeleccionado;
      return coincideTexto && coincideEstado;
    });

    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  buscar.addEventListener("keyup", aplicarFiltro);
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });
  filtroEstado.addEventListener("change", aplicarFiltro); // <--- Nuevo

  aplicarFiltro();
});
