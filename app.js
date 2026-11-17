/* Мил-преп: логика приложения. Данные — в data.js */
(function () {
  'use strict';

  const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MEALS = [
    { k: 'breakfast', n: 'Завтрак', ic: '🍳' },
    { k: 'lunch', n: 'Обед', ic: '🍱' },
    { k: 'snack', n: 'Полдник', ic: '🍎' },
    { k: 'dinner', n: 'Ужин', ic: '🍝' }
  ];
  const MEAL_KEYS = MEALS.map(m => m.k);
  const STORE_KEY = 'mealprep.v1';

  // ---------- хранилище (с запасным вариантом в памяти) ----------
  let memStore = null;
  function loadRaw() {
    try { const s = localStorage.getItem(STORE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return memStore; }
  }
  function saveRaw(obj) {
    memStore = obj;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* без хранилища работаем в памяти */ }
  }

  // ---------- даты ----------
  const DAY_MS = 864e5;
  function pad(n) { return String(n).padStart(2, '0'); }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function sundayOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - x.getDay()); return x; }
  function fmtDM(d) { return pad(d.getDate()) + '.' + pad(d.getMonth() + 1); }

  // ---------- состояние ----------
  function defaults() {
    return {
      mode: 'auto', startDate: isoDate(sundayOf(new Date())), order: [1, 2, 3, 4, 5, 6, 7, 8], manualWeek: 1,
      priceMode: 'extra', mult: 1,
      targets: { kcal: 2500, p: 120, f: 80, c: 325, fi: 35 },
      budget: { goal: 4000, max: 6000 },
      prices: {}, skips: {}, have: {}, bought: {}, stock: {}, cooked: {}, viewWeek: null
    };
  }
  let S = (function () {
    const d = defaults(); const saved = loadRaw();
    if (saved && typeof saved === 'object') {
      Object.keys(d).forEach(k => {
        if (saved[k] === undefined) return;
        d[k] = (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) ? Object.assign(d[k], saved[k]) : saved[k];
      });
    }
    return d;
  })();
  const UI = { tab: 'today', more: 'weeks', open: {} };
  function save() { saveRaw(S); }

  // ---------- текущая неделя ----------
  function curInfo() {
    const today = new Date(); const sun = sundayOf(today);
    let idx = 0, no;
    if (S.mode === 'manual') { no = S.manualWeek; }
    else {
      const el = Math.round((sun - sundayOf(parseISO(S.startDate))) / (7 * DAY_MS));
      const n = S.order.length; idx = ((el % n) + n) % n; no = S.order[idx];
    }
    return { no, idx, sun, sunISO: isoDate(sun), dayIdx: today.getDay() };
  }
  function nextWeekNo(ci) {
    if (S.mode === 'manual') return S.manualWeek;
    return S.order[(ci.idx + 1) % S.order.length];
  }
  function activeWeek() {
    const ci = curInfo();
    if (S.viewWeek && S.viewWeek !== ci.no) return { no: S.viewWeek, sunISO: null, preview: true, ci };
    return { no: ci.no, sunISO: ci.sunISO, preview: false, ci };
  }

  // ---------- расчёты ----------
  function price(pid) {
    if (S.prices[pid] != null && S.prices[pid] !== '') return Number(S.prices[pid]);
    const p = PRODUCTS[pid];
    return (S.priceMode === 'se' && p.priceSE != null) ? p.priceSE : p.price;
  }
  function dishNut(id) {
    const d = DISHES[id]; const r = { kcal: 0, p: 0, f: 0, c: 0, fi: 0, cost: 0 };
    Object.keys(d.ing).forEach(pid => {
      const g = d.ing[pid] * S.mult, x = PRODUCTS[pid];
      r.kcal += x.kcal * g / 100; r.p += x.p * g / 100; r.f += x.f * g / 100;
      r.c += x.c * g / 100; r.fi += x.fi * g / 100; r.cost += price(pid) * g / 1000;
    });
    return r;
  }
  function skipKey(sunISO, d, m) { return sunISO + '|' + d + '|' + m; }
  function isSkipped(sunISO, d, m) { return !!(sunISO && S.skips[skipKey(sunISO, d, m)]); }
  function portions(sunISO, m) {
    let n = 7; if (!sunISO) return n;
    for (let d = 0; d < 7; d++) if (isSkipped(sunISO, d, m)) n--;
    return n;
  }
  function dayNut(no, sunISO, d) {
    const w = WEEKS[no - 1]; const r = { kcal: 0, p: 0, f: 0, c: 0, fi: 0 };
    MEAL_KEYS.forEach(m => {
      if (isSkipped(sunISO, d, m)) return;
      const n = dishNut(w[m]); Object.keys(r).forEach(k => { r[k] += n[k]; });
    });
    return r;
  }
  function fullDay(no) { return dayNut(no, null, 0); }
  function shopAgg(no, sunISO) {
    const w = WEEKS[no - 1]; const agg = {};
    MEAL_KEYS.forEach(m => {
      const cnt = portions(sunISO, m); const d = DISHES[w[m]];
      Object.keys(d.ing).forEach(pid => { agg[pid] = (agg[pid] || 0) + d.ing[pid] * S.mult * cnt; });
    });
    return agg;
  }
  function weekCost(no, sunISO, useHave) {
    const agg = shopAgg(no, sunISO); let total = 0;
    Object.keys(agg).forEach(pid => {
      const p = PRODUCTS[pid];
      if (useHave && !p.pantry && S.have[(sunISO || 'p') + '|' + pid]) return;
      total += price(pid) * agg[pid] / 1000;
    });
    return total;
  }
  function frozenFrom(no, m) { return (m === 'lunch' && DISHES[WEEKS[no - 1].lunch].fish) ? 3 : 4; }
  function isFrozen(no, m, d) { return (m === 'lunch' || m === 'dinner') && d >= frozenFrom(no, m); }
  function weekGoal() { return S.budget.goal * 12 / 52; }
  function weekMax() { return S.budget.max * 12 / 52; }

  // ---------- форматирование ----------
  const r0 = x => Math.round(x);
  function fmtG(pid, g) {
    const p = PRODUCTS[pid]; const unit = p.liquid ? 'мл' : 'г';
    let s;
    if (g >= 1000 && !p.liquid) s = (Math.round(g / 10) / 100).toString().replace('.', ',') + ' кг';
    else if (g >= 1000) s = (Math.round(g / 10) / 100).toString().replace('.', ',') + ' л';
    else s = (g < 20 ? Math.round(g * 10) / 10 : Math.round(g / 5) * 5) + ' ' + unit;
    if (p.pc && g >= p.pc * 0.8) s += ' (≈ ' + Math.round(g / p.pc) + ' шт)';
    else if (p.pack && !p.pantry && g >= p.pack * 0.8) s += ' (≈ ' + Math.round(g / p.pack * 10) / 10 + ' уп.)';
    return s;
  }
  function money(x) { return Math.round(x).toLocaleString('ru-RU').replace(/ /g, ' ') + ' NOK'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function dishLine(pid, g) { const p = PRODUCTS[pid]; return `<li><span>${esc(p.ru)} <em>(${esc(p.no)})</em></span><b>${fmtG(pid, g)}</b></li>`; }

  function macroChips(n) {
    return `<span class="chip kcal">${r0(n.kcal)} ккал</span><span class="chip">Б ${r0(n.p)}</span><span class="chip">Ж ${r0(n.f)}</span><span class="chip">У ${r0(n.c)}</span><span class="chip">Кл ${r0(n.fi)}</span>`;
  }
  function bar(val, target, label) {
    const pc = Math.min(100, val / target * 100);
    const cls = val / target > 1.15 ? 'hi' : (val / target < 0.85 ? 'lo' : 'ok');
    return `<div class="bar-row"><span>${label}</span><div class="bar"><i class="${cls}" style="width:${pc}%"></i></div><b>${r0(val)} / ${r0(target)}</b></div>`;
  }
  function budgetBar(cost) {
    const g = weekGoal(), m = weekMax(); const pc = Math.min(100, cost / m * 100), gp = g / m * 100;
    const cls = cost > m ? 'hi' : (cost > g ? 'mid' : 'ok');
    const left = g - cost;
    const msg = cost > m ? `Выше потолка на ${money(cost - m)}` : (left >= 0 ? `До цели осталось ${money(left)}` : `Выше цели на ${money(-left)}, потолок ${money(m)}`);
    return `<div class="budget"><div class="bar wide"><i class="${cls}" style="width:${pc}%"></i><u style="left:${gp}%"></u></div>
      <div class="bnote"><b>${money(cost)}</b> в неделю · ≈ ${money(cost * 52 / 12)} в месяц<br><small>${msg} (цель ${money(g)}, потолок ${money(m)} в неделю)</small></div></div>`;
  }

  // ---------- разметка экранов ----------
  function weekBanner(aw) {
    if (!aw.preview) return '';
    return `<div class="notice">Просмотр недели ${aw.no} (не текущая). <button class="link" data-act="clearView">Вернуться к неделе ${aw.ci.no}</button></div>`;
  }

  function renderToday() {
    const ci = curInfo(); const no = ci.no; const w = WEEKS[no - 1]; const d = ci.dayIdx;
    const tomorrow = (d + 1) % 7;
    let notes = '';
    if (d === 0) notes += `<div class="notice cook">Сегодня воскресенье: готовим на неделю (около 2 часов). <button class="link" data-act="tab" data-arg="cook">План готовки</button></div>`;
    if (d === 6) notes += `<div class="notice">Завтра готовка. Купите продукты по списку на неделю ${nextWeekNo(ci)}. <button class="link" data-act="viewNext">Открыть список</button></div>`;
    if (d !== 6) {
      const out = [];
      ['lunch', 'dinner'].forEach(m => {
        if (isFrozen(no, m, tomorrow) && !isSkipped(ci.sunISO, tomorrow, m)) out.push((m === 'lunch' ? 'обед' : 'ужин') + ' «' + DISHES[w[m]].name + '»');
      });
      if (out.length) notes += `<div class="notice freeze">❄ Вечером достань из морозилки на завтра: ${out.join(' и ')}.</div>`;
    }
    const dn = dayNut(no, ci.sunISO, d);
    const t = S.targets;
    let cards = '';
    MEALS.forEach(m => {
      const id = w[m.k]; const dish = DISHES[id]; const n = dishNut(id); const sk = isSkipped(ci.sunISO, d, m.k);
      const frozen = isFrozen(no, m.k, d);
      const where = (m.k === 'lunch' || m.k === 'dinner') ? (d === 0 ? '<span class="tag fresh">свежее</span>' : (frozen ? '<span class="tag frz">из морозилки (с вечера в холодильник)</span>' : '<span class="tag fr">из холодильника</span>')) : (m.k === 'breakfast' ? '<span class="tag">собирается утром</span>' : '<span class="tag">без готовки</span>');
      const oid = 't-' + m.k;
      cards += `<article class="card meal ${sk ? 'skipped' : ''}">
        <div class="mh"><span class="mi">${m.ic}</span><div><div class="mt">${m.n} ${where}</div><h3>${esc(dish.name)}</h3></div></div>
        <div class="chips">${macroChips(n)}</div>
        <details data-id="${oid}" ${UI.open[oid] ? 'open' : ''}><summary>Состав и приготовление</summary>
          <ul class="ing">${Object.keys(dish.ing).map(pid => dishLine(pid, dish.ing[pid] * S.mult)).join('')}</ul>
          <ol class="steps">${dish.steps.map(s => '<li>' + esc(s) + '</li>').join('')}</ol></details>
        <button class="btn ${sk ? 'ghost' : 'outline'}" data-act="skip" data-d="${d}" data-m="${m.k}">${sk ? 'Вернуть приём пищи' : 'Пропустить приём пищи'}</button>
      </article>`;
    });
    return `<section>
      <div class="hero"><div><div class="hl">${DAYS[d]}, ${fmtDM(new Date())}</div><h1>Неделя ${no}</h1><div class="hs">${S.mode === 'auto' ? 'автоматически по календарю' : 'выбрана вручную'}${S.mult !== 1 ? ' · порции ×' + S.mult : ''}</div></div></div>
      ${notes}
      <article class="card"><h2>Итого за день</h2>
        ${bar(dn.kcal, t.kcal * S.mult, 'Калории')}${bar(dn.p, t.p, 'Белок, г')}${bar(dn.f, t.f, 'Жиры, г')}${bar(dn.c, t.c, 'Углеводы, г')}${bar(dn.fi, t.fi, 'Клетчатка, г')}
      </article>${cards}</section>`;
  }

  function renderWeek() {
    const aw = activeWeek(); const no = aw.no; const w = WEEKS[no - 1];
    let rows = '';
    for (let d = 0; d < 7; d++) {
      const dn = dayNut(no, aw.sunISO, d);
      const isToday = !aw.preview && d === aw.ci.dayIdx;
      rows += `<div class="drow ${isToday ? 'today' : ''}"><div class="dn"><b>${SHORT[d]}</b><small>${r0(dn.kcal)} ккал</small></div><div class="dm">` +
        MEALS.map(m => {
          const sk = isSkipped(aw.sunISO, d, m.k); const fz = isFrozen(no, m.k, d);
          return `<button class="mb ${sk ? 'sk' : ''}" ${aw.preview ? 'disabled' : ''} data-act="skip" data-d="${d}" data-m="${m.k}" title="${m.n}">${m.ic}${fz ? '<i>❄</i>' : ''}</button>`;
        }).join('') + `</div></div>`;
    }
    const days = [0, 1, 2, 3, 4, 5, 6].map(d => dayNut(no, aw.sunISO, d));
    const avg = { kcal: 0, p: 0, f: 0, c: 0, fi: 0 };
    days.forEach(x => Object.keys(avg).forEach(k => avg[k] += x[k] / 7));
    const t = S.targets;
    const list = MEALS.map(m => `<li><span>${m.ic} ${m.n}</span><b>${esc(DISHES[w[m.k]].name)}</b></li>`).join('');
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">Меню</div><h1>Неделя ${no}</h1><div class="hs">${aw.preview ? 'просмотр' : 'с воскресенья ' + fmtDM(parseISO(aw.sunISO))}</div></div></div>
      <article class="card"><h2>Блюда недели</h2><ul class="kv">${list}</ul></article>
      <article class="card"><h2>По дням</h2><p class="hint">Нажмите на значок, чтобы пропустить приём пищи. ❄ — порция из морозилки.</p>${rows}</article>
      <article class="card"><h2>В среднем за день</h2>
        ${bar(avg.kcal, t.kcal * S.mult, 'Калории')}${bar(avg.p, t.p, 'Белок, г')}${bar(avg.f, t.f, 'Жиры, г')}${bar(avg.c, t.c, 'Углеводы, г')}${bar(avg.fi, t.fi, 'Клетчатка, г')}
      </article>
      <article class="card"><h2>Стоимость недели</h2>${budgetBar(weekCost(no, aw.sunISO, true))}</article></section>`;
  }

  function renderShop() {
    const aw = activeWeek(); const no = aw.no; const sunKey = aw.sunISO || 'p';
    const agg = shopAgg(no, aw.sunISO);
    const cats = {}; Object.keys(agg).forEach(pid => { (cats[PRODUCTS[pid].cat] = cats[PRODUCTS[pid].cat] || []).push(pid); });
    let html = '';
    CATS.forEach((cn, ci) => {
      const ids = (cats[ci] || []).filter(pid => !PRODUCTS[pid].pantry);
      if (!ids.length) return;
      html += `<article class="card"><h2>${cn}</h2><ul class="shop">` + ids.map(pid => {
        const p = PRODUCTS[pid]; const hk = sunKey + '|' + pid;
        const have = !!S.have[hk]; const bought = !!S.bought[hk];
        const cost = price(pid) * agg[pid] / 1000;
        return `<li class="${bought ? 'done' : ''} ${have ? 'have' : ''}">
          <label class="ck"><input type="checkbox" data-act="bought" data-k="${hk}" ${bought ? 'checked' : ''}><span></span></label>
          <div class="si"><div>${esc(p.ru)} <em>(${esc(p.no)})</em></div><small>${fmtG(pid, agg[pid])} · ${have ? 'есть дома' : money(cost)}${p.est ? ' · цена-оценка' : ''}</small></div>
          <button class="mini" data-act="have" data-k="${hk}">${have ? 'нет дома' : 'есть дома'}</button></li>`;
      }).join('') + `</ul></article>`;
    });
    // запасы
    const pids = Object.keys(agg).filter(pid => PRODUCTS[pid].pantry);
    let pant = '';
    if (pids.length) {
      pant = `<article class="card"><h2>Базовые запасы</h2><p class="hint">В бюджет идёт только расход на эту неделю. Купить упаковку нужно, когда запаса не хватает на неделю.</p><ul class="shop">` +
        pids.map(pid => {
          const p = PRODUCTS[pid]; const use = agg[pid]; const stock = Number(S.stock[pid] || 0); const wk = stock / use;
          const status = stock >= use ? `хватит примерно на ${Math.floor(wk)} нед.` : 'нужно купить упаковку';
          return `<li class="${stock >= use ? 'done' : ''}"><div class="si"><div>${esc(p.ru)} <em>(${esc(p.no)})</em></div>
            <small>Расход ${fmtG(pid, use)} в неделю (${money(price(pid) * use / 1000)}) · запас ${Math.round(stock)} ${p.liquid ? 'мл' : 'г'} · ${status}</small></div>
            <button class="mini" data-act="addStock" data-pid="${pid}">+ упаковка ${p.pack} ${p.liquid ? 'мл' : 'г'} (${p.packPrice} NOK)</button></li>`;
        }).join('') + `</ul></article>`;
    }
    const cook = !aw.preview ? `<article class="card"><button class="btn ${S.cooked[aw.sunISO] ? 'ghost' : 'primary'}" data-act="cooked">${S.cooked[aw.sunISO] ? 'Отменить отметку «приготовил»' : 'Приготовил на неделю: списать запасы'}</button></article>` : '';
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">Список покупок</div><h1>Неделя ${no}</h1><div class="hs">цены: ${S.priceMode === 'se' ? 'курица из Швеции' : 'Extra'}${aw.preview ? '' : ' · с учётом пропусков'}</div></div></div>
      <article class="card"><h2>Бюджет недели</h2>${budgetBar(weekCost(no, aw.sunISO, true))}</article>
      ${html}${pant}${cook}</section>`;
  }

  function renderCook() {
    const aw = activeWeek(); const no = aw.no; const w = WEEKS[no - 1];
    const plan = w.plan.map(p => `<li><b>${p[0]}</b><span>${esc(p[1])}</span></li>`).join('');
    const dish = (id, m) => {
      const d = DISHES[id]; const n = dishNut(id); const fz = frozenFrom(no, m);
      const oid = 'c-' + id;
      return `<article class="card"><div class="mt">${m === 'lunch' ? '🍱 Обед' : '🍝 Ужин'} · 7 порций</div><h3>${esc(d.name)}</h3>
        <div class="chips">${macroChips(n)}</div>
        <details data-id="${oid}" ${UI.open[oid] ? 'open' : ''}><summary>Продукты на 7 порций и шаги</summary>
          <ul class="ing">${Object.keys(d.ing).map(pid => dishLine(pid, d.ing[pid] * S.mult * 7)).join('')}</ul>
          <ol class="steps">${d.steps.map(s => '<li>' + esc(s) + '</li>').join('')}</ol></details>
        <p class="hint">В холодильник: ${DAYS[0].slice(0, 2)}–${SHORT[fz - 1]} (${fz} шт.), в морозилку: ${SHORT[fz]}–${SHORT[6]} (${7 - fz} шт.).</p></article>`;
    };
    const lf = frozenFrom(no, 'lunch'), df = frozenFrom(no, 'dinner');
    const thaw = [];
    for (let d = lf; d <= 6; d++) { if (d - 1 >= 0) thaw.push(`<li><b>${SHORT[d - 1]} вечером</b><span>достать обед на ${DAYS[d].toLowerCase()}</span></li>`); }
    for (let d = df; d <= 6; d++) { thaw.push(`<li><b>${SHORT[d - 1]} вечером</b><span>достать ужин на ${DAYS[d].toLowerCase()}</span></li>`); }
    const prep = [];
    if (w.breakfast === 'B2') prep.push('Сварить 14 яиц для завтраков (по 2 в день).');
    if (w.snack === 'S6') prep.push('Сварить 14 яиц для полдников (по 2 в день).');
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">Воскресная готовка</div><h1>Неделя ${no}</h1><div class="hs">цель около 2 часов, потолок 4 часа</div></div></div>
      <article class="card"><h2>Порядок действий</h2><ol class="tl">${plan}</ol>${prep.length ? '<p class="hint">' + prep.join(' ') + '</p>' : ''}</article>
      ${dish(w.lunch, 'lunch')}${dish(w.dinner, 'dinner')}
      <article class="card"><h2>Контейнеры и хранение</h2>
        <p>Нужно 14 контейнеров (7 для обедов, 7 для ужинов). Остудить до комнатной температуры не дольше часа и убрать.</p>
        <p class="hint">Завтраки и полдники не готовятся, их достаточно купить.</p>
        <h3 class="sub">Напоминания о морозилке</h3><ul class="kv">${thaw.join('')}</ul></article></section>`;
  }

  function weekRow(w) {
    const full = fullDay(w.n); const ci = curInfo(); const cost = weekCost(w.n, null, false);
    return `<article class="card wk ${ci.no === w.n ? 'current' : ''}">
      <div class="wh"><h3>Неделя ${w.n}</h3>${ci.no === w.n ? '<span class="tag fresh">сейчас</span>' : ''}</div>
      <ul class="kv small"><li><span>🍳</span><b>${esc(DISHES[w.breakfast].name)}</b></li><li><span>🍱</span><b>${esc(DISHES[w.lunch].name)}</b></li><li><span>🍎</span><b>${esc(DISHES[w.snack].name)}</b></li><li><span>🍝</span><b>${esc(DISHES[w.dinner].name)}</b></li></ul>
      <div class="chips">${macroChips(full)}<span class="chip cost">${money(cost)}</span></div>
      <button class="btn outline" data-act="view" data-arg="${w.n}">Открыть неделю</button></article>`;
  }

  function renderMore() {
    const tabs = [['weeks', 'Недели'], ['prices', 'Цены'], ['goals', 'Цели'], ['backup', 'Копия']];
    const nav = `<div class="seg">${tabs.map(t => `<button class="${UI.more === t[0] ? 'on' : ''}" data-act="more" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>`;
    let body = '';
    const ci = curInfo();
    if (UI.more === 'weeks') {
      const opts = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}" ${S.manualWeek === n ? 'selected' : ''}>Неделя ${n}</option>`).join('');
      const startOpts = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}">Неделя ${n}</option>`).join('');
      body = `<article class="card"><h2>Как менять недели</h2>
        <div class="seg two"><button class="${S.mode === 'auto' ? 'on' : ''}" data-act="mode" data-arg="auto">Автоматически</button><button class="${S.mode === 'manual' ? 'on' : ''}" data-act="mode" data-arg="manual">Вручную</button></div>
        <p class="hint">Сейчас: неделя ${ci.no} (с воскресенья ${fmtDM(ci.sun)}).</p>
        ${S.mode === 'auto' ? `
          <label class="fld">Воскресенье, с которого начался цикл<input type="date" data-input="startDate" value="${S.startDate}"></label>
          <label class="fld">Порядок недель (через запятую)<input type="text" data-input="order" value="${S.order.join(', ')}" inputmode="numeric"></label>
          <label class="fld">Начать цикл с недели<select data-input="startFrom"><option value="">— выбрать —</option>${startOpts}</select></label>
          <p class="hint">Пример порядка: 1, 2, 3, 6, 7, 4, 5, 8. Цикл идёт по кругу, каждое воскресенье следующая неделя. Чтобы сбросить: поставьте дату этого воскресенья и порядок 1–8.</p>`
          : `<label class="fld">Текущая неделя<select data-input="manualWeek">${opts}</select></label><p class="hint">Вручную вы сами выбираете неделю и переключаете её здесь.</p>`}
      </article>` + WEEKS.map(weekRow).join('');
    } else if (UI.more === 'prices') {
      body = `<article class="card"><h2>Где покупаем курицу</h2>
        <div class="seg two"><button class="${S.priceMode === 'extra' ? 'on' : ''}" data-act="pmode" data-arg="extra">Extra</button><button class="${S.priceMode === 'se' ? 'on' : ''}" data-act="pmode" data-arg="se">Швеция</button></div>
        <p class="hint">Цена за кг (за л для жидкостей) в NOK. Ваши правки запоминаются и действуют в обоих режимах. Пометка «оценка» — цена не подтверждена, поправьте по памяти.</p></article>` +
        CATS.map((cn, ci2) => {
          const ids = Object.keys(PRODUCTS).filter(pid => PRODUCTS[pid].cat === ci2);
          return `<article class="card"><h2>${cn}</h2><ul class="prices">` + ids.map(pid => {
            const p = PRODUCTS[pid]; const def = (S.priceMode === 'se' && p.priceSE != null) ? p.priceSE : p.price;
            const val = S.prices[pid] != null ? S.prices[pid] : '';
            return `<li><div><div>${esc(p.ru)}</div><small>${esc(p.no)}${p.est ? ' · оценка' : ''}${p.priceSE != null ? ' · Швеция ' + p.priceSE : ''}</small></div>
              <input type="number" inputmode="decimal" min="0" step="1" data-price="${pid}" value="${val}" placeholder="${def}"></li>`;
          }).join('') + `</ul></article>`;
        }).join('') + `<article class="card"><button class="btn ghost" data-act="resetPrices">Сбросить мои цены</button></article>`;
    } else if (UI.more === 'goals') {
      const t = S.targets;
      body = `<article class="card"><h2>Цели питания</h2>
        <label class="fld">Калории, ккал в день<input type="number" inputmode="numeric" data-input="t.kcal" value="${t.kcal}"></label>
        <label class="fld">Белок, г<input type="number" inputmode="numeric" data-input="t.p" value="${t.p}"></label>
        <label class="fld">Жиры, г<input type="number" inputmode="numeric" data-input="t.f" value="${t.f}"></label>
        <label class="fld">Углеводы, г<input type="number" inputmode="numeric" data-input="t.c" value="${t.c}"></label>
        <label class="fld">Клетчатка, г<input type="number" inputmode="numeric" data-input="t.fi" value="${t.fi}"></label>
        <label class="fld">Множитель порций (например 1,15 после начала тренировок)<input type="number" inputmode="decimal" step="0.05" min="0.5" max="2" data-input="mult" value="${S.mult}"></label>
        <p class="hint">Множитель пересчитывает граммы во всех блюдах, списке покупок и бюджете.</p></article>
        <article class="card"><h2>Бюджет</h2>
        <label class="fld">Цель, NOK в месяц<input type="number" inputmode="numeric" data-input="b.goal" value="${S.budget.goal}"></label>
        <label class="fld">Потолок, NOK в месяц<input type="number" inputmode="numeric" data-input="b.max" value="${S.budget.max}"></label>
        <p class="hint">В неделю: цель ${money(weekGoal())}, потолок ${money(weekMax())}. В бюджет входит всё, что в меню.</p></article>`;
    } else {
      body = `<article class="card"><h2>Резервная копия</h2>
        <p class="hint">Данные хранятся только на этом устройстве. Сохраните копию файлом и загрузите её на другом устройстве.</p>
        <button class="btn primary" data-act="export">Скачать копию</button>
        <label class="btn outline filebtn">Загрузить копию<input type="file" accept="application/json,.json" data-input="import"></label></article>
        <article class="card"><h2>Сброс</h2><button class="btn ghost danger" data-act="reset">Удалить все данные приложения</button></article>`;
    }
    return `<section><div class="hero"><div><div class="hl">Настройки</div><h1>Ещё</h1></div></div>${nav}${body}</section>`;
  }

  // ---------- отрисовка ----------
  const TABS = [['today', '🏠', 'Сегодня'], ['week', '📅', 'Неделя'], ['shop', '🛒', 'Покупки'], ['cook', '👨‍🍳', 'Готовка'], ['more', '⚙️', 'Ещё']];
  function render() {
    const y = window.scrollY;
    const fn = { today: renderToday, week: renderWeek, shop: renderShop, cook: renderCook, more: renderMore }[UI.tab];
    document.getElementById('view').innerHTML = fn();
    document.getElementById('nav').innerHTML = TABS.map(t => `<button class="${UI.tab === t[0] ? 'on' : ''}" data-act="tab" data-arg="${t[0]}"><span>${t[1]}</span>${t[2]}</button>`).join('');
    window.scrollTo(0, y);
  }

  // ---------- действия ----------
  function setTab(t) { UI.tab = t; render(); window.scrollTo(0, 0); }
  const actions = {
    tab: el => setTab(el.dataset.arg),
    more: el => { UI.more = el.dataset.arg; render(); },
    skip: el => {
      const aw = activeWeek(); if (aw.preview) return;
      const k = skipKey(aw.sunISO, el.dataset.d, el.dataset.m);
      if (S.skips[k]) delete S.skips[k]; else S.skips[k] = true;
      save(); render();
    },
    bought: el => { if (S.bought[el.dataset.k]) delete S.bought[el.dataset.k]; else S.bought[el.dataset.k] = true; save(); render(); },
    have: el => { if (S.have[el.dataset.k]) delete S.have[el.dataset.k]; else S.have[el.dataset.k] = true; save(); render(); },
    addStock: el => { const p = PRODUCTS[el.dataset.pid]; S.stock[el.dataset.pid] = Number(S.stock[el.dataset.pid] || 0) + p.pack; save(); render(); },
    cooked: () => {
      const aw = activeWeek(); if (aw.preview) return;
      const agg = shopAgg(aw.no, aw.sunISO); const on = !S.cooked[aw.sunISO];
      Object.keys(agg).forEach(pid => {
        if (!PRODUCTS[pid].pantry) return;
        S.stock[pid] = Math.max(0, Number(S.stock[pid] || 0) + (on ? -agg[pid] : agg[pid]));
      });
      if (on) S.cooked[aw.sunISO] = true; else delete S.cooked[aw.sunISO];
      save(); render();
    },
    view: el => { S.viewWeek = Number(el.dataset.arg); save(); setTab('week'); },
    viewNext: () => { S.viewWeek = nextWeekNo(curInfo()); save(); setTab('shop'); },
    clearView: () => { S.viewWeek = null; save(); render(); },
    mode: el => { S.mode = el.dataset.arg; S.viewWeek = null; save(); render(); },
    pmode: el => { S.priceMode = el.dataset.arg; save(); render(); },
    resetPrices: () => { if (confirm('Сбросить все ваши правки цен?')) { S.prices = {}; save(); render(); } },
    export: () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'mealprep-backup-' + isoDate(new Date()) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    reset: () => { if (confirm('Удалить все данные приложения на этом устройстве?')) { S = defaults(); save(); render(); } }
  };

  const inputs = {
    startDate: v => { if (v) S.startDate = v; },
    order: v => {
      const arr = v.split(/[^0-9]+/).filter(Boolean).map(Number).filter(n => n >= 1 && n <= 8);
      if (arr.length) S.order = arr;
    },
    startFrom: v => {
      if (!v) return; const n = Number(v); const base = [1, 2, 3, 4, 5, 6, 7, 8];
      const i = base.indexOf(n); S.order = base.slice(i).concat(base.slice(0, i));
      S.startDate = isoDate(sundayOf(new Date()));
    },
    manualWeek: v => { S.manualWeek = Number(v); },
    mult: v => { const n = parseFloat(String(v).replace(',', '.')); if (n >= 0.5 && n <= 2) S.mult = n; },
    't.kcal': v => { S.targets.kcal = Number(v) || S.targets.kcal; },
    't.p': v => { S.targets.p = Number(v) || S.targets.p; },
    't.f': v => { S.targets.f = Number(v) || S.targets.f; },
    't.c': v => { S.targets.c = Number(v) || S.targets.c; },
    't.fi': v => { S.targets.fi = Number(v) || S.targets.fi; },
    'b.goal': v => { S.budget.goal = Number(v) || S.budget.goal; },
    'b.max': v => { S.budget.max = Number(v) || S.budget.max; }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    if (el.tagName === 'INPUT' && el.type === 'checkbox') return; // обрабатывается в change
    const fn = actions[el.dataset.act]; if (fn) fn(el);
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.matches('input[type=checkbox][data-act]')) { actions[el.dataset.act](el); return; }
    if (el.dataset.price) {
      const v = el.value.trim();
      if (v === '') delete S.prices[el.dataset.price]; else S.prices[el.dataset.price] = Number(v);
      save(); return;
    }
    if (el.dataset.input === 'import') {
      const f = el.files && el.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const o = JSON.parse(rd.result); S = Object.assign(defaults(), o); save(); render(); alert('Копия загружена.'); }
        catch (err) { alert('Не удалось прочитать файл копии.'); }
      };
      rd.readAsText(f); return;
    }
    if (el.dataset.input && inputs[el.dataset.input]) { inputs[el.dataset.input](el.value); save(); render(); }
  });
  document.addEventListener('toggle', e => {
    const d = e.target; if (d.tagName === 'DETAILS' && d.dataset.id) UI.open[d.dataset.id] = d.open;
  }, true);

  window.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { }); });
  }
})();
