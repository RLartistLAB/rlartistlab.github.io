// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

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

// Formulario de contacto (todavía sin backend)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = '¡Gracias! Este formulario aún no está conectado a un servicio de envío — se activará en una próxima etapa.';
  formNote.style.color = 'var(--teal)';
});

// Resaltar el botón del hero correspondiente al pasar el mouse por el texto
const heroHighlights = document.querySelectorAll('.hero-detail .hl');

heroHighlights.forEach(span => {
  const targetBtn = document.getElementById(span.dataset.target);
  if (!targetBtn) return;

  span.addEventListener('mouseenter', () => targetBtn.classList.add('btn-highlight'));
  span.addEventListener('mouseleave', () => targetBtn.classList.remove('btn-highlight'));
});
