var FormatUtils = {
  precio: function (valor) {
    return "S/ " + Number(valor).toFixed(2);
  },

  fecha: function (fechaStr) {
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var fecha = new Date(fechaStr + "T00:00:00");

    var ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (fecha.getTime() === hoy.getTime()) return "HOY";
    if (fecha.getTime() === ayer.getTime()) return "AYER";

    var d = fecha.getDate().toString().padStart(2, "0");
    var m = (fecha.getMonth() + 1).toString().padStart(2, "0");
    return d + "/" + m + "/" + fecha.getFullYear();
  },

  getParam: function (name) {
    return new URLSearchParams(window.location.search).get(name);
  }
};
