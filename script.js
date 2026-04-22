/* ============================================================
   NAVBAR — shrink on scroll + active link tracking
   ============================================================ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* active link via IntersectionObserver */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   MOBILE MENU
   ============================================================ */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  mobileMenu.classList.add('open');
  navToggle.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const s = navToggle.querySelectorAll('span');
  s[0].style.transform = 'translateY(6.5px) rotate(45deg)';
  s[1].style.opacity   = '0';
  s[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  navToggle.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  const s = navToggle.querySelectorAll('span');
  s[0].style.transform = '';
  s[1].style.opacity   = '';
  s[2].style.transform = '';
}

navToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

/* ============================================================
   SCROLL REVEAL — staggered fade-in
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    /* stagger sibling cards in the same grid */
    const siblings = Array.from(
      entry.target.parentElement.querySelectorAll(':scope > .fade-in')
    );
    const idx   = siblings.indexOf(entry.target);
    const delay = idx * 70;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

/* ── HOW TO CONNECT TO GMAIL ──────────────────────────────────
   1. Go to https://formspree.io  →  sign up free
   2. Click "New Form" → set the destination email to fbatshon@ucsd.edu
   3. Copy the Form ID (8 chars, e.g. "xblgrqpz")
   4. Paste it below to replace YOUR_FORMSPREE_ID
   ─────────────────────────────────────────────────────────── */
const FORMSPREE_ID = 'mjgjapyz';

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name  = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg   = document.getElementById('fmsg').value.trim();

  if (!name || !email || !msg) {
    setNote('Please fill in all fields.', '#e05c5c');
    return;
  }
  if (!isValidEmail(email)) {
    setNote('Please enter a valid email address.', '#e05c5c');
    return;
  }

  const btn = contactForm.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
    setTimeout(() => {
      setNote('Form not yet connected — email fbatshon@ucsd.edu directly.', '#e05c5c');
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 400);
    return;
  }

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      setNote("Message sent — I'll be in touch soon.", '#5aafd4');
      contactForm.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      setNote(data.error || 'Something went wrong. Please email directly.', '#e05c5c');
    }
  } catch {
    setNote('Network error. Please email fbatshon@ucsd.edu directly.', '#e05c5c');
  }

  btn.textContent = 'Send Message';
  btn.disabled = false;
});

function setNote(text, color) {
  formNote.textContent = text;
  formNote.style.color = color;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ============================================================
   SMOOTH SCROLL POLISH — offset for fixed navbar
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
