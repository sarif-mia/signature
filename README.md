# Signature Studio

A professional, private, browser-based HTML email signature generator. Create a polished signature, preview it inside a realistic email, and copy or download email-client-friendly HTML.

**Live app:** [signature-nine-kohl.vercel.app](https://signature-nine-kohl.vercel.app)

## Features

- Live signature preview
- Identity, company, contact, location, and social fields
- Custom logo or profile image URL
- Brand color control
- Classic, compact, and minimal layouts
- Rich HTML clipboard copy
- Standalone HTML download
- Automatic local browser saving
- Responsive and accessible interface
- No account, backend, tracking, or data upload

## Run locally

No build step or dependencies are required. Because the JavaScript uses native ES modules, serve the directory locally:

```bash
npx serve .
```

## Project structure

```text
├── index.html          # Page structure and content
├── styles.css          # Responsive visual system
├── js/
│   ├── app.js          # UI events and rendering flow
│   ├── config.js       # Shared configuration
│   ├── signature.js    # Email-safe signature templates
│   ├── storage.js      # Local persistence
│   └── utils.js        # Sanitizing and download helpers
└── vercel.json         # Static hosting configuration
```

## Deploy

The repository is ready for Vercel as a static site. Import the repository and leave the framework preset as **Other**; no build command is needed.

## Privacy

All entered data remains in the browser and is stored only in local storage for convenience.

## Author

Built by [Sarif Mia](https://github.com/sarif-mia).
