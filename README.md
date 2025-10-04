# i-am-zain - Personal Portfolio Website

A highly performant, accessible, and modern personal portfolio website built with pure HTML5, modern JavaScript, and Tailwind CSS. Designed for easy customization and optimized for Lighthouse scores of 95+.

## ✨ Features

- **🚀 High Performance**: Optimized for Lighthouse scores of 95+ across all metrics
- **📱 Fully Responsive**: Mobile-first design that works perfectly on all devices
- **♿ Accessible**: WCAG 2.1 AA compliant with semantic HTML5 and ARIA labels
- **🎨 Modern Design**: Clean, professional aesthetic with subtle animations
- **📝 Easy Customization**: All content managed through a single JSON configuration file
- **🎯 SEO Optimized**: Complete meta tags, Open Graph, and Twitter Card support
- **⚡ Fast Loading**: Optimized assets with intelligent caching strategies
- **🔧 Developer Friendly**: Clean, maintainable code with comprehensive documentation

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern JavaScript (ES6+), Tailwind CSS
- **Build Tools**: Tailwind CLI, Live Server
- **Deployment**: Netlify with automatic deployments
- **Performance**: Optimized caching, lazy loading, and asset optimization

## 📋 System Requirements

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control and deployment

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/i-am-zain.git
cd i-am-zain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run start
```

This will:
- Start Tailwind CSS in watch mode
- Launch a live development server on `http://localhost:3000`
- Automatically open your browser
- Watch for changes and auto-reload

### 4. Build for Production

```bash
npm run build
```

This generates optimized CSS for production deployment.

## 📝 Configuration Guide

### Personal Content Customization

All personal information, projects, skills, and content are managed through the `config/data.json` file. Simply edit this file to customize your portfolio:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "tagline": "Your personal tagline",
    "email": "your@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "Your City, State",
    "website": "https://yourwebsite.com",
    "profileImage": "/public/images/profile.jpg",
    "resumeUrl": "/public/documents/your-resume.pdf"
  },
  "summary": "Your professional summary...",
  "skills": {
    "technical": {
      "frontend": ["React", "Vue.js", "JavaScript", "..."],
      "backend": ["Node.js", "Python", "..."],
      "tools": ["Git", "Docker", "..."],
      "concepts": ["Responsive Design", "..."]
    }
  },
  "experience": [...],
  "projects": [...],
  "social": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername",
    "twitter": "https://twitter.com/yourusername"
  }
}
```

### Key Sections to Customize:

1. **Personal Information**: Name, title, contact details, and profile image
2. **Professional Summary**: Brief description of your background and expertise
3. **Skills**: Technical skills organized by category (frontend, backend, tools, concepts)
4. **Experience**: Work history with achievements and technologies used
5. **Projects**: Portfolio projects with descriptions, features, and links
6. **Social Links**: Links to your professional social media profiles
7. **SEO Metadata**: Title, description, keywords for search engine optimization

### Adding Your Images

1. **Profile Photo**: Add your professional headshot as `/public/images/profile.jpg`
2. **Project Images**: Add project screenshots to `/public/images/projects/`
3. **Resume**: Add your resume PDF to `/public/documents/`

## 🎨 Styling Guide

### Color Customization

The website uses CSS custom properties for easy color customization. Edit the `src/css/input.css` file to change the color palette:

```css
:root {
  /* Primary Color (Blue by default) */
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  
  /* Accent Color (Emerald by default) */
  --color-accent-500: #10b981;
  --color-accent-600: #059669;
  
  /* Neutral Colors (Slate by default) */
  --color-neutral-500: #64748b;
  --color-neutral-900: #0f172a;
}
```

### Tailwind Configuration

Customize the Tailwind configuration in `tailwind.config.js`:

- **Fonts**: Change the font family
- **Spacing**: Add custom spacing values
- **Animations**: Modify or add new animations
- **Colors**: Extend the color palette

### Custom Animations

The website includes several built-in animations:
- Scroll-triggered fade-ins
- Hover effects on cards and buttons
- Smooth transitions
- Subtle parallax effects (on larger screens)

## 🚀 Netlify Deployment Guide

### Live Deployment

The project is currently deployed and accessible at:

**[https://i-am-zain.netlify.app](https://i-am-zain.netlify.app)**

### Automatic Deployment Setup

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your `i-am-zain` repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `src`
   - Node version: `18`

4. **Deploy**: Netlify will automatically deploy your site and provide a URL

### Custom Domain Setup

1. **Add Custom Domain**: In Netlify dashboard, go to Domain settings
2. **Configure DNS**: Point your domain to Netlify's servers
3. **Enable HTTPS**: Netlify provides free SSL certificates

### Environment Variables (if needed)

For contact forms or analytics:
1. Go to Site settings > Environment variables
2. Add your API keys or service credentials

## 📊 Performance Optimization

### Built-in Optimizations

- **Efficient CSS**: Tailwind CSS with purging for minimal file size
- **Optimized Images**: Lazy loading and proper sizing
- **Caching Strategy**: Aggressive caching for static assets via Netlify headers
- **Minimal JavaScript**: Vanilla JS with no heavy frameworks
- **Semantic HTML**: Proper structure for better SEO and accessibility

### Lighthouse Scores Target

The website is optimized to achieve:
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## 📁 Project Structure

```
i-am-zain/
├── src/                          # Source files
│   ├── index.html               # Main HTML file
│   ├── css/
│   │   ├── input.css           # Tailwind input file with custom styles
│   │   └── output.css          # Generated CSS (auto-created)
│   └── js/
│       ├── main.js             # Main JavaScript functionality
│       ├── animations.js       # Animation and scroll effects
│       └── form.js             # Contact form handling
├── config/
│   └── data.json               # All editable content and data
├── public/
│   ├── images/                 # Profile and project images
│   │   └── projects/           # Project screenshots
│   └── documents/              # Resume and other documents
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── netlify.toml                # Netlify deployment configuration
└── README.md                   # This file
```

## 🔧 Development Scripts

```bash
# Start development server with live reload
npm run start

# Build for production
npm run build

# Development server only (no CSS watch)
npm run preview
```

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility**: Screen readers and assistive technologies

## 🛡️ Security Features

- **Content Security Policy**: Implemented via Netlify headers
- **XSS Protection**: Built-in browser security headers
- **HTTPS**: Enforced on all pages
- **Form Protection**: Honeypot fields for spam prevention

## 🤝 Contributing

This is a personal portfolio template, but contributions for improvements are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**CSS not updating?**
- Run `npm run build` to regenerate the CSS
- Clear browser cache

**Images not loading?**
- Check file paths in `config/data.json`
- Ensure images are in the correct `/public/images/` directory

**Form not working?**
- Verify Netlify form configuration
- Check browser console for JavaScript errors

**Performance issues?**
- Optimize images (use WebP format when possible)
- Check Lighthouse report for specific recommendations

### Getting Help

- **Issues**: Open an issue on GitHub
- **Documentation**: Check this README file
- **Netlify Docs**: [Netlify Documentation](https://docs.netlify.com)
- **Tailwind Docs**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎯 Recommended Git Workflow

### Branch Strategy

- **`main`**: Production branch (auto-deploys to live site)
- **`develop`**: Integration branch for new features
- **`feature/*`**: Individual feature development branches

### Workflow

1. Create feature branch: `git checkout -b feature/new-project`
2. Make changes and commit: `git commit -am "Add new project"`
3. Push to GitHub: `git push origin feature/new-project`
4. Create Pull Request to `develop`
5. Merge to `main` for deployment

---

**Made with ❤️ using HTML5, JavaScript, and Tailwind CSS**

*This portfolio template is designed to showcase your work professionally while maintaining excellent performance and accessibility standards.*
