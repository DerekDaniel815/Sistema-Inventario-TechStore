var CategoriaProducto = {
  getNombreCategoria: function (idCat) {
    var cat = CategoriasData.getById(idCat);
    return cat ? cat.nombre : "Sin categoría";
  },

  hayCategoriasActivas: function () {
    return CategoriasData.getActivas().length > 0;
  },

  validarCategoriaParaProducto: function (idCat) {
    if (!idCat) {
      return { valido: false, mensaje: "Debes seleccionar una categoría." };
    }

    var cat = CategoriasData.getById(idCat);
    if (!cat) {
      return { valido: false, mensaje: "La categoría seleccionada no existe." };
    }
    if (cat.estado !== 1) {
      return {
        valido: false,
        mensaje: 'La categoría "' + cat.nombre + '" está inactiva. Elige otra o reactívala.'
      };
    }

    return { valido: true, categoria: cat };
  },

  puedeEliminarCategoria: function (id) {
    var productos = ProductosData.getByCategoria(id);
    if (productos.length > 0) {
      return {
        permitido: false,
        mensaje:
          "No se puede eliminar: hay " +
          productos.length +
          " producto(s) en esta categoría."
      };
    }
    return { permitido: true };
  },

  poblarSelect: function (selectEl, idSeleccionado) {
    if (!selectEl) return;

    var activas = CategoriasData.getActivas();
    var opciones = ['<option value="">-- Selecciona --</option>'];

    activas.forEach(function (cat) {
      opciones.push(
        '<option value="' + cat.id + '">' + cat.nombre + "</option>"
      );
    });

    if (idSeleccionado) {
      var catActual = CategoriasData.getById(idSeleccionado);
      if (catActual && catActual.estado !== 1) {
        opciones.push(
          '<option value="' +
            catActual.id +
            '">' +
            catActual.nombre +
            " (inactiva)</option>"
        );
      }
    }

    selectEl.innerHTML = opciones.join("");

    if (idSeleccionado) {
      selectEl.value = String(idSeleccionado);
    }
  },

  poblarFiltroCategorias: function (selectEl) {
    if (!selectEl) return;

    var cats = CategoriasData.getAll();
    selectEl.innerHTML =
      '<option value="">Todas</option>' +
      cats
        .map(function (c) {
          return '<option value="' + c.id + '">' + c.nombre + "</option>";
        })
        .join("");
  },

  mostrarAvisoSinCategorias: function (selectEl, formActions) {
    if (!selectEl) return;

    var avisoId = "aviso-sin-categorias";
    var existente = document.getElementById(avisoId);

    if (this.hayCategoriasActivas()) {
      if (existente) existente.remove();
      selectEl.disabled = false;
      if (formActions) {
        formActions.querySelector('[type="submit"]').disabled = false;
      }
      return;
    }

    selectEl.innerHTML =
      '<option value="">-- No hay categorías activas --</option>';
    selectEl.disabled = true;

    if (formActions) {
      formActions.querySelector('[type="submit"]').disabled = true;
    }

    if (!existente) {
      var aviso = document.createElement("p");
      aviso.id = avisoId;
      aviso.className = "form-help form-help-warning";
      aviso.innerHTML =
        'Primero debes <a href="../categoria/categoria-form.html?return=producto-form.html">crear una categoría</a> antes de registrar productos.';
      selectEl.parentElement.appendChild(aviso);
    }
  }
};
