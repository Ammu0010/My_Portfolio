# My Portfolio

Personal portfolio website for **Sri Vishnupriya** — B.Sc Computer Science with Data Science student, focused on AI, Machine Learning, Python, and OCR technologies.

Built as a single-page site with vanilla HTML, CSS, and JavaScript (no build step).

## Features

- Responsive layout with light/dark theme (respects OS preference, remembers your choice)
- Animated hero typing effect, scroll progress bar, and reveal-on-scroll animations
- Filterable projects grid
- Contact form wired to [FormSubmit](https://formsubmit.co/)
- Accessible markup and `prefers-reduced-motion` support
- Icons via [Lucide](https://lucide.dev/)

## Run locally

It's a static site — open `index.html` directly in a browser, or serve the folder:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
.
├── index.html      # Page markup
├── style.css       # Styles, theming, animations
├── script.js       # Theme toggle, typing effect, scroll/filter/form logic
└── assets/         # Images and resume PDF
```

## Deployment

Any static host works — GitHub Pages, Netlify, or Vercel. For GitHub Pages,
enable Pages on the `main` branch in the repository settings.
