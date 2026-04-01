/* ============================================
   PORTFOLIO - SAHIL SURESH RANE
   JavaScript - Animations & Interactions
   PERFORMANCE OPTIMIZED
   ============================================ */

// Global variables for card deck
let currentSection = 0;
let totalSections = 0;
let isAnimating = false;
let touchStartY = 0;
let touchEndY = 0;
let cardSections = [];
const animatedCards = new Set(); // Track visited cards

// Performance: Throttle utility for smooth 120fps
const throttle = (fn, ms) => {
    let lastCall = 0;
    return (...args) => {
        const now = performance.now();
        if (now - lastCall >= ms) {
            lastCall = now;
            fn(...args);
        }
    };
};

// Performance: RAF-based smooth value interpolation
const lerp = (start, end, factor) => start + (end - start) * factor;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initLoader();
    initEpicCardDeck();
    initCursor();
    initParticles();
    initTypingEffect();
    initCardAnimations();
    initThemeToggle();
    initSmoothScroll();
});

/* ============================================
   PAGE LOADER
   ============================================ */
function initLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Epic entrance for first card
            epicCardEntrance(0);
        }, 800);
    });
}

/* ============================================
   EPIC 3D CARD DECK ANIMATION SYSTEM
   ============================================ */
function initEpicCardDeck() {
    cardSections = document.querySelectorAll('.card-section');
    const pageDots = document.querySelectorAll('.page-dot');
    totalSections = cardSections.length;
    
    console.log('Card Deck Initialized:', totalSections, 'sections found');
    
    // Initialize card positions with GSAP
    initializeCardPositions();
    
    // Wheel navigation - smooth and responsive
    let lastWheelTime = 0;
    const wheelCooldown = 650; // ms between scrolls (matches animation duration)
    
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        if (isAnimating || now - lastWheelTime < wheelCooldown) return;
        
        const delta = e.deltaY;
        
        if (delta > 20 && currentSection < totalSections - 1) {
            lastWheelTime = now;
            console.log('Scrolling DOWN to section', currentSection + 1);
            navigateToCard(currentSection + 1, 'down');
        } else if (delta < -20 && currentSection > 0) {
            lastWheelTime = now;
            console.log('Scrolling UP to section', currentSection - 1);
            navigateToCard(currentSection - 1, 'up');
        }
    }, { passive: false });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Touch navigation with velocity
    let touchStartTime = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const swipeDistance = touchStartY - touchEndY;
        const swipeTime = Date.now() - touchStartTime;
        const velocity = Math.abs(swipeDistance) / swipeTime;

        // On smaller screens cards can scroll vertically. Only switch sections
        // when user swipes at the scroll boundaries of the active card.
        const activeCard = cardSections[currentSection];
        if (activeCard) {
            const hasVerticalOverflow = activeCard.scrollHeight - activeCard.clientHeight > 8;
            if (hasVerticalOverflow) {
                const atTop = activeCard.scrollTop <= 2;
                const atBottom = activeCard.scrollTop + activeCard.clientHeight >= activeCard.scrollHeight - 2;

                if ((swipeDistance > 0 && !atBottom) || (swipeDistance < 0 && !atTop)) {
                    return;
                }
            }
        }
        
        if (Math.abs(swipeDistance) > 30 || velocity > 0.5) {
            if (swipeDistance > 0 && currentSection < totalSections - 1) {
                navigateToCard(currentSection + 1, 'down');
            } else if (swipeDistance < 0 && currentSection > 0) {
                navigateToCard(currentSection - 1, 'up');
            }
        }
    }, { passive: true });
    
    // Page dot navigation
    pageDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentSection) {
                const direction = index > currentSection ? 'down' : 'up';
                navigateToCard(index, direction);
            }
        });
    });
}

function initializeCardPositions() {
    // Set perspective on container for 3D depth
    const container = document.querySelector('.card-deck-container');
    if (container) {
        container.style.perspective = '1200px';
        container.style.perspectiveOrigin = '50% 50%';
    }
    
    cardSections.forEach((card, index) => {
        card.style.willChange = 'transform, opacity';
        
        if (index === 0) {
            // First card visible
            gsap.set(card, {
                opacity: 1,
                y: 0,
                scale: 1
            });
        } else {
            // Other cards hidden below
            gsap.set(card, {
                opacity: 0,
                y: '100%',
                scale: 1
            });
        }
    });
}

// ============================================
// ✨ SMOOTH MORPHING CARD TRANSITIONS
// ============================================
function navigateToCard(targetIndex, direction) {
    if (isAnimating || targetIndex === currentSection) return;
    
    isAnimating = true;
    const previousIndex = currentSection;
    currentSection = targetIndex;
    
    const currentCard = cardSections[previousIndex];
    const nextCard = cardSections[targetIndex];
    
    // Update UI
    updatePageDots();
    
    // Always show transition effect
    createSmoothReveal(direction);
    
    // Smooth timing
    const duration = 0.8;
    
    // Create master timeline
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            // Always animate content
            animateCardContent(nextCard);
        }
    });
    
    if (direction === 'down') {
        // Current card - smooth slide out
        tl.to(currentCard, {
            y: '-50%',
            opacity: 0,
            duration: duration * 0.6,
            ease: 'power2.inOut'
        });
        
        // Set next card starting position (off-screen)
        gsap.set(nextCard, { y: '50%', opacity: 0 });
        
        // Next card slides in
        tl.to(nextCard, {
            y: 0,
            opacity: 1,
            duration: duration,
            ease: 'power2.out'
        }, '-=0.3');
        
    } else {
        // Current card - slide down
        tl.to(currentCard, {
            y: '50%',
            opacity: 0,
            duration: duration * 0.6,
            ease: 'power2.inOut'
        });
        
        // Set next card starting position (off-screen above)
        gsap.set(nextCard, { y: '-50%', opacity: 0 });
        
        // Previous card slides in
        tl.to(nextCard, {
            y: 0,
            opacity: 1,
            duration: duration,
            ease: 'power2.out'
        }, '-=0.3');
    }
}

// ============================================
// 🌊 SMOOTH REVEAL EFFECT - Elegant & Clean
// ============================================
function createSmoothReveal(direction) {
    const container = document.querySelector('.card-deck-container');
    if (!container) return;
    
    // Create gradient wipe overlay
    const wipe = document.createElement('div');
    wipe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: linear-gradient(${direction === 'down' ? '0deg' : '180deg'},
            transparent 0%,
            rgba(99, 102, 241, 0.08) 30%,
            rgba(99, 102, 241, 0.15) 50%,
            rgba(99, 102, 241, 0.08) 70%,
            transparent 100%);
        opacity: 0;
        transform: translateY(${direction === 'down' ? '-100%' : '100%'});
    `;
    container.appendChild(wipe);
    
    // Animate the wipe across the screen
    gsap.timeline()
        .to(wipe, {
            opacity: 1,
            duration: 0.15,
            ease: 'power1.in'
        })
        .to(wipe, {
            y: direction === 'down' ? '100%' : '-100%',
            duration: 0.5,
            ease: 'power2.inOut'
        }, 0)
        .to(wipe, {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
            onComplete: () => wipe.remove()
        }, '-=0.2');
    
    // Add subtle shimmer particles
    createShimmerParticles(container, direction);
}

// ✨ Subtle shimmer particles for extra polish
function createShimmerParticles(container, direction) {
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = 3 + Math.random() * 4;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 0.3;
        
        particle.style.cssText = `
            position: fixed;
            left: ${xPos}%;
            ${direction === 'down' ? 'top: -20px' : 'bottom: -20px'};
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(99, 102, 241, 0.6) 50%,
                transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
        `;
        container.appendChild(particle);
        
        // Animate particle
        gsap.timeline()
            .to(particle, {
                opacity: 1,
                duration: 0.2,
                delay: delay
            })
            .to(particle, {
                y: direction === 'down' ? window.innerHeight + 40 : -(window.innerHeight + 40),
                duration: 0.6 + Math.random() * 0.3,
                ease: 'power1.inOut'
            }, `-=${0.15}`)
            .to(particle, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => particle.remove()
            }, '-=0.25');
    }
}

// Disabled - replaced with new effects
function createDepthShadow(direction) { return; }
function createMomentumTrail(card, direction) { return; }
function createEdgeGlow(direction) { return; }
function animateContentParallax(card, direction) { return; }

// ✨ Smooth entrance animation for first card
function epicCardEntrance(index) {
    const card = cardSections[index];
    if (!card) return;
    
    // Smooth elegant entrance
    gsap.fromTo(card,
        {
            opacity: 0,
            y: 40,
            scale: 0.96
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            onComplete: () => animateCardContent(card)
        }
    );
}

// Flash effect on first load - made subtle
function createEntranceFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, 
            rgba(99, 102, 241, 0.1) 0%, 
            transparent 70%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
    `;
    document.body.appendChild(flash);
    
    gsap.to(flash, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(flash, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => flash.remove()
            });
        }
    });
}

// Disabled for performance

// Disabled for performance
function createEntranceParticles() { return; }

// animatedCards is defined globally at top of file

// 🎭 Smooth content reveal animation with text effects - only runs ONCE per card
function animateCardContent(card) {
    if (!card) return;
    
    // Skip animation if this card was already shown
    if (animatedCards.has(card)) return;
    animatedCards.add(card);
    
    // Animate section title with letter-by-letter effect
    const title = card.querySelector('.section-title-compact');
    if (title) {
        animateTextReveal(title);
    }
    
    // Animate description with fade up
    const desc = card.querySelector('.section-desc-compact');
    if (desc) {
        gsap.fromTo(desc,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
        );
    }
    
    // Get grid/list containers
    const containers = card.querySelectorAll('.skills-grid-compact, .journey-grid, .projects-grid-compact, .hackathons-grid-compact, .about-grid-compact, .stats-row-compact');
    
    containers.forEach((container, containerIndex) => {
        const items = container.children;
        
        gsap.fromTo(items,
            { 
                opacity: 0, 
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: {
                    each: 0.08,
                    from: 'start'
                },
                delay: 0.5 + (containerIndex * 0.1),
                ease: 'power3.out'
            }
        );
    });
    
    // Contact section - smooth entrance
    const contactBoxes = card.querySelectorAll('.contact-box-compact, .contact-card-compact');
    if (contactBoxes.length) {
        gsap.fromTo(contactBoxes,
            { opacity: 0, y: 25 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.3,
                ease: 'power3.out'
            }
        );
    }
}

// ✨ Text reveal animation - letter by letter
function animateTextReveal(element) {
    if (!element) return;
    
    const text = element.textContent;
    element.innerHTML = '';
    
    // Split text into characters
    const chars = text.split('');
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(25px)';
        element.appendChild(span);
        
        // Animate each character
        gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 0.025 * index,
            ease: 'power2.out'
        });
    });
}

// Global navigation function
window.goToSection = function(index) {
    if (isAnimating || index === currentSection || index < 0 || index >= totalSections) return;
    const direction = index > currentSection ? 'down' : 'up';
    navigateToCard(index, direction);
}

// Update page dots and nav links
function updatePageDots() {
    const pageDots = document.querySelectorAll('.page-dot');
    
    pageDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSection) {
            dot.classList.add('active');
        }
    });
    
    // Also update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.classList.remove('active');
        if (index === currentSection) {
            link.classList.add('active');
        }
    });
}

function handleKeyboard(e) {
    if (isAnimating) return;
    
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
            e.preventDefault();
            if (currentSection < totalSections - 1) {
                goToSection(currentSection + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentSection > 0) {
                goToSection(currentSection - 1);
            }
            break;
        case 'Home':
            e.preventDefault();
            goToSection(0);
            break;
        case 'End':
            e.preventDefault();
            goToSection(totalSections - 1);
            break;
    }
}

/* ============================================
   3D PARALLAX TILT EFFECT ON MOUSE MOVE
   ============================================ */
function init3DParallax() {
    // Disabled for performance - no continuous RAF loop needed
    return;
}

// Initialize 3D parallax after DOM load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init3DParallax, 1000);
});

/* ============================================
   SIMPLE FAST CURSOR - No Animations
   ============================================ */
function initCursor() {
    const follower = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');
    
    if (!follower || !dot) return;
    
    // Hide on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        follower.style.display = 'none';
        dot.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    // Direct cursor positioning - no animation delay
    document.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        spawnParticle(e.clientX, e.clientY);
    }, { passive: true });

    // Throttled particle spawn for lightweight aura-like energy
    const spawnParticle = throttle((x, y) => {
        const p = document.createElement('div');
        p.className = 'cursor-particle';
        const size = Math.floor(Math.random() * 5) + 6; // 6-10px
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = x + (Math.random() * 4 - 2) + 'px'; // tiny random offset
        p.style.top = y + (Math.random() * 4 - 2) + 'px';
        p.style.opacity = '0.7';
        document.body.appendChild(p);
        setTimeout(() => {
            if (p && p.parentNode) p.parentNode.removeChild(p);
        }, 420); // short, gentle lifespan
    }, 120); // sparser spawn for minimal disturbance
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card-compact, .skill-card-compact, ' +
        '.hackathon-card-compact, .about-card-compact, .contact-box-compact, ' +
        '.nav-link, .page-dot, .theme-toggle, .nav-logo'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
        }, { passive: true });
        
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
        }, { passive: true });
    });
    
    // Click burst: subtle ripple + tiny sparks
    document.addEventListener('click', (e) => {
        // ripple
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => { if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 650);

        // sparks
        const sparks = [];
        const sparkCount = 5;
        for (let i = 0; i < sparkCount; i++) {
            const s = document.createElement('div');
            s.className = 'click-spark';
            const offsetX = Math.floor(Math.random() * 24) - 12; // -12..12
            const offsetY = Math.floor(Math.random() * 18) - 9; // -9..9
            s.style.left = (e.clientX + offsetX) + 'px';
            s.style.top = (e.clientY + offsetY) + 'px';
            const size = Math.floor(Math.random() * 3) + 3; // 3-5px
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            document.body.appendChild(s);
            sparks.push(s);
        }
        setTimeout(() => {
            sparks.forEach(s => { if (s && s.parentNode) s.parentNode.removeChild(s); });
        }, 420);
    }, { passive: true });
    
    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
        dot.style.opacity = '0';
    }, { passive: true });
    
    document.addEventListener('mouseenter', () => {
        follower.style.opacity = '0.6';
        dot.style.opacity = '1';
    }, { passive: true });
}

/* Custom SVG hand cursor: attach movement and click ripple (safe for pointer devices) */
/* custom cursor removed */

/* ============================================
   THEME TOGGLE - Light/Dark Mode with Smooth Transition
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Also listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
            }
        }
    });
}

function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.contains('light-mode');
    
    // Create creative transition effect
    createCreativeThemeTransition(!isLight);
}

// ============================================
// CREATIVE THEME TRANSITION - Multiple Effects
// ============================================
function createCreativeThemeTransition(toLight) {
    const themeToggle = document.querySelector('.theme-toggle');
    const rect = themeToggle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate max radius for full coverage
    const maxRadius = Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(window.innerWidth - centerX, centerY),
        Math.hypot(centerX, window.innerHeight - centerY),
        Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY)
    ) * 1.1;
    
    // === 1. Create main circular wipe overlay ===
    const mainOverlay = document.createElement('div');
    mainOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
        background: ${toLight ? '#f8fafc' : '#0a0a0f'};
        clip-path: circle(0px at ${centerX}px ${centerY}px);
    `;
    document.body.appendChild(mainOverlay);
    
    // === 2. Create glowing ring effect ===
    const glowRing = document.createElement('div');
    glowRing.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100000;
        box-shadow: 
            0 0 60px 30px ${toLight ? 'rgba(99, 102, 241, 0.5)' : 'rgba(6, 182, 212, 0.5)'},
            0 0 100px 60px ${toLight ? 'rgba(99, 102, 241, 0.3)' : 'rgba(6, 182, 212, 0.3)'},
            0 0 140px 90px ${toLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)'};
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(glowRing);
    
    // === 3. Create particle burst ===
    const particleCount = 16;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const size = 4 + Math.random() * 6;
        
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${toLight ? 'var(--primary)' : 'var(--accent)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 100001;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 ${size * 3}px ${toLight ? 'var(--primary)' : 'var(--accent)'};
        `;
        document.body.appendChild(particle);
        particles.push({ el: particle, angle });
    }
    
    // === 4. Create radial lines ===
    const lineCount = 8;
    const lines = [];
    
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        const angle = (i / lineCount) * 360;
        
        line.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, 
                ${toLight ? 'var(--primary)' : 'var(--accent)'} 0%, 
                transparent 100%);
            pointer-events: none;
            z-index: 100000;
            transform-origin: left center;
            transform: rotate(${angle}deg);
            opacity: 0.8;
        `;
        document.body.appendChild(line);
        lines.push(line);
    }
    
    // === ANIMATE EVERYTHING ===
    
    // Main circular wipe
    mainOverlay.animate([
        { clipPath: `circle(0px at ${centerX}px ${centerY}px)` },
        { clipPath: `circle(${maxRadius}px at ${centerX}px ${centerY}px)` }
    ], {
        duration: 700,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // Glow ring expansion
    glowRing.animate([
        { width: '0px', height: '0px', opacity: 1 },
        { width: `${maxRadius * 2}px`, height: `${maxRadius * 2}px`, opacity: 0 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    }).onfinish = () => glowRing.remove();
    
    // Radial lines shooting out
    lines.forEach((line, i) => {
        line.animate([
            { width: '0px', opacity: 0.8 },
            { width: `${maxRadius}px`, opacity: 0 }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards',
            delay: i * 20
        }).onfinish = () => line.remove();
    });
    
    // Particles shooting outward
    particles.forEach((p, i) => {
        const distance = maxRadius * 0.6;
        p.el.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(calc(-50% + ${Math.cos(p.angle) * distance}px), calc(-50% + ${Math.sin(p.angle) * distance}px)) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 600 + Math.random() * 200,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards',
            delay: 50 + i * 25
        }).onfinish = () => p.el.remove();
    });
    
    // Toggle theme class after animation starts
    setTimeout(() => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    }, 100);
    
    // Fade out and remove main overlay
    setTimeout(() => {
        mainOverlay.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => mainOverlay.remove();
    }, 500);
    
    // === 5. Add subtle screen flash ===
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99998;
        background: ${toLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)'};
        opacity: 0;
    `;
    document.body.appendChild(flash);
    
    flash.animate([
        { opacity: 0 },
        { opacity: 1 },
        { opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards'
    }).onfinish = () => flash.remove();
}

// Global function to toggle theme (can be called from anywhere)
window.toggleTheme = toggleTheme;

/* ============================================
   LIGHTWEIGHT STARFIELD BACKGROUND
   Optimized for low-end devices
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width, height;
    let animationId;
    
    // Performance: Limit star count based on screen size
    const getStarCount = () => Math.min(150, Math.floor((width * height) / 15000));
    
    // Star colors
    const colors = ['#ffffff', '#f0f5ff', '#fff5f0', '#e0e7ff', '#cffafe'];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createStars();
    }
    
    function createStars() {
        stars = [];
        const count = getStarCount();
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.6 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    // Throttled resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    }, { passive: true });
    
    // Animation with frame skip for performance
    let lastTime = 0;
    const targetFPS = 30; // Limit to 30fps for performance
    const frameInterval = 1000 / targetFPS;
    
    function animate(timestamp) {
        animationId = requestAnimationFrame(animate);
        
        // Frame rate limiting
        const delta = timestamp - lastTime;
        if (delta < frameInterval) return;
        lastTime = timestamp - (delta % frameInterval);
        
        // Clear canvas
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, width, height);
        
        // Draw all stars in a single batch
        const time = timestamp * 0.001;
        
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);
            const opacity = star.opacity + twinkle * 0.2;
            
            if (opacity > 0.1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = Math.min(1, Math.max(0.1, opacity));
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Initialize
    resize();
    animate(0);
    
    // Pause animation when tab is not visible (saves resources)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            lastTime = 0;
            animate(0);
        }
    }, { passive: true });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ============================================
   CARD ENTRANCE ANIMATIONS
   ============================================ */
function initCardAnimations() {
    // Initial animation for first card
    setTimeout(() => {
        animateCurrentCard();
    }, 1000);
    
    // Initialize liquid gradient hover effect
    initLiquidGradientCards();
}

/* ============================================
   CURSOR-TRACKED GRADIENT CARD HOVER
   Performance Optimized Version
   ============================================ */
function initLiquidGradientCards() {
    // Select all cards that should have the effect
    const cards = document.querySelectorAll(
        '.skill-card-compact, .project-card-compact, .about-card-compact, .hackathon-card-compact, .contact-box-compact'
    );
    
    cards.forEach(card => {
        // Direct update without animation loop - much faster
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--x', `${x}%`);
            card.style.setProperty('--y', `${y}%`);
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--x', '50%');
            card.style.setProperty('--y', '50%');
        }, { passive: true });
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const phrases = [
        'Code • Optimize • Deploy • Repeat',
        'Building Scalable Solutions',
        'Turning Ideas Into Reality',
        'Clean Code Advocate'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after initial delay
    setTimeout(type, 1500);
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function animateHero() {
    gsap.registerPlugin(TextPlugin);
    
    // Animate hero badge
    gsap.from('.hero-badge', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2
    });
    
    // Animate title lines
    gsap.from('.title-line', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        delay: 0.4
    });
    
    // Animate description
    gsap.from('.hero-description', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1
    });
    
    // Animate CTA buttons
    gsap.from('.hero-cta .btn', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        delay: 1.2
    });
    
    // Animate hero image
    gsap.from('.hero-image', {
        opacity: 0,
        x: 100,
        duration: 1,
        delay: 0.5
    });
    
    // Animate rotating badge
    gsap.from('.rotating-badge', {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 1,
        delay: 1
    });
    
    // Animate floating stars
    gsap.from('.floating-star', {
        opacity: 0,
        scale: 0,
        stagger: 0.2,
        duration: 0.5,
        delay: 1.2
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate skill cards
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            rotation: 5,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.9,
            duration: 0.7,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate about cards
    gsap.utils.toArray('.about-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate hackathon cards
    gsap.utils.toArray('.hackathon-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.6,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate CTA section
    gsap.from('.cta-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Text reveal animation for headings
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate skill tags
    gsap.utils.toArray('.skill-tags span').forEach((tag, i) => {
        gsap.from(tag, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            delay: i * 0.05,
            scrollTrigger: {
                trigger: tag.parentElement,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const navLinks = document.querySelector('.nav-links');
                if (hamburger && navLinks) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');
    
    if (!hamburger) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        
        // Create mobile menu if doesn't exist
        let mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <ul class="mobile-nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div class="mobile-contact">
                    <a href="tel:+919326786943"><i class="fas fa-phone"></i> +91 9326786943</a>
                    <a href="mailto:sahilrane132007@gmail.com"><i class="fas fa-envelope"></i> sahilrane132007@gmail.com</a>
                </div>
            `;
            document.querySelector('.navbar').appendChild(mobileMenu);
            
            // Add styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .mobile-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(10, 10, 15, 0.98);
                    backdrop-filter: blur(20px);
                    padding: 30px;
                    transform: translateY(-20px);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .mobile-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                .mobile-nav-links {
                    list-style: none;
                    margin-bottom: 30px;
                }
                .mobile-nav-links li {
                    margin-bottom: 15px;
                }
                .mobile-nav-links a {
                    font-size: 1.2rem;
                    color: var(--text-secondary);
                    transition: color 0.3s;
                }
                .mobile-nav-links a:hover {
                    color: var(--primary);
                }
                .mobile-contact {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .mobile-contact a {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-secondary);
                }
                .mobile-contact i {
                    color: var(--primary);
                }
                .hamburger.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }
                .hamburger.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
            `;
            document.head.appendChild(style);
        }
        
        mobileMenu.classList.toggle('active');
        
        // Close menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax for floating stars
    gsap.utils.toArray('.floating-star').forEach((star, i) => {
        gsap.to(star, {
            y: (i + 1) * -50,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
    
    // Parallax for hero image
    gsap.to('.hero-image', {
        y: 100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Scale effect on scroll for sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top center',
                scrub: 1
            }
        });
    });
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

/* ============================================
   MAGNETIC BUTTONS - Disabled for Performance
   ============================================ */
function initMagneticButtons() {
    // Disabled - causes lag on hover
    return;
}

/* ============================================
   3D TILT EFFECT - Disabled for Performance
   ============================================ */
function initTiltEffect() {
    // Disabled - causes lag on hover
    return;
}

/* ============================================
   REVEAL ON SCROLL (Fallback for data-aos)
   ============================================ */
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => observer.observe(el));
}

// Initialize reveal on scroll
document.addEventListener('DOMContentLoaded', initRevealOnScroll);

/* ============================================
   EASTER EGG - Konami Code
   ============================================ */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

/* ============================================
   PRELOAD IMAGES
   ============================================ */
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('data-src') || img.src;
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

// Call preload
preloadImages();

/* ============================================
   PAGE NAVIGATION SYSTEM (No Scrolling)
   ============================================ */
function initSmoothScroll() {
    const scrollableSections = document.querySelectorAll('.scrollable-section');
    
    scrollableSections.forEach(section => {
        // Skip pagination for contact section
        if (section.closest('#contact')) {
            return;
        }
        
        // Check if section has multiple subsections that can be paginated
        const hasMultipleSubsections = section.children.length > 3;
        
        if (!hasMultipleSubsections) return; // Skip if content fits in one page
        
        // Wrap sections in pages
        const children = Array.from(section.children);
        let currentPage = 1;
        const itemsPerPage = 2; // Show 2 major sections per page
        const totalPages = Math.ceil((children.length - 1) / itemsPerPage); // -1 for header
        
        if (totalPages <= 1) return; // No need for navigation
        
        // Create page wrappers
        const pages = [];
        let pageWrapper = document.createElement('div');
        pageWrapper.className = 'section-page active';
        
        // Always keep the first child (header) visible
        const header = children[0];
        section.appendChild(header);
        
        // Group remaining children into pages
        for (let i = 1; i < children.length; i++) {
            pageWrapper.appendChild(children[i]);
            
            if ((i - 1) % itemsPerPage === itemsPerPage - 1 || i === children.length - 1) {
                pages.push(pageWrapper);
                section.appendChild(pageWrapper);
                
                if (i < children.length - 1) {
                    pageWrapper = document.createElement('div');
                    pageWrapper.className = 'section-page';
                }
            }
        }
        
        // Create navigation controls
        const navContainer = document.createElement('div');
        navContainer.className = 'page-nav-arrows';
        navContainer.innerHTML = `
            <div class="page-nav-arrow prev-page">
                <i class="fas fa-chevron-up"></i>
            </div>
            <div class="page-nav-arrow next-page">
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        
        // Page indicators removed - no longer needed
        /*
        // Create page indicators
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'page-indicators';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = `page-indicator-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.page = i;
            indicatorsContainer.appendChild(dot);
        }
        */
        
        section.appendChild(navContainer);
        // section.appendChild(indicatorsContainer);
        
        // Navigation logic
        const prevBtn = navContainer.querySelector('.prev-page');
        const nextBtn = navContainer.querySelector('.next-page');
        // const dots = indicatorsContainer.querySelectorAll('.page-indicator-dot');
        
        function updatePage() {
            pages.forEach((page, index) => {
                page.classList.toggle('active', index === currentPage - 1);
            });
            
            /* dots removed
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage - 1);
            });
            */
            
            prevBtn.classList.toggle('disabled', currentPage === 1);
            nextBtn.classList.toggle('disabled', currentPage === totalPages);
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePage();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });
        
        // Page indicator dot clicks removed
        /*
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentPage = parseInt(dot.dataset.page) + 1;
                updatePage();
            });
        });
        */
        
        updatePage();
    });
}

// Animated Counter for GitHub Stats
function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-num[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
            
            // Add completion pulse effect
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Initialize stat counters
document.addEventListener('DOMContentLoaded', () => {
    animateStatCounters();
});

console.log('%c👋 Hello Developer!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c Built with ❤️ by Sahil Suresh Rane', 'font-size: 14px; color: #06b6d4;');
console.log('%c Code • Optimize • Deploy • Repeat', 'font-size: 12px; color: #a1a1aa;');
