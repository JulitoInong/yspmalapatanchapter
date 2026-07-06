const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
const openModal = document.getElementById('open-modal');
const closeModal = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');
const volunteerForm = document.getElementById('volunteer-form');
const backToTop = document.getElementById('back-to-top');
const currentYear = document.getElementById('current-year');

const eventsToggle = document.getElementById('events-toggle');
const hiddenEventCards = document.querySelectorAll('#events-grid article[hidden]');

function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    menuOpenIcon.classList.toggle('hidden', open);
    menuCloseIcon.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}

function setDarkMode(enabled) {
    document.documentElement.classList.toggle('dark', enabled);
    const icon = darkModeToggle.querySelector('svg');
    if (enabled) {
        darkModeToggle.setAttribute('aria-pressed', 'true');
        icon.innerHTML = '<path d="M12 3.1a8.9 8.9 0 0 0 0 17.8 8.9 8.9 0 0 1 0-17.8Z"/>';
    } else {
        darkModeToggle.setAttribute('aria-pressed', 'false');
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z"/>';
    }
    localStorage.setItem('ysp-dark-mode', enabled ? 'true' : 'false');
}

function toggleDarkMode() {
    setDarkMode(!document.documentElement.classList.contains('dark'));
}

function openInquiryModal() {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('volunteer-name').focus();
}

function closeInquiryModal() {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showError(inputId, message) {
    const error = document.getElementById(`error-${inputId}`);
    error.textContent = message;
    error.classList.remove('hidden');
}

function clearError(inputId) {
    const error = document.getElementById(`error-${inputId}`);
    error.textContent = '';
    error.classList.add('hidden');
}

function validateForm() {
    let valid = true;
    const name = document.getElementById('volunteer-name');
    const email = document.getElementById('volunteer-email');
    const message = document.getElementById('volunteer-message');

    if (!name.value.trim()) {
        showError('name', 'Please enter your name.');
        valid = false;
    } else {
        clearError('name');
    }

    if (!email.value.trim()) {
        showError('email', 'Please enter your email address.');
        valid = false;
    } else if (!validateEmail(email.value.trim())) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
    } else {
        clearError('email');
    }

    if (!message.value.trim()) {
        showError('message', 'Please write a short message.');
        valid = false;
    } else {
        clearError('message');
    }

    return valid;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const submitButton = document.getElementById('volunteer-submit');

    if (!validateForm()) {
        feedback.textContent = '';
        return;
    }

    feedback.classList.remove('text-slate-900');
    feedback.classList.add('text-slate-500');
    feedback.textContent = 'Sending your inquiry…';
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
    }

    try {
        const response = await fetch(volunteerForm.action, {
            method: 'POST',
            body: new FormData(volunteerForm),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            feedback.classList.remove('text-slate-500');
            feedback.classList.add('text-slate-900');
            feedback.textContent = 'Thank you! Your inquiry has been sent.';
            volunteerForm.reset();
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        feedback.classList.remove('text-slate-900');
        feedback.classList.add('text-rose-500');
        feedback.textContent = 'Something went wrong. Please try again or email us directly.';
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send inquiry';
        }
    }
}

if (menuButton && mobileMenu && menuOpenIcon && menuCloseIcon) {
    menuButton.addEventListener('click', () => {
        setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenu(false);
            closeInquiryModal();
        }
    });
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

if (mobileDarkModeToggle) {
    mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
}

if (openModal) {
    openModal.addEventListener('click', openInquiryModal);
}

if (closeModal) {
    closeModal.addEventListener('click', closeInquiryModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeInquiryModal();
    });
}

if (eventsToggle) {
    eventsToggle.addEventListener('click', () => {
        const expanded = eventsToggle.getAttribute('aria-expanded') === 'true';
        const nextExpanded = !expanded;

        eventsToggle.setAttribute('aria-expanded', String(nextExpanded));
        eventsToggle.textContent = nextExpanded ? 'Show fewer activities' : 'View all activities';

        hiddenEventCards.forEach((card) => {
            card.hidden = !nextExpanded;
            if (nextExpanded) {
                card.classList.remove('visible');
                requestAnimationFrame(() => card.classList.add('visible'));
            }
        });
    });
}

if (volunteerForm) {
    volunteerForm.addEventListener('submit', handleFormSubmit);
}

if (backToTop) {
    window.addEventListener('scroll', () => {
        const showButton = window.scrollY > 650;
        backToTop.classList.toggle('opacity-0', !showButton);
        backToTop.classList.toggle('translate-y-4', !showButton);
        backToTop.classList.toggle('pointer-events-none', !showButton);
    }, { passive: true });
}

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const sectionObserver = new IntersectionObserver((entries) => {
    const navLinks = document.querySelectorAll('.nav-link');
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-25% 0px -65% 0px' });

const sections = document.querySelectorAll('main section[id]');
sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

if (localStorage.getItem('ysp-dark-mode') === 'true') {
    setDarkMode(true);
}
// ================================================================
// FEEDBACK PORTAL SYSTEM CONTROLLERS
// ================================================================
const openFeedbackBtn = document.getElementById('open-feedback-modal');
const closeFeedbackBtn = document.getElementById('close-feedback-modal');
const feedbackModal = document.getElementById('feedback-modal-overlay');
const feedbackForm = document.getElementById('feedback-form');
const feedbackAnonymousCheckbox = document.getElementById('feedback-anonymous');
const emailFieldContainer = document.getElementById('email-field-container');
const feedbackEmailInput = document.getElementById('feedback-email');

// Open Portal
if (openFeedbackBtn) {
    openFeedbackBtn.addEventListener('click', () => {
        feedbackModal.classList.remove('hidden');
        feedbackModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });
}

// Close Portal
function closeFeedbackPortal() {
    feedbackModal.classList.add('hidden');
    feedbackModal.classList.remove('flex');
    document.body.style.overflow = '';
}

if (closeFeedbackBtn) closeFeedbackBtn.addEventListener('click', closeFeedbackPortal);
if (feedbackModal) {
    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) closeFeedbackPortal();
    });
}

// Handle Anonymous Checkbox State Updates
if (feedbackAnonymousCheckbox) {
    feedbackAnonymousCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Hide and disable email requirement
            emailFieldContainer.classList.add('hidden');
            feedbackEmailInput.removeAttribute('required');
            feedbackEmailInput.value = ''; // Reset values
            const errorElement = document.getElementById('error-feedback-email');
            if (errorElement) errorElement.classList.add('hidden');
        } else {
            // Restore visibility and requirement
            emailFieldContainer.classList.remove('hidden');
            feedbackEmailInput.setAttribute('required', 'true');
        }
    });
}

// Validation & Async Submission to Spreadsheet Database
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const statusMsg = document.getElementById('feedback-portal-status');
        const submitBtn = document.getElementById('feedback-submit');
        const messageInput = document.getElementById('feedback-message');
        let isValid = true;

        // Message field check
        if (!messageInput.value.trim()) {
            document.getElementById('error-feedback-message').textContent = 'Please provide a message.';
            document.getElementById('error-feedback-message').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('error-feedback-message').classList.add('hidden');
        }

        // Email address check (only if not anonymous)
        if (!feedbackAnonymousCheckbox.checked) {
            const emailValue = feedbackEmailInput.value.trim();
            if (!emailValue) {
                document.getElementById('error-feedback-email').textContent = 'Please enter your email.';
                document.getElementById('error-feedback-email').classList.remove('hidden');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                document.getElementById('error-feedback-email').textContent = 'Please enter a valid email.';
                document.getElementById('error-feedback-email').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('error-feedback-email').classList.add('hidden');
            }
        }

        if (!isValid) return;

        // UI Feedback during API stream saving
        statusMsg.className = "text-sm font-semibold text-slate-500";
        statusMsg.textContent = 'Submitting feedback…';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(feedbackForm);
            // Explicitly set email to 'Anonymous' in sheets rows if toggled on
            if (feedbackAnonymousCheckbox.checked) {
                formData.set('Email', 'Anonymous');
            }

            const response = await fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusMsg.className = "text-sm font-semibold text-slate-900";
                statusMsg.textContent = 'Thank you! Your feedback has been recorded.';
                feedbackForm.reset();
                // Reset anonymous toggle layout
                emailFieldContainer.classList.remove('hidden');
                feedbackEmailInput.setAttribute('required', 'true');
                
                setTimeout(() => { closeFeedbackPortal(); statusMsg.textContent = ''; }, 2000);
            } else {
                throw new Error();
            }
        } catch (error) {
            statusMsg.className = "text-sm font-semibold text-rose-500";
            statusMsg.textContent = 'Submission failed. Please try again later.';
        } finally {
            submitBtn.disabled = false;
        }
    });
}
