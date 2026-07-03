/* ============================================================
   OLAF · MAIN.JS — IIFE, sin módulos, sin build
   ============================================================ */
(function () {
  'use strict';

  /* ── SAFE WRAPPER ──────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn('[OLAF] ' + name + ' falló:', e); }
  }

  /* ── ESPERAR DOM ───────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {

    /* ── 1. SPLASH ───────────────────────────────────────── */
    safe(function initSplash() {
      var splash = document.getElementById('splash');
      if (!splash) return;
      // JS safety net: ocultar a los 4.2s (CSS ya lo hace a 4.5s)
      setTimeout(function () {
        splash.classList.add('hidden');
      }, 4200);
    }, 'splash');

    /* ── 2. NAV scroll ───────────────────────────────────── */
    safe(function initNav() {
      var nav = document.getElementById('nav');
      if (!nav) return;
      var onScroll = function () {
        nav.classList.toggle('nav--scrolled', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // Burger
      var burger = document.getElementById('navBurger');
      var menu   = document.getElementById('navMenu');
      var close  = document.getElementById('navClose');
      if (!burger || !menu) return;

      function openMenu() {
        menu.hidden = false;
        burger.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        menu.hidden = true;
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      burger.addEventListener('click', openMenu);
      if (close) close.addEventListener('click', closeMenu);

      menu.querySelectorAll('.nav__overlay-link, .nav__overlay-wa').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }, 'nav');

    /* ── 3. CURSOR ───────────────────────────────────────── */
    safe(function initCursor() {
      // Solo en dispositivos con hover real
      if (!window.matchMedia('(hover: hover)').matches) return;

      var cursor = document.getElementById('cursor');
      var ring   = cursor && cursor.querySelector('.cursor-ring');
      var label  = cursor && cursor.querySelector('.cursor-label');
      if (!cursor || !ring) return;

      var mx = window.innerWidth / 2;
      var my = window.innerHeight / 2;
      var cx = mx; var cy = my;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
      });

      (function raf() {
        cx += (mx - cx) * 0.14;
        cy += (my - cy) * 0.14;
        cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        requestAnimationFrame(raf);
      })();

      // Etiquetas contextuales
      document.querySelectorAll('[data-cursor]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cursor.classList.add('cursor--active');
          if (label) label.textContent = el.dataset.cursor;
        });
        el.addEventListener('mouseleave', function () {
          cursor.classList.remove('cursor--active');
          if (label) label.textContent = '';
        });
      });
    }, 'cursor');

    /* ── 4. GSAP + ScrollTrigger ─────────────────────────── */
    safe(function initGSAP() {
      if (typeof gsap === 'undefined') return;
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Reveal titles con GSAP
      document.querySelectorAll('.reveal[data-split]').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: .9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
              onEnter: function () { el.classList.add('is-visible'); }
            }
          }
        );
      });

      // form fields reveal
      document.querySelectorAll('.form-field.reveal').forEach(function (el, i) {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: .7, delay: i * .08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          }
        );
      });

      // Nav logo entrada
      gsap.fromTo('#nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 4.4, ease: 'power3.out' });

      // Hero content entrada
      var heroItems = document.querySelectorAll('.hero__content > *');
      gsap.fromTo(heroItems,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: .12, duration: 1, delay: 4.6, ease: 'power3.out' }
      );

    }, 'gsap');

    /* ── 5. MARCAS CARRUSEL horizontal ──────────────────── */
    safe(function initMarcas() {
      var track = document.getElementById('marcasTrack');
      var wrap  = document.getElementById('marcasWrap');
      var numEl = document.getElementById('marcasCurrentNum');
      if (!track || !wrap) return;

      var cards = Array.from(track.querySelectorAll('.marca-card'));
      var total = cards.length;
      var currentIdx = 0;

      function updateNum(i) {
        if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
      }

      var isDesktop = window.innerWidth > 768;

      if (isDesktop && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        gsap.registerPlugin(ScrollTrigger);

        var scrollDist = (total - 1) * window.innerWidth;

        gsap.to(track, {
          x: -scrollDist,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: '+=' + scrollDist,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: function (self) {
              var idx = Math.min(total - 1, Math.round(self.progress * (total - 1)));
              if (idx !== currentIdx) {
                currentIdx = idx;
                updateNum(idx);
                cards.forEach(function (c, ci) {
                  c.classList.toggle('is-drawn', ci <= idx);
                });
              }
            }
          }
        });

        if (cards[0]) cards[0].classList.add('is-drawn');

      } else {
        // Móvil: cards estáticas apiladas, scroll vertical normal
        cards.forEach(function (c) { c.classList.add('is-drawn'); });
      }

    }, 'marcas');

    /* ── 6. REVEAL FALLBACK (IntersectionObserver) ───────── */
    safe(function initReveal() {
      // Actúa sobre elementos .reveal que no tengan [data-split] (los manejó GSAP)
      // o cuando GSAP no esté disponible
      var revealEls = document.querySelectorAll('.reveal:not([data-split])');

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });

      revealEls.forEach(function (el) { io.observe(el); });

      // Safety timeout 6s: revelar todo lo que quede oculto
      setTimeout(function () {
        document.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.add('is-visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }, 6000);
    }, 'reveal');

    /* ── 7. TILT card (Nueva Colección) ─────────────────── */
    safe(function initTilt() {
      var card = document.getElementById('nuevaTilt');
      if (!card || !window.matchMedia('(hover: hover)').matches) return;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top  + rect.height / 2;
        var rx = (e.clientY - cy) / (rect.height / 2) * -6;
        var ry = (e.clientX - cx) / (rect.width  / 2) *  6;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    }, 'tilt');

    /* ── 8. FORMULARIO → WhatsApp ────────────────────────── */
    safe(function initForm() {
      var form = document.getElementById('contactForm');
      if (!form) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre   = (form.querySelector('#fNombre')   || {}).value || '';
        var telefono = (form.querySelector('#fTelefono') || {}).value || '';
        var email    = (form.querySelector('#fEmail')    || {}).value || '';
        var mensaje  = (form.querySelector('#fMensaje')  || {}).value || '';

        if (!nombre.trim() || !mensaje.trim()) {
          alert('Por favor completá tu nombre y mensaje.');
          return;
        }

        var text = encodeURIComponent(
          '¡Hola OLAF! 👋\n' +
          'Nombre: '   + nombre   + '\n' +
          (telefono ? 'Tel: ' + telefono + '\n' : '') +
          (email    ? 'Email: ' + email  + '\n' : '') +
          'Consulta: ' + mensaje
        );

        var wa = (window.__OLAF__ && window.__OLAF__.brand && window.__OLAF__.brand.whatsapp)
          ? window.__OLAF__.brand.whatsapp.replace(/\D/g, '')
          : '5411675950533';

        window.open('https://wa.me/' + wa + '?text=' + text, '_blank', 'noopener');
      });
    }, 'form');

    /* ── 9. SVG LINE-ART DRAW on scroll ─────────────────── */
    safe(function initSvgDraw() {
      var svgGroups = document.querySelectorAll('.brand-svg__lines');

      // Calcular y asignar stroke-dasharray real a cada path
      svgGroups.forEach(function (g) {
        Array.from(g.querySelectorAll('path, rect, ellipse, circle, line, polyline')).forEach(function (el) {
          try {
            var len = el.getTotalLength ? el.getTotalLength() : 200;
            el.style.strokeDasharray  = len;
            el.style.strokeDashoffset = len;
          } catch (_) {
            el.style.strokeDasharray  = '500';
            el.style.strokeDashoffset = '500';
          }
        });
      });

      // Activar con IO cuando la tarjeta entra en viewport
      var cards = document.querySelectorAll('.marca-card');
      var svgIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add('is-drawn');
              var lines = entry.target.querySelectorAll('.brand-svg__lines path, .brand-svg__lines rect, .brand-svg__lines ellipse, .brand-svg__lines circle, .brand-svg__lines line');
              lines.forEach(function (el, i) {
                el.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.16,1,.3,1) ' + (i * 0.06) + 's';
                el.style.strokeDashoffset = '0';
              });
            }, 200);
          }
        });
      }, { threshold: 0.3 });

      cards.forEach(function (c) { svgIO.observe(c); });
    }, 'svgDraw');

    /* ── 10. GALLERY — inject real images from manifest ──── */
    safe(function initGallery() {
      if (!window.__OLAF__ || !window.__OLAF__.gallery) return;
      var items = window.__OLAF__.gallery;
      var lanes = [
        document.getElementById('galleryLane1'),
        document.getElementById('galleryLane2'),
        document.getElementById('galleryLane3')
      ];

      // Distribuir imágenes entre carriles (si existen archivos reales)
      items.forEach(function (item, i) {
        var lane = lanes[i % lanes.length];
        if (!lane) return;

        var div = document.createElement('div');
        div.className = 'gallery-item';

        var img = document.createElement('img');
        img.src     = item.src;
        img.alt     = item.alt || '';
        img.loading = 'lazy';
        img.onerror = function () {
          // si la imagen no existe, mostrar placeholder
          div.classList.add('gitem--placeholder');
          div.style.setProperty('--hue', String((i * 37) % 360));
          img.style.display = 'none';
        };

        div.appendChild(img);

        // Insertar al principio (la track ya tiene placeholders CSS, los reemplaza)
        if (lane.children.length > 0) {
          lane.insertBefore(div, lane.children[i % Math.max(1, lane.children.length)]);
        } else {
          lane.appendChild(div);
        }
      });
    }, 'gallery');

    /* ── 11. COLECCIONES: enlazar con marcas carousel ────── */
    safe(function initColCards() {
      var colCards = document.querySelectorAll('.col-card[data-brand-id]');
      colCards.forEach(function (card) {
        card.addEventListener('click', function (e) {
          e.preventDefault();
          var brandId = card.dataset.brandId;
          var marcasSection = document.getElementById('marcas');
          if (!marcasSection) return;

          // scroll a la sección marcas
          marcasSection.scrollIntoView({ behavior: 'smooth' });

          // en móvil, hacer scroll al card correspondiente
          var targetCard = document.querySelector('.marca-card[data-brand="' + brandId + '"]');
          if (targetCard) {
            setTimeout(function () {
              targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }, 500);
          }
        });
      });
    }, 'colCards');

    /* ── 12. ANCHOR LINKS suaves ─────────────────────────── */
    safe(function initAnchors() {
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        if (a.classList.contains('nav__overlay-link') ||
            a.classList.contains('col-card')) return; // manejados aparte

        a.addEventListener('click', function (e) {
          var href = a.getAttribute('href');
          if (href === '#') return;
          var target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          var offset = document.getElementById('nav') ? 64 : 0;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
      });
    }, 'anchors');

  }); // ready

})();
