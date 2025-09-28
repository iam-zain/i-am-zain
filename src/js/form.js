/**
 * Form handling JavaScript
 * Handles contact form validation and submission
 */

// Form elements and validation rules
let contactForm = null;
let formFields = {};
let validationRules = {};

// Initialize form handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

/**
 * Initialize form handling
 */
function initializeForm() {
    contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    // Get form fields
    formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    // Set validation rules
    validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            message: 'Subject must be 5-100 characters long'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be 10-1000 characters long'
        }
    };

    // Add event listeners
    setupFormEventListeners();
    setupRealTimeValidation();
}

/**
 * Setup form event listeners
 */
function setupFormEventListeners() {
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmission);

    // Prevent form submission on Enter key in input fields (except textarea)
    Object.values(formFields).forEach(field => {
        if (field && field.tagName !== 'TEXTAREA') {
            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextField = getNextField(field);
                    if (nextField) {
                        nextField.focus();
                    }
                }
            });
        }
    });

    // Auto-resize textarea
    if (formFields.message) {
        formFields.message.addEventListener('input', autoResizeTextarea);
    }
}

/**
 * Setup real-time validation
 */
function setupRealTimeValidation() {
    Object.entries(formFields).forEach(([fieldName, field]) => {
        if (!field) return;

        // Validate on blur (when user leaves the field)
        field.addEventListener('blur', function() {
            validateField(fieldName, field.value);
        });

        // Clear error on input (when user starts typing)
        field.addEventListener('input', function() {
            clearFieldError(fieldName);
            
            // Show character count for message field
            if (fieldName === 'message') {
                showCharacterCount(field);
            }
        });

        // Add focus styles
        field.addEventListener('focus', function() {
            field.classList.add('ring-2', 'ring-primary-500', 'border-transparent');
        });

        field.addEventListener('blur', function() {
            field.classList.remove('ring-2', 'ring-primary-500', 'border-transparent');
        });
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmission(e) {
    e.preventDefault();

    // Validate all fields
    const isValid = validateAllFields();
    
    if (!isValid) {
        showFormMessage('Please correct the errors above.', 'error');
        return;
    }

    // Get form data
    const formData = getFormData();
    
    // Show loading state
    setFormLoading(true);
    showFormMessage('Sending your message...', 'info');

    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Success
        showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
        resetForm();
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
    } finally {
        setFormLoading(false);
    }
}

/**
 * Validate a single field
 */
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return true;

    const errors = [];

    // Required validation
    if (rules.required && !value.trim()) {
        errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) {
        clearFieldError(fieldName);
        return true;
    }

    // Length validation
    if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.trim())) {
        errors.push(rules.message || `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} format is invalid`);
    }

    if (errors.length > 0) {
        showFieldError(fieldName, errors[0]);
        return false;
    }

    clearFieldError(fieldName);
    return true;
}

/**
 * Validate all fields
 */
function validateAllFields() {
    let isValid = true;

    Object.entries(formFields).forEach(([fieldName, field]) => {
        if (field) {
            const fieldValid = validateField(fieldName, field.value);
            if (!fieldValid) {
                isValid = false;
            }
        }
    });

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(fieldName, message) {
    const field = formFields[fieldName];
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (field && errorElement) {
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-neutral-300', 'focus:ring-primary-500');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${fieldName}-error`);
        
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

/**
 * Clear field error
 */
function clearFieldError(fieldName) {
    const field = formFields[fieldName];
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (field && errorElement) {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.classList.add('border-neutral-300', 'focus:ring-primary-500');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
}

/**
 * Show form message
 */
function showFormMessage(message, type = 'info') {
    const statusElement = document.getElementById('form-status');
    
    if (!statusElement) return;

    const colorClasses = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600'
    };

    statusElement.textContent = message;
    statusElement.className = `text-sm text-center ${colorClasses[type] || colorClasses.info}`;
    statusElement.classList.remove('hidden');

    // Auto-hide success/info messages after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Set form loading state
 */
function setFormLoading(loading) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('.submit-text');
    const loadingText = submitButton.querySelector('.loading-text');

    if (loading) {
        submitButton.disabled = true;
        submitButton.classList.add('opacity-75', 'cursor-not-allowed');
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
    } else {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
        submitText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
}

/**
 * Get form data
 */
function getFormData() {
    const data = {};
    
    Object.entries(formFields).forEach(([fieldName, field]) => {
        if (field) {
            data[fieldName] = field.value.trim();
        }
    });

    return data;
}

/**
 * Reset form
 */
function resetForm() {
    contactForm.reset();
    
    // Clear all errors
    Object.keys(formFields).forEach(fieldName => {
        clearFieldError(fieldName);
    });

    // Reset textarea height
    if (formFields.message) {
        formFields.message.style.height = 'auto';
    }
}

/**
 * Auto-resize textarea
 */
function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

/**
 * Show character count for message field
 */
function showCharacterCount(field) {
    const maxLength = validationRules.message.maxLength;
    const currentLength = field.value.length;
    const remaining = maxLength - currentLength;

    let countElement = document.getElementById('message-count');
    
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.id = 'message-count';
        countElement.className = 'text-xs text-right mt-1';
        field.parentNode.appendChild(countElement);
    }

    countElement.textContent = `${currentLength}/${maxLength}`;
    
    if (remaining < 50) {
        countElement.className = 'text-xs text-right mt-1 text-orange-600';
    } else if (remaining < 0) {
        countElement.className = 'text-xs text-right mt-1 text-red-600';
    } else {
        countElement.className = 'text-xs text-right mt-1 text-neutral-500';
    }
}

/**
 * Get next field for tab navigation
 */
function getNextField(currentField) {
    const fieldOrder = ['name', 'email', 'subject', 'message'];
    const currentIndex = fieldOrder.findIndex(name => formFields[name] === currentField);
    
    if (currentIndex >= 0 && currentIndex < fieldOrder.length - 1) {
        return formFields[fieldOrder[currentIndex + 1]];
    }
    
    return null;
}

/**
 * Simulate form submission (replace with actual API call)
 */
async function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                console.log('Form submitted:', formData);
                resolve({ success: true, message: 'Message sent successfully' });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

/**
 * Real form submission function (implement with your backend/service)
 */
async function submitFormToServer(formData) {
    // Example implementation with Netlify Forms
    /*
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'form-name': 'contact',
            ...formData
        })
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return response;
    */

    // Example implementation with EmailJS
    /*
    return emailjs.send('your_service_id', 'your_template_id', formData, 'your_public_key');
    */

    // For now, use the simulation
    return simulateFormSubmission(formData);
}

/**
 * Add honeypot field for spam protection
 */
function addHoneypotField() {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autoComplete = 'off';
    
    contactForm.appendChild(honeypot);
    
    // Check honeypot on form submission
    contactForm.addEventListener('submit', function(e) {
        if (honeypot.value !== '') {
            e.preventDefault();
            console.log('Spam detected');
            return false;
        }
    });
}

// Initialize honeypot protection
document.addEventListener('DOMContentLoaded', addHoneypotField);
