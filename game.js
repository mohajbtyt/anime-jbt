// Subway Runner - v1 (Vanilla JS)
// تعليمات: ضع الملفات الثلاثة في نفس المجلد وافتح index.html
// ملاحظات: قم بإضافة أصوات في مجلد assets وأضف مساراتها إن رغبت.

(() => {
  const area = document.getElementById('game-area');
  const player = document.getElementById('player');
  const cop = document.getElementById('cop');
  const objects = document.getElementById('objects');
  const startScreen = document.getElementById('startScreen');
  const shop = document.getElementById('shop');
  const shopItemsDiv = document.getElementById('shopItems');
  const startBtn = document.getElementById('startBtn');
  const shopOpen = document.getElementById('shopOpen');
  const closeShop = document.getElementById('closeShop');
  const pauseBtn = document.getElementById('pauseBtn');
  const gameOver = document.getElementById('gameOver');
  const restartBtn = document.getElementById('restartBtn');
  const toMenu = document.getElementById('toMenu');
  const scoreVal = document.getElementById('scoreVal');
  const coinsVal = document.getElementById('coinsVal');
  const finalScore = document.getElementById('finalScore');
  const finalCoins = document.getElementById('finalCoins');

  // لعبة حالة
  let running = false;
  let paused = false;
  let tick = 0;
  let speed = 3; // سرعة اجسام تتحرك نحو اللاعب
  let score = 0;
  let coins = 0;

  // اللاعب
  let lane = 1; // 0/1/2 (يسار/وسط/يمين)
  let vy = 0;
  let jumping = false;
  let sliding = false;
  let yOffset = 0;

  // المتجر والقدرات (محلي)
  const store = [
    { id:'speed', title:'سرعة تشغيل أعلى', price:150, apply:()=> speed += 1 },
    { id:'magnet', title:'مغناطيس (يجمع العملات تلقائياً)', price:120, apply:()=> localState.magnet = true },
    { id:'double', title:'قفزة مزدوجة', price:200, apply:()=> localState.doubleJump = true }
  ];

  const localState = JSON.parse(localStorage.getItem('b25_state') || '{}');
  if(!localState.coins) localState.coins = localState.coins || 0;
  if(!localState.owned) localState.owned = localState.owned || {};
  if(!localState.magnet) localState.magnet = localState.magnet || false;
  if(!localState.doubleJump) localState.doubleJump = localState.doubleJump || false;

  // تحديث UI
  function updateUI() {
    coinsVal.innerText = localState.coins;
    scoreVal.innerText = score;
  }

  // تحريك اللاعب أفقياً إلى المسار المختار
  function updatePlayerTransform(){
    const areaW = area.clientWidth;
    const laneW = areaW / 3;
    const cx = laneW * lane + laneW/2;
    const px = cx - (player.clientWidth/2);
    player.style.transform = `translateX(${px}px) translateY(${yOffset}px)`;
    player.dataset.lane = lane;
  }

  // قفز + انزلاق
  let canDouble = true;
  function doJump(){
    if(jumping === false){
      vy = -12;
      jumping = true;
      canDouble = true;
      player.classList.add('jumping');
      setTimeout(()=>player.classList.remove('jumping'), 200);
    } else if(localState.doubleJump && canDouble){
      vy = -12; canDouble = false; // قفزة مزدوجة
    }
  }
  function doSlide(){
    if(!sliding && !jumping){
      sliding = true;
      player.classList.add('sliding');
      setTimeout(()=>{ sliding=false; player.classList.remove('sliding') }, 700);
    }
  }

  // توليد عناصر: عملات - عقبات
  function spawnObject(type, laneIndex){
    const el = document.createElement('div');
    el.className = type === 'coin' ? 'obj' : (type === 'power' ? 'obj power' : 'obstacle');
    el.dataset.type = type;
    el.dataset.lane = laneIndex;
    // موقع أفقي: center of lane
    const areaW = area.clientWidth;
    const laneW = areaW / 3;
    const px = laneIndex * laneW + laneW/2 - 24;
    el.style.left = px + 'px';
    // ارتفاع عشوائي قليل
    el.style.bottom = '12%';
    objects.appendChild(el);
    return el;
  }

  // تنظيف عناصر بعيدة
  function cleanObjects(){
    [...objects.children].forEach(ch=>{
      const rect = ch.getBoundingClientRect();
      if(rect.top > window.innerHeight + 100 || rect.left < -200){
        ch.remove();
      }
    });
  }

  // الاصطدام
  function checkCollision(){
    const playerRect = player.getBoundingClientRect();
    [...objects.children].forEach(obj=>{
      const r = obj.getBoundingClientRect();
      const type = obj.dataset.type;
      // بسيط: لو نفس المسار ونقارب X
      if(obj.dataset.lane == player.dataset.lane){
        // قارنه بمركزين
        if(Math.abs(r.left - playerRect.left) < 40){
          if(type === 'coin'){
            coins += 1;
            localState.coins += 1;
            obj.remove();
          } else if(type === 'obstacle'){
            // لو في انزلاق وتجاوز الارتفاع -> امن
            if(sliding) {
              // يتجاوز
            } else {
              // Game Over
              gameOverShow();
            }
          } else if(type === 'power'){
            // منح قدرة بسيطة مثل زيادة نقاط
            score += 50;
            obj.remove();
          }
        }
      }
    });
  }

  // شاشة Game Over
  function gameOverShow(){
    running = false;
    gameOver.classList.remove('hidden');
    finalScore.innerText = score;
    finalCoins.innerText = coins;
    localStorage.setItem('b25_state', JSON.stringify(localState));
  }

  // توليد الموجات
  function gameTick(){
    if(!running || paused) return;
    tick++;
    // حركة الـ objects نحو اليسار (نحو اللاعب) بزيادة السرعة
    [...objects.children].forEach(obj=>{
      const cur = parseFloat(getComputedStyle(obj).left);
      obj.style.left = (cur - speed*1.8) + 'px';
      // بسيط: تصغير على الارتفاع ليوهم الحركة
      const bottom = parseFloat(obj.style.bottom);
      obj.style.bottom = (bottom + 0) + '%';
    });

    // تحرك cop نحو اليمين (يقرب منك)
    const copX = parseFloat(cop.style.transform.match(/translateX\((-?\d+)px\)/)?.[1] || -120);
    const newCopX = copX + (speed*0.7);
    cop.style.transform = `translateX(${newCopX}px)`;

    // حركة الجاذبية للاعب
    if(jumping){
      vy += 0.6;
      yOffset += vy;
      if(yOffset >= 0){
        yOffset = 0;
        vy = 0;
        jumping = false;
      }
      updatePlayerTransform();
    }

    // تصادم
    checkCollision();

    // نقاط تزداد تدريجياً
    score += 1;
    if(tick % 50 === 0) {
      // أحيانًا توليد عملات/عقبات
      const laneIdx = Math.floor(Math.random()*3);
      const p = Math.random();
      if(p < 0.6) spawnObject('coin', laneIdx);
      else if(p < 0.9) spawnObject('obstacle', laneIdx);
      else spawnObject('power', laneIdx);
    }

    // مرّة كل 400 ticks تزيد السرعة قليلًا
    if(tick % 400 === 0) speed += 0.3;

    updateUI();
    cleanObjects();
    // تحقق إذا الشرطي لحق اللاعب (copX تقريباً >= left of player)
    if(newCopX >= area.clientWidth/3 - 20){
      gameOverShow();
    }

    requestAnimationFrame(gameTick);
  }

  // التحكم باللمس/سحب (mobile)
  let startTouch = null;
  area.addEventListener('touchstart', (e)=>{
    if(!running) return;
    const t = e.touches[0];
    startTouch = {x: t.clientX, y: t.clientY};
  });
  area.addEventListener('touchend', (e)=>{
    if(!running || !startTouch) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startTouch.x;
    const dy = t.clientY - startTouch.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if(adx > ady){
      // أفقي
      if(dx > 30) { // يمين
        lane = Math.min(2, lane + 1); updatePlayerTransform();
      } else if(dx < -30) { // يسار
        lane = Math.max(0, lane - 1); updatePlayerTransform();
      }
    } else {
      // عمودي
      if(dy < -30) doJump();
      else if(dy > 30) doSlide();
    }
    startTouch = null;
  });

  // لوحة المفاتيح
  document.addEventListener('keydown', (e)=>{
    if(!running) return;
    if(e.key === 'ArrowLeft') { lane = Math.max(0, lane -1); updatePlayerTransform(); }
    if(e.key === 'ArrowRight') { lane = Math.min(2, lane +1); updatePlayerTransform(); }
    if(e.key === 'ArrowUp') doJump();
    if(e.key === 'ArrowDown') doSlide();
  });

  // المتجر: عرض البنود
  function renderShop(){
    shopItemsDiv.innerHTML = '';
    store.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `<h4>${item.title}</h4><p>السعر: ${item.price}</p>`;
      const btn = document.createElement('button');
      btn.innerText = localState.owned[item.id] ? 'مملوك' : 'اشتري';
      btn.disabled = !!localState.owned[item.id];
      btn.onclick = ()=>{
        if(localState.coins >= item.price){
          localState.coins -= item.price;
          localState.owned[item.id] = true;
          item.apply();
          localStorage.setItem('b25_state', JSON.stringify(localState));
          renderShop();
          updateUI();
          alert('تم الشراء ✔');
        } else {
          alert('لا توجد عملات كافية');
        }
      };
      div.appendChild(btn);
      shopItemsDiv.appendChild(div);
    });
  }

  // أزرار التحكم
  startBtn.onclick = ()=>{
    startScreen.classList.add('hidden');
    running = true;
    paused = false;
    tick = 0; score = 0; coins = 0; speed = 3;
    objects.innerHTML = '';
    cop.style.transform = 'translateX(-120px)';
    updatePlayerTransform();
    requestAnimationFrame(gameTick);
  };

  shopOpen.onclick = ()=>{
    startScreen.classList.add('hidden');
    shop.classList.remove('hidden');
    renderShop();
  };
  closeShop.onclick = ()=>{
    shop.classList.add('hidden');
    startScreen.classList.remove('hidden');
  };

  pauseBtn.onclick = ()=>{
    paused = !paused;
    pauseBtn.innerText = paused ? '▶' : '⏸';
    if(!paused) requestAnimationFrame(gameTick);
  };

  restartBtn.onclick = ()=>{
    gameOver.classList.add('hidden');
    startScreen.classList.remove('hidden');
    localState.coins = localState.coins || 0;
    localStorage.setItem('b25_state', JSON.stringify(localState));
  };
  toMenu.onclick = ()=> {
    gameOver.classList.add('hidden');
    startScreen.classList.remove('hidden');
  };

  // تحديثات دورية UI
  updatePlayerTransform();
  updateUI();

  // حفظ تلقائي قبل الخروج
  window.addEventListener('beforeunload', ()=>{
    localStorage.setItem('b25_state', JSON.stringify(localState));
  });

  // مفاتيح اختبار سريعة (للمطور)
  // ضع في console: localState.coins = 500; localStorage.setItem('b25_state', JSON.stringify(localState));
})();