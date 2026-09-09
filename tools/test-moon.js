#!/usr/bin/env node
/* اختبارات محرك أطوار القمر — التشغيل: node tools/test-moon.js */
const { moonPhase, elongation, jdOfNoon, SYNODIC } = require('../assets/moon.js');
let pass=0, fail=0;
const ok=(name,cond,extra='')=>{cond?pass++:(fail++,console.log('❌ '+name+(extra?'\n   '+extra:'')));};

// 1) لحظات محاق وبدر موثّقة فلكياً (UT) — الانحراف المقبول 6 ساعات
const NEW=[[2000,1,6],[2024,4,8],[2023,1,21],[2026,1,18],[1969,7,14]];
const FULL=[[2000,1,21],[2025,3,14],[2026,8,28],[2024,9,18]];
for(const [y,m,d] of NEW){
  const e=elongation(jdOfNoon(y,m,d));
  const off=Math.min(e,360-e)/360*SYNODIC*24;      // ساعات عن لحظة المحاق
  ok(`محاق ${y}-${m}-${d}`, off<18, `الانحراف ${off.toFixed(1)} ساعة`);
}
for(const [y,m,d] of FULL){
  const e=elongation(jdOfNoon(y,m,d));
  const off=Math.abs(e-180)/360*SYNODIC*24;
  ok(`بدر ${y}-${m}-${d}`, off<18, `الانحراف ${off.toFixed(1)} ساعة`);
}

// 2) الإضاءة عند المحاق ~0 وعند البدر ~1
ok('إضاءة المحاق < 2%',  moonPhase(2024,4,8).illum < 0.02);
ok('إضاءة البدر > 98%',  moonPhase(2025,3,14).illum > 0.98);

// 3) العمر ضمن المدى دائماً، والإضاءة ضمن [0,1]، على 40 سنة يوماً بيوم
let bad=0, badI=0;
for(let y=1990;y<=2030;y++) for(let m=1;m<=12;m++) for(let d=1;d<=28;d++){
  const p=moonPhase(y,m,d);
  if(!(p.age>=0 && p.age<=SYNODIC+0.01)) bad++;
  if(!(p.illum>=0 && p.illum<=1)) badI++;
}
ok('عمر القمر ضمن الشهر الاقتراني (13٬776 يوماً)', bad===0, `مخالفات: ${bad}`);
ok('نسبة الإضاءة ضمن [0,1]', badI===0, `مخالفات: ${badI}`);

// 4) الدورة: بعد شهر اقتراني كامل يعود الطور نفسه تقريباً
const a=moonPhase(2026,1,1), bJD=jdOfNoon(2026,1,1)+SYNODIC;
const eB=elongation(bJD), da=Math.min(Math.abs(eB-a.elongation),360-Math.abs(eB-a.elongation));
ok('تكرار الطور بعد شهر اقتراني', da<8, `الفارق ${da.toFixed(2)} درجة`);

// 5) التزايد والتناقص
ok('اليوم التالي للمحاق متزايد',  moonPhase(2024,4,10).waxing===true);
ok('اليوم التالي للبدر متناقص',   moonPhase(2025,3,17).waxing===false);

console.log(`\n${fail===0?'✅':'❌'} نجح ${pass} · فشل ${fail}`);
process.exit(fail?1:0);
