var Storage = {
  get: function (key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: function (key) {
    localStorage.removeItem(key);
  }
};
