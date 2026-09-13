(() => {
"use strict";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const translations = {
  ar: {
    home:"الرئيسية", tools:"كل الأدوات", favorites:"المفضلة", recent:"المستخدمة مؤخرًا",
    categories:"التصنيفات", all:"كل الأدوات", image:"الصور", text:"النصوص", developer:"المطورون",
    calculator:"الحسابات", student:"الطلاب", gaming:"الألعاب", utility:"الأدوات المساعدة",
    search:"ابحث عن أداة...", hero:"أدواتك اليومية، في مكان واحد", sub:"أدوات مجانية وسريعة تعمل محليًا في متصفحك قدر الإمكان.",
    noResults:"لا توجد أدوات مطابقة.", related:"أدوات ذات صلة", faq:"الأسئلة الشائعة", back:"رجوع",
    favorite:"المفضلة", download:"تحميل", copy:"نسخ", clear:"مسح", generate:"إنشاء", calculate:"احسب",
    format:"تنسيق", minify:"تصغير", encode:"ترميز", decode:"فك الترميز", convert:"تحويل", resize:"تغيير الحجم",
    compress:"ضغط", crop:"قص", start:"بدء", pause:"إيقاف مؤقت", reset:"إعادة ضبط", stop:"إيقاف",
    about:"حول", privacy:"الخصوصية", terms:"الشروط", contact:"اتصل بنا", language:"اللغة", theme:"المظهر",
    light:"فاتح", dark:"داكن", footer:"كل الأدوات التي تحتاجها في مكان واحد",
    invalid:"البيانات غير صالحة.", copied:"تم النسخ.", error:"حدث خطأ، حاول مرة أخرى.",
    selectFile:"اختر ملفًا", quality:"الجودة", width:"العرض", height:"الارتفاع", lock:"قفل النسبة",
    before:"قبل", after:"بعد", saving:"التوفير", output:"النتيجة", original:"الأبعاد الأصلية",
    textInput:"النص", outputText:"الناتج", uppercase:"أحرف كبيرة", lowercase:"أحرف صغيرة",
    titleCase:"حالة العنوان", sentenceCase:"حالة الجملة", duplicate:"حذف التكرار", sort:"ترتيب",
    clean:"تنظيف", jsonInput:"JSON", min:"الحد الأدنى", max:"الحد الأقصى", value:"القيمة",
    dob:"تاريخ الميلاد", weight:"الوزن (كغ)", heightCm:"الطول (سم)", unit:"الوحدة", from:"من", to:"إلى",
    numbers:"الأرقام", subject:"المادة", grade:"العلامة", coefficient:"المعامل", average:"المعدل",
    gpa:"GPA", points:"النقاط", timer:"المؤقت", minutes:"الدقائق", seconds:"الثواني",
    textToSpeak:"النص المراد نطقه", voice:"الصوت", markdown:"Markdown", qrText:"النص أو الرابط",
    length:"الطول", symbols:"الرموز", numbersOpt:"الأرقام", upper:"أحرف كبيرة", lower:"أحرف صغيرة",
    gpu:"بطاقة الرسوميات", resolution:"الدقة", qualitySetting:"الجودة", tip:"النصيحة",
    sensitivity:"الحساسية", random:"رقم عشوائي", result:"النتيجة"
  },
  en: {
    home:"Home", tools:"All Tools", favorites:"Favorites", recent:"Recently Used", categories:"Categories",
    all:"All Tools", image:"Image", text:"Text", developer:"Developer", calculator:"Calculator",
    student:"Student", gaming:"Gaming", utility:"Utility", search:"Search for a tool...", hero:"Your everyday tools, in one place",
    sub:"Fast, free tools that run locally in your browser whenever possible.", noResults:"No matching tools.",
    related:"Related Tools", faq:"FAQ", back:"Back", favorite:"Favorites", download:"Download", copy:"Copy",
    clear:"Clear", generate:"Generate", calculate:"Calculate", format:"Format", minify:"Minify", encode:"Encode",
    decode:"Decode", convert:"Convert", resize:"Resize", compress:"Compress", crop:"Crop", start:"Start",
    pause:"Pause", reset:"Reset", stop:"Stop", about:"About", privacy:"Privacy", terms:"Terms", contact:"Contact",
    language:"Language", theme:"Theme", light:"Light", dark:"Dark", footer:"All the tools you need in one place",
    invalid:"Invalid data.", copied:"Copied.", error:"Something went wrong. Try again.", selectFile:"Choose a file",
    quality:"Quality", width:"Width", height:"Height", lock:"Lock aspect ratio", before:"Before", after:"After",
    saving:"Saving", output:"Output", original:"Original dimensions", textInput:"Text", outputText:"Output",
    uppercase:"UPPERCASE", lowercase:"lowercase", titleCase:"Title Case", sentenceCase:"Sentence case",
    duplicate:"Remove duplicates", sort:"Sort", clean:"Clean", jsonInput:"JSON", min:"Minimum", max:"Maximum",
    value:"Value", dob:"Date of birth", weight:"Weight (kg)", heightCm:"Height (cm)", unit:"Unit", from:"From",
    to:"To", numbers:"Numbers", subject:"Subject", grade:"Grade", coefficient:"Coefficient", average:"Average",
    gpa:"GPA", points:"Points", timer:"Timer", minutes:"Minutes", seconds:"Seconds", textToSpeak:"Text to speak",
    voice:"Voice", markdown:"Markdown", qrText:"Text or URL", length:"Length", symbols:"Symbols", numbersOpt:"Numbers",
    upper:"Uppercase", lower:"Lowercase", gpu:"GPU", resolution:"Resolution", qualitySetting:"Quality", tip:"Tip",
    sensitivity:"Sensitivity", random:"Random number", result:"Result"
  }
};

const tools = [
  {id:"image-compressor",cat:"image",icon:"🗜️",ar:["ضغط الصور","قلّل حجم الصور مع التحكم بالجودة والأبعاد."],en:["Image Compressor","Reduce image size with quality and dimension controls."]},
  {id:"image-resizer",cat:"image",icon:"📐",ar:["تغيير حجم الصورة","غيّر أبعاد الصورة مع قفل النسبة."],en:["Image Resizer","Resize images while preserving aspect ratio."]},
  {id:"image-converter",cat:"image",icon:"🔄",ar:["تحويل الصورة","حوّل الصور بين PNG وJPG وWEBP."],en:["Image Converter","Convert images between PNG, JPG and WEBP."]},
  {id:"image-cropper",cat:"image",icon:"✂️",ar:["قص الصورة","قص جزءًا من الصورة وحدد منطقة القص."],en:["Image Cropper","Crop an image by selecting a rectangular area."]},
  {id:"word-counter",cat:"text",icon:"🔢",ar:["عداد الكلمات","احسب الكلمات والحروف والجمل والفقرات."],en:["Word Counter","Count words, characters, sentences and paragraphs."]},
  {id:"case-converter",cat:"text",icon:"Aa",ar:["محول حالة النص","حوّل النص إلى حالات مختلفة."],en:["Case Converter","Convert text to different cases."]},
  {id:"duplicate-lines",cat:"text",icon:"🧹",ar:["حذف الأسطر المكررة","احذف الأسطر المتكررة وانسخ أو حمّل النتيجة."],en:["Remove Duplicate Lines","Remove repeated lines and export the result."]},
  {id:"text-sorter",cat:"text",icon:"↕️",ar:["ترتيب النص","رتب الأسطر أبجديًا أو رقميًا."],en:["Text Sorter","Sort lines alphabetically or numerically."]},
  {id:"text-cleaner",cat:"text",icon:"🧽",ar:["منظف النص","نظف المسافات والأسطر الفارغة."],en:["Text Cleaner","Clean spaces and empty lines."]},
  {id:"json-formatter",cat:"developer",icon:"{ }",ar:["منسق JSON","نسّق أو صغّر JSON مع فحص الأخطاء."],en:["JSON Formatter","Format or minify JSON with useful errors."]},
  {id:"base64",cat:"developer",icon:"64",ar:["Base64","ترميز وفك ترميز Base64 مع دعم العربية."],en:["Base64","UTF-8 Base64 encoder and decoder."]},
  {id:"url-encoder",cat:"developer",icon:"🔗",ar:["URL Encoder","ترميز وفك ترميز عناوين URL."],en:["URL Encoder","Encode and decode URLs."]},
  {id:"html-formatter",cat:"developer",icon:"</>",ar:["HTML Formatter","تنسيق بسيط ومنظم لشفرة HTML."],en:["HTML Formatter","Simple readable HTML formatting."]},
  {id:"color-converter",cat:"developer",icon:"🎨",ar:["محول الألوان","حوّل HEX وRGB وHSL مع Color Picker."],en:["Color Converter","Convert HEX, RGB and HSL with a color picker."]},
  {id:"percentage",cat:"calculator",icon:"%",ar:["حاسبة النسبة المئوية","احسب النسبة والقيمة والزيادة أو النقصان."],en:["Percentage Calculator","Calculate percentages and changes."]},
  {id:"age",cat:"calculator",icon:"🎂",ar:["حاسبة العمر","احسب العمر بالسنوات والأشهر والأيام."],en:["Age Calculator","Calculate age in years, months and days."]},
  {id:"bmi",cat:"calculator",icon:"⚖️",ar:["حاسبة BMI","احسب مؤشر كتلة الجسم كمؤشر عام فقط."],en:["BMI Calculator","Calculate BMI as a general indicator, not a diagnosis."]},
  {id:"unit-converter",cat:"calculator",icon:"📏",ar:["محول الوحدات","حوّل الطول والوزن والحرارة والوقت والبيانات."],en:["Unit Converter","Convert length, weight, temperature, time and data."]},
  {id:"average",cat:"calculator",icon:"∑",ar:["حاسبة المتوسط","احسب المتوسط والمجموع والعدد والقيم القصوى."],en:["Average Calculator","Calculate average, sum, count, min and max."]},
  {id:"grade",cat:"student",icon:"📚",ar:["حاسبة العلامات","احسب معدل المواد باستخدام المعاملات."],en:["Grade Calculator","Calculate weighted subject averages."]},
  {id:"gpa",cat:"student",icon:"🎓",ar:["حاسبة GPA","احسب GPA بشكل عام باستخدام النقاط والساعات."],en:["GPA Calculator","Calculate a general GPA from points and credits."]},
  {id:"study-timer",cat:"student",icon:"🍅",ar:["مؤقت الدراسة","Pomodoro قابل للتخصيص للدراسة والاستراحة."],en:["Study Timer","Customizable Pomodoro study and break timer."]},
  {id:"stopwatch",cat:"student",icon:"⏱️",ar:["ساعة إيقاف","ساعة إيقاف دقيقة مع بدء وإيقاف وإعادة ضبط."],en:["Stopwatch","Precise start, pause and reset stopwatch."]},
  {id:"fps-guide",cat:"gaming",icon:"🎮",ar:["دليل إعدادات الألعاب","اقتراحات تقريبية حسب GPU والدقة والجودة، وليس قياس FPS حقيقي."],en:["FPS / Gaming Settings Guide","Approximate settings advice, not a real FPS measurement."]},
  {id:"sensitivity",cat:"gaming",icon:"🎯",ar:["محول الحساسية","حوّل الحساسية بمعامل يدخله المستخدم مع تنبيه للدقة."],en:["Sensitivity Converter","Convert sensitivity using a user-defined ratio; not an official guarantee."]},
  {id:"random",cat:"utility",icon:"🎲",ar:["مولد الأرقام العشوائية","أنشئ رقمًا عشوائيًا بين حدين."],en:["Random Number Generator","Generate a random number between two bounds."]},
  {id:"password",cat:"utility",icon:"🔐",ar:["مولد كلمات المرور","أنشئ كلمات مرور محليًا دون إرسالها للسيرفر."],en:["Password Generator","Generate passwords locally; nothing is sent to the server."]},
  {id:"qr",cat:"utility",icon:"▦",ar:["مولد QR","حوّل نصًا أو رابطًا إلى QR قابل للتحميل."],en:["QR Code Generator","Generate a downloadable QR from text or a URL."]},
  {id:"timer",cat:"utility",icon:"⏲️",ar:["Timer","مؤقت قابل للتخصيص."],en:["Timer","Custom countdown timer."]},
  {id:"countdown",cat:"utility",icon:"⌛",ar:["Countdown","عد تنازلي إلى تاريخ ووقت تختاره."],en:["Countdown","Countdown to a selected date and time."]},
  {id:"tts",cat:"utility",icon:"🔊",ar:["تحويل النص إلى كلام","استخدم أصوات الجهاز المتاحة محليًا."],en:["Text To Speech","Use available device voices locally."]},
  {id:"markdown",cat:"utility",icon:"M↓",ar:["Markdown Preview","اكتب Markdown وشاهد معاينة آمنة مباشرة."],en:["Markdown Preview","Write Markdown and see a safe live preview."]}
];

let lang = store.get("lang","ar");
let theme = store.get("theme","light");
let favorites = store.get("favorites",[]);
let recent = store.get("recent",[]);
let currentCategory = "all";

function t(k){ return translations[lang][k] || translations.en[k] || k; }
function toolTitle(x){ return x[lang]?.[0] || x.en[0]; }
function toolDesc(x){ return x[lang]?.[1] || x.en[1]; }
function catName(c){ return t(c); }
function escapeHtml(s=""){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
function toast(msg){ const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),1800); }
function setStatus(el,msg,type=""){ if(el){el.textContent=msg;el.className="status "+type;} }
function copyText(text){ navigator.clipboard?.writeText(text).then(()=>toast(t("copied"))).catch(()=>toast(t("error"))); }
function downloadBlob(blob,name){ const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function downloadText(text,name,type="text/plain"){downloadBlob(new Blob([text],{type}),name);}
function navigate(path){ history.pushState({}, "", path); render(); window.scrollTo(0,0); }
function markRecent(id){ recent=[id,...recent.filter(x=>x!==id)].slice(0,8);store.set("recent",recent); }
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];store.set("favorites",favorites);render();}
function filteredTools(q=""){const query=q.trim().toLocaleLowerCase();return tools.filter(x=>{const matchesCat=currentCategory==="all"||x.cat===currentCategory; if(!query)return matchesCat; return matchesCat && [x.ar[0],x.ar[1],x.en[0],x.en[1],x.cat].join(" ").toLocaleLowerCase().includes(query);});}
function card(x){return `<article class="card tool-card" data-tool="${x.id}" tabindex="0" role="button" aria-label="${escapeHtml(toolTitle(x))}">
<button class="fav" data-fav="${x.id}" aria-label="${t("favorite")}">${favorites.includes(x.id)?"★":"☆"}</button>
<div class="tool-icon">${x.icon}</div><h3>${escapeHtml(toolTitle(x))}</h3><p>${escapeHtml(toolDesc(x))}</p><span class="category-label">${escapeHtml(catName(x.cat))}</span></article>`;}

function shell(content){
document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.body.classList.toggle("dark",theme==="dark");
$("#app").innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-mark">🧰</span>ToolBox DZ</div>
<nav class="nav" aria-label="Main navigation">
<button data-route="/">⌂ ${t("home")}</button><button data-route="/tools">🧰 ${t("tools")}</button>
<button data-filter="favorites">⭐ ${t("favorites")}</button><button data-filter="recent">🕘 ${t("recent")}</button>
</nav><div class="section-title"><h2 style="font-size:14px">${t("categories")}</h2></div>
<nav class="nav">${["all","image","text","developer","calculator","student","gaming","utility"].map(c=>`<button data-category="${c}">${c==="all"?"◉": "•"} ${catName(c)}</button>`).join("")}</nav></aside>
<div class="main"><header class="topbar"><button class="icon-btn mobile-menu" id="menu" aria-label="Menu">☰</button><div class="grow"></div>
<button class="btn" id="langBtn" aria-label="${t("language")}">${lang==="ar"?"EN":"عربي"}</button><button class="btn" id="themeBtn" aria-label="${t("theme")}">${theme==="dark"?"☀️":"🌙"}</button></header>
<main id="main" class="content">${content}</main>
<footer class="footer"><span>ToolBox DZ © 2026</span><span>${t("footer")}</span><span><a href="/about" data-route="/about">${t("about")}</a> · <a href="/privacy" data-route="/privacy">${t("privacy")}</a> · <a href="/terms" data-route="/terms">${t("terms")}</a> · <a href="/contact" data-route="/contact">${t("contact")}</a></span></footer></div></div>`;
bindShell();
}

function bindShell(){
$$("[data-route]").forEach(e=>e.onclick=ev=>{ev.preventDefault();navigate(e.dataset.route);});
$$("[data-category]").forEach(e=>e.onclick=()=>{currentCategory=e.dataset.category;navigate("/tools");});
$$("[data-filter]").forEach(e=>e.onclick=()=>{currentCategory=e.dataset.filter;navigate("/tools");});
$("#langBtn").onclick=()=>{lang=lang==="ar"?"en":"ar";store.set("lang",lang);render();};
$("#themeBtn").onclick=()=>{theme=theme==="dark"?"light":"dark";store.set("theme",theme);render();};
$("#menu")?.addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$$("[data-tool]").forEach(e=>{e.onclick=ev=>{if(ev.target.closest("[data-fav]"))return;navigate("/tools/"+e.dataset.tool)};e.onkeydown=ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();navigate("/tools/"+e.dataset.tool)}}});
$$("[data-fav]").forEach(e=>e.onclick=ev=>{ev.stopPropagation();toggleFavorite(e.dataset.fav);});
}

function renderHome(){
shell(`<section class="hero"><span class="eyebrow">🧰 ToolBox DZ</span><h1>${t("hero")}</h1><p>${t("sub")}</p>
<div class="search-wrap"><input class="search" id="homeSearch" aria-label="${t("search")}" placeholder="${t("search")}"></div></section>
<div class="section-title"><h2>${t("recent")}</h2></div><div class="grid">${recent.map(id=>tools.find(x=>x.id===id)).filter(Boolean).map(card).join("")||`<div class="empty">${t("noResults")}</div>`}</div>
<div class="section-title"><h2>${t("tools")}</h2><a href="/tools" data-route="/tools">${t("tools")}</a></div><div class="grid">${tools.slice(0,12).map(card).join("")}</div>`);
$("#homeSearch").oninput=e=>{currentCategory="all";const q=e.target.value;const section=e.target.closest(".hero").parentElement;let grid=section.querySelector("[data-home-search-results]");if(!grid){grid=document.createElement("div");grid.className="grid";grid.setAttribute("data-home-search-results","");section.insertBefore(grid,section.children[2]||null)}grid.innerHTML=filteredTools(q).map(card).join("")||`<div class="empty">${t("noResults")}</div>`;bindCards(grid);};
}
function bindCards(root=document){$$("[data-tool]",root).forEach(e=>{e.onclick=ev=>{if(ev.target.closest("[data-fav]"))return;navigate("/tools/"+e.dataset.tool)};});$$("[data-fav]",root).forEach(e=>e.onclick=ev=>{ev.stopPropagation();toggleFavorite(e.dataset.fav);});}

function renderTools(){
const isFav=currentCategory==="favorites", isRecent=currentCategory==="recent";
const list=isFav?tools.filter(x=>favorites.includes(x.id)):isRecent?tools.filter(x=>recent.includes(x.id)):tools;
shell(`<section class="hero"><span class="eyebrow">${t("tools")}</span><h1>${isFav?t("favorites"):isRecent?t("recent"):t("tools")}</h1><div class="search-wrap"><input class="search" id="toolSearch" placeholder="${t("search")}" aria-label="${t("search")}"></div>
<div class="chips">${["all","image","text","developer","calculator","student","gaming","utility"].map(c=>`<button class="chip ${currentCategory===c?"active":""}" data-cat="${c}">${catName(c)}</button>`).join("")}</div></section>
<div id="toolGrid" class="grid">${list.map(card).join("")||`<div class="empty">${t("noResults")}</div>`}</div>`);
$$("[data-cat]").forEach(e=>e.onclick=()=>{currentCategory=e.dataset.cat;renderTools();});
$("#toolSearch").oninput=e=>{const q=e.target.value;$("#toolGrid").innerHTML=filteredTools(q).map(card).join("")||`<div class="empty">${t("noResults")}</div>`;bindCards($("#toolGrid"));};
}

function field(label, input){return `<div class="field"><label>${label}</label>${input}</div>`}
function textarea(id,placeholder=""){return `<textarea id="${id}" placeholder="${escapeHtml(placeholder)}"></textarea>`}
function input(id,type="text",value="",attrs=""){return `<input id="${id}" type="${type}" value="${escapeHtml(value)}" ${attrs}>`}
function actionBar(btns){return `<div class="actions">${btns}</div>`}
function toolFrame(x,body,faq=""){
markRecent(x.id);
return `<div class="tool-view"><div class="tool-header"><div><h1>${x.icon} ${escapeHtml(toolTitle(x))}</h1><p class="muted">${escapeHtml(toolDesc(x))}</p></div><button class="btn" id="back">${t("back")}</button></div><div class="tool-box">${body}</div>${faq?`<section class="faq"><h2>${t("faq")}</h2>${faq}</section>`:""}<div class="section-title"><h2>${t("related")}</h2></div><div class="grid">${tools.filter(z=>z.cat===x.cat&&z.id!==x.id).slice(0,4).map(card).join("")}</div></div>`;
}

function imageTool(x,type){
let body=`${field(t("selectFile"),input("file","file","","accept=image/*"))}<div id="imageInfo"></div>`;
if(type==="compress")body+=`<div class="form-grid">${field(t("quality"),`<div class="range-row"><input id="quality" type="range" min="10" max="100" value="80"><output id="qout">80%</output></div>`)}${field(t("width"),input("width","number","","min=1"))}${field(t("height"),input("height","number","","min=1"))}</div>${actionBar(`<button class="btn primary" id="go">${t("compress")}</button><button class="btn" id="download" disabled>${t("download")}</button>`)}<div class="stats" id="stats"></div>`;
if(type==="resize")body+=`${field(t("width"),input("width","number","","min=1"))}${field(t("height"),input("height","number","","min=1"))}<label class="check"><input id="lock" type="checkbox" checked> ${t("lock")}</label>${actionBar(`<button class="btn primary" id="go">${t("resize")}</button><button class="btn" id="download" disabled>${t("download")}</button>`)}<div id="stats" class="stats"></div>`;
if(type==="convert")body+=`${field("Format",`<select id="format"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option></select>`)}${actionBar(`<button class="btn primary" id="go">${t("convert")}</button><button class="btn" id="download" disabled>${t("download")}</button>`)}<div id="stats" class="stats"></div>`;
if(type==="crop")body+=`${field("X",input("cx","number","0","min=0"))}${field("Y",input("cy","number","0","min=0"))}${field(t("width"),input("cw","number","","min=1"))}${field(t("height"),input("ch","number","","min=1"))}${actionBar(`<button class="btn primary" id="go">${t("crop")}</button><button class="btn" id="download" disabled>${t("download")}</button>`)}<p class="muted">حدد X/Y والعرض/الارتفاع. تتم العملية داخل المتصفح.</p>`;
shell(toolFrame(x,body));
imageToolBind(type);
}
function imageToolBind(type){
const file=$("#file"), info=$("#imageInfo"), dl=$("#download"), stats=$("#stats");let img=null, out=null, fileObj=null;
file.onchange=()=>{fileObj=file.files[0];if(!fileObj||!fileObj.type.startsWith("image/")){setStatus(info,t("invalid"),"error");return;}const fr=new FileReader();fr.onload=()=>{img=new Image();img.onload=()=>{info.innerHTML=`<img class="image-preview" src="${fr.result}" alt=""><div class="stats"><div class="stat"><span>${t("original")}</span><strong>${img.width}×${img.height}</strong></div><div class="stat"><span>${t("before")}</span><strong>${formatBytes(fileObj.size)}</strong></div></div>`;if(type==="resize"){ $("#width").value=img.width;$("#height").value=img.height;} if(type==="crop"){ $("#cw").value=Math.min(300,img.width);$("#ch").value=Math.min(300,img.height);}};img.src=fr.result};fr.readAsDataURL(fileObj);};
$("#quality")?.addEventListener("input",e=>$("#qout").value=e.target.value+"%");
$("#lock")?.addEventListener("change",()=>{});
$("#go").onclick=()=>{if(!img||!fileObj){setStatus(info,t("selectFile"),"error");return;}try{
let w=img.width,h=img.height;const canvas=document.createElement("canvas");
if(type==="compress"){w=Number($("#width").value)||img.width;h=Number($("#height").value)||img.height;}
if(type==="resize"){w=Number($("#width").value);h=Number($("#height").value);if(!w||!h)throw Error("size");}
if(type==="crop"){const x=Math.max(0,Number($("#cx").value)||0),y=Math.max(0,Number($("#cy").value)||0);w=Number($("#cw").value)||img.width;h=Number($("#ch").value)||img.height;if(x+w>img.width)w=img.width-x;if(y+h>img.height)h=img.height-y;canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,x,y,w,h,0,0,w,h);out=canvas.toDataURL("image/png");}
else {canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,0,0,w,h);const q=type==="compress"?Number($("#quality").value)/100:0.92;const mime=type==="convert"?$("#format").value:(type==="compress"?"image/jpeg":"image/png");out=canvas.toDataURL(mime,q);}
const b64=out.split(",")[1],bytes=atob(b64).length;stats.innerHTML=`<div class="stat"><span>${t("before")}</span><strong>${formatBytes(fileObj.size)}</strong></div><div class="stat"><span>${t("after")}</span><strong>${formatBytes(bytes)}</strong></div><div class="stat"><span>${t("saving")}</span><strong>${Math.max(0,(1-bytes/fileObj.size)*100).toFixed(1)}%</strong></div>`;dl.disabled=false;
}catch{setStatus(info,t("error"),"error");}};
dl.onclick=()=>{if(out){const ext=type==="convert"?$("#format").value.split("/")[1]:type==="compress"?"jpg":"png";downloadBlob(dataUrlToBlob(out),`toolbox-dz-${type}.${ext}`);}};
}
function dataUrlToBlob(data){const [h,b]=data.split(",");const m=h.match(/:(.*?);/)[1];const bin=atob(b);const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:m});}
function formatBytes(n){if(!Number.isFinite(n))return "0 B";const u=["B","KB","MB","GB"];let i=0;while(n>=1024&&i<3){n/=1024;i++;}return `${n.toFixed(i?1:0)} ${u[i]}`;}

function renderTextTool(x){
let body="",bind=()=>{};
if(x.id==="word-counter"){body=field(t("textInput"),textarea("text"));body+=`<div class="stats" id="stats"></div>`;bind=()=>{$("#text").oninput=()=>{const s=$("#text").value,chars=s.length,no=s.replace(/\s/g,"").length,words=(s.trim().match(/\S+/g)||[]).length,sent=(s.match(/[.!?؟]+(?=\s|$)/g)||[]).length,paras=s.trim()?s.trim().split(/\n\s*\n/).length:0;$("#stats").innerHTML=[["Characters",chars],["Characters without spaces",no],["Words",words],["Sentences",sent],["Paragraphs",paras]].map(a=>`<div class="stat"><span>${a[0]}</span><strong>${a[1]}</strong></div>`).join("")};};}
if(x.id==="case-converter"){body=field(t("textInput"),textarea("text"));body+=actionBar(`<button class="btn primary" data-case="upper">${t("uppercase")}</button><button class="btn" data-case="lower">${t("lowercase")}</button><button class="btn" data-case="title">${t("titleCase")}</button><button class="btn" data-case="sentence">${t("sentenceCase")}</button>`);bind=()=>$$("[data-case]").forEach(b=>b.onclick=()=>{$("#text").value=caseConvert($("#text").value,b.dataset.case)});}
if(x.id==="duplicate-lines"){body=field(t("textInput"),textarea("text"));body+=actionBar(`<button class="btn primary" id="do">${t("duplicate")}</button><button class="btn" id="copy">${t("copy")}</button><button class="btn" id="dl">${t("download")} TXT</button>`);bind=()=>{$("#do").onclick=()=>$("#text").value=[...new Set($("#text").value.split(/\r?\n/))].join("\n");$("#copy").onclick=()=>copyText($("#text").value);$("#dl").onclick=()=>downloadText($("#text").value,"toolbox-dz.txt");};}
if(x.id==="text-sorter"){body=field(t("textInput"),textarea("text"));body+=actionBar(`<button class="btn" data-sort="az">A-Z</button><button class="btn" data-sort="za">Z-A</button><button class="btn" data-sort="numup">Numbers ↑</button><button class="btn" data-sort="numdown">Numbers ↓</button>`);bind=()=>$$("[data-sort]").forEach(b=>b.onclick=()=>{let a=$("#text").value.split(/\r?\n/);a=b.dataset.sort==="az"?a.sort((x,y)=>x.localeCompare(y)):b.dataset.sort==="za"?a.sort((x,y)=>y.localeCompare(x)):a.sort((x,y)=>(Number(x)||0)-(Number(y)||0)*(b.dataset.sort==="numdown"?-1:1));$("#text").value=a.join("\n");});}
if(x.id==="text-cleaner"){body=field(t("textInput"),textarea("text"));body+=`<label class="check"><input id="spaces" type="checkbox" checked> Remove extra spaces</label><label class="check"><input id="empty" type="checkbox" checked> Remove empty lines</label><label class="check"><input id="trim" type="checkbox" checked> Trim lines</label><label class="check"><input id="dup" type="checkbox"> Remove duplicate lines</label>${actionBar(`<button class="btn primary" id="do">${t("clean")}</button>`)} `;bind=()=>$("#do").onclick=()=>{let a=$("#text").value.split(/\r?\n/);if($("#trim").checked)a=a.map(v=>v.trim());if($("#spaces").checked)a=a.map(v=>v.replace(/[ \t]+/g," "));if($("#empty").checked)a=a.filter(v=>v.length);if($("#dup").checked)a=[...new Set(a)];$("#text").value=a.join("\n");};}
shell(toolFrame(x,body));bind();
}
function caseConvert(s,c){if(c==="upper")return s.toUpperCase();if(c==="lower")return s.toLowerCase();if(c==="sentence")return s.toLowerCase().replace(/(^\s*\w|[.!?؟]\s*\w)/g,m=>m.toUpperCase());return s.toLowerCase().replace(/\b\w/g,m=>m.toUpperCase());}

function renderDevTool(x){
let body="",bind=()=>{};
if(x.id==="json-formatter"){body=field(t("jsonInput"),textarea("text"));body+=actionBar(`<button class="btn primary" id="format">${t("format")}</button><button class="btn" id="minify">${t("minify")}</button><button class="btn" id="copy">${t("copy")}</button><button class="btn" id="dl">${t("download")}</button>`);bind=()=>{const run=min=>{try{const v=JSON.parse($("#text").value);$("#text").value=JSON.stringify(v,null,min?0:2);setStatus($("#status"),"","ok")}catch(e){setStatus($("#status"),`${t("invalid")} ${e.message}`,"error")}};$("#format").onclick=()=>run(false);$("#minify").onclick=()=>run(true);$("#copy").onclick=()=>copyText($("#text").value);$("#dl").onclick=()=>downloadText($("#text").value,"data.json","application/json");};}
if(x.id==="base64"){body=field(t("textInput"),textarea("text"));body+=actionBar(`<button class="btn primary" id="enc">${t("encode")}</button><button class="btn" id="dec">${t("decode")}</button><button class="btn" id="copy">${t("copy")}</button>`);body+=`<div id="status" class="status"></div>`;bind=()=>{$("#enc").onclick=()=>{try{$("#text").value=utf8ToB64($("#text").value)}catch{setStatus($("#status"),t("error"),"error")}};$("#dec").onclick=()=>{try{$("#text").value=b64ToUtf8($("#text").value)}catch{setStatus($("#status"),t("invalid"),"error")}};$("#copy").onclick=()=>copyText($("#text").value)};}
if(x.id==="url-encoder"){body=field(t("textInput"),textarea("text"));body+=actionBar(`<button class="btn primary" id="enc">${t("encode")}</button><button class="btn" id="dec">${t("decode")}</button>`);bind=()=>{$("#enc").onclick=()=>$("#text").value=encodeURIComponent($("#text").value);$("#dec").onclick=()=>{try{$("#text").value=decodeURIComponent($("#text").value)}catch{toast(t("invalid"))}}};}
if(x.id==="html-formatter"){body=field("HTML",textarea("text"));body+=actionBar(`<button class="btn primary" id="format">${t("format")}</button><button class="btn" id="copy">${t("copy")}</button>`);bind=()=>{$("#format").onclick=()=>$("#text").value=formatHtml($("#text").value);$("#copy").onclick=()=>copyText($("#text").value)};}
if(x.id==="color-converter"){body=field("Color Picker",`<input id="picker" type="color" value="#2563eb"><div class="color-preview" id="preview"></div>`);body+=field("HEX",input("hex","text","#2563eb"));body+=field("RGB",input("rgb"));body+=field("HSL",input("hsl"));body+=actionBar(`<button class="btn primary" id="convert">${t("convert")}</button>`);bind=()=>{const update=()=>{const hex=$("#hex").value.trim();const rgb=hexToRgb(hex);if(!rgb)return;$("#rgb").value=`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;const hsl=rgbToHsl(rgb.r,rgb.g,rgb.b);$("#hsl").value=`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;$("#picker").value=hex;$("#preview").style.background=hex};$("#convert").onclick=update;$("#picker").oninput=()=>{$("#hex").value=$("#picker").value;update()};$("#hex").onchange=update;update()};}
shell(toolFrame(x,body));bind();
}
function utf8ToB64(s){const bytes=new TextEncoder().encode(s);let bin="";bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}
function b64ToUtf8(s){const bin=atob(s.trim());const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function formatHtml(s){let indent=0;return s.replace(/>\s*</g,"><").replace(/</g,"\n<").split("\n").filter(Boolean).map(line=>{if(/^<\//.test(line))indent=Math.max(0,indent-1);const out="  ".repeat(indent)+line.trim();if(/^<[^!/][^>]*>$/.test(line)&&!/<\/[^>]+>$/.test(line)&&!/\/>$/.test(line)&&!/^<(input|img|br|hr|meta|link)\b/i.test(line))indent++;return out}).join("\n").trim();}
function hexToRgb(hex){const m=hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return m?{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)}:null}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0,l=(max+min)/2;if(max!==min){const d=max-min;s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}h/=6}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)}}

function renderCalculator(x){
let body="",bind=()=>{};
if(x.id==="percentage"){body=field("X",input("x","number"));body+=field("Y",input("y","number"));body+=field("Original",input("old","number"));body+=field("New",input("new","number"));body+=actionBar(`<button class="btn primary" id="calc">${t("calculate")}</button>`)+`<div id="result" class="stats"></div>`;bind=()=>$("#calc").onclick=()=>{const x=Number($("#x").value),y=Number($("#y").value),o=Number($("#old").value),n=Number($("#new").value);$("#result").innerHTML=`<div class="stat"><span>${t("result")} 1</span><strong>${isFinite(x*y/100)?x*y/100:"—"}</strong></div><div class="stat"><span>${t("result")} 2</span><strong>${y?((x/y)*100).toFixed(2)+"%":"—"}</strong></div><div class="stat"><span>Change</span><strong>${o?(((n-o)/o)*100).toFixed(2)+"%":"—"}</strong></div>`};}
if(x.id==="age"){body=field(t("dob"),input("dob","date"));body+=actionBar(`<button class="btn primary" id="calc">${t("calculate")}</button>`)+`<div id="result" class="stats"></div>`;bind=()=>$("#calc").onclick=()=>{const d=new Date($("#dob").value+"T00:00:00"),now=new Date();if(!$("#dob").value||d>now){toast(t("invalid"));return}let y=now.getFullYear()-d.getFullYear(),m=now.getMonth()-d.getMonth(),day=now.getDate()-d.getDate();if(day<0){m--;day+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}$("#result").innerHTML=`<div class="stat"><span>Years</span><strong>${y}</strong></div><div class="stat"><span>Months</span><strong>${m}</strong></div><div class="stat"><span>Days</span><strong>${day}</strong></div>`};}
if(x.id==="bmi"){body=field(t("heightCm"),input("h","number","","min=1"));body+=field(t("weight"),input("w","number","","min=1"));body+=actionBar(`<button class="btn primary" id="calc">${t("calculate")}</button>`)+`<div id="result" class="stats"></div><p class="muted">BMI مجرد مؤشر عام وليس تشخيصًا طبيًا.</p>`;bind=()=>$("#calc").onclick=()=>{const h=Number($("#h").value)/100,w=Number($("#w").value);if(h<=0||w<=0){toast(t("invalid"));return}const bmi=w/(h*h);const cat=bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obesity";$("#result").innerHTML=`<div class="stat"><span>BMI</span><strong>${bmi.toFixed(1)}</strong></div><div class="stat"><span>Category</span><strong>${cat}</strong></div>`};}
if(x.id==="unit-converter"){body=field(t("unit"),`<select id="unit"><option value="length">Length</option><option value="weight">Weight</option><option value="temp">Temperature</option><option value="time">Time</option><option value="data">Data</option></select>`);body+=field(t("from"),`<select id="from"></select>`)+field(t("to"),`<select id="to"></select>`)+field(t("value"),input("value","number"));body+=actionBar(`<button class="btn primary" id="calc">${t("convert")}</button>`)+`<div id="result" class="stats"></div>`;bind=()=>{const sets={length:["km","miles","m","ft"],weight:["kg","lb"],temp:["c","f"],time:["seconds","minutes","hours"],data:["mb","gb"]};const fill=()=>{const a=sets[$("#unit").value];["from","to"].forEach(id=>$("#"+id).innerHTML=a.map(v=>`<option>${v}</option>`).join(""))};$("#unit").onchange=fill;fill();$("#calc").onclick=()=>{const v=Number($("#value").value),u=$("#unit").value,f=$("#from").value,to=$("#to").value;let r=convertUnit(v,u,f,to);$("#result").innerHTML=`<div class="stat"><span>${t("result")}</span><strong>${Number.isFinite(r)?r.toFixed(6).replace(/\.?0+$/,""):"—"}</strong></div>`};};}
if(x.id==="average"){body=field(t("numbers"),input("numbers","text","10,20,30,40"));body+=actionBar(`<button class="btn primary" id="calc">${t("calculate")}</button>`)+`<div id="result" class="stats"></div>`;bind=()=>$("#calc").onclick=()=>{const a=$("#numbers").value.split(/[,;\s]+/).map(Number).filter(Number.isFinite);if(!a.length){toast(t("invalid"));return}const sum=a.reduce((p,v)=>p+v,0);$("#result").innerHTML=[["Average",sum/a.length],["Sum",sum],["Count",a.length],["Minimum",Math.min(...a)],["Maximum",Math.max(...a)]].map(v=>`<div class="stat"><span>${v[0]}</span><strong>${typeof v[1]==="number"?v[1].toFixed(3).replace(/\.?0+$/,""):v[1]}</strong></div>`).join("")};}
shell(toolFrame(x,body));bind();
}
function convertUnit(v,u,f,t){if(!Number.isFinite(v))return NaN;if(f===t)return v;const maps={length:{km:1000,miles:1609.344,m:1,ft:.3048},weight:{kg:1,lb:.45359237},time:{seconds:1,minutes:60,hours:3600},data:{mb:1,gb:1024}};if(u==="temp"){const c=f==="c"?v:(f==="f"?(v-32)*5/9:v-273.15);return t==="c"?c:t==="f"?c*9/5+32:c+273.15}return v*maps[u][f]/maps[u][t]}

function renderStudent(x){
let body="",bind=()=>{};
if(x.id==="grade"){body=`<div id="rows"></div>${actionBar(`<button class="btn" id="add">+ ${t("subject")}</button><button class="btn primary" id="calc">${t("calculate")}</button>`)}<div id="result" class="stats"></div>`;bind=()=>{let rows=[0,1,2];const draw=()=>$("#rows").innerHTML=rows.map(i=>`<div class="form-grid"><div class="field"><label>${t("subject")}</label><input data-s="${i}" placeholder="Math"></div><div class="field"><label>${t("grade")}</label><input data-g="${i}" type="number" min="0"></div><div class="field"><label>${t("coefficient")}</label><input data-c="${i}" type="number" min="0" value="1"></div></div>`).join("");draw();$("#add").onclick=()=>{rows.push(rows.length);draw()};$("#calc").onclick=()=>{let num=0,den=0;rows.forEach(i=>{const g=Number($(`[data-g="${i}"]`).value),c=Number($(`[data-c="${i}"]`).value)||0;if(Number.isFinite(g)){num+=g*c;den+=c}});$("#result").innerHTML=`<div class="stat"><span>${t("average")}</span><strong>${den?(num/den).toFixed(2):"—"}</strong></div>`};};}
if(x.id==="gpa"){body=field(t("points"),input("points","text","4,3,3,4"));body+=field("Credits",input("credits","text","3,3,3,3"));body+=actionBar(`<button class="btn primary" id="calc">${t("calculate")}</button>`)+`<div id="result" class="stats"></div>`;bind=()=>$("#calc").onclick=()=>{const p=$("#points").value.split(/[,;\s]+/).map(Number),c=$("#credits").value.split(/[,;\s]+/).map(Number);let n=0,d=0;p.forEach((v,i)=>{if(Number.isFinite(v)){const cr=Number(c[i])||1;n+=v*cr;d+=cr}});$("#result").innerHTML=`<div class="stat"><span>GPA</span><strong>${d?(n/d).toFixed(2):"—"}</strong></div>`};}
if(x.id==="study-timer"){body=field(t("minutes"),input("work","number","25","min=1"))+field("Break",input("break","number","5","min=1"));body+=`<div class="timer" id="display">25:00</div>${actionBar(`<button class="btn primary" id="start">${t("start")}</button><button class="btn" id="pause">${t("pause")}</button><button class="btn" id="reset">${t("reset")}</button>`)}<div id="status" class="status"></div>`;bind=()=>timerBind("work","display","start","pause","reset","status",true);}
if(x.id==="stopwatch"){body=`<div class="timer" id="display">00:00.00</div>${actionBar(`<button class="btn primary" id="start">${t("start")}</button><button class="btn" id="pause">${t("pause")}</button><button class="btn" id="reset">${t("reset")}</button>`)}`;bind=()=>stopwatchBind();}shell(toolFrame(x,body));bind();}
function timerBind(inputId,disp,startId,pauseId,resetId){let total=Number($("#"+inputId).value)*60,started=false,end=0,int;const draw=()=>{const s=Math.max(0,Math.ceil((end-Date.now())/1000));$("#"+disp).textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;if(s<=0&&started){clearInterval(int);started=false;toast(t("result"))}};$("#"+startId).onclick=()=>{if(started)return;total=Number($("#"+inputId).value)*60;end=Date.now()+total*1000;started=true;int=setInterval(draw,100);draw()};$("#"+pauseId).onclick=()=>{if(started){total=Math.max(0,Math.ceil((end-Date.now())/1000));clearInterval(int);started=false}};$("#"+resetId).onclick=()=>{clearInterval(int);started=false;total=Number($("#"+inputId).value)*60;$("#"+disp).textContent=`${String(Math.floor(total/60)).padStart(2,"0")}:00`};}
function stopwatchBind(){let running=false,start=0,elapsed=0,int;const draw=()=>{const ms=elapsed+(running?Date.now()-start:0);$("#display").textContent=`${String(Math.floor(ms/60000)).padStart(2,"0")}:${String(Math.floor(ms/1000)%60).padStart(2,"0")}.${String(Math.floor(ms%1000/10)).padStart(2,"0")}`};$("#start").onclick=()=>{if(!running){start=Date.now();running=true;int=setInterval(draw,30)}};$("#pause").onclick=()=>{if(running){elapsed+=Date.now()-start;running=false;clearInterval(int);draw()}};$("#reset").onclick=()=>{running=false;elapsed=0;clearInterval(int);draw()};}

function renderUtility(x){
let body="",bind=()=>{};
if(x.id==="random"){body=field(t("min"),input("min","number","1"))+field(t("max"),input("max","number","100"));body+=actionBar(`<button class="btn primary" id="go">${t("generate")}</button>`)+`<div id="result" class="timer"></div>`;bind=()=>$("#go").onclick=()=>{let a=Number($("#min").value),b=Number($("#max").value);if(a>b)[a,b]=[b,a];$("#result").textContent=Math.floor(Math.random()*(b-a+1))+a};}
if(x.id==="password"){body=field(t("length"),input("length","number","16","min=4 max=256"));body+=`<label class="check"><input id="upper" type="checkbox" checked> ${t("upper")}</label><label class="check"><input id="lower" type="checkbox" checked> ${t("lower")}</label><label class="check"><input id="num" type="checkbox" checked> ${t("numbersOpt")}</label><label class="check"><input id="sym" type="checkbox" checked> ${t("symbols")}</label>${actionBar(`<button class="btn primary" id="go">${t("generate")}</button><button class="btn" id="copy">${t("copy")}</button>`)}${field(t("result"),input("result"))}<p class="muted">يتم الإنشاء محليًا داخل المتصفح ولا يتم إرسال كلمة المرور إلى السيرفر.</p>`;bind=()=>{$("#go").onclick=()=>{$("#result").value=generatePassword(Number($("#length").value),$("#upper").checked,$("#lower").checked,$("#num").checked,$("#sym").checked)};$("#copy").onclick=()=>copyText($("#result").value)};}
if(x.id==="qr"){body=field(t("qrText"),input("text","text","https://example.com"));body+=`<div id="qrArea" class="preview"></div>${actionBar(`<button class="btn primary" id="go">${t("generate")}</button><button class="btn" id="dl">${t("download")} PNG</button>`)}`;bind=()=>{let canvas;$("#go").onclick=async()=>{const text=$("#text").value.trim();if(!text){toast(t("invalid"));return}try{const r=await fetch("/api/qr",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});if(!r.ok)throw Error("qr");const blob=await r.blob();const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{$("#qrArea").replaceChildren(img);canvas=img;URL.revokeObjectURL(url)};img.src=url}catch{toast(t("error"))}};$("#dl").onclick=()=>{if(canvas&&canvas.src){const a=document.createElement("a");a.href=canvas.src;a.download="toolbox-dz-qr.png";a.click()}else toast(t("generate"))};};}
if(x.id==="timer"){body=field(t("minutes"),input("minutes","number","5","min=0"))+field(t("seconds"),input("seconds","number","0","min=0 max=59"));body+=`<div class="timer" id="display">05:00</div>${actionBar(`<button class="btn primary" id="start">${t("start")}</button><button class="btn" id="pause">${t("pause")}</button><button class="btn" id="reset">${t("reset")}</button>`)}`;bind=()=>timerBindSeconds();}
if(x.id==="countdown"){body=field("Date & Time",input("date","datetime-local"));body+=`<div class="timer" id="display">--:--:--</div>`;bind=()=>{let int;const draw=()=>{const d=new Date($("#date").value).getTime()-Date.now();if(!Number.isFinite(d)){return}const s=Math.max(0,Math.floor(d/1000)),days=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;$("#display").textContent=`${days}d ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`};$("#date").oninput=()=>{clearInterval(int);draw();int=setInterval(draw,1000)};};}
if(x.id==="tts"){body=field(t("textToSpeak"),textarea("text"));body+=field(t("voice"),`<select id="voice"></select>`)+actionBar(`<button class="btn primary" id="speak">${t("start")}</button><button class="btn" id="stop">${t("stop")}</button>`);bind=()=>{const load=()=>{$("#voice").innerHTML=speechSynthesis.getVoices().map((v,i)=>`<option value="${i}">${escapeHtml(v.name)} — ${escapeHtml(v.lang)}</option>`).join("")};load();speechSynthesis.onvoiceschanged=load;$("#speak").onclick=()=>{const u=new SpeechSynthesisUtterance($("#text").value),v=speechSynthesis.getVoices()[Number($("#voice").value)];if(v)u.voice=v;speechSynthesis.speak(u)};$("#stop").onclick=()=>speechSynthesis.cancel()};}
if(x.id==="markdown"){body=`<div class="two-pane">${field("Markdown",textarea("text","# ToolBox DZ\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2"))}<div><label>${t("output")}</label><div id="preview" class="preview markdown-preview"></div></div></div>`;bind=()=>{$("#text").oninput=()=>$("#preview").innerHTML=markdownSafe($("#text").value);$("#text").oninput()};}
shell(toolFrame(x,body));bind();}
function timerBindSeconds(){let running=false,end=0,int;const get=()=>Number($("#minutes").value)*60+Number($("#seconds").value);const draw=()=>{let s=Math.max(0,Math.ceil((end-Date.now())/1000));$("#display").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;if(s===0&&running){running=false;clearInterval(int);toast(t("result"))}};$("#start").onclick=()=>{if(!running){end=Date.now()+get()*1000;running=true;int=setInterval(draw,100);draw()}};$("#pause").onclick=()=>{if(running){const left=Math.max(0,Math.ceil((end-Date.now())/1000));$("#minutes").value=Math.floor(left/60);$("#seconds").value=left%60;running=false;clearInterval(int)}};$("#reset").onclick=()=>{running=false;clearInterval(int);draw()};}
function generatePassword(len,u,l,n,s){let chars="";if(u)chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";if(l)chars+="abcdefghijklmnopqrstuvwxyz";if(n)chars+="0123456789";if(s)chars+="!@#$%^&*()_+-=[]{}";if(!chars)return "";const a=new Uint32Array(len);crypto.getRandomValues(a);return [...a].map(v=>chars[v%chars.length]).join("")}
function markdownSafe(s){let e=escapeHtml(s);e=e.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/^- (.*)$/gm,"<li>$1</li>").replace(/(?:<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`).replace(/\n\n/g,"<br><br>").replace(/\n/g,"<br>");return e}
function renderGaming(x){
let body="",bind=()=>{};
if(x.id==="fps-guide"){body=field(t("gpu"),`<select id="gpu"><option>Entry GPU</option><option>Mid-range GPU</option><option>High-end GPU</option></select>`)+field(t("resolution"),`<select id="res"><option>1280×720</option><option selected>1920×1080</option><option>2560×1440</option><option>3840×2160</option></select>`)+field(t("qualitySetting"),`<select id="quality"><option>Low</option><option selected>Medium</option><option>High</option><option>Ultra</option></select>`)+actionBar(`<button class="btn primary" id="go">${t("generate")}</button>`)+`<div id="result" class="preview"></div>`;bind=()=>$("#go").onclick=()=>{const q=$("#quality").value,r=$("#res").value,g=$("#gpu").value;let advice=q==="Ultra"?"استخدمها فقط مع GPU قوي، وراقب الحرارة.":"ابدأ بهذه الجودة ثم عدّلها حسب استقرار الأداء.";if(r.includes("3840"))advice+=" الدقة 4K تحتاج قدرة رسومية كبيرة.";if(g.includes("Entry"))advice+=" مع بطاقة دخول، خفض الدقة والجودة قد يحسن الاستقرار.";$("#result").textContent=`${t("tip")}: ${advice} هذه أداة إرشادية وليست قياس FPS حقيقي.`};}
if(x.id==="sensitivity"){body=field(t("sensitivity"),input("s","number","1"))+field("Conversion ratio",input("ratio","number","1","step=0.001"));body+=actionBar(`<button class="btn primary" id="go">${t("convert")}</button>`)+`<div id="result" class="timer"></div><p class="muted">المعادلة هنا حساسية × معامل التحويل. لا تمثل تحويلًا رسميًا بين الألعاب.</p>`;bind=()=>$("#go").onclick=()=>$("#result").textContent=(Number($("#s").value)*Number($("#ratio").value)).toFixed(4).replace(/\.?0+$/,"");}
shell(toolFrame(x,body));bind();}
function renderPage(path){
if(path==="/")return renderHome();
if(path==="/tools"||path==="/tools/")return renderTools();
const slug=path.replace(/^\/tools\//,"");const x=tools.find(v=>v.id===slug);
if(x){if(x.cat==="image")return imageTool(x,{ "image-compressor":"compress","image-resizer":"resize","image-converter":"convert","image-cropper":"crop"}[x.id]);if(x.cat==="text")return renderTextTool(x);if(x.cat==="developer")return renderDevTool(x);if(x.cat==="calculator")return renderCalculator(x);if(x.cat==="student")return renderStudent(x);if(x.cat==="gaming")return renderGaming(x);return renderUtility(x);}
const pages={
"/about":[t("about"),"ToolBox DZ هو موقع أدوات مجانية وسريعة تساعد المستخدمين على إنجاز المهام اليومية بدون الحاجة إلى تثبيت برامج كثيرة."],
"/privacy":[t("privacy"),"معظم أدوات ToolBox DZ تعمل داخل المتصفح. الصور والنصوص وكلمات المرور لا تُرسل إلى السيرفر لتتم معالجتها. لا تحفظ الخدمة بيانات حساسة في الخادم."],
"/terms":[t("terms"),"استخدم الأدوات كما هي وعلى مسؤوليتك. النتائج الحسابية والإرشادات العامة ليست بديلًا عن المختصين عند الحاجة."],
"/contact":[t("contact"),"للتواصل، غيّر YOUR_EMAIL@example.com في ملف public/app.js أو استخدم وسيلة التواصل التي تضيفها أنت. لا يوجد نموذج إرسال خلفي في هذه النسخة."]
};
if(pages[path]){const [h,p]=pages[path];shell(`<div class="page-copy"><h1>${h}</h1><div class="card"><p>${p}</p></div></div>`);return;}
shell(`<div class="empty"><h1>404</h1><p>${t("noResults")}</p><button class="btn primary" id="goHome">${t("home")}</button></div>`);$("#goHome").onclick=()=>navigate("/");
}
function render(){renderPage(location.pathname)}
window.addEventListener("popstate",render);render();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
})();