// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Mouse Spotlight Effect
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.setProperty('--mouse-x', x);
    document.body.style.setProperty('--mouse-y', y);
  });

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
});
