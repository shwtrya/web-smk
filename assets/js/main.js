const intro = document.getElementById('intro');
const introProgress = document.getElementById('intro-progress');
const introLines = document.querySelectorAll('.intro-line');
const scrollProgress = document.getElementById('scrollProgress');
const pointerGlow = document.getElementById('pointerGlow');

const galleryItems = [
  { src: 'assets/images/gallery-1.jpg', caption: 'Morning Briefing · Kegiatan', category: 'kegiatan', meta: '2023 · Lapangan' },
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
  setTimeout(() => {
    gsap.to(intro, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        intro.remove();
        const hint = document.getElementById('soundtrackHint');
        hint?.classList.add('is-visible');
      }
    });
  }, 2600);
}

function setupTyping() {
  const line = document.querySelector('.typing-line');
  if (!line) return;
  const text = line.dataset.text || '';
  let idx = 0;
  let lastTick = performance.now();

  const tick = (now) => {
    if (now - lastTick >= 65) {
      line.textContent = text.slice(0, idx);
      idx += 1;
      lastTick = now;
    }

    if (idx <= text.length + 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
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

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const prefersDataSaver = Boolean(connection?.saveData);
  const slowConnection = ['slow-2g', '2g'].includes(connection?.effectiveType || '');
  let hasLoadedData = false;
  let loadTimeoutId = null;

  const showFallback = () => {
    heroBg.classList.add('show-fallback');
    video.pause();
  };

  const hideFallback = () => {
    heroBg.classList.remove('show-fallback');
  };

  const clearLoadTimeout = () => {
    if (!loadTimeoutId) return;
    clearTimeout(loadTimeoutId);
    loadTimeoutId = null;
  };

  const armLoadTimeout = () => {
    clearLoadTimeout();
    loadTimeoutId = setTimeout(() => {
      if (!hasLoadedData) showFallback();
    }, slowConnection || prefersDataSaver ? 1400 : 3200);
  };

  const applyMotionPreference = () => {
    if (motionQuery.matches || slowConnection || prefersDataSaver) {
      showFallback();
      return;
    }

    hideFallback();
    armLoadTimeout();
    video.play().catch(() => {
      showFallback();
    });
  };

  video.addEventListener('error', showFallback);
  video.addEventListener('stalled', showFallback);
  video.addEventListener('loadeddata', () => {
    hasLoadedData = true;
    clearLoadTimeout();
    if (!motionQuery.matches && !slowConnection && !prefersDataSaver) hideFallback();
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
    sceneCards.forEach((card) => {
      const image = card.querySelector('img');
      const tag = card.querySelector('.scene-tag');
      const title = card.querySelector('.scene-title');
      const copy = card.querySelector('.scene-copy');
      const textNodes = [tag, title, copy].filter(Boolean);

      gsap.set(card, { opacity: 0, filter: 'blur(12px)' });
      if (image) gsap.set(image, { scale: 1.06, transformOrigin: 'center center' });
      if (textNodes.length) gsap.set(textNodes, { opacity: 0, y: 22, filter: 'blur(9px)' });

      const sceneTimeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: card,
          start: 'top 84%',
          end: 'bottom 38%',
          scrub: 0.65,
          onToggle: ({ isActive }) => card.classList.toggle('scene-active', isActive)
        }
      });

      sceneTimeline.to(card, { opacity: 1, filter: 'blur(0px)', duration: 0.52, ease: 'power2.out' }, 0);
      if (image) sceneTimeline.to(image, { scale: 1, duration: 0.9, ease: 'sine.out' }, 0.02);
      if (tag) sceneTimeline.to(tag, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.36 }, 0.12);
      if (title) sceneTimeline.to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.42 }, 0.24);
      if (copy) sceneTimeline.to(copy, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.48 }, 0.36);
    });

    gsap.utils.toArray('.scene-transition').forEach((transition) => {
      gsap.fromTo(
        transition,
        { opacity: 0.08, scaleX: 0.9 },
        {
          opacity: 0.54,
          scaleX: 1,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: transition,
            start: 'top 94%',
            end: 'bottom 56%',
            scrub: 0.55
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

  const mobileCoarseQuery = window.matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)');
  const runtimeDisableEffects = () => mobileCoarseQuery.matches;

  if (runtimeDisableEffects()) {
    pointerGlow.style.display = 'none';
    return;
  }

  let targetX = window.innerWidth * 0.5;
  let targetY = window.innerHeight * 0.5;
  let currentX = targetX;
  let currentY = targetY;
  let glowFrame = null;
  let lastMove = 0;
  const moveThrottleMs = 24;

  pointerGlow.style.display = '';

  const updateGlow = () => {
    const smoothing = mobileCoarseQuery.matches ? 0.15 : 0.1;
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;

    pointerGlow.style.left = `${currentX}px`;
    pointerGlow.style.top = `${currentY}px`;

    if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
      glowFrame = requestAnimationFrame(updateGlow);
      return;
    }

    glowFrame = null;
  };

  const requestGlowUpdate = () => {
    if (glowFrame !== null) return;
    glowFrame = requestAnimationFrame(updateGlow);
  };

  const handleMove = (e) => {
    if (runtimeDisableEffects()) return;
    const now = performance.now();
    if (now - lastMove < moveThrottleMs) return;
    lastMove = now;
    targetX = e.clientX;
    targetY = e.clientY;
    requestGlowUpdate();
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerdown', handleMove);
  window.addEventListener('resize', () => {
    if (runtimeDisableEffects()) {
      targetX = window.innerWidth * 0.5;
      targetY = window.innerHeight * 0.5;
      requestGlowUpdate();
    }
  });

  const syncMode = () => {
    if (runtimeDisableEffects()) {
      pointerGlow.style.display = 'none';
      if (glowFrame !== null) {
        cancelAnimationFrame(glowFrame);
        glowFrame = null;
      }
      return;
    }

    pointerGlow.style.display = '';
    requestGlowUpdate();
  };

  if (typeof mobileCoarseQuery.addEventListener === 'function') {
    mobileCoarseQuery.addEventListener('change', syncMode);
  } else if (typeof mobileCoarseQuery.addListener === 'function') {
    mobileCoarseQuery.addListener(syncMode);
  }

  requestGlowUpdate();
}

function setupPointerReactiveCards() {
  const cards = document.querySelectorAll('.scene-card, .memory-card');
  if (!cards.length) return;

  const mobileCoarseQuery = window.matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)');

  const disableEffects = () => {
    cards.forEach((card) => {
      card.classList.remove('is-pointer-active');
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
  };

  const bindInteractive = (card) => {
    card.addEventListener('pointermove', (event) => {
      if (mobileCoarseQuery.matches) return;
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--pointer-x', `${Math.max(0, Math.min(100, x))}%`);
      card.style.setProperty('--pointer-y', `${Math.max(0, Math.min(100, y))}%`);
      card.classList.add('is-pointer-active');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-pointer-active');
    });
  };

  cards.forEach(bindInteractive);

  const syncMode = () => {
    if (mobileCoarseQuery.matches) {
      disableEffects();
    }
  };

  if (typeof mobileCoarseQuery.addEventListener === 'function') {
    mobileCoarseQuery.addEventListener('change', syncMode);
  } else if (typeof mobileCoarseQuery.addListener === 'function') {
    mobileCoarseQuery.addListener(syncMode);
  }

  syncMode();
}

function renderGallery(items) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    const meta = document.createElement('small');

    figure.className = 'gallery-item';
    figure.dataset.index = i;

    img.loading = 'lazy';
    img.src = item.src;
    img.alt = item.caption;
    img.onerror = () => {
      console.error(`[gallery] Missing image asset: ${item.src}`);
      img.onerror = null;
      img.src = 'assets/images/hero-placeholder.svg';
      img.alt = `${item.caption} (placeholder)`;
    };

    figcaption.append(item.caption);
    figcaption.append(document.createElement('br'));
    meta.textContent = item.meta;
    figcaption.append(meta);

    figure.append(img, figcaption);
    grid.appendChild(figure);
  });
}

let activeGallery = [...galleryItems];
let lightboxIndex = 0;

function setupGallery() {
  renderGallery(activeGallery);

  const filters = document.getElementById('filters');
  const lightbox = document.getElementById('lightbox');
  const imageA = document.getElementById('lightboxImageA');
  const imageB = document.getElementById('lightboxImageB');
  const caption = document.getElementById('lightboxCaption');
  const dateEl = document.getElementById('lightboxDate');
  const locationEl = document.getElementById('lightboxLocation');
  const indexEl = document.getElementById('lightboxIndex');
  const slideshowBtn = document.getElementById('slideshowBtn');
  const lightboxSlideshowBtn = document.getElementById('lightboxSlideshowBtn');
  const cinematicToggle = document.getElementById('lightboxCinematicToggle');
  const progressEl = document.getElementById('lightboxProgressBar');
  const progressWrap = document.querySelector('.lightbox-progress');
  const counterEl = document.getElementById('lightboxCounter');
  const bgMusic = document.getElementById('bgMusic');
  const volumeControl = document.getElementById('volumeControl');
  const projectorFx = document.getElementById('projectorFx');
  const grainCanvas = document.getElementById('lightboxGrainCanvas');

  let activeBuffer = 0;
  let slideshowState = null;
  let navLocked = false;
  let captionDelay = null;
  let cinematicMode = false;
  let isHoverPaused = false;

  const baseSlideDuration = 5200;
  const cinematicSlideDuration = 9000;
  const transitionDuration = 1200;
  const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');

  const isLightboxOpen = () => lightbox && !lightbox.classList.contains('hidden');
  const getSlideDuration = () => (cinematicMode ? cinematicSlideDuration : baseSlideDuration);

  const preloadAround = () => {
    if (!activeGallery.length) return;
    const targets = [
      activeGallery[(lightboxIndex + 1) % activeGallery.length]?.src,
      activeGallery[(lightboxIndex - 1 + activeGallery.length) % activeGallery.length]?.src
    ].filter(Boolean);

    targets.forEach((src) => {
      const preloader = new Image();
      preloader.decoding = 'async';
      preloader.loading = 'eager';
      preloader.src = src;
    });
  };

  const formatIndex = (current, total) => `${String(current).padStart(2, '0')}/${String(total).padStart(2, '0')}`;

  const setProgress = (value = 0, withFade = false) => {
    const normalized = Math.max(0, Math.min(100, value));
    if (progressEl) {
      progressEl.style.opacity = withFade ? '0' : '1';
      progressEl.style.width = `${normalized}%`;
      if (withFade) requestAnimationFrame(() => { progressEl.style.opacity = '1'; });
    }
    if (progressWrap) progressWrap.setAttribute('aria-valuenow', `${Math.round(normalized)}`);
  };

  const stopSlideshow = () => {
    if (!slideshowState) return;
    slideshowState.running = false;
    slideshowState = null;
    if (slideshowBtn) slideshowBtn.textContent = 'Start Slideshow';
    if (lightboxSlideshowBtn) {
      lightboxSlideshowBtn.textContent = '▶ Play Slideshow';
      lightboxSlideshowBtn.setAttribute('aria-pressed', 'false');
    }
    setProgress(0, true);
    if (bgMusic && !bgMusic.paused) {
      const current = bgMusic.volume;
      const end = Math.min(1, Math.max(0, Number(volumeControl?.value || 0.5)));
      const startedAt = performance.now();
      const duration = 850;
      const fadeDown = (now) => {
        const t = Math.min(1, (now - startedAt) / duration);
        bgMusic.volume = current + (end - current) * t;
        if (t < 1 && !bgMusic.paused) requestAnimationFrame(fadeDown);
      };
      requestAnimationFrame(fadeDown);
    }
  };

  const runSlideshow = () => {
    if (!slideshowState?.running) return;
    const duration = slideshowState.duration;
    const elapsed = performance.now() - slideshowState.startedAt - slideshowState.pausedMs;
    const progress = (elapsed / duration) * 100;

    if (!slideshowState.hoverPaused) {
      setProgress(progress);
    }

    if (elapsed >= duration) {
      slideshowState.startedAt = performance.now();
      slideshowState.pausedMs = 0;
      nextPhoto('next', true);
      return;
    }

    slideshowState.frame = requestAnimationFrame(runSlideshow);
  };

  const startSlideshow = () => {
    if (!activeGallery.length || slideshowState) return;
    openLightbox(lightboxIndex, true);
    if (slideshowBtn) slideshowBtn.textContent = 'Stop Slideshow';
    if (lightboxSlideshowBtn) {
      lightboxSlideshowBtn.textContent = '❚❚ Pause Slideshow';
      lightboxSlideshowBtn.setAttribute('aria-pressed', 'true');
    }

    if (bgMusic?.paused) {
      const target = Math.min(1, Math.max(0, Number(volumeControl?.value || 0.3)));
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        const cinematicBoost = cinematicMode ? 0.12 : 0.04;
        const end = Math.min(1, target + cinematicBoost);
        const start = performance.now();
        const fadeIn = (now) => {
          const t = Math.min(1, (now - start) / 1500);
          bgMusic.volume = end * t;
          if (t < 1 && !bgMusic.paused) requestAnimationFrame(fadeIn);
        };
        requestAnimationFrame(fadeIn);
      }).catch(() => {});
    }

    slideshowState = {
      running: true,
      startedAt: performance.now(),
      duration: getSlideDuration(),
      pausedMs: 0,
      hoverPaused: false,
      hoverAt: 0,
      frame: requestAnimationFrame(runSlideshow)
    };
    setProgress(0, true);
  };

  const renderMeta = () => {
    const item = activeGallery[lightboxIndex];
    if (!item) return;
    const [date = '', location = ''] = item.meta.split('·').map((part) => part.trim());
    if (caption) {
      caption.classList.remove('is-visible');
      caption.textContent = item.caption;
      if (captionDelay) clearTimeout(captionDelay);
      captionDelay = setTimeout(() => caption.classList.add('is-visible'), 1000);
    }
    if (dateEl) dateEl.textContent = date;
    if (locationEl) locationEl.textContent = location;
    const counter = formatIndex(lightboxIndex + 1, activeGallery.length);
    if (indexEl) indexEl.textContent = counter;
    if (counterEl) counterEl.textContent = counter;
  };

  const panForIndex = (index) => ((index % 5) - 2) * 0.7;
  const zoomForIndex = (index) => 1.05 + ((index % 3) * 0.02);

  const animateKenBurns = (el) => {
    if (!el) return;
    const startPan = panForIndex(lightboxIndex);
    const endPan = startPan * -1;
    const startScale = zoomForIndex(lightboxIndex);
    const endScale = Math.min(1.1, startScale + 0.03);
    const startedAt = performance.now();
    const duration = getSlideDuration();

    const frame = (now) => {
      if (!el.classList.contains('is-active')) return;
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = t * (2 - t);
      const x = startPan + (endPan - startPan) * eased;
      const scale = startScale + (endScale - startScale) * eased;
      el.style.transform = `translate3d(${x}%, 0, 0) scale(${scale})`;
      if (t < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const syncImage = (immediate = false) => {
    const item = activeGallery[lightboxIndex];
    if (!item || !imageA || !imageB) return;

    const incoming = activeBuffer === 0 ? imageB : imageA;
    const outgoing = activeBuffer === 0 ? imageA : imageB;

    const activateIncoming = () => {
      lightbox?.classList.add('is-transitioning');
      outgoing.classList.remove('is-active', 'is-entering');
      outgoing.classList.add('is-exiting');
      incoming.classList.remove('is-exiting');
      incoming.classList.add('is-active', 'is-entering');

      animateKenBurns(incoming);

      if (projectorFx) {
        projectorFx.currentTime = 0;
        projectorFx.volume = cinematicMode ? 0.12 : 0.07;
        projectorFx.play().catch(() => {});
      }

      const clear = () => {
        outgoing.classList.remove('is-exiting');
        incoming.classList.remove('is-entering');
        lightbox?.classList.remove('is-transitioning');
      };

      if (immediate || motionPref.matches || !outgoing.src) {
        clear();
      } else {
        setTimeout(clear, transitionDuration);
      }

      activeBuffer = activeBuffer === 0 ? 1 : 0;
      preloadAround();
    };

    incoming.alt = item.caption;
    incoming.src = item.src;

    if (immediate || !outgoing.src || incoming.complete) {
      requestAnimationFrame(activateIncoming);
    } else {
      incoming.onload = () => {
        incoming.onload = null;
        requestAnimationFrame(activateIncoming);
      };
    }
  };

  const sync = (immediate = false) => {
    renderMeta();
    syncImage(immediate);
  };

  const openLightbox = (index = 0, immediate = true) => {
    lightboxIndex = index;
    sync(immediate);
    lightbox?.classList.remove('hidden');
    lightbox?.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox?.classList.add('hidden');
    lightbox?.setAttribute('aria-hidden', 'true');
    stopSlideshow();
    setProgress(0, true);
  };

  const nextPhoto = (direction = 'next', fromSlideshow = false) => {
    if (!activeGallery.length || navLocked) return;
    navLocked = true;
    const delta = direction === 'next' ? 1 : -1;
    lightboxIndex = (lightboxIndex + delta + activeGallery.length) % activeGallery.length;
    sync(false);
    if (slideshowState && !fromSlideshow) {
      slideshowState.startedAt = performance.now();
      slideshowState.pausedMs = 0;
      slideshowState.duration = getSlideDuration();
      setProgress(0, true);
    }
    setTimeout(() => { navLocked = false; }, 280);
  };

  const prevPhoto = () => nextPhoto('prev');

  progressWrap?.addEventListener('pointerenter', () => {
    if (!slideshowState) return;
    isHoverPaused = true;
    slideshowState.hoverPaused = true;
    slideshowState.hoverAt = performance.now();
    progressWrap.classList.add('is-paused');
  });

  progressWrap?.addEventListener('pointerleave', () => {
    if (!slideshowState || !isHoverPaused) return;
    isHoverPaused = false;
    slideshowState.hoverPaused = false;
    slideshowState.pausedMs += performance.now() - slideshowState.hoverAt;
    progressWrap.classList.remove('is-paused');
    slideshowState.frame = requestAnimationFrame(runSlideshow);
  });

  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach((f) => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      activeGallery = filter === 'all' ? [...galleryItems] : galleryItems.filter((g) => g.category === filter);
      renderGallery(activeGallery);
      lightboxIndex = 0;
      stopSlideshow();
      setProgress(0, true);
      if (isLightboxOpen()) sync(true);
    });
  }

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const nextIndex = Number(item.dataset.index) || 0;
    openLightbox(nextIndex, true);
  });

  document.getElementById('prevPhoto')?.addEventListener('click', prevPhoto);
  document.getElementById('nextPhoto')?.addEventListener('click', () => nextPhoto('next'));
  document.getElementById('closeLightbox')?.addEventListener('click', closeLightbox);

  cinematicToggle?.addEventListener('click', () => {
    cinematicMode = lightbox?.classList.toggle('cinematic-mode');
    cinematicToggle.textContent = `Cinematic: ${cinematicMode ? 'On' : 'Off'}`;
    cinematicToggle.setAttribute('aria-pressed', cinematicMode ? 'true' : 'false');

    document.dispatchEvent(new CustomEvent('smk:cinematic-mode', { detail: { enabled: cinematicMode } }));

    if (slideshowState) {
      slideshowState.duration = getSlideDuration();
      slideshowState.startedAt = performance.now();
      slideshowState.pausedMs = 0;
      setProgress(0, true);
    }

    if (bgMusic && !bgMusic.paused) {
      const base = Math.min(1, Math.max(0, Number(volumeControl?.value || 0.35)));
      bgMusic.volume = Math.min(1, base + (cinematicMode ? 0.12 : 0.04));
    }
  });

  slideshowBtn?.addEventListener('click', () => {
    if (slideshowState) {
      stopSlideshow();
      return;
    }
    startSlideshow();
  });

  lightboxSlideshowBtn?.addEventListener('click', () => {
    if (slideshowState) {
      stopSlideshow();
      return;
    }
    startSlideshow();
  });

  let touchStartX = 0;
  let touchStartY = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) nextPhoto('next');
    else prevPhoto();
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    const lbOpen = isLightboxOpen();

    if (e.key === 'Escape' && lbOpen) {
      closeLightbox();
      return;
    }

    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && lbOpen) {
      e.preventDefault();
      if (e.key === 'ArrowRight') nextPhoto('next');
      if (e.key === 'ArrowLeft') prevPhoto();
      return;
    }

    if (e.code === 'Space' && (lbOpen || slideshowState)) {
      e.preventDefault();
      if (slideshowState) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    }
  });

  const drawGrain = () => {
    if (!grainCanvas || !lightbox) return;
    const ctx = grainCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      grainCanvas.width = lightbox.clientWidth;
      grainCanvas.height = lightbox.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = () => {
      const enabled = lightbox.classList.contains('cinematic-mode') && isLightboxOpen();
      if (enabled) {
        const w = grainCanvas.width;
        const h = grainCanvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 10;
        }
        ctx.putImageData(imageData, 0, 0);
      } else {
        ctx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  drawGrain();
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
  const cinematicToggle = document.getElementById('cinematicToggle');

  const prefsKey = 'smk-ui-preferences';
  const defaultPrefs = {
    theme: 'dark',
    grainEnabled: true,
    leakEnabled: true,
    cinematicEnabled: false,
    volume: 0.5,
    muted: false,
    playIntent: false
  };

  let prefs = defaultPrefs;
  try {
    prefs = { ...defaultPrefs, ...(JSON.parse(localStorage.getItem(prefsKey) || '{}')) };
  } catch (error) {
    prefs = defaultPrefs;
  }

  const savePrefs = (nextPrefs = {}) => {
    prefs = { ...prefs, ...nextPrefs };
    localStorage.setItem(prefsKey, JSON.stringify(prefs));
  };

  const applyTheme = (isDark) => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    if (themeToggle) themeToggle.checked = isDark;
  };

  const applyGrain = (enabled) => {
    const grain = document.querySelector('.app-grain');
    if (grain) grain.style.display = enabled ? 'block' : 'none';
    if (grainToggle) grainToggle.checked = enabled;
  };

  const applyLeak = (enabled) => {
    const leak = document.querySelector('.app-leak');
    if (leak) leak.style.display = enabled ? 'block' : 'none';
    if (leakToggle) leakToggle.checked = enabled;
  };

  const applyCinematic = (enabled) => {
    document.body.classList.toggle('cinematic-on', enabled);
    if (cinematicToggle) cinematicToggle.checked = enabled;
  };

  applyTheme(prefs.theme !== 'light');
  applyGrain(Boolean(prefs.grainEnabled));
  applyLeak(Boolean(prefs.leakEnabled));
  applyCinematic(Boolean(prefs.cinematicEnabled));

  settingsToggle?.addEventListener('click', () => settingsPanel?.classList.toggle('hidden'));

  themeToggle?.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    applyTheme(isDark);
    savePrefs({ theme: isDark ? 'dark' : 'light' });
  });

  grainToggle?.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    applyGrain(enabled);
    savePrefs({ grainEnabled: enabled });
  });

  leakToggle?.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    applyLeak(enabled);
    savePrefs({ leakEnabled: enabled });
  });

  cinematicToggle?.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    applyCinematic(enabled);
    savePrefs({ cinematicEnabled: enabled });
  });

  const audio = document.getElementById('bgMusic');
  const musicPlayer = document.querySelector('.music-player');
  const musicToggle = document.getElementById('musicToggle');
  const volumeControl = document.getElementById('volumeControl');
  const audioProgress = document.getElementById('audioProgress');
  const audioTimeLabel = document.getElementById('audioTimeLabel');
  const trackLabel = document.getElementById('trackLabel');
  const soundtrackHint = document.getElementById('soundtrackHint');

  if (!audio) return;

  const persistedVolume = Number(prefs.volume);
  const safeVolume = Number.isFinite(persistedVolume) ? Math.min(1, Math.max(0, persistedVolume)) : defaultPrefs.volume;

  audio.volume = safeVolume;
  audio.muted = Boolean(prefs.muted);

  if (volumeControl) volumeControl.value = String(safeVolume);
  if (trackLabel) {
    trackLabel.textContent = audio.dataset.trackTitle || 'Nostalgia Theme';
  }

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const updatePlayingState = () => {
    if (!musicToggle) return;
    const isPlaying = !audio.paused;
    musicToggle.textContent = isPlaying ? 'Pause' : 'Play';
    musicPlayer?.classList.toggle('is-playing', isPlaying);
    if (isPlaying) soundtrackHint?.classList.remove('is-visible');
  };

  const syncProgressUI = () => {
    const current = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration || 0);

    if (audioTimeLabel) audioTimeLabel.textContent = `${current} / ${duration}`;

    if (audioProgress && Number.isFinite(audio.duration) && audio.duration > 0) {
      audioProgress.value = String((audio.currentTime / audio.duration) * 100);
    }
  };

  const fadeInAudio = async () => {
    if (!audio.paused) return;

    const targetVolume = Math.min(1, Math.max(0, Number(volumeControl?.value ?? audio.volume)));
    audio.volume = 0;

    await audio.play();

    const fadeDuration = 1200;
    const startedAt = performance.now();

    const animate = (timestamp) => {
      const progress = Math.min(1, (timestamp - startedAt) / fadeDuration);
      audio.volume = targetVolume * progress;

      if (progress < 1 && !audio.paused) {
        requestAnimationFrame(animate);
        return;
      }

      if (!audio.paused) {
        audio.volume = targetVolume;
      }
    };

    requestAnimationFrame(animate);
  };

  musicToggle?.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await fadeInAudio();
        savePrefs({ playIntent: true });
      } catch (error) {
        musicToggle.textContent = 'Blocked';
        return;
      }
    } else {
      audio.pause();
      savePrefs({ playIntent: false });
    }
    updatePlayingState();
  });

  volumeControl?.addEventListener('input', (e) => {
    audio.volume = Number(e.target.value);
    if (audio.muted && audio.volume > 0) {
      audio.muted = false;
      savePrefs({ muted: false });
    }
    savePrefs({ volume: audio.volume });
  });

  audioProgress?.addEventListener('input', (e) => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = (Number(e.target.value) / 100) * audio.duration;
    syncProgressUI();
  });

  audio.addEventListener('loadedmetadata', syncProgressUI);
  audio.addEventListener('timeupdate', syncProgressUI);
  audio.addEventListener('durationchange', syncProgressUI);
  audio.addEventListener('play', updatePlayingState);
  audio.addEventListener('pause', updatePlayingState);
  audio.addEventListener('volumechange', () => {
    savePrefs({ volume: audio.volume, muted: audio.muted });
  });

  if (prefs.playIntent) {
    fadeInAudio().then(() => {
      updatePlayingState();
    }).catch(() => {
      savePrefs({ playIntent: false });
      updatePlayingState();
    });
  }

  updatePlayingState();
  syncProgressUI();
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
setupPointerReactiveCards();
setupGallery();
setupMessages();
setupToggles();
setupTilt();
