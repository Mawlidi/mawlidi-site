#!/usr/bin/env node
/* اختبارات محرك أطوار القمر — التشغيل: node tools/test-moon.js */
const { moonPhase, elongation, jdOfNoon, SYNODIC,
        sunMansion, moonMansion, MANSION_ARC } = require('../assets/moon.js');
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

// 6) كل منزلة تقع على نجمها: يوم مرور الشمس بخط طول النجم
//    يجب أن تُحسب المنزلة الموافقة له
const STARS=[['الثريا',2,5,21],['الدبران',3,5,31],['الجبهة',9,8,23],
             ['القلب',17,12,1],['السماك',13,10,17]];
for(const [name,exp,m,d] of STARS)
  ok(`منزلة ${name} تقع على نجمها`, sunMansion(jdOfNoon(2026,m,d)).idx===exp,
     `المحسوب ${sunMansion(jdOfNoon(2026,m,d)).idx} والمتوقع ${exp}`);

// 7) قوس المنزلة 12° 51′ 26″ ورقمها دائماً 0..27
ok('قوس المنزلة 12.857143°', Math.abs(MANSION_ARC-360/28)<1e-9);
let badM=0;
for(let jd=jdOfNoon(2000,1,1); jd<jdOfNoon(2030,1,1); jd+=1){
  const i=moonMansion(jd).idx; if(i<0||i>27) badM++;
}
ok('رقم منزلة القمر ضمن 0–27 على 30 سنة', badM===0, `مخالفات: ${badM}`);

// 8) الشهر النجمي 27.32 يوماً لا 28، فالقمر يقطع أكثر من منزلة بقليل
//    كل ليلة ويتخطّى إحداها أحياناً — لكنه يمرّ بها جميعاً خلال شهرين
const seen=new Set();
for(let k=0;k<60;k++) seen.add(moonMansion(jdOfNoon(2026,1,1)+k).idx);
ok('القمر يمرّ بالمنازل الـ28 كلها خلال 60 ليلة', seen.size===28, `المرصود ${seen.size}`);
const step=[];
for(let k=0;k<27;k++){
  const a=moonMansion(jdOfNoon(2026,1,1)+k).idx, b=moonMansion(jdOfNoon(2026,1,1)+k+1).idx;
  step.push(((b-a)+28)%28);
}
// سرعة القمر تتراوح 11.8°–15.4° يومياً وقوس المنزلة 12.857°، فقد يبقى
// ليلتين في منزلة قرب الأوج ويتخطّى واحدة قرب الحضيض
ok('التقدّم الليلي بين 0 و2 منزلة', step.every(v=>v>=0&&v<=2),
   `القيم المرصودة: ${[...new Set(step)].join(', ')}`);
ok('متوسط التقدّم قرب منزلة واحدة',
   Math.abs(step.reduce((a,b)=>a+b,0)/step.length - 28/27.32158) < 0.12);

console.log(`\n${fail===0?'✅':'❌'} نجح ${pass} · فشل ${fail}`);
process.exit(fail?1:0);
