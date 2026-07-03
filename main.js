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
          : '5491167595053';

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

    /* ── 12. PRODUCTOS desde Google Sheets ──────────────────── */
    safe(function initProductos() {
      var SHEET_URL = window.__OLAF__ && window.__OLAF__.sheetUrl;
      var grid      = document.getElementById('productosGrid');
      var loading   = document.getElementById('productosLoading');
      var filtrosEl = document.getElementById('productosFiltros');
      if (!grid || !SHEET_URL) return;

      var todos = [];

      function fixImg(url) {
        if (!url) return '';
        var m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (m) return 'https://drive.google.com/uc?export=view&id=' + m[1];
        m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (m) return 'https://drive.google.com/uc?export=view&id=' + m[1];
        return url;
      }

      function parseCSV(text) {
        var lines = text.trim().split(/\r?\n/);
        var headers = lines[0].split(',').map(function(h){ return h.trim().replace(/^"|"$/g,'').toLowerCase(); });
        return lines.slice(1).filter(function(l){ return l.trim(); }).map(function(line) {
          var values=[]; var cur=''; var inQ=false;
          for (var i=0;i<line.length;i++) {
            if (line[i]==='"') { inQ=!inQ; }
            else if (line[i]===',' && !inQ) { values.push(cur.trim()); cur=''; }
            else { cur+=line[i]; }
          }
          values.push(cur.trim());
          var obj={};
          headers.forEach(function(h,i){ obj[h]=(values[i]||'').replace(/^"|"$/g,''); });
          return obj;
        });
      }

      function fmtPrecio(p) {
        var n = parseInt(String(p).replace(/\D/g,''),10);
        return isNaN(n) ? '' : '$'+n.toLocaleString('es-AR');
      }

      function crearCard(p) {
        var talles = p.talles ? p.talles.split(',').map(function(t){ return t.trim(); }).filter(Boolean) : [];
        var imgSrc = fixImg(p.imagen);
        var article = document.createElement('article');
        article.className = 'prod-card is-visible';
        article.dataset.categoria = p.categoria || '';
        article.innerHTML =
          '<div class="prod-card__img-wrap'+(imgSrc?'':' no-img')+'">' +
            (imgSrc ? '<img src="'+imgSrc+'" alt="'+p.nombre+'" loading="lazy" onerror="this.parentElement.classList.add(\'no-img\')">' : '') +
            (p.categoria ? '<span class="prod-card__cat mono">'+p.categoria+'</span>' : '') +
          '</div>' +
          '<div class="prod-card__body">' +
            '<h3 class="prod-card__name">'+p.nombre+'</h3>' +
            (fmtPrecio(p.precio) ? '<p class="prod-card__price">'+fmtPrecio(p.precio)+'</p>' : '') +
            (talles.length ? '<div class="prod-card__talles">'+talles.map(function(t){ return '<button class="talle-btn" data-talle="'+t+'">'+t+'</button>'; }).join('')+'</div>' : '') +
            '<button class="btn btn--primary prod-card__add"'+(talles.length?' disabled':'')+' data-nombre="'+p.nombre+'" data-precio="'+(p.precio||'0')+'">' +
              (talles.length ? 'Elegí un talle' : 'Agregar al carrito') +
            '</button>' +
          '</div>';

        article.querySelectorAll('.talle-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            article.querySelectorAll('.talle-btn').forEach(function(b){ b.classList.remove('active'); });
            btn.classList.add('active');
            var addBtn = article.querySelector('.prod-card__add');
            addBtn.disabled = false;
            addBtn.dataset.talle = btn.dataset.talle;
            addBtn.textContent = 'Agregar al carrito';
          });
        });

        article.querySelector('.prod-card__add').addEventListener('click', function(e) {
          var btn = e.currentTarget;
          if (btn.disabled) return;
          window.olafAgregarCarrito({ nombre: btn.dataset.nombre, precio: parseInt(btn.dataset.precio,10)||0, talle: btn.dataset.talle||'' });
          btn.textContent = '✓ Agregado';
          setTimeout(function(){ btn.textContent = 'Agregar al carrito'; }, 1500);
        });

        return article;
      }

      function renderGrid(lista) {
        grid.innerHTML = '';
        if (!lista.length) { grid.innerHTML = '<p class="productos__vacio mono">Sin productos disponibles.</p>'; return; }
        lista.forEach(function(p){ grid.appendChild(crearCard(p)); });
      }

      function buildFiltros(lista) {
        var cats = [];
        lista.forEach(function(p){ if (p.categoria && cats.indexOf(p.categoria)===-1) cats.push(p.categoria); });
        if (cats.length < 2) return;
        cats.forEach(function(cat) {
          var btn = document.createElement('button');
          btn.className='filtro-btn'; btn.dataset.cat=cat; btn.textContent=cat;
          filtrosEl.appendChild(btn);
        });
        filtrosEl.addEventListener('click', function(e) {
          var btn = e.target.closest('.filtro-btn');
          if (!btn) return;
          filtrosEl.querySelectorAll('.filtro-btn').forEach(function(b){ b.classList.remove('filtro-btn--active'); });
          btn.classList.add('filtro-btn--active');
          renderGrid(btn.dataset.cat==='todos' ? todos : todos.filter(function(p){ return p.categoria===btn.dataset.cat; }));
        });
      }

      fetch(SHEET_URL)
        .then(function(r){ return r.text(); })
        .then(function(text) {
          todos = parseCSV(text).filter(function(p){ return p.activo && p.activo.toLowerCase()==='si' && p.nombre; });
          if (loading) loading.remove();
          renderGrid(todos);
          buildFiltros(todos);
        })
        .catch(function() {
          if (loading) loading.innerHTML = '<span class="mono" style="color:var(--muted)">No se pudieron cargar los productos.</span>';
        });
    }, 'productos');

    /* ── 13. CARRITO ─────────────────────────────────────────── */
    safe(function initCarrito() {
      var fab        = document.getElementById('cartFab');
      var panel      = document.getElementById('cartPanel');
      var overlay    = document.getElementById('cartOverlay');
      var closeBtn   = document.getElementById('cartClose');
      var itemsEl    = document.getElementById('cartItems');
      var emptyEl    = document.getElementById('cartEmpty');
      var footerEl   = document.getElementById('cartFooter');
      var totalEl    = document.getElementById('cartTotal');
      var countEl    = document.getElementById('cartCount');
      var checkoutBtn= document.getElementById('cartCheckout');
      var clearBtn   = document.getElementById('cartClear');
      if (!fab || !panel) return;

      var carrito = [];
      try { carrito = JSON.parse(localStorage.getItem('olaf_carrito')||'[]'); } catch(_){}

      function guardar() { try { localStorage.setItem('olaf_carrito', JSON.stringify(carrito)); } catch(_){} }
      function fmt(n) { return '$'+Math.round(n).toLocaleString('es-AR'); }

      function render() {
        itemsEl.querySelectorAll('.cart-item').forEach(function(el){ el.remove(); });
        var total=0; var count=0;
        carrito.forEach(function(item,idx) {
          total += item.precio*item.cantidad;
          count += item.cantidad;
          var div = document.createElement('div');
          div.className='cart-item';
          div.innerHTML =
            '<div class="cart-item__info">' +
              '<span class="cart-item__name">'+item.nombre+'</span>' +
              (item.talle ? '<span class="cart-item__talle mono">Talle '+item.talle+'</span>' : '') +
              '<span class="cart-item__price">'+fmt(item.precio)+'</span>' +
            '</div>' +
            '<div class="cart-item__qty">' +
              '<button class="qty-btn" data-idx="'+idx+'" data-op="-">−</button>' +
              '<span>'+item.cantidad+'</span>' +
              '<button class="qty-btn" data-idx="'+idx+'" data-op="+">+</button>' +
            '</div>' +
            '<button class="cart-item__remove" data-idx="'+idx+'" aria-label="Quitar">✕</button>';
          itemsEl.appendChild(div);
        });
        var hay = carrito.length > 0;
        emptyEl.hidden = hay; footerEl.hidden = !hay; countEl.hidden = !hay;
        if (hay) { totalEl.textContent=fmt(total); countEl.textContent=count; }
      }

      function abrir() { panel.hidden=false; overlay.hidden=false; fab.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
      function cerrar() { panel.hidden=true; overlay.hidden=true; fab.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }

      window.olafAgregarCarrito = function(item) {
        var key = item.nombre+'|'+(item.talle||'');
        var ex = null;
        carrito.forEach(function(i){ if ((i.nombre+'|'+(i.talle||''))===key) ex=i; });
        if (ex) { ex.cantidad++; } else { carrito.push({nombre:item.nombre,precio:item.precio,talle:item.talle||'',cantidad:1}); }
        guardar(); render(); abrir();
      };

      fab.addEventListener('click', function(){ panel.hidden ? abrir() : cerrar(); });
      closeBtn.addEventListener('click', cerrar);
      overlay.addEventListener('click', cerrar);

      itemsEl.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-idx]');
        if (!btn) return;
        var idx = parseInt(btn.dataset.idx,10);
        if (btn.classList.contains('cart-item__remove')) { carrito.splice(idx,1); }
        else if (btn.dataset.op==='+') { carrito[idx].cantidad++; }
        else if (btn.dataset.op==='-') { carrito[idx].cantidad--; if (carrito[idx].cantidad<=0) carrito.splice(idx,1); }
        guardar(); render();
      });

      checkoutBtn && checkoutBtn.addEventListener('click', function() {
        if (!carrito.length) return;
        var wa = (window.__OLAF__&&window.__OLAF__.brand&&window.__OLAF__.brand.whatsapp)
          ? window.__OLAF__.brand.whatsapp.replace(/\D/g,'') : '5491167595053';
        var total = carrito.reduce(function(a,i){ return a+i.precio*i.cantidad; },0);
        var lineas = carrito.map(function(i){ return '• '+i.nombre+(i.talle?' — Talle '+i.talle:'')+' x'+i.cantidad+' → '+fmt(i.precio*i.cantidad); });
        var msg = '¡Hola OLAF! 🛍️ Quiero hacer un pedido:\n\n'+lineas.join('\n')+'\n\n*TOTAL: '+fmt(total)+'*\n\n¿Me confirmás disponibilidad?';
        window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(msg),'_blank','noopener');
      });

      clearBtn && clearBtn.addEventListener('click', function(){ carrito=[]; guardar(); render(); });

      render();
    }, 'carrito');

    /* ── 14. ANCHOR LINKS suaves ─────────────────────────── */
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
