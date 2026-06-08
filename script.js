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
    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('open');
        }
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

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Add active to clicked button
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Get categories
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Quick fade in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay display:none to allow transition
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
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
                        Message: messageInput.value
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
                    formStatus.textContent = "Thank you! Your message has been sent successfully. Please check your inbox/spam folder to verify/activate FormSubmit if this is the first submission.";
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
