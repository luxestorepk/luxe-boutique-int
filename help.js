/* Help pages: FAQ, shipping, size guide, privacy, terms */
Object.assign(pages,{
  faq(){
    const q=[['How long does delivery take?','Delivery takes 5–10 business days worldwide. Every parcel is tracked and insured.'],['Is shipping free?',`Shipping is free on orders over ${money(CONFIG.freeShipOver)}. Below that it is ${money(CONFIG.shipping)}.`],['Can I return or exchange an item?','Yes. Unworn items with tags can be returned within 14 days, and exchanges are free.'],['Which payment methods do you accept?','Visa, Mastercard, PayPal, Apple Pay, Google Pay and bank transfer. Cash on delivery is available in Pakistan.'],['How do I choose my size?','See our <a href="size.html"><u>size guide</u></a>, or send your measurements on WhatsApp and we will recommend a size.'],['Do you ship internationally?','Yes, we deliver to most countries. Customs duties, if any, depend on your country.'],['Can I get a custom size or colour?','Pieces are made in small batches, so custom requests are possible on most items. Message us the details.'],['How can I track my order?','You will receive a tracking number by email once your order ships. You can also ask us on WhatsApp.']];
    return `<div class="pagehead"><h1>Help &amp; FAQ</h1><p>Answers to the most common questions</p></div><div class="wrap prose"><div class="acc">${q.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}</div><br><p>Still need help?</p><a class="btn wa-btn" target="_blank" rel="noopener" href="${WA()}">Chat on WhatsApp</a></div>`;
  },
  shipping(){ return `<div class="pagehead"><h1>Shipping &amp; returns</h1><p>Clear, simple and tracked</p></div><div class="wrap prose">
    <h3>Shipping</h3><p>We ship worldwide with tracked, insured delivery. Orders are prepared within 1–3 business days and arrive in 5–10 business days.</p>
    <p>Shipping is free on orders over ${money(CONFIG.freeShipOver)}. Otherwise a flat ${money(CONFIG.shipping)} applies.</p>
    <p>Customs duties and import taxes, where they apply, are set by your country and paid by the recipient.</p><br>
    <h3>Returns and exchanges</h3><p>You can return unworn items with tags attached within 14 days of delivery. Exchanges are free.</p>
    <p>To start a return, message us on WhatsApp with your name and order details. Items that are worn, washed or altered cannot be returned. Made-to-order and custom pieces are final sale.</p><br>
    <a class="btn wa-btn" target="_blank" rel="noopener" href="${WA('Hi, I need help with a return.')}">Start a return on WhatsApp</a></div>`; },
  size(){
    const r=[['XS',82,64,88],['S',86,68,92],['M',90,72,96],['L',95,77,101],['XL',100,82,106]], inch=v=>(v/2.54).toFixed(1);
    return `<div class="pagehead"><h1>Size guide</h1><p>Body measurements in cm and inches</p></div><div class="wrap prose"><div class="tbl"><table><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr>${r.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]} cm / ${inch(x[1])} in</td><td>${x[2]} cm / ${inch(x[2])} in</td><td>${x[3]} cm / ${inch(x[3])} in</td></tr>`).join('')}</table></div><br>
    <p><b>How to measure:</b> Bust: around the fullest part of your chest. Waist: around the narrowest part of your waist. Hip: around the fullest part of your hips. Keep the tape level and snug, not tight.</p>
    <p>Between two sizes? Choose the larger one for a relaxed fit. For a personal recommendation, send your measurements on WhatsApp.</p><br>
    <a class="btn wa-btn" target="_blank" rel="noopener" href="${WA('Hi, please help me choose a size. My measurements: ')}">Ask about my size</a></div>`; },
  privacy(){ return `<div class="pagehead"><h1>Privacy policy</h1><p>Last updated: November 2026</p></div><div class="wrap prose">
    <p>${CONFIG.brand} respects your privacy. This page explains what information we collect and how we use it.</p>
    <h3>Information we collect</h3><p>When you place an order or contact us, we collect your name, email address, phone number and delivery address. This is used only to process and deliver your order and to reply to your messages.</p>
    <h3>Payments</h3><p>Card and wallet payments are handled by our payment providers (such as Stripe and PayPal). We never see or store your full card details.</p>
    <h3>Your device</h3><p>This website stores your bag, wishlist and currency choice in your browser so they are remembered on your next visit. You can clear this at any time in your browser settings.</p>
    <h3>Sharing</h3><p>We do not sell your personal information. We share it only with delivery partners and payment providers as needed to complete your order.</p>
    <h3>Your rights</h3><p>You can ask us to access, correct or delete your information by messaging us on WhatsApp.</p></div>`; },
  terms(){ return `<div class="pagehead"><h1>Terms &amp; conditions</h1><p>Last updated: November 2026</p></div><div class="wrap prose">
    <p>By placing an order with ${CONFIG.brand} you agree to these terms.</p>
    <h3>Orders and pricing</h3><p>All prices are shown in USD and converted for display in other currencies. Your final charge is confirmed at checkout. We may cancel an order if an item is unavailable or a pricing error occurs, and will refund any payment made.</p>
    <h3>Shipping</h3><p>Delivery times are estimates and may vary because of customs or carrier delays. See our <a href="shipping.html"><u>shipping and returns</u></a> page for details.</p>
    <h3>Returns</h3><p>Unworn items with tags can be returned within 14 days of delivery. Custom pieces are final sale.</p>
    <h3>Product colours</h3><p>Colours may look slightly different on different screens.</p>
    <h3>Contact</h3><p>For any questions about these terms, message us through the WhatsApp button on this site.</p></div>`; }
});
