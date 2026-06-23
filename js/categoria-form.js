(function () {
  var form = document.querySelector(".form-card form");
  if (!form) return;

  var idEdit = FormatUtils.getParam("id");
  var returnUrl = FormatUtils.getParam("return");
  var titulo = document.querySelector(".page-header h2");
  var inputNombre = document.getElementById("nombre_cat");
  var inputDesc = document.getElementById("descripcion");
  var inputEstado = document.getElementById("estado");
  var inputOrden = document.getElementById("orden");

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

    var nombre = inputNombre.value.trim();
    if (!nombre) {
      UiUtils.mostrarMensaje("El nombre es obligatorio.", "error");
      return;
    }

    if (CategoriasData.existeNombre(nombre, idEdit)) {
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
        var destino = returnUrl.indexOf("?") >= 0 ? returnUrl + "&cat=" + idEdit : returnUrl + "?cat=" + idEdit;
        window.location.href = destino;
      } else {
        window.location.href = "categoria.html";
      }
    }, 600);
  });
})();
