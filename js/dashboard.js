(function () {
  var kpis = document.querySelectorAll(".kpi-grid .kpi-value");
  if (!kpis.length) return;

  var stats = Stats.getDashboard();
  if (kpis.length >= 4) {
    kpis[0].textContent = stats.totalProductos;
    kpis[1].textContent = stats.totalCategorias;
    kpis[2].textContent = stats.stockBajo;
    kpis[3].textContent = stats.movimientosHoy;
  }
})();
