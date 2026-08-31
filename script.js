/* ============================================
   PORTFOLIO - SAHIL SURESH RANE
   JavaScript - Animations & Interactions
   PERFORMANCE OPTIMIZED (Updated Aug 2, 2026)
   ============================================ */

// Global visited card tracker for reveal animations
const animatedCards = new Set();

// Performance: Throttle utility for smooth rendering
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

// Single Master Initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle MUST run first so body class is set before WebGL initialization
    initThemeToggle();
    initLoader();
    initCursor();
    initGalaxyBackground();
    initNavbar();
    initSmoothScroll();
    initTypingEffect();
    initCardAnimations();
    initScrollAnimations();
    initParallax();
    initMobileMenu();

    // Deferred initialization for optimal performance
    requestAnimationFrame(() => {
        animateStatCounters();
        initLiveContent();
        injectAdminPortalLink();
        updateGitHubStatsTheme();
        fetchLiveGitHubStats();
        initRevealOnScroll();
        animateHero();
        initSatelliteTelemetry();
        initFloatingAstronaut();
    });
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
        }, 600);
    });
}

// Global Smooth Scroll Helper
window.goToSection = function(target) {
    const sections = ['#home', '#skills', '#about', '#projects', '#achievements', '#contact'];
    let targetEl = null;

    if (typeof target === 'number') {
        const selector = sections[target] || sections[0];
        targetEl = document.querySelector(selector);
    } else if (typeof target === 'string') {
        targetEl = document.querySelector(target);
    }

    if (targetEl) {
        const offsetTop = targetEl.offsetTop - 75;
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
        });
    }
};

/* ============================================
   NAVBAR & SCROLL SPY ACTIVE TABS SYSTEM
   ============================================ */
function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    if (!sections.length || !navLinks.length) return;

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 75;
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // IntersectionObserver to auto-highlight active nav tab on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
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
    
    // Check for saved theme preference (defaults to dark mode on first visit)
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    if (window.updateGalaxyTheme) {
        window.updateGalaxyTheme();
    }
    
    themeToggle.addEventListener('click', () => {
        toggleTheme();
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
        updateGitHubStatsTheme();
        if (window.updateGalaxyTheme) window.updateGalaxyTheme();
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
   PHOTOREALISTIC 3D SPIRAL GALAXY & COSMIC NEBULA (THREE.JS WEBGL)
   - Layer 1: Distant Deep-Space Starfield
   - Layer 2: Volumetric Interstellar Dust & Cosmic Nebula Gas
   - Layer 3: Logarithmic 4-Arm Spiral Disk (Morgan-Keenan Spectral Star Colors)
   - Layer 4: Landmark Supergiant Flare Stars
   ============================================ */

// Soft radial star texture
function createGlowStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.15, 'rgba(235, 243, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(129, 140, 248, 0.45)');
    grad.addColorStop(0.8, 'rgba(6, 182, 212, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// Volumetric cosmic nebula gas texture
function createNebulaGasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.22)');
    grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function initGalaxyBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0, 3.6);

    const starTexture = createGlowStarTexture();
    const gasTexture = createNebulaGasTexture();

    // ─── 1. Deep Space Distant Starfield ───────────────────────
    const bgStarCount = 800;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgStarCount * 3);
    const bgCols = new Float32Array(bgStarCount * 3);

    for (let i = 0; i < bgStarCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 25 + Math.random() * 20;

        bgPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        bgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        bgPos[i * 3 + 2] = r * Math.cos(phi);

        const col = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.6, 0.7 + Math.random() * 0.3);
        bgCols[i * 3]     = col.r;
        bgCols[i * 3 + 1] = col.g;
        bgCols[i * 3 + 2] = col.b;
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCols, 3));

    const bgMat = new THREE.PointsMaterial({
        size: 0.025,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });
    const bgStarfield = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStarfield);

    // ─── 2. Volumetric Cosmic Nebula Gas Clouds ───────────────
    const gasCount = 350;
    const gasGeo = new THREE.BufferGeometry();
    const gasPos = new Float32Array(gasCount * 3);
    const gasCols = new Float32Array(gasCount * 3);

    const arms = 4;
    const radiusMax = 6.0;
    const spinFactor = 1.65;

    for (let i = 0; i < gasCount; i++) {
        const radius = Math.pow(Math.random(), 1.2) * radiusMax;
        const spinAngle = radius * spinFactor;
        const branchAngle = ((i % arms) * 2 * Math.PI) / arms;
        const spread = (Math.random() - 0.5) * (radius * 0.35 + 0.2);

        gasPos[i * 3]     = Math.cos(branchAngle + spinAngle) * radius + spread;
        gasPos[i * 3 + 1] = (Math.random() - 0.5) * (0.35 + radius * 0.08);
        gasPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + spread * 0.7;

        // Nebula colors: Violet core → Deep Indigo → Neon Teal tips
        const t = radius / radiusMax;
        const col = t < 0.3
            ? new THREE.Color(0xd8b4fe).lerp(new THREE.Color(0x818cf8), t / 0.3)
            : new THREE.Color(0x818cf8).lerp(new THREE.Color(0x06b6d4), (t - 0.3) / 0.7);

        gasCols[i * 3]     = col.r;
        gasCols[i * 3 + 1] = col.g;
        gasCols[i * 3 + 2] = col.b;
    }
    gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3));
    gasGeo.setAttribute('color', new THREE.BufferAttribute(gasCols, 3));

    const gasMat = new THREE.PointsMaterial({
        size: 0.38,
        map: gasTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const nebulaSystem = new THREE.Points(gasGeo, gasMat);
    nebulaSystem.rotation.x = 0.65;
    scene.add(nebulaSystem);

    // ─── 3. Main 4-Arm Logarithmic Spiral Star System ──────────
    const starCount = 3600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCols = new Float32Array(starCount * 3);

    // Realistic Spectral Stellar Temperatures
    const cCore   = new THREE.Color(0xffffff); // Nucleus White
    const cGold   = new THREE.Color(0xfef08a); // Warm Amber Core
    const cIndigo = new THREE.Color(0x818cf8); // Mid-Arm Indigo
    const cCyan   = new THREE.Color(0x38bdf8); // Outer Arm Cyan
    const cMagenta= new THREE.Color(0xf43f5e); // H-II Stellar Nursery Red

    for (let i = 0; i < starCount; i++) {
        let radius, spinAngle, branchAngle, spreadX, spreadY, spreadZ;

        if (i < starCount * 0.28) {
            // Central Galactic Bulge / Nucleus
            radius = Math.pow(Math.random(), 3.5) * 1.3;
            spinAngle = radius * spinFactor;
            branchAngle = Math.random() * Math.PI * 2;
            spreadX = (Math.random() - 0.5) * 0.28;
            spreadY = (Math.random() - 0.5) * 0.28;
            spreadZ = (Math.random() - 0.5) * 0.28;
        } else {
            // Logarithmic Spiral Arms
            radius = Math.pow(Math.random(), 1.3) * radiusMax;
            spinAngle = radius * spinFactor;
            branchAngle = ((i % arms) * 2 * Math.PI) / arms;

            const armSpread = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * (radius * 0.22 + 0.08);
            spreadX = armSpread;
            spreadY = Math.pow(Math.random() - 0.5, 3) * (0.2 + radius * 0.06);
            spreadZ = armSpread * 0.65;
        }

        starPos[i * 3]     = Math.cos(branchAngle + spinAngle) * radius + spreadX;
        starPos[i * 3 + 1] = spreadY;
        starPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + spreadZ;

        // Stellar Spectral Color Blend based on radius and stellar age
        let starColor;
        const normR = Math.min(1, radius / radiusMax);
        if (normR < 0.15) {
            starColor = cCore.clone().lerp(cGold, normR / 0.15);
        } else if (normR < 0.55) {
            starColor = cGold.clone().lerp(cIndigo, (normR - 0.15) / 0.4);
        } else if (normR < 0.85) {
            starColor = cIndigo.clone().lerp(cCyan, (normR - 0.55) / 0.3);
        } else {
            starColor = cCyan.clone().lerp(cMagenta, (normR - 0.85) / 0.15);
        }

        starCols[i * 3]     = starColor.r;
        starCols[i * 3 + 1] = starColor.g;
        starCols[i * 3 + 2] = starColor.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.045,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const galaxySystem = new THREE.Points(starGeo, starMat);
    galaxySystem.rotation.x = 0.65;
    scene.add(galaxySystem);

    // ─── Dynamic Dual-Mode Theme Adapter (Dark & Light Mode Galaxy) ───
    function updateGalaxyTheme() {
        const isLight = document.body.classList.contains('light-mode');

        if (isLight) {
            starMat.blending = THREE.NormalBlending;
            starMat.opacity = 0.92;
            gasMat.blending = THREE.NormalBlending;
            gasMat.opacity = 0.32;
            bgMat.opacity = 0.75;

            // Vibrant Light-Theme Cosmic Palette (Royal Indigo -> Violet -> Sapphire -> Ocean Cyan -> Orchid Pink)
            const lcCore   = new THREE.Color(0x4f46e5); // Royal Indigo Core
            const lcViolet = new THREE.Color(0x7c3aed); // Luminous Violet
            const lcBlue   = new THREE.Color(0x2563eb); // Sapphire Blue
            const lcCyan   = new THREE.Color(0x0284c7); // Ocean Cyan
            const lcOrchid = new THREE.Color(0xd946ef); // Orchid Pink Arm Tips

            for (let i = 0; i < starCount; i++) {
                const normR = Math.min(1, Math.hypot(starPos[i * 3], starPos[i * 3 + 2]) / radiusMax);
                let col;
                if (normR < 0.15) col = lcCore.clone().lerp(lcViolet, normR / 0.15);
                else if (normR < 0.5) col = lcViolet.clone().lerp(lcBlue, (normR - 0.15) / 0.35);
                else if (normR < 0.8) col = lcBlue.clone().lerp(lcCyan, (normR - 0.5) / 0.3);
                else col = lcCyan.clone().lerp(lcOrchid, (normR - 0.8) / 0.2);

                starCols[i * 3]     = col.r;
                starCols[i * 3 + 1] = col.g;
                starCols[i * 3 + 2] = col.b;
            }
            starGeo.attributes.color.needsUpdate = true;

            // Cosmic Gas Cloud Colors: Luminous Violet -> Sapphire -> Ocean Cyan
            for (let i = 0; i < gasCount; i++) {
                const normR = Math.min(1, Math.hypot(gasPos[i * 3], gasPos[i * 3 + 2]) / radiusMax);
                const col = normR < 0.4
                    ? lcViolet.clone().lerp(lcBlue, normR / 0.4)
                    : lcBlue.clone().lerp(lcCyan, (normR - 0.4) / 0.6);

                gasCols[i * 3]     = col.r;
                gasCols[i * 3 + 1] = col.g;
                gasCols[i * 3 + 2] = col.b;
            }
            gasGeo.attributes.color.needsUpdate = true;

            // Background Stars: Deep Sapphire Blue in Light Mode
            for (let i = 0; i < bgStarCount; i++) {
                bgCols[i * 3]     = 0.14; // 0x25 / 255
                bgCols[i * 3 + 1] = 0.38; // 0x63 / 255
                bgCols[i * 3 + 2] = 0.92; // 0xeb / 255
            }
            bgGeo.attributes.color.needsUpdate = true;

        } else {
            starMat.blending = THREE.AdditiveBlending;
            starMat.opacity = 0.95;
            gasMat.blending = THREE.AdditiveBlending;
            gasMat.opacity = 0.25;
            bgMat.opacity = 0.6;

            for (let i = 0; i < starCount; i++) {
                const normR = Math.min(1, Math.hypot(starPos[i * 3], starPos[i * 3 + 2]) / radiusMax);
                let col;
                if (normR < 0.15) col = cCore.clone().lerp(cGold, normR / 0.15);
                else if (normR < 0.55) col = cGold.clone().lerp(cIndigo, (normR - 0.15) / 0.4);
                else if (normR < 0.85) col = cIndigo.clone().lerp(cCyan, (normR - 0.55) / 0.3);
                else col = cCyan.clone().lerp(cMagenta, (normR - 0.85) / 0.15);

                starCols[i * 3]     = col.r;
                starCols[i * 3 + 1] = col.g;
                starCols[i * 3 + 2] = col.b;
            }
            starGeo.attributes.color.needsUpdate = true;

            for (let i = 0; i < gasCount; i++) {
                const normR = Math.min(1, Math.hypot(gasPos[i * 3], gasPos[i * 3 + 2]) / radiusMax);
                const col = normR < 0.3
                    ? new THREE.Color(0xd8b4fe).lerp(new THREE.Color(0x818cf8), normR / 0.3)
                    : new THREE.Color(0x818cf8).lerp(new THREE.Color(0x06b6d4), (normR - 0.3) / 0.7);

                gasCols[i * 3]     = col.r;
                gasCols[i * 3 + 1] = col.g;
                gasCols[i * 3 + 2] = col.b;
            }
            gasGeo.attributes.color.needsUpdate = true;

            for (let i = 0; i < bgStarCount; i++) {
                const col = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.6, 0.7 + Math.random() * 0.3);
                bgCols[i * 3]     = col.r;
                bgCols[i * 3 + 1] = col.g;
                bgCols[i * 3 + 2] = col.b;
            }
            bgGeo.attributes.color.needsUpdate = true;
        }

        starMat.needsUpdate = true;
        gasMat.needsUpdate = true;
        bgMat.needsUpdate = true;
    }

    window.updateGalaxyTheme = updateGalaxyTheme;
    updateGalaxyTheme();
    renderer.render(scene, camera);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // Scroll Integration: Realistic Orbital Swirl & Depth Shift
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const onScroll = () => {
        const totalScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        targetScrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Animation Loop
    const clock = new THREE.Clock();
    let animationId;
    let isTabVisible = true;

    function animate() {
        if (!isTabVisible) return;
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth scroll interpolation
        currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

        // Continuous Realistic Orbital Rotation & Scroll Dynamics
        const rotY = elapsedTime * 0.05 + currentScrollProgress * Math.PI * 2.5;
        const rotX = 0.65 + Math.sin(elapsedTime * 0.25) * 0.04 + currentScrollProgress * 0.3;
        const rotZ = Math.cos(elapsedTime * 0.2) * 0.03 + currentScrollProgress * 0.2;

        galaxySystem.rotation.y = rotY;
        galaxySystem.rotation.x = rotX;
        galaxySystem.rotation.z = rotZ;

        nebulaSystem.rotation.y = rotY;
        nebulaSystem.rotation.x = rotX;
        nebulaSystem.rotation.z = rotZ;

        bgStarfield.rotation.y = elapsedTime * 0.005;

        // 3D Camera Depth Movement
        camera.position.z = 3.6 + currentScrollProgress * 1.6;

        // Mouse Parallax
        galaxySystem.rotation.y += (mouseX * 0.3 - (galaxySystem.rotation.y % 0.1)) * 0.04;
        galaxySystem.rotation.x += (-mouseY * 0.3 - (galaxySystem.rotation.x % 0.1)) * 0.04;

        renderer.render(scene, camera);
    }

    animate();

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isTabVisible = false;
            if (animationId) cancelAnimationFrame(animationId);
        } else {
            isTabVisible = true;
            animate();
        }
    }, { passive: true });

    // Fluid resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 100);
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
                const hamburger = document.querySelector('.nav-toggle');
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
    const hamburger = document.querySelector('.nav-toggle');
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
                .nav-toggle.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                .nav-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                .nav-toggle.active span:nth-child(3) {
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

console.log('%c👋 Hello Developer!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c Built with ❤️ by Sahil Suresh Rane', 'font-size: 14px; color: #06b6d4;');
console.log('%c Code • Optimize • Deploy • Repeat', 'font-size: 12px; color: #a1a1aa;');

/* ============================================
   LIVE CONTENT ENGINE
   Fetches dynamic content from /api/content
   and hydrates the portfolio sections.
   Fully graceful: no errors if API is offline.
   ============================================ */
async function initLiveContent() {
    try {
        const res = await fetch('/api/content', { credentials: 'include' });
        if (!res.ok) return;
        const { content } = await res.json();
        if (!content) return;

        // ── Inject live certificate cards ───────────────
        const certs = content.certificates;
        if (Array.isArray(certs) && certs.length) {
            injectCertificateCards(certs);
        }

        // ── Hydrate Hero text (if admin has saved overrides) ─
        if (content.hero) {
            const h = content.hero;
            const lines = document.querySelectorAll('.hero-title .title-line');
            if (h.heading  && lines[0]) lines[0].textContent = h.heading;
            if (h.heading2 && lines[1]) lines[1].textContent = h.heading2;
            if (h.description) {
                const desc = document.querySelector('.hero-description');
                if (desc) desc.textContent = h.description;
            }
        }

        // ── Hydrate About blurbs ────────────────────────
        if (content.about) {
            const a = content.about;
            const aboutCards = document.querySelectorAll('.about-card-compact p');
            if (a.who     && aboutCards[0]) aboutCards[0].textContent = a.who;
            if (a.excites && aboutCards[1]) aboutCards[1].textContent = a.excites;
            if (a.focus   && aboutCards[3]) aboutCards[3].textContent = a.focus;
        }

    } catch (_) {
        // Silently fail if API is unreachable (local dev without backend)
    }
}

function injectCertificateCards(certs) {
    const achievementsCard = document.querySelector('#achievements');
    if (!achievementsCard) return;

    const container = achievementsCard.querySelector('.scrollable-section') || achievementsCard.querySelector('.card-content');
    if (!container) return;

    // Remove any previously injected cert section
    const existingBlock = document.getElementById('cert-section-block');
    if (existingBlock) existingBlock.remove();

    // Build the certificate section block
    const certBlock = document.createElement('div');
    certBlock.id = 'cert-section-block';
    certBlock.style.marginTop = '2.5rem';
    certBlock.innerHTML = `
        <div class="section-divider"></div>
        <div class="section-header-compact" style="margin-top:2rem;">
            <h3 class="subsection-title">Certificates & <span class="highlight">Credentials</span></h3>
        </div>
        <div id="live-cert-row" class="live-cert-grid"></div>
    `;

    container.appendChild(certBlock);

    const certRow = certBlock.querySelector('#live-cert-row');

    certs.forEach((cert, idx) => {
        const card = document.createElement('div');
        card.className = 'cert-card-live';
        card.setAttribute('data-cert-idx', idx);

        const hasImage = cert.viewUrl;
        const aspectPadding = cert.aspectRatio
            ? (100 / cert.aspectRatio).toFixed(2) + '%'
            : '66.67%';

        card.innerHTML = `
            <div class="cert-card-live-thumb" style="padding-top:${aspectPadding}">
                ${hasImage
                    ? `<img src="${escapeAttr(cert.viewUrl)}" alt="${escapeHtml(cert.title)}" loading="lazy">`
                    : `<div class="cert-thumb-icon"><i class="fas fa-certificate"></i></div>`
                }
            </div>
            <div class="cert-card-live-body">
                <h4>${escapeHtml(cert.title)}</h4>
                <p class="cert-issuer">${escapeHtml(cert.issuer)}</p>
                <p class="cert-date">${escapeHtml(cert.date || '')}</p>
                ${hasImage
                    ? `<button class="cert-view-btn" data-cert-idx="${idx}" aria-label="View ${escapeAttr(cert.title)} certificate">
                        <i class="fas fa-expand"></i> View
                       </button>`
                    : ''
                }
            </div>
        `;
        certRow.appendChild(card);
    });

    // Attach lightbox triggers
    certRow.querySelectorAll('.cert-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = +btn.dataset.certIdx;
            openCertLightbox(certs[idx]);
        });
    });

    // Card click also opens lightbox
    certRow.querySelectorAll('.cert-card-live').forEach(card => {
        card.addEventListener('click', () => {
            const idx = +card.dataset.certIdx;
            if (certs[idx]?.viewUrl) openCertLightbox(certs[idx]);
        });
    });

    // Animate in cert cards
    gsap.fromTo('.cert-card-live',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
}

/* ─── Certificate Lightbox ───────────────────────────────── */
function openCertLightbox(cert) {
    if (!cert?.viewUrl) return;

    // Remove any existing lightbox
    const existing = document.getElementById('cert-lightbox');
    if (existing) existing.remove();

    const lb = document.createElement('div');
    lb.id = 'cert-lightbox';
    lb.className = 'cert-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', cert.title);
    lb.innerHTML = `
        <div class="cert-lightbox-backdrop"></div>
        <div class="cert-lightbox-inner">
            <button class="cert-lightbox-close" aria-label="Close lightbox">
                <i class="fas fa-xmark"></i>
            </button>
            <div class="cert-lightbox-img-wrap">
                <img src="${escapeAttr(cert.viewUrl)}" alt="${escapeHtml(cert.title)}" loading="lazy">
            </div>
            <div class="cert-lightbox-meta">
                <strong>${escapeHtml(cert.title)}</strong>
                <span>${escapeHtml(cert.issuer)}${cert.date ? ' · ' + escapeHtml(cert.date) : ''}</span>
            </div>
        </div>
    `;

    document.body.appendChild(lb);

    // Animate open
    gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(lb.querySelector('.cert-lightbox-inner'),
        { scale: 0.9, y: 20 },
        { scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
    );

    // Close triggers
    const close = () => {
        gsap.to(lb, {
            opacity: 0, duration: 0.2, ease: 'power2.in',
            onComplete: () => lb.remove()
        });
    };
    lb.querySelector('.cert-lightbox-close').addEventListener('click', close);
    lb.querySelector('.cert-lightbox-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
    });
}

/* ─── Admin Portal Link (subtle, bottom-right) ────────────── */
function injectAdminPortalLink() {
    // Keyboard shortcut: Ctrl + Shift + CapsLock to open admin portal
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'CapsLock') {
            e.preventDefault();
            window.location.href = '/admin.html';
        }
    });
}

/* ─── HTML escape helpers ───────────────────────────────── */
function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escapeAttr(str) {
    return String(str || '').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ============================================
   ANIMATED NUMERIC STAT COUNTERS
   ============================================ */
function animateStatCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
                if (isNaN(target) || target <= 0) {
                    entry.target.textContent = '0';
                    return;
                }

                const duration = 1800; // ms
                const start = 0;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentCount = Math.floor(start + easeProgress * (target - start));
                    entry.target.textContent = currentCount.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = target.toLocaleString();
                    }
                };

                requestAnimationFrame(updateCount);
            }
        });
    }, { threshold: 0.1 });

    statNums.forEach(num => observer.observe(num));
}

/* ============================================
   LIVE GITHUB STATS & REPO HYDRATION
   ============================================ */
async function fetchLiveGitHubStats() {
    const username = 'CyberCodezilla';
    const repoNumEl   = document.querySelector('.github-stats-compact .stat-box:nth-child(1) .stat-num');
    const commitNumEl = document.querySelector('.github-stats-compact .stat-box:nth-child(2) .stat-num');
    const starNumEl   = document.querySelector('.github-stats-compact .stat-box:nth-child(3) .stat-num');
    const prNumEl     = document.querySelector('.github-stats-compact .stat-box:nth-child(4) .stat-num');

    let langCounts = {};
    let repoCount = 0, commitCount = 0, starCount = 0, prCount = 0;

    try {
        // 1. Fetch Profile (Public Repos)
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (profileRes.ok) {
            const profile = await profileRes.json();
            if (profile.public_repos !== undefined) {
                repoCount = profile.public_repos;
                if (repoNumEl) repoNumEl.setAttribute('data-target', repoCount);
            }
        }

        // 2. Fetch Repos List (Total Stars & Languages)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (reposRes.ok) {
            const repos = await reposRes.json();
            if (Array.isArray(repos)) {
                repos.forEach(repo => {
                    starCount += (repo.stargazers_count || 0);
                    if (repo.language) {
                        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                    }
                });

                if (starNumEl) {
                    starNumEl.setAttribute('data-target', Math.max(starCount, 1));
                }
            }
        }

        // 3. Fetch Total Commits Count via GitHub Search API
        const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${username}`);
        if (commitRes.ok) {
            const commitsData = await commitRes.json();
            if (commitsData.total_count !== undefined) {
                commitCount = commitsData.total_count;
                if (commitNumEl) commitNumEl.setAttribute('data-target', commitCount);
            }
        }

        // 4. Fetch Total Pull Requests Count via GitHub Search API
        const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
        if (prRes.ok) {
            const prData = await prRes.json();
            if (prData.total_count !== undefined) {
                prCount = prData.total_count;
                if (prNumEl) prNumEl.setAttribute('data-target', prCount);
            }
        }

    } catch (err) {
        console.warn('GitHub API live fetch fallback active:', err);
    } finally {
        // Trigger smooth counter animation
        const countedElements = document.querySelectorAll('.stat-num');
        countedElements.forEach(el => el.classList.remove('counted'));
        animateStatCounters();

        // Store data and render all canvas charts
        _githubChartData = { langCounts, repos: repoCount, commits: commitCount, stars: starCount, prs: prCount };

        // Render contribution heatmap (fetches its own event data)
        renderContributionHeatmap(username);

        // Render animated donut chart
        renderLangDonutChart(langCounts);

        // Render performance radar chart
        renderPerfRadarChart(_githubChartData);
    }
}

/* ─── Canvas-based Dynamic GitHub Chart Renderers ─── */

// ── Shared Language Color Palette ──
const LANG_COLORS = {
    'TypeScript': '#3178c6', 'JavaScript': '#f7df1e', 'Python': '#3572A5',
    'Java': '#b07219', 'C++': '#f34b7d', 'C': '#555555', 'C#': '#178600',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Go': '#00ADD8', 'Rust': '#dea584',
    'Ruby': '#701516', 'PHP': '#4F5D95', 'Shell': '#89e051', 'Kotlin': '#A97BFF',
    'Swift': '#F05138', 'Dart': '#00B4AB', 'Scala': '#c22d40', 'Lua': '#000080',
    'Vue': '#41b883', 'Svelte': '#ff3e00', 'SCSS': '#c6538c', 'Jupyter Notebook': '#DA5B0B'
};
function getLangColor(lang) { return LANG_COLORS[lang] || '#6366f1'; }

// Store fetched data for chart rendering
let _githubChartData = { langCounts: {}, repos: 0, commits: 0, stars: 0, prs: 0 };

// ── 1. CONTRIBUTION HEATMAP (Full year, real GitHub data with levels 0-4) ──
async function renderContributionHeatmap(username) {
    const canvas = document.getElementById('contribution-heatmap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fetch real contribution data (date + level 0-4) from GitHub
    let contributions = {}; // { "2025-08-01": level (0-4) }
    let liveEventCounts = {}; // Real-time fallback/supplement from GitHub Events API

    // 1. Fetch live events for instant real-time data
    try {
        const pages = [1, 2, 3, 4, 5];
        const fetches = pages.map(p =>
            fetch(`https://api.github.com/users/${username}/events?per_page=30&page=${p}`)
                .then(r => r.ok ? r.json() : []).catch(() => [])
        );
        const allPages = await Promise.all(fetches);
        allPages.flat().forEach(evt => {
            if (evt.created_at) {
                const day = evt.created_at.slice(0, 10);
                liveEventCounts[day] = (liveEventCounts[day] || 0) + 1;
            }
        });
    } catch(e) { /* silent fallback */ }

    // 2. Fetch full-year level data from Contributions API
    try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (res.ok) {
            const data = await res.json();
            if (data.contributions && Array.isArray(data.contributions)) {
                data.contributions.forEach(c => {
                    contributions[c.date] = c.level; // 0-4
                });
            }
        }
    } catch(e) { /* silent fallback */ }

    // 3. Merge: If contributions API returns level 0 for recent active days, overlay live event levels
    Object.keys(liveEventCounts).forEach(day => {
        const evtCount = liveEventCounts[day];
        let calculatedLevel = 1;
        if (evtCount >= 6) calculatedLevel = 4;
        else if (evtCount >= 4) calculatedLevel = 3;
        else if (evtCount >= 2) calculatedLevel = 2;

        if (!contributions[day] || contributions[day] < calculatedLevel) {
            contributions[day] = calculatedLevel;
        }
    });

    // Format YYYY-MM-DD in local time
    function formatLocalDate(d) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // Rolling 52-week grid (364 days sliding window)
    const WEEKS = 52;
    const DAYS = 7;
    const today = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dayLabels = ['','Mon','','Wed','','Fri',''];

    // Dynamically size cells to fill card width + right padding for month label overflow
    const dpr = window.devicePixelRatio || 1;
    const containerW = canvas.parentElement.getBoundingClientRect().width;
    const labelW = 28;
    const gap = 2;
    const rightPadding = 26; // Extra room for month text on rightmost columns (e.g. Aug)
    const cellSize = Math.max(3, Math.floor((containerW - labelW - rightPadding - 4) / WEEKS - gap));
    const monthHeaderH = 16;
    const totalW = labelW + WEEKS * (cellSize + gap) + rightPadding;
    const totalH = monthHeaderH + DAYS * (cellSize + gap) + 4;

    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = totalW + 'px';
    canvas.style.height = totalH + 'px';
    ctx.scale(dpr, dpr);

    // Calculate rolling start date (52 weeks before today, Sunday aligned)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // Purple color scale matching GitHub's 5 levels (0-4)
    const colorByLevel = [
        'rgba(30, 30, 50, 0.45)',  // Level 0 — no activity
        '#312e81',                   // Level 1 — light
        '#4f46e5',                   // Level 2 — medium
        '#818cf8',                   // Level 3 — active
        '#c4b5fd',                   // Level 4 — very active
    ];

    function getCellColor(dateStr) {
        const level = contributions[dateStr] || 0;
        return colorByLevel[Math.min(level, 4)];
    }

    // Draw month labels dynamically above the column where each month starts
    ctx.fillStyle = '#94a3b8';
    ctx.font = `${Math.max(9, cellSize + 1)}px JetBrains Mono, monospace`;
    ctx.textBaseline = 'top';
    let lastMonth = -1;
    let lastLabelX = -100;

    for (let w = 0; w < WEEKS; w++) {
        // Check if any day in this week is the 1st of a month, or if it's week 0
        for (let d = 0; d < DAYS; d++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(cellDate.getDate() + w * 7 + d);
            const m = cellDate.getMonth();

            if ((m !== lastMonth && (cellDate.getDate() === 1 || cellDate.getDate() <= 7 || w === 0))) {
                const x = labelW + w * (cellSize + gap);
                if (x - lastLabelX >= 22) {
                    lastMonth = m;
                    lastLabelX = x;
                    ctx.fillText(monthNames[m], x, 0);
                }
                break;
            }
        }
    }

    // Draw day labels (Mon, Wed, Fri)
    ctx.fillStyle = '#64748b';
    ctx.font = `${Math.max(7, cellSize - 1)}px JetBrains Mono, monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    for (let d = 0; d < DAYS; d++) {
        if (dayLabels[d]) {
            const y = monthHeaderH + d * (cellSize + gap) + cellSize / 2;
            ctx.fillText(dayLabels[d], labelW - 4, y);
        }
    }
    ctx.textAlign = 'left';

    // Draw cells with staggered animation
    let cellIndex = 0;
    for (let w = 0; w < WEEKS; w++) {
        for (let d = 0; d < DAYS; d++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(cellDate.getDate() + w * 7 + d);
            if (cellDate > todayEnd) continue; // Future days remain undrawn
            const dateStr = formatLocalDate(cellDate);
            const x = labelW + w * (cellSize + gap);
            const y = monthHeaderH + d * (cellSize + gap);

            const idx = cellIndex++;
            setTimeout(() => {
                ctx.beginPath();
                ctx.roundRect(x, y, cellSize, cellSize, Math.max(1, cellSize / 5));
                ctx.fillStyle = getCellColor(dateStr);
                ctx.fill();
            }, idx * 1.5);
        }
    }

    // Render legend
    const legendEl = document.getElementById('heatmap-legend');
    if (legendEl) {
        legendEl.innerHTML = `
            <span>Less</span>
            ${colorByLevel.map(c => `<span class="hm-swatch" style="background:${c}"></span>`).join('')}
            <span>More</span>
        `;
    }
}

// ── 2. ANIMATED DONUT CHART (Languages) ──
function renderLangDonutChart(langCounts) {
    const canvas = document.getElementById('lang-donut-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const total = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!sorted.length) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const outerR = 110, innerR = 65;

    // Animate sweep
    let animProgress = 0;
    function drawFrame() {
        animProgress = Math.min(animProgress + 0.025, 1);
        ctx.clearRect(0, 0, size, size);

        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgba(30, 30, 50, 0.4)';
        ctx.fill();

        let startAngle = -Math.PI / 2;
        const sweepEnd = animProgress * Math.PI * 2;

        sorted.forEach(([lang, count]) => {
            const sliceAngle = (count / total) * Math.PI * 2;
            const drawAngle = Math.min(sliceAngle, Math.max(0, sweepEnd - (startAngle + Math.PI / 2)));
            if (drawAngle > 0) {
                ctx.beginPath();
                ctx.arc(cx, cy, outerR, startAngle, startAngle + drawAngle);
                ctx.arc(cx, cy, innerR, startAngle + drawAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = getLangColor(lang);
                ctx.fill();

                // Subtle glow
                ctx.shadowColor = getLangColor(lang);
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            startAngle += sliceAngle;
        });

        // Center text
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sorted.length, cx, cy - 8);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText('languages', cx, cy + 12);

        if (animProgress < 1) requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Legend
    const legendEl = document.getElementById('lang-legend');
    if (legendEl) {
        legendEl.innerHTML = sorted.map(([lang, count]) => {
            const pct = Math.round((count / total) * 100);
            return `<div class="lang-item">
                <span class="lang-dot" style="background:${getLangColor(lang)}"></span>
                <span>${lang}</span>
                <span class="lang-pct">${pct}%</span>
            </div>`;
        }).join('');
    }
}

// ── 3. ANIMATED RADAR CHART (Performance Metrics) ──
function renderPerfRadarChart(data) {
    const canvas = document.getElementById('perf-radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const maxR = 100;

    // Metrics: normalize each to 0-1 range with sensible caps
    const metrics = [
        { label: 'Repos', value: data.repos, max: 80, icon: '📦' },
        { label: 'Commits', value: data.commits, max: 1500, icon: '🔥' },
        { label: 'Stars', value: data.stars, max: 50, icon: '⭐' },
        { label: 'PRs', value: data.prs, max: 50, icon: '🔀' },
        { label: 'Languages', value: Object.keys(data.langCounts).length, max: 15, icon: '🌐' },
    ];
    const n = metrics.length;
    const angleStep = (Math.PI * 2) / n;

    // Animate growth
    let animProgress = 0;
    function drawFrame() {
        animProgress = Math.min(animProgress + 0.02, 1);
        ctx.clearRect(0, 0, size, size);

        // Draw concentric grid rings
        for (let ring = 1; ring <= 4; ring++) {
            const r = (ring / 4) * maxR;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axis lines
        for (let i = 0; i < n; i++) {
            const angle = i * angleStep - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw data polygon (animated)
        ctx.beginPath();
        metrics.forEach((m, i) => {
            const norm = Math.min(m.value / m.max, 1) * animProgress;
            const r = norm * maxR;
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();

        // Fill with gradient
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points
        metrics.forEach((m, i) => {
            const norm = Math.min(m.value / m.max, 1) * animProgress;
            const r = norm * maxR;
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#a78bfa';
            ctx.fill();
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // Axis labels
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        metrics.forEach((m, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelR = maxR + 22;
            const x = cx + Math.cos(angle) * labelR;
            const y = cy + Math.sin(angle) * labelR;
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '11px Outfit, sans-serif';
            ctx.fillText(m.label, x, y);
        });

        if (animProgress < 1) requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Labels below
    const labelsEl = document.getElementById('perf-labels');
    if (labelsEl) {
        labelsEl.innerHTML = metrics.map(m =>
            `<div class="perf-item">
                <span>${m.icon}</span>
                <span>${m.label}</span>
                <span class="perf-val">${m.value.toLocaleString()}</span>
            </div>`
        ).join('');
    }
}

// ── Theme updater (no longer needs image src swaps) ──
function updateGitHubStatsTheme() {
    // Charts are canvas-based, no theme image swaps needed
}

// Synchronize layout positions dynamically on device resize or shift
let debounceTimer;
window.addEventListener("resize", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        renderContributionHeatmap('CyberCodezilla');
    }, 200); 
});

/* ============================================
   ZERO-G SPACE DRIFT & SCROLL-DRIVEN SATELLITE ENGINE
   ============================================ */
function initSatelliteTelemetry() {
  const satellite = document.getElementById('anime-satellite');
  const aboutSection = document.querySelector('.about-satellite-section');
  const satTabs = document.querySelectorAll('.sat-tab');
  const satContents = document.querySelectorAll('.sat-content');

  if (!satellite || !aboutSection) return;

  let currentX = -450;
  let currentY = 0;
  let currentRot = -10;

  let targetX = 0;
  let targetY = 0;
  let targetRot = 0;

  let mouseX = 0;
  let mouseY = 0;

  // Subtle Mouse Parallax Accent
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 35;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 25;
  }, { passive: true });

  // 60FPS Space Float & Scroll Trajectory Engine (100% Scoped within About Me section)
  function animateSatellite() {
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate scroll progress strictly within about section
    let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
    progress = Math.min(Math.max(progress, 0), 1);

    // 1. Outer Margin Trajectory: Passes quickly above top of tabs (-52vw, -130px) -> Glides to Outer Right Margin (+52vw, -40px)
    const startX = -window.innerWidth * 0.52;
    const endX = window.innerWidth * 0.52;
    const scrollX = lerp(startX, endX, progress);

    const startY = -130;
    const endY = -40;
    const scrollY = lerp(startY, endY, progress);

    const scrollRot = -10 + progress * 28;

    // 2. Realistic Zero-G Space Micro-Drift (random sinusoidal space wobble)
    const time = performance.now() * 0.001;
    const driftX = Math.sin(time * 0.9) * 20 + Math.cos(time * 1.5) * 10;
    const driftY = Math.cos(time * 1.1) * 15 + Math.sin(time * 1.8) * 8;
    const driftRot = Math.sin(time * 0.7) * 5;

    targetX = scrollX + driftX + mouseX;
    targetY = scrollY + driftY + mouseY;
    targetRot = scrollRot + driftRot;

    // Smooth lerp interpolation for buttery-smooth rendering
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    currentRot = lerp(currentRot, targetRot, 0.08);

    // 3D Perspective Pitch, Yaw & Roll
    const rotX = Math.sin(time * 0.6) * 10 + (mouseY / 25) * 8;
    const rotY = -22 + progress * 44 + (mouseX / 35) * 12;

    satellite.style.transform = `perspective(1200px) translate3d(calc(-50% + ${currentX.toFixed(2)}px), ${currentY.toFixed(2)}px, 0px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${currentRot.toFixed(2)}deg)`;

    requestAnimationFrame(animateSatellite);
  }

  requestAnimationFrame(animateSatellite);

  // Tab Click: Fire Signal Transmission Waves & Decode Content
  satTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Update active states
      satTabs.forEach(t => t.classList.remove('active'));
      satContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      
      // Trigger Telemetry Pulse Wave Animation on Satellite
      satellite.classList.add('transmitting');
      setTimeout(() => satellite.classList.remove('transmitting'), 1200);

      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ============================================
   FLOATING ASTRONAUT ZERO-G DRIFT ENGINE
   (Right-to-Left across Projects -> GitHub Stats)
   ============================================ */
function initFloatingAstronaut() {
  const astronaut = document.getElementById('floating-astronaut');
  const projectsSection = document.getElementById('projects');

  if (!astronaut || !projectsSection) return;

  let aCurrentX = window.innerWidth * 0.48;
  let aCurrentY = -80;
  let aCurrentRot = 15;

  let aTargetX = 0;
  let aTargetY = 0;
  let aTargetRot = 0;

  let aMouseX = 0;
  let aMouseY = 0;

  // Subtle Mouse Parallax
  window.addEventListener('mousemove', (e) => {
    aMouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    aMouseY = (e.clientY / window.innerHeight - 0.5) * 20;
  }, { passive: true });

  // 60FPS Astronaut Float & Scroll Trajectory (RIGHT to LEFT, opposite of satellite)
  function animateAstronaut() {
    const rect = projectsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Scroll progress scoped within #projects section
    let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
    progress = Math.min(Math.max(progress, 0), 1);

    // 1. RIGHT-to-LEFT outer margin trajectory: Starts Outer Right (+54vw, 380px) -> Ends Outer Bottom-Left (-54vw, +720px)
    const startX = window.innerWidth * 0.54;
    const endX = -window.innerWidth * 0.54;
    const scrollX = lerp(startX, endX, progress);

    const startY = 380;
    const endY = 720;
    const scrollY = lerp(startY, endY, progress);

    const scrollRot = 15 - progress * 30;

    // 2. Realistic Zero-G Space Float (different frequencies from satellite for variety)
    const time = performance.now() * 0.001;
    const driftX = Math.sin(time * 0.7) * 18 + Math.cos(time * 1.3) * 9;
    const driftY = Math.cos(time * 0.8) * 14 + Math.sin(time * 1.5) * 7;
    const driftRot = Math.sin(time * 0.5) * 6;

    aTargetX = scrollX + driftX + aMouseX;
    aTargetY = scrollY + driftY + aMouseY;
    aTargetRot = scrollRot + driftRot;

    // Smooth lerp interpolation
    aCurrentX = lerp(aCurrentX, aTargetX, 0.06);
    aCurrentY = lerp(aCurrentY, aTargetY, 0.06);
    aCurrentRot = lerp(aCurrentRot, aTargetRot, 0.06);

    // 3D Perspective Pitch, Yaw & Roll (tumbling astronaut)
    const rotX = Math.sin(time * 0.45) * 14 + (aMouseY / 20) * 6;
    const rotY = 18 - progress * 36 + (aMouseX / 30) * 10;

    astronaut.style.transform = `perspective(1200px) translate3d(calc(50% + ${aCurrentX.toFixed(2)}px), ${aCurrentY.toFixed(2)}px, 0px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${aCurrentRot.toFixed(2)}deg)`;

    requestAnimationFrame(animateAstronaut);
  }

  requestAnimationFrame(animateAstronaut);
}

/* ============================================
   DYNAMIC PROJECTS & CONTENT LOADER
   ============================================ */
const PORTFOLIO_DOMAIN_PRESETS = [
  { id: 'web',        name: 'Full Stack Web',    icon: 'fas fa-laptop-code',            bgGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 'security',   name: 'Cyber Security',    icon: 'fas fa-shield-halved',          bgGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { id: 'ai',         name: 'AI & ML',           icon: 'fas fa-brain',                  bgGradient: 'linear-gradient(135deg, #ec4899, #d946ef)' },
  { id: 'cloud',      name: 'Cloud & DevOps',    icon: 'fas fa-cloud',                  bgGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)' },
  { id: 'mobile',     name: 'Mobile Apps',       icon: 'fas fa-mobile-screen-button',   bgGradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
  { id: 'data',       name: 'Data Science',      icon: 'fas fa-chart-line',             bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: 'blockchain', name: 'Blockchain/Web3',   icon: 'fas fa-cubes',                  bgGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
  { id: 'iot',        name: 'Smart Systems/IoT', icon: 'fas fa-microchip',              bgGradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
  { id: 'design',     name: 'UI/UX & Design',    icon: 'fas fa-palette',                bgGradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { id: 'backend',    name: 'Backend & APIs',    icon: 'fas fa-server',                 bgGradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'gaming',     name: '3D & Game Dev',     icon: 'fas fa-gamepad',                bgGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'tools',      name: 'Open Source Tools', icon: 'fas fa-screwdriver-wrench',     bgGradient: 'linear-gradient(135deg, #eab308, #ca8a04)' }
];

function escapeHtmlStr(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function initDynamicProjects() {
  initProjectCategoryTabs();
  attachCardMouseGlow();
  initUFO();
}

/* ============================================================
   UFO CONTROLLER v2
   IDLE  → teleports instantly to nearest screen edge, parks there
           with a slow downward scan beam (green tint)
   HOVER → warps to exact centre above hovered card, emits
           wide cyan/indigo tractor beam onto that card
   ============================================================ */
function initUFO() {
  const ufo   = document.getElementById('ufo-craft');
  const beam  = document.getElementById('ufo-beam');
  const scene = document.getElementById('ufo-scene');
  if (!ufo || !beam || !scene) return;

  /* ── constants ── */
  const UFO_HALF_W   = 80;   // half the UFO render width (160/2)
  const UFO_HOVER    = -72;  // px above card top when abducting
  const UFO_EDGE_Y   = -50;  // Y above scene top when idling at edge
  const EDGE_INSET   = 30;   // px inset from scene edge so craft peeks in
  const WARP_MS      = 65;   // teleport transition duration (ms)
  const FLY_MS_L     = 450;  // left/horizontal spring (ms)
  const FLY_MS_T     = 380;  // top spring (ms)

  let tiltTimer   = null;
  let currentCard = null;
  let lastMouseX  = 0;       // track cursor X to know which edge is nearest
  let ufoReady    = false;   // first card hover activates the UFO
  let idleActive  = false;

  /* ── track cursor globally inside the scene wrapper ── */
  scene.addEventListener('mousemove', e => { lastMouseX = e.clientX; });
  document.addEventListener('mousemove', e => { lastMouseX = e.clientX; });

  /* ── CSS transition helpers ── */
  function setTransition(fast) {
    const ms = fast ? WARP_MS : null;
    if (fast) {
      ufo.style.transition = `left ${WARP_MS}ms linear, top ${WARP_MS * 1.5}ms linear, opacity 0.18s ease`;
    } else {
      ufo.style.transition = `left ${FLY_MS_L}ms cubic-bezier(0.34,1.4,0.64,1), top ${FLY_MS_T}ms cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease`;
    }
  }

  /* ── place UFO (left = centre of craft) ── */
  function place(centreX, topY) {
    ufo.style.left       = `${centreX}px`;
    ufo.style.top        = `${topY}px`;
    ufo.style.marginLeft = `-${UFO_HALF_W}px`;
  }

  /* ── determine nearest screen edge X (in scene coords) ── */
  function nearestEdge() {
    const sr = scene.getBoundingClientRect();
    const midX = sr.left + sr.width / 2;
    return (lastMouseX < midX)
      ? EDGE_INSET                      // left edge
      : sr.width - EDGE_INSET;          // right edge
  }

  /* ── IDLE: warp to nearest edge → flash → vanish ── */
  function parkAtEdge() {
    if (idleActive) return;
    idleActive = true;

    // kill beam + card glow immediately
    beam.classList.remove('beam-on', 'beam-idle');
    beam.style.height = '0px';
    if (currentCard) {
      currentCard.classList.remove('ufo-targeted');
      currentCard = null;
    }

    const edgeX  = nearestEdge();
    const curLeft = parseFloat(ufo.style.left) || 0;

    // tilt toward edge
    ufo.classList.remove('ufo-tilt-left', 'ufo-tilt-right');
    ufo.classList.add(edgeX < curLeft ? 'ufo-tilt-left' : 'ufo-tilt-right');

    // warp flash
    ufo.classList.add('ufo-warping');
    setTransition(true);
    place(edgeX, UFO_EDGE_Y);

    // after warp arrives → vanish (quick fade)
    setTimeout(() => {
      ufo.classList.remove('ufo-warping', 'ufo-tilt-left', 'ufo-tilt-right');
      // fade-out: override transition to a snappy opacity drop
      ufo.style.transition = 'opacity 0.12s ease';
      ufo.classList.remove('ufo-active');   // triggers opacity → 0
    }, WARP_MS + 10);
  }

  /* ── HOVER: spring-fly to card centre + abduction beam ── */
  function flyToCard(card) {
    if (card === currentCard) return;
    idleActive = false;

    const sceneRect = scene.getBoundingClientRect();
    const cardRect  = card.getBoundingClientRect();
    const cardCX    = cardRect.left - sceneRect.left + cardRect.width / 2;
    const cardTopY  = cardRect.top  - sceneRect.top;
    const targetTop = cardTopY + UFO_HOVER;

    // restore spring transition (may have been overridden to opacity-only during vanish)
    setTransition(false);

    // tilt during travel
    const prevLeft = parseFloat(ufo.style.left) || sceneRect.width / 2;
    const dx = cardCX - prevLeft;
    ufo.classList.remove('ufo-tilt-left', 'ufo-tilt-right', 'ufo-warping');
    if (Math.abs(dx) > 20) {
      ufo.classList.add(dx < 0 ? 'ufo-tilt-left' : 'ufo-tilt-right');
      clearTimeout(tiltTimer);
      tiltTimer = setTimeout(() => ufo.classList.remove('ufo-tilt-left', 'ufo-tilt-right'), 440);
    }

    // ensure visible
    ufo.classList.add('ufo-active');
    place(cardCX, targetTop);

    // beam: tapered cone from hull bottom to card top surface
    const beamH = Math.max(0, cardTopY - (targetTop + 72));
    beam.style.height = `${beamH}px`;
    beam.classList.remove('beam-idle');
    beam.classList.add('beam-on');

    // card glow
    if (currentCard) currentCard.classList.remove('ufo-targeted');
    currentCard = card;
    card.classList.add('ufo-targeted');
  }

  /* ── bind all card events ── */
  function bindCards() {
    document.querySelectorAll('.project-card-structured').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!ufoReady) {
          // very first activation — spawn from nearest edge
          ufoReady = true;
          setTransition(false);
          ufo.classList.add('ufo-active');
          place(nearestEdge(), UFO_EDGE_Y);
          setTimeout(() => flyToCard(card), 80);
        } else {
          // UFO may be invisible after a warp-vanish — snap to edge then fly
          if (!ufo.classList.contains('ufo-active')) {
            ufo.classList.add('ufo-active');
            place(nearestEdge(), UFO_EDGE_Y);
            setTimeout(() => flyToCard(card), 60);
          } else {
            flyToCard(card);
          }
        }
      });

      card.addEventListener('mouseleave', () => {
        // brief grace period then teleport to edge
        setTimeout(() => {
          // only park if we haven't entered another card
          if (card === currentCard) {
            parkAtEdge();
          }
        }, 180);
      });
    });
  }

  bindCards();
  window._ufoRebind = bindCards;
}


function attachCardMouseGlow() {
  document.querySelectorAll('.project-card-structured').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

function initProjectCategoryTabs() {
  const tabs = document.querySelectorAll('.proj-cat-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterStr = tab.getAttribute('data-filter') || 'all';
      const targetDomains = filterStr === 'all' ? null : filterStr.split(',').map(d => d.trim());

      const cards = document.querySelectorAll('.project-card-structured');
      cards.forEach(card => {
        const domain = card.getAttribute('data-domain') || 'web';
        if (!targetDomains || targetDomains.includes(domain)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            if (!tab.classList.contains('active')) return;
            card.style.display = 'none';
          }, 150);
        }
      });
    });
  });
}

function renderPortfolioProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid || !Array.isArray(projects) || !projects.length) return;

  grid.innerHTML = '';
  projects.forEach(proj => {
    const domainPreset = PORTFOLIO_DOMAIN_PRESETS.find(d => d.id === proj.domain) || PORTFOLIO_DOMAIN_PRESETS[0];
    const card = document.createElement('div');
    card.className = 'project-card-structured';
    card.setAttribute('data-domain', proj.domain || 'web');

    const highlightsHtml = (proj.highlights || []).map(hl => `
      <li><i class="fas fa-circle-check"></i> ${escapeHtmlStr(hl)}</li>
    `).join('');

    const techHtml = (proj.techStack || []).map(t => `
      <span class="project-tech-pill">${escapeHtmlStr(t)}</span>
    `).join('');

    const demoBtnHtml = proj.demoUrl
      ? `<a href="${escapeHtmlStr(proj.demoUrl)}" target="_blank" rel="noopener noreferrer" class="project-action-btn project-action-primary"><i class="fas fa-arrow-up-right-from-square"></i> Live Demo</a>`
      : '';
    const githubBtnHtml = proj.githubUrl
      ? `<a href="${escapeHtmlStr(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-action-btn project-action-ghost"><i class="fab fa-github"></i> Source</a>`
      : '';

    card.innerHTML = `
      <div class="project-card-top">
        <div class="project-icon-badge">
          <i class="${domainPreset.icon}"></i>
        </div>
        <div class="project-card-badges">
          <span class="project-badge-domain">${escapeHtmlStr(proj.domainLabel || domainPreset.name)}</span>
          ${proj.featuredTag ? `<span class="project-badge-feat"><i class="fas fa-star"></i> ${escapeHtmlStr(proj.featuredTag)}</span>` : ''}
        </div>
      </div>
      <h3 class="project-card-title">${escapeHtmlStr(proj.title)}</h3>
      <p class="project-card-summary">${escapeHtmlStr(proj.summary || '')}</p>
      ${highlightsHtml ? `<ul class="project-card-highlights">${highlightsHtml}</ul>` : ''}
      ${techHtml ? `<div class="project-card-techs">${techHtml}</div>` : ''}
      ${(demoBtnHtml || githubBtnHtml) ? `<div class="project-card-actions">${demoBtnHtml}${githubBtnHtml}</div>` : ''}
    `;

    grid.appendChild(card);
  });

  attachCardMouseGlow();
  if (typeof window._ufoRebind === 'function') window._ufoRebind();

  // Re-apply active category filter if one is selected
  const activeTab = document.querySelector('.proj-cat-tab.active');
  if (activeTab) {
    const filterStr = activeTab.getAttribute('data-filter') || 'all';
    if (filterStr !== 'all') {
      const targetDomains = filterStr.split(',').map(d => d.trim());
      grid.querySelectorAll('.project-card-structured').forEach(card => {
        const domain = card.getAttribute('data-domain') || 'web';
        card.style.display = targetDomains.includes(domain) ? 'flex' : 'none';
      });
    }
  }
}

async function initLiveContent() {
  initDynamicProjects();

  try {
    const res = await fetch('/api/content');
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.content) return;

    const { hero, about, projects } = data.content;

    // 1. Sync Hero text
    if (hero) {
      const heroLine1 = document.querySelector('.hero-title .title-line:nth-child(1)');
      const heroLine2 = document.querySelector('.hero-title .title-line:nth-child(2)');
      const heroDesc  = document.querySelector('.hero-description');
      if (heroLine1 && hero.heading)  heroLine1.textContent = hero.heading;
      if (heroLine2 && hero.heading2) heroLine2.textContent = hero.heading2;
      if (heroDesc  && hero.description) heroDesc.textContent = hero.description;
    }

    // 2. Sync About telemetry terminal text
    if (about) {
      const whoP     = document.querySelector('#who-i-am p');
      const excitesP = document.querySelector('#excites-me p');
      const careerP  = document.querySelector('#career p');
      if (whoP && about.who)         whoP.textContent = about.who;
      if (excitesP && about.excites) excitesP.textContent = about.excites;
      if (careerP && about.focus)    careerP.textContent = about.focus;
    }

    // 3. Sync Dynamic Projects
    if (Array.isArray(projects) && projects.length) {
      renderPortfolioProjects(projects);
    }
  } catch (_) {
    // Graceful offline fallback
  }
}

function injectAdminPortalLink() {
  const footer = document.querySelector('.copyright-compact');
  if (footer && !document.getElementById('admin-portal-link')) {
    const link = document.createElement('a');
    link.id = 'admin-portal-link';
    link.href = '/admin.html';
    link.title = 'Admin Portal';
    link.style.cssText = 'color:rgba(255,255,255,0.25); text-decoration:none; margin-left:10px; font-size:0.75rem; transition:color 0.2s;';
    link.innerHTML = '<i class="fas fa-lock"></i>';
    link.addEventListener('mouseenter', () => link.style.color = 'var(--primary-light)');
    link.addEventListener('mouseleave', () => link.style.color = 'rgba(255,255,255,0.25)');
    footer.appendChild(link);
  }
}

