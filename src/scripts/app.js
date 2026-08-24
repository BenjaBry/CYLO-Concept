import { products, categories, money } from '../data/products.js';

const state={query:'',category:'',gender:'',brand:'',price:12000,sort:'featured',visible:24,cart:[]};
const $=s=>document.querySelector(s);
const qs=new URLSearchParams(location.search);

const getCart=()=>JSON.parse(localStorage.getItem('cylo-cart')||'[]');
const saveCart=()=>localStorage.setItem('cylo-cart',JSON.stringify(state.cart.map(p=>p.id)));

function loadCart(){
  state.cart=getCart().map(id=>products.find(p=>p.id===id)).filter(Boolean);
}

function setActiveNav(){
  const url = new URL(location.href);
  const pathWithSearch = url.pathname + decodeURIComponent(url.search);
  
  let exactMatchFound = false;
  
  // First, check for exact href matches (e.g., /tienda?category=Tecnología)
  document.querySelectorAll('.nav-link').forEach(a => {
    const linkPath = a.getAttribute('href');
    if (linkPath === pathWithSearch) {
      a.classList.add('active');
      exactMatchFound = true;
    } else {
      a.classList.remove('active');
    }
  });

  // Fallback to data-page if no exact parameter match is found
  if (!exactMatchFound) {
    document.querySelectorAll('.nav-link[data-page]').forEach(a => {
      if (a.dataset.page === document.body.dataset.page) {
        a.classList.add('active');
      }
    });
  }
}

function transitionLinks(){
  // Using Astro, links should route normally, but we can keep the animation
  document.querySelectorAll('a[href^="/"]').forEach(a=>{
    a.addEventListener('click',e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
      const href=a.getAttribute('href');
      if(!href||href.startsWith('#'))return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(()=>location.href=href,340);
    });
  });
}

function setupReveal(){
  const items=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(x=>x.classList.add('visible'));
    return;
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  }),{threshold:.08});
  items.forEach(x=>io.observe(x));
}

function setMenu(){
  const btn=$('#menuToggle'),nav=$('#siteNav');
  if(btn&&nav)btn.addEventListener('click',()=>{
    nav.classList.toggle('open');
    document.body.classList.toggle('menu-open',nav.classList.contains('open'));
  });
}

function wireCart(){
  const drawer=$('#cartDrawer'),back=$('#drawerBackdrop');
  if(!drawer)return;
  const close=()=>{drawer.classList.remove('open');back?.classList.remove('open')};
  const open=()=>{drawer.classList.add('open');back?.classList.add('open');renderCart()};
  $('#cartBtn')?.addEventListener('click',open);
  $('#closeCart')?.addEventListener('click',close);
  back?.addEventListener('click',close);
  $('#checkoutBtn')?.addEventListener('click', (e) => {
    const btn = e.target;
    if(!state.cart.length) {
      const originalText = btn.textContent;
      btn.textContent = 'EL CARRITO ESTÁ VACÍO';
      btn.style.backgroundColor = '#8b867f';
      btn.style.borderColor = '#8b867f';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
      }, 2000);
      return;
    }
    const text=`Hola, deseo solicitar estos productos de CONCEPT CYLO:\n\n${state.cart.map(p=>`• ${p.name} — ${money(p.price)}`).join('\n')}\n\nTotal estimado: ${money(state.cart.reduce((s,p)=>s+p.price,0))}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
  });
}

function renderCart(){
  const box=$('#cartItems');
  if(!box)return;
  const count=state.cart.length;
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);
  box.innerHTML=count?state.cart.map((p,i)=>`<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.brand}</p><p>${money(p.price)}</p></div><button aria-label="Eliminar" data-remove="${i}">×</button></div>`).join(''):'<div class="empty-cart">Tu selección está vacía.<br><br>Agrega productos para comenzar.</div>';
  box.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{
    state.cart.splice(+b.dataset.remove,1);
    saveCart();
    renderCart();
  }));
  const total=state.cart.reduce((s,p)=>s+p.price,0);
  const el=$('#cartTotal');
  if(el)el.textContent=money(total);
}

function addToCart(product){
  if(!state.cart.some(p=>p.id===product.id))state.cart.push(product);
  saveCart();
  renderCart();
  $('#cartDrawer')?.classList.add('open');
  $('#drawerBackdrop')?.classList.add('open');
}

function getFiltered(){
  let arr=products.filter(p=>(!state.query||`${p.name} ${p.brand} ${p.sub} ${p.category} ${p.sku}`.toLowerCase().includes(state.query.toLowerCase()))&&(!state.category||p.category===state.category||state.category==='Sale'&&p.sale)&&(!state.gender||p.gender===state.gender)&&(!state.brand||p.brand===state.brand)&&p.price<=state.price);
  switch(state.sort){
    case'priceAsc':arr.sort((a,b)=>a.price-b.price);break;
    case'priceDesc':arr.sort((a,b)=>b.price-a.price);break;
    case'name':arr.sort((a,b)=>a.name.localeCompare(b.name));break;
    case'newest':arr.sort((a,b)=>Number(b.new)-Number(a.new));break;
    default:arr.sort((a,b)=>Number(b.new)-Number(a.new)||a.id-b.id);
  }
  return arr;
}

function populateBrands(){
  const sel=$('#brandFilter');
  if(!sel)return;
  [...new Set(products.map(p=>p.brand))].sort().forEach(b=>sel.insertAdjacentHTML('beforeend',`<option value="${b}">${b}</option>`));
}

function productCard(p){
  return `<article class="product-card reveal"><button class="wishlist" aria-label="Favorito">♡</button><a href="/producto?id=${p.id}" class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}"><span class="tag" style="display:${p.sale||p.new?'inline-block':'none'}">${p.sale?'SALE':'NUEVO'}</span></a><div class="product-meta"><span class="product-brand">${p.brand} · ${p.category}</span><h3><a href="/producto?id=${p.id}">${p.name}</a></h3><div class="product-row"><strong class="price">${money(p.price)}</strong><button class="add" data-add="${p.id}">+</button></div></div></article>`;
}

function renderCatalog(){
  const grid=$('#productGrid');
  if(!grid)return;
  const arr=getFiltered(),shown=arr.slice(0,state.visible);
  grid.innerHTML=shown.length?shown.map(productCard).join(''):'<div class="no-results">No encontramos productos con esos criterios.</div>';
  grid.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{
    const p=products.find(x=>x.id===+b.dataset.add);
    if(p)addToCart(p);
  }));
  const meta=$('#resultMeta');
  if(meta)meta.textContent=state.query||state.category||state.brand?`Mostrando ${Math.min(state.visible,arr.length).toLocaleString()} de ${arr.length.toLocaleString()} resultados.`:`${products.length.toLocaleString()} productos disponibles en catálogo.`;
  const more=$('#loadMore');
  if(more)more.style.display=shown.length<arr.length?'inline-flex':'none';
  setupReveal();
}

function updateCatalogHeading(){
  const title=$('#catalogTitle'),intro=$('#catalogIntro');
  if(!title||!intro)return;
  const gender=qs.get('gender');
  const category=qs.get('category');
  if(gender==='Mujer'){title.textContent='Mujer.';intro.textContent='Descubre la selección CYLO para mujer: moda, accesorios y piezas esenciales curadas para cada temporada.';}
  else if(gender==='Hombre'){title.textContent='Hombre.';intro.textContent='Explora la selección CYLO para hombre: prendas, calzado y accesorios reunidos en un solo universo.';}
  else if(category==='Calzado'){title.textContent='Calzado.';intro.textContent='Sneakers, botas, sandalias y piezas esenciales seleccionadas para completar tu estilo.';}
  else if(category==='Tecnología'){title.textContent='Tecnología.';intro.textContent='Tecnología seleccionada con el mismo criterio de diseño, utilidad y calidad que define a CYLO.';}
  else if(category==='Electrodomésticos'){title.textContent='Electrodomésticos.';intro.textContent='Equipamiento para el hogar con una selección cuidada de funcionalidad y diseño.';}
  else if(category==='Belleza'){title.textContent='Belleza.';intro.textContent='Perfumería, cuidado y belleza seleccionados para complementar tu universo CYLO.';}
  else if(category==='Moda'){title.textContent='Moda.';intro.textContent='Moda curada por CYLO, desde esenciales cotidianos hasta piezas de temporada.';}
  else if(category==='Sale'){title.textContent='Sale.';intro.textContent='Una selección especial de referencias con precio preferencial mientras exista disponibilidad.';}
  else{title.textContent='Todo el universo CYLO.';intro.textContent='Más de 1,000 referencias en un catálogo diseñado para navegar rápido, filtrar con precisión y encontrar exactamente lo que buscas.';}
}

function setupCatalog(){
  if(!$('#productGrid'))return;
  populateBrands();
  const initialCategory=qs.get('category')||'';
  const initialGender=qs.get('gender')||'';
  if(initialCategory&&[...categories,'Sale'].includes(initialCategory))state.category=initialCategory;
  if(initialGender&&['Hombre','Mujer','Unisex','Hogar'].includes(initialGender)){state.gender=initialGender;$('#genderFilter').value=initialGender;}
  const initialQ=qs.get('q');
  if(initialQ)state.query=initialQ;
  const input=$('#siteSearchInput');
  if(input)input.value=state.query;
  const refreshSearch=()=>{state.query=input?.value.trim()||'';state.visible=24;renderCatalog();};
  input?.addEventListener('input',refreshSearch);
  $('#searchFocus')?.addEventListener('click',()=>input?.focus());
  $('#categoryFilter')?.addEventListener('change',e=>{state.category=e.target.value;state.visible=24;renderCatalog();});
  $('#genderFilter')?.addEventListener('change',e=>{state.gender=e.target.value;state.visible=24;renderCatalog();});
  $('#brandFilter')?.addEventListener('change',e=>{state.brand=e.target.value;state.visible=24;renderCatalog();});
  $('#priceFilter')?.addEventListener('input',e=>{state.price=+e.target.value;$('#priceValue').textContent=Number(state.price).toLocaleString('en-US');state.visible=24;renderCatalog();});
  $('#sortSelect')?.addEventListener('change',e=>{state.sort=e.target.value;renderCatalog();});
  $('#loadMore')?.addEventListener('click',()=>{state.visible+=24;renderCatalog();});
  $('#clearFilters')?.addEventListener('click',()=>{
    state.query='';state.category='';state.gender='';state.brand='';state.price=12000;state.visible=24;
    if(input)input.value='';
    if($('#categoryFilter'))$('#categoryFilter').value='';
    if($('#genderFilter'))$('#genderFilter').value='';
    if($('#brandFilter'))$('#brandFilter').value='';
    if($('#priceFilter'))$('#priceFilter').value=12000;
    if($('#priceValue'))$('#priceValue').textContent='12,000';
    history.replaceState({},'',location.pathname);
    updateCatalogHeading();
    renderCatalog();
  });
  updateCatalogHeading();
  renderCatalog();
}

function searchPool(q){const needle=q.toLowerCase();return products.filter(p=>`${p.name} ${p.brand} ${p.sub} ${p.category} ${p.sku}`.toLowerCase().includes(needle)).slice(0,6)}
function setupPredictiveSearch(){
  const input=$('#siteSearchInput');
  if(!input)return;
  let panel=document.querySelector('#searchSuggestions');
  if(!panel){
    panel=document.createElement('div');
    panel.id='searchSuggestions';
    panel.className='search-suggest';
    input.closest('.search')?.appendChild(panel);
  }
  const close=()=>panel.classList.remove('open');
  const render=()=>{
    const q=input.value.trim();
    if(!q){
      panel.innerHTML='<div class="search-section">DESCUBRE</div><a class="search-result" href="/colecciones"><div><strong>Explorar colecciones</strong><small>Selecciones editoriales de CONCEPT CYLO</small></div></a><a class="search-result" href="/marcas"><div><strong>Explorar marcas</strong><small>Encuentra tus firmas favoritas</small></div></a>';
      panel.classList.add('open');
      return;
    }
    const results=searchPool(q);
    panel.innerHTML=results.length?`<div class="search-section">RESULTADOS</div>${results.map(p=>`<a class="search-result" href="/producto?id=${p.id}"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>${p.brand} · ${money(p.price)}</small></div></a>`).join('')}<a class="search-footer" href="/tienda?q=${encodeURIComponent(q)}">VER TODOS LOS RESULTADOS →</a>`:`<div class="search-section">SIN RESULTADOS</div><a class="search-result" href="/tienda?q=${encodeURIComponent(q)}"><div><strong>Buscar “${q}” en el catálogo</strong><small>Ver resultados completos</small></div></a>`;
    panel.classList.add('open');
  };
  input.addEventListener('focus',render);
  input.addEventListener('input',render);
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape')close();
    if(e.key==='Enter'){
      e.preventDefault();
      const q=input.value.trim();
      if(q)location.href=`/tienda?q=${encodeURIComponent(q)}`;
    }
  });
  document.addEventListener('click',e=>{
    if(!input.closest('.search')?.contains(e.target))close();
  });
}
function setupSearchEverywhere(){const input=$('#siteSearchInput');if(!input)return;input.value=qs.get('q')||input.value;setupPredictiveSearch();}

function setupProduct(){
  const host=$('#productDetail');
  if(!host)return;
  const id=+(qs.get('id')||1);
  const p=products.find(x=>x.id===id)||products[0];
  const gallery=p.gallery||[p.image];
  host.innerHTML=`<div class="detail-gallery reveal"><div class="detail-thumbs">${gallery.map((img,i)=>`<button class="detail-thumb ${i===0?'active':''}" data-img="${img}"><img src="${img}" alt="Vista ${i+1}"></button>`).join('')}</div><div class="detail-main-image"><img id="detailMainImage" src="${p.image}" alt="${p.name}"></div></div><div class="detail-copy reveal product-info-card"><span class="brandline">${p.brand} · ${p.category}</span><h1>${p.name}</h1><div class="detail-price">${money(p.price)}</div><p>${p.description}</p><div class="choice-group"><label>COLOR</label><div class="choices"><button class="choice active" data-gallery="0">NEGRO</button><button class="choice" data-gallery="1">BLANCO</button><button class="choice" data-gallery="2">BEIGE</button></div></div><div class="choice-group"><label>TAMAÑO / PRESENTACIÓN</label><div class="choices"><button class="choice">S</button><button class="choice active">M</button><button class="choice">L</button><button class="choice">ÚNICO</button></div></div><div class="detail-meta"><div><strong>SKU</strong><br>${p.sku}</div><div><strong>Disponibilidad</strong><br>${p.availability}</div></div><div class="actions"><button class="btn btn-dark" id="detailAdd">AGREGAR A MI SELECCIÓN</button><a class="btn btn-outline" href="/tienda?category=${encodeURIComponent(p.category)}">VER MÁS DE ${p.category.toUpperCase()}</a></div><div class="spec-grid"><div class="spec-item"><span>MARCA</span><strong>${p.brand}</strong></div><div class="spec-item"><span>CATEGORÍA</span><strong>${p.category}</strong></div><div class="spec-item"><span>REFERENCIA</span><strong>${p.sku}</strong></div><div class="spec-item"><span>DISPONIBILIDAD</span><strong>${p.availability}</strong></div></div><div class="accordion"><div class="accordion-item open"><button class="accordion-head">DESCRIPCIÓN <span>＋</span></button><div class="accordion-body"><div><p>${p.description} Una referencia pensada para integrarse con el resto de la selección CYLO.</p></div></div></div><div class="accordion-item"><button class="accordion-head">ENVÍOS Y ATENCIÓN <span>＋</span></button><div class="accordion-body"><div><p>Coordinamos entregas a todo Guatemala y atención personalizada por WhatsApp. La disponibilidad final se confirma antes de cerrar la compra.</p></div></div></div></div></div>`;
  
  host.querySelectorAll('.detail-thumb').forEach(btn=>btn.addEventListener('click',()=>{
    host.querySelectorAll('.detail-thumb').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    $('#detailMainImage').src=btn.dataset.img;
  }));
  host.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    btn.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.gallery!==undefined){
      const img=gallery[Number(btn.dataset.gallery)%gallery.length];
      $('#detailMainImage').src=img;
      host.querySelectorAll('.detail-thumb').forEach((thumb,i)=>thumb.classList.toggle('active',i===Number(btn.dataset.gallery)%gallery.length));
    }
  }));
  host.querySelectorAll('.accordion-head').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
  $('#detailAdd')?.addEventListener('click',()=>addToCart(p));
  setupReveal();
}

function setupCollections(){
  document.querySelectorAll('.collection-card').forEach(card=>card.addEventListener('click',()=>card.classList.add('clicked')));
}
function setupHomeFilters(){
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',e=>{
    e.preventDefault();
    location.href=`/tienda?category=${encodeURIComponent(el.dataset.filter)}`;
  }));
}

function init(){
  document.body.classList.remove('preload');
  document.body.classList.add('page-enter');
  setTimeout(() => document.body.classList.remove('page-enter'), 600);
  setActiveNav();
  setMenu();
  transitionLinks();
  setupReveal();
  loadCart();
  wireCart();
  renderCart();
  setupSearchEverywhere();
  setupCatalog();
  setupProduct();
  setupHomeFilters();
  setupCollections();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
