// Catálogo semilla de la cafetería. En una versión con API este archivo se reemplaza
// por un repositorio HTTP con la misma interfaz (listar, buscarPorId).
export const PRODUCTOS_SEMILLA = [
  { id: 'cafe-americano', nombre: 'Café americano', descripcion: 'Café de pasar, 8 oz', categoria: 'Bebidas calientes', precio: 0.75 },
  { id: 'cafe-con-leche', nombre: 'Café con leche', descripcion: 'Café con leche entera, 10 oz', categoria: 'Bebidas calientes', precio: 1.0 },
  { id: 'capuchino', nombre: 'Capuchino', descripcion: 'Espresso con leche espumada y canela', categoria: 'Bebidas calientes', precio: 1.5 },
  { id: 'chocolate-caliente', nombre: 'Chocolate caliente', descripcion: 'Chocolate de taza con leche', categoria: 'Bebidas calientes', precio: 1.25 },
  { id: 'aromatica', nombre: 'Aromática', descripcion: 'Infusión de hierbas: manzanilla, cedrón o hierbaluisa', categoria: 'Bebidas calientes', precio: 0.5 },
  { id: 'jugo-naranja', nombre: 'Jugo de naranja', descripcion: 'Natural, 12 oz', categoria: 'Bebidas frías', precio: 1.25 },
  { id: 'jugo-mora', nombre: 'Jugo de mora', descripcion: 'Natural con agua o leche, 12 oz', categoria: 'Bebidas frías', precio: 1.25 },
  { id: 'agua', nombre: 'Agua sin gas', descripcion: 'Botella de 500 ml', categoria: 'Bebidas frías', precio: 0.6 },
  { id: 'empanada-verde', nombre: 'Empanada de verde', descripcion: 'Rellena de queso', categoria: 'Snacks', precio: 1.0 },
  { id: 'empanada-morocho', nombre: 'Empanada de morocho', descripcion: 'Rellena de carne', categoria: 'Snacks', precio: 1.0 },
  { id: 'humita', nombre: 'Humita', descripcion: 'Humita de choclo con queso', categoria: 'Snacks', precio: 1.25 },
  { id: 'pan-de-yuca', nombre: 'Pan de yuca', descripcion: 'Porción de 3 unidades', categoria: 'Snacks', precio: 0.9 },
  { id: 'sanduche-mixto', nombre: 'Sánduche mixto', descripcion: 'Jamón y queso en pan blanco', categoria: 'Snacks', precio: 1.75 },
  { id: 'almuerzo-del-dia', nombre: 'Almuerzo del día', descripcion: 'Sopa, segundo y jugo', categoria: 'Almuerzos', precio: 3.0 },
  { id: 'almuerzo-vegetariano', nombre: 'Almuerzo vegetariano', descripcion: 'Sopa, plato vegetariano y jugo', categoria: 'Almuerzos', precio: 3.25 },
  { id: 'torta-chocolate', nombre: 'Torta de chocolate', descripcion: 'Porción individual', categoria: 'Postres', precio: 1.5 },
  { id: 'cheesecake', nombre: 'Cheesecake de maracuyá', descripcion: 'Porción individual', categoria: 'Postres', precio: 2.0, disponible: false },
];
