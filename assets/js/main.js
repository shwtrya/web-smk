const intro = document.getElementById('intro');
const introProgress = document.getElementById('intro-progress');
const introLines = document.querySelectorAll('.intro-line');
const scrollProgress = document.getElementById('scrollProgress');
const pointerGlow = document.getElementById('pointerGlow');

const galleryItems = [
  { src: 'assets/images/gallery-1.svg', caption: 'Morning Briefing · Kegiatan', category: 'kegiatan', meta: '2023 · Lapangan' },
  { src: 'assets/images/gallery-2.svg', caption: 'Project Praktikum Lab', category: 'praktikum', meta: '2024 · Laboratorium' },
  { src: 'assets/images/gallery-3.svg', caption: 'PKL Teamwork', category: 'pkl', meta: '2025 · Dunia Industri' },
  { src: 'assets/images/gallery-4.svg', caption: 'Kelas Favorit', category: 'kelas', meta: '2024 · XII TKJ 1' },
  { src: 'assets/images/gallery-5.svg', caption: 'Malam Perpisahan', category: 'perpisahan', meta: '2026 · Aula Utama' },
  { src: 'assets/images/gallery-6.svg', caption: 'Behind The Scene', category: 'random', meta: 'Random · Sudut Sekolah' },
  { src: 'assets/images/gallery-7.svg', caption: 'Ekskul Day', category: 'kegiatan', meta: '2024 · Lapangan' },
  { src: 'assets/images/gallery-8.svg', caption: 'Mockup & Wiring', category: 'praktikum', meta: '2024 · Workshop' },
  { src: 'assets/images/gallery-9.svg', caption: 'Final Goodbye', category: 'perpisahan', meta: '2026 · Gerbang' }
];

function startIntro() {
  if (!intro || !introProgress) return;
  gsap.to(introProgress, { width: '100%', duration: 2.4, ease: 'power2.inOut' });
  gsap.fromTo(introLines, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.4, duration: 1 });
  setTimeout(() => gsap.to(intro, { opacity: 0, duration: 0.8, onComplete: () => intro.remove() }), 2600);
}

function setupTyping() {
  const line = document.querySelector('.typing-line');
  if (!line) return;
  const text = line.dataset.text || '';
  let idx = 0;
  const timer = setInterval(() => {
    line.textContent = text.slice(0, idx);
    idx += 1;
    if (idx > text.length + 1) clearInterval(timer);
  }, 65);
}

function setupLenis() {
  if (!window.Lenis) return;
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}


function setupHeroVideo() {
  const heroBg = document.querySelector('.hero-bg');
  const video = document.getElementById('heroVideo');
  const fallback = document.getElementById('heroFallback');
  if (!heroBg || !video || !fallback) return;

  const showFallback = () => {
    heroBg.classList.add('show-fallback');
    video.pause();
  };

  const hideFallback = () => {
    heroBg.classList.remove('show-fallback');
  };

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const applyMotionPreference = () => {
    if (motionQuery.matches) {
      showFallback();
      return;
    }

    hideFallback();
    video.play().catch(() => {
      showFallback();
    });
  };

  video.addEventListener('error', showFallback);
  video.addEventListener('stalled', showFallback);
  video.addEventListener('loadeddata', () => {
    if (!motionQuery.matches) hideFallback();
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', applyMotionPreference);
  } else {
    motionQuery.addListener(applyMotionPreference);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
      return;
    }

    if (!motionQuery.matches && !heroBg.classList.contains('show-fallback')) {
      video.play().catch(() => {
        showFallback();
      });
    }
  });

  applyMotionPreference();
}

function setupScrollEffects() {
  gsap.utils.toArray('.reveal:not(.scene-card)').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%' }
      }
    );
  });

  const sceneCards = gsap.utils.toArray('.scene-card');
  if (sceneCards.length) {
    sceneCards.forEach((card, index) => {
      if (index === sceneCards.length - 1 || card.nextElementSibling?.classList.contains('scene-fade')) return;
      const fade = document.createElement('div');
      fade.className = 'scene-fade';
      card.insertAdjacentElement('afterend', fade);
    });

    sceneCards.forEach((card) => {
      const image = card.querySelector('img');
      const textNodes = [
        card.querySelector('.scene-tag'),
        card.querySelector('.scene-title'),
        card.querySelector('.scene-copy')
      ].filter(Boolean);

      gsap.set(card, { opacity: 0, filter: 'blur(10px)' });
      if (image) gsap.set(image, { scale: 1.08, transformOrigin: 'center center' });
      if (textNodes.length) gsap.set(textNodes, { opacity: 0, y: 20, filter: 'blur(6px)' });

      const sceneTimeline = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          end: 'bottom 32%',
          scrub: 0.7,
          toggleClass: { targets: card, className: 'is-active' }
        }
      });

      sceneTimeline.to(card, { opacity: 1, filter: 'blur(0px)', duration: 0.36 }, 0);
      if (image) sceneTimeline.to(image, { scale: 1, duration: 0.8 }, 0);
      if (textNodes.length) sceneTimeline.to(textNodes, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.14, duration: 0.5 }, 0.12);
    });

    gsap.utils.toArray('.scene-fade').forEach((fade) => {
      gsap.fromTo(
        fade,
        { opacity: 0.05, scaleX: 0.92 },
        {
          opacity: 0.5,
          scaleX: 1,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: fade,
            start: 'top 94%',
            end: 'bottom 56%',
            scrub: 0.6
          }
        }
      );
    });
  }

  const heroBg = document.querySelector('.parallax-layer');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', scrub: true, start: 'top top', end: 'bottom top' }
    });
  }
}

function setupDust() {
  const canvas = document.getElementById('dustCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 70; i += 1) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.3, vy: Math.random() * 0.35 + 0.08 });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(245, 231, 196, 0.35)';
    particles.forEach((p) => {
      p.y -= p.vy;
      if (p.y < -5) p.y = canvas.height + 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function setupProgressBar() {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / max) * 100;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  });
}

function setupPointerGlow() {
  if (!pointerGlow) return;
  window.addEventListener('pointermove', (e) => {
    pointerGlow.style.left = `${e.clientX}px`;
    pointerGlow.style.top = `${e.clientY}px`;
  });
}

function renderGallery(items) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    figure.dataset.index = i;
    figure.innerHTML = `<img loading="lazy" src="${item.src}" alt="${item.caption}" /><figcaption>${item.caption}<br><small>${item.meta}</small></figcaption>`;
    grid.appendChild(figure);
  });
}

let activeGallery = [...galleryItems];
let lightboxIndex = 0;
let slideshow = null;

function setupGallery() {
  renderGallery(activeGallery);

  const filters = document.getElementById('filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach((f) => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      activeGallery = filter === 'all' ? [...galleryItems] : galleryItems.filter((g) => g.category === filter);
      renderGallery(activeGallery);
    });
  }

  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    lightboxIndex = Number(item.dataset.index) || 0;
    const data = activeGallery[lightboxIndex];
    img.src = data.src;
    cap.textContent = `${data.caption} • ${data.meta}`;
    lightbox.classList.remove('hidden');
  });

  const sync = () => {
    const data = activeGallery[lightboxIndex];
    if (!data) return;
    img.src = data.src;
    cap.textContent = `${data.caption} • ${data.meta}`;
  };

  document.getElementById('prevPhoto')?.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + activeGallery.length) % activeGallery.length;
    sync();
  });
  document.getElementById('nextPhoto')?.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % activeGallery.length;
    sync();
  });
  document.getElementById('closeLightbox')?.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });

  document.getElementById('slideshowBtn')?.addEventListener('click', (e) => {
    if (slideshow) {
      clearInterval(slideshow);
      slideshow = null;
      e.currentTarget.textContent = 'Start Slideshow';
      return;
    }
    e.currentTarget.textContent = 'Stop Slideshow';
    lightbox.classList.remove('hidden');
    sync();
    slideshow = setInterval(() => {
      lightboxIndex = (lightboxIndex + 1) % activeGallery.length;
      gsap.fromTo(img, { opacity: 0.2 }, { opacity: 1, duration: 0.6 });
      sync();
    }, 2500);
  });
}

function setupMessages() {
  const form = document.getElementById('messageForm');
  const messages = document.getElementById('messages');
  if (!form || !messages) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const card = document.createElement('article');
    card.className = 'memory-card opacity-0 translate-y-6';
    card.innerHTML = `<p>"${data.get('pesan')}"</p><span>— ${data.get('nama')}, ${data.get('jurusan')}, ${data.get('angkatan')}</span>`;
    messages.prepend(card);
    gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    form.reset();
  });
}

function setupToggles() {
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const themeToggle = document.getElementById('themeToggle');
  const grainToggle = document.getElementById('grainToggle');
  const leakToggle = document.getElementById('leakToggle');

  settingsToggle?.addEventListener('click', () => settingsPanel?.classList.toggle('hidden'));

  themeToggle?.addEventListener('change', (e) => {
    document.documentElement.dataset.theme = e.target.checked ? 'dark' : 'light';
  });

  grainToggle?.addEventListener('change', (e) => {
    document.querySelector('.app-grain').style.display = e.target.checked ? 'block' : 'none';
  });

  leakToggle?.addEventListener('change', (e) => {
    document.querySelector('.app-leak').style.display = e.target.checked ? 'block' : 'none';
  });

  const audio = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const volumeControl = document.getElementById('volumeControl');

  musicToggle?.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); musicToggle.textContent = 'Pause'; } catch (error) { musicToggle.textContent = 'Blocked'; }
    } else {
      audio.pause();
      musicToggle.textContent = 'Play';
    }
  });

  volumeControl?.addEventListener('input', (e) => {
    audio.volume = Number(e.target.value);
  });
}

function setupTilt() {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

startIntro();
setupTyping();
setupHeroVideo();
setupLenis();
setupScrollEffects();
setupDust();
setupProgressBar();
setupPointerGlow();
setupGallery();
setupMessages();
setupToggles();
setupTilt();
