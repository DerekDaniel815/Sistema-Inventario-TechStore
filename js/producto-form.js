(function () {
  var form = document.querySelector(".form-card form");
  if (!form) return;

  form.setAttribute("novalidate", "novalidate");

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

  var campos = [
    {
      input: inputNombre,
      validar: function () {
        return FormValidacion.texto(inputNombre.value, 2, 100, {
          vacio: "El nombre del producto es obligatorio.",
          min: "El nombre debe tener al menos 2 caracteres.",
          max: "El nombre no puede superar 100 caracteres."
        });
      }
    },
    {
      input: selectCat,
      validar: function () {
        var errorSelect = FormValidacion.select(
          selectCat.value,
          "Debes seleccionar una categoría."
        );
        if (errorSelect) return errorSelect;

        var validacionCat = CategoriaProducto.validarCategoriaParaProducto(
          Number(selectCat.value)
        );
        return validacionCat.valido ? "" : validacionCat.mensaje;
      }
    },
    {
      input: inputPrecio,
      validar: function () {
        return FormValidacion.numero(inputPrecio.value, {
          requerido: true,
          min: 0.01,
          max: 999999.99,
          invalido: "Ingresa un precio válido.",
          vacio: "El precio es obligatorio.",
          minMsg: "El precio debe ser mayor a 0.",
          maxMsg: "El precio es demasiado alto."
        });
      }
    },
    {
      input: inputStock,
      validar: function () {
        return FormValidacion.numero(inputStock.value, {
          requerido: false,
          min: 0,
          entero: true,
          invalido: "El stock debe ser un número válido.",
          minMsg: "El stock no puede ser negativo.",
          enteroMsg: "El stock debe ser un número entero."
        });
      },
      eventos: ["blur"]
    },
    {
      input: inputMarca,
      validar: function () {
        var texto = inputMarca.value.trim();
        if (!texto) return "";
        if (texto.length > 80) {
          return "La marca no puede superar 80 caracteres.";
        }
        return "";
      },
      eventos: ["blur"]
    },
    {
      input: inputSku,
      validar: function () {
        var texto = inputSku.value.trim();
        if (!texto) return "";
        if (texto.length > 30) {
          return "El SKU no puede superar 30 caracteres.";
        }
        return "";
      },
      eventos: ["blur"]
    },
    {
      input: inputFoto,
      validar: function () {
        return FormValidacion.archivoImagen(inputFoto, 2);
      },
      eventos: ["change"]
    }
  ];

  FormValidacion.enlazarTiempoReal(campos);

  form.addEventListener("reset", function () {
    setTimeout(function () {
      FormValidacion.limpiarFormulario(form);
      refrescarSelectCategorias();
    }, 0);
  });

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

    if (!CategoriaProducto.hayCategoriasActivas()) {
      UiUtils.mostrarMensaje("Primero debes crear una categoría activa.", "error");
      return;
    }

    if (!FormValidacion.validarCampos(campos)) {
      UiUtils.mostrarMensaje("Revisa los campos marcados en rojo.", "error");
      return;
    }

    var nombre = inputNombre.value.trim();
    var idCat = Number(selectCat.value);
    var precio = Number(inputPrecio.value);
    var validacionCat = CategoriaProducto.validarCategoriaParaProducto(idCat);

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
