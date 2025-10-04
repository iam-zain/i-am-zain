/**
 * Main JavaScript file for the portfolio website
 * Handles data loading, navigation, and core functionality
 */

// Global variables
let portfolioData = null;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
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

    console.log("Portfolio app initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
    showErrorMessage("Failed to load portfolio data. Please refresh the page.");
  }
}

/**
 * Load portfolio data from JSON file
 */
async function loadPortfolioData() {
  try {
    const response = await fetch("../config/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    portfolioData = await response.json();
    return portfolioData;
  } catch (error) {
    console.error("Error loading portfolio data:", error);
    throw error;
  }
}

/**
 * Populate all content on the page
 */
function populateContent() {
  if (!portfolioData) {
    console.error("No portfolio data available");
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

  // Populate conferences section
  populateConferencesSection();

  // Populate articles section
  populateArticlesSection();

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
  updateMetaTag("description", seo.metaDescription);
  updateMetaTag("keywords", seo.keywords.join(", "));
  updateMetaTag("author", personal.name);

  // Update Open Graph tags
  updateMetaProperty("og:title", seo.metaTitle);
  updateMetaProperty("og:description", seo.metaDescription);
  updateMetaProperty("og:image", seo.ogImage);
  updateMetaProperty("og:url", personal.website);

  // Update Twitter Card tags
  updateMetaTag("twitter:title", seo.metaTitle);
  updateMetaTag("twitter:description", seo.metaDescription);
  updateMetaTag("twitter:image", seo.ogImage);
}

/**
 * Populate hero section
 */
function populateHeroSection() {
  const { personal, social } = portfolioData;

  // Update navigation name
  updateElement("nav-name", personal.name.split(" ")[1]);

  // Update hero content
  updateElement("hero-name", personal.name);
  updateElement("hero-title", personal.title);
  updateElement("hero-tagline", personal.tagline);

  // Initialize profile image carousel
  initializeProfileCarousel(personal.profileImages || []);

  // Update resume link
  const resumeLink = document.getElementById("hero-resume-link");
  if (resumeLink && personal.resumeUrl) {
    resumeLink.href = personal.resumeUrl;
  }

  // Populate social links
  populateSocialLinks("hero-social-links", social);
}

/**
 * Initialize profile image carousel
 * @param {Array} images - Array of image objects with src and alt properties
 */
function initializeProfileCarousel(images) {
  // Debug log to see what images are being passed
  console.log("Profile Images:", images);

  // Fallback for backward compatibility
  if (!images || !Array.isArray(images) || images.length === 0) {
    // Check if there's a legacy profileImage property
    if (portfolioData.personal.profileImage) {
      images = [
        {
          src: portfolioData.personal.profileImage,
          alt: `${portfolioData.personal.name} - Profile Photo`,
        },
      ];
    } else {
      console.error("No profile images found in configuration");
      return;
    }
  }

  // Debug log after potential fallback
  console.log("Final Images Array:", images);

  // Get carousel elements
  const carouselItems = document.getElementById("carousel-items");
  const backdropItems = document.getElementById("stacked-backdrop");
  const carouselDots = document.getElementById("carousel-dots");
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");

  if (!carouselItems || !carouselDots || !backdropItems) {
    console.error("Carousel elements not found");
    return;
  }

  console.log("Carousel container before clearing:", carouselItems.innerHTML);

  // Clear existing content
  carouselItems.innerHTML = "";
  backdropItems.innerHTML = "";
  carouselDots.innerHTML = "";

  console.log("Carousel container after clearing:", carouselItems.innerHTML);

  // Variables for carousel state
  let currentIndex = 0;
  let autoRotateInterval = null;

  // Create carousel items
  images.forEach((image, index) => {
    // Create image element
    const imgElement = document.createElement("img");
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    imgElement.className =
      "w-full h-auto rounded-xl object-contain aspect-square absolute inset-0 transition-opacity duration-500";
    imgElement.style.opacity = index === 0 ? "1" : "0";
    imgElement.style.zIndex = index === 0 ? "10" : "0";
    imgElement.style.position = "absolute";
    imgElement.style.top = "0";
    imgElement.style.left = "0";
    imgElement.style.width = "100%";
    imgElement.style.height = "100%";
    imgElement.onload = () => console.log(`Image ${index} loaded:`, image.src);
    imgElement.onerror = () =>
      console.error(`Failed to load image ${index}:`, image.src);
    const backdropElement = imgElement.cloneNode(true);
    backdropElement.style.opacity = index === 1 ? "1" : "0";
    backdropElement.style.zIndex = index === 1 ? "9" : "0";
    carouselItems.appendChild(imgElement);
    backdropItems.appendChild(backdropElement);
    console.log(`Added image ${index}:`, image.src);

    // Create dot element
    const dotElement = document.createElement("button");
    dotElement.className = `w-3 h-3 rounded-full transition-colors duration-300 ${
      index === 0 ? "bg-primary-500" : "bg-white/70"
    }`;
    dotElement.setAttribute("aria-label", `View image ${index + 1}`);
    dotElement.setAttribute("data-index", index);
    dotElement.onclick = () => goToSlide(index);
    carouselDots.appendChild(dotElement);
  });

  // Only show navigation if there are multiple images
  if (images.length <= 1) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    carouselDots.style.display = "none";
    return;
  }

  // Add event listeners to navigation buttons
  if (prevButton) {
    prevButton.onclick = () => {
      goToSlide(currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1);
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      goToSlide(currentIndex + 1 >= images.length ? 0 : currentIndex + 1);
    };
  }

  // Function to go to a specific slide
  function goToSlide(index) {
    console.log("Going to slide:", index);
    const backdropIndex = index + 1 >= images.length ? 0 : index + 1;

    // Reset auto-rotation timer
    resetAutoRotate();

    // Hide all images
    const allImages = carouselItems.querySelectorAll("img");
    const allBackdrops = backdropItems.querySelectorAll("img");
    console.log("Total images found:", allImages.length);

    allImages.forEach((img, i) => {
      console.log(`Setting image ${i} to opacity 0`);
      img.style.opacity = "0";
      img.style.zIndex = "0";
    });

    allBackdrops.forEach((img, i) => {
      console.log(`Setting backdrop ${i} to opacity 0`);
      img.style.opacity = "0";
      img.style.zIndex = "0";
    });

    // Show selected image
    if (allImages[index]) {
      console.log(`Setting image ${index} to opacity 1`);
      allImages[index].style.opacity = "1";
      allImages[index].style.zIndex = "10";
      allBackdrops[backdropIndex].style.opacity = "1";
      allBackdrops[backdropIndex].style.zIndex = "9";
    } else {
      console.error(`Image at index ${index} not found`);
    }

    // Update dots
    const allDots = carouselDots.querySelectorAll("button");
    allDots.forEach((dot, i) => {
      dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${
        i === index ? "bg-primary-500" : "bg-white/70"
      }`;
    });

    // Update current index
    currentIndex = index;
    console.log("Current index updated to:", currentIndex);
  }

  // Function to start auto-rotation
  function startAutoRotate() {
    // Only set interval if it doesn't already exist
    if (!autoRotateInterval) {
      console.log("Starting auto-rotation with interval of 10 seconds");
      autoRotateInterval = setInterval(() => {
        console.log("Auto-rotating to next slide");
        const nextIndex =
          currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
        goToSlide(nextIndex);
      }, 4000); // 4 seconds for testing (will change back to 10 seconds later)
    }
  }

  // Function to reset auto-rotation
  function resetAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
    startAutoRotate();
  }

  // Start auto-rotation
  startAutoRotate();

  // Pause rotation when user hovers over the carousel
  const carousel = document.getElementById("profile-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    });

    carousel.addEventListener("mouseleave", () => {
      startAutoRotate();
    });
  }
}

/**
 * Populate about section
 */
function populateAboutSection() {
  const { summary, education, skills } = portfolioData;

  // Update summary
  updateElement("about-summary", summary);

  // Populate education cards
  populateEducationCards(education);

  // Populate skills
  populateSkills("frontend-skills", skills.technical.programming);
  populateSkills("backend-skills", skills.technical.backend);
  populateSkills("tools-skills", skills.technical.tools);
  populateSkills("concepts-skills", skills.technical.concepts);
}

/**
 * Populate education cards
 * @param {Array} educationData - Array of education objects
 */
function populateEducationCards(educationData) {
  const educationCardsContainer = document.getElementById("education-cards");

  if (!educationCardsContainer || !educationData) {
    console.error("Education cards container or education data not found");
    return;
  }

  // Handle both array and single object formats for backward compatibility
  const educationArray = Array.isArray(educationData)
    ? educationData
    : [educationData];

  // Generate education cards HTML
  educationCardsContainer.innerHTML = educationArray
    .map(
      (edu, index) => `
      <div class="bg-white rounded-lg p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-neutral-900 mb-2">
              ${edu.degree}
            </h4>
            <p class="text-primary-600 font-medium mb-2">
              ${edu.institution}
            </p>
            <p class="text-neutral-700 text-sm mb-1">
              ${edu.graduationYear}
            </p>
            <p class="text-neutral-700 text-sm font-medium">
              CGPA: ${edu.gpa}
            </p>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

/**
 * Populate experience section
 */
function populateExperienceSection() {
  const { experience } = portfolioData;
  const experienceList = document.getElementById("experience-list");

  if (!experienceList || !experience) {
    console.error("Experience list or experience data not found");
    return;
  }

  // Remove loading indicator if it exists
  const loadingIndicator = document.getElementById(
    "experience-loading-indicator"
  );
  if (loadingIndicator) {
    loadingIndicator.remove();
  }

  // Generate experience HTML without animation classes that could cause visibility issues
  experienceList.innerHTML = experience
    .map(
      (exp, index) => `
        <div id="experience-item-${index}" class="experience-item">
            <div class="card card-hover p-8">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-neutral-900 mb-1">${
                          exp.position
                        }</h3>
                        <p class="text-primary-600 font-medium mb-2">${
                          exp.company
                        }</p>
                        <p class="text-neutral-600 text-sm mb-4">${
                          exp.location
                        } • ${exp.duration}</p>
                    </div>
                </div>
                
                <p class="text-neutral-700 mb-6 leading-relaxed">${
                  exp.description
                }</p>
                
                <div class="mb-6">
                    <h4 class="text-lg font-medium text-neutral-900 mb-3">Key Achievements</h4>
                    <ul class="space-y-2">
                        ${exp.achievements
                          .map(
                            (achievement) => `
                            <li class="flex items-start space-x-3">
                                <div class="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                                <span class="text-neutral-400">${achievement}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-sm font-medium text-neutral-900 mb-2">Technologies Used</h4>
                    <div class="flex flex-wrap gap-2">
                        ${exp.technologies
                          .map(
                            (tech) => `
                            <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">${tech}</span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Apply animations after content is loaded, but don't rely on them for visibility
  try {
    setTimeout(() => {
      const experienceItems = document.querySelectorAll(".experience-item");
      experienceItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 200}ms`;
        item.classList.add("animate-fade-in");
      });
    }, 100);
  } catch (error) {
    console.error("Error applying animations to experience items:", error);
    // Experience items will still be visible even if animations fail
  }
}

/**
 * Populate conferences section
 */
function populateConferencesSection() {
  const { conferences, workshops } = portfolioData;

  // Initialize conferences carousel
  if (conferences && conferences.length > 0) {
    initializeConferenceCarousel(conferences);
  }

  // Initialize workshops carousel
  if (workshops && workshops.length > 0) {
    initializeWorkshopCarousel(workshops);
  }
}

/**
 * Initialize conference carousel
 * @param {Array} conferences - Array of conference objects
 */
function initializeConferenceCarousel(conferences) {
  // Get carousel elements
  const carouselItems = document.getElementById("conference-items");
  const indicators = document.getElementById("conference-indicators");
  const prevButton = document.getElementById("conference-prev");
  const nextButton = document.getElementById("conference-next");

  if (!carouselItems || !indicators) {
    console.error("Conference carousel elements not found");
    return;
  }

  // Clear existing content
  carouselItems.innerHTML = "";
  indicators.innerHTML = "";

  // Variables for carousel state
  let currentIndex = 0;

  // Create carousel items
  conferences.forEach((conference, index) => {
    // Create conference item
    const itemElement = document.createElement("div");
    itemElement.className = "conference-item";
    itemElement.style.display = index === 0 ? "block" : "none";

    itemElement.innerHTML = `
      <div class="relative mb-4">
        <div class="overflow-hidden rounded-lg relative">
          <img 
            src="${
              conference.image || "/public/images/placeholder-project.jpg"
            }" 
            alt="${conference.title}" 
            class="w-full h-48 object-contain"
          >
          <div class="absolute top-4 right-4">
          <span class="px-2 py-1 bg-${
            conference.presentationType === "oral" ? "accent" : "primary"
          }-100 text-${
      conference.presentationType === "oral" ? "accent" : "primary"
    }-700 rounded-full text-xs font-medium capitalize">
            ${
              conference.presentationType === "oral"
                ? "Oral Presentation"
                : "Poster Presentation"
            }
          </span>
        </div>
      </div>
      <h4 class="font-medium text-neutral-900 mb-1">
        ${conference.title}
      </h4>
      <p class="text-neutral-600 text-sm mb-3">
        ${conference.description}
      </p>
      <div class="flex justify-between items-center mb-2">
        <span class="text-primary-600 text-sm">${conference.location}</span>
        <span class="text-neutral-500 text-sm">${conference.date}</span>
      </div>
    `;

    carouselItems.appendChild(itemElement);

    // Create indicator
    const indicatorElement = document.createElement("button");
    indicatorElement.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
      index === 0 ? "bg-primary-500" : "bg-neutral-300"
    }`;
    indicatorElement.setAttribute(
      "aria-label",
      `Go to conference ${index + 1}`
    );
    indicatorElement.onclick = () => goToSlide(index);
    indicators.appendChild(indicatorElement);
  });

  // Add event listeners to navigation buttons
  if (prevButton) {
    prevButton.onclick = () => {
      goToSlide(
        currentIndex - 1 < 0 ? conferences.length - 1 : currentIndex - 1
      );
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      goToSlide(currentIndex + 1 >= conferences.length ? 0 : currentIndex + 1);
    };
  }

  // Function to go to a specific slide
  function goToSlide(index) {
    // Hide all items
    const allItems = carouselItems.querySelectorAll(".conference-item");
    allItems.forEach((item) => {
      item.style.display = "none";
    });

    // Show selected item
    if (allItems[index]) {
      allItems[index].style.display = "block";
    }

    // Update indicators
    const allIndicators = indicators.querySelectorAll("button");
    allIndicators.forEach((dot, i) => {
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
        i === index ? "bg-primary-500" : "bg-neutral-300"
      }`;
    });

    // Update current index
    currentIndex = index;
  }
}

/**
 * Initialize workshop carousel
 * @param {Array} workshops - Array of workshop objects
 */
function initializeWorkshopCarousel(workshops) {
  // Get carousel elements
  const carouselItems = document.getElementById("workshop-items");
  const indicators = document.getElementById("workshop-indicators");
  const prevButton = document.getElementById("workshop-prev");
  const nextButton = document.getElementById("workshop-next");

  if (!carouselItems || !indicators) {
    console.error("Workshop carousel elements not found");
    return;
  }

  // Clear existing content
  carouselItems.innerHTML = "";
  indicators.innerHTML = "";

  // Variables for carousel state
  let currentIndex = 0;

  // Create carousel items
  workshops.forEach((workshop, index) => {
    // Create workshop item
    const itemElement = document.createElement("div");
    itemElement.className = "workshop-item";
    itemElement.style.display = index === 0 ? "block" : "none";

    itemElement.innerHTML = `
      <div class="relative mb-4">
        <div class="overflow-hidden rounded-lg relative">
          <img 
            src="${workshop.image || "/public/images/placeholder-project.jpg"}" 
            alt="${workshop.title}" 
            class="w-full h-48 object-contain"
          >
          <div class="absolute top-4 right-4">
          <span class="px-2 py-1 bg-${
            workshop.mode === "online" ? "accent" : "primary"
          }-100 text-${
      workshop.mode === "online" ? "accent" : "primary"
    }-700 rounded-full text-xs font-medium capitalize">
            ${workshop.mode}
          </span>
        </div>
      </div>
      <h4 class="font-medium text-neutral-900 mb-1">
        ${workshop.title}
      </h4>
      <p class="text-neutral-600 text-sm mb-3">
        ${workshop.description}
      </p>
      <div class="flex justify-between items-center mb-2">
        <span class="text-primary-600 text-sm">${workshop.location}</span>
        <span class="text-neutral-500 text-sm">${workshop.date}</span>
      </div>
    `;

    carouselItems.appendChild(itemElement);

    // Create indicator
    const indicatorElement = document.createElement("button");
    indicatorElement.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
      index === 0 ? "bg-primary-500" : "bg-neutral-300"
    }`;
    indicatorElement.setAttribute("aria-label", `Go to workshop ${index + 1}`);
    indicatorElement.onclick = () => goToSlide(index);
    indicators.appendChild(indicatorElement);
  });

  // Add event listeners to navigation buttons
  if (prevButton) {
    prevButton.onclick = () => {
      goToSlide(currentIndex - 1 < 0 ? workshops.length - 1 : currentIndex - 1);
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      goToSlide(currentIndex + 1 >= workshops.length ? 0 : currentIndex + 1);
    };
  }

  // Function to go to a specific slide
  function goToSlide(index) {
    // Hide all items
    const allItems = carouselItems.querySelectorAll(".workshop-item");
    allItems.forEach((item) => {
      item.style.display = "none";
    });

    // Show selected item
    if (allItems[index]) {
      allItems[index].style.display = "block";
    }

    // Update indicators
    const allIndicators = indicators.querySelectorAll("button");
    allIndicators.forEach((dot, i) => {
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
        i === index ? "bg-primary-500" : "bg-neutral-300"
      }`;
    });

    // Update current index
    currentIndex = index;
  }
}

/**
 * Populate articles section
 */
function populateArticlesSection() {
  const { articles } = portfolioData;

  // If articles data is available, populate the sections
  if (articles) {
    // Initialize research articles carousel
    if (articles.research && articles.research.length > 0) {
      initializeArticleCarousel("research", articles.research);
    }

    // Initialize review articles carousel
    if (articles.reviews && articles.reviews.length > 0) {
      initializeArticleCarousel("review", articles.reviews);
    }

    // Initialize book chapters carousel
    if (articles.bookChapters && articles.bookChapters.length > 0) {
      initializeArticleCarousel("chapter", articles.bookChapters);
    }

    // Initialize conference abstracts carousel
    if (articles.abstracts && articles.abstracts.length > 0) {
      initializeArticleCarousel("abstract", articles.abstracts);
    }
  }
}

/**
 * Initialize article carousel
 * @param {string} type - Type of article (research, review, chapter, abstract)
 * @param {Array} articles - Array of article objects
 */
function initializeArticleCarousel(type, articles) {
  // Get carousel elements
  const carouselItems = document.getElementById(`${type}-items`);
  const indicators = document.getElementById(`${type}-indicators`);
  const prevButton = document.getElementById(`${type}-prev`);
  const nextButton = document.getElementById(`${type}-next`);

  if (!carouselItems || !indicators) {
    console.error(`${type} carousel elements not found`);
    return;
  }

  // Clear existing content
  carouselItems.innerHTML = "";
  indicators.innerHTML = "";

  // Variables for carousel state
  let currentIndex = 0;

  // Create carousel items
  articles.forEach((article, index) => {
    // Create article item
    const itemElement = document.createElement("div");
    itemElement.className = `${type}-item`;
    itemElement.style.display = index === 0 ? "block" : "none";

    // Determine badge color based on type
    const badgeColor =
      type === "research" || type === "chapter" ? "accent" : "primary";

    // Determine badge text based on type
    let badgeText;
    switch (type) {
      case "research":
        badgeText = "Research";
        break;
      case "review":
        badgeText = "Review";
        break;
      case "chapter":
        badgeText = "Chapter";
        break;
      case "abstract":
        badgeText = "Abstract";
        break;
      default:
        badgeText = "Article";
    }

    itemElement.innerHTML = `
      <div class="relative mb-4">
        <div class="overflow-hidden rounded-lg relative">
          <img 
            src="${article.image || "/public/images/placeholder-project.jpg"}" 
            alt="${article.title}" 
            class="w-full h-48 object-contain"
          />
          <div class="absolute top-4 right-4">
            <span class="px-2 py-1 bg-${badgeColor}-100 text-${badgeColor}-700 rounded-full text-xs font-medium capitalize">
              ${badgeText}
            </span>
          </div>
        </div>
      </div>
      <h4 class="font-medium text-neutral-900 mb-1">
        ${article.title}
      </h4>
      <p class="text-neutral-600 text-sm mb-3">
        ${article.summary}
      </p>
      <div class="flex justify-between items-center mb-2">
        <span class="text-primary-600 text-sm">${article.year}</span>
        <a href="${
          article.url
        }" target="_blank" rel="noopener noreferrer" class="text-sm text-primary-600 hover:text-primary-800 transition-colors">
          View ${article.type || "Article"}
        </a>
      </div>
    `;

    carouselItems.appendChild(itemElement);

    // Create indicator
    const indicatorElement = document.createElement("button");
    indicatorElement.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
      index === 0 ? "bg-primary-500" : "bg-neutral-300"
    }`;
    indicatorElement.setAttribute("aria-label", `Go to ${type} ${index + 1}`);
    indicatorElement.onclick = () => goToSlide(index);
    indicators.appendChild(indicatorElement);
  });

  // Add event listeners to navigation buttons
  if (prevButton) {
    prevButton.onclick = () => {
      goToSlide(currentIndex - 1 < 0 ? articles.length - 1 : currentIndex - 1);
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      goToSlide(currentIndex + 1 >= articles.length ? 0 : currentIndex + 1);
    };
  }

  // Function to go to a specific slide
  function goToSlide(index) {
    // Hide all items
    const allItems = carouselItems.querySelectorAll(`.${type}-item`);
    allItems.forEach((item) => {
      item.style.display = "none";
    });

    // Show selected item
    if (allItems[index]) {
      allItems[index].style.display = "block";
    }

    // Update indicators
    const allIndicators = indicators.querySelectorAll("button");
    allIndicators.forEach((dot, i) => {
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
        i === index ? "bg-primary-500" : "bg-neutral-300"
      }`;
    });

    // Update current index
    currentIndex = index;
  }
}

/**
 * Populate projects section
 */
function populateProjectsSection() {
  const { projects } = portfolioData;
  const projectsGrid = document.getElementById("projects-grid");

  if (!projectsGrid || !projects) {
    console.error("Projects grid or projects data not found");
    return;
  }

  // Remove loading indicator if it exists
  const loadingIndicator = document.getElementById(
    "projects-loading-indicator"
  );
  if (loadingIndicator) {
    loadingIndicator.remove();
  }

  // Generate project HTML without animation classes that could cause visibility issues
  projectsGrid.innerHTML = projects
    .map(
      (project, index) => `
        <div id="project-${index}" class="project-card">
            <div class="card card-hover h-full flex flex-col">
                <div class="relative overflow-hidden rounded-t-xl">
                    <img src="${
                      project.image || "/public/images/placeholder-project.jpg"
                    }" 
                         alt="${project.title}" 
                         class="w-full h-48 object-contain transition-transform duration-300 hover:scale-105"
                         loading="lazy">
                    <div class="absolute top-4 right-4">
                        <span class="px-2 py-1 bg-${
                          project.status === "completed" ? "accent" : "primary"
                        }-100 text-${
        project.status === "completed" ? "accent" : "primary"
      }-700 rounded-full text-xs font-medium capitalize">
                            ${project.status.replace("-", " ")}
                        </span>
                    </div>
                </div>
                
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-xl font-semibold text-neutral-900">${
                              project.title
                            }</h3>
                            <span class="text-sm text-neutral-500 ml-2">${
                              project.year
                            }</span>
                        </div>
                        <p class="text-primary-600 font-medium text-sm mb-3">${
                          project.subtitle
                        }</p>
                        <p class="text-neutral-600 mb-4 leading-relaxed">${
                          project.description
                        }</p>
                        
                        <div class="mb-4">
                            <h4 class="text-sm font-medium text-neutral-900 mb-2">Key Features</h4>
                            <ul class="space-y-1">
                                ${project.features
                                  .slice(0, 3)
                                  .map(
                                    (feature) => `
                                    <li class="flex items-start space-x-2">
                                        <div class="flex-shrink-0 w-1.5 h-1.5 bg-accent-500 rounded-full mt-2"></div>
                                        <span class="text-sm text-neutral-400">${feature}</span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex flex-wrap gap-2">
                                ${project.technologies
                                  .map(
                                    (tech) => `
                                    <span class="px-2 py-1 bg-gray-50 text-gray-800 border border-gray-200 rounded text-xs font-medium">${tech}</span>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 mt-auto">
                        ${
                          project.liveUrl
                            ? `
                            <a href="${project.liveUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="flex-1 btn btn-primary text-center text-sm py-2"
                               aria-label="View ${project.title} live demo">
                                Live Demo
                            </a>
                        `
                            : ""
                        }
                        ${
                          project.githubUrl
                            ? `
                            <a href="${project.githubUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="flex-1 btn btn-outline text-center text-sm py-2"
                               aria-label="View ${project.title} source code">
                                Source Code
                            </a>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Apply animations after content is loaded, but don't rely on them for visibility
  try {
    setTimeout(() => {
      const projectCards = document.querySelectorAll(".project-card");
      projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 150}ms`;
        card.classList.add("animate-fade-in");
      });
    }, 100);
  } catch (error) {
    console.error("Error applying animations to projects:", error);
    // Projects will still be visible even if animations fail
  }
}

/**
 * Populate contact section
 */
function populateContactSection() {
  const { personal, contact, social } = portfolioData;

  // Update contact availability
  updateElement("contact-availability", contact.availability);

  // Update contact information
  const emailLink = document.getElementById("contact-email");
  if (emailLink) {
    emailLink.href = `mailto:${personal.email}`;
    emailLink.textContent = personal.email;
  }

  const phoneLink = document.getElementById("contact-phone");
  if (phoneLink) {
    phoneLink.href = `tel:${personal.phone}`;
    phoneLink.textContent = personal.phone;
  }

  updateElement("contact-location", personal.location);

  // Populate social links
  populateSocialLinks("contact-social-links", social);
}

/**
 * Populate footer
 */
function populateFooter() {
  const { personal, social } = portfolioData;

  updateElement("footer-name", personal.name);
  updateElement("footer-tagline", personal.tagline);
  updateElement("footer-copyright-name", personal.name);

  // Update footer contact links
  const footerEmail = document.getElementById("footer-email");
  if (footerEmail) {
    footerEmail.href = `mailto:${personal.email}`;
    footerEmail.textContent = personal.email;
  }

  const footerPhone = document.getElementById("footer-phone");
  if (footerPhone) {
    footerPhone.href = `tel:${personal.phone}`;
    footerPhone.textContent = personal.phone;
  }

  updateElement("footer-location", personal.location);

  // Populate footer social links
  populateSocialLinks("footer-social-links", social);
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
    orcid: `<svg class="w-5 h-5" fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> <path d="M16 0c-8.839 0-16 7.161-16 16s7.161 16 16 16c8.839 0 16-7.161 16-16s-7.161-16-16-16zM9.823 5.839c0.704 0 1.265 0.573 1.265 1.26 0 0.688-0.561 1.265-1.265 1.265-0.692-0.004-1.26-0.567-1.26-1.265 0-0.697 0.563-1.26 1.26-1.26zM8.864 9.885h1.923v13.391h-1.923zM13.615 9.885h5.197c4.948 0 7.125 3.541 7.125 6.703 0 3.439-2.687 6.699-7.099 6.699h-5.224zM15.536 11.625v9.927h3.063c4.365 0 5.365-3.312 5.365-4.964 0-2.687-1.713-4.963-5.464-4.963z"/> </svg>`,
    dribbble: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10c5.51 0 10-4.48 10-10S15.51 0 10 0zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM10 1.475c1.87 0 3.595.711 4.896 1.875-.226.248-1.506 1.962-4.513 3.135A26.31 26.31 0 005.186 3.23c1.42-.896 3.105-1.755 4.814-1.755zm-5.351 2.467c.434.03 1.758.138 3.46.404a25.286 25.286 0 015.088 3.254c.065.141.12.293.184.445-2.842.358-5.662-.217-5.943-.271A8.502 8.502 0 014.649 3.942z" clip-rule="evenodd"></path></svg>`,
    behance: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M13.12 5.615h3.708v.906H13.12v-.906zM8.23 8.991c.555-.445.832-1.07.832-1.874 0-.803-.277-1.428-.832-1.874-.554-.445-1.316-.668-2.285-.668H2v8.82h4.015c1.04 0 1.854-.223 2.443-.668.59-.445.884-1.07.884-1.874 0-.803-.295-1.428-.884-1.874-.589-.445-1.403-.668-2.443-.668zm-3.353-2.82h1.478c.416 0 .747.111.993.334.247.223.37.535.37.937s-.123.714-.37.937c-.246.223-.577.334-.993.334H4.877v-2.542zm1.478 5.64H4.877v-2.542h1.478c.416 0 .747.111.993.334.247.223.37.535.37.937s-.123.714-.37.937c-.246.223-.577.334-.993.334z"></path><path d="M15.6 9.684c-.832 0-1.478.334-1.94 1.002-.462.668-.693 1.558-.693 2.67 0 1.113.231 2.003.693 2.67.462.668 1.108 1.002 1.94 1.002.832 0 1.478-.334 1.94-1.002.462-.667.693-1.557.693-2.67 0-1.112-.231-2.002-.693-2.67-.462-.668-1.108-1.002-1.94-1.002zm0 5.64c-.416 0-.747-.223-.993-.668-.246-.445-.37-1.07-.37-1.874s.124-1.428.37-1.874c.246-.445.577-.668.993-.668s.747.223.993.668c.246.446.37 1.07.37 1.874s-.124 1.429-.37 1.874c-.246.445-.577.668-.993.668z"></path></svg>`,
    medium: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795H20L20 5.55l-1.917 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537V7.794l-5.389 13.688h-.728L4.51 7.794v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404H0v-.404l2.521-3.058c.27-.279.39-.67.325-1.052V6.887z" clip-rule="evenodd"></path></svg>`,
  };

  const socialLinks = Object.entries(socialData)
    .filter(([key, url]) => url && socialIcons[key])
    .map(
      ([key, url]) => `
            <a href="${url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
               aria-label="Visit my ${
                 key.charAt(0).toUpperCase() + key.slice(1)
               } profile">
                ${socialIcons[key]}
            </a>
        `
    )
    .join("");

  container.innerHTML = socialLinks;
}

/**
 * Populate skills
 */
function populateSkills(containerId, skills) {
  const container = document.getElementById(containerId);
  if (!container || !skills) return;

  container.innerHTML = skills
    .map(
      (skill) => `
        <span class="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
            ${skill}
        </span>
    `
    )
    .join("");
}

/**
 * Initialize navigation
 */
function initializeNavigation() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  // Mobile menu toggle
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");

      // Toggle hamburger/close icons
      const hamburgerIcon = mobileMenuButton.querySelector("svg:first-child");
      const closeIcon = mobileMenuButton.querySelector("svg:last-child");

      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
      }
    });
  }

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");

        // Reset icons
        const hamburgerIcon = mobileMenuButton.querySelector("svg:first-child");
        const closeIcon = mobileMenuButton.querySelector("svg:last-child");

        if (hamburgerIcon && closeIcon) {
          hamburgerIcon.classList.remove("hidden");
          closeIcon.classList.add("hidden");
        }
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;

        // Remove active class from all nav links
        navLinks.forEach((link) => {
          link.classList.remove("text-primary-600", "font-semibold");
          link.classList.add("text-neutral-700");
        });

        // Add active class to current nav link
        const activeLinks = document.querySelectorAll(`a[href="#${activeId}"]`);
        activeLinks.forEach((link) => {
          link.classList.remove("text-neutral-700");
          link.classList.add("text-primary-600", "font-semibold");
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  if (!backToTopButton) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.remove("translate-y-16", "opacity-0");
      backToTopButton.classList.add("translate-y-0", "opacity-100");
    } else {
      backToTopButton.classList.add("translate-y-16", "opacity-0");
      backToTopButton.classList.remove("translate-y-0", "opacity-100");
    }
  });

  // Scroll to top when clicked
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
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
    meta.setAttribute("content", content);
  }
}

function updateMetaProperty(property, content) {
  const meta = document.querySelector(`meta[property="${property}"]`);
  if (meta && content) {
    meta.setAttribute("content", content);
  }
}

function showErrorMessage(message) {
  // Create error message element
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50";
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
