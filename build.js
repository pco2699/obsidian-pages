const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const hljs = require('highlight.js');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  }
});

const srcDir = './src';
const distDir = './dist';

// HTML template
const template = (title, content, frontMatter = {}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h1 {
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
        }
        pre {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 1rem;
            overflow-x: auto;
        }
        code {
            background: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            margin: 0;
            color: #6a737d;
        }
        .nav {
            margin-bottom: 2rem;
        }
        .nav a {
            margin-right: 1rem;
            color: #0366d6;
            text-decoration: none;
        }
        .nav a:hover {
            text-decoration: underline;
        }
        .meta {
            color: #6a737d;
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="/">Home</a>
    </nav>
    ${frontMatter.date ? `<div class="meta">Published: ${frontMatter.date}</div>` : ''}
    ${content}
</body>
</html>
`;

async function buildSite() {
    try {
        // Clean and create dist directory
        await fs.emptyDir(distDir);

        // Ensure src directory exists
        await fs.ensureDir(srcDir);

        // Find all markdown files
        const files = await fs.readdir(srcDir, { withFileTypes: true });
        const markdownFiles = files
            .filter(file => file.isFile() && file.name.endsWith('.md'))
            .map(file => file.name);

        if (markdownFiles.length === 0) {
            console.log('No markdown files found in src/ directory');
            return;
        }

        // Process each markdown file
        const pages = [];
        for (const file of markdownFiles) {
            const filePath = path.join(srcDir, file);
            const fileContent = await fs.readFile(filePath, 'utf8');
            
            // Parse front matter
            const { data: frontMatter, content } = matter(fileContent);
            
            // Convert markdown to HTML
            const html = md.render(content);
            
            // Generate page title
            const title = frontMatter.title || path.basename(file, '.md');
            
            // Create HTML file
            const htmlFileName = file.replace('.md', '.html');
            const htmlContent = template(title, html, frontMatter);
            
            await fs.writeFile(path.join(distDir, htmlFileName), htmlContent);
            
            pages.push({
                title,
                filename: htmlFileName,
                ...frontMatter
            });
            
            console.log(`Generated: ${htmlFileName}`);
        }

        // Generate index page
        const indexContent = `
            <h1>Pages</h1>
            <ul>
                ${pages.map(page => `<li><a href="${page.filename}">${page.title}</a></li>`).join('')}
            </ul>
        `;
        const indexHtml = template('Home', indexContent);
        await fs.writeFile(path.join(distDir, 'index.html'), indexHtml);
        
        console.log('Generated: index.html');
        console.log(`\\nBuild complete! Generated ${pages.length + 1} pages.`);
        console.log('Run "npm run serve" to preview your site at http://localhost:8080');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildSite();