var Seed = {
  categorias: [
    {
      id: 1,
      nombre: "Periféricos",
      descripcion: "Mouse, teclado, audífonos y accesorios.",
      estado: 1,
      orden: 1
    },
    {
      id: 2,
      nombre: "Hardware",
      descripcion: "Componentes internos como RAM, CPU y placas.",
      estado: 1,
      orden: 2
    }
  ],

  productos: [
    {
      id: 1,
      nombre: "Mouse Gamer RGB",
      descripcion: "Mouse óptico con 6 botones e iluminación.",
      id_cat: 1,
      marca: "Logitech G502",
      precio: 85,
      stock: 5,
      sku: "#001",
      estado: 1,
      foto: "../../assets/img/mouse.jpg"
    }
  ],

  movimientos: [
    {
      id: 1,
      productoId: 1,
      ingreso: 5,
      salida: 0,
      merma: 0,
      fecha: new Date().toISOString().slice(0, 10)
    }
  ]
};
