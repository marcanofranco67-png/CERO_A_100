/**
 * ============================================================
 * CERO ABSOLUTO — main.js
 * Arquitectura: Módulos funcionales, sin clases innecesarias.
 * Principio: Cada función hace UNA cosa. Cero efectos secundarios
 * no intencionados. Cero dependencias externas.
 * Accesibilidad: Cada interacción es usable por teclado y AT.
 * ============================================================
 */

'use strict';

/* ============================================================
   MÓDULO 1: MENÚ MÓVIL
   Gestiona el estado abierto/cerrado del nav móvil.
============================================================ */
function initMobileMenu() {
  const toggle  = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (!toggle || !mobileNav) return;

  function openMenu() {
    mobileNav.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    if (mobileLinks.length) mobileLinks[0].focus();
  }

  function closeMenu() {
    mobileNav.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen && !mobileNav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}


/* ============================================================
   MÓDULO 2: SCROLL REVEAL
   Anima elementos al entrar en el viewport.
============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => observer.observe(el));
}


/* ============================================================
   MÓDULO 3: HEADER SCROLL
   Ajusta el header al hacer scroll.
============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');

  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}


/* ============================================================
   MÓDULO 4: NAVEGACIÓN ACTIVA
   Marka el link del nav correspondiente a la sección visible.
============================================================ */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('nav-link--active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    {
      threshold: 0.4,
      rootMargin: '-80px 0px 0px 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ============================================================
   MÓDULO 5: SMOOTH SCROLL ACCESIBLE
   Soporte para navegación por anclas y control de foco.
============================================================ */
function initAccessibleAnchorNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      // EXCEPCIÓN: Si hacemos clic en los botones de "Trabajemos juntos", evitamos el salto
      if (anchor.classList.contains('btn--primary') || anchor.classList.contains('mobile-nav-link--cta')) {
        return; 
      }

      const heading = target.querySelector('h1, h2, h3, [tabindex]');

      if (heading) {
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        setTimeout(() => heading.focus({ preventScroll: false }), 100);
      }
    });
  });
}


/* ============================================================
   MÓDULO 8: GESTIÓN DE MODALES (AUTH & CHECKOUT)
   Controla la aparición de formularios y cambio de tabs.
============================================================ */
function initModals() {
  const authModal = document.getElementById('modal-auth');
  const checkoutModal = document.getElementById('modal-checkout');

  function toggleModal(modal, show) {
    if (!modal) return;
    if (show) modal.removeAttribute('hidden');
    else modal.setAttribute('hidden', '');
  }

  // >>> NUEVO: Conectar enlaces y botones "Trabajemos juntos" con la Modal de Auth <<<
  const actionButtons = document.querySelectorAll('.btn--primary, .mobile-nav-link--cta');
  
  actionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (button.getAttribute('href') === '#contacto') {
        event.preventDefault(); // Evita que salte la pantalla hacia abajo
      }
      toggleModal(authModal, true); // Despliega el panel de registro seguro

      // UX Accesible: Foco al primer input del formulario
      const firstInput = document.getElementById('reg-name');
      if (firstInput) firstInput.focus();
    });
  });

  // Escuchadores para botones de cierre (La X de las modales)
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleModal(authModal, false);
      toggleModal(checkoutModal, false);
    });
  });

  // Lógica de Tabs en Auth (Registrarse / Iniciar Sesión)
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('auth-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('auth-tab--active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => panel.setAttribute('hidden', ''));
      const targetId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.removeAttribute('hidden');
    });
  });
}


/* ============================================================
   PUNTO DE ENTRADA ÚNICO — DOMContentLoaded
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initHeaderScroll();
  initActiveNav();
  initAccessibleAnchorNav();
  initModals(); // Inicialización única y ordenada
});