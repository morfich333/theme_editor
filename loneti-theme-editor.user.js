// ==UserScript==
// @name         Loneti.ru — Тёмная тема + Анимированный фон
// @name:en      Loneti.ru — Dark Theme + Animated Background
// @namespace    https://github.com/morfich333/theme_editor
// @version      1.0.0
// @description  Тёмная тема на всём сайте loneti.ru (кроме холста, палитры и картинок) + выбор встроенных анимированных фонов для сайта и рабочего пространства вокруг холста.
// @description:en Minimalist dark theme for loneti.ru (excluding canvas, palette, and images) with 7 animated backgrounds and custom workspace colors.
// @author       morfich333
// @license      MIT
// @homepageURL  https://github.com/morfich333/theme_editor
// @supportURL   https://github.com/morfich333/theme_editor/issues
// @updateURL    https://raw.githubusercontent.com/morfich333/theme_editor/main/loneti-theme-editor.user.js
// @downloadURL  https://raw.githubusercontent.com/morfich333/theme_editor/main/loneti-theme-editor.user.js
// @match        https://loneti.ru/*
// @match        https://*.loneti.ru/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const GUARD_KEY = '__lonetiThemeEditorInstalled';
  if (window[GUARD_KEY]) return;
  window[GUARD_KEY] = true;

  // =========================================================================
  // 1. Настройки и пресеты (загружаются сразу на document-start)
  // =========================================================================
  const STORAGE_KEY = 'lt_theme_editor_v1';

  const ANIM_PRESETS = [
    { id: 'none', name: 'Без анимации' },
    { id: 'stars', name: 'Звёздное небо' },
    { id: 'aurora', name: 'Северное сияние' },
    { id: 'constellation', name: 'Созвездия' },
    { id: 'sakura', name: 'Лепестки' },
    { id: 'rain', name: 'Неоновый дождь' },
    { id: 'bokeh', name: 'Боке' },
    { id: 'waves', name: 'Волны' },
  ];

  const PRESET_ICONS = {
    none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/></svg>',
    stars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><circle cx="19" cy="18" r="1.2"/><circle cx="6" cy="17" r="1"/></svg>',
    aurora: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 15c3-4 6 2 9-3s6 1 9-3"/><path d="M3 19c3-3 6 1 9-2s6 1 9-2" opacity="0.55"/></svg>',
    constellation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="15" cy="17" r="2"/><circle cx="6" cy="18" r="1.5"/><path d="M7.8 7.5l8.4-1.2M17 7.8l-1.5 7.3M13.3 17.3l-5.8.5M6.2 9l-.2 7.5"/></svg>',
    sakura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c3 2.5 4.5 5.5 3.5 9.5-1.5 2-3.5 3.5-3.5 6.5 0-3-2-4.5-3.5-6.5C7.5 9.5 9 6.5 12 4z"/></svg>',
    rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="7" y1="5" x2="7" y2="14"/><line x1="12" y1="9" x2="12" y2="19"/><line x1="17" y1="4" x2="17" y2="13"/></svg>',
    bokeh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="10" r="4.5"/><circle cx="16.5" cy="14.5" r="3.5" opacity="0.7"/><circle cx="15" cy="7" r="2" opacity="0.5"/></svg>',
    waves: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 10c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3-1.5 3-1.5"/><path d="M3 16c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3-1.5 3-1.5" opacity="0.6"/></svg>',
  };

  const PALETTES = {
    night: {
      name: 'Ночной синий',
      bgTop: '#070b14',
      bgBottom: '#11192c',
      c1: [96, 165, 250],
      c2: [129, 140, 248],
      c3: [56, 189, 248],
    },
    neon: {
      name: 'Фиолетовый неон',
      bgTop: '#0c0716',
      bgBottom: '#1c1033',
      c1: [192, 132, 252],
      c2: [244, 114, 182],
      c3: [99, 102, 241],
    },
    emerald: {
      name: 'Изумрудный',
      bgTop: '#05110e',
      bgBottom: '#0b241d',
      c1: [52, 211, 153],
      c2: [45, 212, 191],
      c3: [110, 231, 183],
    },
    sakura: {
      name: 'Сакура',
      bgTop: '#130912',
      bgBottom: '#261221',
      c1: [249, 168, 212],
      c2: [244, 114, 182],
      c3: [253, 186, 116],
    },
    sunset: {
      name: 'Тёплый закат',
      bgTop: '#140b09',
      bgBottom: '#291511',
      c1: [251, 146, 60],
      c2: [248, 113, 113],
      c3: [250, 204, 21],
    },
    mono: {
      name: 'Монохром',
      bgTop: '#09090b',
      bgBottom: '#18181b',
      c1: [228, 228, 231],
      c2: [161, 161, 170],
      c3: [113, 113, 122],
    },
  };

  const state = {
    darkTheme: true,
    preset: 'stars',
    palette: 'night',
    speed: 1.0,
    opacity: 90,
    workspaceColor: '#11151d',
    isOpen: false,
  };

  function loadSettings() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.darkTheme === 'boolean') state.darkTheme = saved.darkTheme;
      if (ANIM_PRESETS.some((p) => p.id === saved.preset)) state.preset = saved.preset;
      if (PALETTES[saved.palette]) state.palette = saved.palette;
      if (typeof saved.speed === 'number' && saved.speed >= 0.2 && saved.speed <= 2.5) {
        state.speed = saved.speed;
      }
      if (typeof saved.opacity === 'number' && saved.opacity >= 10 && saved.opacity <= 100) {
        state.opacity = saved.opacity;
      }
      if (typeof saved.workspaceColor === 'string' && /^#[0-9a-f]{6}$/i.test(saved.workspaceColor)) {
        state.workspaceColor = saved.workspaceColor;
      }
    } catch (_) {}
  }

  function saveSettings() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkTheme: state.darkTheme,
          preset: state.preset,
          palette: state.palette,
          speed: state.speed,
          opacity: state.opacity,
          workspaceColor: state.workspaceColor,
        })
      );
    } catch (_) {}
  }

  loadSettings();

  // =========================================================================
  // 2. Сразу применяем классы и стили темы (до отрисовки страницы, без вспышки)
  // =========================================================================
  const STYLE_ID = 'lt-theme-editor-style';
  let capturedApp = null;

  function applyRootClasses() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.toggle('lt-theme-dark', state.darkTheme);
    root.classList.toggle('lt-theme-bg-active', state.preset !== 'none');
  }

  function injectThemeStyles() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      if (document.head && existing.parentElement !== document.head) {
        document.head.appendChild(existing);
      }
      return;
    }
    const target = document.head || document.documentElement;
    if (!target) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Тёмная тема всего сайта через инверсию с сохранением точных цветов холста, палитры и картинок */
      html.lt-theme-dark {
        background: #f3f1ed !important;
        filter: invert(1) hue-rotate(180deg) !important;
      }
      html.lt-theme-dark.lt-theme-bg-active body {
        background-color: transparent !important;
        background-image: none !important;
      }

      /* Исключения: холст, превью слоёв, колесо/градиенты/образцы цвета, картинки, видео, шапка и наши панели */
      html.lt-theme-dark img,
      html.lt-theme-dark picture,
      html.lt-theme-dark video,
      html.lt-theme-dark canvas,
      html.lt-theme-dark iframe,
      html.lt-theme-dark #header,
      html.lt-theme-dark .circle-picker__gradient,
      html.lt-theme-dark .sample-colorpicker__color,
      html.lt-theme-dark .one_clr,
      html.lt-theme-dark .lt-imp-fab,
      html.lt-theme-dark .lt-imp-panel,
      html.lt-theme-dark .lt-imp-minibar,
      html.lt-theme-dark .lt-pal-fab,
      html.lt-theme-dark .lt-pal-panel,
      html.lt-theme-dark .lt-theme-fab,
      html.lt-theme-dark .lt-theme-panel {
        filter: invert(1) hue-rotate(180deg) !important;
      }

      /* Шапка изначально тёмная: сохраняем её тёмной без двойной инверсии картинок внутри */
      html.lt-theme-dark #header {
        background-color: #16161a !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      }
      html.lt-theme-dark #header img,
      html.lt-theme-dark #header video,
      html.lt-theme-dark #header canvas {
        filter: none !important;
      }

      /* Серые ники (до инверсии rgb(92,92,92) -> визуально мягкий серый #a3a3a3) */
      html.lt-theme-dark .lt-theme-nick,
      html.lt-theme-dark .one-layer__user-name,
      html.lt-theme-dark .one-user-canvas__name {
        color: rgb(92, 92, 92) !important;
      }
      html.lt-theme-dark a.lt-theme-nick:hover {
        color: rgb(56, 56, 56) !important;
      }

      /* Чтобы за обёртками сайта и за рабочим холстом draw.js просвечивал анимированный фон */
      html.lt-theme-bg-active #content,
      html.lt-theme-bg-active .js--cont-draw,
      html.lt-theme-bg-active .js--main-drawing-area,
      html.lt-theme-bg-active .js--container-work-canvas,
      html.lt-theme-bg-active .js--work-canvas {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* Слой анимированного фона */
      #lt-theme-bg-canvas {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        display: block;
      }
      html.lt-theme-dark #lt-theme-bg-canvas {
        filter: invert(1) hue-rotate(180deg) !important;
      }

      /* Кнопка и панель редактора тем */
      .lt-theme-fab {
        position: fixed;
        bottom: 14px;
        right: 14px;
        z-index: 99996;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 30px;
        padding: 0 11px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        background: #141418;
        color: #d4d4dc;
        font: 500 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
        letter-spacing: -0.01em;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        user-select: none;
        touch-action: manipulation;
      }
      .lt-theme-fab.lt-theme-fab--draw {
        bottom: auto;
        top: 10px;
        right: 350px;
        border-radius: 8px;
      }
      .lt-theme-fab:hover { background: #1e1e24; color: #ffffff; border-color: rgba(255, 255, 255, 0.2); }
      .lt-theme-fab.lt-theme-fab--active {
        background: #272730;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
      }

      .lt-theme-panel {
        position: fixed;
        bottom: 54px;
        right: 14px;
        width: 288px;
        max-height: calc(100vh - 72px);
        overflow-y: auto;
        z-index: 99997;
        background: #111114;
        color: #e4e4e7;
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 10px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.68);
        font: 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
        display: none;
        user-select: none;
        -webkit-overflow-scrolling: touch;
      }
      .lt-theme-panel.lt-theme-panel--draw {
        bottom: auto;
        top: 48px;
        right: 308px;
      }
      .lt-theme-panel.lt-theme-panel--open { display: block; }
      .lt-theme-panel::-webkit-scrollbar { width: 4px; }
      .lt-theme-panel::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 99px; }

      .lt-theme-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 11px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        cursor: move;
        font-weight: 600;
        font-size: 12px;
        letter-spacing: -0.01em;
        color: #ececf0;
        touch-action: none;
      }
      .lt-theme-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        background: transparent;
        border: none;
        border-radius: 5px;
        color: #7c7c88;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
      }
      .lt-theme-close:hover { background: rgba(255, 255, 255, 0.07); color: #ececf0; }

      .lt-theme-body {
        padding: 10px 11px 11px;
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .lt-theme-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background: #17171c;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
      }
      .lt-theme-switch-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .lt-theme-switch-text strong {
        font-size: 12px;
        font-weight: 500;
        color: #ececf0;
      }
      .lt-theme-switch-text small {
        font-size: 10.5px;
        color: #7c7c88;
      }
      .lt-theme-switch input {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        width: 30px;
        height: 17px;
        border-radius: 99px;
        background: #25252d;
        border: 1px solid rgba(255, 255, 255, 0.08);
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.15s, border-color 0.15s;
      }
      .lt-theme-switch input::after {
        content: "";
        position: absolute;
        top: 1.5px;
        left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #7c7c88;
        transition: transform 0.15s, background 0.15s;
      }
      .lt-theme-switch input:checked {
        background: #3b3b47;
        border-color: rgba(255, 255, 255, 0.25);
      }
      .lt-theme-switch input:checked::after {
        transform: translateX(12px);
        background: #f4f4f6;
      }

      .lt-theme-sec-title {
        font-size: 11px;
        color: #7c7c88;
        font-weight: 500;
        margin-bottom: -3px;
      }

      .lt-theme-presets {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
      }
      .lt-theme-preset-btn {
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: #17171c;
        color: #9e9ea9;
        font-size: 11.5px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        transition: background 0.12s, border-color 0.12s, color 0.12s;
      }
      .lt-theme-preset-btn:hover { background: #1f1f26; color: #e4e4e7; }
      .lt-theme-preset-btn.lt-theme-preset-btn--active {
        background: #272730;
        border-color: rgba(255, 255, 255, 0.24);
        color: #ffffff;
      }

      .lt-theme-palettes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
      }
      .lt-theme-pal-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 7px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: #17171c;
        color: #9e9ea9;
        font-size: 11px;
        cursor: pointer;
        transition: background 0.12s, border-color 0.12s, color 0.12s;
      }
      .lt-theme-pal-btn:hover { background: #1f1f26; color: #e4e4e7; }
      .lt-theme-pal-btn--active {
        border-color: rgba(255, 255, 255, 0.24);
        background: #272730;
        color: #ffffff;
      }
      .lt-theme-swatch {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }

      .lt-theme-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .lt-theme-field label {
        font-size: 11.5px;
        color: #9a9aa6;
        display: flex;
        justify-content: space-between;
        font-variant-numeric: tabular-nums;
      }
      .lt-theme-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 99px;
        outline: none;
        cursor: pointer;
      }
      .lt-theme-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #f4f4f6;
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
        cursor: pointer;
      }
      .lt-theme-range::-moz-range-thumb {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #f4f4f6;
        border: 1px solid rgba(0, 0, 0, 0.3);
        cursor: pointer;
      }

      .lt-theme-color-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 11.5px;
        color: #9a9aa6;
        padding-top: 4px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .lt-theme-color-row input[type="color"] {
        width: 34px;
        height: 24px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        cursor: pointer;
        padding: 2px;
      }

      @media (max-width: 768px) {
        .lt-theme-fab,
        .lt-theme-fab.lt-theme-fab--draw {
          top: auto;
          bottom: 58px;
          left: 10px;
          right: auto;
          height: 36px;
          padding: 0 14px;
          font-size: 13px;
          border-radius: 999px;
        }
        .lt-theme-panel,
        .lt-theme-panel.lt-theme-panel--draw {
          top: auto;
          bottom: 8px;
          left: 8px;
          right: 8px;
          width: auto;
          max-height: 64vh;
        }
        .lt-theme-preset-btn { min-height: 36px; font-size: 12.5px; }
      }
    `;
    target.appendChild(style);
  }

  applyRootClasses();
  injectThemeStyles();

  // =========================================================================
  // 3. Перехват движка холста (Z.prototype.clearCanvas) для прозрачного фона вокруг листа
  // =========================================================================
  function getApp() {
    return capturedApp || window.__lonetiApp || null;
  }

  function patchWorkCanvas(app) {
    if (!app || !app.work_canvas || app.work_canvas.__ltThemePatched) return;
    const wc = app.work_canvas;
    wc.__ltThemePatched = true;
    const origClear = wc.clearCanvas;

    wc.clearCanvas = function () {
      if (state.preset !== 'none') {
        this.ctx_canvas.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
        return;
      }
      if (state.darkTheme) {
        this.ctx_canvas.fillStyle = state.workspaceColor || '#11151d';
        this.ctx_canvas.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
        return;
      }
      return origClear.apply(this, arguments);
    };

    try {
      app.updateArtCanvas();
    } catch (_) {}
  }

  const origObjectCreate = Object.create;
  Object.create = function (proto) {
    const res = origObjectCreate.apply(this, arguments);
    if (
      proto &&
      typeof proto === 'object' &&
      typeof proto.initWorkCanvas === 'function' &&
      typeof proto.updateArtCanvas === 'function' &&
      typeof proto.init === 'function' &&
      !proto.__ltThemeHooked
    ) {
      proto.__ltThemeHooked = true;
      const origInit = proto.init;
      proto.init = function (...args) {
        capturedApp = this;
        window.__lonetiApp = this;
        const out = origInit.apply(this, args);
        patchWorkCanvas(this);
        return out;
      };
    }
    return res;
  };

  function refreshCanvasWorkspace() {
    const app = getApp();
    if (app) {
      patchWorkCanvas(app);
      try {
        app.updateArtCanvas();
      } catch (_) {}
    }
  }

  // =========================================================================
  // 4. Движок встроенных анимированных фонов (Canvas 2D)
  // =========================================================================
  let bgCanvas = null;
  let bgCtx = null;
  let bgRaf = null;
  let bgW = 0;
  let bgH = 0;
  let lastTime = 0;
  let simTime = 0;
  let mouse = { x: -9999, y: -9999, active: false };
  let entities = [];
  let activePresetCache = '';

  function rgba(rgb, a) {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  }

  function initEntities(preset) {
    activePresetCache = preset;
    entities = [];
    const area = Math.max(1, bgW * bgH);
    const scaleCount = (base) => Math.max(12, Math.min(180, Math.round((base * area) / (1920 * 1080))));

    if (preset === 'stars') {
      const n = scaleCount(130);
      for (let i = 0; i < n; i++) {
        entities.push({
          type: 'star',
          x: Math.random() * bgW,
          y: Math.random() * bgH,
          r: 0.6 + Math.random() * 1.9,
          speed: 4 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          twinkle: 1 + Math.random() * 2.5,
          ci: i % 3,
        });
      }
    } else if (preset === 'constellation') {
      const n = scaleCount(68);
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 12 + Math.random() * 24;
        entities.push({
          x: Math.random() * bgW,
          y: Math.random() * bgH,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: 1.5 + Math.random() * 2,
          ci: i % 3,
        });
      }
    } else if (preset === 'sakura') {
      const n = scaleCount(55);
      for (let i = 0; i < n; i++) {
        entities.push({
          x: Math.random() * bgW,
          y: Math.random() * bgH,
          size: 5 + Math.random() * 8,
          vy: 22 + Math.random() * 32,
          vx: -10 + Math.random() * 26,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 1.8,
          sway: Math.random() * Math.PI * 2,
          ci: i % 3,
        });
      }
    } else if (preset === 'rain') {
      const n = scaleCount(95);
      for (let i = 0; i < n; i++) {
        entities.push({
          x: Math.random() * bgW,
          y: Math.random() * bgH,
          len: 20 + Math.random() * 48,
          vy: 220 + Math.random() * 300,
          w: 1 + Math.random() * 1.5,
          alpha: 0.18 + Math.random() * 0.45,
          ci: i % 3,
        });
      }
    } else if (preset === 'bokeh') {
      const n = scaleCount(34);
      for (let i = 0; i < n; i++) {
        entities.push({
          x: Math.random() * bgW,
          y: Math.random() * bgH,
          r: 22 + Math.random() * 68,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18,
          alpha: 0.06 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
          ci: i % 3,
        });
      }
    }
  }

  function drawBackdrop(pal) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, bgH);
    grad.addColorStop(0, pal.bgTop);
    grad.addColorStop(1, pal.bgBottom);
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, bgW, bgH);
  }

  function renderAnimationFrame(dt) {
    if (!bgCtx || state.preset === 'none') return;
    const pal = PALETTES[state.palette] || PALETTES.night;
    const cols = [pal.c1, pal.c2, pal.c3];
    const scaledDt = dt * state.speed;
    simTime += scaledDt;

    bgCanvas.style.opacity = String(state.opacity / 100);
    drawBackdrop(pal);

    if (activePresetCache !== state.preset) {
      initEntities(state.preset);
    }

    if (state.preset === 'stars') {
      for (const s of entities) {
        s.y += s.speed * scaledDt;
        if (s.y > bgH + 4) {
          s.y = -4;
          s.x = Math.random() * bgW;
        }
        const alpha = 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(simTime * s.twinkle + s.phase));
        bgCtx.fillStyle = rgba(cols[s.ci], alpha);
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bgCtx.fill();
      }
    } else if (state.preset === 'aurora') {
      for (let b = 0; b < 3; b++) {
        const col = cols[b];
        const baseY = bgH * (0.28 + b * 0.18);
        const amp = Math.min(140, bgH * 0.16);
        bgCtx.beginPath();
        bgCtx.moveTo(0, bgH);
        const step = Math.max(16, Math.round(bgW / 40));
        for (let x = 0; x <= bgW + step; x += step) {
          const y =
            baseY +
            Math.sin(x * 0.003 + simTime * (0.55 + b * 0.18) + b * 2) * amp * 0.6 +
            Math.cos(x * 0.006 - simTime * 0.35 + b) * amp * 0.4;
          bgCtx.lineTo(x, y);
        }
        bgCtx.lineTo(bgW, bgH);
        bgCtx.closePath();

        const g = bgCtx.createLinearGradient(0, baseY - amp, 0, bgH);
        g.addColorStop(0, rgba(col, 0.26));
        g.addColorStop(0.45, rgba(col, 0.08));
        g.addColorStop(1, rgba(col, 0));
        bgCtx.fillStyle = g;
        bgCtx.fill();
      }
    } else if (state.preset === 'constellation') {
      const linkDist = Math.min(155, Math.max(95, bgW * 0.12));
      for (const p of entities) {
        p.x += p.vx * scaledDt;
        p.y += p.vy * scaledDt;
        if (p.x < 0 || p.x > bgW) p.vx *= -1;
        if (p.y < 0 || p.y > bgH) p.vy *= -1;
        p.x = Math.max(0, Math.min(bgW, p.x));
        p.y = Math.max(0, Math.min(bgH, p.y));
      }

      bgCtx.lineWidth = 1;
      for (let i = 0; i < entities.length; i++) {
        const a = entities[i];
        for (let j = i + 1; j < entities.length; j++) {
          const b = entities[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const al = (1 - d / linkDist) * 0.32;
            bgCtx.strokeStyle = rgba(cols[a.ci], al);
            bgCtx.beginPath();
            bgCtx.moveTo(a.x, a.y);
            bgCtx.lineTo(b.x, b.y);
            bgCtx.stroke();
          }
        }
        if (mouse.active) {
          const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (md < linkDist * 1.25) {
            bgCtx.strokeStyle = rgba(cols[0], (1 - md / (linkDist * 1.25)) * 0.45);
            bgCtx.beginPath();
            bgCtx.moveTo(a.x, a.y);
            bgCtx.lineTo(mouse.x, mouse.y);
            bgCtx.stroke();
          }
        }
      }

      for (const p of entities) {
        bgCtx.fillStyle = rgba(cols[p.ci], 0.85);
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fill();
      }
    } else if (state.preset === 'sakura') {
      for (const f of entities) {
        f.y += f.vy * scaledDt;
        f.x += (f.vx + Math.sin(simTime * 1.3 + f.sway) * 18) * scaledDt;
        f.rot += f.vrot * scaledDt;
        if (f.y > bgH + 20) {
          f.y = -20;
          f.x = Math.random() * bgW;
        }
        if (f.x < -20) f.x = bgW + 20;
        if (f.x > bgW + 20) f.x = -20;

        bgCtx.save();
        bgCtx.translate(f.x, f.y);
        bgCtx.rotate(f.rot);
        bgCtx.fillStyle = rgba(cols[f.ci], 0.72);
        bgCtx.beginPath();
        bgCtx.ellipse(0, 0, f.size, f.size * 0.55, 0, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }
    } else if (state.preset === 'rain') {
      for (const r of entities) {
        r.y += r.vy * scaledDt;
        if (r.y - r.len > bgH) {
          r.y = -Math.random() * 60;
          r.x = Math.random() * bgW;
        }
        const g = bgCtx.createLinearGradient(r.x, r.y - r.len, r.x, r.y);
        g.addColorStop(0, rgba(cols[r.ci], 0));
        g.addColorStop(1, rgba(cols[r.ci], r.alpha));
        bgCtx.strokeStyle = g;
        bgCtx.lineWidth = r.w;
        bgCtx.beginPath();
        bgCtx.moveTo(r.x, r.y - r.len);
        bgCtx.lineTo(r.x, r.y);
        bgCtx.stroke();
      }
    } else if (state.preset === 'bokeh') {
      for (const b of entities) {
        b.x += b.vx * scaledDt;
        b.y += b.vy * scaledDt;
        if (b.x < -b.r) b.x = bgW + b.r;
        if (b.x > bgW + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = bgH + b.r;
        if (b.y > bgH + b.r) b.y = -b.r;

        const pulse = 0.75 + 0.25 * Math.sin(simTime * 0.9 + b.phase);
        const g = bgCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, rgba(cols[b.ci], b.alpha * pulse));
        g.addColorStop(0.7, rgba(cols[b.ci], b.alpha * 0.35 * pulse));
        g.addColorStop(1, rgba(cols[b.ci], 0));
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        bgCtx.fill();
      }
    } else if (state.preset === 'waves') {
      for (let w = 0; w < 4; w++) {
        const col = cols[w % 3];
        const baseY = bgH * (0.58 + w * 0.1);
        const amp = Math.min(70, bgH * 0.08);
        bgCtx.beginPath();
        bgCtx.moveTo(0, bgH);
        const step = Math.max(14, Math.round(bgW / 45));
        for (let x = 0; x <= bgW + step; x += step) {
          const y =
            baseY +
            Math.sin(x * 0.005 + simTime * (0.7 + w * 0.22) + w * 1.4) * amp +
            Math.cos(x * 0.0025 - simTime * 0.4 + w) * amp * 0.45;
          bgCtx.lineTo(x, y);
        }
        bgCtx.lineTo(bgW, bgH);
        bgCtx.closePath();
        bgCtx.fillStyle = rgba(col, 0.16 + w * 0.04);
        bgCtx.fill();
      }
    }
  }

  function resizeBgCanvas() {
    if (!bgCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    bgW = Math.max(1, window.innerWidth);
    bgH = Math.max(1, window.innerHeight);
    bgCanvas.width = Math.round(bgW * dpr);
    bgCanvas.height = Math.round(bgH * dpr);
    if (bgCtx) bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initEntities(state.preset);
  }

  function ensureBgCanvas() {
    if (state.preset === 'none') {
      if (bgRaf) {
        cancelAnimationFrame(bgRaf);
        bgRaf = null;
      }
      if (bgCanvas && bgCanvas.isConnected) {
        bgCanvas.style.display = 'none';
      }
      return;
    }

    if (!bgCanvas) {
      if (!document.body) return;
      bgCanvas = document.createElement('canvas');
      bgCanvas.id = 'lt-theme-bg-canvas';
      document.body.insertBefore(bgCanvas, document.body.firstChild);
      bgCtx = bgCanvas.getContext('2d');
      resizeBgCanvas();
    } else {
      bgCanvas.style.display = 'block';
    }

    if (!bgRaf) {
      lastTime = performance.now();
      const loop = (now) => {
        if (state.preset === 'none') {
          bgRaf = null;
          return;
        }
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;
        if (!document.hidden) {
          renderAnimationFrame(dt);
        }
        bgRaf = requestAnimationFrame(loop);
      };
      bgRaf = requestAnimationFrame(loop);
    }
  }

  // =========================================================================
  // 5. UI редактора тем и выбора анимаций
  // =========================================================================
  let ui = null;

  function initUI() {
    if (ui || !document.body) return;
    injectThemeStyles();

    const isDrawPage = !!document.querySelector('.js--work-canvas');

    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'lt-theme-fab' + (isDrawPage ? ' lt-theme-fab--draw' : '');
    fab.title = 'Тёмная тема и анимированный фон (Alt+T)';
    fab.textContent = 'Тема';

    const panel = document.createElement('div');
    panel.className = 'lt-theme-panel' + (isDrawPage ? ' lt-theme-panel--draw' : '');

    const presetsHtml = ANIM_PRESETS.map(
      (p) =>
        `<button type="button" class="lt-theme-preset-btn" data-preset="${p.id}">${p.name}</button>`
    ).join('');

    const palettesHtml = Object.entries(PALETTES)
      .map(
        ([id, p]) =>
          `<button type="button" class="lt-theme-pal-btn" data-pal="${id}">
            <span class="lt-theme-swatch" style="background: linear-gradient(135deg, rgb(${p.c1.join(',')}), rgb(${p.c2.join(',')}))"></span>
            <span>${p.name.split(' ')[0]}</span>
          </button>`
      )
      .join('');

    panel.innerHTML = `
      <div class="lt-theme-header" id="lt-theme-drag">
        <span>Тема и фон</span>
        <button type="button" class="lt-theme-close" title="Закрыть">&times;</button>
      </div>
      <div class="lt-theme-body">
        <label class="lt-theme-switch">
          <div class="lt-theme-switch-text">
            <strong>Тёмная тема</strong>
            <small>Кроме холста, палитры и фото</small>
          </div>
          <input type="checkbox" id="lt-theme-dark-toggle" />
        </label>

        <div class="lt-theme-sec-title">Анимация фона</div>
        <div class="lt-theme-presets">${presetsHtml}</div>

        <div class="lt-theme-sec-title">Палитра фона</div>
        <div class="lt-theme-palettes">${palettesHtml}</div>

        <div class="lt-theme-field">
          <label><span>Скорость</span><span id="lt-theme-speed-val">1.0x</span></label>
          <input type="range" class="lt-theme-range" id="lt-theme-speed" min="0.2" max="2.5" step="0.1" />
        </div>

        <div class="lt-theme-field">
          <label><span>Яркость фона</span><span id="lt-theme-opacity-val">90%</span></label>
          <input type="range" class="lt-theme-range" id="lt-theme-opacity" min="15" max="100" step="5" />
        </div>

        <div class="lt-theme-color-row">
          <span>Фон вокруг холста (без анимации)</span>
          <input type="color" id="lt-theme-ws-color" />
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    ui = {
      fab,
      panel,
      darkToggle: panel.querySelector('#lt-theme-dark-toggle'),
      speed: panel.querySelector('#lt-theme-speed'),
      speedVal: panel.querySelector('#lt-theme-speed-val'),
      opacity: panel.querySelector('#lt-theme-opacity'),
      opacityVal: panel.querySelector('#lt-theme-opacity-val'),
      wsColor: panel.querySelector('#lt-theme-ws-color'),
      presetBtns: [...panel.querySelectorAll('[data-preset]')],
      palBtns: [...panel.querySelectorAll('[data-pal]')],
    };

    syncUI();
    bindUIEvents();
    makePanelDraggable(panel, panel.querySelector('#lt-theme-drag'));
    ensureBgCanvas();
    refreshCanvasWorkspace();
    startNicknameObserver();
    if (isDrawPage) {
      setTimeout(refreshCanvasWorkspace, 300);
    }
  }

  let nickTimer = null;
  function scheduleMarkNicknames() {
    if (!state.darkTheme || nickTimer) return;
    nickTimer = setTimeout(() => {
      nickTimer = null;
      markNicknames();
    }, 100);
  }

  function markNicknames() {
    if (!state.darkTheme || !document.body) return;
    const root = document.getElementById('content') || document.body;
    const candidates = root.querySelectorAll('a:not(.lt-theme-nick), [class*="name"]:not(.lt-theme-nick), [class*="nick"]:not(.lt-theme-nick), [class*="author"]:not(.lt-theme-nick)');
    for (const el of candidates) {
      if (el.closest('#header, .lt-theme-panel, .lt-imp-panel, .lt-imp-minibar, .one_activity, button')) continue;
      const cls = typeof el.className === 'string' ? el.className : '';
      if (/btn/i.test(cls)) continue;
      if (el.tagName === 'A') {
        const href = (el.getAttribute('href') || '').trim();
        if (/^https?:\/\//i.test(href) && !/^https?:\/\/([^/]+\.)?loneti\./i.test(href)) continue;
      }
      if (typeof window.getComputedStyle !== 'function') continue;
      const cs = window.getComputedStyle(el);
      const bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') continue;
      const m = cs.color && cs.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) continue;
      const r = Number(m[1]);
      const g = Number(m[2]);
      const b = Number(m[3]);
      if (b >= 115 && b - r >= 35 && b - g >= 15) {
        el.classList.add('lt-theme-nick');
      }
    }
  }

  function startNicknameObserver() {
    markNicknames();
    const target = document.getElementById('content') || document.body;
    if (!target || typeof MutationObserver !== 'function') return;
    const obs = new MutationObserver(() => scheduleMarkNicknames());
    obs.observe(target, { childList: true, subtree: true });
  }

  function syncUI() {
    if (!ui) return;
    ui.darkToggle.checked = state.darkTheme;
    ui.speed.value = String(state.speed);
    ui.speedVal.textContent = `${state.speed.toFixed(1)}x`;
    ui.opacity.value = String(state.opacity);
    ui.opacityVal.textContent = `${state.opacity}%`;
    ui.wsColor.value = state.workspaceColor;
    ui.presetBtns.forEach((b) => {
      b.classList.toggle('lt-theme-preset-btn--active', b.dataset.preset === state.preset);
    });
    ui.palBtns.forEach((b) => {
      b.classList.toggle('lt-theme-pal-btn--active', b.dataset.pal === state.palette);
    });
  }

  function togglePanel(force) {
    if (!ui) return;
    state.isOpen = typeof force === 'boolean' ? force : !state.isOpen;
    ui.panel.classList.toggle('lt-theme-panel--open', state.isOpen);
    ui.fab.classList.toggle('lt-theme-fab--active', state.isOpen);
  }

  function bindUIEvents() {
    ui.fab.addEventListener('click', () => togglePanel());
    ui.panel.querySelector('.lt-theme-close').addEventListener('click', () => togglePanel(false));

    ui.darkToggle.addEventListener('change', () => {
      state.darkTheme = ui.darkToggle.checked;
      saveSettings();
      applyRootClasses();
      refreshCanvasWorkspace();
      if (state.darkTheme) markNicknames();
    });

    ui.presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.preset = btn.dataset.preset;
        saveSettings();
        syncUI();
        applyRootClasses();
        ensureBgCanvas();
        refreshCanvasWorkspace();
      });
    });

    ui.palBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.palette = btn.dataset.pal;
        saveSettings();
        syncUI();
      });
    });

    ui.speed.addEventListener('input', () => {
      state.speed = Number(ui.speed.value) || 1;
      ui.speedVal.textContent = `${state.speed.toFixed(1)}x`;
      saveSettings();
    });

    ui.opacity.addEventListener('input', () => {
      state.opacity = Number(ui.opacity.value) || 90;
      ui.opacityVal.textContent = `${state.opacity}%`;
      saveSettings();
    });

    ui.wsColor.addEventListener('input', () => {
      state.workspaceColor = ui.wsColor.value;
      saveSettings();
      refreshCanvasWorkspace();
    });

    window.addEventListener('resize', resizeBgCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.code === 'KeyT' || e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'е')) {
        e.preventDefault();
        togglePanel();
      }
    });
  }

  function makePanelDraggable(panel, handle) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initLeft = 0;
    let initTop = 0;

    handle.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      startX = e.clientX;
      startY = e.clientY;
      initLeft = rect.left;
      initTop = rect.top;
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const nextLeft = Math.max(8, Math.min(window.innerWidth - 60, initLeft + (e.clientX - startX)));
      const nextTop = Math.max(8, Math.min(window.innerHeight - 40, initTop + (e.clientY - startY)));
      panel.style.left = nextLeft + 'px';
      panel.style.top = nextTop + 'px';
    });

    const stop = (e) => {
      if (!dragging) return;
      dragging = false;
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyRootClasses();
      injectThemeStyles();
      initUI();
    }, { once: true });
  } else {
    initUI();
  }
})();
