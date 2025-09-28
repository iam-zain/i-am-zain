/**
 * Animations JavaScript file
 * Handles scroll-based animations and visual effects
 */

// Animation observer for scroll-triggered animations
let animationObserver = null;

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeScrollAnimations();
  initializeHoverEffects();
  initializeParallaxEffects();
});

/**
 * Initialize scroll-based animations
 */
function initializeScrollAnimations() {
  try {
    // Options for the Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      console.warn(
        "IntersectionObserver not supported in this browser. Falling back to simple animations."
      );
      fallbackAnimations();
      return;
    }

    // Create the observer
    animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class when element comes into view
          entry.target.classList.add("is-visible");

          // Stop observing this element after animation to improve performance
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((element) => {
      // Ensure elements are visible if animations fail
      element.style.willChange = "opacity, transform";

      // Safety timeout to ensure elements become visible even if observer fails
      const safetyTimeout = setTimeout(() => {
        if (!element.classList.contains("is-visible")) {
          element.classList.add("is-visible");
        }
      }, 2000);

      // Store the timeout ID on the element for potential cleanup
      element.dataset.safetyTimeout = safetyTimeout;

      // Observe the element
      animationObserver.observe(element);
    });

    // Add staggered animation delays for grouped elements
    addStaggeredAnimations();
  } catch (error) {
    console.error("Error initializing animations:", error);
    fallbackAnimations();
  }
}

/**
 * Fallback animations for browsers that don't support IntersectionObserver
 */
function fallbackAnimations() {
  // Make all animated elements visible
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((element) => {
    element.classList.add("is-visible");
  });

  // Apply simple fade-in animation to project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 100}ms`;
    card.classList.add("animate-fade-in");
  });
}

/**
 * Add staggered animation delays for grouped elements
 */
function addStaggeredAnimations() {
  // Skills sections
  const skillGroups = [
    "#frontend-skills",
    "#backend-skills",
    "#tools-skills",
    "#concepts-skills",
  ];

  skillGroups.forEach((selector) => {
    const container = document.querySelector(selector);
    if (container) {
      const skills = container.children;
      Array.from(skills).forEach((skill, index) => {
        skill.style.animationDelay = `${index * 50}ms`;
        skill.classList.add("animate-fade-in");
      });
    }
  });

  // Project cards
  const projectCards = document.querySelectorAll("#projects-grid > div");
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 150}ms`;
  });

  // Experience cards
  const experienceCards = document.querySelectorAll("#experience-list > div");
  experienceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 200}ms`;
  });
}

/**
 * Initialize hover effects
 */
function initializeHoverEffects() {
  // Card hover effects
  const cards = document.querySelectorAll(".card-hover");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
      this.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow =
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
    });
  });

  // Button hover effects
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Social link hover effects
  const socialLinks = document.querySelectorAll('[id$="-social-links"] a');

  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
    });
  });
}

/**
 * Initialize parallax effects
 */
function initializeParallaxEffects() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollTop = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Only enable parallax on larger screens to avoid performance issues
  if (window.innerWidth > 768) {
    window.addEventListener("scroll", requestTick);
  }
}

/**
 * Animate number counters
 */
function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");

  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.counter);
    const duration = parseInt(counter.dataset.duration) || 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easeOut);

      counter.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

/**
 * Animate progress bars
 */
function animateProgressBars() {
  const progressBars = document.querySelectorAll("[data-progress]");

  progressBars.forEach((bar) => {
    const targetWidth = parseInt(bar.dataset.progress);
    const duration = parseInt(bar.dataset.duration) || 1500;
    const startTime = performance.now();

    function updateProgress(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentWidth = targetWidth * easeOut;

      bar.style.width = `${currentWidth}%`;

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    }

    requestAnimationFrame(updateProgress);
  });
}

/**
 * Typewriter effect for text
 */
function typewriterEffect(element, text, speed = 100) {
  if (!element) return;

  element.textContent = "";
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  }

  typeChar();
}

/**
 * Animate elements on scroll with custom animations
 */
function animateOnScroll(elements, animationClass, delay = 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animationClass);
          }, index * delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));
}

/**
 * Smooth reveal animation for sections
 */
function revealSections() {
  const sections = document.querySelectorAll("section");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    revealObserver.observe(section);
  });
}

/**
 * Add floating animation to specific elements
 */
function addFloatingAnimation() {
  const floatingElements = document.querySelectorAll(".floating");

  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
    element.classList.add("animate-bounce-gentle");
  });
}

/**
 * Initialize loading animations
 */
function initializeLoadingAnimations() {
  // Add fade-in animation to body
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease-in";

  window.addEventListener("load", function () {
    document.body.style.opacity = "1";
  });

  // Animate hero content with staggered delays
  const heroElements = ["#hero-name", "#hero-title", "#hero-tagline", ".btn"];

  heroElements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
      element.style.animationDelay = `${index * 0.2}s`;

      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, (index + 1) * 200);
    }
  });
}

/**
 * Cleanup function
 */
function cleanupAnimations() {
  try {
    // Disconnect the observer if it exists
    if (animationObserver) {
      animationObserver.disconnect();
    }

    // Clear any safety timeouts
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((element) => {
      if (element.dataset.safetyTimeout) {
        clearTimeout(parseInt(element.dataset.safetyTimeout));
      }
    });
  } catch (error) {
    console.error("Error cleaning up animations:", error);
  }
}

// Initialize loading animations immediately
initializeLoadingAnimations();

// Cleanup on page unload
window.addEventListener("beforeunload", cleanupAnimations);
