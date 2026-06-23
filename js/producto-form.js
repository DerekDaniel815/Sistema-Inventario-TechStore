(function () {
  var form = document.querySelector(".form-card form");
  if (!form) return;

  var idEdit = FormatUtils.getParam("id");
  var catPreseleccionada = FormatUtils.getParam("cat");
  var titulo = document.querySelector(".page-header h2");
  var selectCat = document.getElementById("id_cat");
  var formActions = document.querySelector(".form-actions");
  var inputNombre = document.getElementById("nombre");
  var inputDesc = document.getElementById("descripcion");
  var inputMarca = document.getElementById("marca");
  var inputPrecio = document.getElementById("precio");
  var inputStock = document.getElementById("stock");
  var inputSku = document.getElementById("sku");
  var inputEstado = document.getElementById("estado");
  var inputFoto = document.getElementById("foto");
  var fotoActual = "";
  var idCatInicial = catPreseleccionada ? Number(catPreseleccionada) : null;

  function refrescarSelectCategorias() {
    CategoriaProducto.poblarSelect(selectCat, idCatInicial);
    CategoriaProducto.mostrarAvisoSinCategorias(selectCat, formActions);
  }

  refrescarSelectCategorias();

  if (idEdit) {
    var prod = ProductosData.getById(idEdit);
    if (!prod) {
      UiUtils.mostrarMensaje("Producto no encontrado.", "error");
      return;
    }
    if (titulo) titulo.textContent = "Editar Producto";
    idCatInicial = prod.id_cat;
    refrescarSelectCategorias();

    inputNombre.value = prod.nombre;
    inputDesc.value = prod.descripcion || "";
    inputMarca.value = prod.marca || "";
    inputPrecio.value = prod.precio;
    inputStock.value = prod.stock;
    inputSku.value = prod.sku || "";
    inputEstado.value = String(prod.estado);
    fotoActual = prod.foto || "";
  } else if (catPreseleccionada) {
    selectCat.value = catPreseleccionada;
  }

  var linkCategoria = document.querySelector('.form-help a[href*="categoria-form"]');
  if (linkCategoria) {
    linkCategoria.href = "../categoria/categoria-form.html?return=producto-form.html";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nombre = inputNombre.value.trim();
    var idCat = Number(selectCat.value);
    var precio = Number(inputPrecio.value);

    if (!nombre) {
      UiUtils.mostrarMensaje("El nombre es obligatorio.", "error");
      return;
    }

    var validacionCat = CategoriaProducto.validarCategoriaParaProducto(idCat);
    if (!validacionCat.valido) {
      UiUtils.mostrarMensaje(validacionCat.mensaje, "error");
      return;
    }

    if (isNaN(precio) || precio < 0) {
      UiUtils.mostrarMensaje("Precio inválido.", "error");
      return;
    }

    var guardar = function (foto) {
      var stockNuevo = Number(inputStock.value) || 0;
      var datos = {
        nombre: nombre,
        descripcion: inputDesc.value.trim(),
        id_cat: idCat,
        marca: inputMarca.value.trim(),
        precio: precio,
        stock: stockNuevo,
        sku: inputSku.value.trim(),
        estado: Number(inputEstado.value),
        foto: foto
      };

      if (idEdit) {
        var prodAnterior = ProductosData.getById(idEdit);
        ProductosData.actualizar(idEdit, datos);

        if (prodAnterior && stockNuevo !== prodAnterior.stock) {
          MovimientosData.registrarCambioStock(idEdit, prodAnterior.stock, stockNuevo);
        }

        UiUtils.mostrarMensaje(
          'Producto actualizado en "' + validacionCat.categoria.nombre + '".',
          "success"
        );
      } else {
        var nuevo = ProductosData.crear(datos);
        if (stockNuevo > 0) {
          MovimientosData.registrarCambioStock(nuevo.id, 0, stockNuevo);
        }
        UiUtils.mostrarMensaje(
          'Producto registrado en "' + validacionCat.categoria.nombre + '".',
          "success"
        );
      }

      setTimeout(function () {
        window.location.href = "producto.html";
      }, 600);
    };

    if (inputFoto.files && inputFoto.files[0]) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        guardar(ev.target.result);
      };
      reader.readAsDataURL(inputFoto.files[0]);
    } else {
      guardar(fotoActual);
    }
  });
})();
