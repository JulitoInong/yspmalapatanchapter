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

const slideImage = document.getElementById('slide-image');
const slideLabel = document.getElementById('slide-label');
const slideDescription = document.getElementById('slide-description');
const slidePrev = document.getElementById('slide-prev');
const slideNext = document.getElementById('slide-next');
const slideDots = document.getElementById('slide-dots');
const eventsToggle = document.getElementById('events-toggle');
const hiddenEventCards = document.querySelectorAll('#events-grid article[hidden]');

const slides = [
    {
        src: 'assets/ysp-malapatan-cover.jpg',
        label: 'Community service spotlight',
        description: 'Celebrating the strength of youth leadership in local outreach and partnership events.'
    },
    {
        src: 'assets/event-online-kamustahan.jpg',
        label: 'Community connection',
        description: 'A kamustahan event that strengthens relationships between youth volunteers and community members.'
    },
    {
        src: 'assets/event-online-chapter-orientation.jpg',
        label: 'Chapter orientation',
        description: 'New members learn how Youth Service Philippines Malapatan serves the community and leads with purpose.'
    }
];

let currentSlide = 0;
let slideInterval = null;

function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    menuOpenIcon.classList.toggle('hidden', open);
    menuCloseIcon.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}

function updateSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    const slide = slides[currentSlide];

    slideImage.classList.add('opacity-0');
    setTimeout(() => {
        slideImage.src = slide.src;
        slideImage.alt = slide.label;
        slideLabel.textContent = slide.label;
        slideDescription.textContent = slide.description;
        slideImage.classList.remove('opacity-0');
    }, 200);

    Array.from(slideDots.children).forEach((dot, dotIndex) => {
        dot.classList.toggle('bg-white', dotIndex === currentSlide);
        dot.classList.toggle('bg-white/40', dotIndex !== currentSlide);
    });
}

function startSlideshow() {
    slideInterval = setInterval(() => updateSlide(currentSlide + 1), 7000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
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

function handleFormSubmit(event) {
    event.preventDefault();
    const feedback = document.getElementById('form-feedback');

    if (!validateForm()) {
        feedback.textContent = '';
        return;
    }

    feedback.textContent = 'Thank you! Your inquiry has been drafted. Please use your email client to send it.';
    volunteerForm.reset();
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

if (slidePrev && slideNext && slideDots && slideImage) {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'h-2.5 w-2.5 rounded-full bg-white/40 transition';
        dot.setAttribute('aria-label', `Show slide ${index + 1}`);
        dot.addEventListener('click', () => {
            updateSlide(index);
            stopSlideshow();
            startSlideshow();
        });
        slideDots.appendChild(dot);
    });

    slidePrev.addEventListener('click', () => {
        updateSlide(currentSlide - 1);
        stopSlideshow();
        startSlideshow();
    });

    slideNext.addEventListener('click', () => {
        updateSlide(currentSlide + 1);
        stopSlideshow();
        startSlideshow();
    });

    updateSlide(0);
    startSlideshow();
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
