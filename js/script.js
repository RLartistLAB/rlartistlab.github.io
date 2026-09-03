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
