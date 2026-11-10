/* ============ SETTINGS (edit these) ============ */
const CONFIG = {
  brand: 'Maison Noor',
  whatsapp: ['92','371','6649231'].join(''),  // WhatsApp is only used behind buttons; the number is never shown
  stripeLink: '',                      // paste Stripe Payment Link (https://buy.stripe.com/...)
  paypalMe: '',                        // e.g. 'yourname' for paypal.me/yourname
  bank: 'Bank: ____ | IBAN: ____ | Name: ____',
  freeShipOver: 250, shipping: 15,
  coupons: { WELCOME10: 0.10, NOOR15: 0.15 },
  rates: { USD: 1, EUR: 0.92, GBP: 0.79, AED: 3.67, PKR: 280 },
  symbols: { USD: '$', EUR: '€', GBP: '£', AED: 'AED ', PKR: 'Rs ' }
};
/* Product images: put a file named exactly images/<id>.jpg for each product. */
const PRODUCTS = [
  { id:'silk-evening-gown', name:'Silk Evening Gown', cat:'Dresses', price:420, tag:'New', sizes:true, desc:'Floor-length gown in pure mulberry silk with a hand-finished bias cut.' },
  { id:'embroidered-velvet-abaya', name:'Embroidered Velvet Abaya', cat:'Abayas', price:310, tag:'Bestseller', sizes:true, desc:'Soft velvet abaya with gold thread embroidery along the cuffs and hem.' },
  { id:'pearl-trim-clutch', name:'Pearl Trim Clutch', cat:'Bags', price:185, sizes:false, desc:'Structured satin clutch with a hand-set pearl closure and detachable chain.' },
  { id:'cashmere-wrap-shawl', name:'Cashmere Wrap Shawl', cat:'Shawls', price:260, sizes:false, desc:'Lightweight cashmere shawl, generous enough to wear as a wrap or scarf.' },
  { id:'gold-lace-kaftan', name:'Gold Lace Kaftan', cat:'Kaftans', price:340, tag:'New', sizes:true, desc:'Relaxed kaftan with metallic lace panels and a flowing silhouette.' },
  { id:'satin-wide-leg-set', name:'Satin Wide-Leg Set', cat:'Sets', price:295, sizes:true, desc:'Matching satin top and wide-leg trousers, tailored for day-to-night wear.' },
  { id:'leather-tote-bag', name:'Leather Tote Bag', cat:'Bags', price:360, tag:'Bestseller', sizes:false, desc:'Full-grain leather tote with a suede lining and room for a 13" laptop.' },
  { id:'crystal-drop-earrings', name:'Crystal Drop Earrings', cat:'Jewelry', price:120, sizes:false, desc:'Gold-plated drop earrings set with hand-cut crystals.' }
];
const SIZES = ['XS','S','M','L','XL'];
const $ = s => document.querySelector(s);
const ls = (k,d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } };
const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} };
let cur = ls('cur','USD'), cart = ls('cart',{}), wish = ls('wish',[]), coupon = ls('coupon',''), picked = 'M';

const money = usd => CONFIG.symbols[cur] + (usd * CONFIG.rates[cur]).toFixed(cur==='PKR'?0:2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const byId = id => PRODUCTS.find(p => p.id === id);
const img = p => `<img src="${p.id}.jpg" alt="${p.name}" loading="lazy" onerror="ph(this,'${p.name.replace(/'/g,'')}')">`;
function ph(el, name){ el.outerHTML = `<div class="ph">${name}</div>`; }
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000); }

function card(p){
  const on = wish.includes(p.id) ? 'on' : '';
  return `<article class="card">
    <a class="im" href="#/product/${p.id}">${img(p)}</a>
    ${p.tag?`<span class="tag">${p.tag}</span>`:''}
    <button class="wl ${on}" onclick="toggleWish('${p.id}')" aria-label="Save to wishlist">♡</button>
    <h3><a href="#/product/${p.id}">${p.name}</a></h3><div class="pr">${money(p.price)}</div></article>`;
}

/* ============ PAGES ============ */
const pages = {
  home(){
    const cats = ['Dresses','Abayas','Bags'].map(c => { const p = PRODUCTS.find(x=>x.cat===c); return `<a href="#/shop/${c}">${img(p)}<span>${c}</span></a>`; }).join('');
    return `<section class="hero"><div class="hero-t"><h1>Dressed for every occasion worth remembering</h1>
      <p>Handcrafted pieces in silk, velvet and cashmere. Made in small batches, shipped worldwide.</p>
      <div><a class="btn" href="#/shop">Shop the collection</a></div></div>
      <div class="hero-i">${img(PRODUCTS[0])}</div></section>
      <div class="trust"><div><b>Worldwide shipping</b>Tracked, insured</div><div><b>Secure payment</b>Cards, PayPal, wallets</div><div><b>14-day returns</b>Free exchanges</div><div><b>Made by hand</b>Small batches</div></div>
      <div class="wrap"><h2 class="sec">New arrivals</h2><div class="grid">${PRODUCTS.filter(p=>p.tag==='New'||p.tag==='Bestseller').slice(0,4).map(card).join('')}</div></div>
      <div class="wrap"><h2 class="sec">Shop by category</h2><div class="cats">${cats}</div></div>`;
  },
  shop(cat, q){
    const cats = ['All',...new Set(PRODUCTS.map(p=>p.cat))];
    let list = PRODUCTS.filter(p => (!cat||cat==='All'||p.cat===cat));
    return `<div class="wrap"><h2 class="sec">${cat&&cat!=='All'?cat:'All products'}</h2>
      <div class="bar"><input id="q" placeholder="Search products" oninput="filterShop()">
      <select id="cf" onchange="location.hash='#/shop/'+this.value">${cats.map(c=>`<option ${c===(cat||'All')?'selected':''}>${c}</option>`).join('')}</select>
      <select id="sf" onchange="filterShop()"><option value="">Sort: Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div>
      <div class="grid" id="list">${list.map(card).join('')}</div></div>`;
  },
  product(id){
    const p = byId(id); if(!p) return pages.notfound();
    const rel = PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,4);
    return `<div class="wrap"><div class="pd"><div class="big">${img(p)}</div><div>
      <small>${p.cat}</small><h1>${p.name}</h1><div class="pr">${money(p.price)}</div><p>${p.desc}</p>
      ${p.sizes?`<div class="sizes" id="sz">${SIZES.map(s=>`<button class="${s===picked?'on':''}" onclick="pick('${s}')">${s}</button>`).join('')}</div>`:'<br>'}
      <button class="btn full" onclick="add('${p.id}')">Add to bag</button><br><br>
      <button class="btn ghost full" onclick="toggleWish('${p.id}',1)">Save to wishlist</button>
      <div class="acc"><details open><summary>Shipping</summary><p>Free over ${money(CONFIG.freeShipOver)}. Delivery in 5–10 business days worldwide.</p></details>
      <details><summary>Returns</summary><p>Unworn items can be returned within 14 days.</p></details>
      <details><summary>Care</summary><p>Dry clean only. Store in the garment bag provided.</p></details></div></div></div>
      <h2 class="sec" style="margin-top:3rem">You may also like</h2><div class="grid">${rel.map(card).join('')}</div></div>`;
  },
  wishlist(){
    const l = wish.map(byId).filter(Boolean);
    return `<div class="wrap"><h2 class="sec">Wishlist</h2>${l.length?`<div class="grid">${l.map(card).join('')}</div>`:'<div class="empty">Nothing saved yet. <a href="#/shop"><u>Browse the shop</u></a></div>'}</div>`;
  },
  cart(){
    const items = Object.entries(cart);
    if(!items.length) return `<div class="wrap empty"><h2 class="sec">Your bag is empty</h2><a class="btn" href="#/shop">Continue shopping</a></div>`;
    const rows = items.map(([k,q])=>{ const [id,size]=k.split('|'); const p=byId(id); return `<div class="row"><a class="im" href="#/product/${id}">${img(p)}</a>
      <div><h3>${p.name}</h3><small>${size?'Size '+size+' · ':''}${money(p.price)}</small><br>
      <div class="qty"><button onclick="qty('${k}',-1)">−</button><span>${q}</span><button onclick="qty('${k}',1)">+</button></div></div>
      <strong>${money(p.price*q)}</strong></div>`; }).join('');
    const t = totals();
    return `<div class="wrap"><h2 class="sec">Your bag</h2><div class="two"><div>${rows}</div>${summary(t,true)}</div></div>`;
  },
  checkout(){
    if(!Object.keys(cart).length){ location.hash='#/cart'; return ''; }
    const t = totals();
    return `<div class="wrap"><h2 class="sec">Checkout</h2><div class="two"><div>
      <h3>Delivery details</h3><br><div class="fld">
      <input id="fn" placeholder="Full name" class="w" autocomplete="name"><input id="em" type="email" placeholder="Email" autocomplete="email"><input id="ph" placeholder="Phone (with country code)" autocomplete="tel">
      <input id="ad" placeholder="Street address" class="w" autocomplete="street-address"><input id="ct" placeholder="City"><input id="zp" placeholder="Postal code">
      <input id="co" placeholder="Country" class="w" autocomplete="country-name"></div>
      <h3>Payment</h3><br><div class="pay">
      <label><input type="radio" name="pm" value="card" checked><span>Credit / debit card</span><small>Visa, Mastercard, Amex</small></label>
      <label><input type="radio" name="pm" value="paypal"><span>PayPal</span></label>
      <label><input type="radio" name="pm" value="wallet"><span>Apple Pay / Google Pay</span><small>via Stripe</small></label>
      <label><input type="radio" name="pm" value="bank"><span>Bank transfer</span></label>
      <label><input type="radio" name="pm" value="cod"><span>Cash on delivery</span><small>Pakistan only</small></label></div></div>
      ${summary(t,false)}</div></div>`;
  },
  about(){ return `<div class="wrap prose"><h2 class="sec">Our story</h2><p>Maison Noor makes occasion wear for people who want one piece they will keep for years. Every garment is cut and finished by hand in small batches.</p><p><b>Shipping:</b> Worldwide, tracked and insured. Free over ${money(CONFIG.freeShipOver)}.</p><p><b>Returns:</b> 14 days for unworn items with tags attached.</p></div>`; },
  contact(){ return `<div class="wrap prose"><h2 class="sec">Contact</h2><p>Questions about sizing or an order? Message us and we will reply within one business day.</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}">Chat on WhatsApp</a></div>`; },
  notfound(){ return `<div class="wrap empty"><h2 class="sec">Page not found</h2><a class="btn" href="#/">Back to home</a></div>`; }
};

/* ============ CART LOGIC ============ */
function totals(){
  let sub = 0; Object.entries(cart).forEach(([k,q])=>{ sub += byId(k.split('|')[0]).price*q; });
  const disc = sub*(CONFIG.coupons[coupon]||0);
  const ship = sub-disc>=CONFIG.freeShipOver||!sub ? 0 : CONFIG.shipping;
  return { sub, disc, ship, total: sub-disc+ship };
}
function summary(t, isCart){
  return `<aside class="sum"><h3>Order summary</h3><br>
    <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc?`<div><span>Discount (${coupon})</span><span>−${money(t.disc)}</span></div>`:''}
    <div><span>Shipping</span><span>${t.ship?money(t.ship):'Free'}</span></div>
    <div class="tot"><span>Total</span><span>${money(t.total)}</span></div><br>
    ${isCart?`<div class="fld" style="grid-template-columns:1fr auto"><input id="cp" placeholder="Discount code" value="${coupon}"><button class="btn ghost" onclick="applyCoupon()">Apply</button></div>
    <a class="btn full" href="#/checkout">Go to checkout</a>`:`<button class="btn full" onclick="placeOrder()">Place order · ${money(t.total)}</button>`}</aside>`;
}
function add(id){ const p=byId(id); const k=id+(p.sizes?'|'+picked:''); cart[k]=(cart[k]||0)+1; save('cart',cart); badges(); toast('Added to bag'); }
function qty(k,d){ cart[k]+=d; if(cart[k]<=0) delete cart[k]; save('cart',cart); badges(); route(); }
function pick(s){ picked=s; document.querySelectorAll('#sz button').forEach(b=>b.classList.toggle('on',b.textContent===s)); }
function toggleWish(id,msg){ const i=wish.indexOf(id); i<0?wish.push(id):(msg?0:wish.splice(i,1)); save('wish',wish); badges(); if(msg) toast('Saved to wishlist'); else route(); }
function applyCoupon(){ const c=$('#cp').value.trim().toUpperCase(); if(CONFIG.coupons[c]){coupon=c;save('coupon',c);toast('Code applied');}else{coupon='';save('coupon','');toast('Invalid code');} route(); }
function setCur(c){ cur=c; save('cur',c); route(); }
function badges(){ $('#cc').textContent=Object.values(cart).reduce((a,b)=>a+b,0)||''; $('#wc').textContent=wish.length||''; }
function filterShop(){
  const q=($('#q').value||'').toLowerCase(), s=$('#sf').value, cat=(location.hash.split('/')[2]||'All');
  let l=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&p.name.toLowerCase().includes(q));
  if(s==='lo') l.sort((a,b)=>a.price-b.price); if(s==='hi') l.sort((a,b)=>b.price-a.price);
  $('#list').innerHTML = l.length?l.map(card).join(''):'<div class="empty">No products match your search.</div>';
}

/* ============ ORDER / PAYMENT ============ */
function placeOrder(){
  const v = id => $('#'+id).value.trim();
  const req = ['fn','em','ph','ad','ct','co'];
  if(req.some(i=>!v(i))){ toast('Please fill in all delivery details'); return; }
  if(!/^\S+@\S+\.\S+$/.test(v('em'))){ toast('Enter a valid email'); return; }
  const pm = document.querySelector('input[name=pm]:checked').value, t = totals();
  const lines = Object.entries(cart).map(([k,q])=>{ const [id,s]=k.split('|'); return `• ${byId(id).name}${s?' ('+s+')':''} ×${q}`; }).join('\n');
  const order = `New order – ${CONFIG.brand}\n${lines}\nTotal: ${money(t.total)} (USD ${t.total.toFixed(2)})\nPayment: ${pm}\nName: ${v('fn')}\nEmail: ${v('em')}\nPhone: ${v('ph')}\nAddress: ${v('ad')}, ${v('ct')} ${v('zp')}, ${v('co')}`;
  const wa = () => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(order)}`,'_blank');
  if((pm==='card'||pm==='wallet') && CONFIG.stripeLink){ window.open(CONFIG.stripeLink,'_blank'); wa(); }
  else if(pm==='paypal' && CONFIG.paypalMe){ window.open(`https://paypal.me/${CONFIG.paypalMe}/${t.total.toFixed(2)}USD`,'_blank'); wa(); }
  else if(pm==='bank'){ alert('Transfer to:\n'+CONFIG.bank+'\n\nThen send the receipt on WhatsApp.'); wa(); }
  else wa();
  cart={}; coupon=''; save('cart',cart); save('coupon',''); badges();
  $('#app').innerHTML='<div class="wrap empty"><h2 class="sec">Thank you</h2><p>Your order was sent. We will confirm it by email shortly.</p><br><a class="btn" href="#/shop">Continue shopping</a></div>';
}

/* ============ ROUTER ============ */
function route(){
  const [, page='home', arg] = (location.hash.slice(1)||'/').split('/');
  const fn = { '':'home', home:'home', shop:'shop', product:'product', cart:'cart', checkout:'checkout', wishlist:'wishlist', about:'about', contact:'contact' }[page];
  $('#app').innerHTML = fn ? pages[fn](decodeURIComponent(arg||'')) : pages.notfound();
  document.body.classList.remove('nav-open');
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===location.hash));
  window.scrollTo(0,0);
}
$('#cur').innerHTML = Object.keys(CONFIG.rates).map(c=>`<option ${c===cur?'selected':''}>${c}</option>`).join('');
window.addEventListener('hashchange', route);
badges(); route();
  
