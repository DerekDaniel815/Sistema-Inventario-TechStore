var CategoriasData = {
  getAll: function () {
    return Storage.get(Config.KEYS.categorias) || [];
  },

  saveAll: function (categorias) {
    Storage.set(Config.KEYS.categorias, categorias);
  },

  getById: function (id) {
    return this.getAll().find(function (c) {
      return c.id === Number(id);
    });
  },

  getActivas: function () {
    return this.getAll().filter(function (c) {
      return c.estado === 1;
    });
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

  existeNombre: function (nombre, excluirId) {
    return this.getAll().some(function (c) {
      return (
        c.nombre.toLowerCase() === nombre.toLowerCase() &&
        c.id !== Number(excluirId)
      );
    });
  },

  crear: function (datos) {
    var categorias = this.getAll();
    datos.id = this.getNextId();
    categorias.push(datos);
    this.saveAll(categorias);
    return datos;
  },

  actualizar: function (id, datos) {
    var categorias = this.getAll().map(function (c) {
      if (c.id === Number(id)) {
        return Object.assign({}, c, datos, { id: c.id });
      }
      return c;
    });
    this.saveAll(categorias);
  },

  eliminar: function (id) {
    var categorias = this.getAll().filter(function (c) {
      return c.id !== Number(id);
    });
    this.saveAll(categorias);
  }
};
