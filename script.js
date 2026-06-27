const WA = '918412845177';

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  }));
}

/* ---------- Nav state (frosted when scrolled; light over home hero at top) ---------- */
const nav = document.getElementById('nav');
const isHome = document.body.classList.contains('is-home');
function updateNavState(){
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  document.body.classList.toggle('home-top', isHome && !scrolled);
}

/* ---------- Reduced motion ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Reveal animations (fail-safe) ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });

function splitLines(){
  document.querySelectorAll('.line-reveal:not([data-split])').forEach(el => {
    el.setAttribute('data-split','');
    el.innerHTML = el.innerHTML.replace(/(<em>.*?<\/em>|[^\s<]+)/g, m => `<span class="w">${m}</span> `);
  });
}
function observeReveals(){
  splitLines();
  const vh = window.innerHeight || 800;
  document.querySelectorAll('.reveal:not(.in), .line-reveal:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92) el.classList.add('in');
    else revealObserver.observe(el);
  });
  clearTimeout(window.__rf);
  window.__rf = setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in), .line-reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1600);
}

/* ---------- Zoom-in parallax ---------- */
function updateParallax(){
  if (reduceMotion) return;
  const vh = window.innerHeight;
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    const r = heroImg.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / vh));
    heroImg.style.transform = `scale(${1 + 0.16 * p}) translateY(${p * 40}px)`;
  }
  document.querySelectorAll('[data-zoom]').forEach(el => {
    if (el.id === 'heroImg') return;
    const r = el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const progress = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.5 - vh * 0.5) / vh));
    const scale = 1.18 - 0.18 * progress;
    el.style.transform = `scale(${Math.max(1, scale)}) translateY(${(1 - progress) * 30 * 0.3}px)`;
  });
}

window.addEventListener('scroll', () => { updateNavState(); updateParallax(); }, { passive: true });
window.addEventListener('resize', updateParallax);

/* ---------- Collection cards ---------- */
const WA_SVG = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.2-5-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l.8-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z"/></svg>';

const sarees = [
  {name:'Mor Bangdi Paithani', fabric:'Paithani', occasion:'Bridal', priceVal:24500, blurb:'Pure silk · gold zari · Yeola', tag:'Signature', body:'linear-gradient(165deg,#7C3B3B,#5E2828 55%,#4A1F1F)', border:'linear-gradient(180deg,#C9A05C,#9A7438)', desc:'A regal Yeola Paithani in deep maroon, its pallu crowned with the iconic mor-bangdi (peacock-bangle) motif woven entirely in pure gold zari. A bridal heirloom in every sense.'},
  {name:'Neelambari Paithani', fabric:'Paithani', occasion:'Festive', priceVal:28900, blurb:'Peacock-blue silk · double pallu', tag:'Heirloom', body:'linear-gradient(165deg,#2E4A5C,#1F3645 55%,#16242F)', border:'linear-gradient(180deg,#D8BC85,#B9914F)', desc:'Peacock-blue mulberry silk with a rare double pallu, hand-woven over months. The zari border catches light from every angle — made for festive evenings.'},
  {name:'Kanjeevaram Kalyani', fabric:'Kanjeevaram', occasion:'Bridal', priceVal:32400, blurb:'Temple border · pure mulberry silk', tag:'Bridal', body:'linear-gradient(165deg,#8A3A55,#6B2740 55%,#4E1B2E)', border:'linear-gradient(180deg,#C9A05C,#A87E3F)', desc:'A South-Indian temple-border Kanjeevaram in rich plum, woven from pure mulberry silk with a contrast korvai border. The quintessential South Indian bridal drape.'},
  {name:'Banarasi Shahmina', fabric:'Banarasi', occasion:'Festive', priceVal:18750, blurb:'Katan silk · sona-rupa zari', tag:'Festive', body:'linear-gradient(165deg,#5A6147,#434A33 55%,#343A27)', border:'linear-gradient(180deg,#D8BC85,#B9914F)', desc:'Olive-green Katan silk from Varanasi, brocaded with sona-rupa (gold-silver) zari jaal. Light enough to drape all evening, opulent enough for any celebration.'},
  {name:'Chanderi Chandrika', fabric:'Chanderi', occasion:'Everyday', priceVal:9200, blurb:'Silk-cotton · sheer drape', tag:'Everyday Luxe', body:'linear-gradient(165deg,#D9CBB0,#C2B190 55%,#A9966F)', border:'linear-gradient(180deg,#8A6B3A,#6E5126)', desc:'A whisper-light Chanderi silk-cotton in warm ivory, with a fine sheer body and delicate zari buti. Effortless luxury for daytime gatherings and quiet Sundays.'},
  {name:'Tussar Vanya', fabric:'Tussar', occasion:'Everyday', priceVal:11800, blurb:'Wild tussar silk · earthy gold', tag:'Earthy', body:'linear-gradient(165deg,#A87E4B,#8C6437 55%,#6E4C26)', border:'linear-gradient(180deg,#4A3A1E,#352A14)', desc:'Wild tussar silk with its natural golden slub texture and an earthy hand-block border. Grounded, organic, and quietly elegant for everyday wear.'},
  {name:'Organza Megha', fabric:'Organza', occasion:'Festive', priceVal:13500, blurb:'Featherlight organza · pastel sheen', tag:'Soir\u00e9e', body:'linear-gradient(165deg,#B7A6B8,#988199 55%,#7B6680)', border:'linear-gradient(180deg,#D8BC85,#B9914F)', desc:'Featherlight organza in a misty lilac, with a soft pearlescent sheen and zari-edged pallu. The drape of choice for cocktail soirées and receptions.'},
  {name:'Irkali Indrayani', fabric:'Cotton', occasion:'Everyday', priceVal:7900, blurb:'Khun border · Deccan weave', tag:'Classic', body:'linear-gradient(165deg,#3E5A4F,#2C453B 55%,#1F332B)', border:'linear-gradient(180deg,#C9A05C,#9A7438)', desc:'A classic Deccan handloom in deep forest green with a traditional Khun border. Breathable, durable, and timeless — a true everyday Maharashtrian weave.'},
  {name:'Raktima Paithani', fabric:'Paithani', occasion:'Bridal', priceVal:26300, blurb:'Kunku-red silk · parrot motifs', tag:'Wedding', body:'linear-gradient(165deg,#9C2F2F,#7A1F1F 55%,#5C1616)', border:'linear-gradient(180deg,#D8BC85,#B9914F)', desc:'Kunku-red pure silk Paithani scattered with woven popat (parrot) motifs and a gleaming gold pallu. The auspicious bridal red, reimagined as an heirloom.'}
];

function rupee(n){ return '\u20b9' + n.toLocaleString('en-IN'); }
function visualHTML(s){
  return `<div class="saree-visual">
    <div class="body" style="background:${s.body}"></div>
    <div class="pleats"></div><div class="buti"></div><div class="sheen"></div>
    <div class="border" style="background:${s.border}"></div>
  </div>`;
}
function waLink(s){
  const msg = encodeURIComponent(`Hello Alankrita Saree! I would like to buy the "${s.name}" (${s.fabric} · ${s.occasion}) listed at ${rupee(s.priceVal)}. Please share details and availability.`);
  return `https://wa.me/${WA}?text=${msg}`;
}

const grid = document.getElementById('collectionGrid');
if (grid) {
  /* ----- filter state ----- */
  const filters = { fabric:'All', occasion:'All', price:'All' };
  const fabrics = ['All', ...Array.from(new Set(sarees.map(s => s.fabric)))];
  const occasions = ['All', 'Bridal', 'Festive', 'Everyday'];
  const priceBands = [
    {label:'All', test:() => true},
    {label:'Under \u20b910k', test:p => p < 10000},
    {label:'\u20b910k\u2013\u20b920k', test:p => p >= 10000 && p < 20000},
    {label:'\u20b920k+', test:p => p >= 20000}
  ];

  /* ----- build filter bar ----- */
  const bar = document.getElementById('collectionFilters');
  if (bar) {
    function group(title, values, key){
      const wrap = document.createElement('div');
      wrap.className = 'filter-group';
      wrap.innerHTML = `<span class="filter-label">${title}</span>`;
      const row = document.createElement('div'); row.className = 'filter-chips';
      values.forEach(v => {
        const label = typeof v === 'string' ? v : v.label;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip' + (filters[key] === label ? ' active' : '');
        chip.textContent = label;
        chip.addEventListener('click', () => {
          filters[key] = label;
          row.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
          renderCards();
        });
        row.appendChild(chip);
      });
      wrap.appendChild(row);
      bar.appendChild(wrap);
    }
    group('Fabric', fabrics, 'fabric');
    group('Occasion', occasions, 'occasion');
    group('Price', priceBands, 'price');
  }

  const countEl = document.getElementById('collectionCount');

  function matches(s){
    if (filters.fabric !== 'All' && s.fabric !== filters.fabric) return false;
    if (filters.occasion !== 'All' && s.occasion !== filters.occasion) return false;
    const band = priceBands.find(b => b.label === filters.price);
    if (band && !band.test(s.priceVal)) return false;
    return true;
  }

  function renderCards(){
    grid.innerHTML = '';
    const shown = sarees.filter(matches);
    if (countEl) countEl.textContent = shown.length + (shown.length === 1 ? ' saree' : ' sarees');
    if (!shown.length){
      grid.innerHTML = '<p class="no-results">No sarees match these filters yet — try widening your selection.</p>';
      return;
    }
    shown.forEach((s, i) => {
      const idx = sarees.indexOf(s);
      const card = document.createElement('div');
      card.className = 'card reveal' + (i % 3 === 1 ? ' d1' : i % 3 === 2 ? ' d2' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'View ' + s.name);
      card.innerHTML = `
        <div class="card-img parallax-frame">
          <span class="card-tag">${s.tag}</span>
          ${visualHTML(s)}
          <span class="card-view">View details</span>
        </div>
        <div class="card-body">
          <h3>${s.name}</h3>
          <p class="card-fabric">${s.blurb}</p>
          <div class="card-foot">
            <span class="price">${rupee(s.priceVal)}</span>
            <a class="buy-btn" href="${waLink(s)}" target="_blank" rel="noopener">${WA_SVG} Buy on WhatsApp</a>
          </div>
        </div>`;
      // open modal on card click, but not when tapping the Buy button
      card.addEventListener('click', e => { if (e.target.closest('.buy-btn')) return; openModal(idx); });
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(idx); } });
      grid.appendChild(card);
    });
    observeReveals();
  }

  renderCards();
}

/* ---------- Saree detail modal ---------- */
function openModal(idx){
  const s = sarees[idx];
  let modal = document.getElementById('sareeModal');
  if (!modal){
    modal = document.createElement('div');
    modal.id = 'sareeModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-card" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close" data-close>&times;</button>
        <div class="modal-img parallax-frame"><span class="modal-tag"></span><div class="modal-visual"></div></div>
        <div class="modal-info">
          <p class="modal-meta"></p>
          <h3 class="modal-name"></h3>
          <p class="modal-price"></p>
          <p class="modal-desc"></p>
          <div class="modal-specs"></div>
          <a class="btn solid modal-buy" target="_blank" rel="noopener"></a>
          <p class="modal-note">Tap to chat — we'll share live photos, drape videos &amp; final pricing on WhatsApp.</p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
  modal.querySelector('.modal-visual').outerHTML = visualHTML(s).replace('saree-visual', 'saree-visual modal-visual');
  modal.querySelector('.modal-tag').textContent = s.tag;
  modal.querySelector('.modal-meta').textContent = `${s.fabric} · ${s.occasion}`;
  modal.querySelector('.modal-name').textContent = s.name;
  modal.querySelector('.modal-price').textContent = rupee(s.priceVal);
  modal.querySelector('.modal-desc').textContent = s.desc;
  modal.querySelector('.modal-specs').innerHTML =
    `<span><b>Fabric</b>${s.fabric}</span><span><b>Occasion</b>${s.occasion}</span><span><b>Highlights</b>${s.blurb}</span>`;
  const buy = modal.querySelector('.modal-buy');
  buy.href = waLink(s);
  buy.innerHTML = `${WA_SVG} Enquire / Buy on WhatsApp`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  const modal = document.getElementById('sareeModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Appointment calendar ---------- */
const calGrid = document.getElementById('calGrid');
if (calGrid) {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dows = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const timeSlots = ['11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM','6:30 PM'];
  const today = new Date(); today.setHours(0,0,0,0);
  let viewYear = today.getFullYear(), viewMonth = today.getMonth();
  let selDate = null, selTime = null;
  const calTitle = document.getElementById('calTitle');
  const slotGrid = document.getElementById('slotGrid');
  const summary = document.getElementById('apptSummary');
  const confirmBtn = document.getElementById('apptConfirm');
  const nameInput = document.getElementById('apptName');

  function renderCalendar(){
    calTitle.textContent = monthNames[viewMonth] + ' ' + viewYear;
    calGrid.innerHTML = '';
    dows.forEach(d => { const c = document.createElement('div'); c.className = 'cal-dow'; c.textContent = d; calGrid.appendChild(c); });
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let i = 0; i < first; i++){ const c = document.createElement('div'); c.className = 'cal-day empty'; calGrid.appendChild(c); }
    for (let d = 1; d <= days; d++){
      const date = new Date(viewYear, viewMonth, d);
      const c = document.createElement('button'); c.className = 'cal-day'; c.textContent = d; c.type = 'button';
      if (date < today){ c.classList.add('disabled'); c.disabled = true; }
      if (date.getTime() === today.getTime()) c.classList.add('today');
      if (selDate && date.getTime() === selDate.getTime()) c.classList.add('selected');
      c.addEventListener('click', () => { if (c.disabled) return; selDate = date; renderCalendar(); updateSummary(); });
      calGrid.appendChild(c);
    }
  }
  timeSlots.forEach(t => {
    const b = document.createElement('button'); b.className = 'slot'; b.type = 'button'; b.textContent = t;
    b.addEventListener('click', () => { selTime = t; document.querySelectorAll('.slot').forEach(s => s.classList.toggle('selected', s === b)); updateSummary(); });
    slotGrid.appendChild(b);
  });
  document.getElementById('calPrev').addEventListener('click', () => {
    viewMonth--; if (viewMonth < 0){ viewMonth = 11; viewYear--; }
    if (viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth())){ viewMonth = today.getMonth(); viewYear = today.getFullYear(); }
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', () => { viewMonth++; if (viewMonth > 11){ viewMonth = 0; viewYear++; } renderCalendar(); });
  nameInput.addEventListener('input', updateSummary);

  function fmtDate(d){ return d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); }
  function updateSummary(){
    if (selDate && selTime){
      summary.innerHTML = `Your private viewing: <strong>${fmtDate(selDate)}</strong> at <strong>${selTime}</strong>.`;
      confirmBtn.removeAttribute('disabled');
      const name = nameInput.value.trim();
      const msg = encodeURIComponent(`Hello Alankrita Saree! I would like to book an appointment.\n\nDate: ${fmtDate(selDate)}\nTime: ${selTime}${name ? `\nName: ${name}` : ''}\n\nPlease confirm my private viewing at the atelier. Thank you!`);
      confirmBtn.href = `https://wa.me/${WA}?text=${msg}`; confirmBtn.target = '_blank'; confirmBtn.rel = 'noopener';
    } else if (selDate){
      summary.innerHTML = `Date chosen: <strong>${fmtDate(selDate)}</strong>. Now pick a time.`;
      confirmBtn.setAttribute('disabled','');
    } else {
      summary.textContent = 'Select a date and time on the calendar to begin.';
      confirmBtn.setAttribute('disabled','');
    }
  }
  renderCalendar();
}

/* ---------- Init ---------- */
observeReveals();
updateParallax();
updateNavState();
