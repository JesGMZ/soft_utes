document.addEventListener("DOMContentLoaded", () => {
    const tablaEquipos = document.querySelector(".equipos-table tbody");
    const buscar = document.getElementById("buscarEquipos");
    const filtroEstado = document.getElementById("filtroEstado");
    const mostrar = document.getElementById("mostrar");
    const paginacion = document.getElementById("paginacion");
    const infoRegistros = document.getElementById("infoRegistros");
  
    const btnMostrar = document.getElementById("btnMostrarFormulario");
    const btnCancelar = document.getElementById("btnCancelarFormulario");
    const form = document.getElementById("formEquipo");
    const formAction = document.getElementById("formularioEquipo");
    const originalAction = formAction.getAttribute("action");
  
    const idInput = document.getElementById("idEquipoInformatico");
    const nombreInput = document.getElementById("nombre");
    const serieInput = document.getElementById("serie");
    const modeloInput = document.getElementById("modelo");
    const tipoHidden = document.getElementById("tipoHidden");
    const tipoVisual = document.getElementById("tipoVisual");
    const patrimonioInput = document.getElementById("patrimonio");
    const observacionInput = document.getElementById("observacion");
    const garantiaInput = document.getElementById("garantia");
    const imagenPreview = document.getElementById("imagenPreview");
    const grupoImagenPreview = document.getElementById("grupoImagenPreview");
  
    const modeloInputText = document.getElementById("modeloInput");
    const modeloInputHidden = document.getElementById("modelo");
    const dataListModelos = document.getElementById("listaModelos");
  
    const cantidadLoteInput = document.getElementById("cantidadLote");
    const modeloLoteSelect = document.getElementById("modeloLote");
    const fechaAdquisicionInput = document.getElementById("fechaAdquisicionLote");
    const contenedorEquiposLote = document.getElementById("contenedorEquiposLote");
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]')?.value;
    const registrarLoteBtn = document.getElementById("registrarLoteBtn");
  
  if (registrarLoteBtn) {
    registrarLoteBtn.addEventListener("click", async () => {
      const modeloId = modeloLoteSelect.value;
      const tipoId = document.getElementById("tipoVisual").value;
      const fecha = fechaAdquisicionInput.value;
      const cantidad = parseInt(cantidadLoteInput.value);
      const tipoTexto = tipoVisual.options[tipoVisual.selectedIndex]?.text;
      const contenedor = document.getElementById("contenedorEquiposLote");
  
      if (!modeloId || !tipoId || !fecha || !cantidad) {
        alert("Debe completar todos los datos del lote.");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append("idModelo", modeloId);
        formData.append("idTipoEquipo", tipoId);
        formData.append("fechaAdquisicion", fecha);
        formData.append("cantidad", cantidad);
  
        const response = await fetch(URL_CREAR_LOTE, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          body: formData
        });
  
        if (!response.ok) throw new Error("Error al registrar lote.");
  
        const data = await response.json();
        const idLote = data.idLote;
  
        // 🧱 Generar bloques de equipos automáticamente
        contenedor.innerHTML = ""; // Limpiar anterior
  
        const formularios = [];
  
        for (let i = 1; i <= cantidad; i++) {
          const form = document.createElement("form");
          form.classList.add("card", "form-lote-generado");
          form.method = "POST";
          form.action = URL_CREAR_EQUIPO;
  
          form.innerHTML = `
            <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
            <input type="hidden" name="idModelo" value="${modeloId}">
            <input type="hidden" name="fechaAdquisicion" value="${fecha}">
            <input type="hidden" name="idTipoEquipo" value="${tipoId}">
            <input type="hidden" name="idLote" value="${idLote}">
  
            <div class="form-row">
              <label>Tipo de Equipo:</label>
              <input type="text" value="${tipoTexto}" readonly>
  
              <label>Nombre:</label>
              <input type="text" name="nombreEquipoInformatico" required>
  
              <label>Número de Serie:</label>
              <input type="text" name="numeroSerie">
  
              <label>Código Patrimonial:</label>
              <input type="text" name="codigoPatrimonial">
  
              <label>Año de Garantía:</label>
              <input type="number" name="añoGarantia">
  
              <label>Observación:</label>
              <input type="text" name="observacionEquipo">
            </div>
  
            <div class="form-row">
              <label>Descripción:</label>
              <div class="radio-group" style="display: flex; gap: 20px; margin-top: 8px;">
                <label><input type="radio" name="descripcionEquipo" value="De Marca" checked> De Marca</label>
                <label><input type="radio" name="descripcionEquipo" value="Compatible"> Compatible</label>
                <label><input type="radio" name="descripcionEquipo" value="Otros"> Otros</label>
              </div>
            </div>
          `;
  
          formularios.push(form);
          contenedor.appendChild(form);
        }
  
        // 🔘 Botón único para guardar todos los equipos del lote
        const btnGuardarTodos = document.createElement("button");
        btnGuardarTodos.textContent = "💾 Guardar Todos los Equipos del Lote";
        btnGuardarTodos.classList.add("btn-guardar-lote");
        btnGuardarTodos.style.marginTop = "20px";
        btnGuardarTodos.style.padding = "10px 15px";
        btnGuardarTodos.style.backgroundColor = "#007bff";
        btnGuardarTodos.style.color = "white";
        btnGuardarTodos.style.border = "none";
        btnGuardarTodos.style.borderRadius = "5px";
        btnGuardarTodos.style.cursor = "pointer";
  
        btnGuardarTodos.addEventListener("click", async () => {
          let errores = 0;
          for (const form of formularios) {
            const formData = new FormData(form);
            try {
              const response = await fetch(URL_CREAR_EQUIPO, {
                method: "POST",
                headers: {
                  "X-CSRFToken": csrfToken
                },
                body: formData
              });
  
              if (!response.ok) throw new Error("Error al guardar equipo");
  
              // Éxito visual
              form.style.border = "2px solid green";
              form.querySelectorAll("input, button").forEach(el => el.disabled = true);
            } catch (error) {
              errores++;
              form.style.border = "2px solid red";
              console.error(error);
            }
          }
  
          if (errores === 0) {
            alert("✅ Todos los equipos fueron registrados correctamente.");
            window.location.href = URL_LISTAR_EQUIPOS;
          } else {
            alert(`⚠️ Se guardaron algunos equipos, pero ${errores} formularios tuvieron errores.`);
          }
        });
  
        contenedor.appendChild(btnGuardarTodos);
  
        alert(`✅ Lote registrado con ID: ${idLote}. Se generaron ${cantidad} formularios de equipos.`);
  
      } catch (error) {
        console.error("❌ Error al registrar lote:", error);
        alert("Error al registrar el lote. Intenta de nuevo.");
      }
    });
  }
  
  
    tipoVisual.addEventListener("change", () => {
      tipoHidden.value = tipoVisual.value;
    });
  
    modeloInputText.addEventListener("input", () => {
      const valor = modeloInputText.value.trim().toLowerCase();
      const opciones = dataListModelos.querySelectorAll("option");
      let encontrado = false;
  
      opciones.forEach(opcion => {
        if (opcion.value.toLowerCase() === valor) {
          modeloInputHidden.value = opcion.dataset.id;
          encontrado = true;
  
          const imagenUrl = opcion.dataset.imagen;
          if (imagenUrl) {
            imagenPreview.src = imagenUrl;
            grupoImagenPreview.style.display = "flex";
          } else {
            imagenPreview.src = "";
            grupoImagenPreview.style.display = "none";
          }
        }
      });
  
      if (!encontrado) {
        modeloInputHidden.value = "";
        imagenPreview.src = "";
        grupoImagenPreview.style.display = "none";
      }
    });
  
    btnMostrar?.addEventListener("click", () => {
      form.style.display = "block";
      btnMostrar.style.display = "none";
      formAction.action = originalAction;
      formAction.reset();
      idInput.value = "";
      tipoHidden.value = tipoVisual.value;
      imagenPreview.src = "";
      grupoImagenPreview.style.display = "none";
    });
  
    btnCancelar?.addEventListener("click", () => {
      form.style.display = "none";
      btnMostrar.style.display = "inline-block";
      formAction.reset();
      idInput.value = "";
      formAction.action = originalAction;
      tipoVisual.value = "";
      tipoHidden.value = "";
      imagenPreview.src = "";
      grupoImagenPreview.style.display = "none";
    });
  
    document.querySelectorAll(".btn.amarillo").forEach(btn => {
      btn.addEventListener("click", () => {
        idInput.value = btn.dataset.id;
        nombreInput.value = btn.dataset.nombre;
        serieInput.value = btn.dataset.serie;
  
        const modeloOption = [...dataListModelos.options].find(opt => opt.dataset.id === btn.dataset.modelo);
        if (modeloOption) {
          modeloInputText.value = modeloOption.value;
          modeloInputHidden.value = modeloOption.dataset.id;
        }
  
        patrimonioInput.value = btn.dataset.patrimonio;
        observacionInput.value = btn.dataset.observacion;
        garantiaInput.value = btn.dataset.garantia;
  
        tipoVisual.value = btn.dataset.tipo;
        tipoHidden.value = btn.dataset.tipo;
  
        document.querySelectorAll('input[name="descripcionEquipo"]').forEach(radio => {
          radio.checked = (radio.value.toLowerCase() === btn.dataset.descripcion.toLowerCase());
        });
  
        const estadoSelect = document.getElementById("estado");
        if (estadoSelect) {
          for (const option of estadoSelect.options) {
            option.selected = option.value === btn.dataset.estado;
          }
        }
  
        modeloInput.dispatchEvent(new Event("change"));
  
        form.style.display = "block";
        btnMostrar.style.display = "none";
        formAction.action = `/equipos-informaticos/editar/${btn.dataset.id}/`;
      });
    });
  
    modeloInput.addEventListener("change", function () {
      const selectedOption = modeloInput.options[modeloInput.selectedIndex];
      const imagenUrl = selectedOption?.dataset?.imagen;
      if (imagenUrl) {
        imagenPreview.src = imagenUrl;
        grupoImagenPreview.style.display = "flex";
      } else {
        imagenPreview.src = "";
        grupoImagenPreview.style.display = "none";
      }
    });
  
    let todasLasFilas = Array.from(tablaEquipos.querySelectorAll("tr"));
    let rows = [...todasLasFilas];
    let paginaActual = 1;
    let filasPorPagina = parseInt(mostrar.value);
  
    function mostrarPagina(pagina) {
      const inicio = (pagina - 1) * filasPorPagina;
      const fin = inicio + filasPorPagina;
      
      // Primero ocultar todas las filas
      todasLasFilas.forEach(fila => {
        fila.style.display = 'none';
      });
      
      // Mostrar solo las filas de la página actual
      const filasAMostrar = rows.slice(inicio, fin);
      filasAMostrar.forEach(fila => {
        fila.style.display = '';
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
      const estadoSeleccionado = filtroEstado.value.toLowerCase();
      
      rows = todasLasFilas.filter(row => {
        const celdas = row.getElementsByTagName('td');
        let estado = '';
        
        // Buscar la celda que contiene el estado (asumiendo que es un span con clase 'estado')
        for (let celda of celdas) {
          const estadoElement = celda.querySelector('.estado');
          if (estadoElement) {
            estado = estadoElement.textContent.trim().toLowerCase();
            break;
          }
        }
        
        const contenido = row.textContent.toLowerCase();
        const coincideTexto = texto === '' || contenido.includes(texto);
        const coincideEstado = !estadoSeleccionado || estado === estadoSeleccionado;
        
        return coincideTexto && coincideEstado;
      });
      
      // Resetear a la primera página después de filtrar
      paginaActual = 1;
      mostrarPagina(paginaActual);
    }
  
    // Remover event listeners existentes para evitar duplicados
    const nuevoBuscar = buscar.cloneNode(true);
    buscar.parentNode.replaceChild(nuevoBuscar, buscar);
    
    const nuevoFiltroEstado = filtroEstado.cloneNode(true);
    filtroEstado.parentNode.replaceChild(nuevoFiltroEstado, filtroEstado);
    
    const nuevoMostrar = mostrar.cloneNode(true);
    mostrar.parentNode.replaceChild(nuevoMostrar, mostrar);
    
    // Asignar nuevos event listeners
    nuevoBuscar.addEventListener("keyup", function() {
      clearTimeout(this.timer);
      this.timer = setTimeout(aplicarFiltro, 300); // Debounce de 300ms
    });
    
    nuevoFiltroEstado.addEventListener("change", aplicarFiltro);
    
    nuevoMostrar.addEventListener("change", function() {
      filasPorPagina = parseInt(this.value);
      paginaActual = 1;
      mostrarPagina(paginaActual);
    });
    
    // Actualizar referencias a los elementos clonados
    buscar = nuevoBuscar;
    filtroEstado = nuevoFiltroEstado;
    mostrar = nuevoMostrar;
  
    aplicarFiltro();
  
    formAction.addEventListener("submit", function (e) {
      tipoHidden.value = tipoVisual.value;
      if (!tipoHidden.value) {
        e.preventDefault();
        alert("Debe seleccionar un tipo de equipo.");
        return;
      }
  
      if (!modeloInputHidden.value) {
        e.preventDefault();
        alert("Debe seleccionar un modelo válido de la lista.");
        return;
      }
    });
  });
  