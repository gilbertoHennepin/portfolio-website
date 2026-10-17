/* ─── script.js ─── */

// ══════════════════════════════════════════
// PARTICLE CANVAS BACKGROUND
// ══════════════════════════════════════════
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouseX = -9999, mouseY = -9999;
  const AMBER = [245, 158, 11];
  const ORANGE = [234, 88, 12];
  const N = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function mkParticle() {
    const col = Math.random() > 0.5 ? AMBER : ORANGE;
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.18, 0.18),
      vy: randomBetween(-0.18, 0.18),
      r: randomBetween(0.8, 2.8),
      alpha: randomBetween(0.2, 0.6),
      col,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(245,158,11,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col.join(',')},${p.alpha})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (1 - dist / 120) * 0.6;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }
      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) { p.vx *= 0.97; p.vy *= 0.97; }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  init();
  loop();
})();

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ══════════════════════════════════════════
// NAVBAR — scroll effect + active link
// ══════════════════════════════════════════
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ══════════════════════════════════════════
// MOBILE MENU
// ══════════════════════════════════════════
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenuBtn.classList.remove('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
const revealEls = document.querySelectorAll(
  '.timeline-item, .skill-category, .project-card, .about-text, .about-visual, .contact-info, .contact-form'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ══════════════════════════════════════════
// SKILL BARS ANIMATION
// ══════════════════════════════════════════
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ══════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit-btn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('contact-name-input').value.trim();
  const email = document.getElementById('contact-email-input').value.trim();
  const message = document.getElementById('contact-message-input').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate send
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
    showToast('Message sent! I\'ll get back to you soon 🙌', 'success');
  }, 1800);
});

// ── Toast notification ──
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '1rem 1.5rem',
    background: type === 'success' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : '#ef4444',
    color: type === 'success' ? '#000' : '#fff',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    zIndex: '9999',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'toastIn 0.4s ease',
    maxWidth: '340px',
  });

  // Inject keyframes if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastIn { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
      @keyframes toastOut { from { transform: translateY(0); opacity:1; } to { transform: translateY(20px); opacity:0; } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
