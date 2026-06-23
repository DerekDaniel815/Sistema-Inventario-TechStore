var UiUtils = {
  getStockStatus: function (stock) {
    if (stock <= 0) return "sin_stock";
    if (stock <= Config.STOCK_BAJO_LIMITE) return "bajo";
    return "en_stock";
  },

  stockBadge: function (stock) {
    var status = this.getStockStatus(stock);
    if (status === "sin_stock") {
      return '<span class="badge danger dot">Sin stock</span>';
    }
    if (status === "bajo") {
      return '<span class="badge warning dot">Stock bajo</span>';
    }
    return '<span class="badge success dot">En stock</span>';
  },

  categoriaBadge: function (nombre, index) {
    var classes = ["info", "success", ""];
    var cls = classes[index % classes.length];
    var extra = cls ? " " + cls : "";
    return '<span class="badge' + extra + '">' + nombre + "</span>";
  },

  estadoCategoriaBadge: function (activa) {
    if (activa) {
      return '<span class="badge success dot">Activa</span>';
    }
    return '<span class="badge warning dot">Inactiva</span>';
  },

  confirmar: function (mensaje) {
    return window.confirm(mensaje);
  },

  mostrarMensaje: function (mensaje, tipo) {
    var existente = document.querySelector(".toast-msg");
    if (existente) existente.remove();

    var toast = document.createElement("div");
    toast.className = "toast-msg toast-" + (tipo || "info");
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("show");
    }, 10);

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  },

  debounce: function (fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }
};
