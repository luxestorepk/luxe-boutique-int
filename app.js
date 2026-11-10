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
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WA = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t||'Hello '+CONFIG.brand+', I need help with my order.')}`;
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
  return `<article class="card reveal"><div class="imw"><a class="im" href="product.html?id=${p.id}">${img(p)}</a>
    ${p.tag?`<span class="tag">${p.tag}</span>`:''}
    <button class="wl ${on}" data-w="${p.id}" onclick="toggleWish('${p.id}')" aria-label="Save to wishlist">♡</button>
    <button class="qa" onclick="add('${p.id}')">Quick add</button></div>
    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3><div class="pr">${money(p.price)}</div></article>`;
}

/* ============ PAGES ============ */
const pages = {
  home(){
    const cats = ['Dresses','Abayas','Bags'].map(c => { const p = PRODUCTS.find(x=>x.cat===c); return `<a class="reveal" href="shop.html?cat=${c}">${img(p)}<span>${c}</span></a>`; }).join('');
    const mq = '<span>Worldwide shipping</span><i>✦</i><span>Handcrafted in small batches</span><i>✦</i><span>Secure checkout</span><i>✦</i><span>14-day returns</span><i>✦</i>'.repeat(2);
    const rv = [['Amina, Dubai','The velvet abaya fits perfectly and the embroidery is even better in person.'],['Sophie, London','Fast delivery and beautiful packaging. I will order again.'],['Daniel, New York','The cashmere shawl is so soft. Exactly as described.']].map(r=>`<div class="rcard reveal"><div class="st">★★★★★</div><p>“${r[1]}”</p><small>${r[0]}</small></div>`).join('');
    return `<section class="hero"><div class="hero-t"><small class="eye">New season collection</small><h1>Dressed for every occasion worth remembering</h1>
      <p>Handcrafted pieces in silk, velvet and cashmere. Made in small batches, shipped worldwide.</p>
      <div class="btns"><a class="btn" href="shop.html">Shop the collection</a><a class="btn ghost" href="about.html">Our story</a></div></div>
      <div class="hero-i">${img(PRODUCTS[0])}</div></section>
      <div class="marquee"><div>${mq}${mq}</div></div>
      <div class="wrap"><div class="sechead"><h2 class="sec">New arrivals</h2><a href="shop.html" class="lnk">View all</a></div><div class="grid">${PRODUCTS.filter(p=>p.tag).slice(0,4).map(card).join('')}</div></div>
      <div class="wrap"><h2 class="sec">Shop by category</h2><div class="cats">${cats}</div></div>
      <section class="edit"><div class="edit-i">${img(PRODUCTS[1])}</div><div class="edit-t"><small class="eye">The Evening Edit</small><h2>Velvet, gold thread and quiet confidence</h2><p>Our embroidered abaya is cut from soft velvet and finished by hand, made for evenings you want to remember.</p><div><a class="btn gold" href="product.html?id=embroidered-velvet-abaya">Shop the abaya</a></div></div></section>
      <div class="trust"><div><b>Worldwide shipping</b>Tracked, insured</div><div><b>Secure payment</b>Cards, PayPal, wallets</div><div><b>14-day returns</b>Free exchanges</div><div><b>Made by hand</b>Small batches</div></div>
      <div class="wrap"><h2 class="sec center">Loved around the world</h2><div class="rev">${rv}</div></div>
      <section class="cta"><h2>Need help choosing?</h2><p>Send us a message and we will help you find the right piece and size.</p><a class="btn wa-btn" target="_blank" rel="noopener" href="${WA()}">Chat on WhatsApp</a></section>`;
  },
  shop(cat, q){
    const cats = ['All',...new Set(PRODUCTS.map(p=>p.cat))];
    if(!cats.includes(cat)) cat='All';
    const list = filtered(cat,q,'');
    return `<div class="pagehead"><h1>${q?'Search results':(cat==='All'?'All products':cat)}</h1><p>${q?`Showing results for “${esc(q)}”`:'Handcrafted pieces for every occasion'}</p></div>
      <div class="wrap"><div class="chips">${cats.map(c=>`<a class="${c===cat&&!q?'on':''}" href="shop.html?cat=${c}">${c}</a>`).join('')}</div>
      <div class="bar"><input id="q" value="${esc(q)}" placeholder="Filter products" oninput="filterShop()"><select id="sf" onchange="filterShop()"><option value="">Sort: Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div>
      <div class="grid" id="list">${list.length?list.map(card).join(''):'<div class="empty">No products match your search. <a href="shop.html"><u>See all products</u></a></div>'}</div></div>`;
  },
  product(id){
    const p = byId(id); if(!p) return pages.notfound();
    document.title = p.name+' – '+CONFIG.brand;
    const rel = PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,4);
    return `<div class="wrap"><div class="crumb"><a href="index.html">Home</a> / <a href="shop.html?cat=${p.cat}">${p.cat}</a> / ${p.name}</div><div class="pd"><div class="big">${img(p)}</div><div>
      <small>${p.cat}</small><h1>${p.name}</h1><div class="pr">${money(p.price)}</div><p>${p.desc}</p>
      ${p.sizes?`<div class="sizes" id="sz">${SIZES.map(s=>`<button class="${s===picked?'on':''}" onclick="pick('${s}')">${s}</button>`).join('')}</div>`:'<br>'}
      <button class="btn full" onclick="add('${p.id}')">Add to bag</button><br><br>
      <a class="btn ghost full" target="_blank" rel="noopener" href="${WA('Hi, I would like to order: '+p.name)}">Order on WhatsApp</a><br><br>
      <button class="btn ghost full" onclick="toggleWish('${p.id}',1)">Save to wishlist</button>
      <ul class="feat"><li>Free worldwide shipping over ${money(CONFIG.freeShipOver)}</li><li>14-day returns and free exchanges</li><li>Secure encrypted checkout</li></ul>
      <div class="acc"><details open><summary>Shipping</summary><p>Delivery in 5–10 business days worldwide, tracked and insured.</p></details>
      <details><summary>Returns</summary><p>Unworn items can be returned within 14 days.</p></details>
      <details><summary>Care</summary><p>Dry clean only. Store in the garment bag provided.</p></details></div></div></div>
      <h2 class="sec" style="margin-top:3rem">You may also like</h2><div class="grid">${rel.map(card).join('')}</div></div>`;
  },
  wishlist(){
    const l = wish.map(byId).filter(Boolean);
    return `<div class="pagehead"><h1>Wishlist</h1><p>Your saved pieces</p></div><div class="wrap">${l.length?`<div class="grid">${l.map(card).join('')}</div>`:'<div class="empty">Nothing saved yet. <a href="shop.html"><u>Browse the shop</u></a></div>'}</div>`;
  },
  cart(){
    const items = Object.entries(cart);
    if(!items.length) return `<div class="wrap empty"><h2 class="sec">Your bag is empty</h2><a class="btn" href="shop.html">Continue shopping</a></div>`;
    const rows = items.map(([k,q])=>{ const [id,size]=k.split('|'); const p=byId(id); return `<div class="row"><a class="im" href="product.html?id=${id}">${img(p)}</a>
      <div><h3>${p.name}</h3><small>${size?'Size '+size+' · ':''}${money(p.price)}</small><br>
      <div class="qty"><button onclick="qty('${k}',-1)">−</button><span>${q}</span><button onclick="qty('${k}',1)">+</button></div></div>
      <strong>${money(p.price*q)}</strong></div>`; }).join('');
    const t = totals();
    return `<div class="wrap"><h2 class="sec">Your bag</h2><div class="two"><div>${rows}</div>${summary(t,true)}</div></div>`;
  },
  checkout(){
    if(!Object.keys(cart).length){ location.href='cart.html'; return ''; }
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
  about(){ return `<div class="pagehead"><h1>Our story</h1><p>Made slowly, shipped worldwide</p></div><div class="wrap"><div class="rev"><div class="rcard"><h3>Small batches</h3><p>Every piece is cut and finished by hand in limited runs, so nothing is mass produced.</p></div><div class="rcard"><h3>Fine fabrics</h3><p>Silk, velvet, cashmere and full-grain leather, chosen for how they feel and how they last.</p></div><div class="rcard"><h3>Delivered worldwide</h3><p>Tracked and insured shipping to most countries, with a 14-day return window.</p></div></div>
    <div class="prose" style="margin-top:2.5rem"><p><b>Shipping:</b> Free over ${money(CONFIG.freeShipOver)}. Delivery takes 5–10 business days.</p><p><b>Returns:</b> 14 days for unworn items with tags attached. Exchanges are free.</p></div></div>`; },
  contact(){ return `<div class="pagehead"><h1>Contact</h1><p>We reply within one business day</p></div><div class="wrap two"><div class="prose"><p>Questions about sizing, shipping or an order? Message us and we will help.</p><a class="btn wa-btn" target="_blank" rel="noopener" href="${WA()}">Chat on WhatsApp</a></div>
    <div class="fld"><input id="cn" placeholder="Your name" class="w"><textarea id="cm" rows="5" placeholder="How can we help?" class="w"></textarea><button class="btn w" onclick="sendContact()">Send via WhatsApp</button></div></div>`; },
  notfound(){ return `<div class="wrap empty"><h2 class="sec">Page not found</h2><a class="btn" href="index.html">Back to home</a></div>`; }
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
    <a class="btn full" href="checkout.html">Go to checkout</a>`:`<button class="btn full" onclick="placeOrder()">Place order · ${money(t.total)}</button>`}</aside>`;
}
function add(id){ const p=byId(id); const k=id+(p.sizes?'|'+picked:''); cart[k]=(cart[k]||0)+1; save('cart',cart); badges(); toast(p.sizes?'Added to bag · size '+picked:'Added to bag'); }
function qty(k,d){ cart[k]+=d; if(cart[k]<=0) delete cart[k]; save('cart',cart); badges(); route(); }
function pick(s){ picked=s; document.querySelectorAll('#sz button').forEach(b=>b.classList.toggle('on',b.textContent===s)); }
function toggleWish(id,msg){ const i=wish.indexOf(id); if(i<0) wish.push(id); else if(!msg) wish.splice(i,1); save('wish',wish); badges(); if(msg) toast('Saved to wishlist'); else if(document.body.dataset.page==='wishlist') route(); else document.querySelectorAll('[data-w="'+id+'"]').forEach(b=>b.classList.toggle('on',wish.includes(id))); }
function sendContact(){ const n=$('#cn').value.trim(), m=$('#cm').value.trim(); if(!n||!m){ toast('Please enter your name and message'); return; } window.open(WA('Hi, I am '+n+'. '+m),'_blank'); }
function applyCoupon(){ const c=$('#cp').value.trim().toUpperCase(); if(CONFIG.coupons[c]){coupon=c;save('coupon',c);toast('Code applied');}else{coupon='';save('coupon','');toast('Invalid code');} route(); }
function setCur(c){ cur=c; save('cur',c); route(); }
function badges(){ $('#cc').textContent=Object.values(cart).reduce((a,b)=>a+b,0)||''; $('#wc').textContent=wish.length||''; }
function filtered(cat,q,s){ q=(q||'').toLowerCase(); const l=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&(p.name+' '+p.cat+' '+p.desc).toLowerCase().includes(q)); if(s==='lo') l.sort((a,b)=>a.price-b.price); if(s==='hi') l.sort((a,b)=>b.price-a.price); return l; }
function filterShop(){ const P=new URLSearchParams(location.search); const l=filtered(P.get('cat')||'All',$('#q').value,$('#sf').value); $('#list').innerHTML=l.length?l.map(card).join(''):'<div class="empty">No products match your search.</div>'; reveal(); }
function suggest(){ const q=$('#sq').value.trim().toLowerCase(), b=$('#sug'); if(!q){ b.classList.remove('show'); return; } const l=PRODUCTS.filter(p=>(p.name+' '+p.cat).toLowerCase().includes(q)).slice(0,5); b.innerHTML=l.length?l.map(p=>`<a href="product.html?id=${p.id}">${img(p)}<span>${p.name}<small>${money(p.price)}</small></span></a>`).join(''):'<p>No matches. Press enter to search.</p>'; b.classList.add('show'); }

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
  $('#app').innerHTML='<div class="wrap empty"><h2 class="sec">Thank you</h2><p>Your order was sent. We will confirm it by email shortly.</p><br><a class="btn" href="shop.html">Continue shopping</a></div>';
}

                                                            
