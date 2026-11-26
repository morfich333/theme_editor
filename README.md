# Loneti.ru — Dark Theme & Animated Background

Minimalist dark theme and customizable Canvas 2D animated backgrounds for [loneti.ru](https://loneti.ru) — covering profiles, walls, chat, and the drawing editor workspace without distorting artwork colors.

## Install

1. **Install a userscript manager:**
   - Download **Tampermonkey** from the official website: **[tampermonkey.net](https://www.tampermonkey.net/)** *(links for Chrome, Firefox, Edge, Opera, and Safari)*.
   - **Mobile:** Firefox with Tampermonkey add-on on Android, or **Userscripts** / Tampermonkey for Safari on iOS.

2. **Enable browser permissions (Chrome / Chromium browsers):**
   - Open `chrome://extensions` *(or right-click the Tampermonkey icon -> **Manage Extension**)*.
   - On **Chrome 138+** (or newer Chromium): switch **Allow User Scripts** to **ON** in Tampermonkey's details.
   - On **older Chromium browsers** (without that toggle): enable **Developer mode** in the top-right corner of `chrome://extensions`.
   - Make sure site access is enabled (e.g. **On all sites** or allowed for `loneti.ru`).
   - *(Firefox works right after installing the add-on without extra toggles.)*

3. **Install the script:**

   **[Install `loneti-theme-editor.user.js`](https://raw.githubusercontent.com/morfich333/theme_editor/main/loneti-theme-editor.user.js)**

4. Confirm installation in Tampermonkey, then open or refresh `loneti.ru` (`F5`).

> Updates are picked up automatically from the `main` branch via `@updateURL` and `@downloadURL`.
> **Script privacy & permissions:** uses `@grant none` and only runs on `https://loneti.ru/*` and `https://*.loneti.ru/*`.

## Features

- **Instant True-Color Dark Mode (`document-start`)** — Applies before page paint to avoid white flashes. Darkens pages and the top `#header` bar with soft gray nicknames while keeping the drawing canvas, layer previews, color picker wheel, swatches, photos, and artworks un-inverted with accurate colors.
- **7 Built-in Animated Backgrounds** *(or turn off with `Без анимации` / None)*:
  - Starry Sky (`Звёздное небо`)
  - Aurora (`Северное сияние`)
  - Constellations (`Созвездия`, interactive with mouse cursor)
  - Petals (`Лепестки`)
  - Neon Rain (`Неоновый дождь`)
  - Bokeh (`Боке`)
  - Waves (`Волны`)
- **6 Background Color Palettes:** Night Blue, Violet Neon, Emerald, Sakura, Warm Sunset, and Monochrome.
- **Motion & Workspace Controls:** Adjust animation speed (`0.2x–2.5x`), background brightness/opacity (`15%–100%`), or set a custom solid color around the drawing canvas when animations are disabled.
- **Minimal Draggable Panel:** Toggle via the floating `Тема` button or press `Alt + T`. Preferences are saved automatically in `localStorage`.

## Repository Structure

| File | Description |
| :--- | :--- |
| [`loneti-theme-editor.user.js`](./loneti-theme-editor.user.js) | Main userscript source code |
| [`LICENSE`](./LICENSE) | MIT License |
| [`README.md`](./README.md) | Documentation, permissions guide, and direct install link |

## Controls

| Action | Shortcut / UI |
| :--- | :--- |
| Toggle theme & background panel | `Alt + T` or `Тема` button |
| Move panel | Drag by header (`Тема и фон`) |
| Workspace solid color | Color picker (`Фон вокруг холста`) when animation is off |

## License

Released under the [MIT License](./LICENSE).
