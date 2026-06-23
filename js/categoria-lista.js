(function () {
  var tbody = document.querySelector("#tabla-categorias tbody");
  if (!tbody) return;

  var searchInput = document.querySelector(".search-input");
  var fNombre = document.getElementById("f-nombre");
  var fOrden = document.getElementById("f-orden");
  var chkActivas = document.querySelector(".checkbox-list label:nth-child(1) input");
  var chkInactivas = document.querySelector(".checkbox-list label:nth-child(2) input");
  var btnAplicar = document.querySelector(".filter-actions .btn");
  var btnLimpiar = document.querySelector(".filter-actions .btn-secondary");

  function getFiltradas() {
    var termino = (searchInput ? searchInput.value : "").toLowerCase().trim();
    var filtroNombre = fNombre ? fNombre.value.toLowerCase().trim() : "";
    var mostrarActivas = chkActivas ? chkActivas.checked : true;
    var mostrarInactivas = chkInactivas ? chkInactivas.checked : true;
    var orden = fOrden ? fOrden.value : "Nombre (A-Z)";

    var resultado = CategoriasData.getAll().filter(function (cat) {
      var coincideBusqueda =
        !termino ||
        cat.nombre.toLowerCase().includes(termino) ||
        (cat.descripcion && cat.descripcion.toLowerCase().includes(termino));
      var coincideNombre =
        !filtroNombre || cat.nombre.toLowerCase().includes(filtroNombre);
      var coincideEstado =
        (cat.estado === 1 && mostrarActivas) ||
        (cat.estado === 0 && mostrarInactivas);

      return coincideBusqueda && coincideNombre && coincideEstado;
    });

    resultado.sort(function (a, b) {
      if (orden === "Nombre (Z-A)") return b.nombre.localeCompare(a.nombre);
      if (orden === "Más productos") {
        return (
          ProductosData.countByCategoria(b.id) -
          ProductosData.countByCategoria(a.id)
        );
      }
      if (orden === "Menos productos") {
        return (
          ProductosData.countByCategoria(a.id) -
          ProductosData.countByCategoria(b.id)
        );
      }
      return a.nombre.localeCompare(b.nombre);
    });

    return resultado;
  }

  function eliminar(id) {
    var validacion = CategoriaProducto.puedeEliminarCategoria(id);
    if (!validacion.permitido) {
      UiUtils.mostrarMensaje(validacion.mensaje, "error");
      return;
    }

    var cat = CategoriasData.getById(id);
    if (!cat) return;
    if (!UiUtils.confirmar('¿Eliminar la categoría "' + cat.nombre + '"?')) return;

    CategoriasData.eliminar(id);
    UiUtils.mostrarMensaje("Categoría eliminada.", "success");
    render();
  }

  function render() {
    var categorias = getFiltradas();

    if (!categorias.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:2rem;">No hay categorías. Usa "+ Nueva Categoría" para agregar.</td></tr>';
      return;
    }

    tbody.innerHTML = categorias
      .map(function (cat) {
        var count = ProductosData.countByCategoria(cat.id);
        return (
          "<tr>" +
          "<td>#" + cat.id + "</td>" +
          "<td><strong>" + cat.nombre + "</strong></td>" +
          "<td>" + (cat.descripcion || "—") + "</td>" +
          "<td>" + count + "</td>" +
          "<td>" + UiUtils.estadoCategoriaBadge(cat.estado === 1) + "</td>" +
          '<td><div class="actions-cell">' +
          '<a href="categoria-form.html?id=' + cat.id + '" class="btn-icon">Editar</a>' +
          '<button type="button" class="btn-icon danger" data-delete="' + cat.id + '">Eliminar</button>' +
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

  if (searchInput) {
    searchInput.addEventListener("input", UiUtils.debounce(render, 200));
  }
  if (btnAplicar) btnAplicar.addEventListener("click", render);
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (fNombre) fNombre.value = "";
      if (fOrden) fOrden.selectedIndex = 0;
      if (chkActivas) chkActivas.checked = true;
      if (chkInactivas) chkInactivas.checked = true;
      render();
    });
  }

  render();
})();
