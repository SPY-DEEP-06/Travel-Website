/**
 * ==========================================================================
 * THE TRAVEL CIRCLE — PRODUCTION-GRADE AUTO-HEALING FRONTEND SYSTEM
 * ==========================================================================
 * Features:
 * 1. Global Error Capture & Silent Recovery (window.onerror & unhandledrejection)
 * 2. Automatic Asset & Image Retry with Dimension-Preserving Fallback
 * 3. Video & Media Autoplay Recovery
 * 4. Stuck Loader & Infinite Spinner Safety Guarantee
 * 5. Reveal Animation Safety Net (Guaranteed Content Visibility)
 * 6. Responsive Layout & Horizontal Overflow Guardian
 * 7. Interactive Element Pointer-Events & Stacking Context Safety
 * 8. Infinite Loop Protection & Bounded Retries (Max 2 Attempts)
 */

(function () {
    'use strict';

    // Development Diagnostic Mode Configuration
    const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    function autoLog(category, message, details = {}) {
        if (IS_DEV) {
            console.log(`%c[AutoHeal :: ${category}] %c${message}`, 'color: #d9a441; font-weight: bold;', 'color: #0f172a;', details);
        }
    }

    // --------------------------------------------------------------------------
    // 1. GLOBAL RUNTIME ERROR CAPTURE & RECOVERY
    // --------------------------------------------------------------------------
    window.addEventListener('error', function (event) {
        // Handle Image & Resource Load Failures
        if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
            handleResourceError(event.target);
            return;
        }

        // Global Script Exception Handling
        autoLog('RuntimeError', event.message || 'Script error', {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });

        // Prevent Unhandled Error Popups from Breaking User Experience
        if (event.error) {
            event.preventDefault && event.preventDefault();
        }
    }, true);

    window.addEventListener('unhandledrejection', function (event) {
        autoLog('PromiseRejection', event.reason?.message || 'Unhandled Promise Rejection', {
            reason: event.reason
        });
        event.preventDefault && event.preventDefault();
    });

    // --------------------------------------------------------------------------
    // 2. AUTOMATIC IMAGE & MEDIA RETRY WITH GRADIENT FALLBACK
    // --------------------------------------------------------------------------
    const imageRetryMap = new WeakMap();

    function handleResourceError(element) {
        if (!element) return;

        const tagName = element.tagName.toUpperCase();

        if (tagName === 'IMG') {
            let retryCount = imageRetryMap.get(element) || 0;
            if (retryCount < 2) {
                imageRetryMap.set(element, retryCount + 1);
                autoLog('ImageRetry', `Retrying image load (Attempt ${retryCount + 1}/2)`, { src: element.src });
                
                // Cache-busting retry with backoff
                const currentSrc = element.src;
                setTimeout(() => {
                    const separator = currentSrc.includes('?') ? '&' : '?';
                    element.src = currentSrc + separator + 'retry=' + Date.now();
                }, (retryCount + 1) * 300);
            } else {
                autoLog('ImageFallback', 'Image failed loading after 2 retries; applying SVG/Gradient fallback', { src: element.src });
                applyImageFallback(element);
            }
        } else if (tagName === 'VIDEO') {
            autoLog('VideoRecovery', 'Video media error detected; attempting safe playback fallback', { src: element.src });
            element.muted = true;
            element.play().catch(() => {
                // If video fails completely, ensure video wrapper remains visible and styled cleanly
                if (element.parentElement) {
                    element.parentElement.classList.add('video-fallback-active');
                }
            });
        }
    }

    function applyImageFallback(img) {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = 'true';
        
        // Preserve visual dimensions to avoid layout shift (CLS)
        const width = img.offsetWidth || img.width || 300;
        const height = img.offsetHeight || img.height || 200;
        
        const altText = img.alt || 'The Travel Circle Moment';
        const svgDataUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0f172a"/>
                        <stop offset="100%" stop-color="#1e293b"/>
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#g)"/>
                <circle cx="${width/2}" cy="${height/2 - 12}" r="24" fill="#d9a441" opacity="0.4"/>
                <text x="50%" y="${height/2 + 24}" fill="#e2e8f0" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">${altText}</text>
            </svg>
        `);

        img.src = svgDataUrl;
        img.classList.add('is-fallback-image');
    }

    // --------------------------------------------------------------------------
    // 3. STUCK LOADER & INFINITE SPINNER GUARANTEE
    // --------------------------------------------------------------------------
    function initStuckLoaderGuard() {
        const MAX_LOADER_TIMEOUT = 6000; // 6 seconds safety limit

        setTimeout(() => {
            const loader = document.querySelector('.site-loader, #site-loader');
            if (loader && !loader.classList.contains('is-hidden')) {
                autoLog('StuckLoaderGuard', 'Site loader threshold exceeded; forcing safe transition to main site content');
                
                loader.classList.add('is-hidden');
                document.body.classList.remove('is-loading');
                document.body.classList.add('site-ready');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';

                setTimeout(() => {
                    if (loader.parentNode) loader.parentNode.removeChild(loader);
                    document.body.classList.remove('site-revealing');
                }, 500);
            }
        }, MAX_LOADER_TIMEOUT);
    }

    // --------------------------------------------------------------------------
    // 4. ANIMATION SAFETY NET (CONTENT VISIBILITY GUARANTEE)
    // --------------------------------------------------------------------------
    function initAnimationSafetyNet() {
        const ANIMATION_MAX_WAIT = 3500; // 3.5 seconds content reveal guarantee

        setTimeout(() => {
            const hiddenRevealItems = document.querySelectorAll('[data-reveal]:not(.is-revealed), .reveal-card-left:not(.is-revealed), .reveal-card-right:not(.is-revealed), .reveal-stagger-item:not(.is-revealed)');
            if (hiddenRevealItems.length > 0) {
                autoLog('AnimationSafetyNet', `Revealing ${hiddenRevealItems.length} unrevealed elements automatically to prevent hidden content`, {});
                hiddenRevealItems.forEach(el => {
                    el.classList.add('is-revealed');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
            }
        }, ANIMATION_MAX_WAIT);
    }

    // --------------------------------------------------------------------------
    // 5. RESPONSIVE LAYOUT & HORIZONTAL OVERFLOW GUARDIAN
    // --------------------------------------------------------------------------
    function initOverflowGuardian() {
        let resizeTimer;

        function checkHorizontalOverflow() {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;

            if (scrollWidth > docWidth + 3) {
                autoLog('OverflowGuardian', `Detected horizontal overflow: scrollWidth=${scrollWidth}px > clientWidth=${docWidth}px`);
                
                // Identify and correct wide elements
                const allElements = document.body.querySelectorAll('*');
                allElements.forEach(el => {
                    if (el.offsetWidth > docWidth) {
                        autoLog('OverflowCorrection', `Constraining offending element`, { element: el, width: el.offsetWidth });
                        el.style.maxWidth = '100vw';
                        el.style.boxSizing = 'border-box';
                    }
                });
            }
        }

        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkHorizontalOverflow, 250);
        }, { passive: true });

        // Initial check after DOM load
        setTimeout(checkHorizontalOverflow, 1500);
    }

    // --------------------------------------------------------------------------
    // 6. INTERACTION & POINTER-EVENTS GUARDIAN
    // --------------------------------------------------------------------------
    function initInteractionGuardian() {
        // Ensure menu button & interactive elements are never blocked by phantom overlays
        setTimeout(() => {
            const interactiveButtons = document.querySelectorAll('#menu-btn, .menu-close-cross-btn, .btn, .hero-primary, .talk-btn, .card-action-btn');
            interactiveButtons.forEach(btn => {
                const computed = window.getComputedStyle(btn);
                if (computed.pointerEvents === 'none') {
                    autoLog('InteractionGuardian', 'Restoring pointer-events to interactive element', { element: btn });
                    btn.style.pointerEvents = 'auto';
                }
            });
        }, 1000);
    }

    // --------------------------------------------------------------------------
    // 7. SAFARI & APPLE DEVICE VIDEO AUTOPLAY GUARDIAN
    // --------------------------------------------------------------------------
    function initSafariVideoGuardian() {
        const bgVideos = document.querySelectorAll('.hero-video, .site-loader-video, .about video');
        bgVideos.forEach(video => {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.removeAttribute('controls');

            const attemptPlay = () => {
                video.play().catch(() => {});
            };

            attemptPlay();

            const onGesture = () => {
                attemptPlay();
                window.removeEventListener('touchstart', onGesture);
                window.removeEventListener('scroll', onGesture);
                window.removeEventListener('click', onGesture);
            };

            window.addEventListener('touchstart', onGesture, { passive: true, once: true });
            window.addEventListener('scroll', onGesture, { passive: true, once: true });
            window.addEventListener('click', onGesture, { passive: true, once: true });
        });
    }

    // --------------------------------------------------------------------------
    // SYSTEM INITIALIZATION
    // --------------------------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initStuckLoaderGuard();
            initAnimationSafetyNet();
            initOverflowGuardian();
            initInteractionGuardian();
            initSafariVideoGuardian();
        });
    } else {
        initStuckLoaderGuard();
        initAnimationSafetyNet();
        initOverflowGuardian();
        initInteractionGuardian();
        initSafariVideoGuardian();
    }

})();
