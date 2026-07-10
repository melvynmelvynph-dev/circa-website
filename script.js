/* ============================================
   CIRCA2300 — Interactive Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Copyright year ──
  const copyrightEl = document.getElementById('footer-copyright');
  if (copyrightEl) {
    copyrightEl.textContent = `\u00A9 ${new Date().getFullYear()} CIRCA2300 PTY LTD. All rights reserved.`;
  }

  // ── Navbar scroll state ──
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active nav link highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Mobile hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Reveal (Intersection Observer) ──
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Hero floating particles ──
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = 50 + Math.random() * 50 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = 6 + Math.random() * 6 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      particlesContainer.appendChild(p);
    }
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Contact Form Mock Submission ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'ph-warning-circle');
        return;
      }

      const submitBtn = document.getElementById('form-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Sending...';

      // Simulate network delay
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
        showToast(`Thank you, ${name}! We'll be in touch soon.`, 'ph-check-circle');
      }, 1500);
    });
  }

  // ── Toast notification system ──
  function showToast(message, iconClass = 'ph-info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ph-fill ${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }

  // ── Counter animation for stats (on scroll) ──
  const statElements = document.querySelectorAll('.cta-stat strong');
  if (statElements.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            // Only animate numeric values
            if (/^\d+/.test(text)) {
              const target = parseInt(text);
              const suffix = text.replace(/^\d+/, '');
              let current = 0;
              const step = Math.max(1, Math.floor(target / 30));
              const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(interval);
                }
                el.textContent = current + suffix;
              }, 40);
            }
            statObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statElements.forEach(el => statObserver.observe(el));
  }

});
