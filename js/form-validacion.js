var FormValidacion = {
  obtenerGrupo: function (input) {
    return input ? input.closest(".form-group") : null;
  },

  mostrarError: function (input, mensaje) {
    var grupo = this.obtenerGrupo(input);
    if (!grupo) return;

    grupo.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");

    var errorEl = grupo.querySelector(".form-error");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "form-error";
      errorEl.setAttribute("role", "alert");
      grupo.appendChild(errorEl);
    }
    errorEl.textContent = mensaje;
  },

  limpiarError: function (input) {
    var grupo = this.obtenerGrupo(input);
    if (!grupo) return;

    grupo.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");

    var errorEl = grupo.querySelector(".form-error");
    if (errorEl) errorEl.remove();
  },

  limpiarFormulario: function (form) {
    var self = this;
    form.querySelectorAll(".is-invalid").forEach(function (grupo) {
      grupo.classList.remove("is-invalid");
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (input) {
      self.limpiarError(input);
    });
  },

  requerido: function (valor, mensaje) {
    if (!valor || !String(valor).trim()) {
      return mensaje || "Este campo es obligatorio.";
    }
    return "";
  },

  texto: function (valor, min, max, mensajes) {
    var texto = String(valor || "").trim();
    if (!texto) return mensajes.vacio || "Este campo es obligatorio.";
    if (texto.length < min) {
      return mensajes.min || "Debe tener al menos " + min + " caracteres.";
    }
    if (texto.length > max) {
      return mensajes.max || "No puede superar " + max + " caracteres.";
    }
    return "";
  },

  select: function (valor, mensaje) {
    if (!valor || valor === "") {
      return mensaje || "Debes seleccionar una opción.";
    }
    return "";
  },

  numero: function (valor, opciones) {
    var requerido = opciones.requerido !== false;
    var texto = String(valor).trim();

    if (!texto) {
      return requerido ? opciones.vacio || "Este campo es obligatorio." : "";
    }

    var num = Number(texto);
    if (isNaN(num)) return opciones.invalido || "Ingresa un número válido.";

    if (opciones.entero && !Number.isInteger(num)) {
      return opciones.enteroMsg || "Debe ser un número entero.";
    }
    if (opciones.min !== undefined && num < opciones.min) {
      return opciones.minMsg || "El valor mínimo es " + opciones.min + ".";
    }
    if (opciones.max !== undefined && num > opciones.max) {
      return opciones.maxMsg || "El valor máximo es " + opciones.max + ".";
    }

    return "";
  },

  archivoImagen: function (input, maxMb) {
    if (!input.files || !input.files[0]) return "";

    var archivo = input.files[0];
    var tipos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    var limite = (maxMb || 2) * 1024 * 1024;

    if (tipos.indexOf(archivo.type) === -1) {
      return "Solo se permiten imágenes JPG, PNG, WEBP o GIF.";
    }
    if (archivo.size > limite) {
      return "La imagen no puede superar " + (maxMb || 2) + " MB.";
    }
    return "";
  },

  validarCampos: function (campos) {
    var self = this;
    var valido = true;
    var primerInput = null;

    campos.forEach(function (campo) {
      var error = campo.validar();
      if (error) {
        self.mostrarError(campo.input, error);
        if (!primerInput) primerInput = campo.input;
        valido = false;
      } else {
        self.limpiarError(campo.input);
      }
    });

    if (primerInput) {
      primerInput.focus();
      primerInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return valido;
  },

  enlazarTiempoReal: function (campos) {
    var self = this;

    campos.forEach(function (campo) {
      var eventos = campo.eventos || ["blur", "input"];

      eventos.forEach(function (evento) {
        campo.input.addEventListener(evento, function () {
          var error = campo.validar();
          if (error) {
            self.mostrarError(campo.input, error);
          } else {
            self.limpiarError(campo.input);
          }
        });
      });
    });
  }
};
