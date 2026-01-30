/* Luxury Tabbed Gallery + FLIP filter glide + scroll reveal + lazy loading
   Works as clean static JS (no bundler).
*/

const YEAR = new Date().getFullYear();
const yearEls = document.querySelectorAll("#year");
yearEls.forEach(el => el.textContent = YEAR);

const GOLD = "#D4AF37";

const GALLERY_DATA = {
  categories: [
    { key: "weddings", label: "Weddings" },
    { key: "corporate", label: "Corporate" },
    { key: "concerts", label: "Concerts" },
    { key: "social", label: "Social" }
  ],
  events: [
    {
      id: 1,
      category: "weddings",
      badge: "Wedding",
      title: "The Royal Gala",
      desc: "Ivory florals, gold detailing, and a modern live-station experience.",
      cover: "assets/gallery/weddings/royal-gala/cover.jpg",
      subtitle: "A midnight-luxe reception with editorial plating and regal service.",
      body: [
        "Designed as a high-fashion editorial in motion—minimal lines, golden accents, and immaculate pacing.",
        "From the welcome canapés to the final dessert reveal, every moment was engineered for elegance and ease."
      ],
      notes: ["Gold-accent counters", "Live chaat & tandoor", "Editorial buffet geometry"],
      media: [
        { type: "image", src: "assets/gallery/weddings/royal-gala/01.jpg", alt: "Royal Gala 01" },
        { type: "image", src: "assets/gallery/weddings/royal-gala/02.jpg", alt: "Royal Gala 02" },
        { type: "video", embed: "https://www.youtube.com/embed/ScMzIvxBSi4" }
      ]
    },
    {
      id: 2,
      category: "weddings",
      badge: "Wedding",
      title: "Ivory Elegance",
      desc: "Soft white palette, restrained décor, and signature plating in warm light.",
      cover: "assets/gallery/weddings/ivory-elegance/cover.jpg",
      subtitle: "A ceremony lunch curated with quiet luxury and refined hospitality.",
      body: [
        "A calm, luminous setting anchored by ivory textures and subtle metallic highlights.",
        "The menu flowed as a narrative—light starters, comforting mains, and a dessert finale."
      ],
      notes: ["Minimal décor", "Warm service flow", "Seasonal plating"],
      media: [
        { type: "image", src: "assets/gallery/weddings/ivory-elegance/01.jpg", alt: "Ivory Elegance 01" },
        { type: "image", src: "assets/gallery/weddings/ivory-elegance/02.jpg", alt: "Ivory Elegance 02" }
      ]
    },
    {
      id: 3,
      category: "corporate",
      badge: "Corporate",
      title: "The Executive Launch",
      desc: "Clean counters, on-time service, premium bites—built for leaders and press.",
      cover: "assets/gallery/corporate/executive-launch/cover.jpg",
      subtitle: "A polished product reveal with elegant finger food and seamless logistics.",
      body: [
        "Precision execution—from arrival to final clearing—ensured the brand remained center stage.",
        "Our stations were designed for speed and sophistication, keeping queues effortless."
      ],
      notes: ["Fast service", "Minimal setup", "Premium canapés"],
      media: [
        { type: "image", src: "assets/gallery/corporate/executive-launch/01.jpg", alt: "Executive Launch 01" },
        { type: "video", embed: "https://www.youtube.com/embed/ysz5S6PUM-U" }
      ]
    },
    {
      id: 4,
      category: "concerts",
      badge: "Concert",
      title: "The Spotlight Night",
      desc: "Dramatic counters, bold lighting, and high-energy crowd service.",
      cover: "assets/gallery/concerts/spotlight-night/cover.jpg",
      subtitle: "A concert evening crafted for pace, drama, and cinematic flavor.",
      body: [
        "Dark palette, spotlight plating, and a menu built for quick delight between sets.",
        "The live stations became the visual heartbeat of the lounge."
      ],
      notes: ["High throughput", "Bold lighting", "Crowd-friendly bites"],
      media: [
        { type: "image", src: "assets/gallery/concerts/spotlight-night/01.jpg", alt: "Spotlight Night 01" },
        { type: "image", src: "assets/gallery/concerts/spotlight-night/02.jpg", alt: "Spotlight Night 02" }
      ]
    },
    {
      id: 5,
      category: "social",
      badge: "Social",
      title: "Golden Anniversary",
      desc: "Warm hospitality, intimate layout, and a dessert flambé finale.",
      cover: "assets/gallery/social/golden-anniversary/cover.jpg",
      subtitle: "A family celebration with refined comfort and timeless charm.",
      body: [
        "An intimate gathering designed around conversation and comfort—elevated with a premium finish.",
        "The final dessert flambé became a signature moment for guests."
      ],
      notes: ["Intimate service", "Comfort-luxe menu", "Dessert flambé"],
      media: [
        { type: "image", src: "assets/gallery/social/golden-anniversary/01.jpg", alt: "Golden Anniversary 01" },
        { type: "image", src: "assets/gallery/social/golden-anniversary/02.jpg", alt: "Golden Anniversary 02" }
      ]
    }
  ]
};

const tabsEl = document.querySelector(".tabs");
const gridEl = document.getElementById("eventsGrid");
const resultsCountEl = document.getElementById("resultsCount");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createTabButton({ key, label }, selectedKey){
  const btn = document.createElement("button");
  btn.className = "tab-btn";
  btn.type = "button";
  btn.role = "tab";
  btn.dataset.key = key;
  btn.setAttribute("aria-selected", key === selectedKey ? "true" : "false");
  btn.textContent = label;
  btn.addEventListener("click", () => selectCategory(key));
  return btn;
}

function cardTemplate(evt){
  const card = document.createElement("article");
  card.className = "event-card reveal";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open ${evt.title}`);
  card.dataset.id = String(evt.id);

  card.innerHTML = `
    <div class="card-media">
      <span class="card-badge"><span class="badge-dot"></span>${evt.badge}</span>
      <div class="card-overlay" aria-hidden="true"></div>

      <!-- Lazy image: data-src becomes src when near viewport -->
      <img
        alt="${escapeHtml(evt.title)} cover"
        data-src="${evt.cover}"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        width="1200"
        height="750"
      />
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(evt.title)}</h3>
      <p class="card-desc">${escapeHtml(evt.desc)}</p>
    </div>
  `;

  const go = () => {
    window.location.href = `event-detail.html?id=${encodeURIComponent(evt.id)}`;
  };
  card.addEventListener("click", go);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });

  return card;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* -----------------------
   Scroll reveal (cards)
------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries){
    if (entry.isIntersecting){
      entry.target.classList.add("is-revealed");
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.18 });

function observeReveals(){
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

/* -----------------------
   Lazy loading (images)
------------------------ */
const lazyObserver = new IntersectionObserver((entries) => {
  for (const entry of entries){
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    const src = img.getAttribute("data-src");
    if (src){
      img.src = src;
      img.removeAttribute("data-src");
    }
    lazyObserver.unobserve(img);
  }
}, { rootMargin: "500px 0px" });

function observeLazyImages(){
  document.querySelectorAll("img[data-src]").forEach(img => lazyObserver.observe(img));
}

/* -----------------------
   FLIP animation
   (Filter glide on tab switch)
------------------------ */
function getCardRects(){
  const rects = new Map();
  gridEl.querySelectorAll(".event-card").forEach(el => rects.set(el.dataset.id, el.getBoundingClientRect()));
  return rects;
}

function playFLIP(prevRects){
  if (prefersReducedMotion) return;

  const nextRects = getCardRects();
  gridEl.querySelectorAll(".event-card").forEach(el => {
    const id = el.dataset.id;
    const prev = prevRects.get(id);
    const next = nextRects.get(id);
    if (!prev || !next) return;

    const dx = prev.left - next.left;
    const dy = prev.top - next.top;

    if (dx === 0 && dy === 0) return;

    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 1 },
        { transform: "translate(0, 0)", opacity: 1 }
      ],
      { duration: 420, easing: "cubic-bezier(.2,.9,.2,1)" }
    );
  });
}

/* -----------------------
   Render + Tab switching
------------------------ */
let activeCategory = "weddings";

function renderTabs(){
  tabsEl.innerHTML = "";
  for (const cat of GALLERY_DATA.categories){
    tabsEl.appendChild(createTabButton(cat, activeCategory));
  }
}

function setSelectedTab(categoryKey){
  tabsEl.querySelectorAll(".tab-btn").forEach(btn => {
    btn.setAttribute("aria-selected", btn.dataset.key === categoryKey ? "true" : "false");
  });
}

function renderEvents(categoryKey){
  const events = GALLERY_DATA.events.filter(e => e.category === categoryKey);

  resultsCountEl.textContent = `${events.length} event${events.length === 1 ? "" : "s"} • ${labelFor(categoryKey)}`;

  // Capture positions for FLIP before DOM changes
  const prevRects = getCardRects();

  // Clear + rebuild
  gridEl.innerHTML = "";

  // Insert cards
  events.forEach((evt, idx) => {
    const card = cardTemplate(evt);
    gridEl.appendChild(card);

    // stagger fade-in
    requestAnimationFrame(() => {
      const delay = prefersReducedMotion ? 0 : Math.min(idx * 55, 240);
      setTimeout(() => card.classList.add("is-visible"), delay);
    });
  });

  // After layout settles, play FLIP
  requestAnimationFrame(() => {
    playFLIP(prevRects);
    observeReveals();
    observeLazyImages();
  });
}

function labelFor(key){
  return (GALLERY_DATA.categories.find(c => c.key === key)?.label) || key;
}

function selectCategory(categoryKey){
  if (categoryKey === activeCategory) return;

  setSelectedTab(categoryKey);

  // subtle fade between categories
  if (!prefersReducedMotion){
    gridEl.animate(
      [{ opacity: 0.35 }, { opacity: 1 }],
      { duration: 260, easing: "ease-out" }
    );
  }

  activeCategory = categoryKey;
  renderEvents(activeCategory);
}

/* Init */
(function init(){
  // Allow deep-linking: gallery.html?cat=corporate
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat && GALLERY_DATA.categories.some(c => c.key === cat)) activeCategory = cat;

  renderTabs();
  renderEvents(activeCategory);
})();
