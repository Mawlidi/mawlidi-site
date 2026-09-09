#!/usr/bin/env node
/* اختبارات محرك التقويم — التشغيل: node tools/test-hijri.js */
const { gToJ, jToH, jToG, hToJ, hValid, hMonthLen } = require('../assets/hijri.js');
let pass=0, fail=0;
const eq=(name,a,b)=>{ const ok=JSON.stringify(a)===JSON.stringify(b);
  ok?pass++:(fail++,console.log(`❌ ${name}\n   ناتج: ${JSON.stringify(a)}\n   متوقع: ${JSON.stringify(b)}`)); };

// 1) نقاط مرجعية معروفة (هجري → ميلادي)
const REF = [
  [[1447,1,1],  [2025,6,27]],   // رأس السنة الهجرية 1447
  [[1446,9,1],  [2025,3,1]],    // غرة رمضان 1446
  [[1446,1,1],  [2024,7,8]],    // رأس السنة 1446
  [[1420,9,24], [2000,1,1]],    // بداية الألفية
];
REF.forEach(([h,g])=>{ const r=jToG(hToJ(...h)); eq(`هجري→ميلادي ${h.join('/')}`, [r.y,r.m,r.d], g); });

// 2) الاتجاه المعاكس على نفس النقاط
REF.forEach(([h,g])=>{ const r=jToH(gToJ(...g)); eq(`ميلادي→هجري ${g.join('-')}`, [r.y,r.m,r.d], h); });

// 3) الرحلة المغلقة: كل يوم ميلادي من 1900 إلى 2100 يعود كما هو
let rt=0;
for(let jd=gToJ(1900,1,1); jd<=gToJ(2100,1,1); jd++){
  const H=jToH(jd);
  if(hToJ(H.y,H.m,H.d)!==jd){ rt++; if(rt<4) console.log(`❌ رحلة مغلقة عند jd=${jd} → ${H.y}/${H.m}/${H.d}`); }
}
eq('رحلة مغلقة على 73٬000 يوم (1900–2100)', rt, 0);

// 4) طول الشهر الهجري دائماً 29 أو 30
let bad=0;
for(let y=1400;y<=1500;y++) for(let m=1;m<=12;m++){ const L=hMonthLen(y,m); if(L!==29&&L!==30) bad++; }
eq('أطوال الأشهر 1400–1500هـ ضمن 29/30', bad, 0);

// 5) التحقق من التواريخ غير الموجودة
eq('يوم 30 في شهر ناقص يُرفض', hValid(1446,9,30), hMonthLen(1446,9)===30);
eq('شهر 13 مرفوض', hValid(1446,13,1), false);

console.log(`\n${fail===0?'✅':'❌'} نجح ${pass} · فشل ${fail}`);
process.exit(fail?1:0);
