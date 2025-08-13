// Cafe Story — JS (cart + slider + animations)
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

const currency = n => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);

const PRODUCTS = [
  { id:'latte', name:'Iced Latte', price:25000, img:'assets/images/iced-latte.svg', tag:'Best Seller' },
  { id:'frappe', name:'Caramel Frappé', price:30000, img:'assets/images/caramel-frappe.svg', tag:'Kekinian' },
  { id:'matcha', name:'Matcha Latte', price:28000, img:'assets/images/matcha-latte.svg', tag:'Favorit' },
  { id:'donut', name:'Choco Donut', price:12000, img:'assets/images/choco-donut.svg' },
  { id:'panini', name:'Chicken Panini', price:27000, img:'assets/images/chicken-panini.svg' },
  { id:'fries', name:'Cheese Fries', price:18000, img:'assets/images/cheese-fries.svg' },
];

// --- State & Storage
const CART_KEY = 'cafestory_cart_v1';
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const getCartCount = () => loadCart().reduce((a,i)=>a+i.qty,0);
const getCartTotal = () => loadCart().reduce((a,i)=>a+i.qty*i.price,0);

// --- Navbar: hamburger
const hamburger = $('#hamburger');
if (hamburger){
  hamburger.addEventListener('click', ()=>{
    const links = $('.nav-links');
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.gap = '10px';
    hamburger.classList.toggle('active');
  });
}

// --- Year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Slider
const slider = $('#slider');
if (slider){
  const slides = $$('.slide', slider);
  const dotsWrap = $('#sliderDots');
  let index = 0, timer;

  const renderDots = () => {
    dotsWrap.innerHTML = '';
    slides.forEach((_,i)=>{
      const b = document.createElement('button');
      b.addEventListener('click', ()=>go(i));
      b.className = i===index ? 'active' : '';
      dotsWrap.appendChild(b);
    });
  };
  const go = (i) => {
    slides[index].classList.remove('current');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('current');
    renderDots();
  };
  const next = () => go(index+1);
  const prev = () => go(index-1);
  $('#nextSlide').addEventListener('click', next);
  $('#prevSlide').addEventListener('click', prev);
  renderDots();
  timer = setInterval(next, 5000);
  slider.addEventListener('mouseenter', ()=>clearInterval(timer));
  slider.addEventListener('mouseleave', ()=>timer = setInterval(next, 5000));
}

// --- Products render
const productsGrid = $('.grid.products');
if (productsGrid){
  productsGrid.innerHTML = PRODUCTS.map(p=>`
    <div class="product reveal" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div class="p-body">
        <div class="badge">${p.tag || 'Baru'}</div>
        <h4>${p.name}</h4>
        <div class="price">${currency(p.price)}</div>
        <div class="actions">
          <div class="qty">
            <button class="dec" aria-label="kurangi">−</button>
            <span class="val">1</span>
            <button class="inc" aria-label="tambah">+</button>
          </div>
          <button class="btn solid add">Tambah</button>
        </div>
      </div>
    </div>`).join('');

  // animation reveal once in view
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold: .15});
  $$('.product').forEach(el=>io.observe(el));

  // qty & add handlers
  $$('.product').forEach(card=>{
    const qtyVal = $('.val', card);
    $('.inc', card).addEventListener('click', ()=> qtyVal.textContent = (+qtyVal.textContent)+1);
    $('.dec', card).addEventListener('click', ()=> qtyVal.textContent = Math.max(1, (+qtyVal.textContent)-1) );
    $('.add', card).addEventListener('click', ()=>{
      const id = card.dataset.id;
      const prod = PRODUCTS.find(p=>p.id===id);
      const qty = +qtyVal.textContent;
      const cart = loadCart();
      const ex = cart.find(i=>i.id===id);
      if (ex) ex.qty += qty; else cart.push({id, name:prod.name, price:prod.price, img:prod.img, qty});
      saveCart(cart);
      updateCartCount();
      openCart();
      renderCart();
      // playful ripple animation
      card.animate([{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}], {duration:300});
    });
  });
}

// --- Reveal generic
$$('.reveal').forEach(el=>{
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ e.target.classList.add('visible'); io2.unobserve(e.target); }
    });
  }, {threshold:.2});
  io2.observe(el);
});

// --- Stats counter animation
const animateCounter = (el, target, duration=1200)=>{
  const start = 0, t0 = performance.now();
  const step = (t)=>{
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = Math.floor(p*target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const statCups = $('#statCups'), statFriends = $('#statFriends');
if (statCups && statFriends){
  const io3 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        animateCounter(statCups, 1200);
        animateCounter(statFriends, 500);
        io3.disconnect();
      }
    });
  }, {threshold:.4});
  io3.observe(statCups);
}

// --- Cart Drawer
const cartDrawer = $('#cartDrawer');
const overlay = $('#overlay');
const cartCount = $('#cartCount');
const cartItems = $('#cartItems');
const cartTotal = $('#cartTotal');

const updateCartCount = () => { if (cartCount) cartCount.textContent = getCartCount(); };
updateCartCount();

const openCart = () => { if(cartDrawer){ cartDrawer.classList.add('open'); overlay.classList.add('show'); cartDrawer.setAttribute('aria-hidden','false'); } };
const closeCart = () => { if(cartDrawer){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); cartDrawer.setAttribute('aria-hidden','true'); } };
$('#openCart')?.addEventListener('click', openCart);
$('#closeCart')?.addEventListener('click', closeCart);
overlay?.addEventListener('click', closeCart);

function renderCart(){
  if (!cartItems) return;
  const cart = loadCart();
  if (cart.length === 0){
    cartItems.innerHTML = '<div class="muted">Keranjang kosong. Ayo pilih menu favoritmu!</div>';
    if (cartTotal) cartTotal.textContent = currency(0);
    return;
  }
  cartItems.innerHTML = cart.map((i, idx)=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div>
        <div class="title">${i.name}</div>
        <div class="small">${currency(i.price)} × ${i.qty}</div>
      </div>
      <div>
        <button class="btn ghost mini" data-idx="${idx}" data-action="dec">−</button>
        <button class="btn ghost mini" data-idx="${idx}" data-action="inc">+</button>
        <button class="btn solid mini" data-idx="${idx}" data-action="del">Hapus</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((a,i)=>a+i.qty*i.price,0);
  if (cartTotal) cartTotal.textContent = currency(total);

  // handlers
  $$('.cart-item button', cartItems).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = +btn.dataset.idx;
      const action = btn.dataset.action;
      const cart = loadCart();
      if (action==='inc') cart[idx].qty++;
      else if (action==='dec') cart[idx].qty = Math.max(1, cart[idx].qty-1);
      else if (action==='del') cart.splice(idx,1);
      saveCart(cart);
      updateCartCount();
      renderCart();
    });
  });
}
renderCart();

// --- Contact form (mock)
$('#contactForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  $('#contactStatus').textContent = 'Pesan terkirim! Kami akan balas lewat email.';
  e.target.reset();
});

// --- Checkout page logic
function renderCheckout(){
  const list = $('#summaryItems');
  if (!list) return;
  const cart = loadCart();
  if (cart.length===0){
    list.innerHTML = '<div class="muted">Keranjang masih kosong. <a href="index.html#menu">Kembali belanja</a>.</div>';
    $('#summarySubtotal').textContent = currency(0);
    $('#summaryTax').textContent = currency(0);
    $('#summaryTotal').textContent = currency(0);
    return;
  }
  list.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div>
        <div class="title">${i.name}</div>
        <div class="small">${currency(i.price)} × ${i.qty}</div>
      </div>
      <div><strong>${currency(i.price*i.qty)}</strong></div>
    </div>
  `).join('');
  const subtotal = cart.reduce((a,i)=>a+i.qty*i.price,0);
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;
  $('#summarySubtotal').textContent = currency(subtotal);
  $('#summaryTax').textContent = currency(tax);
  $('#summaryTotal').textContent = currency(total);
}
renderCheckout();

$('#checkoutForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const orderId = 'CS' + Math.random().toString(36).slice(2,8).toUpperCase();
  $('#checkoutStatus').textContent = `Pesanan berhasil dibuat! Kode: ${orderId}. Cek email untuk detail pesanan (simulasi).`;
  saveCart([]);
  updateCartCount();
  setTimeout(()=>{
    window.location.href = 'index.html';
  }, 2200);
});
