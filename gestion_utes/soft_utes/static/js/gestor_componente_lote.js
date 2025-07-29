document.addEventListener("DOMContentLoaded", () => {
  const generarBtn = document.getElementById("generarLoteBtn");
  const guardarTodosBtn = document.getElementById("btnGuardarTodosComponentes");
  const contenedor = document.getElementById("contenedorComponentesLote");
  const cantidadInput = document.getElementById("cantidadLote");
  const fechaAdqInput = document.getElementById("fechaAdquisicion");
  const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;

  generarBtn.addEventListener("click", () => {
    const cantidad = parseInt(cantidadInput.value);
    const modeloId = document.getElementById("modelo").value;
    const tipoId = document.getElementById("idTipoComponente").value;
    const fechaAdquisicion = fechaAdqInput.value;

    if (!cantidad || cantidad < 1) {
      alert("Ingrese una cantidad válida.");
      return;
    }

    if (!modeloId || !tipoId) {
      alert("Debe seleccionar un tipo y un modelo.");
      return;
    }

    if (!fechaAdquisicion) {
      alert("Debe ingresar una fecha de adquisición.");
      return;
    }

    contenedor.innerHTML = "";

    for (let i = 1; i <= cantidad; i++) {
      const form = document.createElement("form");
      form.classList.add("card", "form-componente-lote");
      form.innerHTML = `
        <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
        <input type="hidden" name="idModelo" value="${modeloId}">
        <input type="hidden" name="idTipoComponente" value="${tipoId}">
        <input type="hidden" name="fechaAdquisicion" value="${fechaAdquisicion}">
        <input type="hidden" name="cantidad" value="${cantidad}">

        <div class="form-row">
          <label>N° Serie:</label>
          <input type="text" name="numeroSerie" required>
        </div>
      `;
      contenedor.appendChild(form);
    }

    contenedor.style.display = "block";
  });

  guardarTodosBtn.addEventListener("click", async () => {
    const formularios = document.querySelectorAll(".form-componente-lote");
    const caracteristicas = Array.from(document.querySelectorAll("#characteristicsContainer input"));
    const seriesLote = new Set();
    let errores = 0;
    let formulariosValidos = [];

    formularios.forEach((form) => {
      const numeroSerie = form.querySelector("[name='numeroSerie']").value.trim();
      let hayError = false;

      form.style.border = "none";

      if (!numeroSerie) {
        form.style.border = "2px solid red";
        hayError = true;
      }

      if (seriesLote.has(numeroSerie)) {
        form.style.border = "2px solid red";
        hayError = true;
      }

      caracteristicas.forEach((input) => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          form.style.border = "2px solid red";
          hayError = true;
        }
      });

      if (hayError) {
        errores++;
      } else {
        seriesLote.add(numeroSerie);
        formulariosValidos.push(form);
      }
    });

    if (errores > 0) {
      alert(`⚠️ Corrige los errores en ${errores} formulario(s) antes de continuar.`);
      return;
    }

    let erroresEnvio = 0;

    for (const form of formulariosValidos) {
      const formData = new FormData(form);
      caracteristicas.forEach(input => {
        formData.append(input.name, input.value);
      });

      try {
        const response = await fetch(URL_CREAR_COMPONENTE, {
          method: "POST",
          headers: { "X-CSRFToken": csrfToken },
          body: formData
        });

        if (!response.ok) throw new Error("Error al registrar.");

        form.style.border = "2px solid green";
        form.querySelectorAll("input").forEach(i => i.disabled = true);

      } catch (err) {
        erroresEnvio++;
        form.style.border = "2px solid red";
        console.error(err);
      }
    }

    if (erroresEnvio === 0) {
      alert("✅ Todos los componentes fueron registrados correctamente.");
      window.location.href = URL_LISTA_COMPONENTES;
    } else {
      alert(`⚠️ Se detectaron errores en ${erroresEnvio} formulario(s) durante el registro.`);
    }
  });
});
