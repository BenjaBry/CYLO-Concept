# CONCEPT CYLO — Premium V3

Esta versión incorpora las mejoras solicitadas, excepto la antigua sugerencia 9 (área de cliente / CYLO Private List) y 10 (checkout/e-commerce real).

## Incluido
- Mega-menú visual por universos y subcategorías.
- Transiciones de entrada/salida entre páginas.
- Microinteracciones y hover premium.
- Buscador predictivo con resultados de productos y accesos a colecciones/marcas.
- Página de Colecciones: `colecciones.html`.
- Página dinámica de producto: `producto.html?id=1`.
- Template editable de producto: `producto-template.html`.
- Directorio de marcas.
- Editorial.
- Catálogo de 1,200 productos demo.

## Cómo escalar productos
`producto.html` usa `id` y los datos del arreglo `products` en `assets/app.js`. Para una escala manual, duplica `producto-template.html`, cambia textos, imágenes, precio, SKU, marca, especificaciones y enlaces.

## Publicación
Sube el contenido de esta carpeta a Cloudflare Pages, Netlify, GitHub Pages u otro hosting estático.


## V4 refinements
- Improved catalog card spacing so product metadata no longer gets covered by the next row.
- Added COLECCIONES consistently to the primary navigation across pages.
- Reduced footer/newsletter vertical space for a tighter premium layout.
- Added sticky catalog filters on desktop.
