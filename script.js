// 访前人机验证：拦截未验证访问并保留目标地址
// 注意：已禁用人机验证，如需启用请取消注释下面的代码
/*
(function(){
  const path = location.pathname.split('/').pop().toLowerCase();
  const isVerify = path === 'verify.html';
  const verified = sessionStorage.getItem('human-verified') === 'true';
  if(!verified && !isVerify){
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    location.replace('verify.html?next=' + next);
    return;
  }
})();
*/

// ============================================================
// 导航：移动端开合 & 头部滚动收缩
// ============================================================
(function(){
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  // 头部收缩：兼容整页滚动容器（首页）与常规页面滚动（子页面）
  const applyShrink = (y) => {
    if (!header) return;
    if (y > 24) header.setAttribute('data-shrink', 'true');
    else header.removeAttribute('data-shrink');
  };
  const wrapper = document.getElementById('fullpage-wrapper');
  if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) {
    wrapper.addEventListener('scroll', () => applyShrink(wrapper.scrollTop), { passive: true });
    applyShrink(wrapper.scrollTop);
  } else {
    window.addEventListener('scroll', () => applyShrink(window.scrollY), { passive: true });
    applyShrink(window.scrollY);
  }
})();

// ============================================================
// 平滑滚动（锚点）
// ============================================================
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nav = document.querySelector('.nav');
        nav && nav.setAttribute('data-open', 'false');
      }
    });
  });
})();

// ============================================================
// 滚动揭示动画
// ============================================================
(function(){
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('reveal-show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => io.observe(el));
})();

// ============================================================
// 滑动画廊（循环播放版）
// ============================================================
(function(){
  const sliders = document.querySelectorAll('.slider');
  if (!sliders.length) return;

  const initSlider = (slider) => {
    const section = slider.closest('.section, .hero, .container, section');
    const prevBtn = section ? section.querySelector('.slider-btn.prev') : null;
    const nextBtn = section ? section.querySelector('.slider-btn.next') : null;
    const step = () => slider.clientWidth;

    const cards = Array.from(slider.querySelectorAll('.slide-card'));
    if (cards.length < 1) return;
    const first = cards[0];
    const last = cards[cards.length - 1];
    const firstClone = first.cloneNode(true); firstClone.classList.add('is-clone');
    const lastClone = last.cloneNode(true); lastClone.classList.add('is-clone');
    slider.insertBefore(lastClone, slider.firstChild);
    slider.appendChild(firstClone);

    const N = cards.length;
    let pos = 1;
    let timer = null;

    const jumpTo = (p) => { slider.scrollLeft = step() * p; };
    const smoothTo = (p, cb) => { slider.scrollTo({ left: step() * p, behavior: 'smooth' }); if (cb) setTimeout(cb, 420); };
    window.addEventListener('resize', () => jumpTo(pos));
    jumpTo(pos);
    slider.dataset.loop = 'true';

    const next = () => {
      pos += 1;
      if (pos === N + 1) smoothTo(pos, () => { pos = 1; jumpTo(pos); });
      else smoothTo(pos);
    };
    const prev = () => {
      pos -= 1;
      if (pos === 0) smoothTo(pos, () => { pos = N; jumpTo(pos); });
      else smoothTo(pos);
    };

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    const start = () => { stop(); timer = setInterval(next, 3500); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('touchstart', stop, { passive: true });
    slider.addEventListener('touchend', start);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    start();
  };

  sliders.forEach(initSlider);
})();

// ============================================================
// 简易轮播回退（未启用循环逻辑时）
// ============================================================
(function(){
  document.querySelectorAll('.slider-wrap').forEach((wrap) => {
    const slider = wrap.querySelector('.slider');
    const prev = wrap.querySelector('.slider-btn.prev');
    const next = wrap.querySelector('.slider-btn.next');
    if (!slider || !prev || !next || slider.dataset.loop === 'true') return;
    const cardWidth = () => slider.clientWidth;
    prev.addEventListener('click', () => slider.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    next.addEventListener('click', () => slider.scrollBy({ left: cardWidth(), behavior: 'smooth' }));
  });
})();

// ============================================================
// 主题切换：持久化
// ============================================================
(function(){
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  function setTheme(next){
    if (next === 'light') { html.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
    else { html.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
    if (typeof window.updateThemeLabel === 'function') window.updateThemeLabel();
  }
  toggle && toggle.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
  });
  if (typeof window.updateThemeLabel === 'function') window.updateThemeLabel();
})();

// ============================================================
// 语言切换：简单 i18n
// ============================================================
(function(){
  const dict = {
    'zh-cn':{
      title:'USTB · 具身智能实验室',
      nav_home:'首页', nav_products:'产品', nav_solutions:'解决方案', nav_cases:'案例', nav_members:'成员', nav_partners:'伙伴',
      nav_product:'产品', nav_more:'具身智能介绍', nav_sub_about:'关于我们', nav_sub_contact:'联系我们', nav_brand:'北京科技大学具身智能实验室',
      home_title:'基于视觉的智能检测与具身智能',
      home_desc:'我们专注于多特征融合、轻量化网络与机器人视觉，将AI与工业场景深度结合。',
      cta_cases:'查看成果', cta_research:'了解方向',
      research_title:'研究方向', cases_title:'科研成果', patents_title:'已授权部分专利',
      matrix_title:'产品矩阵概览',
      toggle_theme:'切换主题', theme_toggle:'切换主题', theme_light:'浅色', theme_dark:'深色',
      solutions_title:'解决方案', members_title:'成员介绍', partners_title:'合作伙伴', footer_copy:'北京科技大学具身智能实验室',
      hero1_title:'具身智能', hero1_desc:'智能感知 · 自主决策',
      hero2_title:'智能轮椅', hero2_desc:'辅助出行 · 情感陪伴',
      hero3_title:'机器人导航', hero3_desc:'精准定位 · 路径规划',
      hero4_title:'工业视觉', hero4_desc:'智能检测 · 质量保障',
      hero5_title:'人机交互', hero5_desc:'语音控制 · 自然对话',
      slider_prev:'上一组', slider_next:'下一组',
      pain_title:'项目背景与市场痛点', users_title:'目标用户分析', market_title:'市场机遇'
    },
    'zh-hk':{
      title:'USTB · 具身智能實驗室',
      nav_home:'首頁', nav_products:'產品', nav_solutions:'解決方案', nav_cases:'案例', nav_members:'成員', nav_partners:'合作夥伴',
      nav_product:'產品', nav_more:'具身智能介紹', nav_sub_about:'關於我們', nav_sub_contact:'聯絡我們', nav_brand:'北京科技大學具身智能實驗室',
      home_title:'基於視覺的智能檢測與具身智能',
      home_desc:'我們專注於多特徵融合、輕量化網絡與機器人視覺，將 AI 與工業場景深度結合。',
      cta_cases:'查看成果', cta_research:'了解方向',
      research_title:'研究方向', cases_title:'科研成果', patents_title:'已授權部分專利',
      matrix_title:'產品矩陣概覽',
      toggle_theme:'切換主題', theme_toggle:'切換主題', theme_light:'淺色', theme_dark:'深色',
      solutions_title:'解決方案', members_title:'成員介紹', partners_title:'合作夥伴', footer_copy:'北京科技大學具身智能實驗室',
      hero1_title:'具身智能', hero1_desc:'智能感知 · 自主決策',
      hero2_title:'智能輪椅', hero2_desc:'輔助出行 · 情感陪伴',
      hero3_title:'機器人導航', hero3_desc:'精準定位 · 路徑規劃',
      hero4_title:'工業視覺', hero4_desc:'智能檢測 · 質量保障',
      hero5_title:'人機交互', hero5_desc:'語音控制 · 自然對話',
      slider_prev:'上一組', slider_next:'下一組',
      pain_title:'項目背景與市場痛點', users_title:'目標用戶分析', market_title:'市場機遇'
    },
    'en-us':{
      title:'USTB · Embodied Intelligence Lab',
      nav_home:'Home', nav_products:'Products', nav_solutions:'Solutions', nav_cases:'Cases', nav_members:'Members', nav_partners:'Partners',
      nav_product:'Products', nav_more:'Embodied Intelligence', nav_sub_about:'About', nav_sub_contact:'Contact', nav_brand:'USTB Embodied Intelligence Lab',
      home_title:'Vision-based Intelligent Inspection & Embodied AI',
      home_desc:'We focus on multi-feature fusion, lightweight networks and robotic vision, bringing AI into industrial scenarios.',
      cta_cases:'See Work', cta_research:'Explore Topics',
      research_title:'Research', cases_title:'Showcase', patents_title:'Authorized Patents',
      matrix_title:'Product Matrix',
      toggle_theme:'Theme', theme_toggle:'Theme', theme_light:'Light', theme_dark:'Dark',
      solutions_title:'Solutions', members_title:'Members', partners_title:'Partners', footer_copy:'USTB Embodied Intelligence Lab',
      hero1_title:'Embodied Intelligence', hero1_desc:'Smart Perception · Autonomous Decision',
      hero2_title:'Smart Wheelchair', hero2_desc:'Assisted Mobility · Emotional Companionship',
      hero3_title:'Robot Navigation', hero3_desc:'Precise Positioning · Path Planning',
      hero4_title:'Industrial Vision', hero4_desc:'Intelligent Inspection · Quality Assurance',
      hero5_title:'Human-Robot Interaction', hero5_desc:'Voice Control · Natural Dialogue',
      slider_prev:'Previous', slider_next:'Next',
      pain_title:'Background & Pain Points', users_title:'Target Users', market_title:'Market Opportunities'
    }
  };
  window.__i18nDict = dict;

  function normalize(ext){
    if (!ext) return 'zh-CN';
    const m = ext.toLowerCase();
    if (m === 'zh-cn') return 'zh-CN';
    if (m === 'zh-hk' || m === 'zh-tw') return 'zh-HK';
    if (m === 'en' || m === 'en-us') return 'en';
    return 'zh-CN';
  }
  function toInternal(ext){
    return ext === 'en' ? 'en-us' : (ext === 'zh-HK' ? 'zh-hk' : 'zh-cn');
  }
  function getCookie(name){
    const m = document.cookie.split('; ').find(x => x.startsWith(name + '='));
    return m ? decodeURIComponent(m.split('=')[1]) : null;
  }
  function setCookie(name, val){
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${name}=${encodeURIComponent(val)}; path=/; max-age=${oneYear}`;
  }
  function getLangFromQuery(){
    try { return new URLSearchParams(location.search).get('lang'); } catch (e) { return null; }
  }

  const langSelect = document.getElementById('langSelect') || document.getElementById('langSwitcher');
  const savedLangExt = normalize(getLangFromQuery() || getCookie('lang') || localStorage.getItem('lang'));

  function lookup(packA, packB, key){
    const k2 = key.replace(/\./g, '_');
    return (packA && (packA[key] || packA[k2])) || (packB && (packB[key] || packB[k2])) || null;
  }
  function externalPackFor(ext){
    const e = window.i18n || {};
    if (e[ext]) return e[ext];
    if (ext === 'zh-HK' && e['zh-TW']) return e['zh-TW'];
    if (ext === 'en' && e['en']) return e['en'];
    if (ext === 'zh-CN' && e['zh-CN']) return e['zh-CN'];
    return null;
  }
  function apply(ext){
    const pack = dict[toInternal(ext)] || dict['zh-cn'];
    const external = externalPackFor(ext);
    window.__lang = ext;
    document.documentElement.lang = ext;
    document.title = pack.title || document.title;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = lookup(pack, external, key);
      if (val != null) el.textContent = val;
    });
    localStorage.setItem('lang', ext);
    setCookie('lang', ext);
    try {
      const url = new URL(location.href);
      url.searchParams.set('lang', ext);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    if (typeof window.updateThemeLabel === 'function') window.updateThemeLabel();
  }
  window.updateThemeLabel = function(){
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const ext = window.__lang || 'zh-CN';
    const pack = dict[toInternal(ext)] || dict['zh-cn'];
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.textContent = isLight ? (pack.theme_dark || '深色') : (pack.theme_light || '浅色');
  };
  if (langSelect) langSelect.value = savedLangExt;
  const otherSelect = langSelect && langSelect.id === 'langSelect' ? document.getElementById('langSwitcher') : document.getElementById('langSelect');
  if (otherSelect) otherSelect.value = savedLangExt;
  apply(savedLangExt);
  langSelect && langSelect.addEventListener('change', () => { const v = normalize(langSelect.value); apply(v); otherSelect && (otherSelect.value = v); });
  otherSelect && otherSelect.addEventListener('change', () => { const v = normalize(otherSelect.value); apply(v); langSelect && (langSelect.value = v); });

  // 为站内链接附加当前语言参数
  (function propagateLangToLinks(){
    const current = savedLangExt;
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:)/.test(href)) return;
      try {
        const url = new URL(href, location.href);
        if (!url.searchParams.get('lang')) url.searchParams.set('lang', current);
        a.setAttribute('href', url.toString());
      } catch (e) {}
    });
  })();
})();

// ============================================================
// 按钮磁吸光效（科技感）
// ============================================================
(function(){
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left; const y = e.clientY - r.top;
      btn.style.background = `radial-gradient(120px 120px at ${x}px ${y}px, rgba(255,255,255,.35), transparent), var(--gradient)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.background = ''; });
  });
})();

// ============================================================
// 追加：新增板块的国际化字典
// ============================================================
window.i18n = window.i18n || {};
window.i18n["zh-CN"] = Object.assign({}, window.i18n["zh-CN"] || {}, {
  "coreTechLLM.title": "核心技术二：大模型语音交互",
  "coreTechLLM.lead": "产品引入大语言模型（LLM），极大提升了智能轮椅的语音交互能力，使其超越了传统语音助手的范畴，实现了真正意义上的智能陪伴。",
  "coreTechLLM.system": "大模型语音交互系统能力",
  "coreTechLLM.intent": "意图识别",
  "coreTechLLM.nlu": "自然语言理解",
  "coreTechLLM.emotion": "情感识别",
  "coreTechLLM.companion": "主动陪伴",
  "coreTechLLM.examples": "交互示例",
  "coreTechLLM.advantages": "技术优势",
  "productAdv.title": "产品优势与市场竞争力",
  "productAdv.core": "核心优势四大维度",
  "productAdv.diff": "差异化竞争力分析",
  "solutions_aiot_title": "AIoT 场景",
  "solutions_aiot_desc": "连接设备，数据驱动业务增长。",
  "solutions_industry_title": "工业视觉",
  "solutions_industry_desc": "检测识别，提高生产良率。",
  "solutions_retail_title": "智能零售",
  "solutions_retail_desc": "端边云协同，实时分析。",
  "solutions_qa_title": "知识问答",
  "solutions_qa_desc": "企业知识库，语义检索。",
  "partners_alpha_title": "合作方 Alpha",
  "partners_alpha_desc": "芯片与模组。",
  "partners_beta_title": "合作方 Beta",
  "partners_beta_desc": "云服务与平台。",
  "partners_gamma_title": "合作方 Gamma",
  "partners_gamma_desc": "制造与交付。",
  "partners_delta_title": "合作方 Delta",
  "partners_delta_desc": "渠道与生态。",
  "future.title": "未来发展与展望"
});

window.i18n["en"] = Object.assign({}, window.i18n["en"] || {}, {
  "coreTechLLM.title": "Core Tech II: LLM Voice Interaction",
  "coreTechLLM.lead": "Powered by LLM, the wheelchair's conversational abilities leap beyond traditional voice assistants, enabling true intelligent companionship.",
  "coreTechLLM.system": "LLM Interaction Capabilities",
  "coreTechLLM.intent": "Intent Recognition",
  "coreTechLLM.nlu": "Natural Language Understanding",
  "coreTechLLM.emotion": "Emotion Recognition",
  "coreTechLLM.companion": "Proactive Companion",
  "coreTechLLM.examples": "Dialogue Examples",
  "coreTechLLM.advantages": "Technical Advantages",
  "productAdv.title": "Product Advantages & Competitiveness",
  "productAdv.core": "Four Core Dimensions",
  "productAdv.diff": "Differentiated Competitiveness",
  "solutions_aiot_title": "AIoT Scenario",
  "solutions_aiot_desc": "Connect devices, data-driven business growth.",
  "solutions_industry_title": "Industrial Vision",
  "solutions_industry_desc": "Detection and recognition, improving yield.",
  "solutions_retail_title": "Smart Retail",
  "solutions_retail_desc": "Edge–cloud collaboration, real-time analytics.",
  "solutions_qa_title": "Knowledge Q&A",
  "solutions_qa_desc": "Enterprise knowledge base, semantic search.",
  "partners_alpha_title": "Partner Alpha",
  "partners_alpha_desc": "Chips & modules.",
  "partners_beta_title": "Partner Beta",
  "partners_beta_desc": "Cloud services & platforms.",
  "partners_gamma_title": "Partner Gamma",
  "partners_gamma_desc": "Manufacturing & delivery.",
  "partners_delta_title": "Partner Delta",
  "partners_delta_desc": "Channels & ecosystem.",
  "future.title": "Future Development & Outlook"
});

window.i18n["zh-TW"] = Object.assign({}, window.i18n["zh-TW"] || {}, {
  "coreTechLLM.title": "核心技术二：大模型语音交互",
  "coreTechLLM.lead": "产品引入大语言模型（LLM），极大提升了智能轮椅的语音交互能力，使其超越了传统语音助手的范畴，实现了真正意义上的智能陪伴。",
  "coreTechLLM.system": "大模型语音交互系统能力",
  "coreTechLLM.intent": "意图识别",
  "coreTechLLM.nlu": "自然语言理解",
  "coreTechLLM.emotion": "情感识别",
  "coreTechLLM.companion": "主动陪伴",
  "coreTechLLM.examples": "交互示例",
  "coreTechLLM.advantages": "技术优势",
  "productAdv.title": "产品优势与市场竞争力",
  "productAdv.core": "核心优势四大维度",
  "productAdv.diff": "差异化竞争力分析",
  "future.title": "未来发展与展望"
});

// ============================================================
// 滑块认证（verify.html）：拖动到尽头解锁
// ============================================================
(function(){
  const captcha = document.querySelector('.slide-captcha');
  if (!captcha) return;
  const track = captcha.querySelector('.captcha-track');
  const thumb = captcha.querySelector('.captcha-thumb');
  const progress = captcha.querySelector('.captcha-progress');
  const status = captcha.querySelector('.captcha-status');
  const heroControls = document.querySelector('.hero .slider-controls');
  const caseControls = document.querySelector('#cases .slider-controls');
  const disableButtons = (disabled) => {
    [heroControls, caseControls].forEach(ctrl => {
      if (!ctrl) return;
      ctrl.querySelectorAll('.slider-btn').forEach(btn => { btn.disabled = disabled; });
    });
  };
  disableButtons(true);
  let startX = 0; let offset = 0; let dragging = false;
  const max = () => track.clientWidth - thumb.clientWidth;
  const setPos = (x) => {
    offset = Math.max(0, Math.min(max(), x));
    thumb.style.transform = `translateX(${offset}px)`;
    progress.style.width = `${offset + thumb.clientWidth / 2}px`;
  };
  const onDown = (e) => { dragging = true; startX = (e.touches ? e.touches[0].clientX : e.clientX) - offset; };
  const onMove = (e) => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    setPos(x);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    if (offset >= max() - 4) {
      status.textContent = '验证通过，正在进入';
      sessionStorage.setItem('human-verified', 'true');
      disableButtons(false);
      thumb.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      thumb.style.color = '#fff';
      thumb.style.pointerEvents = 'none';
      const params = new URLSearchParams(location.search);
      const target = params.get('next') || 'index.html';
      setTimeout(() => { location.replace(target); }, 400);
    } else {
      status.textContent = '请拖动滑块到最右端以解锁';
      setPos(0);
    }
  };
  thumb.addEventListener('mousedown', onDown);
  thumb.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
})();

// ============================================================
// 智能轮椅产品页：横向面板展开交互
// ============================================================
(function(){
  const gallery = document.querySelector('.panel-gallery');
  if (!gallery) return;
  const panels = Array.from(gallery.querySelectorAll('.panel'));

  panels.forEach((panel) => {
    const img = panel.querySelector('img');
    if (img && img.src) panel.style.backgroundImage = `url('${img.src}')`;
  });

  function collapseAll(){
    panels.forEach((p) => p.classList.remove('expanded'));
    delete gallery.dataset.mode;
  }

  panels.forEach((panel) => {
    panel.addEventListener('click', (e) => {
      if (e.target.closest('.close')) { collapseAll(); return; }
      const already = panel.classList.contains('expanded');
      collapseAll();
      if (!already) {
        panel.classList.add('expanded');
        gallery.dataset.mode = 'expanded';
      }
    });
  });

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') collapseAll(); });
})();
