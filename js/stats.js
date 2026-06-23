var Stats = {
  getDashboard: function () {
    var productos = ProductosData.getAll();
    var categorias = CategoriasData.getAll();
    var movimientos = MovimientosData.getAll();
    var hoy = new Date().toISOString().slice(0, 10);

    return {
      totalProductos: productos.length,
      totalCategorias: categorias.filter(function (c) {
        return c.estado === 1;
      }).length,
      stockBajo: productos.filter(function (p) {
        return UiUtils.getStockStatus(p.stock) === "bajo";
      }).length,
      movimientosHoy: movimientos.filter(function (m) {
        return m.fecha === hoy;
      }).length
    };
  },

  getReportes: function () {
    var productos = ProductosData.getAll();
    var movimientos = MovimientosData.getAll();
    var mesActual = new Date().toISOString().slice(0, 7);

    var delMes = movimientos.filter(function (m) {
      return m.fecha.slice(0, 7) === mesActual;
    });

    return {
      stockTotal: productos.reduce(function (sum, p) {
        return sum + p.stock;
      }, 0),
      ingresosMes: delMes.reduce(function (sum, m) {
        return sum + m.ingreso;
      }, 0),
      salidasMes: delMes.reduce(function (sum, m) {
        return sum + m.salida;
      }, 0),
      mermasMes: delMes.reduce(function (sum, m) {
        return sum + m.merma;
      }, 0)
    };
  }
};
