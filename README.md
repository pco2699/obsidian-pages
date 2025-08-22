# Obsidian Pages - Static Site Generator

A simple, fast static site generator that converts Markdown files to HTML pages.

## Features

- ✅ Markdown to HTML conversion with syntax highlighting
- ✅ Front matter support for page metadata
- ✅ Responsive, clean design
- ✅ Automatic index page generation
- ✅ GitHub Pages deployment ready

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your Markdown files to the `src/` directory:**
   ```bash
   # Example file: src/my-post.md
   ---
   title: My Blog Post
   date: 2025-08-20
   ---
   
   # My Blog Post
   
   This is my content written in Markdown.
   ```

3. **Build the site:**
   ```bash
   npm run build
   ```

4. **Preview locally:**
   ```bash
   npm run serve
   # Visit http://localhost:8080
   ```

## Deployment Options

### GitHub Pages
1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. The included GitHub Action will automatically build and deploy on pushes to main

### Custom Domain
1. Build your site: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. Point your domain to the server

### Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Scripts

- `npm run build` - Generate static HTML files in `dist/`
- `npm run serve` - Serve the site locally on http://localhost:8080
- `npm run dev` - Build and serve in one command

## File Structure

```
obsidian-pages/
├── src/                 # Your Markdown files
│   ├── index.md        # Homepage
│   └── about.md        # Other pages
├── dist/               # Generated HTML (created after build)
├── build.js            # Build script
├── package.json        # Dependencies and scripts
└── .github/workflows/  # GitHub Actions for deployment
```

## Front Matter

Add metadata to your Markdown files:

```yaml
---
title: Page Title
date: 2025-08-20
description: Page description
---

Your Markdown content here...
```

## Customization

Edit `build.js` to modify:
- HTML template and styling
- Markdown parsing options
- File processing logic
- Site structure