/* Мил-преп: логика приложения. Данные — в data.js, переводы — в i18n.js */
(function () {
  'use strict';

  const LANGS = ['ru', 'en', 'no'];
  const LANG_IDX = { ru: 0, en: 1, no: 2 };
  const LOCALE = { ru: 'ru-RU', en: 'en-GB', no: 'nb-NO' };
  const DAYS_T = {
    ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    no: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
  };
  const SHORT_T = {
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
  };
  const MEALS = [
    { k: 'breakfast', ic: '🍳' }, { k: 'lunch', ic: '🍱' }, { k: 'snack', ic: '🍎' }, { k: 'dinner', ic: '🍝' }
  ];
  const MEAL_KEYS = MEALS.map(m => m.k);
  const STORE_KEY = 'mealprep.v1';

  // ---------- строки интерфейса: [ru, en, no] (строка или функция) ----------
  const T = {
    nav_today: ['Сегодня', 'Today', 'I dag'], nav_week: ['Неделя', 'Week', 'Uke'], nav_shop: ['Покупки', 'Shopping', 'Handleliste'],
    nav_cook: ['Готовка', 'Cooking', 'Matlaging'], nav_more: ['Ещё', 'More', 'Mer'],
    week: ['Неделя', 'Week', 'Uke'],
    meal_breakfast: ['Завтрак', 'Breakfast', 'Frokost'], meal_lunch: ['Обед', 'Lunch', 'Lunsj'],
    meal_snack: ['Полдник', 'Afternoon snack', 'Mellommåltid'], meal_dinner: ['Ужин', 'Dinner', 'Middag'],
    lbl_kcal: ['Калории', 'Calories', 'Kalorier'], lbl_p: ['Белок, г', 'Protein, g', 'Protein, g'], lbl_f: ['Жиры, г', 'Fat, g', 'Fett, g'],
    lbl_c: ['Углеводы, г', 'Carbs, g', 'Karbohydrater, g'], lbl_fi: ['Клетчатка, г', 'Fibre, g', 'Fiber, g'],
    u_kcal: ['ккал', 'kcal', 'kcal'], ch_p: ['Б', 'P', 'P'], ch_f: ['Ж', 'F', 'F'], ch_c: ['У', 'C', 'K'], ch_fi: ['Кл', 'Fi', 'Fi'],
    u_g: ['г', 'g', 'g'], u_ml: ['мл', 'ml', 'ml'], u_kg: ['кг', 'kg', 'kg'], u_l: ['л', 'l', 'l'], u_pcs: ['шт', 'pcs', 'stk'], u_pack: ['уп.', 'pack', 'pk.'],
    mode_auto_sub: ['автоматически по календарю', 'automatic, by calendar', 'automatisk etter kalender'],
    mode_manual_sub: ['выбрана вручную', 'chosen manually', 'valgt manuelt'],
    mult_sub: [n => ' · порции ×' + n, n => ' · portions ×' + n, n => ' · porsjoner ×' + n],
    day_total: ['Итого за день', 'Day total', 'Sum for dagen'], avg_day: ['В среднем за день', 'Daily average', 'Gjennomsnitt per dag'],
    tag_fresh: ['свежее', 'fresh', 'ferskt'], tag_fridge: ['из холодильника', 'from the fridge', 'fra kjøleskapet'],
    tag_freezer: ['из морозилки (с вечера в холодильник)', 'from the freezer (move to the fridge the evening before)', 'fra fryseren (flytt til kjøleskapet kvelden før)'],
    tag_morning: ['собирается утром', 'assembled in the morning', 'lages om morgenen'], tag_nocook: ['без готовки', 'no cooking', 'uten tilberedning'],
    details_sum: ['Состав и приготовление', 'Ingredients and method', 'Ingredienser og fremgangsmåte'],
    skip: ['Пропустить приём пищи', 'Skip this meal', 'Hopp over måltidet'], unskip: ['Вернуть приём пищи', 'Restore this meal', 'Legg måltidet tilbake'],
    n_cook_today: ['Сегодня воскресенье: готовим на неделю (около 2 часов).', 'It is Sunday: cook for the week (about 2 hours).', 'Det er søndag: lag mat for uken (ca. 2 timer).'],
    btn_plan: ['План готовки', 'Cooking plan', 'Matlagingsplan'],
    n_tomorrow: [n => `Завтра готовка. Купите продукты по списку на неделю ${n}.`, n => `Cooking is tomorrow. Buy groceries from the list for week ${n}.`, n => `I morgen lager du mat. Kjøp inn etter listen for uke ${n}.`],
    btn_openlist: ['Открыть список', 'Open the list', 'Åpne listen'],
    n_freeze: [s => `❄ Вечером достань из морозилки на завтра: ${s}.`, s => `❄ This evening, take tomorrow's frozen meals out of the freezer: ${s}.`, s => `❄ I kveld: ta morgendagens frosne mat ut av fryseren: ${s}.`],
    w_lunch: ['обед', 'lunch', 'lunsj'], w_dinner: ['ужин', 'dinner', 'middag'], w_and: [' и ', ' and ', ' og '],
    menu: ['Меню', 'Menu', 'Meny'], dishes_week: ['Блюда недели', 'Dishes of the week', 'Ukens retter'], by_days: ['По дням', 'By day', 'Dag for dag'],
    hint_skip: ['Нажмите на значок, чтобы пропустить приём пищи. ❄ — порция из морозилки.', 'Tap an icon to skip a meal. ❄ means a portion from the freezer.', 'Trykk på et ikon for å hoppe over et måltid. ❄ betyr porsjon fra fryseren.'],
    week_cost: ['Стоимость недели', 'Weekly cost', 'Ukens kostnad'],
    from_sunday: [d => `с воскресенья ${d}`, d => `from Sunday ${d}`, d => `fra søndag ${d}`], preview_hs: ['просмотр', 'preview', 'forhåndsvisning'],
    b_preview: [n => `Просмотр недели ${n} (не текущая). `, n => `Previewing week ${n} (not the current one). `, n => `Forhåndsvisning av uke ${n} (ikke gjeldende). `],
    b_back: [n => `Вернуться к неделе ${n}`, n => `Back to week ${n}`, n => `Tilbake til uke ${n}`],
    shop_title: ['Список покупок', 'Shopping list', 'Handleliste'],
    prices_extra: ['цены: Extra', 'prices: Extra', 'priser: Extra'], prices_se: ['цены: курица из Швеции', 'prices: chicken from Sweden', 'priser: kylling fra Sverige'],
    with_skips: [' · с учётом пропусков', ' · skipped meals excluded', ' · uten hoppede måltider'],
    budget_week: ['Бюджет недели', 'Weekly budget', 'Ukebudsjett'],
    have: ['есть дома', 'have at home', 'har hjemme'], nohave: ['нет дома', 'not at home', 'har ikke hjemme'],
    est_price: [' · цена-оценка', ' · estimated price', ' · estimert pris'],
    pantry_title: ['Базовые запасы', 'Pantry staples', 'Basisvarer'],
    pantry_hint: ['В бюджет идёт только расход на эту неделю. Купить упаковку нужно, когда запаса не хватает на неделю.', 'Only this week\'s usage counts toward the budget. Buy a new pack when the stock does not cover a week.', 'Bare denne ukens forbruk regnes med i budsjettet. Kjøp ny pakke når beholdningen ikke dekker en uke.'],
    pantry_use: [(u, c, s, un, st) => `Расход ${u} в неделю (${c}) · запас ${s} ${un} · ${st}`, (u, c, s, un, st) => `Usage ${u} per week (${c}) · stock ${s} ${un} · ${st}`, (u, c, s, un, st) => `Forbruk ${u} per uke (${c}) · beholdning ${s} ${un} · ${st}`],
    stock_ok: [w => `хватит примерно на ${w} нед.`, w => `lasts about ${w} wk`, w => `rekker i ca. ${w} uker`],
    stock_need: ['нужно купить упаковку', 'buy a new pack', 'kjøp ny pakke'],
    add_pack: [(n, u, p) => `+ упаковка ${n} ${u} (${p} NOK)`, (n, u, p) => `+ pack ${n} ${u} (${p} NOK)`, (n, u, p) => `+ pakke ${n} ${u} (${p} NOK)`],
    cooked_btn: ['Приготовил на неделю: списать запасы', 'Cooked for the week: deduct pantry stock', 'Laget mat for uken: trekk fra beholdning'],
    uncooked_btn: ['Отменить отметку «приготовил»', 'Undo "cooked"', 'Angre «laget mat»'],
    est_word: ['оценка', 'estimate', 'estimat'], se_word: ['Швеция', 'Sweden', 'Sverige'],
    cook_hero: ['Воскресная готовка', 'Sunday cooking', 'Søndagsmatlaging'],
    cook_goal: ['цель около 2 часов, потолок 4 часа', 'target about 2 hours, limit 4 hours', 'mål ca. 2 timer, maks 4 timer'],
    order_title: ['Порядок действий', 'Order of work', 'Rekkefølge'],
    p7: [l => `${l} · 7 порций`, l => `${l} · 7 portions`, l => `${l} · 7 porsjoner`],
    cook_sum: ['Продукты на 7 порций и шаги', 'Ingredients for 7 portions and method', 'Ingredienser til 7 porsjoner og fremgangsmåte'],
    store_hint: [(a, b, n, c, d, m) => `В холодильник: ${a}–${b} (${n} шт.), в морозилку: ${c}–${d} (${m} шт.).`, (a, b, n, c, d, m) => `Fridge: ${a}–${b} (${n}), freezer: ${c}–${d} (${m}).`, (a, b, n, c, d, m) => `Kjøleskap: ${a}–${b} (${n} stk.), fryser: ${c}–${d} (${m} stk.).`],
    cont_title: ['Контейнеры и хранение', 'Containers and storage', 'Beholdere og oppbevaring'],
    cont_text: ['Нужно 14 контейнеров (7 для обедов, 7 для ужинов). Остудить до комнатной температуры не дольше часа и убрать.', 'You need 14 containers (7 for lunches, 7 for dinners). Cool to room temperature within an hour, then store.', 'Du trenger 14 beholdere (7 til lunsj, 7 til middag). Avkjøl til romtemperatur innen en time og sett inn.'],
    nocook_note: ['Завтраки и полдники не готовятся, их достаточно купить.', 'Breakfasts and snacks need no cooking, just buy them.', 'Frokost og mellommåltider krever ingen tilberedning, de må bare kjøpes.'],
    frz_rem: ['Напоминания о морозилке', 'Freezer reminders', 'Fryserpåminnelser'],
    evening: [s => `${s} вечером`, s => `${s} evening`, s => `${s} kveld`],
    take_lunch: [d => `достать обед на ${d}`, d => `take out lunch for ${d}`, d => `ta ut lunsj til ${d}`],
    take_dinner: [d => `достать ужин на ${d}`, d => `take out dinner for ${d}`, d => `ta ut middag til ${d}`],
    prep_b: ['Сварить 14 яиц для завтраков (по 2 в день).', 'Boil 14 eggs for breakfasts (2 per day).', 'Kok 14 egg til frokost (2 per dag).'],
    prep_s: ['Сварить 14 яиц для полдников (по 2 в день).', 'Boil 14 eggs for snacks (2 per day).', 'Kok 14 egg til mellommåltider (2 per dag).'],
    now: ['сейчас', 'now', 'nå'], open_week: ['Открыть неделю', 'Open week', 'Åpne uken'],
    settings: ['Настройки', 'Settings', 'Innstillinger'], more_h: ['Ещё', 'More', 'Mer'],
    st_weeks: ['Недели', 'Weeks', 'Uker'], st_prices: ['Цены', 'Prices', 'Priser'], st_goals: ['Цели', 'Goals', 'Mål'], st_backup: ['Копия', 'Backup', 'Kopi'],
    how_change: ['Как менять недели', 'How weeks change', 'Hvordan ukene bytter'], auto: ['Автоматически', 'Automatic', 'Automatisk'], manual: ['Вручную', 'Manual', 'Manuelt'],
    now_info: [(n, d) => `Сейчас: неделя ${n} (с воскресенья ${d}).`, (n, d) => `Now: week ${n} (from Sunday ${d}).`, (n, d) => `Nå: uke ${n} (fra søndag ${d}).`],
    f_start: ['Воскресенье, с которого начался цикл', 'Sunday when the cycle started', 'Søndagen syklusen startet'],
    f_order: ['Порядок недель (через запятую)', 'Order of weeks (comma separated)', 'Rekkefølge på ukene (kommaseparert)'],
    f_startfrom: ['Начать цикл с недели', 'Start the cycle from week', 'Start syklusen fra uke'], choose: ['— выбрать —', '— choose —', '— velg —'],
    order_hint: ['Пример порядка: 1, 2, 3, 6, 7, 4, 5, 8. Цикл идёт по кругу, каждое воскресенье следующая неделя. Чтобы сбросить: поставьте дату этого воскресенья и порядок 1–8.', 'Example order: 1, 2, 3, 6, 7, 4, 5, 8. The cycle repeats, moving to the next week each Sunday. To reset: set this Sunday\'s date and the order 1–8.', 'Eksempel på rekkefølge: 1, 2, 3, 6, 7, 4, 5, 8. Syklusen går i ring, og hver søndag kommer neste uke. For å nullstille: sett dagens søndagsdato og rekkefølgen 1–8.'],
    f_manual: ['Текущая неделя', 'Current week', 'Gjeldende uke'],
    manual_hint: ['Вручную вы сами выбираете неделю и переключаете её здесь.', 'In manual mode you choose and change the week here.', 'I manuell modus velger og bytter du uke her.'],
    where_chicken: ['Где покупаем курицу', 'Where we buy chicken', 'Hvor vi kjøper kylling'],
    price_hint: ['Цена за кг (за л для жидкостей) в NOK. Ваши правки запоминаются и действуют в обоих режимах. Пометка «оценка» — цена не подтверждена, поправьте по памяти.', 'Price per kg (per l for liquids) in NOK. Your edits are saved and apply in both modes. "Estimate" means the price is unconfirmed, so correct it from memory.', 'Pris per kg (per liter for væsker) i NOK. Endringene dine lagres og gjelder i begge moduser. «Estimat» betyr at prisen ikke er bekreftet, så rett den opp etter hukommelsen.'],
    reset_prices: ['Сбросить мои цены', 'Reset my prices', 'Nullstill prisene mine'],
    c_reset_prices: ['Сбросить все ваши правки цен?', 'Reset all your price edits?', 'Nullstille alle prisendringene dine?'],
    goals_title: ['Цели питания', 'Nutrition goals', 'Ernæringsmål'],
    f_kcal: ['Калории, ккал в день', 'Calories, kcal per day', 'Kalorier, kcal per dag'],
    f_mult: ['Множитель порций (например 1,15 после начала тренировок)', 'Portion multiplier (e.g. 1.15 once you start training)', 'Porsjonsmultiplikator (f.eks. 1,15 når du begynner å trene)'],
    mult_hint: ['Множитель пересчитывает граммы во всех блюдах, списке покупок и бюджете.', 'The multiplier rescales grams in all dishes, the shopping list and the budget.', 'Multiplikatoren skalerer gram i alle retter, handlelisten og budsjettet.'],
    budget_title: ['Бюджет', 'Budget', 'Budsjett'],
    f_bgoal: ['Цель, NOK в месяц', 'Target, NOK per month', 'Mål, NOK per måned'], f_bmax: ['Потолок, NOK в месяц', 'Limit, NOK per month', 'Tak, NOK per måned'],
    budget_hint: [(g, m) => `В неделю: цель ${g}, потолок ${m}. В бюджет входит всё, что в меню.`, (g, m) => `Per week: target ${g}, limit ${m}. The budget covers everything in the menu.`, (g, m) => `Per uke: mål ${g}, tak ${m}. Budsjettet dekker alt i menyen.`],
    bn_over: [x => `Выше потолка на ${x}`, x => `Over the limit by ${x}`, x => `Over taket med ${x}`],
    bn_left: [x => `До цели осталось ${x}`, x => `${x} left to the target`, x => `${x} igjen til målet`],
    bn_overgoal: [(x, m) => `Выше цели на ${x}, потолок ${m}`, (x, m) => `Over the target by ${x}, limit ${m}`, (x, m) => `Over målet med ${x}, tak ${m}`],
    bn_main: [(c, m) => `${c} в неделю · ≈ ${m} в месяц`, (c, m) => `${c} per week · ≈ ${m} per month`, (c, m) => `${c} per uke · ≈ ${m} per måned`],
    bn_sub: [(g, m) => `(цель ${g}, потолок ${m} в неделю)`, (g, m) => `(target ${g}, limit ${m} per week)`, (g, m) => `(mål ${g}, tak ${m} per uke)`],
    backup_title: ['Резервная копия', 'Backup', 'Sikkerhetskopi'],
    backup_hint: ['Данные хранятся только на этом устройстве. Сохраните копию файлом и загрузите её на другом устройстве.', 'Data is stored only on this device. Save a backup file and load it on another device.', 'Data lagres bare på denne enheten. Lagre en sikkerhetskopi som fil og last den inn på en annen enhet.'],
    download: ['Скачать копию', 'Download backup', 'Last ned kopi'], upload: ['Загрузить копию', 'Load backup', 'Last inn kopi'],
    loaded: ['Копия загружена.', 'Backup loaded.', 'Kopien er lastet inn.'],
    load_fail: ['Не удалось прочитать файл копии.', 'Could not read the backup file.', 'Kunne ikke lese sikkerhetskopifilen.'],
    reset_title: ['Сброс', 'Reset', 'Nullstill'], reset_btn: ['Удалить все данные приложения', 'Delete all app data', 'Slett alle appdata'],
    c_reset: ['Удалить все данные приложения на этом устройстве?', 'Delete all app data on this device?', 'Slette alle appdata på denne enheten?'],
    app_title: ['Мил-преп', 'Meal prep', 'Matprep'],
    lang_label: ['Язык', 'Language', 'Språk']
  };
  function lang() { return S.lang; }
  function t(key) {
    const v = T[key][LANG_IDX[S.lang]];
    if (typeof v === 'function') return v.apply(null, Array.prototype.slice.call(arguments, 1));
    return v;
  }
  const DAYS = () => DAYS_T[S.lang];
  const SHORT = () => SHORT_T[S.lang];

  // ---------- хранилище ----------
  let memStore = null;
  function loadRaw() { try { const s = localStorage.getItem(STORE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return memStore; } }
  function saveRaw(obj) { memStore = obj; try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* работаем в памяти */ } }

  // ---------- даты ----------
  const DAY_MS = 864e5;
  function pad(n) { return String(n).padStart(2, '0'); }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function sundayOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - x.getDay()); return x; }
  function fmtDM(d) { return pad(d.getDate()) + '.' + pad(d.getMonth() + 1); }

  // ---------- состояние ----------
  function detectLang() {
    const n = ((navigator.language || 'ru') + '').toLowerCase();
    if (n.startsWith('nb') || n.startsWith('nn') || n.startsWith('no')) return 'no';
    if (n.startsWith('en')) return 'en';
    return 'ru';
  }
  function defaults() {
    return {
      lang: detectLang(), mode: 'auto', startDate: isoDate(sundayOf(new Date())), order: [1, 2, 3, 4, 5, 6, 7, 8], manualWeek: 1,
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
    if (LANGS.indexOf(d.lang) < 0) d.lang = 'ru';
    return d;
  })();
  const UI = { tab: 'today', more: 'weeks', open: {} };
  function save() { saveRaw(S); }

  // ---------- переводимые данные ----------
  function dishName(id) { return S.lang === 'ru' ? DISHES[id].name : DISH_T[id][S.lang].name; }
  function dishSteps(id) { return S.lang === 'ru' ? DISHES[id].steps : DISH_T[id][S.lang].steps; }
  function planText(no, i) { return S.lang === 'ru' ? WEEKS[no - 1].plan[i][1] : PLAN_T[no][S.lang][i]; }
  function catName(i) { return S.lang === 'ru' ? CATS[i] : CATS_T[S.lang][i]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pname(pid) {
    const p = PRODUCTS[pid];
    if (S.lang === 'no') return esc(cap(p.no));
    return esc(S.lang === 'ru' ? p.ru : PROD_EN[pid]) + ` <em>(${esc(p.no)})</em>`;
  }

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
  function nextWeekNo(ci) { return S.mode === 'manual' ? S.manualWeek : S.order[(ci.idx + 1) % S.order.length]; }
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
  function num(x) { const s = String(x); return S.lang === 'en' ? s : s.replace('.', ','); }
  function fmtG(pid, g) {
    const p = PRODUCTS[pid]; let s;
    if (g >= 1000) s = num(Math.round(g / 10) / 100) + ' ' + (p.liquid ? t('u_l') : t('u_kg'));
    else s = num(g < 20 ? Math.round(g * 10) / 10 : Math.round(g / 5) * 5) + ' ' + (p.liquid ? t('u_ml') : t('u_g'));
    if (p.pc && g >= p.pc * 0.8) s += ' (≈ ' + Math.round(g / p.pc) + ' ' + t('u_pcs') + ')';
    else if (p.pack && !p.pantry && g >= p.pack * 0.8) s += ' (≈ ' + num(Math.round(g / p.pack * 10) / 10) + ' ' + t('u_pack') + ')';
    return s;
  }
  function money(x) { return Math.round(x).toLocaleString(LOCALE[S.lang]).replace(/[  ]/g, ' ') + ' NOK'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function dishLine(pid, g) { return `<li><span>${pname(pid)}</span><b>${fmtG(pid, g)}</b></li>`; }
  function macroChips(n) {
    return `<span class="chip kcal">${r0(n.kcal)} ${t('u_kcal')}</span><span class="chip">${t('ch_p')} ${r0(n.p)}</span><span class="chip">${t('ch_f')} ${r0(n.f)}</span><span class="chip">${t('ch_c')} ${r0(n.c)}</span><span class="chip">${t('ch_fi')} ${r0(n.fi)}</span>`;
  }
  function bar(val, target, label) {
    const pc = Math.min(100, val / target * 100);
    const cls = val / target > 1.15 ? 'hi' : (val / target < 0.85 ? 'lo' : 'ok');
    return `<div class="bar-row"><span>${label}</span><div class="bar"><i class="${cls}" style="width:${pc}%"></i></div><b>${r0(val)} / ${r0(target)}</b></div>`;
  }
  function bars(v, mult) {
    const tg = S.targets;
    return bar(v.kcal, tg.kcal * mult, t('lbl_kcal')) + bar(v.p, tg.p, t('lbl_p')) + bar(v.f, tg.f, t('lbl_f')) + bar(v.c, tg.c, t('lbl_c')) + bar(v.fi, tg.fi, t('lbl_fi'));
  }
  function budgetBar(cost) {
    const g = weekGoal(), m = weekMax(); const pc = Math.min(100, cost / m * 100), gp = g / m * 100;
    const cls = cost > m ? 'hi' : (cost > g ? 'mid' : 'ok');
    const left = g - cost;
    const msg = cost > m ? t('bn_over', money(cost - m)) : (left >= 0 ? t('bn_left', money(left)) : t('bn_overgoal', money(-left), money(m)));
    return `<div class="budget"><div class="bar wide"><i class="${cls}" style="width:${pc}%"></i><u style="left:${gp}%"></u></div>
      <div class="bnote"><b>${t('bn_main', money(cost), money(cost * 52 / 12))}</b><br><small>${msg} ${t('bn_sub', money(g), money(m))}</small></div></div>`;
  }

  // ---------- экраны ----------
  function weekBanner(aw) {
    if (!aw.preview) return '';
    return `<div class="notice">${t('b_preview', aw.no)}<button class="link" data-act="clearView">${t('b_back', aw.ci.no)}</button></div>`;
  }

  function renderToday() {
    const ci = curInfo(); const no = ci.no; const w = WEEKS[no - 1]; const d = ci.dayIdx;
    const tomorrow = (d + 1) % 7;
    let notes = '';
    if (d === 0) notes += `<div class="notice cook">${t('n_cook_today')} <button class="link" data-act="tab" data-arg="cook">${t('btn_plan')}</button></div>`;
    if (d === 6) notes += `<div class="notice">${t('n_tomorrow', nextWeekNo(ci))} <button class="link" data-act="viewNext">${t('btn_openlist')}</button></div>`;
    if (d !== 6) {
      const out = [];
      ['lunch', 'dinner'].forEach(m => {
        if (isFrozen(no, m, tomorrow) && !isSkipped(ci.sunISO, tomorrow, m)) out.push(t(m === 'lunch' ? 'w_lunch' : 'w_dinner') + ' «' + dishName(w[m]) + '»');
      });
      if (out.length) notes += `<div class="notice freeze">${t('n_freeze', out.join(t('w_and')))}</div>`;
    }
    const dn = dayNut(no, ci.sunISO, d);
    let cards = '';
    MEALS.forEach(m => {
      const id = w[m.k]; const n = dishNut(id); const sk = isSkipped(ci.sunISO, d, m.k);
      const frozen = isFrozen(no, m.k, d);
      const where = (m.k === 'lunch' || m.k === 'dinner')
        ? (d === 0 ? `<span class="tag fresh">${t('tag_fresh')}</span>` : (frozen ? `<span class="tag frz">${t('tag_freezer')}</span>` : `<span class="tag fr">${t('tag_fridge')}</span>`))
        : (m.k === 'breakfast' ? `<span class="tag">${t('tag_morning')}</span>` : `<span class="tag">${t('tag_nocook')}</span>`);
      const oid = 't-' + m.k;
      cards += `<article class="card meal ${sk ? 'skipped' : ''}">
        <div class="mh"><span class="mi">${m.ic}</span><div><div class="mt">${t('meal_' + m.k)} ${where}</div><h3>${esc(dishName(id))}</h3></div></div>
        <div class="chips">${macroChips(n)}</div>
        <details data-id="${oid}" ${UI.open[oid] ? 'open' : ''}><summary>${t('details_sum')}</summary>
          <ul class="ing">${Object.keys(DISHES[id].ing).map(pid => dishLine(pid, DISHES[id].ing[pid] * S.mult)).join('')}</ul>
          <ol class="steps">${dishSteps(id).map(s => '<li>' + esc(s) + '</li>').join('')}</ol></details>
        <button class="btn ${sk ? 'ghost' : 'outline'}" data-act="skip" data-d="${d}" data-m="${m.k}">${sk ? t('unskip') : t('skip')}</button>
      </article>`;
    });
    return `<section>
      <div class="hero"><div><div class="hl">${DAYS()[d]}, ${fmtDM(new Date())}</div><h1>${t('week')} ${no}</h1><div class="hs">${t(S.mode === 'auto' ? 'mode_auto_sub' : 'mode_manual_sub')}${S.mult !== 1 ? t('mult_sub', num(S.mult)) : ''}</div></div></div>
      ${notes}
      <article class="card"><h2>${t('day_total')}</h2>${bars(dn, S.mult)}</article>${cards}</section>`;
  }

  function renderWeek() {
    const aw = activeWeek(); const no = aw.no; const w = WEEKS[no - 1];
    let rows = '';
    for (let d = 0; d < 7; d++) {
      const dn = dayNut(no, aw.sunISO, d);
      const isToday = !aw.preview && d === aw.ci.dayIdx;
      rows += `<div class="drow ${isToday ? 'today' : ''}"><div class="dn"><b>${SHORT()[d]}</b><small>${r0(dn.kcal)} ${t('u_kcal')}</small></div><div class="dm">` +
        MEALS.map(m => {
          const sk = isSkipped(aw.sunISO, d, m.k); const fz = isFrozen(no, m.k, d);
          return `<button class="mb ${sk ? 'sk' : ''}" ${aw.preview ? 'disabled' : ''} data-act="skip" data-d="${d}" data-m="${m.k}" title="${t('meal_' + m.k)}">${m.ic}${fz ? '<i>❄</i>' : ''}</button>`;
        }).join('') + `</div></div>`;
    }
    const avg = { kcal: 0, p: 0, f: 0, c: 0, fi: 0 };
    for (let d = 0; d < 7; d++) { const x = dayNut(no, aw.sunISO, d); Object.keys(avg).forEach(k => avg[k] += x[k] / 7); }
    const list = MEALS.map(m => `<li><span>${m.ic} ${t('meal_' + m.k)}</span><b>${esc(dishName(w[m.k]))}</b></li>`).join('');
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">${t('menu')}</div><h1>${t('week')} ${no}</h1><div class="hs">${aw.preview ? t('preview_hs') : t('from_sunday', fmtDM(parseISO(aw.sunISO)))}</div></div></div>
      <article class="card"><h2>${t('dishes_week')}</h2><ul class="kv">${list}</ul></article>
      <article class="card"><h2>${t('by_days')}</h2><p class="hint">${t('hint_skip')}</p>${rows}</article>
      <article class="card"><h2>${t('avg_day')}</h2>${bars(avg, S.mult)}</article>
      <article class="card"><h2>${t('week_cost')}</h2>${budgetBar(weekCost(no, aw.sunISO, true))}</article></section>`;
  }

  function renderShop() {
    const aw = activeWeek(); const no = aw.no; const sunKey = aw.sunISO || 'p';
    const agg = shopAgg(no, aw.sunISO);
    const cats = {}; Object.keys(agg).forEach(pid => { (cats[PRODUCTS[pid].cat] = cats[PRODUCTS[pid].cat] || []).push(pid); });
    let html = '';
    CATS.forEach((cn, ci) => {
      const ids = (cats[ci] || []).filter(pid => !PRODUCTS[pid].pantry);
      if (!ids.length) return;
      html += `<article class="card"><h2>${catName(ci)}</h2><ul class="shop">` + ids.map(pid => {
        const p = PRODUCTS[pid]; const hk = sunKey + '|' + pid;
        const have = !!S.have[hk]; const bought = !!S.bought[hk];
        const cost = price(pid) * agg[pid] / 1000;
        return `<li class="${bought ? 'done' : ''} ${have ? 'have' : ''}">
          <label class="ck"><input type="checkbox" data-act="bought" data-k="${hk}" ${bought ? 'checked' : ''}><span></span></label>
          <div class="si"><div>${pname(pid)}</div><small>${fmtG(pid, agg[pid])} · ${have ? t('have') : money(cost)}${p.est ? t('est_price') : ''}</small></div>
          <button class="mini" data-act="have" data-k="${hk}">${have ? t('nohave') : t('have')}</button></li>`;
      }).join('') + `</ul></article>`;
    });
    const pids = Object.keys(agg).filter(pid => PRODUCTS[pid].pantry);
    let pant = '';
    if (pids.length) {
      pant = `<article class="card"><h2>${t('pantry_title')}</h2><p class="hint">${t('pantry_hint')}</p><ul class="shop">` +
        pids.map(pid => {
          const p = PRODUCTS[pid]; const use = agg[pid]; const stock = Number(S.stock[pid] || 0); const wk = stock / use;
          const status = stock >= use ? t('stock_ok', Math.floor(wk)) : t('stock_need');
          const unit = p.liquid ? t('u_ml') : t('u_g');
          return `<li class="${stock >= use ? 'done' : ''}"><div class="si"><div>${pname(pid)}</div>
            <small>${t('pantry_use', fmtG(pid, use), money(price(pid) * use / 1000), Math.round(stock), unit, status)}</small></div>
            <button class="mini" data-act="addStock" data-pid="${pid}">${t('add_pack', p.pack, unit, p.packPrice)}</button></li>`;
        }).join('') + `</ul></article>`;
    }
    const cook = !aw.preview ? `<article class="card"><button class="btn ${S.cooked[aw.sunISO] ? 'ghost' : 'primary'}" data-act="cooked">${S.cooked[aw.sunISO] ? t('uncooked_btn') : t('cooked_btn')}</button></article>` : '';
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">${t('shop_title')}</div><h1>${t('week')} ${no}</h1><div class="hs">${t(S.priceMode === 'se' ? 'prices_se' : 'prices_extra')}${aw.preview ? '' : t('with_skips')}</div></div></div>
      <article class="card"><h2>${t('budget_week')}</h2>${budgetBar(weekCost(no, aw.sunISO, true))}</article>
      ${html}${pant}${cook}</section>`;
  }

  function renderCook() {
    const aw = activeWeek(); const no = aw.no; const w = WEEKS[no - 1];
    const plan = w.plan.map((p, i) => `<li><b>${p[0]}</b><span>${esc(planText(no, i))}</span></li>`).join('');
    const dish = (id, m) => {
      const d = DISHES[id]; const n = dishNut(id); const fz = frozenFrom(no, m);
      const oid = 'c-' + id; const sh = SHORT();
      const label = (m === 'lunch' ? '🍱 ' + t('meal_lunch') : '🍝 ' + t('meal_dinner'));
      return `<article class="card"><div class="mt">${t('p7', label)}</div><h3>${esc(dishName(id))}</h3>
        <div class="chips">${macroChips(n)}</div>
        <details data-id="${oid}" ${UI.open[oid] ? 'open' : ''}><summary>${t('cook_sum')}</summary>
          <ul class="ing">${Object.keys(d.ing).map(pid => dishLine(pid, d.ing[pid] * S.mult * 7)).join('')}</ul>
          <ol class="steps">${dishSteps(id).map(s => '<li>' + esc(s) + '</li>').join('')}</ol></details>
        <p class="hint">${t('store_hint', sh[0], sh[fz - 1], fz, sh[fz], sh[6], 7 - fz)}</p></article>`;
    };
    const lf = frozenFrom(no, 'lunch'), df = frozenFrom(no, 'dinner');
    const thaw = []; const sh = SHORT(), dd = DAYS();
    for (let d = lf; d <= 6; d++) thaw.push(`<li><b>${t('evening', sh[d - 1])}</b><span>${t('take_lunch', dd[d].toLowerCase())}</span></li>`);
    for (let d = df; d <= 6; d++) thaw.push(`<li><b>${t('evening', sh[d - 1])}</b><span>${t('take_dinner', dd[d].toLowerCase())}</span></li>`);
    const prep = [];
    if (w.breakfast === 'B2') prep.push(t('prep_b'));
    if (w.snack === 'S6') prep.push(t('prep_s'));
    return `<section>${weekBanner(aw)}
      <div class="hero"><div><div class="hl">${t('cook_hero')}</div><h1>${t('week')} ${no}</h1><div class="hs">${t('cook_goal')}</div></div></div>
      <article class="card"><h2>${t('order_title')}</h2><ol class="tl">${plan}</ol>${prep.length ? '<p class="hint">' + prep.join(' ') + '</p>' : ''}</article>
      ${dish(w.lunch, 'lunch')}${dish(w.dinner, 'dinner')}
      <article class="card"><h2>${t('cont_title')}</h2>
        <p>${t('cont_text')}</p><p class="hint">${t('nocook_note')}</p>
        <h3 class="sub">${t('frz_rem')}</h3><ul class="kv">${thaw.join('')}</ul></article></section>`;
  }

  function weekRow(w) {
    const full = fullDay(w.n); const ci = curInfo(); const cost = weekCost(w.n, null, false);
    return `<article class="card wk ${ci.no === w.n ? 'current' : ''}">
      <div class="wh"><h3>${t('week')} ${w.n}</h3>${ci.no === w.n ? `<span class="tag fresh">${t('now')}</span>` : ''}</div>
      <ul class="kv small">${MEALS.map(m => `<li><span>${m.ic}</span><b>${esc(dishName(w[m.k]))}</b></li>`).join('')}</ul>
      <div class="chips">${macroChips(full)}<span class="chip cost">${money(cost)}</span></div>
      <button class="btn outline" data-act="view" data-arg="${w.n}">${t('open_week')}</button></article>`;
  }

  function renderMore() {
    const tabs = [['weeks', 'st_weeks'], ['prices', 'st_prices'], ['goals', 'st_goals'], ['backup', 'st_backup']];
    const nav = `<div class="seg">${tabs.map(x => `<button class="${UI.more === x[0] ? 'on' : ''}" data-act="more" data-arg="${x[0]}">${t(x[1])}</button>`).join('')}</div>`;
    let body = '';
    const ci = curInfo();
    if (UI.more === 'weeks') {
      const opts = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}" ${S.manualWeek === n ? 'selected' : ''}>${t('week')} ${n}</option>`).join('');
      const startOpts = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option value="${n}">${t('week')} ${n}</option>`).join('');
      body = `<article class="card"><h2>${t('how_change')}</h2>
        <div class="seg two"><button class="${S.mode === 'auto' ? 'on' : ''}" data-act="mode" data-arg="auto">${t('auto')}</button><button class="${S.mode === 'manual' ? 'on' : ''}" data-act="mode" data-arg="manual">${t('manual')}</button></div>
        <p class="hint">${t('now_info', ci.no, fmtDM(ci.sun))}</p>
        ${S.mode === 'auto' ? `
          <label class="fld">${t('f_start')}<input type="date" data-input="startDate" value="${S.startDate}"></label>
          <label class="fld">${t('f_order')}<input type="text" data-input="order" value="${S.order.join(', ')}" inputmode="numeric"></label>
          <label class="fld">${t('f_startfrom')}<select data-input="startFrom"><option value="">${t('choose')}</option>${startOpts}</select></label>
          <p class="hint">${t('order_hint')}</p>`
          : `<label class="fld">${t('f_manual')}<select data-input="manualWeek">${opts}</select></label><p class="hint">${t('manual_hint')}</p>`}
      </article>` + WEEKS.map(weekRow).join('');
    } else if (UI.more === 'prices') {
      body = `<article class="card"><h2>${t('where_chicken')}</h2>
        <div class="seg two"><button class="${S.priceMode === 'extra' ? 'on' : ''}" data-act="pmode" data-arg="extra">Extra</button><button class="${S.priceMode === 'se' ? 'on' : ''}" data-act="pmode" data-arg="se">${t('se_word')}</button></div>
        <p class="hint">${t('price_hint')}</p></article>` +
        CATS.map((cn, ci2) => {
          const ids = Object.keys(PRODUCTS).filter(pid => PRODUCTS[pid].cat === ci2);
          return `<article class="card"><h2>${catName(ci2)}</h2><ul class="prices">` + ids.map(pid => {
            const p = PRODUCTS[pid]; const def = (S.priceMode === 'se' && p.priceSE != null) ? p.priceSE : p.price;
            const val = S.prices[pid] != null ? S.prices[pid] : '';
            const nm = S.lang === 'ru' ? p.ru : (S.lang === 'en' ? PROD_EN[pid] : cap(p.no));
            return `<li><div><div>${esc(nm)}</div><small>${S.lang === 'no' ? '' : esc(p.no)}${p.est ? (S.lang === 'no' ? '' : ' · ') + t('est_word') : ''}${p.priceSE != null ? ' · ' + t('se_word') + ' ' + p.priceSE : ''}</small></div>
              <input type="number" inputmode="decimal" min="0" step="1" data-price="${pid}" value="${val}" placeholder="${def}"></li>`;
          }).join('') + `</ul></article>`;
        }).join('') + `<article class="card"><button class="btn ghost" data-act="resetPrices">${t('reset_prices')}</button></article>`;
    } else if (UI.more === 'goals') {
      const tg = S.targets;
      body = `<article class="card"><h2>${t('goals_title')}</h2>
        <label class="fld">${t('f_kcal')}<input type="number" inputmode="numeric" data-input="t.kcal" value="${tg.kcal}"></label>
        <label class="fld">${t('lbl_p')}<input type="number" inputmode="numeric" data-input="t.p" value="${tg.p}"></label>
        <label class="fld">${t('lbl_f')}<input type="number" inputmode="numeric" data-input="t.f" value="${tg.f}"></label>
        <label class="fld">${t('lbl_c')}<input type="number" inputmode="numeric" data-input="t.c" value="${tg.c}"></label>
        <label class="fld">${t('lbl_fi')}<input type="number" inputmode="numeric" data-input="t.fi" value="${tg.fi}"></label>
        <label class="fld">${t('f_mult')}<input type="number" inputmode="decimal" step="0.05" min="0.5" max="2" data-input="mult" value="${S.mult}"></label>
        <p class="hint">${t('mult_hint')}</p></article>
        <article class="card"><h2>${t('budget_title')}</h2>
        <label class="fld">${t('f_bgoal')}<input type="number" inputmode="numeric" data-input="b.goal" value="${S.budget.goal}"></label>
        <label class="fld">${t('f_bmax')}<input type="number" inputmode="numeric" data-input="b.max" value="${S.budget.max}"></label>
        <p class="hint">${t('budget_hint', money(weekGoal()), money(weekMax()))}</p></article>`;
    } else {
      body = `<article class="card"><h2>${t('backup_title')}</h2>
        <p class="hint">${t('backup_hint')}</p>
        <button class="btn primary" data-act="export">${t('download')}</button>
        <label class="btn outline filebtn">${t('upload')}<input type="file" accept="application/json,.json" data-input="import"></label></article>
        <article class="card"><h2>${t('reset_title')}</h2><button class="btn ghost danger" data-act="reset">${t('reset_btn')}</button></article>`;
    }
    return `<section><div class="hero"><div><div class="hl">${t('settings')}</div><h1>${t('more_h')}</h1></div></div>${nav}${body}</section>`;
  }

  // ---------- отрисовка ----------
  const TABS = [['today', '🏠', 'nav_today'], ['week', '📅', 'nav_week'], ['shop', '🛒', 'nav_shop'], ['cook', '👨‍🍳', 'nav_cook'], ['more', '⚙️', 'nav_more']];
  function render() {
    const y = window.scrollY;
    const fn = { today: renderToday, week: renderWeek, shop: renderShop, cook: renderCook, more: renderMore }[UI.tab];
    document.getElementById('view').innerHTML = fn();
    document.getElementById('nav').innerHTML = TABS.map(x => `<button class="${UI.tab === x[0] ? 'on' : ''}" data-act="tab" data-arg="${x[0]}"><span>${x[1]}</span>${t(x[2])}</button>`).join('');
    const lg = document.getElementById('lang');
    if (lg) lg.innerHTML = LANGS.map(l => `<button class="${S.lang === l ? 'on' : ''}" data-act="lang" data-arg="${l}" aria-label="${t('lang_label')}" aria-pressed="${S.lang === l}">${l.toUpperCase()}</button>`).join('');
    document.documentElement.lang = S.lang === 'no' ? 'nb' : S.lang;
    document.title = t('app_title');
    window.scrollTo(0, y);
  }

  // ---------- действия ----------
  function setTab(tb) { UI.tab = tb; render(); window.scrollTo(0, 0); }
  const actions = {
    tab: el => setTab(el.dataset.arg),
    lang: el => { S.lang = el.dataset.arg; save(); render(); },
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
    resetPrices: () => { if (confirm(t('c_reset_prices'))) { S.prices = {}; save(); render(); } },
    export: () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'mealprep-backup-' + isoDate(new Date()) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    reset: () => { if (confirm(t('c_reset'))) { const l = S.lang; S = defaults(); S.lang = l; save(); render(); } }
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
    if (el.tagName === 'INPUT' && el.type === 'checkbox') return;
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
        try { const o = JSON.parse(rd.result); S = Object.assign(defaults(), o); if (LANGS.indexOf(S.lang) < 0) S.lang = 'ru'; save(); render(); alert(t('loaded')); }
        catch (err) { alert(t('load_fail')); }
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
