document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const form = document.getElementById("formCargo");
  const formElement = document.getElementById("cargoForm");
  const inputId = document.getElementById("idCargo");
  const inputDescripcion = document.getElementById("descripcionCargo");

  const originalAction = URL_CREAR_CARGO;

  btnMostrar.addEventListener("click", () => {
    form.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = "";
  });

  btnCancelar.addEventListener("click", () => {
    form.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = "";
  });

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      inputId.value = btn.dataset.id;
      inputDescripcion.value = btn.dataset.descripcion;
      formElement.action = `/cargos/editar/${btn.dataset.id}/`;
      form.style.display = "block";
      btnMostrar.style.display = "none";
    });
  });

  const tabla = document.getElementById("tablaCuerpo");
  const buscar = document.getElementById("buscarCargo");
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
    todasLasFilas.forEach((fila) => (fila.style.display = "none"));
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
    infoRegistros.textContent =
      total === 0
        ? "No se encontraron resultados."
        : `Mostrando de ${inicio} a ${fin} de ${total} registros`;
  }

  function actualizarPaginacion(pagina) {
    const totalPaginas = Math.ceil(rows.length / filasPorPagina);
    paginacion.innerHTML = "";

    if (pagina > 1) {
      const prev = document.createElement("button");
      prev.textContent = "Anterior";
      prev.onclick = () => {
        paginaActual--;
        mostrarPagina(paginaActual);
      };
      paginacion.appendChild(prev);
    }

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === pagina) btn.classList.add("active");
      btn.onclick = () => {
        paginaActual = i;
        mostrarPagina(i);
      };
      paginacion.appendChild(btn);
    }

    if (pagina < totalPaginas) {
      const next = document.createElement("button");
      next.textContent = "Siguiente";
      next.onclick = () => {
        paginaActual++;
        mostrarPagina(paginaActual);
      };
      paginacion.appendChild(next);
    }
  }

  function aplicarFiltro() {
    const texto = buscar.value.toLowerCase();
    const estadoSeleccionado = filtroEstado.value.toLowerCase();

    rows = todasLasFilas.filter((row) => {
      const contenido = row.textContent.toLowerCase();
      const spanEstado = row.querySelector(".estado");
      const estado = spanEstado?.classList.contains("activo") ? "activo" : "inactivo";

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
