// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Mouse Spotlight & Custom Pointer Coordinates (High Performance Interpolated Loop)
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isInitialMove = true;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isInitialMove) {
      ringX = mouseX;
      ringY = mouseY;
      isInitialMove = false;
    }

    // Spotlight variables
    const xFraction = e.clientX / window.innerWidth;
    const yFraction = e.clientY / window.innerHeight;
    document.body.style.setProperty('--mouse-x', xFraction);
    document.body.style.setProperty('--mouse-y', yFraction);
  });

  const tickCursor = () => {
    // Instant follow for dot (zero latency)
    document.body.style.setProperty('--c-x', `${mouseX}px`);
    document.body.style.setProperty('--c-y', `${mouseY}px`);

    // Damping LERP equation for organic, zero-jitter catch-up (0.16 smoothing factor)
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    document.body.style.setProperty('--r-x', `${ringX}px`);
    document.body.style.setProperty('--r-y', `${ringY}px`);

    requestAnimationFrame(tickCursor);
  };
  tickCursor();

  // Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('.navlink').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }

  // Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to retain visual layout
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealOnScroll.observe(el));

  // Scroll Spy for Navlinks and Active State
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navlink');

  const scrollSpy = () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 120; // accounting for fixed header height + padding offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // run once initially to set starting state

  // Card Clicks - Navigating to primary anchor if clicking anywhere on the card
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If the clicked element is already a link or child of a link, allow normal behavior
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      // Find the first anchor inside the card and click it programmatically
      const link = card.querySelector('a');
      if (link) {
        link.click();
      }
    });
  });

  // Custom Pointer Hover State
  const cursorRing = document.querySelector('.custom-cursor-ring');
  if (cursorRing) {
    const hoverTargets = document.querySelectorAll('a, button, .card, .btn, .skill-tag, input, textarea, .cert-card, .timeline-item');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover');
      });
      target.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hover');
      });
    });
  }

  // Click Splash Ripple Effect
  document.addEventListener('click', (e) => {
    const splash = document.createElement('div');
    splash.className = 'click-splash';
    splash.style.left = `${e.pageX}px`;
    splash.style.top = `${e.pageY}px`;
    document.body.appendChild(splash);

    // Remove element after animation completes to keep DOM clean
    setTimeout(() => {
      splash.remove();
    }, 500);
  });
});
