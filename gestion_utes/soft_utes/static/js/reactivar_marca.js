document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaMarcas");

  if (!tabla) return;

  tabla.querySelectorAll("tr").forEach(row => {
    const estadoSpan = row.querySelector(".estado");
    const operacionesTd = row.querySelector("td:last-child");

    if (!estadoSpan || !operacionesTd) return;

    const esInactivo = estadoSpan.classList.contains("inactivo");

    if (esInactivo) {
      const btnEditar = row.querySelector(".btn-edit");
      const idMarca = btnEditar?.dataset.id;

      if (!idMarca) return;

      // Limpia operaciones existentes
      operacionesTd.innerHTML = "";

      // Crear botón reactivar
      const btnReactivar = document.createElement("a");
      btnReactivar.textContent = "✅ Reactivar";
      btnReactivar.href = `/marcas/reactivar/${idMarca}/`;
      btnReactivar.classList.add("btn", "verde");  // <- aquí la solución real

      operacionesTd.appendChild(btnReactivar);
    }
  });
});
