/* Event Detail Page: reads ?id=, injects hero + text + masonry media, with lazy loading + reveal. */

const YEAR = new Date().getFullYear();
document.querySelectorAll("#year").forEach(el => el.textContent = YEAR);

// Keep the data source consistent with gallery.js.
// In a real project, you might move this into a shared file (assets/js/data.js).
const DATA = (function(){
  // Minimal duplication for “clean files” setup.
  // If you prefer shared data: create assets/js/data.js and load it on both pages.
  return {
    events: [
      {
        id: 1,
        categoryLabel: "Weddings",
        title: "The Royal Gala",
        subtitle: "A midnight-luxe reception with editorial plating and regal service.",
        cover: "assets/gallery/weddings/royal-gala/cover.jpg",
        body: [
          "Designed as a high-fashion editorial in motion—minimal lines, golden accents, and immaculate pacing.",
          "From the welcome canapés to the final dessert reveal, every moment was engineered for elegance and ease.",
          "Live counters were styled like a modern court—refined, interactive, and effortless."
        ],
        notes: ["Gold-accent counters", "Live chaat & tandoor", "Editorial buffet geometry", "Soft white florals"],
        media: [
          { type: "image", src: "assets/gallery/weddings/royal-gala/01.jpg", alt: "Royal Gala 01" },
          { type: "image", src: "assets/gallery/weddings/royal-gala/02.jpg", alt: "Royal Gala 02" },
          { type: "image", src: "assets/gallery/weddings/royal-gala/03.jpg", alt: "Royal Gala 03" },
          { type: "video", embed: "https://www.youtube.com/embed/ScMzIvxBSi4" }
        ]
      },
      {
        id: 2,
        categoryLabel: "Weddings",
        title: "Ivory Elegance",
        subtitle: "A ceremony lunch curated with quiet luxury and refined hospitality.",
        cover: "assets/gallery/weddings/ivory-elegance/cover.jpg",
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
        categoryLabel: "Corporate",
        title: "The Executive Launch",
        subtitle: "A polished product reveal with elegant finger food and seamless logistics.",
        cover: "assets/gallery/corporate/executive-launch/cover.jpg",
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
        categoryLabel: "Concerts",
        title: "The Spotlight Night",
        subtitle: "A concert evening crafted for pace, drama, and cinematic flavor.",
        cover: "assets/gallery/concerts/spotlight-night/cover.jpg",
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
        categoryLabel: "Social",
        title: "Golden Anniversary",
        subtitle: "A family celebration with refined comfort and timeless charm.",
        cover: "assets/gallery/social/golden-anniversary/cover.jpg",
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
})();

const params = new URLSearchParams(window.location.search);
const idRaw = params.get("id");
const id = Number(idRaw);

const event = DATA.events.find(e => e.id === id);

const heroBg = document.getElementById("heroBg");
const eventCategory = document.getElementById("eventCategory");
const eventTitle = document.getElementById("eventTitle");
const eventSubtitle = document.getElementById("eventSubtitle");
const eventBody = document.getElementById("eventBody");
const eventNotes = document.getElementById("eventNotes");
const masonry = document.getElementById("masonry");

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function renderNotFound(){
  eventTitle.textContent = "Event Not Found";
  eventSubtitle.textContent = "The event ID is missing or doesn’t exist.";
  eventCategory.textContent = "Gallery";
  heroBg.style.backgroundImage = "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))";
  eventBody.innerHTML = `<p>Please go back to the gallery and choose an event.</p>`;
}

function renderEvent(e){
  document.title = `${e.title} | Narula`;

  eventCategory.textContent = e.categoryLabel;
  eventTitle.textContent = e.title;
  eventSubtitle.textContent = e.subtitle || "";

  heroBg.style.backgroundImage = `url('${e.cover}')`;

  eventBody.innerHTML = e.body.map(p => `<p>${escapeHtml(p)}</p>`).join("");

  eventNotes.innerHTML = (e.notes || [])
    .map(n => `<li>${escapeHtml(n)}</li>`)
    .join("");

  masonry.innerHTML = "";

  for (const item of e.media){
    const wrap = document.createElement("div");
    wrap.className = "masonry-item";

    if (item.type === "image"){
      wrap.innerHTML = `
        <img
          alt="${escapeHtml(item.alt || e.title)}"
          data-src="${item.src}"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
          width="1400"
          height="900"
        />
      `;
    } else if (item.type === "video"){
      wrap.innerHTML = `
        <div class="embed" aria-label="Video embed">
          <iframe
            src="${item.embed}"
            title="${escapeHtml(e.title)} video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      `;
    }

    masonry.appendChild(wrap);
  }

  observeLazy();
}

/* Lazy loading for images on detail page */
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
}, { rootMargin: "600px 0px" });

function observeLazy(){
  document.querySelectorAll("img[data-src]").forEach(img => lazyObserver.observe(img));
}

/* Init */
if (!event || !Number.isFinite(id)){
  renderNotFound();
} else {
  renderEvent(event);
}
