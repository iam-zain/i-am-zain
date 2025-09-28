/**
 * Main JavaScript file for the portfolio website
 * Handles data loading, navigation, and core functionality
 */

// Global variables
let portfolioData = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Load portfolio data
        await loadPortfolioData();
        
        // Populate all content
        populateContent();
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize back to top button
        initializeBackToTop();
        
        // Initialize smooth scrolling
        initializeSmoothScrolling();
        
        // Set current year in footer
        setCurrentYear();
        
        console.log('Portfolio app initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorMessage('Failed to load portfolio data. Please refresh the page.');
    }
}

/**
 * Load portfolio data from JSON file
 */
async function loadPortfolioData() {
    try {
        const response = await fetch('/config/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        portfolioData = await response.json();
        return portfolioData;
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        throw error;
    }
}

/**
 * Populate all content on the page
 */
function populateContent() {
    if (!portfolioData) {
        console.error('No portfolio data available');
        return;
    }

    // Populate SEO meta tags
    populateMetaTags();
    
    // Populate hero section
    populateHeroSection();
    
    // Populate about section
    populateAboutSection();
    
    // Populate experience section
    populateExperienceSection();
    
    // Populate projects section
    populateProjectsSection();
    
    // Populate contact section
    populateContactSection();
    
    // Populate footer
    populateFooter();
}

/**
 * Populate SEO meta tags
 */
function populateMetaTags() {
    const { personal, seo } = portfolioData;
    
    // Update title
    document.title = seo.metaTitle || `${personal.name} - ${personal.title}`;
    
    // Update meta tags
    updateMetaTag('description', seo.metaDescription);
    updateMetaTag('keywords', seo.keywords.join(', '));
    updateMetaTag('author', personal.name);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', seo.metaTitle);
    updateMetaProperty('og:description', seo.metaDescription);
    updateMetaProperty('og:image', seo.ogImage);
    updateMetaProperty('og:url', personal.website);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', seo.metaTitle);
    updateMetaTag('twitter:description', seo.metaDescription);
    updateMetaTag('twitter:image', seo.ogImage);
}

/**
 * Populate hero section
 */
function populateHeroSection() {
    const { personal, social } = portfolioData;
    
    // Update navigation name
    updateElement('nav-name', personal.name.split(' ')[0]);
    
    // Update hero content
    updateElement('hero-name', personal.name);
    updateElement('hero-title', personal.title);
    updateElement('hero-tagline', personal.tagline);
    
    // Update hero image
    const heroImage = document.getElementById('hero-image');
    if (heroImage && personal.profileImage) {
        heroImage.src = personal.profileImage;
        heroImage.alt = `${personal.name} - Profile Photo`;
    }
    
    // Update resume link
    const resumeLink = document.getElementById('hero-resume-link');
    if (resumeLink && personal.resumeUrl) {
        resumeLink.href = personal.resumeUrl;
    }
    
    // Populate social links
    populateSocialLinks('hero-social-links', social);
}

/**
 * Populate about section
 */
function populateAboutSection() {
    const { summary, education, skills } = portfolioData;
    
    // Update summary
    updateElement('about-summary', summary);
    
    // Update education
    updateElement('education-degree', education.degree);
    updateElement('education-institution', education.institution);
    updateElement('education-year', `Class of ${education.graduationYear}`);
    updateElement('education-gpa', `GPA: ${education.gpa}`);
    
    // Populate skills
    populateSkills('frontend-skills', skills.technical.frontend);
    populateSkills('backend-skills', skills.technical.backend);
    populateSkills('tools-skills', skills.technical.tools);
    populateSkills('concepts-skills', skills.technical.concepts);
}

/**
 * Populate experience section
 */
function populateExperienceSection() {
    const { experience } = portfolioData;
    const experienceList = document.getElementById('experience-list');
    
    if (!experienceList || !experience) return;
    
    experienceList.innerHTML = experience.map((exp, index) => `
        <div class="animate-on-scroll animation-delay-${(index + 1) * 100}">
            <div class="card card-hover p-8">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-neutral-900 mb-1">${exp.position}</h3>
                        <p class="text-primary-600 font-medium mb-2">${exp.company}</p>
                        <p class="text-neutral-600 text-sm mb-4">${exp.location} • ${exp.duration}</p>
                    </div>
                </div>
                
                <p class="text-neutral-700 mb-6 leading-relaxed">${exp.description}</p>
                
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-neutral-900 mb-3">Key Achievements</h4>
                    <ul class="space-y-2">
                        ${exp.achievements.map(achievement => `
                            <li class="flex items-start space-x-3">
                                <div class="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                                <span class="text-neutral-700">${achievement}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-sm font-medium text-neutral-900 mb-2">Technologies Used</h4>
                    <div class="flex flex-wrap gap-2">
                        ${exp.technologies.map(tech => `
                            <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Populate projects section
 */
function populateProjectsSection() {
    const { projects } = portfolioData;
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid || !projects) return;
    
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="animate-on-scroll animation-delay-${(index + 1) * 100}">
            <div class="card card-hover h-full flex flex-col">
                <div class="relative overflow-hidden rounded-t-xl">
                    <img src="${project.image || '/public/images/placeholder-project.jpg'}" 
                         alt="${project.title}" 
                         class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                         loading="lazy">
                    <div class="absolute top-4 right-4">
                        <span class="px-2 py-1 bg-${project.status === 'completed' ? 'accent' : 'primary'}-100 text-${project.status === 'completed' ? 'accent' : 'primary'}-700 rounded-full text-xs font-medium capitalize">
                            ${project.status.replace('-', ' ')}
                        </span>
                    </div>
                </div>
                
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-xl font-semibold text-neutral-900">${project.title}</h3>
                            <span class="text-sm text-neutral-500 ml-2">${project.year}</span>
                        </div>
                        <p class="text-primary-600 font-medium text-sm mb-3">${project.subtitle}</p>
                        <p class="text-neutral-600 mb-4 leading-relaxed">${project.description}</p>
                        
                        <div class="mb-4">
                            <h4 class="text-sm font-medium text-neutral-900 mb-2">Key Features</h4>
                            <ul class="space-y-1">
                                ${project.features.slice(0, 3).map(feature => `
                                    <li class="flex items-start space-x-2">
                                        <div class="flex-shrink-0 w-1.5 h-1.5 bg-accent-500 rounded-full mt-2"></div>
                                        <span class="text-sm text-neutral-600">${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex flex-wrap gap-2">
                                ${project.technologies.map(tech => `
                                    <span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 mt-auto">
                        ${project.liveUrl ? `
                            <a href="${project.liveUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="flex-1 btn btn-primary text-center text-sm py-2"
                               aria-label="View ${project.title} live demo">
                                Live Demo
                            </a>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="flex-1 btn btn-outline text-center text-sm py-2"
                               aria-label="View ${project.title} source code">
                                Source Code
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Populate contact section
 */
function populateContactSection() {
    const { personal, contact, social } = portfolioData;
    
    // Update contact availability
    updateElement('contact-availability', contact.availability);
    
    // Update contact information
    const emailLink = document.getElementById('contact-email');
    if (emailLink) {
        emailLink.href = `mailto:${personal.email}`;
        emailLink.textContent = personal.email;
    }
    
    const phoneLink = document.getElementById('contact-phone');
    if (phoneLink) {
        phoneLink.href = `tel:${personal.phone}`;
        phoneLink.textContent = personal.phone;
    }
    
    updateElement('contact-location', personal.location);
    
    // Populate social links
    populateSocialLinks('contact-social-links', social);
}

/**
 * Populate footer
 */
function populateFooter() {
    const { personal, social } = portfolioData;
    
    updateElement('footer-name', personal.name);
    updateElement('footer-tagline', personal.tagline);
    updateElement('footer-copyright-name', personal.name);
    
    // Update footer contact links
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
        footerEmail.href = `mailto:${personal.email}`;
        footerEmail.textContent = personal.email;
    }
    
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
        footerPhone.href = `tel:${personal.phone}`;
        footerPhone.textContent = personal.phone;
    }
    
    updateElement('footer-location', personal.location);
    
    // Populate footer social links
    populateSocialLinks('footer-social-links', social);
}

/**
 * Populate social links
 */
function populateSocialLinks(containerId, socialData) {
    const container = document.getElementById(containerId);
    if (!container || !socialData) return;
    
    const socialIcons = {
        github: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path></svg>`,
        linkedin: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path></svg>`,
        twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path></svg>`,
        dribbble: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10c5.51 0 10-4.48 10-10S15.51 0 10 0zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM10 1.475c1.87 0 3.595.711 4.896 1.875-.226.248-1.506 1.962-4.513 3.135A26.31 26.31 0 005.186 3.23c1.42-.896 3.105-1.755 4.814-1.755zm-5.351 2.467c.434.03 1.758.138 3.46.404a25.286 25.286 0 015.088 3.254c.065.141.12.293.184.445-2.842.358-5.662-.217-5.943-.271A8.502 8.502 0 014.649 3.942z" clip-rule="evenodd"></path></svg>`,
        behance: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M13.12 5.615h3.708v.906H13.12v-.906zM8.23 8.991c.555-.445.832-1.07.832-1.874 0-.803-.277-1.428-.832-1.874-.554-.445-1.316-.668-2.285-.668H2v8.82h4.015c1.04 0 1.854-.223 2.443-.668.59-.445.884-1.07.884-1.874 0-.803-.295-1.428-.884-1.874-.589-.445-1.403-.668-2.443-.668zm-3.353-2.82h1.478c.416 0 .747.111.993.334.247.223.37.535.37.937s-.123.714-.37.937c-.246.223-.577.334-.993.334H4.877v-2.542zm1.478 5.64H4.877v-2.542h1.478c.416 0 .747.111.993.334.247.223.37.535.37.937s-.123.714-.37.937c-.246.223-.577.334-.993.334z"></path><path d="M15.6 9.684c-.832 0-1.478.334-1.94 1.002-.462.668-.693 1.558-.693 2.67 0 1.113.231 2.003.693 2.67.462.668 1.108 1.002 1.94 1.002.832 0 1.478-.334 1.94-1.002.462-.667.693-1.557.693-2.67 0-1.112-.231-2.002-.693-2.67-.462-.668-1.108-1.002-1.94-1.002zm0 5.64c-.416 0-.747-.223-.993-.668-.246-.445-.37-1.07-.37-1.874s.124-1.428.37-1.874c.246-.445.577-.668.993-.668s.747.223.993.668c.246.446.37 1.07.37 1.874s-.124 1.429-.37 1.874c-.246.445-.577.668-.993.668z"></path></svg>`,
        medium: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795H20L20 5.55l-1.917 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537V7.794l-5.389 13.688h-.728L4.51 7.794v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404H0v-.404l2.521-3.058c.27-.279.39-.67.325-1.052V6.887z" clip-rule="evenodd"></path></svg>`
    };
    
    const socialLinks = Object.entries(socialData)
        .filter(([key, url]) => url && socialIcons[key])
        .map(([key, url]) => `
            <a href="${url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
               aria-label="Visit my ${key.charAt(0).toUpperCase() + key.slice(1)} profile">
                ${socialIcons[key]}
            </a>
        `).join('');
    
    container.innerHTML = socialLinks;
}

/**
 * Populate skills
 */
function populateSkills(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container || !skills) return;
    
    container.innerHTML = skills.map(skill => `
        <span class="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
            ${skill}
        </span>
    `).join('');
}

/**
 * Initialize navigation
 */
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Toggle hamburger/close icons
            const hamburgerIcon = mobileMenuButton.querySelector('svg:first-child');
            const closeIcon = mobileMenuButton.querySelector('svg:last-child');
            
            if (hamburgerIcon && closeIcon) {
                hamburgerIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            }
        });
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                
                // Reset icons
                const hamburgerIcon = mobileMenuButton.querySelector('svg:first-child');
                const closeIcon = mobileMenuButton.querySelector('svg:last-child');
                
                if (hamburgerIcon && closeIcon) {
                    hamburgerIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            }
        });
    });
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('text-primary-600', 'font-semibold');
                    link.classList.add('text-neutral-700');
                });
                
                // Add active class to current nav link
                const activeLinks = document.querySelectorAll(`a[href="#${activeId}"]`);
                activeLinks.forEach(link => {
                    link.classList.remove('text-neutral-700');
                    link.classList.add('text-primary-600', 'font-semibold');
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('translate-y-16', 'opacity-0');
            backToTopButton.classList.add('translate-y-0', 'opacity-100');
        } else {
            backToTopButton.classList.add('translate-y-16', 'opacity-0');
            backToTopButton.classList.remove('translate-y-0', 'opacity-100');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Utility functions
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
        element.textContent = content;
    }
}

function updateMetaTag(name, content) {
    const meta = document.querySelector(`meta[name="${name}"]`);
    if (meta && content) {
        meta.setAttribute('content', content);
    }
}

function updateMetaProperty(property, content) {
    const meta = document.querySelector(`meta[property="${property}"]`);
    if (meta && content) {
        meta.setAttribute('content', content);
    }
}

function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
    errorDiv.innerHTML = `
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">${message}</span>
        <button class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
            <span class="sr-only">Dismiss</span>
            ×
        </button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}
