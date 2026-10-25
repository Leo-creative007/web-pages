document.addEventListener('DOMContentLoaded', () => {
  if (window.__memoriaReady) return;
  window.__memoriaReady = true;
  if (window.__memoriaInit) return;
  window.__memoriaInit = true;

  /* ---------- IDIOMA: el español se toma del HTML, el inglés está aquí ---------- */
  const EN = {
    brand: 'MEM<span class="highlight">ORY</span>',
    nav_sim: 'Simulator',
    j_badge: 'Simulator', j_title: 'A piece of data’s journey',
    j_sub: 'Choose where the data is stored and watch the CPU look for it level by level.',
    j_label: 'Where is the data?', j_btn: 'Request data',
    k_badge: 'Calculator', k_title: 'Average access time', k_sub: 'Move the controls and see how much the cache helps.',
    k_hit: 'Hit time', k_miss: 'Miss rate', k_pen: 'Miss penalty', k_out: 'Average time',
    k_with: 'With cache', k_without: 'Without cache (always RAM)',
    nav_home: 'Home', nav_levels: 'Levels', nav_latency: 'Latency', nav_concepts: 'Concepts', nav_cta: 'Summary',
    hero_badge: 'Computer architecture',
    hero_title: 'Memory hierarchy: <span class="gradient-text">speed, capacity and cost</span> in balance',
    hero_sub: 'The closer to the processor, the faster, smaller and more expensive per byte the memory is. Meet the seven levels of a modern computer.',
    hero_btn1: 'Explore levels', hero_btn2: 'See key concepts',
    lv_badge: 'Seven levels', lv_title: 'From fastest to slowest', lv_sub: 'Pick a level to see its details.',
    lat_badge: 'Speed', lat_title: 'How long each level takes to respond',
    lat_sub: 'Logarithmic scale: each step down multiplies the access time.',
    c_badge: 'Key ideas', c_title: 'Why the hierarchy works',
    c1t: 'Temporal locality', c1p: 'If a piece of data was accessed, it is likely to be accessed again soon.',
    c2t: 'Spatial locality', c2p: 'If an address was accessed, nearby addresses are likely to be accessed too.',
    c3t: 'Volatility', c3p: 'Registers, caches and RAM lose their contents when powered off. SSDs, HDDs and tapes do not.',
    c4t: 'Virtual memory', c4p: 'The operating system moves pages between RAM and disk to simulate more memory.',
    formula_label: 'Average access time',
    formula: 'T_avg = T_hit + (miss rate × miss penalty)',
    pill1: 'Caches with 3D V-Cache', pill2: 'Unified memory (SoC)', pill3: 'HBM in GPUs and AI', pill4: 'NVMe SSDs and CXL',
    f_title: 'Management by level',
    f_note: 'Registers: the compiler.<br>Caches: the hardware.<br>RAM and disk: the operating system.',
    perf_title: 'Cache hits', f_ask: 'Want to review?', f_btn: 'Back to the levels',
    f_bottom: 'Typical values for current systems; they vary by model.'
  };

  const UI = {
    es: { toLight: 'Cambiar a modo claro', toDark: 'Cambiar a modo oscuro', jHint: 'Pulsa «Solicitar dato» para iniciar.', hit: 'acierto', miss: 'fallo', jDone: (n, t) => `El dato estaba en ${n}. Buscarlo tardó en total ${t}.`, gain: x => `${x}× más rápido que ir siempre a RAM`, level: (i, n) => `Nivel ${i} de ${n}`, tech: 'Tecnología', cap: 'Capacidad típica', lat: 'Tiempo de acceso', mgr: 'Gestionada por', title: 'Jerarquía de memoria', toggle: 'EN' },
    en: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode', jHint: 'Press “Request data” to start.', hit: 'hit', miss: 'miss', jDone: (n, t) => `The data was in ${n}. Finding it took ${t} in total.`, gain: x => `${x}× faster than always going to RAM`, level: (i, n) => `Level ${i} of ${n}`, tech: 'Technology', cap: 'Typical capacity', lat: 'Access time', mgr: 'Managed by', title: 'Memory hierarchy', toggle: 'ES' }
  };

  // Cada texto es [español, inglés]
  const levels = [
    { name: ['Registros', 'Registers'], short: '< 1 ns', ns: 0.3, lat: ['< 1 ns (1 ciclo)', '< 1 ns (1 cycle)'],
      tech: ['Dentro de la CPU', 'Inside the CPU'],
      cap: ['Cientos de bytes a pocos KB', 'Hundreds of bytes to a few KB'],
      mgr: ['El compilador', 'The compiler'],
      desc: ['Son la memoria más rápida y pequeña. Guardan los operandos y resultados con los que trabaja la CPU en cada instrucción.',
             'The fastest and smallest memory. They hold the operands and results the CPU works with in every instruction.'] },
    { name: ['Caché L1', 'L1 cache'], short: '~1 ns', ns: 1, lat: ['~1 ns (3-5 ciclos)', '~1 ns (3-5 cycles)'],
      tech: ['SRAM, una por núcleo', 'SRAM, one per core'],
      cap: ['32-128 KB (datos e instrucciones separados)', '32-128 KB (separate data and instructions)'],
      mgr: ['El hardware', 'The hardware'],
      desc: ['La caché más cercana al núcleo. Se divide en una parte para instrucciones y otra para datos.',
             'The cache closest to the core. It is split into one part for instructions and one for data.'] },
    { name: ['Caché L2', 'L2 cache'], short: '~3-5 ns', ns: 4, lat: ['~3-5 ns', '~3-5 ns'],
      tech: ['SRAM, una por núcleo', 'SRAM, one per core'],
      cap: ['256 KB - 2 MB', '256 KB - 2 MB'],
      mgr: ['El hardware', 'The hardware'],
      desc: ['Más grande que L1 y algo más lenta. Recoge lo que no cabe o se expulsa de L1.',
             'Larger than L1 and a bit slower. It catches what does not fit in, or is evicted from, L1.'] },
    { name: ['Caché L3', 'L3 cache'], short: '~10-20 ns', ns: 15, lat: ['~10-20 ns', '~10-20 ns'],
      tech: ['SRAM, compartida entre núcleos', 'SRAM, shared between cores'],
      cap: ['8-64 MB (más en servidores)', '8-64 MB (more in servers)'],
      mgr: ['El hardware', 'The hardware'],
      desc: ['Compartida por todos los núcleos. Algunos procesadores la apilan en 3D, como el 3D V-Cache de AMD.',
             'Shared by all cores. Some processors stack it in 3D, like AMD’s 3D V-Cache.'] },
    { name: ['Memoria RAM', 'Main memory (RAM)'], short: '~50-100 ns', ns: 80, lat: ['~50-100 ns', '~50-100 ns'],
      tech: ['DRAM (DDR4, DDR5, LPDDR)', 'DRAM (DDR4, DDR5, LPDDR)'],
      cap: ['8-64 GB (hasta TB en servidores)', '8-64 GB (up to TB in servers)'],
      mgr: ['El sistema operativo (memoria virtual)', 'The operating system (virtual memory)'],
      desc: ['Memoria principal. Es volátil y guarda los programas y datos en ejecución. En GPU e IA se usa HBM.',
             'Main memory. It is volatile and holds running programs and data. GPUs and AI accelerators use HBM.'] },
    { name: ['SSD', 'SSD'], short: '~20-100 µs', ns: 50000, lat: ['~20-100 µs', '~20-100 µs'],
      tech: ['NVMe o SATA (no volátil)', 'NVMe or SATA (non-volatile)'],
      cap: ['256 GB - varios TB', '256 GB - several TB'],
      mgr: ['El sistema operativo', 'The operating system'],
      desc: ['Almacenamiento secundario sin partes móviles. Los NVMe reducen la brecha con la RAM.',
             'Secondary storage with no moving parts. NVMe drives narrow the gap with RAM.'] },
    { name: ['HDD, cinta y nube', 'HDD, tape and cloud'], short: '~5-10 ms', ns: 8000000, lat: ['~5-10 ms (HDD)', '~5-10 ms (HDD)'],
      tech: ['Discos, cintas, almacenamiento remoto', 'Disks, tapes, remote storage'],
      cap: ['TB a PB', 'TB to PB'],
      mgr: ['El sistema operativo y el usuario', 'The operating system and the user'],
      desc: ['Almacenamiento masivo y barato. Es el más lento, ideal para copias de respaldo y archivo.',
             'Cheap, massive storage. The slowest level, ideal for backups and archives.'] }
  ];

  let lang = 'es';
  let current = 0;
  try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'es'; } catch (e) {}

  const list = document.getElementById('levelList');
  const detail = document.getElementById('levelDetail');
  const bars = document.getElementById('latencyBars');
  const icons = () => { if (window.lucide) lucide.createIcons(); };
  const L = (arr) => arr[lang === 'es' ? 0 : 1];

  // Guardar el español original antes de que los íconos modifiquen el DOM
  const i18nEls = document.querySelectorAll('[data-i18n]');
  const ICON = ':scope > svg, :scope > i[data-lucide]';
  const clean = (el) => {            // contenido sin el ícono propio del elemento
    const c = el.cloneNode(true);
    c.querySelectorAll(ICON).forEach(n => n.remove());
    return c.innerHTML.trim();
  };
  i18nEls.forEach(el => { el.dataset.es = clean(el); });

  // Cambia el texto conservando el ícono si el elemento lo tiene
  function setContent(el, html) {
    const icon = el.querySelector(ICON);
    if (!icon) { el.innerHTML = html; return; }
    const iconFirst = icon === el.firstElementChild && !el.firstChild.textContent.trim();
    [...el.childNodes].forEach(n => { if (n !== icon) n.remove(); });
    icon.insertAdjacentHTML(iconFirst ? 'afterend' : 'beforebegin', iconFirst ? ' ' + html : html + ' ');
  }

  /* ---------- Niveles ---------- */
  function renderList() {
    list.innerHTML = '';
    levels.forEach((l, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'level-btn' + (i === current ? ' active' : '');
      b.style.width = (52 + i * (48 / (levels.length - 1))) + '%';
      b.style.setProperty('--lv', `hsl(${195 - i * 28}, 85%, 60%)`);
      b.innerHTML = `<span>${L(l.name)}</span><small>${l.short}</small>`;
      b.addEventListener('click', () => { current = i; renderList(); renderDetail(); });
      list.appendChild(b);
    });
  }

  function renderDetail() {
    const l = levels[current];
    const u = UI[lang];
    detail.innerHTML = `
      <div class="card-badge"><i data-lucide="cpu"></i> ${u.level(current + 1, levels.length)}</div>
      <h2>${L(l.name)}</h2>
      <p class="text-description">${L(l.desc)}</p>
      <div class="detail-grid">
        <div class="detail-item"><span>${u.tech}</span><strong>${L(l.tech)}</strong></div>
        <div class="detail-item"><span>${u.cap}</span><strong>${L(l.cap)}</strong></div>
        <div class="detail-item"><span>${u.lat}</span><strong>${L(l.lat)}</strong></div>
        <div class="detail-item"><span>${u.mgr}</span><strong>${L(l.mgr)}</strong></div>
      </div>`;
    icons();
  }

  /* ---------- Barras de latencia (escala logarítmica) ---------- */
  const min = levels[0].ns, max = levels[levels.length - 1].ns;
  let barsShown = false;

  function renderBars() {
    bars.innerHTML = '';
    levels.forEach(l => {
      const pct = 4 + 96 * (Math.log10(l.ns / min) / Math.log10(max / min));
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `<span class="bar-name">${L(l.name)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${barsShown ? pct.toFixed(1) : 0}%" data-w="${pct.toFixed(1)}"></div></div>
        <span class="bar-value">${l.short}</span>`;
      bars.appendChild(row);
    });
  }

  function showBars() {
    barsShown = true;
    bars.querySelectorAll('.bar-fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { showBars(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(bars);
  } else { barsShown = true; }

  /* ---------- Simulador: viaje del dato ---------- */
  const sel = document.getElementById('whereSel');
  const jr = document.getElementById('journey');
  const jres = document.getElementById('journeyRes');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = ns => ns < 1e3 ? `${+ns.toFixed(1)} ns` : ns < 1e6 ? `${+(ns / 1e3).toFixed(1)} µs` : `${+(ns / 1e6).toFixed(1)} ms`;
  let runId = 0;

  function renderJourney() {
    const keep = sel.value || '4';
    sel.innerHTML = levels.map((l, i) => `<option value="${i}">${L(l.name)}</option>`).join('');
    sel.value = keep;
    jr.innerHTML = levels.map(l => `<div class="node"><b>${L(l.name)}</b><small>&nbsp;</small></div>`).join('');
    jres.textContent = UI[lang].jHint;
    runId++;
  }

  async function runJourney() {
    const id = ++runId, target = +sel.value, nodes = [...jr.children];
    const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    nodes.forEach(n => { n.className = 'node'; n.querySelector('small').innerHTML = '&nbsp;'; });
    jres.textContent = '';
    let total = 0;
    for (let i = 0; i <= target; i++) {
      total += levels[i].ns;
      nodes[i].classList.add('look');
      await wait(550);
      if (id !== runId) return;
      nodes[i].classList.remove('look');
      nodes[i].classList.add(i === target ? 'hit' : 'miss');
      nodes[i].querySelector('small').textContent = UI[lang][i === target ? 'hit' : 'miss'];
    }
    jres.textContent = UI[lang].jDone(L(levels[target].name), fmt(total));
  }
  document.getElementById('runJourney').addEventListener('click', runJourney);

  /* ---------- Simulador: calculadora ---------- */
  const rng = ['rngHit', 'rngMiss', 'rngPen'].map(id => document.getElementById(id));
  function renderCalc() {
    const [h, m, p] = rng.map(r => +r.value);
    const t = h + (m / 100) * p, top = Math.max(t, p);
    document.getElementById('valHit').textContent = h + ' ns';
    document.getElementById('valMiss').textContent = m + ' %';
    document.getElementById('valPen').textContent = p + ' ns';
    document.getElementById('calcOut').textContent = t.toFixed(2) + ' ns';
    document.getElementById('calcGain').textContent = UI[lang].gain((p / t).toFixed(1));
    document.getElementById('cmpWith').style.width = (t / top * 100) + '%';
    document.getElementById('cmpWithout').style.width = (p / top * 100) + '%';
  }
  rng.forEach(r => r.addEventListener('input', renderCalc));

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = document.getElementById('themeToggle');
  const getTheme = () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

  function applyTheme() {
    const light = getTheme() === 'light';
    const label = light ? UI[lang].toDark : UI[lang].toLight;
    themeBtn.innerHTML = `<i data-lucide="${light ? 'moon' : 'sun'}"></i>`;   // muestra a qué modo se cambia
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
    icons();
  }

  themeBtn.addEventListener('click', () => {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    applyTheme();
  });

  /* ---------- Aplicar idioma ---------- */
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = UI[lang].title;
    i18nEls.forEach(el => {
      setContent(el, lang === 'es' ? el.dataset.es : (EN[el.dataset.i18n] ?? el.dataset.es));
    });
    renderBars();
    renderJourney();
    renderCalc();
    applyTheme();
    document.getElementById('langToggle').textContent = UI[lang].toggle;
    document.getElementById('menuToggle').setAttribute('aria-label', lang === 'es' ? 'Menú' : 'Menu');
    renderList();
    renderDetail();
  }

  document.getElementById('langToggle').addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
  });

  applyLang();
  icons();
  window.addEventListener('load', () => { applyLang(); icons(); });

  /* ---------- Menú móvil ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  }

  /* ---------- Indicador de rendimiento del footer ---------- */
  const gaugeFill = document.getElementById('gaugeFill');
  const scoreText = document.getElementById('scoreText');
  if (gaugeFill && scoreText) {
    let score = 0;
    const target = 98;
    const timer = setInterval(() => {
      if (score < target) {
        score++;
        scoreText.textContent = `${score}/100`;
        gaugeFill.style.strokeDashoffset = 126 - (126 * (score / 100));
      } else {
        clearInterval(timer);
      }
    }, 20);
  }

  /* ---------- Scroll suave ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      if (id === '#') return;
      if (navLinks && navLinks.classList.contains('active')) navLinks.classList.remove('active');
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
