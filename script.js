document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------------------------------
       1. FLAVOR SELECTOR / THEME SWITCHER
       ------------------------------------------------------------- */
    const body = document.body;
    const heroBgText = document.getElementById('hero-bg-text-shadow');
    const heroCanImg = document.getElementById('product-can-img');
    const formulaCanImg = document.getElementById('formula-can-img');
    const flavorDots = document.querySelectorAll('.flavor-selector__dot');
    const selectFlavorButtons = document.querySelectorAll('.btn--select-flavor');

    // Helper map of images for each flavor
    const flavorData = {
        citrus: {
            theme: 'theme-citrus',
            bgText: 'CITRUS',
            imgSrc: 'assets/images/monstro_citrus.png'
        },
        berry: {
            theme: 'theme-berry',
            bgText: 'BERRY',
            imgSrc: 'assets/images/insane_berry.png'
        },
        mango: {
            theme: 'theme-mango',
            bgText: 'MANGO',
            imgSrc: 'assets/images/double_mango.png'
        }
    };

    function changeFlavor(flavorKey) {
        const data = flavorData[flavorKey];
        if (!data) return;

        // 1. Update active states on dots
        flavorDots.forEach(dot => {
            if (dot.getAttribute('data-flavor') === flavorKey) {
                dot.classList.add('flavor-selector__dot--active');
            } else {
                dot.classList.remove('flavor-selector__dot--active');
            }
        });

        // 2. Animate can image transition (fade out, change source, fade in)
        heroCanImg.classList.remove('hero__product-image--active');
        
        setTimeout(() => {
            // Update image sources safely via attributes
            heroCanImg.setAttribute('src', data.imgSrc);
            heroCanImg.setAttribute('alt', `Lata do energético Mansão Maromba Sabor ${flavorKey}`);
            
            if (formulaCanImg) {
                formulaCanImg.setAttribute('src', data.imgSrc);
                formulaCanImg.setAttribute('alt', `Energético Mansão Maromba Fórmula Sabor ${flavorKey}`);
            }

            // Update text safely
            if (heroBgText) {
                heroBgText.textContent = data.bgText;
            }

            // Fade back in
            heroCanImg.classList.add('hero__product-image--active');
        }, 200);

        // 3. Update body theme classes
        body.classList.remove('theme-citrus', 'theme-berry', 'theme-mango');
        body.classList.add(data.theme);
    }

    // Attach click events to dots
    flavorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const flavor = dot.getAttribute('data-flavor');
            changeFlavor(flavor);
        });
    });

    // Attach click events to "Select Sabor" buttons in cards
    selectFlavorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            changeFlavor(target);
            
            // Smooth scroll up to Hero section to see the change
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* -------------------------------------------------------------
       2. FAQ ACCORDION (SAFE DOM MANIPULATION)
       ------------------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq__trigger');
        
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('faq__item--active');
                
                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('faq__item--active');
                    const otherTrigger = otherItem.querySelector('.faq__trigger');
                    if (otherTrigger) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle selected item
                if (!isOpen) {
                    item.classList.add('faq__item--active');
                    trigger.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('faq__item--active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });


    /* -------------------------------------------------------------
       3. INTERSECTION OBSERVER FOR FADE-IN SCROLL ANIMATIONS
       ------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.card');

    // Set initial styles for elements to be animated
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                // Stop observing once animated
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering view fully
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

});
