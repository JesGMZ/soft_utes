  document.addEventListener("DOMContentLoaded", function () {
    const btnMostrar = document.getElementById("btnMostrarFormulario");
    const btnCancelar = document.getElementById("btnCancelarFormulario");
    const form = document.getElementById("formPersonal");
    const formElement = document.getElementById("personalForm");

    const inputId = document.getElementById("idPersonal");
    const inputDNI = document.getElementById("dni");
    const inputNombres = document.getElementById("nombres");
    const inputApellidos = document.getElementById("apellidos");
    const inputTelefono = document.getElementById("telefono");
    const inputCorreo = document.getElementById("correo");
    const selectEstablecimiento = document.getElementById("establecimiento");
    const selectCargo = document.getElementById("cargo");

    const originalAction = "{% url 'crear_personal' %}";

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

    const botonesEditar = document.querySelectorAll(".btn-editar");
    botonesEditar.forEach((btn) => {
      btn.addEventListener("click", function () {
        inputId.value = this.getAttribute("data-id");
        inputDNI.value = this.getAttribute("data-dni");
        inputNombres.value = this.getAttribute("data-nombres");
        inputApellidos.value = this.getAttribute("data-apellidos");
        inputTelefono.value = this.getAttribute("data-telefono");
        inputCorreo.value = this.getAttribute("data-correo");
        selectEstablecimiento.value = this.getAttribute("data-establecimiento");
        selectCargo.value = this.getAttribute("data-cargo");

        const editUrl = "{% url 'editar_personal' 0 %}".replace("0", inputId.value);
        formElement.action = editUrl;

        form.style.display = "block";
        btnMostrar.style.display = "none";
      });
    });

    // Filtro y paginación
    const tabla = document.getElementById("tablaPersonal");
    const buscar = document.getElementById("buscarPersonal");
    const filtroEstado = document.getElementById("filtroEstado");
    const mostrar = document.getElementById("mostrar");
    const paginacion = document.getElementById("paginacion");
    const infoRegistros = document.getElementById("infoRegistros");

    const todasLasFilas = Array.from(tabla.querySelectorAll("tr")).filter(
      row => row.querySelector(".estado") !== null
    );

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

    function aplicarFiltro() {
      const texto = buscar.value.toLowerCase();
      const estadoSeleccionado = filtroEstado.value.toLowerCase();

      rows = todasLasFilas.filter(row => {
        const spanEstado = row.querySelector(".estado");
        if (!spanEstado) return false;

        const estado = spanEstado.classList.contains("activo") ? "activo" : "inactivo";
        const coincideEstado = estadoSeleccionado === "" || estado === estadoSeleccionado;
        const coincideTexto = row.textContent.toLowerCase().includes(texto);

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