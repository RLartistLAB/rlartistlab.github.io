// Año dinámico en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Cerrar el menú al elegir una sección (mobile)
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Filtro de Sample Packs
const filterButtons = document.querySelectorAll('.filter-btn');
const packCards = document.querySelectorAll('.pack-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    packCards.forEach(card => {
      const match = filter === 'todos' || card.dataset.genre === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// Botones de navegación (Cursos y Guías): marcar como activo el seleccionado
document.querySelectorAll('#cursos .filters, #guias .filters').forEach(group => {
  const links = group.querySelectorAll('.filter-btn:not(.filter-btn-disabled)');
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

// Formulario de contacto (todavía sin backend)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm && formNote) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = '¡Gracias! Este formulario aún no está conectado a un servicio de envío — se activará en una próxima etapa.';
    formNote.style.color = 'var(--teal)';
  });
}

// CTA del Hero: destino aleatorio, evitando repetir el mismo dos veces seguidas
function heroPickRandomDestination(storageKey, options) {
  const lastKey = 'heroLastDestination_' + storageKey;
  const last = sessionStorage.getItem(lastKey);
  let choices = options;
  if (options.length > 1 && last !== null) {
    choices = options.filter((opt) => opt !== last);
  }
  const next = choices[Math.floor(Math.random() * choices.length)];
  sessionStorage.setItem(lastKey, next);
  return next;
}

function heroSetupRandomCta(buttonId, storageKey, options) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const destination = heroPickRandomDestination(storageKey, options);
    window.location.href = destination;
  });
}

heroSetupRandomCta('heroBtnAprender', 'aprender', [
  '#cursos',
  '#guias',
  '#tutoriales',
  'servicio-clases-1a1.html'
]);

heroSetupRandomCta('heroBtnDesarrollar', 'desarrollar', [
  '#servicios',
  '#samples'
]);

// Preview de audio (SoundCloud): botón de play manual sobre la portada del sample pack
document.querySelectorAll('.pack-art-real[data-track]').forEach(art => {
  const playBtn = art.querySelector('.preview-play');
  if (!playBtn) return;
  let iframe = null;

  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (iframe) {
      // Ya está sonando: lo detenemos
      iframe.remove();
      iframe = null;
      playBtn.classList.remove('is-playing');
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', 'Reproducir demo');
      return;
    }

    // No está sonando: lo arrancamos
    const trackUrl = encodeURIComponent(art.dataset.track);
    iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay');
    iframe.style.cssText = 'position:absolute; width:0; height:0; border:0; opacity:0; pointer-events:none;';
    iframe.src = `https://w.soundcloud.com/player/?url=${trackUrl}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
    art.appendChild(iframe);
    playBtn.classList.add('is-playing');
    playBtn.textContent = '❚❚';
    playBtn.setAttribute('aria-label', 'Pausar demo');
  });
});

// Visor interno del programa (Cursos) — sin descarga directa del PDF
const pdfModal = document.getElementById('pdfModal');
const pdfPageImg = document.getElementById('pdfPageImg');
const pdfPageIndicator = document.getElementById('pdfPageIndicator');
const btnVerPrograma = document.getElementById('btnVerPrograma');
const totalPdfPages = 8;
let currentPdfPage = 1;

function renderPdfPage() {
  pdfPageImg.src = `img/programa/pagina-${currentPdfPage}.jpg`;
  pdfPageIndicator.textContent = `${currentPdfPage} / ${totalPdfPages}`;
}

function openPdfModal() {
  currentPdfPage = 1;
  renderPdfPage();
  pdfModal.classList.add('open');
  pdfModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  pdfModal.classList.remove('open');
  pdfModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (pdfModal && btnVerPrograma) {
  btnVerPrograma.addEventListener('click', openPdfModal);

  pdfModal.querySelectorAll('[data-pdf-close]').forEach(el => {
    el.addEventListener('click', closePdfModal);
  });

  const pdfPrevBtn = document.getElementById('pdfPrev');
  const pdfNextBtn = document.getElementById('pdfNext');

  if (pdfPrevBtn) {
    pdfPrevBtn.addEventListener('click', () => {
      if (currentPdfPage > 1) {
        currentPdfPage--;
        renderPdfPage();
      }
    });
  }

  if (pdfNextBtn) {
    pdfNextBtn.addEventListener('click', () => {
      if (currentPdfPage < totalPdfPages) {
        currentPdfPage++;
        renderPdfPage();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!pdfModal.classList.contains('open')) return;
    if (e.key === 'Escape') closePdfModal();
    if (e.key === 'ArrowLeft' && currentPdfPage > 1) { currentPdfPage--; renderPdfPage(); }
    if (e.key === 'ArrowRight' && currentPdfPage < totalPdfPages) { currentPdfPage++; renderPdfPage(); }
  });
}

// ============================================
// ANIMACIONES DE SCROLL: reveal (Intersection Observer) + parallax sutil
// Solo CSS + JS nativo. Respeta prefers-reduced-motion.
// ============================================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1) Scroll reveal con stagger ---
  // Asigna las clases .reveal / .reveal-up / .reveal-left / .reveal-right / .reveal-scale
  // y un transition-delay escalonado por grupo, sin tocar el HTML existente.
  function prepareReveal(selector, variant, options) {
    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return;

    const stagger = (options && options.stagger) || 90; // ms entre elementos de un mismo grupo
    const groupSelector = (options && options.groupBy) || null;

    // Agrupar por contenedor para que el stagger sea relativo a cada bloque, no a toda la página
    const groups = new Map();
    elements.forEach((el) => {
      const container = groupSelector ? el.closest(groupSelector) : el.parentElement;
      if (!groups.has(container)) groups.set(container, []);
      groups.get(container).push(el);
    });

    groups.forEach((group) => {
      group.forEach((el, i) => {
        el.classList.add('reveal', variant);
        el.style.transitionDelay = reduceMotion ? '0ms' : (i * stagger) + 'ms';
      });
    });
  }

  // Hero
  prepareReveal('.hero h1, .hero-sub, .hero-info, .hero-cta-compact .btn', 'reveal-up', { groupBy: '.hero', stagger: 110 });

  // Filosofía
  prepareReveal('#filosofia .philosophy-intro h2, #filosofia .philosophy-lead, #filosofia .philosophy-intro .section-intro', 'reveal-up', { groupBy: '.philosophy-intro', stagger: 110 });
  prepareReveal('.philosophy-step', 'reveal-scale', { groupBy: '.philosophy-steps', stagger: 130 });

  // Encabezados de cada sección (Cursos, Servicios, Samplepacks, Guías, Tutoriales)
  prepareReveal('.section > h2', 'reveal-up', { groupBy: '.section', stagger: 0 });
  prepareReveal('.section > .section-intro', 'reveal-left', { groupBy: '.section', stagger: 0 });
  prepareReveal('.section > .filters', 'reveal-up', { groupBy: '.section', stagger: 0 });

  // Cards (Cursos, Servicios, Samplepacks, Guías comparten .pack-grid / .pack-card)
  prepareReveal('.pack-grid .pack-card', 'reveal-up', { groupBy: '.pack-grid', stagger: 90 });

  // Tutoriales
  prepareReveal('.tutorial-grid .tutorial-card', 'reveal-up', { groupBy: '.tutorial-grid', stagger: 90 });

  // Footer
  prepareReveal('.footer-grid > .footer-col', 'reveal-up', { groupBy: '.footer-grid', stagger: 80 });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // --- 2) Parallax sutil, scroll-linked (desactivado si el usuario prefiere menos movimiento) ---
  if (!reduceMotion) {
    const parallaxTargets = [];

    function addParallax(selector, speed, withScale) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('parallax-el');
        parallaxTargets.push({ el, speed: speed, scale: withScale || null });
      });
    }

    // Elementos sueltos: leve desplazamiento vertical según su posición en pantalla
    addParallax('.hero-logo-mark', 0.1, null);
    addParallax('.philosophy-step-num', 0.08, null);

    // Imágenes dentro de contenedores con overflow:hidden: se agranda un poco para que el
    // desplazamiento no deje bordes vacíos (efecto clásico de imagen "flotando" dentro de su marco)
    addParallax('.pack-art-real img', 0.06, 1.12);
    addParallax('.tutorial-thumb img', 0.06, 1.12);

    let ticking = false;

    function updateParallax() {
      const viewportH = window.innerHeight;
      parallaxTargets.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        // Solo calculamos/aplicamos para elementos cerca del viewport (rendimiento)
        if (rect.bottom < -200 || rect.top > viewportH + 200) return;
        const distanceFromCenter = (rect.top + rect.height / 2) - viewportH / 2;
        const offset = distanceFromCenter * item.speed * -1;
        item.el.style.transform = item.scale
          ? `translateY(${offset}px) scale(${item.scale})`
          : `translateY(${offset}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    updateParallax();
  }
})();
