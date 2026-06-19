// ===== NAV SCROLL STATE =====
const nav = document.getElementById('siteNav');
const progressRing = document.getElementById('progressRing');
const progressCircle = document.getElementById('progressCircle');
const RING_CIRCUMFERENCE = 176; // 2 * PI * 28, matches CSS dasharray

function onScroll(){
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
  progressCircle.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - ratio));
  progressRing.classList.toggle('is-active', y > 200);

  // Parallax background in hero
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (y < heroHeight) {
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== STAGGERED REVEAL ON SCROLL (IntersectionObserver) =====
// Trigger: element enters viewport (20% threshold) | each group staggers via incremental delay
const revealGroups = new Map(); // parent element -> count

function assignStagger(){
  const containers = document.querySelectorAll('.practices__grid, .about__columns, .why__items, .testimonials__grid, .team__grid, .stats__grid, .contact__list');
  containers.forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.style.setProperty('--d', `${i * 0.08}s`);
    });
  });
}
assignStagger();

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== COUNTING STATS (Fade Up triggers number count) =====
function animateCount(el){
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach(el => statIo.observe(el));

// ===== MAGNETIC CTA BUTTONS =====
// Trigger: mousemove within button bounds | Duration: instant follow, 0.25s release via CSS transition | Purpose: premium tactile micro-interaction
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

// ===== CONTACT FORM (front-end only demo) =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Отправлено';
    btn.disabled = true;
    form.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2600);
  });
}