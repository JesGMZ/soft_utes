document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaCuerpo");
  const buscar = document.getElementById("buscar");
  const mostrar = document.getElementById("mostrar");
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  // Si luego usas manualmente filtroEstado/filtroTipo
  const filtroEstado = document.getElementById("filtroEstado");
  const filtroTipo = document.getElementById("filtroTipo");

  const todasLasFilas = Array.from(tabla.querySelectorAll("tr"));
  let rows = [...todasLasFilas];
  let paginaActual = 1;
  let filasPorPagina = parseInt(mostrar.value);

  function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    rows.forEach((fila, i) => {
      fila.style.display = (i >= inicio && i < fin) ? "" : "none";
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

  function aplicarBusqueda() {
    const texto = buscar.value.toLowerCase();
    rows = todasLasFilas.filter(row => row.textContent.toLowerCase().includes(texto));
    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  // Filtros que puedes usar manualmente desde consola o botones
  window.filtrarPorEstadoYTipo = function(estado = "", tipo = "") {
    const estadoFiltro = estado.toLowerCase();
    const tipoFiltro = tipo.toLowerCase();

    rows = todasLasFilas.filter(row => {
      const celdas = row.querySelectorAll("td");
      if (celdas.length === 0) return false;

      const tipoEquipo = celdas[2]?.textContent.toLowerCase() || "";
      const estadoElemento = celdas[7]?.querySelector('.estado');
      const estadoTexto = estadoElemento ? estadoElemento.textContent.trim().toLowerCase() : "";

      const coincideEstado = !estadoFiltro || estadoTexto === estadoFiltro;
      const coincideTipo = !tipoFiltro || tipoEquipo === tipoFiltro;

      return coincideEstado && coincideTipo;
    });

    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  // Eventos activos: búsqueda y cantidad a mostrar
  buscar.addEventListener("input", aplicarBusqueda);
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    mostrarPagina(1);
  });

  aplicarBusqueda(); // Inicializa con búsqueda vacía
});
