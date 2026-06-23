var ProductosData = {
  getAll: function () {
    return Storage.get(Config.KEYS.productos) || [];
  },

  saveAll: function (productos) {
    Storage.set(Config.KEYS.productos, productos);
  },

  getById: function (id) {
    return this.getAll().find(function (p) {
      return p.id === Number(id);
    });
  },

  getByCategoria: function (idCat) {
    return this.getAll().filter(function (p) {
      return p.id_cat === Number(idCat);
    });
  },

  countByCategoria: function (idCat) {
    return this.getByCategoria(idCat).length;
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

  getMarcasUnicas: function () {
    var marcas = this.getAll()
      .map(function (p) {
        return p.marca;
      })
      .filter(function (m) {
        return m && m.trim();
      });
    return marcas.filter(function (m, i) {
      return marcas.indexOf(m) === i;
    });
  },

  crear: function (datos) {
    var productos = this.getAll();
    datos.id = this.getNextId();
    if (!datos.sku) datos.sku = "#" + String(datos.id).padStart(3, "0");
    productos.push(datos);
    this.saveAll(productos);
    return datos;
  },

  actualizar: function (id, datos) {
    var productos = this.getAll().map(function (p) {
      if (p.id === Number(id)) {
        return Object.assign({}, p, datos, { id: p.id });
      }
      return p;
    });
    this.saveAll(productos);
  },

  eliminar: function (id) {
    var productos = this.getAll().filter(function (p) {
      return p.id !== Number(id);
    });
    this.saveAll(productos);
  }
};
