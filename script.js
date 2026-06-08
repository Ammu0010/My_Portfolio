/* ==========================================================================
   Sri Vishnupriya Portfolio Interactivity & Animations Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- DOM Elements ---
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    
    // --- Dark / Light Theme Toggle ---
    // Use the saved choice if present, otherwise fall back to the OS preference.
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    // --- Mobile Menu Toggle ---
    function openMenu() {
        mobileToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('open');
        // Move focus into the panel so keyboard users land inside it
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
    }

    function closeMenu(returnFocus) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        if (returnFocus) mobileToggle.focus();
    }

    mobileToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close the menu on Escape and hand focus back to the toggle button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMenu(true);
        }
    });

    // Simple focus trap: keep Tab cycling within the open menu's links
    navMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !navMenu.classList.contains('open')) return;
        const links = navMenu.querySelectorAll('.nav-link');
        if (links.length === 0) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // --- Scroll-spy: highlight the nav link for the section currently in view ---
    const navLinkByHash = {};
    navLinks.forEach(link => {
        navLinkByHash[link.getAttribute('href')] = link;
    });

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const link = navLinkByHash['#' + entry.target.id];
            if (!link) return; // section has no matching nav link (e.g. hero)
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    }, {
        // Activation band: a thin strip near the upper-middle of the viewport,
        // so a section becomes "current" as its top crosses that line.
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    });

    document.querySelectorAll('main section[id]').forEach(section => {
        spyObserver.observe(section);
    });

    // --- Typing Effect (Hero Section) ---
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "B.Sc Computer Science with Data Science Student",
        "AI, Machine Learning & OCR Developer",
        "Python Enthusiast & Problem Solver",
        "Data Science & Analytics Aspirant"
    ];
    const typingSpeed = 60;
    const erasingSpeed = 30;
    const newTextDelay = 2000; // Delay between words
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start typing effect. The span ships with static fallback text so the
    // subtitle is still readable if this script fails or JS is disabled; clear
    // it just before the animation takes over.
    if (typedTextSpan) {
        setTimeout(() => {
            typedTextSpan.textContent = '';
            type();
        }, 1000);
    }

    // --- Scroll Indicators & Header Shrink ---
    // Throttle scroll work to one update per animation frame to avoid jank.
    let scrollTicking = false;

    function handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update Scroll Progress Bar
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';

        // Shrink Header on Scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/Hide Back-to-top Button
        if (scrollTop > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // Scroll to top action
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Show/hide cards via classes instead of inline styles + magic timeouts.
    // The fade itself is driven by the .glass transition already on each card;
    // once a card finishes fading out we set the `hidden` attribute so it leaves
    // both the layout and the accessibility tree.
    function applyFilter(filterValue) {
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const shouldShow = filterValue === 'all' || categories.includes(filterValue);

            if (shouldShow) {
                if (!card.hidden && !card.classList.contains('is-hidden')) return;
                card.hidden = false;
                // Next frame so the browser registers display before fading in
                requestAnimationFrame(() => card.classList.remove('is-hidden'));
            } else {
                if (card.hidden) return;
                card.classList.add('is-hidden');
                card.addEventListener('transitionend', function onHidden(e) {
                    if (e.propertyName !== 'opacity') return;
                    card.removeEventListener('transitionend', onHidden);
                    if (card.classList.contains('is-hidden')) card.hidden = true;
                });
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            applyFilter(button.getAttribute('data-filter'));
        });
    });

    // --- Intersection Observers for Scroll Animations ---
    
    // 1. General Fade-in Elements
    const fadeInElements = document.querySelectorAll('.fade-in, .about-card, .timeline-item, .project-card, .edu-card, .cert-card, .contact-info-card');
    
    const fadeInObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInObserverOptions);

    fadeInElements.forEach(element => {
        // Add fade-in default classes if not present
        if (!element.classList.contains('fade-in')) {
            element.classList.add('fade-in');
        }
        fadeInObserver.observe(element);
    });

    // 2. Skill Progress Bars Animation
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar');

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // --- Contact Form Handling & Validation ---
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Elements
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            const honeypot = document.getElementById('form-honey');

            // Honeypot: a genuine visitor never sees or fills the hidden field.
            // If it has a value, silently drop the submission as spam.
            if (honeypot && honeypot.value) {
                contactForm.reset();
                return;
            }

            let isValid = true;

            // Reset error states (subject is optional, so it has no error state)
            resetError(nameInput, 'name-error');
            resetError(emailInput, 'email-error');
            resetError(messageInput, 'message-error');
            formStatus.style.display = 'none';

            // Validate Name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'name-error');
                isValid = false;
            }

            // Validate Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                showError(emailInput, 'email-error');
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'message-error');
                isValid = false;
            }

            if (isValid) {
                // Trigger visual submit animation
                const submitBtn = contactForm.querySelector('.btn-submit');
                const submitBtnText = submitBtn.querySelector('span');
                const submitBtnIcon = submitBtn.querySelector('i');
                const originalText = submitBtnText.textContent;
                
                submitBtn.disabled = true;
                submitBtnText.textContent = "Sending...";
                submitBtnIcon.setAttribute('data-lucide', 'loader-2');
                submitBtnIcon.classList.add('spin-icon');
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Submit to user's real email using FormSubmit AJAX API
                fetch("https://formsubmit.co/ajax/srivishnupriya48@gmail.com", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        Name: nameInput.value,
                        Email: emailInput.value,
                        Subject: subjectInput.value.trim() || "New Message from Portfolio",
                        Message: messageInput.value,
                        _honey: honeypot ? honeypot.value : ""
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtnText.textContent = originalText;
                    submitBtnIcon.setAttribute('data-lucide', 'send');
                    submitBtnIcon.classList.remove('spin-icon');
                    if (typeof lucide !== 'undefined') lucide.createIcons();

                    // Display success feedback
                    formStatus.textContent = "Thanks for reaching out! Your message has been sent — I'll get back to you soon.";
                    formStatus.className = "form-status success";
                    formStatus.style.display = "block";

                    // Clear fields
                    contactForm.reset();
                })
                .catch(error => {
                    submitBtn.disabled = false;
                    submitBtnText.textContent = originalText;
                    submitBtnIcon.setAttribute('data-lucide', 'send');
                    submitBtnIcon.classList.remove('spin-icon');
                    if (typeof lucide !== 'undefined') lucide.createIcons();

                    // Display error feedback
                    formStatus.textContent = "Oops! Something went wrong sending the email. Please try again or email directly at srivishnupriya48@gmail.com.";
                    formStatus.className = "form-status error";
                    formStatus.style.display = "block";
                });
            }
        });

        // Real-time validation listeners
        document.getElementById('form-name').addEventListener('input', function() {
            if (this.value.trim()) resetError(this, 'name-error');
        });
        document.getElementById('form-email').addEventListener('input', function() {
            if (this.value.trim() && validateEmail(this.value)) resetError(this, 'email-error');
        });
        document.getElementById('form-message').addEventListener('input', function() {
            if (this.value.trim()) resetError(this, 'message-error');
        });
    }

    function showError(input, errorId) {
        const group = input.closest('.form-group');
        group.classList.add('error');
    }

    function resetError(input, errorId) {
        const group = input.closest('.form-group');
        group.classList.remove('error');
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return re.test(String(email).trim());
    }
});
