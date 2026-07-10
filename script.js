/* ============================================
   CIRCA2300 — Ultra Premium Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Copyright year ──
  const copyrightEl = document.getElementById('footer-copyright');
  if (copyrightEl) {
    copyrightEl.textContent = `\u00A9 ${new Date().getFullYear()} CIRCA2300 PTY LTD`;
  }

  // ── Split Text Pre-processing ──
  // Wraps lines in <span class="split-line"> for staggered reveal animations
  const splitElements = document.querySelectorAll('.split-text');
  splitElements.forEach(el => {
    const html = el.innerHTML;
    // Split by <br> or <br/>
    const lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    lines.forEach((line, index) => {
      const span = document.createElement('span');
      span.className = 'split-line';
      span.style.transitionDelay = `${index * 0.15}s`;
      span.innerHTML = line;
      el.appendChild(span);
    });
  });

  // ── Custom Cursor ──
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  // Only run cursor logic on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    // Animate outline for smooth trailing effect
    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      
      if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states for links and buttons
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // ── Parallax Scrolling ──
  const parallaxElements = document.querySelectorAll('.parallax');
  let scrolled = 0;
  
  const handleParallax = () => {
    scrolled = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.2;
      // Calculate offset relative to viewport
      const rect = el.parentElement.getBoundingClientRect();
      // Only animate if in or near viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
  };

  // ── Navbar Scroll State ──
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      handleParallax();
      handleNavScroll();
    });
  }, { passive: true });
  
  // Initial calls
  handleParallax();
  handleNavScroll();

  // ── Mobile Menu Toggle ──
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      const lines = hamburger.querySelectorAll('span');
      if (isOpen) {
        lines[0].style.transform = 'translateY(3px) rotate(45deg)';
        lines[1].style.transform = 'translateY(-4px) rotate(-45deg)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        const lines = hamburger.querySelectorAll('span');
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth Scroll for Anchor Links ──
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
      const submitBtn = document.getElementById('form-submit');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Message Sent';
        setTimeout(() => submitBtn.textContent = originalText, 3000);
      }, 1500);
    });
  }
});
