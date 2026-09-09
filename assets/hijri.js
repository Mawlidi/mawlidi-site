/* ═══════════════════════════════════════════════
   MAWLIDI HIJRI ENGINE — الطبقة المشتركة
   يستخدمها: arb/index.html · eng/index.html · صفحات المحوّل
   التقويم المعتمد: الهجري الجدولي (خوارزمية كويتية) — حسابي لا رصدي،
   وقد يفرق يوماً عن الرؤية الشرعية المحلية.
   ═══════════════════════════════════════════════ */

// ميلادي → يوم يولياني
function gToJ(y,m,d){if(m<=2){y--;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524;}

// يوم يولياني → هجري
function jToH(jd){const l=jd-1948440+10632,n=Math.floor((l-1)/10631),ll=l-10631*n+354;const j=Math.floor((10985-ll)/5316)*Math.floor(50*ll/17719)+Math.floor(ll/5670)*Math.floor(43*ll/15238);const lll=ll-Math.floor((30-j)/15)*Math.floor(17719*j/50)-Math.floor(j/16)*Math.floor(15238*j/43)+29;const month=Math.floor(24*lll/709),day=lll-Math.floor(709*month/24),year=30*n+j-30;return{y:year,m:month,d:day};}

// يوم يولياني → ميلادي
function jToG(jd){const z=Math.floor(jd+.5),a=Math.floor((z-1867216.25)/36524.25),aa=z+1+a-Math.floor(a/4),b=aa+1524,cc=Math.floor((b-122.1)/365.25),d=Math.floor(365.25*cc),e=Math.floor((b-d)/30.6001);const day=b-d-Math.floor(30.6001*e),month=e<14?e-1:e-13,year=month>2?cc-4716:cc-4715;return{y:year,m:month,d:day};}

// هجري → يوم يولياني
// عكسٌ دقيق لـ jToH ببحث ثنائي. الصيغة المغلقة السابقة كانت تنحرف أكثر من سنة
// لأنها لم تكن مبنية على نفس الخوارزمية، فلا يجوز الرجوع إليها.
function hToJ(y,m,d){
  let lo=1721426, hi=2914695;               // ~سنة 1م إلى ~سنة 3000م
  const t=y*10000+m*100+d;
  while(lo<hi){
    const mid=Math.floor((lo+hi)/2),H=jToH(mid);
    if(H.y*10000+H.m*100+H.d < t) lo=mid+1; else hi=mid;
  }
  return lo;
}

// هل التاريخ الهجري موجود فعلاً؟ (شهر 29 يوماً لا يحوي يوم 30)
function hValid(y,m,d){
  if(m<1||m>12||d<1||d>30) return false;
  const H=jToH(hToJ(y,m,d));
  return H.y===y && H.m===m && H.d===d;
}

// عدد أيام شهر هجري
function hMonthLen(y,m){
  const nm = m===12 ? {y:y+1,m:1} : {y,m:m+1};
  return hToJ(nm.y,nm.m,1) - hToJ(y,m,1);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gToJ, jToH, jToG, hToJ, hValid, hMonthLen };
}
