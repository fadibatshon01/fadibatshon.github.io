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

if (contactForm) contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const msg     = document.getElementById('fmsg').value.trim();

  if (!name || !email || !subject || !msg) {
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
   HERO BLOBS — mouse-tracking gradient orbs with lerp easing
   ============================================================ */
(function () {
  const hero  = document.querySelector('.hero');
  const blob1 = document.querySelector('.hero-blob-1');
  const blob2 = document.querySelector('.hero-blob-2');
  const glow  = document.querySelector('.cursor-glow');
  if (!hero || !blob1 || !blob2) return;

  let tx1 = 0, ty1 = 0, cx1 = 0, cy1 = 0;
  let tx2 = 0, ty2 = 0, cx2 = 0, cy2 = 0;
  let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
  let gCX = glowX, gCY = glowY;

  hero.addEventListener('mousemove', e => {
    const r  = hero.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width  - 0.5;
    const my = (e.clientY - r.top)  / r.height - 0.5;
    tx1 = mx * 95;  ty1 = my * 70;
    tx2 = -mx * 60; ty2 = -my * 50;
    if (glow) glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    tx1 = ty1 = tx2 = ty2 = 0;
    if (glow) glow.style.opacity = '0';
  });

  document.addEventListener('mousemove', e => {
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function tick() {
    cx1 += (tx1 - cx1) * 0.038;
    cy1 += (ty1 - cy1) * 0.038;
    cx2 += (tx2 - cx2) * 0.055;
    cy2 += (ty2 - cy2) * 0.055;
    gCX += (glowX - gCX) * 0.1;
    gCY += (glowY - gCY) * 0.1;

    blob1.style.transform = `translate(${cx1}px, ${cy1}px)`;
    blob2.style.transform = `translate(${cx2}px, ${cy2}px)`;
    if (glow) glow.style.transform = `translate(calc(-50% + ${gCX}px), calc(-50% + ${gCY}px))`;

    requestAnimationFrame(tick);
  }
  tick();
})();

/* ============================================================
   PROJECT CARDS — 3D tilt on hover
   ============================================================ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

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
    // Immediate visual feedback for nav-link clicks
    if (anchor.closest('.nav-links')) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a === anchor)
      );
    }
  });
});

/* ============================================================
   WRITING PROMO — latest pieces on the main page
   ============================================================ */
(async function () {
  const listEl = document.getElementById('wpList');
  if (!listEl) return;
  try {
    const res = await fetch('./writing/posts.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('posts.json unavailable');
    const posts = await res.json();
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const top = posts.slice(0, 3);
    const fmt = iso => {
      const d = new Date(iso + 'T00:00:00');
      return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    listEl.innerHTML = top.map((p, i) => `
      <a class="wp-item" href="./writing/post/?slug=${encodeURIComponent(p.slug)}">
        <span class="wp-no" aria-hidden="true">№${String(posts.length - i).padStart(2,'0')}</span>
        <div class="wp-main">
          <h4 class="wp-title">${p.title}</h4>
          <p class="wp-excerpt">${p.excerpt || ''}</p>
        </div>
        <span class="wp-date">${fmt(p.date)}</span>
      </a>
    `).join('');
  } catch (err) {
    listEl.innerHTML = '<p class="wp-loading">Couldn\'t load posts.</p>';
    console.error(err);
  }
})();

/* ============================================================
   CLEAN URL — strip /index.html and #section from the address bar
   on page load. Scrolls to the hash target if present, sets the
   matching nav link active, and strips the URL.

   Uses a short delay so async content (writing-promo list) finishes
   loading before we measure scroll position — otherwise layout shifts
   after our scroll, leaving the target offset.
   ============================================================ */
(function () {
  const path = window.location.pathname;
  const cleanPath = path.replace(/\/index\.html$/, '/');
  const hash = window.location.hash;

  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        const nav = document.getElementById('navbar');
        const offset = (nav ? nav.offsetHeight : 80) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'auto' });
        history.replaceState(null, '', cleanPath + window.location.search);
        // Explicitly set the active nav link for cross-page arrivals
        // (the IntersectionObserver can miss for tall sections like Resume)
        const id = target.id;
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }, 220);
      return;
    }
    // Hash didn't resolve — still strip /index.html if present
    if (cleanPath !== path) {
      history.replaceState(null, '', cleanPath + window.location.search + hash);
    }
    return;
  }

  // No hash — just strip /index.html if present
  if (cleanPath !== path) {
    history.replaceState(null, '', cleanPath + window.location.search);
  }
})();
