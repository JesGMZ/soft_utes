function actualizarMarca() {
  const modeloInput = document.getElementById('modeloInput');
  const datalist = document.getElementById('listaModelos');
  const marcaInput = document.getElementById('nombreMarca');
  const modeloHidden = document.getElementById('modelo');

  const selectedOption = Array.from(datalist.options).find(opt => opt.value === modeloInput.value);

  if (selectedOption) {
    const marca = selectedOption.getAttribute('data-marca');
    const idModelo = selectedOption.getAttribute('data-id');
    marcaInput.value = marca || '';
    modeloHidden.value = idModelo || '';
  } else {
    marcaInput.value = '';
    modeloHidden.value = '';
  }
}


function actualizarImagenModelo() {
  const modeloInput = document.getElementById('modeloInput');
  const datalist = document.getElementById('listaModelos');
  const selectedOption = Array.from(datalist.options).find(opt => opt.value === modeloInput.value);

  const imgElemento = document.getElementById('imagenActualModelo');
  const grupoImagen = document.getElementById('grupoImagenModelo');

  if (selectedOption) {
    const imagenUrl = selectedOption.getAttribute('data-imagen');
    if (imagenUrl) {
      imgElemento.src = imagenUrl;
      grupoImagen.style.display = "flex";
    } else {
      imgElemento.src = "";
      grupoImagen.style.display = "none";
    }
  } else {
    imgElemento.src = "";
    grupoImagen.style.display = "none";
  }
}


function loadCharacteristics(callback = null) {
  const tipoComponenteId = document.getElementById('idTipoComponente').value;
  const container = document.getElementById('characteristicsContainer');

  if (!tipoComponenteId) {
    container.innerHTML = '<p class="no-characteristics">Seleccione un tipo de componente para ver sus características</p>';
    return;
  }

  fetch(`/api/caracteristicas-por-tipo/${tipoComponenteId}/`)
    .then(response => response.json())
    .then(data => {
      let html = '';
      data.forEach(caracteristica => {
        html += `
          <div style="display: flex; align-items: center; margin-bottom: 10px; gap: 9px;">
            <label for="caracteristica_${caracteristica.idCaracteristica}" style="min-width: 200px; font-weight: bold;">
              ${caracteristica.descripcionCaracteristica}:
            </label>
            <input type="text"
                  id="caracteristica_${caracteristica.idCaracteristica}"
                  name="caracteristica_${caracteristica.idCaracteristica}"
                  ${caracteristica.requerido ? 'required' : ''}
                  style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">
          </div>`;
      });
      container.innerHTML = html;
      if (callback) callback();
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const btnNuevo = document.getElementById("btnNuevoComponente");
  const btnCancelar = document.getElementById("btnCancelarComponente");
  const formWrapper = document.getElementById("registroComponente");
  const formElement = document.getElementById("componenteForm");
  const originalAction = "{% url 'componente_create' %}";

  const inputId = document.getElementById("componenteId");
  const tipoSelect = document.getElementById("idTipoComponente");
  const modeloHidden = document.getElementById("modelo");
  const modeloInput = document.getElementById("modeloInput");
  const serieInput = document.getElementById("numeroSerie");
  const marcaInput = document.getElementById("nombreMarca");

  
  btnNuevo.addEventListener("click", () => {
    formWrapper.style.display = "block";
    btnNuevo.style.display = "none";
    formElement.action = originalAction;
    inputId.value = '';
    formElement.reset();
    setTimeout(() => {
      actualizarMarca();
      actualizarImagenModelo();
    }, 100);
    document.getElementById("characteristicsContainer").innerHTML =
      `<p class="no-characteristics">Seleccione un tipo de componente para ver sus características</p>`;
  });

  btnCancelar.addEventListener("click", () => {
    formWrapper.style.display = "none";
    btnNuevo.style.display = "inline-block";
    formElement.action = originalAction;
    inputId.value = '';
    formElement.reset();
  });

  const botonesEditar = document.querySelectorAll(".btn-editar");
  botonesEditar.forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      const tipo = this.dataset.tipo;
      const serie = this.dataset.serie;
      const modelo = this.dataset.modelo;
      const marca = this.dataset.marca;
      const caracteristicas = JSON.parse(this.dataset.caracteristicas);

      inputId.value = id;
      tipoSelect.value = tipo;
      modeloHidden.value = modelo;
        const modeloOption = Array.from(document.getElementById("listaModelos").options)
        .find(opt => opt.dataset.id === modelo);
        if (modeloOption) modeloInput.value = modeloOption.value;
      serieInput.value = serie;
      marcaInput.value = marca;

      formElement.action = `/componentes/editar/${id}/`;
      formWrapper.style.display = "block";
      btnNuevo.style.display = "none";

      actualizarMarca();
      actualizarImagenModelo();

      loadCharacteristics(() => {
        for (const key in caracteristicas) {
          const input = document.getElementById(key);
          if (input) input.value = caracteristicas[key];
        }
      });
    });
  });

  // Busqueda y paginación
  const tablaComp = document.getElementById("cuerpoTablaComponentes");
  const buscarComp = document.getElementById("buscarComponente");
  const mostrarComp = document.getElementById("mostrarComponentes");
  const paginacionComp = document.getElementById("paginacionComponentes");
  const infoComp = document.getElementById("infoRegistrosComponentes");

  let todasFilas = Array.from(tablaComp.querySelectorAll("tr"));
  let filasFiltradas = [...todasFilas];
  let pagina = 1;
  let porPagina = parseInt(mostrarComp.value);

  function mostrarPaginaComp(p) {
    const start = (p - 1) * porPagina;
    const end = start + porPagina;
    todasFilas.forEach(fila => fila.style.display = "none");
    filasFiltradas.forEach((fila, i) => {
      if (i >= start && i < end) fila.style.display = "";
    });
    actualizarInfoComp(p);
    actualizarPaginacionComp(p);
  }

  function actualizarInfoComp(p) {
    const total = filasFiltradas.length;
    const inicio = (p - 1) * porPagina + 1;
    const fin = Math.min(inicio + porPagina - 1, total);
    infoComp.textContent = total === 0 ? "No se encontraron resultados." : `Mostrando de ${inicio} a ${fin} de ${total} registros`;
  }

  function actualizarPaginacionComp(p) {
    const totalPaginas = Math.ceil(filasFiltradas.length / porPagina);
    paginacionComp.innerHTML = "";

    if (p > 1) {
      const btnAnt = document.createElement("button");
      btnAnt.textContent = "Anterior";
      btnAnt.onclick = () => { pagina--; mostrarPaginaComp(pagina); };
      paginacionComp.appendChild(btnAnt);
    }

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === p) btn.classList.add("active");
      btn.onclick = () => { pagina = i; mostrarPaginaComp(i); };
      paginacionComp.appendChild(btn);
    }

    if (p < totalPaginas) {
      const btnSig = document.createElement("button");
      btnSig.textContent = "Siguiente";
      btnSig.onclick = () => { pagina++; mostrarPaginaComp(pagina); };
      paginacionComp.appendChild(btnSig);
    }
  }

    function filtrarComponentes() {
    const term = buscarComp.value.toLowerCase();
    const estadoSeleccionado = document.getElementById("filtroEstadoComponente").value;
    filasFiltradas = todasFilas.filter(row => {
        const contenido = row.textContent.toLowerCase();
        const coincideTexto = contenido.includes(term);

        if (!estadoSeleccionado) return coincideTexto;

        const estado = row.querySelector("td:nth-child(4)").innerText.toLowerCase();
        return coincideTexto && estado === estadoSeleccionado;
    });

    pagina = 1;
    mostrarPaginaComp(pagina);
    }
  buscarComp.addEventListener("keyup", filtrarComponentes);
  mostrarComp.addEventListener("change", () => {
    porPagina = parseInt(mostrarComp.value);
    pagina = 1;
    mostrarPaginaComp(pagina);
  });

  filtrarComponentes();
  document.getElementById("filtroEstadoComponente").addEventListener("change", filtrarComponentes);


    formElement.addEventListener("submit", function (e) {
    const modeloInputValue = modeloInput.value.trim();
    const optionMatch = Array.from(document.getElementById("listaModelos").options)
      .find(opt => opt.value === modeloInputValue);

    if (!optionMatch) {
      e.preventDefault();
      alert("Debe seleccionar un modelo válido de la lista.");
      return;
    }

    modeloHidden.value = optionMatch.getAttribute("data-id"); // asegura el ID correcto
  });
  
});