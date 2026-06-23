var AppInit = {
  run: function () {
    var versionGuardada = Storage.get(Config.KEYS.version);

    if (versionGuardada !== Config.DATA_VERSION) {
      Storage.set(Config.KEYS.categorias, Seed.categorias);
      Storage.set(Config.KEYS.productos, Seed.productos);
      Storage.set(Config.KEYS.movimientos, Seed.movimientos);
      Storage.set(Config.KEYS.version, Config.DATA_VERSION);
      return;
    }

    if (!Storage.get(Config.KEYS.categorias)) {
      Storage.set(Config.KEYS.categorias, Seed.categorias);
    }
    if (!Storage.get(Config.KEYS.productos)) {
      Storage.set(Config.KEYS.productos, Seed.productos);
    }
    if (!Storage.get(Config.KEYS.movimientos)) {
      Storage.set(Config.KEYS.movimientos, Seed.movimientos);
    }
  }
};

AppInit.run();
