document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formActa");
  const formElement = document.getElementById("actaForm");
  const btnMostrar = document.getElementById("btnMostrarFormulario");
  const btnCancelar = document.getElementById("btnCancelarFormulario");
  const buscar = document.getElementById("buscar");
  const mostrar = document.getElementById("mostrar");
  const filtroEstado = document.getElementById("filtroEstado");
  const tabla = document.getElementById("tablaCuerpo");
  const filas = Array.from(tabla.getElementsByTagName("tr"));
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let timeoutBusqueda;
  let filasPorPagina = parseInt(localStorage.getItem('filasPorPaginaActas')) || 10;
  let paginaActual = 1;
  let filasFiltradas = [];

  mostrar.value = filasPorPagina;

  const inputId = document.getElementById("idActa");
  const inputCod = document.getElementById("codReq");
  const selectEstablecimiento = document.getElementById("idEstablecimiento");
  const selectPersonal = document.getElementById("idPersonal");
  const selectFormato = document.getElementById("idFormato");

  // Mostrar formulario de nueva acta
  btnMostrar.addEventListener("click", () => {
    form.style.display = "block";
    btnMostrar.style.display = "none";
    formElement.action = URL_CREAR_ACTA;
    formElement.reset();
    inputId.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Cancelar formulario
  btnCancelar.addEventListener("click", () => {
    form.style.display = "none";
    btnMostrar.style.display = "inline-block";
    formElement.action = URL_CREAR_ACTA;
    inputId.value = '';
    formElement.reset();
  });

  // Editar acta
  const botonesEditar = document.querySelectorAll(".btn.amarillo");
  botonesEditar.forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const codigo = this.getAttribute("data-codigo");
      const idEstablecimiento = this.getAttribute("data-establecimiento");
      const idPersonal = this.getAttribute("data-personal");
      const idFormato = this.getAttribute("data-formato");

      inputId.value = id;
      inputCod.value = codigo;
      if (selectEstablecimiento) selectEstablecimiento.value = idEstablecimiento;
      if (selectPersonal) selectPersonal.value = idPersonal;
      if (selectFormato) selectFormato.value = idFormato;

      formElement.action = `/actas/editar/${id}/`;
      form.style.display = "block";
      btnMostrar.style.display = "none";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Filtro dinámico (búsqueda y estado)
  function aplicarFiltro() {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(() => {
      const texto = buscar.value.trim().toLowerCase();
      const estadoSeleccionado = filtroEstado.value;

      filasFiltradas = filas.filter(fila => {
        const celdas = Array.from(fila.getElementsByTagName('td'));
        const estadoTexto = celdas[4]?.innerText.trim().toUpperCase();

        const coincideEstado = !estadoSeleccionado || estadoTexto === estadoSeleccionado;
        const coincideTexto = celdas.some(celda => {
          if (celda.querySelector('.btn-acciones')) return false;
          return celda.textContent.toLowerCase().includes(texto);
        });

        return coincideEstado && coincideTexto;
      });

      mostrarFilas();
    }, 300);
  }

  // Mostrar la tabla paginada
  function mostrarFilas() {
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    filas.forEach(fila => fila.style.display = "none");

    filasFiltradas.forEach((fila, i) => {
      if (i >= inicio && i < fin) fila.style.display = "";
    });

    actualizarPaginacion();
    actualizarInfo();
  }

  // Actualizar info de registros
  function actualizarInfo() {
    const total = filasFiltradas.length;
    const inicio = total > 0 ? (paginaActual - 1) * filasPorPagina + 1 : 0;
    const fin = Math.min(inicio + filasPorPagina - 1, total);

    if (total === 0) {
      infoRegistros.textContent = "No se encontraron registros";
    } else {
      infoRegistros.textContent = `Mostrando ${inicio} a ${fin} de ${total} registros`;
    }
  }

  // Paginación
  function actualizarPaginacion() {
    paginacion.innerHTML = "";
    const totalPaginas = Math.ceil(filasFiltradas.length / filasPorPagina);

    if (totalPaginas <= 1) return;

    const crearBtn = (text, active, onClick, disabled = false) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      if (active) btn.classList.add("active");
      if (disabled) btn.disabled = true;
      btn.onclick = onClick;
      paginacion.appendChild(btn);
    };

    crearBtn("«", false, () => cambiarPagina(1), paginaActual === 1);
    crearBtn("‹", false, () => cambiarPagina(paginaActual - 1), paginaActual === 1);

    for (let i = 1; i <= totalPaginas; i++) {
      crearBtn(i, i === paginaActual, () => cambiarPagina(i));
    }

    crearBtn("›", false, () => cambiarPagina(paginaActual + 1), paginaActual === totalPaginas);
    crearBtn("»", false, () => cambiarPagina(totalPaginas), paginaActual === totalPaginas);
  }

  function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarFilas();
    document.querySelector('.card-lista').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Eventos
  buscar.addEventListener("input", aplicarFiltro);
  filtroEstado.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltro();
  });

  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    localStorage.setItem('filasPorPaginaActas', filasPorPagina);
    paginaActual = 1;
    mostrarFilas();
  });

  // Inicialización
  aplicarFiltro();
});
