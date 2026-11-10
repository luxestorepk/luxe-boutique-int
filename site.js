/* ============ LAYOUT + ROUTER ============ */
function layout(){
  document.body.insertAdjacentHTML('afterbegin',`<div class="announce">Free worldwide shipping over $250 · Secure checkout · 14-day returns</div>
  <header class="top"><button class="icon menu-btn" onclick="document.body.classList.toggle('nav-open')" aria-label="Menu">☰</button>
  <a href="index.html" class="logo">Maison Noor</a>
  <nav id="nav"><a href="shop.html">Shop all</a><a href="shop.html?cat=Dresses">Dresses</a><a href="shop.html?cat=Abayas">Abayas</a><a href="shop.html?cat=Bags">Bags</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></nav>
  <form class="search" action="shop.html" role="search" autocomplete="off"><input id="sq" name="q" placeholder="Search dresses, abayas, bags…" aria-label="Search products" oninput="suggest()"><button aria-label="Search">Search</button><div id="sug"></div></form>
  <div class="tools"><select id="cur" aria-label="Currency" onchange="setCur(this.value)"></select><a href="wishlist.html" class="icon" aria-label="Wishlist">♡<b id="wc"></b></a><a href="cart.html" class="icon" aria-label="Bag">Bag<b id="cc"></b></a></div></header>`);
  document.body.insertAdjacentHTML('beforeend',`<footer><div class="fgrid"><div><h4>Maison Noor</h4><p>Handcrafted occasion wear, made in small batches and shipped worldwide.</p></div>
  <div><h4>Shop</h4><a href="shop.html">All products</a><a href="shop.html?cat=Dresses">Dresses</a><a href="shop.html?cat=Abayas">Abayas</a><a href="shop.html?cat=Bags">Bags</a></div>
  <div><h4>Help</h4><a href="faq.html">Help &amp; FAQ</a><a href="shipping.html">Shipping &amp; returns</a><a href="size.html">Size guide</a><a href="contact.html">Contact</a><a id="wf" target="_blank" rel="noopener">WhatsApp us</a></div>
  <div><h4>We accept</h4><div class="pays"><span>Visa</span><span>Mastercard</span><span>PayPal</span><span>Apple Pay</span><span>Google Pay</span></div></div></div><p class="copy">© 2026 Maison Noor. All rights reserved. · <a href="privacy.html">Privacy policy</a> · <a href="terms.html">Terms &amp; conditions</a></p></footer>
  <div id="toast" role="status"></div>
  <div id="bot" hidden role="dialog" aria-label="Chat assistant"><div class="bh"><b>Noor Assistant</b><small>Instant answers, 24/7</small><button onclick="toggleBot()" aria-label="Close chat">✕</button></div><div id="bm" aria-live="polite"></div><div id="bc"></div><form onsubmit="return sendBot(event)"><input id="bi" placeholder="Ask about shipping, sizes, payment…" autocomplete="off" aria-label="Your question"><button>Send</button></form></div>
  <button id="bfab" onclick="toggleBot()">Chat with us</button><a id="wa" target="_blank" rel="noopener">WhatsApp</a>`);
  document.addEventListener('click',e=>{ if(!e.target.closest('.search')) $('#sug').classList.remove('show'); });
}
function route(){
  const P=new URLSearchParams(location.search), pg=document.body.dataset.page||'home';
  $('#app').innerHTML = pg==='shop' ? pages.shop(P.get('cat')||'All', P.get('q')||'') : pg==='product' ? pages.product(P.get('id')) : (pages[pg]||pages.notfound)();
  document.body.classList.remove('nav-open');
  const here=(location.pathname.split('/').pop()||'index.html')+location.search;
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===here));
  reveal();
}
function reveal(){
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.1});
  els.forEach(e=>io.observe(e));
}
document.documentElement.classList.add('js');
layout();
$('#cur').innerHTML = Object.keys(CONFIG.rates).map(c=>`<option ${c===cur?'selected':''}>${c}</option>`).join('');
badges(); route();
