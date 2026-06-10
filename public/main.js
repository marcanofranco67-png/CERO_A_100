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
   - Usa aria-expanded para comunicar estado a lectores de pantalla
   - Usa el atributo `hidden` (no display:none via CSS) para que
     el contenido sea realmente inaccesible cuando está cerrado
   - Cierra con Escape (WCAG 2.1.2)
   - Atrapa el foco dentro del menú cuando está abierto (focus trap)
============================================================ */
function initMobileMenu() {
  const toggle  = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (!toggle || !mobileNav) return;

  /** Abre el menú y actualiza el estado ARIA */
  function openMenu() {
    mobileNav.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    // Foco al primer link del menú
    if (mobileLinks.length) mobileLinks[0].focus();
  }

  /** Cierra el menú y devuelve el foco al botón que lo abrió */
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

  // Cerrar con Escape — WCAG 2.1.2 (No Keyboard Trap)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Cerrar al hacer click en un link del menú móvil
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar si se hace click fuera del menú
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
   - Usa IntersectionObserver (API moderna, sin scroll listeners)
   - Respeta prefers-reduced-motion: si el usuario prefiere no
     animaciones, marca los elementos como visibles sin animación
   - No bloquea el hilo principal
============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  // Si el usuario prefiere movimiento reducido, mostramos todo sin animar
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
          // Una vez visible, dejamos de observar — ahorra memoria
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,        // Elemento 12% visible antes de animar
      rootMargin: '0px 0px -40px 0px', // Margen inferior para suavizar
    }
  );

  revealElements.forEach(el => observer.observe(el));
}


/* ============================================================
   MÓDULO 3: HEADER SCROLL
   Ajusta el header al hacer scroll.
   - Solo modifica clases CSS, nunca estilos inline
   - Usa requestAnimationFrame para no bloquear el hilo de render
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
  }, { passive: true }); // passive:true mejora el rendimiento del scroll
}


/* ============================================================
   MÓDULO 4: NAVEGACIÓN ACTIVA
   Marca el link del nav correspondiente a la sección visible.
   - Usa IntersectionObserver, no scroll listeners costosos
   - Actualiza aria-current="page" para lectores de pantalla
     (WCAG 4.1.2 — Name, Role, Value)
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
          // aria-current comunica la sección activa a lectores de pantalla
          if (isActive) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    {
      threshold: 0.4, // Sección debe ser 40% visible para considerarse activa
      rootMargin: '-80px 0px 0px 0px', // Compensa el header fijo
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ============================================================
   MÓDULO 5: SMOOTH SCROLL ACCESIBLE
   El CSS scroll-behavior:smooth ya maneja esto para la mayoría.
   Este módulo añade soporte para navegadores sin CSS smooth scroll
   y gestiona el foco correctamente al navegar por anclas.
   - Mueve el foco al heading de la sección destino (WCAG 2.4.3)
   - Esto es esencial para usuarios de lectores de pantalla
============================================================ */
function initAccessibleAnchorNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      // Encontrar el primer encabezado dentro de la sección destino
      // para moverle el foco — fundamental para usuarios de teclado
      const heading = target.querySelector('h1, h2, h3, [tabindex]');

      if (heading) {
        // tabindex="-1" permite recibir foco programático sin afectar tab order
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        // Delay mínimo para que el scroll termine antes de mover el foco
        setTimeout(() => heading.focus({ preventScroll: false }), 100);
      }
    });
  });
}


/* ============================================================
   PUNTO DE ENTRADA — DOMContentLoaded
   Inicializamos todos los módulos cuando el DOM está listo.
   No esperamos a que carguen imágenes (no es necesario aquí).
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initHeaderScroll();
  initActiveNav();
  initAccessibleAnchorNav();
});
