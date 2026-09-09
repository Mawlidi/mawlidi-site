/* ════════════════════════════════════════════════════════════
   مَوْلِدي — نظام الإعلانات البيتية + ركن الفنان  v1.0
   مبني على نظام «رد المعروف» في 007.gallery و awraqna.com،
   ومُكيَّف على لوحة ألوان مَوْلِدي.

   قاعدة لا تُخرق: لا يُعرض إعلان إلا لرابط مُتحقَّق من عمله.
   أي مشروع لم يُطلق يُترك رابطه "#" فيُستبعَد تلقائياً، وحين
   يُطلق يكفي وضع رابطه هنا فيعود إلى الدورة بلا تعديل آخر.
   ════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  /* ── المواقع المُعلَن عنها — عدّل هنا فقط ─────────────────── */
  const HOUSE = [
    { id:"gallery", url:"https://007.gallery", badge:"٠٠٧ جاليري",
      title_ar:"٠٠٧ جاليري — أدوات صور مجانية",
      title_en:"007.gallery — Free Image Tools",
      body_ar:"إزالة خلفية، تكبير، ضغط، QR — كلها داخل متصفحك.",
      body_en:"Background removal, upscaling, compression, QR — all in your browser.",
      cta_ar:"جرّب الأدوات", cta_en:"Try the tools",
      c1:"#14101f", c2:"#2e2350", accent:"#d4af37" },

    { id:"awraqna", url:"https://awraqna.com", badge:"أوراقنا",
      title_ar:"أوراقنا — أوراق عمل للطباعة مجاناً",
      title_en:"Awraqna — Free Printable Worksheets",
      body_ar:"مواد تعليمية جاهزة للطباعة، بلا اشتراك ولا تسجيل.",
      body_en:"Print-ready teaching materials — no subscription, no sign-up.",
      cta_ar:"حمّل الأوراق", cta_en:"Get the sheets",
      c1:"#0d2118", c2:"#17513a", accent:"#5fd39b" },

    { id:"quran", url:"https://qurankarem.org", badge:"القرآن الكريم",
      title_ar:"مصحف رقمي بتجربة صافية",
      title_en:"A Clean Digital Quran",
      body_ar:"قراءة مريحة بلا إعلانات ولا تشتيت.",
      body_en:"Comfortable reading — no ads, no distractions.",
      cta_ar:"افتح المصحف", cta_en:"Open now",
      c1:"#241f0c", c2:"#5c4a15", accent:"#f0d264" },

    { id:"artist", url:"https://altayebamer.com", badge:"الطيب عامر",
      title_ar:"معرض الفنان الطيب عامر",
      title_en:"Altayeb Amer — Artist Portfolio",
      body_ar:"سبعة مجالات: الخط العربي، البورتريه، الخيل، التصميم، وأكثر.",
      body_en:"Seven galleries: calligraphy, portrait, horses, design and more.",
      cta_ar:"زر المعرض", cta_en:"Visit the gallery",
      c1:"#1a1220", c2:"#452a4e", accent:"#e0a3d8" }
  ];

  /* ── المجالات السبعة في الموقع الشخصي ────────────────────── */
  const GALLERIES = [
    { slug:"calligraphy", icon:"✒️", ar:"الخط العربي",        en:"Calligraphy" },
    { slug:"portrait",    icon:"🎨", ar:"البورتريه الفني",     en:"Fine Art Portrait" },
    { slug:"horses",      icon:"🐎", ar:"الخيل العربية",       en:"Arabian Horses" },
    { slug:"design",      icon:"🖌️", ar:"التصميم البصري",      en:"Visual Design" },
    { slug:"ai",          icon:"🤖", ar:"الذكاء الاصطناعي",    en:"Creative AI" },
    { slug:"photography", icon:"📷", ar:"التطبيقات البصرية",   en:"Visual Applications" },
    { slug:"education",   icon:"📚", ar:"تعليم الفن",          en:"Art Education" }
  ];
  const ARTIST = "https://altayebamer.com";

  const isEn = () => document.documentElement.getAttribute("lang") === "en";

  // إعلان معطوب أسوأ من مساحة فارغة: لا يدخل الدورة إلا رابط حقيقي
  const POOL = HOUSE.filter(a => a.url && a.url !== "#");
  let seed = Math.floor(Math.random() * (POOL.length || 1));
  function pick() { const a = POOL[seed % POOL.length]; seed++; return a; }

  const CSS = `
  .ad-slot{position:relative;border-radius:18px;overflow:hidden;
    margin:30px auto;max-width:760px;
    border:1px solid rgba(255,255,255,0.07);background:#0C0C22}
  .ad-slot .ad-tag{position:absolute;top:9px;inset-inline-start:11px;z-index:3;
    font-size:10px;font-weight:700;letter-spacing:.4px;color:rgba(255,255,255,0.62);
    background:rgba(0,0,0,0.38);padding:3px 9px;border-radius:999px}
  .ad-card{display:flex;align-items:center;gap:18px;padding:22px 22px;height:100%;
    text-decoration:none;transition:filter .22s}
  .ad-card:hover{filter:brightness(1.09)}
  /* الخلفية ترث لون التمييز من البطاقة، والحرف داكن داخل عنصر مستقل.
     ضبط color على العنصر نفسه يجعل currentColor مساوياً للحرف فيختفي. */
  .ad-card .ad-mark{flex:none;width:54px;height:54px;border-radius:14px;
    display:grid;place-items:center;font-weight:900;font-size:14px;
    background:currentColor;box-shadow:0 6px 20px rgba(0,0,0,0.4)}
  .ad-card .ad-mark i{color:#07071A;font-style:normal}
  .ad-card .ad-body{min-width:0;flex:1}
  .ad-card .ad-badge{font-size:11px;font-weight:800;opacity:.92;letter-spacing:.3px}
  .ad-card h4{font-size:18px;font-weight:900;color:#fff;margin:3px 0 5px;
    line-height:1.4;overflow-wrap:break-word}
  .ad-card p{font-size:13.5px;color:rgba(255,255,255,0.78);margin:0;line-height:1.65;
    overflow-wrap:break-word}
  .ad-card .ad-cta{flex:none;font-size:13.5px;font-weight:800;
    background:currentColor;padding:10px 17px;border-radius:11px;white-space:nowrap}
  .ad-card .ad-cta span{color:#07071A}
  .ad-billboard{min-height:230px}
  .ad-billboard .ad-card{flex-direction:column;text-align:center;justify-content:center;gap:14px}
  .ad-billboard h4{font-size:23px}
  .ad-leaderboard{min-height:104px}
  @media(max-width:700px){
    .ad-card{flex-direction:column;text-align:center;gap:13px;padding:22px 18px}
    .ad-billboard h4{font-size:20px}
    .ad-leaderboard{min-height:auto}
  }

  /* ركن الفنان */
  .artist-corner{max-width:760px;margin:34px auto;padding:24px 20px;
    border:1px solid rgba(201,168,76,0.20);border-radius:20px;
    background:linear-gradient(135deg,rgba(201,168,76,0.07),rgba(201,168,76,0.02))}
  .artist-corner .ac-kicker{font-size:11px;letter-spacing:.4px;color:#C9A84C;
    text-align:center;margin-bottom:6px}
  .artist-corner h3{font-size:20px;color:#E8C97A;text-align:center;margin:0 0 6px;
    font-weight:900}
  .artist-corner .ac-sub{font-size:13.5px;color:rgba(240,237,232,0.55);
    text-align:center;line-height:1.75;margin:0 auto 18px;max-width:46ch}
  .ac-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
  .ac-grid a{display:flex;align-items:center;gap:9px;min-width:0;
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);
    border-radius:13px;padding:12px 13px;text-decoration:none;
    color:#F0EDE8;font-size:13.5px;line-height:1.4;transition:border-color .2s}
  .ac-grid a:hover{border-color:rgba(201,168,76,0.45)}
  .ac-grid .ac-i{flex:none;font-size:17px}
  .ac-grid .ac-t{min-width:0;overflow-wrap:break-word}
  .artist-corner .ac-all{display:block;text-align:center;font-size:14px;
    color:#C9A84C;text-decoration:none;padding-top:4px}
  .artist-corner .ac-all:hover{text-decoration:underline}
  @media(min-width:620px){ .ac-grid{grid-template-columns:1fr 1fr 1fr} }
  `;

  function injectCss() {
    if (document.getElementById("ads-css")) return;
    const st = document.createElement("style");
    st.id = "ads-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function renderAd(slot, size) {
    if (!POOL.length) { slot.remove(); return; }
    const a = pick(), en = isEn();
    slot.className = "ad-slot ad-" + size;
    slot.style.background = "linear-gradient(135deg," + a.c1 + "," + a.c2 + ")";
    slot.innerHTML =
      '<span class="ad-tag">' + (en ? "Sponsored" : "إعلان") + '</span>' +
      '<a class="ad-card" href="' + a.url + '" target="_blank" rel="noopener sponsored"' +
      ' data-ad="' + a.id + '" style="color:' + a.accent + '">' +
        '<span class="ad-mark"><i>' + a.badge.slice(0, 2) + '</i></span>' +
        '<span class="ad-body">' +
          '<span class="ad-badge">' + a.badge + '</span>' +
          '<h4>' + (en ? a.title_en : a.title_ar) + '</h4>' +
          '<p>' + (en ? a.body_en : a.body_ar) + '</p>' +
        '</span>' +
        '<span class="ad-cta"><span>' + (en ? a.cta_en : a.cta_ar) + ' ←</span></span>' +
      '</a>';
  }

  function renderArtist(host) {
    const en = isEn();
    host.className = "artist-corner";
    host.innerHTML =
      '<div class="ac-kicker">' + (en ? "THE ARTIST" : "ركن الفنان") + '</div>' +
      '<h3>' + (en ? "Altayeb Amer" : "الفنان الطيب عامر") + '</h3>' +
      '<p class="ac-sub">' + (en
        ? "Seven galleries of work — calligraphy, portraiture, Arabian horses, design, creative AI, visual applications and art education."
        : "سبعة مجالات من العمل الفني — الخط العربي والبورتريه والخيل العربية والتصميم والذكاء الاصطناعي الإبداعي والتطبيقات البصرية وتعليم الفن.") + '</p>' +
      '<div class="ac-grid">' +
        GALLERIES.map(g =>
          '<a href="' + ARTIST + '/gallery/' + g.slug + '" target="_blank" rel="noopener">' +
            '<span class="ac-i">' + g.icon + '</span>' +
            '<span class="ac-t">' + (en ? g.en : g.ar) + '</span>' +
          '</a>').join('') +
      '</div>' +
      '<a class="ac-all" href="' + ARTIST + '" target="_blank" rel="noopener">' +
        (en ? "Visit altayebamer.com →" : "زر الموقع الشخصي altayebamer.com ←") + '</a>';
  }

  function mountAll() {
    injectCss();
    document.querySelectorAll("[data-ad-slot]").forEach(el => {
      if (el.dataset.adReady) return;
      el.dataset.adReady = "1";
      renderAd(el, el.getAttribute("data-ad-slot") || "leaderboard");
    });
    document.querySelectorAll("[data-artist-corner]").forEach(el => {
      if (el.dataset.adReady) return;
      el.dataset.adReady = "1";
      renderArtist(el);
    });
  }

  global.ADS = { HOUSE, GALLERIES, POOL, mountAll, renderAd, renderArtist, version:"1.0" };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})(typeof window !== "undefined" ? window : globalThis);
