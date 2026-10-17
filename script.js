// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll('section, .profile');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => observer.observe(el));
