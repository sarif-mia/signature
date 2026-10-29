# Signature Studio

A professional, private, browser-based HTML email signature generator. Create a polished signature, preview it inside a realistic email, and copy or download email-client-friendly HTML.

**Live app:** [signature-nine-kohl.vercel.app](https://signature-nine-kohl.vercel.app)

## Features

- Live signature preview
- Guided four-step builder for templates, details, images, and styling
- Six professional, email-safe layouts
- Identity, company, department, contact, location, and social fields
- Custom company logo and profile image URLs
- Brand color, font family, font size, and call-to-action controls
- Rich HTML clipboard copy and standalone HTML download
- **Multi-language interface** — English, Español, Français, Deutsch, বাংলা, العربية (with full right-to-left layout)
- Automatic local browser saving
- Responsive and accessible interface
- No account, backend, tracking, or data upload

## Run locally

No build step or dependencies are required. Because the JavaScript uses native ES modules, serve the directory over HTTP:

```bash
npm run dev        # or: npx serve .
```

## Project structure

```text
├── index.html                      # Landing page
├── builder.html                    # Signature builder
├── assets/
│   ├── css/
│   │   ├── base.css                # Design tokens, reset, shared primitives, RTL rules
│   │   ├── layout.css              # Header, navigation, language switcher, footer
│   │   ├── home.css                # Landing page sections
│   │   └── builder.css             # Builder form, preview, and export actions
│   └── js/
│       ├── pages/
│       │   ├── home.js             # Landing page entry point
│       │   └── builder.js          # Builder entry point (form state, preview, copy/download)
│       ├── components/
│       │   └── language-switcher.js
│       ├── core/
│       │   ├── config.js           # Shared constants
│       │   ├── storage.js          # Safe localStorage wrapper
│       │   └── utils.js            # Escaping, URL sanitizing, downloads
│       ├── signature/
│       │   └── templates.js        # Email-safe signature layouts
│       └── i18n/
│           ├── index.js            # Translation engine (t, setLocale, translatePage)
│           └── locales/            # One file per language; en.js is the source
├── scripts/
│   └── check-locales.mjs           # Verifies every locale matches en.js
└── vercel.json                     # Static hosting configuration
```

## Internationalization

Text in the HTML is marked with data attributes and translated at runtime:

| Attribute | Effect |
| --- | --- |
| `data-i18n="key"` | Sets the element's text |
| `data-i18n-html="key"` | Sets trusted markup (e.g. a `<br />` in headings) |
| `data-i18n-attr="placeholder:key;aria-label:key"` | Sets attributes |
| `data-i18n-params='{"current":1}'` | Fills `{current}` placeholders |

In JavaScript, use `t("builder.status.copied")`.

The language is chosen from, in order: a `?lang=` URL parameter, the visitor's saved choice, their browser languages, then English. Right-to-left languages set `dir="rtl"` on the page automatically.

### Adding a language

1. Copy `assets/js/i18n/locales/en.js` to `<code>.js` and translate the values.
2. Register it in `LOCALES` in `assets/js/i18n/index.js` (with `dir: "rtl"` if needed).
3. Run `npm run check:i18n` to confirm no keys or placeholders are missing.

## Deploy

The repository is ready for Vercel as a static site. Import the repository and leave the framework preset as **Other**; no build command is needed.

## Privacy

All entered data remains in the browser and is stored only in local storage for convenience.

## Author

Built by [Sarif Mia](https://github.com/sarif-mia).
