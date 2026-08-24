export const categories = ['Moda','Calzado','Tecnología','Electrodomésticos','Belleza'];
export const subcats = {
  Moda:['Vestido','Camisa','Blusa','Pantalón','Jeans','Chaqueta','Camiseta','Bolso','Reloj','Accesorio'],
  Calzado:['Sneakers','Zapato casual','Zapato formal','Sandalia','Bota','Tacón','Mocasín'],
  Tecnología:['Smartphone','Laptop','Tablet','Audífonos','Smartwatch','Monitor','Bocina','Accesorio'],
  Electrodomésticos:['Cafetera','Licuadora','Freidora','Microondas','Aspiradora','Plancha','Ventilador'],
  Belleza:['Perfume','Cuidado facial','Cuidado corporal','Maquillaje','Secadora']
};
export const brands = {
  Moda:['Calvin Klein','Tommy Hilfiger','Guess','Levi\'s','Sfera','Zara Home'],
  Calzado:['Nike','Adidas','Skechers','Vans','New Balance','Puma'],
  Tecnología:['Apple','Samsung','Sony','JBL','Lenovo','HP'],
  Electrodomésticos:['Oster','Ninja','KitchenAid','Black+Decker','Hamilton Beach'],
  Belleza:['Clinique','Estée Lauder','Lancôme','L’Oréal','Calvin Klein']
};
export const images = {
  Moda:['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1100&q=86'],
  Calzado:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1100&q=86'],
  Tecnología:['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=86'],
  Electrodomésticos:['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1100&q=86'],
  Belleza:['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1100&q=86','https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1100&q=86']
};
export const nameParts = {
  Moda:['Essential','Studio','Signature','Classic','Tailored','Linen','Urban','Premium','Edition','Archive'],
  Calzado:['Runner','Court','Urban','Classic','Street','Heritage','Motion','Daily','Leather','Flex'],
  Tecnología:['Pro','Air','Ultra','Core','Max','Edge','Studio','Vision','Plus','Series'],
  Electrodomésticos:['Pro','Classic','Smart','Compact','Chef','Select','Prime','Essential'],
  Belleza:['Eau de','Hydra','Pure','Glow','Signature','Velvet','Intense','Lumi']
};

export const money = (n) => `Q ${n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const priceFor = (cat,i) => {
  const base = {Moda:280,Calzado:420,Tecnología:750,Electrodomésticos:390,Belleza:230}[cat];
  return Math.round((base+(i%17)*base*.13)*10)/10
};

// Generar mock data para 1200 productos
export const products = Array.from({length:1200},(_,i) => {
  const category = categories[i%categories.length];
  let gender = i%2 ? 'Mujer' : 'Hombre';
  if (category === 'Electrodomésticos') gender = 'Hogar';
  else if (category === 'Tecnología') gender = i%3 === 0 ? 'Unisex' : 'Hogar';
  else if (i%3 === 0) gender = 'Unisex';
  
  const sub = subcats[category][i%subcats[category].length];
  const brand = brands[category][i%brands[category].length];
  const name = `${nameParts[category][i%nameParts[category].length]} ${sub} ${String(i+1).padStart(4,'0')}`;
  const price = priceFor(category,i);
  
  return {
    id: i+1,
    sku: `CY-${category.slice(0,3).toUpperCase()}-${String(i+1).padStart(5,'0')}`,
    category,
    gender,
    sub,
    brand,
    name,
    price,
    image: images[category][i%images[category].length],
    gallery: images[category],
    new: i<90,
    sale: i%11===0,
    description: `Una selección de ${sub.toLowerCase()} elegida para el universo CONCEPT CYLO. Diseño, funcionalidad y una presentación coherente con nuestra curaduría premium.`,
    availability: i%8===0 ? 'Consulta disponibilidad' : 'Disponible'
  };
});
