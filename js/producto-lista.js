(function () {
  var tbody = document.querySelector("#tabla-productos tbody");
  if (!tbody) return;

  var searchInput = document.querySelector(".search-input");
  var fCat = document.getElementById("f-cat");
  var fMarca = document.getElementById("f-marca");
  var fPrecioMin = document.querySelector('.filter-group input[placeholder="Mín"]');
  var fPrecioMax = document.querySelector('.filter-group input[placeholder="Máx"]');
  var chkEnStock = document.querySelector(".checkbox-list label:nth-child(1) input");
  var chkStockBajo = document.querySelector(".checkbox-list label:nth-child(2) input");
  var chkSinStock = document.querySelector(".checkbox-list label:nth-child(3) input");
  var btnAplicar = document.querySelector(".filter-actions .btn");
  var btnLimpiar = document.querySelector(".filter-actions .btn-secondary");

  function poblarFiltros() {
    CategoriaProducto.poblarFiltroCategorias(fCat);

    if (fMarca) {
      var marcas = ProductosData.getMarcasUnicas();
      fMarca.innerHTML =
        '<option value="">Todas</option>' +
        marcas.map(function (m) {
          return "<option>" + m + "</option>";
        }).join("");
    }
  }

  function getFiltrados() {
    var termino = (searchInput ? searchInput.value : "").toLowerCase().trim();
    var catId = fCat ? fCat.value : "";
    var marca = fMarca ? fMarca.value : "";
    var precioMin = fPrecioMin ? Number(fPrecioMin.value) : null;
    var precioMax = fPrecioMax ? Number(fPrecioMax.value) : null;
    var mostrarEnStock = chkEnStock ? chkEnStock.checked : true;
    var mostrarBajo = chkStockBajo ? chkStockBajo.checked : true;
    var mostrarSinStock = chkSinStock ? chkSinStock.checked : true;

    return ProductosData.getAll().filter(function (p) {
      var catNombre = CategoriaProducto.getNombreCategoria(p.id_cat);

      var coincideBusqueda =
        !termino ||
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
        (p.marca && p.marca.toLowerCase().includes(termino)) ||
        (p.sku && p.sku.toLowerCase().includes(termino)) ||
        catNombre.toLowerCase().includes(termino);

      var coincideCat = !catId || p.id_cat === Number(catId);
      var coincideMarca = !marca || p.marca === marca;
      var coincidePrecioMin =
        precioMin === null || isNaN(precioMin) || p.precio >= precioMin;
      var coincidePrecioMax =
        precioMax === null || isNaN(precioMax) || p.precio <= precioMax;

      var status = UiUtils.getStockStatus(p.stock);
      var coincideStock =
        (status === "en_stock" && mostrarEnStock) ||
        (status === "bajo" && mostrarBajo) ||
        (status === "sin_stock" && mostrarSinStock);

      return (
        coincideBusqueda &&
        coincideCat &&
        coincideMarca &&
        coincidePrecioMin &&
        coincidePrecioMax &&
        coincideStock
      );
    });
  }

  function renderProductoCell(p) {
    var imgHtml = p.foto
      ? '<img src="' + p.foto + '" alt="' + p.nombre + '" width="40" height="40" />'
      : "";

    return (
      '<div class="cell-product">' + imgHtml +
      "<div><div class=\"name\">" + p.nombre + "</div>" +
      "<div class=\"sub\">SKU " + (p.sku || "#" + p.id) + "</div></div></div>"
    );
  }

  function eliminar(id) {
    var prod = ProductosData.getById(id);
    if (!prod) return;
    if (!UiUtils.confirmar('¿Eliminar el producto "' + prod.nombre + '"?')) return;

    ProductosData.eliminar(id);
    MovimientosData.eliminarByProducto(id);
    UiUtils.mostrarMensaje("Producto eliminado.", "success");
    poblarFiltros();
    render();
  }

  function render() {
    var productos = getFiltrados();

    if (!productos.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:2rem;">No hay productos. Usa "+ Nuevo Producto" para agregar (necesitas al menos una categoría).</td></tr>';
      return;
    }

    tbody.innerHTML = productos
      .map(function (p, i) {
        var catNombre = CategoriaProducto.getNombreCategoria(p.id_cat);
        return (
          "<tr>" +
          "<td>" + renderProductoCell(p) + "</td>" +
          "<td>" + (p.descripcion || "—") + "</td>" +
          "<td>" + UiUtils.categoriaBadge(catNombre, i) + "</td>" +
          "<td>" + FormatUtils.precio(p.precio) + "</td>" +
          "<td>" + (p.marca || "—") + "</td>" +
          '<td><div class="actions-cell">' +
          '<a href="producto-form.html?id=' + p.id + '" class="btn-icon">Editar</a>' +
          '<button type="button" class="btn-icon danger" data-delete="' + p.id + '">Eliminar</button>' +
          "</div></td></tr>"
        );
      })
      .join("");

    tbody.querySelectorAll("[data-delete]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        eliminar(Number(btn.getAttribute("data-delete")));
      });
    });
  }

  poblarFiltros();
  render();

  if (searchInput) searchInput.addEventListener("input", UiUtils.debounce(render, 200));
  if (btnAplicar) btnAplicar.addEventListener("click", render);
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (fCat) fCat.value = "";
      if (fMarca) fMarca.value = "";
      if (fPrecioMin) fPrecioMin.value = "";
      if (fPrecioMax) fPrecioMax.value = "";
      if (chkEnStock) chkEnStock.checked = true;
      if (chkStockBajo) chkStockBajo.checked = true;
      if (chkSinStock) chkSinStock.checked = true;
      render();
    });
  }
})();
