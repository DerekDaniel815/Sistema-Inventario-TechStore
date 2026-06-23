(function () {
  if (!document.getElementById("tabla-stock")) return;

  var tbodyStock = document.querySelector("#tabla-stock tbody");
  var tbodyHistorial = document.querySelector("#tabla-historial tbody");
  var searchStock = document.querySelector(".stack .panel:first-child .search-input");
  var searchHistorial = document.querySelector(".stack .panel:last-child .search-input");
  var fProducto = document.getElementById("f-producto");
  var fCat = document.getElementById("f-cat");
  var fDesde = document.getElementById("f-desde");
  var fHasta = document.getElementById("f-hasta");
  var fRango = document.getElementById("f-rango");
  var chkIngreso = document.querySelector(".checkbox-list label:nth-child(1) input");
  var chkSalida = document.querySelector(".checkbox-list label:nth-child(2) input");
  var chkMerma = document.querySelector(".checkbox-list label:nth-child(3) input");
  var btnAplicar = document.querySelector(".filter-actions .btn");
  var btnLimpiar = document.querySelector(".filter-actions .btn-secondary");

  function renderKPIs() {
    var stats = Stats.getReportes();
    var kpis = document.querySelectorAll(".kpi-grid .kpi-value");
    if (kpis.length >= 4) {
      kpis[0].textContent = stats.stockTotal.toLocaleString("es-PE");
      kpis[1].textContent = "+" + stats.ingresosMes;
      kpis[2].textContent = "−" + stats.salidasMes;
      kpis[3].textContent = stats.mermasMes;
    }
  }

  function renderStock() {
    var termino = (searchStock ? searchStock.value : "").toLowerCase().trim();
    var filtrados = ProductosData.getAll().filter(function (p) {
      var catNombre = CategoriaProducto.getNombreCategoria(p.id_cat);
      return (
        !termino ||
        p.nombre.toLowerCase().includes(termino) ||
        catNombre.toLowerCase().includes(termino)
      );
    });

    if (!filtrados.length) {
      tbodyStock.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:2rem;">Sin productos registrados.</td></tr>';
      return;
    }

    tbodyStock.innerHTML = filtrados
      .map(function (p) {
        return (
          "<tr>" +
          "<td><strong>" + p.nombre + "</strong><br><small>" +
          CategoriaProducto.getNombreCategoria(p.id_cat) + "</small></td>" +
          "<td>" + FormatUtils.precio(p.precio) + "</td>" +
          "<td>" + p.stock + "</td>" +
          '<td><span class="badge info">LÓGICA</span></td>' +
          "<td>" + UiUtils.stockBadge(p.stock) + "</td></tr>"
        );
      })
      .join("");
  }

  function getRangoFechas() {
    return {
      desde: fDesde ? fDesde.value : "",
      hasta: fHasta ? fHasta.value : ""
    };
  }

  function aplicarRangoRapido() {
    if (!fRango) return;

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var desde = new Date(hoy);
    var hasta = new Date(hoy);
    var opcion = fRango.value;

    if (opcion === "Ayer") {
      desde.setDate(desde.getDate() - 1);
      hasta.setDate(hasta.getDate() - 1);
    } else if (opcion === "Últimos 7 días") {
      desde.setDate(desde.getDate() - 6);
    } else if (opcion === "Este mes") {
      desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    } else if (opcion === "Mes pasado") {
      desde = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      hasta = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
    }

    var fmt = function (d) {
      return d.toISOString().slice(0, 10);
    };

    if (fDesde) fDesde.value = fmt(desde);
    if (fHasta) fHasta.value = fmt(hasta);
    renderHistorial();
  }

  function renderHistorial() {
    var termino = (searchHistorial ? searchHistorial.value : "").toLowerCase().trim();
    var filtroProd = fProducto ? fProducto.value.toLowerCase().trim() : "";
    var catId = fCat ? fCat.value : "";
    var rango = getRangoFechas();
    var mostrarIngreso = chkIngreso ? chkIngreso.checked : true;
    var mostrarSalida = chkSalida ? chkSalida.checked : true;
    var mostrarMerma = chkMerma ? chkMerma.checked : false;

    var filtrados = MovimientosData.getAll().filter(function (m) {
      var prod = ProductosData.getById(m.productoId);
      if (!prod) return false;

      var coincideBusqueda =
        !termino || prod.nombre.toLowerCase().includes(termino);
      var coincideProd =
        !filtroProd || prod.nombre.toLowerCase().includes(filtroProd);
      var coincideCat = !catId || prod.id_cat === Number(catId);

      var coincideFecha = true;
      if (rango.desde && m.fecha < rango.desde) coincideFecha = false;
      if (rango.hasta && m.fecha > rango.hasta) coincideFecha = false;

      var coincideTipo =
        (m.ingreso > 0 && mostrarIngreso) ||
        (m.salida > 0 && mostrarSalida) ||
        (m.merma > 0 && mostrarMerma) ||
        (!m.ingreso && !m.salida && !m.merma);

      return coincideBusqueda && coincideProd && coincideCat && coincideFecha && coincideTipo;
    });

    if (!filtrados.length) {
      tbodyHistorial.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:2rem;">Sin movimientos.</td></tr>';
      return;
    }

    tbodyHistorial.innerHTML = filtrados
      .map(function (m) {
        var prod = ProductosData.getById(m.productoId);
        var ingreso = m.ingreso > 0 ? '<span class="badge success">+' + m.ingreso + "</span>" : "0";
        var salida = m.salida > 0 ? '<span class="badge warning">−' + m.salida + "</span>" : "0";
        var merma = m.merma > 0 ? '<span class="badge danger">' + m.merma + "</span>" : "0";

        return (
          "<tr>" +
          "<td><strong>" + prod.nombre + "</strong><br><small>" +
          CategoriaProducto.getNombreCategoria(prod.id_cat) + "</small></td>" +
          "<td>" + ingreso + "</td>" +
          "<td>" + salida + "</td>" +
          "<td>" + merma + "</td>" +
          '<td><span class="badge info">LÓGICA</span></td>' +
          "<td>" + FormatUtils.fecha(m.fecha) + "</td></tr>"
        );
      })
      .join("");
  }

  CategoriaProducto.poblarFiltroCategorias(fCat);
  renderKPIs();
  renderStock();
  renderHistorial();

  if (searchStock) searchStock.addEventListener("input", UiUtils.debounce(renderStock, 200));
  if (searchHistorial) searchHistorial.addEventListener("input", UiUtils.debounce(renderHistorial, 200));
  if (btnAplicar) btnAplicar.addEventListener("click", renderHistorial);
  if (fRango) fRango.addEventListener("change", aplicarRangoRapido);
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      if (fProducto) fProducto.value = "";
      if (fCat) fCat.value = "";
      if (fDesde) fDesde.value = "";
      if (fHasta) fHasta.value = "";
      if (fRango) fRango.selectedIndex = 0;
      if (chkIngreso) chkIngreso.checked = true;
      if (chkSalida) chkSalida.checked = true;
      if (chkMerma) chkMerma.checked = false;
      renderHistorial();
    });
  }
})();
