// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) with optimized settings
    AOS.init({
        duration: 600,
        offset: 0,
        once: true,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 0,
        disable: false,
        mirror: false,
        anchorPlacement: 'top-bottom',
        startEvent: 'load'
    });

    // Refresh AOS when all images are loaded
    window.addEventListener('load', () => {
        AOS.refresh();
    });

    // Gallery Slider Initialization
    const initGallerySlider = () => {
        const track = document.querySelector('.gallery-track');
        const slides = document.querySelectorAll('.gallery-item');
        const prevButton = document.querySelector('.slider-arrow.prev');
        const nextButton = document.querySelector('.slider-arrow.next');
        let currentIndex = 0;
        let isTransitioning = false;

        if (!track || !slides.length || !prevButton || !nextButton) {
            console.error('Gallery slider elements not found');
            return;
        }

        // Calculate dimensions
        const getSlideWidth = () => {
            const containerWidth = track.parentElement.offsetWidth;
            const gap = 20; // Fixed gap size
            let width;

            if (window.innerWidth <= 576) {
                width = containerWidth;
            } else if (window.innerWidth <= 1024) {
                width = (containerWidth - gap) / 2;
            } else {
                width = (containerWidth - gap * 2) / 3;
            }

            return { width, gap };
        };

        const updateSliderPosition = () => {
            const { width, gap } = getSlideWidth();
            const translateX = -currentIndex * (width + gap);
            
            // Update slide widths
            slides.forEach(slide => {
                slide.style.width = `${width}px`;
            });
            
            // Add transition class for smooth movement
            track.style.transition = 'transform 0.3s ease';
            track.style.transform = `translateX(${translateX}px)`;
        };

        const updateButtonStates = () => {
            const visibleSlides = window.innerWidth <= 576 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
            const maxIndex = slides.length - visibleSlides;
            
            prevButton.disabled = currentIndex <= 0;
            nextButton.disabled = currentIndex >= maxIndex;
            
            // Update visual states
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        };

        // Event listeners for controls
        prevButton.addEventListener('click', () => {
            if (!prevButton.disabled && !isTransitioning) {
                isTransitioning = true;
                currentIndex = Math.max(0, currentIndex - 1);
                updateSliderPosition();
                updateButtonStates();
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 300); // Match transition duration
            }
        });

        nextButton.addEventListener('click', () => {
            if (!nextButton.disabled && !isTransitioning) {
                isTransitioning = true;
                const visibleSlides = window.innerWidth <= 576 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
                const maxIndex = slides.length - visibleSlides;
                
                currentIndex = Math.min(maxIndex, currentIndex + 1);
                updateSliderPosition();
                updateButtonStates();
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 300); // Match transition duration
            }
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Temporarily remove transition for resize
                track.style.transition = 'none';
                
                // Ensure current index is valid after resize
                const visibleSlides = window.innerWidth <= 576 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
                const maxIndex = slides.length - visibleSlides;
                currentIndex = Math.min(currentIndex, maxIndex);
                
                updateSliderPosition();
                updateButtonStates();
                
                // Restore transition after a brief delay
                setTimeout(() => {
                    track.style.transition = 'transform 0.3s ease';
                }, 50);
            }, 200);
        });

        // Initialize slider
        updateSliderPosition();
        updateButtonStates();
    };

    // Initialize the gallery slider
    initGallerySlider();

    // Optimized smooth scroll with performance considerations
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (!element) return;
        
        window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Optimized header scroll effect with debouncing
    const header = document.querySelector('header');
    let lastScroll = 0;
    let scrollTimeout;
    const scrollThreshold = 100; // Minimum scroll amount before header becomes fixed

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add or remove fixed header based on scroll position
        if (currentScroll > scrollThreshold) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
        
        // Handle header visibility on scroll up/down
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            header.classList.add('scroll-down');
            header.classList.remove('scroll-up');
        } else if (currentScroll < lastScroll && currentScroll > scrollThreshold) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });

    // Initial check for page load with scroll position
    handleScroll();

    // Mobile menu toggle with accessibility
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    };

    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Search functionality
    const searchButtons = document.querySelectorAll('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input[type="search"]');
    const searchResults = document.querySelector('.search-results');

    // Define searchable sections
    const searchableSections = [
        {
            id: 'hero',
            title: 'Home',
            content: document.querySelector('.hero-content')?.textContent || ''
        },
        {
            id: 'about',
            title: 'About Us',
            content: document.querySelector('#about')?.textContent || ''
        },
        {
            id: 'gallery',
            title: 'Gallery',
            content: document.querySelector('#gallery')?.textContent || ''
        },
        {
            id: 'features',
            title: 'Features',
            content: document.querySelector('.features-grid')?.textContent || ''
        }
    ];

    const performSearch = (searchTerm) => {
        searchResults.innerHTML = '';
        const results = [];
        
        if (!searchTerm) {
            searchResults.innerHTML = '<div class="no-results">Please enter a search term</div>';
            return;
        }

        searchableSections.forEach(section => {
            const searchRegex = new RegExp(searchTerm, 'gi');
            if (section.content.match(searchRegex)) {
                // Get the context around the match
                const matches = [...section.content.matchAll(searchRegex)];
                matches.forEach(match => {
                    const start = Math.max(0, match.index - 50);
                    const end = Math.min(section.content.length, match.index + 50);
                    let context = section.content.slice(start, end);
                    
                    // Add ellipsis if needed
                    if (start > 0) context = '...' + context;
                    if (end < section.content.length) context += '...';
                    
                    // Highlight the matched term
                    context = context.replace(searchRegex, '<span class="search-result-highlight">$&</span>');
                    
                    results.push({
                        section: section.title,
                        id: section.id,
                        context: context
                    });
                });
            }
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item" data-section="${result.id}">
                <h3>${result.section}</h3>
                <p>${result.context}</p>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;

        // Add click handlers to results
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.dataset.section;
                toggleSearch();
                setTimeout(() => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            });
        });
    };

    const toggleSearch = () => {
        searchOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
        if (searchOverlay.classList.contains('active')) {
            searchInput.focus();
            searchResults.innerHTML = '';
        }
    };

    searchButtons.forEach(btn => {
        btn.addEventListener('click', toggleSearch);
    });

    closeSearch.addEventListener('click', toggleSearch);

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
    });

    // Handle search form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        performSearch(searchTerm);
    });

    // Real-time search as user types (with debounce)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchInput.value.trim());
        }, 300);
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 576 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Optimized newsletter form submission
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value && isValidEmail(emailInput.value)) {
                // Here you would typically send the data to your server
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 