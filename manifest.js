/* ============================================================
   OLAF · MANIFEST — Editá este archivo con el Bloc de notas
   ============================================================
   IMPORTANTE: no borres los puntos y comas ni las comillas.
   Solo cambiá el texto que está ENTRE comillas "así".
   ============================================================ */

window.__OLAF__ = {

  /* ── DATOS DEL LOCAL ────────────────────────────────────── */
  brand: {
    name:        "OLAF",
    tagline:     "El mejor precio.",
    slogan:      "Vestí Simple.",
    address:     "Bernardo Monteagudo 3045, Florencio Varela",
    addressShort:"Monteagudo 3045 · Florencio Varela",
    phone:       "43556868",
    whatsapp:    "+5491167595053",
    instagram:   "olaf.indumentaria",
    hours:       "Lunes a Sábados · 09:00 → 20:30",
    established: "EST. 1995 · BSAS",
    year:        "1995",
    mapsEmbed:   "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.0!2d-58.2798!3d-34.8067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ4JzI0LjEiUyA1OMKwMTYnNDcuMyJX!5e0!3m2!1ses!2sar!4v1700000000000"
  },

  /* ── MARCAS DEL CARRUSEL (sección 02) ─────────────────── */
  brands: [
    {
      id:          "levis",
      name:        "Levi's",
      category:    "Denim",
      badge:       "Casa",
      icon:        "jeans",
      subtitle:    "El clásico que nunca pasa de moda.",
      products:    ["Jeans", "Camperas", "Remeras", "Camisas"],
      description: "El referente mundial del denim. Prendas resistentes, cómodas y atemporales que forman parte de cualquier guardarropa. Desde jeans icónicos hasta básicos para todos los días.",
      color:       "#3F5F8A",
      accent:      "#C41230"
    },
    {
      id:          "rusty",
      name:        "Rusty",
      category:    "Streetwear",
      badge:       "Casa",
      icon:        "hoodie",
      subtitle:    "Espíritu urbano y surf.",
      products:    ["Buzos", "Remeras", "Bermudas", "Gorras"],
      description: "Diseños relajados inspirados en el surf y la vida urbana. Una marca pensada para quienes buscan comodidad, calidad y un estilo casual para cualquier momento del día.",
      color:       "#59684D",
      accent:      "#E86F2D"
    },
    {
      id:          "hangloose",
      name:        "Hang Loose",
      category:    "Surf Lifestyle",
      badge:       "Temporada",
      icon:        "wave",
      subtitle:    "La esencia del verano todo el año.",
      products:    ["Remeras", "Bermudas", "Mallas", "Buzos"],
      description: "Inspirada en el mar y la naturaleza, combina prendas livianas con un estilo relajado. Ideal para quienes disfrutan de un look fresco y versátil.",
      color:       "#2E9EA5",
      accent:      "#D8B98A"
    },
    {
      id:          "mistral",
      name:        "Mistral",
      category:    "Casual",
      badge:       "Casa",
      icon:        "shirt",
      subtitle:    "Comodidad con identidad.",
      products:    ["Camisas", "Pantalones", "Camperas", "Sweaters"],
      description: "Moda casual con un enfoque moderno. Prendas fáciles de combinar, confeccionadas para acompañar el ritmo diario sin perder elegancia.",
      color:       "#315A6D",
      accent:      "#C49A3A"
    },
    {
      id:          "santabohemia",
      name:        "Santa Bohemia",
      category:    "Premium Casual",
      badge:       "Temporada",
      icon:        "jacket",
      subtitle:    "Diseño, calidad y personalidad.",
      products:    ["Camperas", "Jeans", "Camisas", "Remeras"],
      description: "Una propuesta contemporánea con materiales de calidad y terminaciones cuidadas. Pensada para quienes buscan diferenciarse con un estilo simple pero sofisticado.",
      color:       "#7A5A45",
      accent:      "#C9A35B"
    }
  ],

  /* ── GALERÍA (sección 04) ──────────────────────────────── */
  gallery: [],

  /* ── PRODUCTOS — Google Sheets ──────────────────────────── */
  /* Si cambiás la planilla, reemplazá esta URL por la nueva   */
  sheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-QOrQF9E-DSl1nLB-X2qLmsCdTneAYe83CoM9zc9nQIZmtQLtSgm5STV-F8SjFcrx9Cnyk9mR1SCO/pub?gid=0&single=true&output=csv"

};
