document.addEventListener('DOMContentLoaded', () => {
  const levels = [
    { name: 'Registros', short: '< 1 ns', ns: 0.3, lat: '< 1 ns (1 ciclo)', tech: 'Dentro de la CPU',
      cap: 'Cientos de bytes a pocos KB', gest: 'El compilador',
      desc: 'Son la memoria más rápida y pequeña. Guardan los operandos y resultados con los que trabaja la CPU en cada instrucción.' },
    { name: 'Caché L1', short: '~1 ns', ns: 1, lat: '~1 ns (3-5 ciclos)', tech: 'SRAM, una por núcleo',
      cap: '32-128 KB (datos e instrucciones separados)', gest: 'El hardware',
      desc: 'La caché más cercana al núcleo. Se divide en una parte para instrucciones y otra para datos.' },
    { name: 'Caché L2', short: '~3-5 ns', ns: 4, lat: '~3-5 ns', tech: 'SRAM, una por núcleo',
      cap: '256 KB - 2 MB', gest: 'El hardware',
      desc: 'Más grande que L1 y algo más lenta. Recoge lo que no cabe o se expulsa de L1.' },
    { name: 'Caché L3', short: '~10-20 ns', ns: 15, lat: '~10-20 ns', tech: 'SRAM, compartida entre núcleos',
      cap: '8-64 MB (más en servidores)', gest: 'El hardware',
      desc: 'Compartida por todos los núcleos. Algunos procesadores la apilan en 3D, como el 3D V-Cache de AMD.' },
    { name: 'Memoria RAM', short: '~50-100 ns', ns: 80, lat: '~50-100 ns', tech: 'DRAM (DDR4, DDR5, LPDDR)',
      cap: '8-64 GB (hasta TB en servidores)', gest: 'El sistema operativo (memoria virtual)',
      desc: 'Memoria principal. Es volátil y guarda los programas y datos en ejecución. En GPU e IA se usa HBM.' },
    { name: 'SSD', short: '~20-100 µs', ns: 50000, lat: '~20-100 µs', tech: 'NVMe o SATA (no volátil)',
      cap: '256 GB - varios TB', gest: 'El sistema operativo',
      desc: 'Almacenamiento secundario sin partes móviles. Los NVMe reducen la brecha con la RAM.' },
    { name: 'HDD, cinta y nube', short: '~5-10 ms', ns: 8000000, lat: '~5-10 ms (HDD)', tech: 'Discos, cintas, almacenamiento remoto',
      cap: 'TB a PB', gest: 'El sistema operativo y el usuario',
      desc: 'Almacenamiento masivo y barato. Es el más lento, ideal para copias de respaldo y archivo.' }
  ];

  const list = document.getElementById('levelList');
  const detail = document.getElementById('levelDetail');
  const bars = document.getElementById('latencyBars');
  if (!list || !detail || !bars) return;

  const icons = () => { if (window.lucide) lucide.createIcons(); };

  function show(i) {
    const l = levels[i];
    list.querySelectorAll('.level-btn').forEach((b, k) => b.classList.toggle('active', k === i));
    detail.innerHTML = `
      <div class="card-badge"><i data-lucide="cpu"></i> Nivel ${i + 1} de ${levels.length}</div>
      <h2>${l.name}</h2>
      <p class="text-description">${l.desc}</p>
      <div class="detail-grid">
        <div class="detail-item"><span>Tecnología</span><strong>${l.tech}</strong></div>
        <div class="detail-item"><span>Capacidad típica</span><strong>${l.cap}</strong></div>
        <div class="detail-item"><span>Latencia</span><strong>${l.lat}</strong></div>
        <div class="detail-item"><span>Gestionada por</span><strong>${l.gest}</strong></div>
      </div>`;
    icons();
  }

  levels.forEach((l, i) => {
    const b = document.createElement('button');
    b.className = 'level-btn';
    b.innerHTML = `<span>${l.name}</span><small>${l.short}</small>`;
    b.addEventListener('click', () => show(i));
    list.appendChild(b);
  });

  // Barras de latencia (escala logarítmica)
  const min = levels[0].ns, max = levels[levels.length - 1].ns;
  levels.forEach(l => {
    const pct = 4 + 96 * (Math.log10(l.ns / min) / Math.log10(max / min));
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `<span>${l.name}</span>
      <div class="bar-track"><div class="bar-fill" data-w="${pct.toFixed(1)}"></div></div>
      <span class="bar-value">${l.short}</span>`;
    bars.appendChild(row);
  });

  const fills = bars.querySelectorAll('.bar-fill');
  const run = () => fills.forEach(f => { f.style.width = f.dataset.w + '%'; });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(bars);
  } else { run(); }

  show(0);
});
