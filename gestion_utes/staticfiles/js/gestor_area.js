document.addEventListener("DOMContentLoaded", function () {
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const formContainer = document.getElementById("formNuevaArea");
  const formElement = document.getElementById("areaForm");
  const inputId = document.getElementById("idArea");
  const inputNombre = document.getElementById("nombre");
  const selectEstablecimiento = document.getElementById("establecimiento");
  const originalAction = formElement.getAttribute("action");

  btnMostrar.addEventListener("click", () => {
    formContainer.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = originalAction;
    formElement.reset();
    inputId.value = '';
  });

  btnCancelar.addEventListener("click", () => {
    formContainer.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = originalAction;
    inputId.value = '';
    formElement.reset();
  });

  // Asegúrate de tener botones con clase .btn-editar si usas esta parte
  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      inputId.value = btn.dataset.id;
      inputNombre.value = btn.dataset.nombre;
      selectEstablecimiento.value = btn.dataset.establecimiento;
      formElement.action = `/areas/editar/${btn.dataset.id}/`;
      formContainer.style.display = "block";
      btnMostrar.style.display = "none";
    });
  });

  // FILTRO Y PAGINACIÓN
  const tabla = document.getElementById("tablaAreas");
  const buscar = document.getElementById("buscarAreas");
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

  function aplicarFiltros() {
    const texto = buscar.value.toLowerCase();
    const estado = filtroEstado.value;

    rows = todasLasFilas.filter(row => {
      const contenidoTexto = row.textContent.toLowerCase();
      const estadoRow = row.querySelector(".estado")?.classList.contains("activo") ? "activo" : "inactivo";
      return contenidoTexto.includes(texto) && (estado === "" || estado === estadoRow);
    });

    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  buscar.addEventListener("keyup", aplicarFiltros);
  filtroEstado.addEventListener("change", aplicarFiltros);
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });

  aplicarFiltros();  // Ejecutar al cargar
});
