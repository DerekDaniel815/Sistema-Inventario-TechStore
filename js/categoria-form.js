(function () {
  var form = document.querySelector(".form-card form");
  if (!form) return;

  form.setAttribute("novalidate", "novalidate");

  var idEdit = FormatUtils.getParam("id");
  var returnUrl = FormatUtils.getParam("return");
  var titulo = document.querySelector(".page-header h2");
  var inputNombre = document.getElementById("nombre_cat");
  var inputDesc = document.getElementById("descripcion");
  var inputEstado = document.getElementById("estado");
  var inputOrden = document.getElementById("orden");

  var campos = [
    {
      input: inputNombre,
      validar: function () {
        return FormValidacion.texto(inputNombre.value, 2, 80, {
          vacio: "El nombre de la categoría es obligatorio.",
          min: "El nombre debe tener al menos 2 caracteres.",
          max: "El nombre no puede superar 80 caracteres."
        });
      }
    },
    {
      input: inputDesc,
      validar: function () {
        var texto = inputDesc.value.trim();
        if (!texto) return "";
        if (texto.length < 5) {
          return "Si escribes descripción, usa al menos 5 caracteres.";
        }
        if (texto.length > 300) {
          return "La descripción no puede superar 300 caracteres.";
        }
        return "";
      },
      eventos: ["blur"]
    },
    {
      input: inputOrden,
      validar: function () {
        return FormValidacion.numero(inputOrden.value, {
          requerido: false,
          min: 0,
          entero: true,
          invalido: "El orden debe ser un número válido.",
          minMsg: "El orden no puede ser negativo.",
          enteroMsg: "El orden debe ser un número entero."
        });
      },
      eventos: ["blur"]
    }
  ];

  FormValidacion.enlazarTiempoReal(campos);

  form.addEventListener("reset", function () {
    setTimeout(function () {
      FormValidacion.limpiarFormulario(form);
    }, 0);
  });

  if (idEdit) {
    var cat = CategoriasData.getById(idEdit);
    if (!cat) {
      UiUtils.mostrarMensaje("Categoría no encontrada.", "error");
      return;
    }
    if (titulo) titulo.textContent = "Editar Categoría";
    inputNombre.value = cat.nombre;
    inputDesc.value = cat.descripcion || "";
    inputEstado.value = String(cat.estado);
    inputOrden.value = cat.orden || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!FormValidacion.validarCampos(campos)) {
      UiUtils.mostrarMensaje("Revisa los campos marcados en rojo.", "error");
      return;
    }

    var nombre = inputNombre.value.trim();

    if (CategoriasData.existeNombre(nombre, idEdit)) {
      FormValidacion.mostrarError(
        inputNombre,
        "Ya existe una categoría con ese nombre."
      );
      inputNombre.focus();
      UiUtils.mostrarMensaje("Ya existe una categoría con ese nombre.", "error");
      return;
    }

    var estadoNuevo = Number(inputEstado.value);
    var datos = {
      nombre: nombre,
      descripcion: inputDesc.value.trim(),
      estado: estadoNuevo,
      orden: Number(inputOrden.value) || 0
    };

    if (idEdit && estadoNuevo === 0) {
      var productos = ProductosData.getByCategoria(idEdit);
      if (productos.length > 0) {
        var msg =
          "Esta categoría tiene " +
          productos.length +
          " producto(s). Si la desactivas, no podrán asignarse productos nuevos a ella.";
        if (!UiUtils.confirmar(msg + " ¿Continuar?")) return;
      }
    }

    if (idEdit) {
      CategoriasData.actualizar(idEdit, datos);
      UiUtils.mostrarMensaje("Categoría actualizada.", "success");
    } else {
      var nueva = CategoriasData.crear(datos);
      idEdit = nueva.id;
      UiUtils.mostrarMensaje("Categoría registrada.", "success");
    }

    setTimeout(function () {
      if (returnUrl) {
        var destino =
          returnUrl.indexOf("?") >= 0
            ? returnUrl + "&cat=" + idEdit
            : returnUrl + "?cat=" + idEdit;
        window.location.href = destino;
      } else {
        window.location.href = "categoria.html";
      }
    }, 600);
  });
})();
