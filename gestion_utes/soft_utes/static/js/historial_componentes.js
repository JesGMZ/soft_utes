document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");
  const buscar = document.getElementById("buscar");
  const mostrar = document.getElementById("mostrar");
  const paginacion = document.getElementById("paginacion");
  const infoRegistros = document.getElementById("infoRegistros");

  let todasLasFilas = Array.from(tabla.querySelectorAll("tr"));
  let filasPorPagina = parseInt(mostrar.value);
  let paginaActual = 1;
  let filasFiltradas = [...todasLasFilas];

  function aplicarBusqueda() {
    const texto = buscar.value.trim().toLowerCase();
    filasFiltradas = todasLasFilas.filter(fila =>
      fila.textContent.toLowerCase().includes(texto)
    );
    paginaActual = 1;
    mostrarPagina(paginaActual);
  }

  function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    filasFiltradas.forEach((fila, index) => {
      fila.style.display = (index >= inicio && index < fin) ? "" : "none";
    });

    actualizarInfo(pagina);
    actualizarPaginacion(pagina);
  }

  function actualizarInfo(pagina) {
    const total = filasFiltradas.length;
    const inicio = (pagina - 1) * filasPorPagina + 1;
    const fin = Math.min(inicio + filasPorPagina - 1, total);
    infoRegistros.textContent = total === 0
      ? "No se encontraron resultados."
      : `Mostrando de ${inicio} a ${fin} de ${total} registros`;
  }

  function actualizarPaginacion(pagina) {
    const totalPaginas = Math.ceil(filasFiltradas.length / filasPorPagina);
    paginacion.innerHTML = "";

    if (pagina > 1) {
      const prev = document.createElement("button");
      prev.textContent = "Anterior";
      prev.addEventListener("click", () => {
        paginaActual--;
        mostrarPagina(paginaActual);
      });
      paginacion.appendChild(prev);
    }

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === pagina) btn.classList.add("active");
      btn.addEventListener("click", () => {
        paginaActual = i;
        mostrarPagina(i);
      });
      paginacion.appendChild(btn);
    }

    if (pagina < totalPaginas) {
      const next = document.createElement("button");
      next.textContent = "Siguiente";
      next.addEventListener("click", () => {
        paginaActual++;
        mostrarPagina(paginaActual);
      });
      paginacion.appendChild(next);
    }
  }

  // Eventos
  mostrar.addEventListener("change", () => {
    filasPorPagina = parseInt(mostrar.value);
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });

  buscar.addEventListener("input", aplicarBusqueda);

  // Inicializar
  aplicarBusqueda();
});
