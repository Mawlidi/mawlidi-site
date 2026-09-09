/* ═══════════════════════════════════════════════
   MAWLIDI MOON ENGINE — أطوار القمر
   حساب فلكي (Meeus مختصر)، لا علاقة له بالتقويم الجدولي في hijri.js.
   الدقة المتوقعة: أقل من ساعة في عمر القمر، وأقل من 1% في نسبة الإضاءة.
   المرجع الزمني: منتصف نهار التاريخ المطلوب بالتوقيت العالمي.
   ═══════════════════════════════════════════════ */

const SYNODIC = 29.530588853;            // متوسط الشهر الاقتراني بالأيام
const RAD = Math.PI / 180;

// يوم يولياني بكسر — عند 12:00 UT من التاريخ الميلادي المعطى
function jdOfNoon(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + 0.5;
}

const norm = a => ((a % 360) + 360) % 360;

// خط طول الشمس الظاهري بالدرجات
function sunLongitude(jd) {
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const Ms = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C  = (1.914602 - 0.004817 * T) * Math.sin(Ms * RAD)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Ms * RAD)
           + 0.000289 * Math.sin(3 * Ms * RAD);
  return norm(L0 + C);
}

// خط طول القمر بالدرجات — الحدود الرئيسية
function moonLongitude(jd) {
  const T = (jd - 2451545) / 36525;
  const Ms = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const Mm = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  const moonLon = Lp
    + 6.288774 * Math.sin(Mm * RAD)
    + 1.274027 * Math.sin((2 * D - Mm) * RAD)
    + 0.658314 * Math.sin(2 * D * RAD)
    + 0.213618 * Math.sin(2 * Mm * RAD)
    - 0.185116 * Math.sin(Ms * RAD)
    - 0.114332 * Math.sin(2 * F * RAD)
    + 0.058793 * Math.sin((2 * D - 2 * Mm) * RAD)
    + 0.057066 * Math.sin((2 * D - Ms - Mm) * RAD)
    + 0.053322 * Math.sin((2 * D + Mm) * RAD)
    + 0.045758 * Math.sin((2 * D - Ms) * RAD)
    - 0.040923 * Math.sin((Ms - Mm) * RAD)
    - 0.034720 * Math.sin(D * RAD)
    - 0.030383 * Math.sin((Ms + Mm) * RAD);

  return norm(moonLon);
}

// استطالة القمر عن الشمس بالدرجات (0 = محاق، 180 = بدر)
function elongation(jd) {
  return norm(moonLongitude(jd) - sunLongitude(jd));
}

/* ═══ منازل القمر الثمانية والعشرون ═══
   المنازل سيدرية: مرتبطة بالنجوم لا بنقطة الاعتدال، فتُطرح زاوية
   المبادرة (الأيانامشا) من خط الطول المداري قبل القسمة.
   القسمة متساوية: 360 ÷ 28 = 12° 51′ 26″ لكل منزلة، وهو ما اعتمده
   علماء الفلك المسلمون في الحساب. النظام النجمي القديم غير متساوٍ،
   والفرق بينهما قد يبلغ ليلة. */
const MANSION_ARC = 360 / 28;

function ayanamsa(jd) {                       // درجة المبادرة التقريبية
  return 23.85 + 0.0139694 * ((jd - 2451545) / 365.25);
}

function siderealLon(jd, tropicalLon) {
  return norm(tropicalLon - ayanamsa(jd));
}

// رقم منزلة القمر (0 = الشرطان) ونسبة قطعها
function moonMansion(jd) {
  const s = siderealLon(jd, moonLongitude(jd));
  return { idx: Math.floor(s / MANSION_ARC), lon: s,
           frac: (s % MANSION_ARC) / MANSION_ARC };
}

// رقم منزلة الشمس — موضعها في دورة السنة بين النجوم
function sunMansion(jd) {
  const s = siderealLon(jd, sunLongitude(jd));
  return { idx: Math.floor(s / MANSION_ARC), lon: s,
           frac: (s % MANSION_ARC) / MANSION_ARC };
}

// الطور الكامل ليوم ميلادي
function moonPhase(y, m, d) {
  const jd = jdOfNoon(y, m, d), e = elongation(jd);
  return {
    elongation: e,
    age: e / 360 * SYNODIC,                       // عمر القمر بالأيام منذ المحاق
    illum: (1 - Math.cos(e * RAD)) / 2,           // نسبة القرص المضاء (0–1)
    waxing: e < 180,                              // متزايد أم متناقص
    idx: Math.floor(norm(e + 22.5) / 45) % 8      // 0 محاق … 4 بدر … 7 هلال متناقص
  };
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = { moonPhase, elongation, jdOfNoon, SYNODIC,
    sunLongitude, moonLongitude, moonMansion, sunMansion, MANSION_ARC };
