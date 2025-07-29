 document.addEventListener("DOMContentLoaded", function () {
    const btnMostrar = document.getElementById("btnMostrarFormulario");
    const form = document.getElementById("formNuevaMarca");
    const btnCancelar = document.getElementById("btnCancelarFormulario");
    const inputNombre = document.getElementById("nombreMarca");
    const inputId = document.getElementById("idMarca");
    const marcaForm = document.getElementById("marcaForm");
    const originalAction = URL_CREAR_MARCA;

    btnMostrar.addEventListener("click", () => {
      form.style.display = "block";
      btnMostrar.style.display = "none";
      marcaForm.action = originalAction;
      inputId.value = '';
      inputNombre.value = '';
      inputNombre.focus();
    });

    btnCancelar.addEventListener("click", () => {
      form.style.display = "none";
      btnMostrar.style.display = "inline-block";
      marcaForm.action = originalAction;
      inputId.value = '';
      inputNombre.value = '';
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const nombre = this.getAttribute("data-nombre");
        inputId.value = id;
        inputNombre.value = nombre;
        marcaForm.action = `/marcas/editar/${id}/`;
        form.style.display = "block";
        btnMostrar.style.display = "none";
        inputNombre.focus();
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        if (!confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
          e.preventDefault();
        }
      });
    });

    // Búsqueda y paginación
    const tabla = document.getElementById("tablaMarcas");
    const buscar = document.getElementById("buscarMarcas");
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

    function aplicarFiltro() {
      const texto = buscar.value.toLowerCase();
      rows = todasLasFilas.filter(row => row.textContent.toLowerCase().includes(texto));
      paginaActual = 1;
      mostrarPagina(paginaActual);
    }

    buscar.addEventListener("keyup", aplicarFiltro);
    mostrar.addEventListener("change", () => {
      filasPorPagina = parseInt(mostrar.value);
      paginaActual = 1;
      mostrarPagina(paginaActual);
    });

    aplicarFiltro(); 
    
    filtroEstado.dispatchEvent(new Event("change"));
    const filtroEstado = document.getElementById("filtroEstado");

    filtroEstado.addEventListener("change", () => {
      const valor = filtroEstado.value;

      rows = todasLasFilas.filter(row => {
        const textoEstado = row.querySelector(".estado")?.textContent.trim().toUpperCase();
        if (valor === "TODOS") return true;
        return textoEstado === valor;
      });

      paginaActual = 1;
      mostrarPagina(paginaActual);
    });
  });