/* ============ ASSISTANT (works offline, no API key) ============ */
const WA = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t||'Hello '+CONFIG.brand+', I need help with my order.')}`;
const ALIAS = {'silk-evening-gown':['gown','evening','silk'],'embroidered-velvet-abaya':['abaya','velvet','embroidered'],'pearl-trim-clutch':['clutch','pearl'],'cashmere-wrap-shawl':['shawl','cashmere'],'gold-lace-kaftan':['kaftan','lace'],'satin-wide-leg-set':['satin','trouser','co-ord','coord'],'leather-tote-bag':['tote','leather'],'crystal-drop-earrings':['earring','crystal','jewelry','jewellery']};
const CATW = {Dresses:['dress','gown'],Abayas:['abaya'],Bags:['bag','handbag','purse'],Shawls:['shawl','scarf'],Kaftans:['kaftan'],Sets:['set','suit'],Jewelry:['jewelry','jewellery','earring']};
const stem = w => /(ss|x|ch|sh)es$/.test(w) ? w.slice(0,-2) : (w.length>3 && w.endsWith('s') && !w.endsWith('ss')) ? w.slice(0,-1) : w;
const toks = s => s.toLowerCase().replace(/[^a-z0-9 $-]/g,' ').split(/\s+/).filter(Boolean).map(stem);
const hasKw = (T,k) => { const K=toks(k); if(K.length===1) return T.includes(K[0]); const j=' '+T.join(' ')+' '; return j.includes(' '+K.join(' ')+' '); };
const waBtn = () => `<br><a class="btn wa-btn" target="_blank" rel="noopener" href="${WA()}">Chat on WhatsApp</a>`;
const INTENTS = [
 {k:['hi','hello','hey','salam','assalam','aoa','hola','good morning','good evening'], a:()=>`Hello and welcome to ${CONFIG.brand}. I can help with products, sizes, shipping, payments and returns. What would you like to know?`},
 {k:['ship','shipping','deliver','delivery','dispatch','courier','arrive','how long','kitne din','kab tak','time'], a:()=>`We ship worldwide with tracking and insurance. Delivery takes 5–10 business days. Shipping is free over ${money(CONFIG.freeShipOver)}, otherwise ${money(CONFIG.shipping)}.`},
 {k:['return','refund','exchange','wapis','replace','money back'], a:()=>`You can return unworn items with tags within 14 days. Exchanges are free. Message us and we will arrange the pickup.`},
 {k:['pay','payment','card','visa','mastercard','paypal','cod','cash','apple pay','google pay','bank','transfer','checkout'], a:()=>`We accept Visa, Mastercard, PayPal, Apple Pay, Google Pay and bank transfer. Cash on delivery is available in Pakistan. Checkout is encrypted and we never store your card details.`},
 {k:['size','sizing','fit','measurement','measure','xs','small','medium','large','xl','chart'], a:()=>`Most pieces come in XS to XL. For the best fit, send your bust, waist and hip measurements on WhatsApp and we will recommend a size.`},
 {k:['price','cost','how much','qeemat','rate','kitna','expensive','pricing'], a:()=>{const p=PRODUCTS.map(x=>x.price);return `Our prices range from ${money(Math.min(...p))} to ${money(Math.max(...p))}. Tell me which item you are interested in and I will give you the exact price.`}},
 {k:['discount','coupon','promo','offer','sale','voucher','code'], a:()=>`Use the code WELCOME10 in your bag for 10% off your first order.`},
 {k:['track','tracking','where is my order','order status','status','parcel'], a:()=>`Once your order ships you will receive a tracking number by email. Send your name and order details on WhatsApp and we will check it for you.`},
 {k:['international','worldwide','country','abroad','overseas','dubai','uk','usa','canada','europe','australia','saudi','pakistan'], a:()=>`Yes, we deliver to most countries worldwide. Prices can be shown in USD, EUR, GBP, AED or PKR using the currency menu at the top of the page. Customs duties, if any, depend on your country.`},
 {k:['custom','tailor','stitch','made to measure','customize','customise','alteration'], a:()=>`Pieces are made in small batches, so custom sizing and colour requests are possible on most items. Message us the details and we will confirm.`},
 {k:['care','wash','clean','dry clean','iron','fabric','material'], a:()=>`We recommend dry cleaning for all garments. Store each piece in the garment bag provided. Cashmere and silk should be kept folded or hung away from direct sunlight.`},
 {k:['gift','wrap','present','surprise'], a:()=>`Every order arrives in premium packaging. For a gift note, message us when you order.`},
 {k:['cancel','change order','modify','wrong address'], a:()=>`Order changes are possible before dispatch. Please message us as soon as possible with your name and order details.`},
 {k:['stock','available','availability','sold out','restock'], a:()=>`Items shown on the site are available. Because we work in small batches, popular sizes can sell out. Message us if you want us to confirm your size.`},
 {k:['currency','usd','pkr','aed','gbp','eur','dollar','pound','euro','dirham','rupee'], a:()=>`Use the currency menu at the top right to switch between USD, EUR, GBP, AED and PKR.`},
 {k:['secure','safe','trust','legit','real','authentic','genuine','scam','fake'], a:()=>`Checkout is encrypted, shipping is tracked and insured, and you have 14 days to return unworn items. If you want to confirm anything before ordering, we are happy to talk on WhatsApp.`},
 {k:['wholesale','bulk','reseller','supplier'], a:()=>`For wholesale or bulk orders, please message us on WhatsApp with the items and quantities.`},
 {k:['collection','catalog','catalogue','product','what do you sell','show me','category','new arrival','bestseller'], a:()=>`We make dresses, abayas, kaftans, sets, shawls, bags and jewelry. <a href="#/shop" onclick="toggleBot()">Browse the full collection</a>.`},
 {k:['about','story','who are you','brand','company'], a:()=>`${CONFIG.brand} makes occasion wear in small batches with silk, velvet and cashmere, and ships worldwide. <a href="#/about" onclick="toggleBot()">Read our story</a>.`},
 {k:['human','agent','person','whatsapp','call','contact','talk','support','number','help'], a:()=>`Of course. Our team replies within one business day, usually much faster on WhatsApp.${waBtn()}`},
 {k:['thanks','thank','shukria','thx','ok','okay','great','nice','perfect'], a:()=>`You are welcome. Let me know if there is anything else I can help with.`},
 {k:['bye','goodbye','allah hafiz','later'], a:()=>`Thank you for visiting ${CONFIG.brand}. Have a lovely day.`}
];
function botReply(raw){
  const T = toks(raw); if(!T.length) return 'Please type your question.';
  const pm = PRODUCTS.filter(p => (ALIAS[p.id]||[]).some(a=>hasKw(T,a)));
  const cats = Object.keys(CATW).filter(c => CATW[c].some(a=>hasKw(T,a)));
  const bm = raw.match(/(?:under|below|less than|within|upto|up to|max|budget)\s*(?:of)?\s*[^\d]{0,4}(\d[\d,]{1,6})/i);
  let best=null, bs=0;
  INTENTS.forEach(i=>{ let s=0; i.k.forEach(k=>{ if(hasKw(T,k)) s += k.includes(' ')?2:1; }); if(s>bs){bs=s;best=i;} });
  const link = p => `<a href="#/product/${p.id}" onclick="toggleBot()">${p.name}</a> – ${money(p.price)}`;
  if(bm){ const lim=parseFloat(bm[1].replace(/,/g,''))/CONFIG.rates[cur]; const l=PRODUCTS.filter(p=>p.price<=lim);
    return l.length ? `Here is what we have within your budget:<br>${l.map(link).join('<br>')}` : `Our pieces start from ${money(Math.min(...PRODUCTS.map(p=>p.price)))}. <a href="#/shop" onclick="toggleBot()">See the collection</a>.`; }
  if(pm.length){ const shown=pm.slice(0,3); let r = shown.map(link).join('<br>');
    r += `<br>${shown.length>1?'Each is':'It is'} available in the sizes shown on the product page.`;
    if(best && bs>0 && !/price|cost|how much|qeemat|kitna|rate/.test(raw.toLowerCase()) ) r += '<br><br>'+best.a();
    return r; }
  if(cats.length && !(best && bs>=2)){ const l=PRODUCTS.filter(p=>cats.includes(p.cat)); if(l.length) return `Our ${cats.join(' and ').toLowerCase()}:<br>${l.map(link).join('<br>')}`; }
  if(best && bs>0) return best.a();
  return `I want to give you an accurate answer, so please ask our team directly.${waBtn()}`;
}

/* chat window */
function toggleBot(){
  const b=$('#bot'); const open=b.hidden; b.hidden=!open;
  if(open && !$('#bm').children.length){ addMsg(`Hello, I am the ${CONFIG.brand} assistant. Ask me about shipping, sizes, payments or any product.`,'b');
    $('#bc').innerHTML=['Shipping','Returns','Payment','Sizes','Track my order','Talk to a person'].map(c=>`<button onclick="ask('${c}')">${c}</button>`).join(''); }
  if(open) $('#bi').focus();
}
function addMsg(html,who){ const d=document.createElement('div'); d.className='m '+who; if(who==='u') d.textContent=html; else d.innerHTML=html; $('#bm').appendChild(d); $('#bm').scrollTop=1e6; }
function ask(t){ addMsg(t,'u'); $('#bc').innerHTML=''; const d=document.createElement('div'); d.className='m b'; d.textContent='…'; $('#bm').appendChild(d);
  setTimeout(()=>{ d.remove(); addMsg(botReply(t),'b'); },450); }
function sendBot(e){ e.preventDefault(); const i=$('#bi'); const v=i.value.trim(); if(v){ i.value=''; ask(v); } return false; }
$('#wa').href=WA(); $('#wf').href=WA();

  
