document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const form = document.getElementById("formEstablecimiento");
  const formElement = document.getElementById("establecimientoForm");
  const inputId = document.getElementById("idEstablecimiento");
  const inputNombre = document.getElementById("nombre");

  const tabla = document.getElementById("tablaEstablecimientos");
  const buscar = document.getElementById("buscarEstablecimiento");
  const mostrar = document.getElementById("mostrar");
  const filtroEstado = document.getElementById("filtroEstado");
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let todasLasFilas = Array.from(tabla.querySelectorAll("tbody tr"));
  let rows = [...todasLasFilas];
  let paginaActual = 1;
  let filasPorPagina = parseInt(mostrar.value);

  btnMostrar.addEventListener("click", () => {
    form.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = ESTABLECIMIENTO_CREATE_URL;
    formElement.reset();
    inputId.value = '';
  });

  btnCancelar.addEventListener("click", () => {
    form.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = ESTABLECIMIENTO_CREATE_URL;
    formElement.reset();
    inputId.value = '';
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      inputId.value = btn.dataset.id;
      inputNombre.value = btn.dataset.nombre;
      formElement.action = `/establecimientos/editar/${btn.dataset.id}/`;
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
    infoRegistros.textContent = total === 0 ? "No se encontraron resultados." : `Mostrando de ${inicio} a ${fin} de ${total} registros`;
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

  function aplicarFiltros() {
    const texto = buscar.value.toLowerCase();
    const estado = filtroEstado.value;

    rows = todasLasFilas.filter(row => {
      const contenido = row.textContent.toLowerCase();
      const estadoSpan = row.querySelector(".estado");
      const estadoFila = estadoSpan ? estadoSpan.classList.contains("activo") ? "activo" : "inactivo" : "";
      return contenido.includes(texto) && (estado === "" || estado === estadoFila);
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
