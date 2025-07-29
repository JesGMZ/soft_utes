document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const form = document.getElementById("formFormato");
  const formElement = document.getElementById("formatoForm");

  const inputId = document.getElementById("idFormato");
  const inputCodigo = document.getElementById("codigoFormato");
  const inputVersion = document.getElementById("versionFormato");
  const inputFecha = document.getElementById("fechaFormato");
  const btnSubmit = document.getElementById("btnSubmit");

  const originalAction = URL_CREAR_FORMATO;

  btnMostrar.addEventListener("click", () => {
    form.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = '';
    btnSubmit.textContent = "Guardar";
  });

  btnCancelar.addEventListener("click", () => {
    form.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = '';
    btnSubmit.textContent = "Guardar";
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      inputId.value = btn.dataset.id;
      inputCodigo.value = btn.dataset.codigo;
      inputVersion.value = btn.dataset.version;
      inputFecha.value = btn.dataset.fecha;

      formElement.action = `/formatos/editar/${btn.dataset.id}/`;
      btnSubmit.textContent = "Actualizar";
      form.style.display = "block";
      btnMostrar.style.display = "none";
    });
  });

  const tabla = document.getElementById("tablaFormatos");
  const buscar = document.getElementById("buscarFormatos");
  const filtroEstado = document.getElementById("filtroEstado");
  const mostrar = document.getElementById("mostrar");
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let todasLasFilas = Array.from(tabla.querySelectorAll("tr"));
  let rows = [...todasLasFilas];
  let paginaActual = 1;
  let filasPorPagina = parseInt(mostrar.value);

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
    infoRegistros.textContent = total === 0 ?
      "No se encontraron resultados." :
      `Mostrando de ${inicio} a ${fin} de ${total} registros`;
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
    const estadoSeleccionado = filtroEstado.value.toLowerCase();

    rows = todasLasFilas.filter(row => {
      const contenido = row.textContent.toLowerCase();
      const estado = row.querySelector(".estado")?.classList.contains("activo") ? "activo" : "inactivo";

      const coincideTexto = contenido.includes(texto);
      const coincideEstado = estadoSeleccionado === "" || estado === estadoSeleccionado;

      return coincideTexto && coincideEstado;
    });

    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  buscar.addEventListener("keyup", aplicarFiltro);
  filtroEstado.addEventListener("change", aplicarFiltro);
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });

  aplicarFiltro();
});
