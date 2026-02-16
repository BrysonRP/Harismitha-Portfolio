/* ============================================================
   SCRIPT.JS — Personal Portfolio for Harismitha D
   Features: Theme toggle, scroll spy, hamburger, Intersection
   Observer animations, particle canvas, button ripple.
   ============================================================ */

(() => {
  'use strict';

  /* ---- Always start at the top on page load/reload ---- */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  /* ---- DOM References ---- */
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const allNavAnchors = navLinks.querySelectorAll('a:not(.nav-resume-btn)');
  const sections = document.querySelectorAll('section[id]');

  /* ============================================================
     1. THEME TOGGLE
     ============================================================ */
  const THEME_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialise from stored preference or system preference
  (function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      applyTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  })();

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ============================================================
     2. NAVBAR — SCROLL SHADOW
     ============================================================ */
  function handleNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ============================================================
     3. SCROLL SPY — ACTIVE NAV LINK
     ============================================================ */
  function handleScrollSpy() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        allNavAnchors.forEach((a) => a.classList.remove('active'));
        const match = navLinks.querySelector(`a[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  // Combined scroll handler (throttled via rAF)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavScroll();
        handleScrollSpy();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Fire once on load
  handleNavScroll();
  handleScrollSpy();

  /* ============================================================
     4. HAMBURGER MENU
     ============================================================ */
  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu when ANY nav link is clicked
  allNavAnchors.forEach((a) => a.addEventListener('click', closeMenu));
  const mobileResumeBtn = navLinks.querySelector('.nav-resume-btn');
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', closeMenu);

  /* ============================================================
     5. INTERSECTION OBSERVER — SCROLL ANIMATIONS
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // animate only once

            // After reveal animation finishes, enable fast hover transitions
            if (entry.target.classList.contains('skill-card')) {
              const delay = parseFloat(getComputedStyle(entry.target).transitionDelay) || 0;
              setTimeout(() => {
                entry.target.classList.add('hover-ready');
              }, (delay + 1.5) * 1000);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -120px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: make everything visible
    revealEls.forEach((el) => el.classList.add('active'));
  }

  /* ============================================================
     6. BUTTON RIPPLE EFFECT
     ============================================================ */
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  });


  /* ============================================================
     7. HERO PARTICLE CANVAS
     ============================================================ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor(canvas.width * canvas.height / 10000), 120);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          o: Math.random() * 0.35 + 0.05,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = html.getAttribute('data-theme') === 'dark';
      const color = isDark ? '167, 139, 250' : '99, 102, 241';

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.o})`;
        ctx.fill();
      });

      // Draw faint connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      createParticles();
      draw();
    });
  }

  /* ============================================================
     8. THEME ICON VISIBILITY (CSS handles show/hide via theme)
     ============================================================ */
  // We use CSS only to toggle icon visibility, adding small helper styles
  const themeStyle = document.createElement('style');
  themeStyle.textContent = `
    [data-theme="light"] .icon-sun  { display: none; }
    [data-theme="light"] .icon-moon { display: block; }
    [data-theme="dark"]  .icon-sun  { display: block; }
    [data-theme="dark"]  .icon-moon { display: none; }
  `;
  document.head.appendChild(themeStyle);

})();
