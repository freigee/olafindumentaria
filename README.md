# OLAF · Guía de edición y publicación

Hola. Esta guía está escrita para que puedas editar y publicar tu web sin necesitar conocimientos técnicos. Seguí los pasos en orden.

---

## ¿Cómo abrir la web en tu computadora?

1. Hacé doble clic en el archivo `index.html`.
2. Se abre en tu navegador. Eso es todo.

> Si algo no se ve, probá con Chrome o Edge.

---

## ¿Cómo subir la web a Hostinger?

1. Iniciá sesión en [hPanel de Hostinger](https://hpanel.hostinger.com).
2. Entrá a **Administrador de archivos** → carpeta `public_html`.
3. **Subí toda la carpeta** `olaf-web/` (o su contenido directamente dentro de `public_html`).  
   La estructura tiene que quedar así:
   ```
   public_html/
   ├── index.html
   ├── styles.css
   ├── main.js
   ├── .htaccess
   ├── lib/
   │   ├── gsap.min.js
   │   ├── ScrollTrigger.min.js
   │   └── manifest.js
   └── assets/
       ├── img/
       └── credits.json
   ```
4. Listo. Abrí tu dominio en el navegador y la web aparece.

---

## ¿Cómo editar los textos y datos del local?

Abrí el archivo `lib/manifest.js` con el **Bloc de notas** (clic derecho → Abrir con → Bloc de notas).

Ahí vas a encontrar todos los datos editables. Solo cambiá el texto que está **entre comillas**, así:

```
name: "OLAF",     ← cambiá "OLAF" por el nombre que quieras
phone: "43556868", ← cambiá por tu teléfono
```

**No toques** los dos puntos `:`, las comas `,` ni las llaves `{ }`.

### Qué podés cambiar:

| Qué | Dónde en manifest.js |
|-----|----------------------|
| Nombre del local | `brand.name` |
| Eslogan | `brand.tagline` |
| Dirección | `brand.address` |
| Teléfono | `brand.phone` |
| WhatsApp | `brand.whatsapp` |
| Instagram | `brand.instagram` |
| Horarios | `brand.hours` |
| Marcas del carrusel | sección `brands: [...]` |

---

## ¿Cómo cambiar el número de WhatsApp?

El número de WhatsApp aparece en **dos lugares**:

1. **`lib/manifest.js`** → cambiá `brand.whatsapp: "+5411675950533"` por tu número con el código de país (+54 para Argentina).

2. **`index.html`** → Abrilo con el Bloc de notas y usá `Ctrl+H` (Buscar y reemplazar). Buscá `5411675950533` y reemplazá por tu número sin el `+`.

---

## ¿Cómo agregar los logos de las marcas?

1. Guardá cada logo PNG dentro de la carpeta `assets/img/logos/` con estos nombres exactos:

   | Archivo | Marca |
   |---------|-------|
   | `levis.png` | Levi's |
   | `rusty.png` | Rusty |
   | `hangloose.png` | Hang Loose |
   | `mistral.png` | Mistral |
   | `santabohemia.png` | Santa Bohemia |

2. Los logos de fondo oscuro (Rusty, Hang Loose, Santa Bohemia) se muestran en blanco automáticamente.
3. Si un archivo no existe, el espacio del logo desaparece solo — no aparece ninguna imagen rota.

---

## ¿Cómo reemplazar las fotos?

1. Tomá tus fotos del local (cuanto más grandes, mejor — mínimo 1200px de ancho).
2. Renombralas exactamente así:
   - `hero-bg.jpg` → foto principal del local o de ropa (va de fondo en el hero)
   - `local-01.jpg`, `local-02.jpg`, `local-03.jpg` → fotos del interior
   - `collection.jpg` → foto editorial para la sección "Encontrá tu próximo look"
   - `gallery-01.jpg` hasta `gallery-16.jpg` → fotos para la galería
3. Copiá las fotos dentro de la carpeta `assets/img/`.
4. Subí la carpeta actualizada a Hostinger.

> **Consejo:** Usá fotos en formato JPG. Si tenés fotos en HEIC (iPhone), convertílas primero en [cloudconvert.com](https://cloudconvert.com).

---

## ¿Por qué no veo los cambios después de subir?

El navegador a veces guarda la versión vieja de la web. Probá esto:

- **Windows:** `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- O abrí una pestaña de incógnito.

Si en Hostinger tampoco se actualiza, abrí `index.html` con el Bloc de notas, buscá `?v=20260630` y cambialo por la fecha de hoy, por ejemplo `?v=20260701`. Guardá y volvé a subir el archivo.

---

## Estructura de archivos

```
olaf-web/
├── index.html         ← página principal (no tocar salvo cambios de WhatsApp)
├── styles.css         ← estilos visuales (no tocar)
├── main.js            ← animaciones y lógica (no tocar)
├── .htaccess          ← configuración del servidor (no tocar)
├── README.md          ← este archivo
├── lib/
│   ├── gsap.min.js        ← librería de animaciones (no tocar)
│   ├── ScrollTrigger.min.js ← librería de scroll (no tocar)
│   └── manifest.js        ← ← ← EDITÁ ESTE para cambiar textos y datos
└── assets/
    ├── img/           ← ← ← PONÉ ACÁS tus fotos
    └── credits.json   ← créditos de imágenes
```

---

## Soporte

Si algo no funciona, escribime y lo resolvemos.

© 2026 OLAF · Florencio Varela
