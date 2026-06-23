var MovimientosData = {
  getAll: function () {
    return Storage.get(Config.KEYS.movimientos) || [];
  },

  saveAll: function (movimientos) {
    Storage.set(Config.KEYS.movimientos, movimientos);
  },

  getNextId: function () {
    var items = this.getAll();
    if (!items.length) return 1;
    return (
      Math.max.apply(
        null,
        items.map(function (item) {
          return item.id;
        })
      ) + 1
    );
  },

  getByProducto: function (productoId) {
    return this.getAll().filter(function (m) {
      return m.productoId === Number(productoId);
    });
  },

  eliminarByProducto: function (productoId) {
    var movimientos = this.getAll().filter(function (m) {
      return m.productoId !== Number(productoId);
    });
    this.saveAll(movimientos);
  },

  registrarCambioStock: function (productoId, stockAnterior, stockNuevo) {
    var diff = stockNuevo - stockAnterior;
    if (diff === 0) return;

    var movimientos = this.getAll();
    movimientos.unshift({
      id: this.getNextId(),
      productoId: Number(productoId),
      ingreso: diff > 0 ? diff : 0,
      salida: diff < 0 ? Math.abs(diff) : 0,
      merma: 0,
      fecha: new Date().toISOString().slice(0, 10)
    });
    this.saveAll(movimientos);
  }
};
