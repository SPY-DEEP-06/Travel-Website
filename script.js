const templates = {
    mediaBase: 'images/ttc/',

    getImages() {
        return (window.ttcMedia && window.ttcMedia.images) || [];
    },

    getVideos() {
        return (window.ttcMedia && window.ttcMedia.videos) || [];
    },

    mediaSrc(fileName) {
        return `${this.mediaBase}${encodeURI(fileName)}`;
    },

    isDuplicateGalleryMedia(fileName) {
        return new Set([
            'IMG_20240619_185807753.jpg',
            'IMG_20240619_185805304.jpg',
            'IMG_20240619_185737549_AE.jpg',
            'IMG_20240619_185734270_AE.jpg',
            'IMG_20240619_185734270_AE(1).jpg',
            'IMG_20240619_185721470_AE.jpg',
            'IMG_20240619_185721470_AE(1).jpg',
            'IMG_20240619_185658507_AE.jpg',
            'IMG_20240619_185657006_AE.jpg',
            'IMG_20240619_185654965_AE.jpg',
            'IMG_20240618_193157923.jpg',
            'IMG_20240618_193155118_AE.jpg',
            'IMG_20240316_151128601_AE.jpg',
            'IMG_20240316_102432020.jpg',
            'IMG_20240316_081852934.jpg',
            'IMG_20240316_081848958.jpg',
            'IMG_20240316_081019913_AE.jpg'
        ]).has(fileName);
    },

    rollText(label) {
        return `<span class="roll-text" data-text="${label}"><span>${label}</span></span>`;
    },

    createPageLoader() {
        return `
<div class="site-loader" id="site-loader" aria-label="Loading The Travel Circle">
    <video class="site-loader-video" src="assets/loading/Loading_animation_travel_website…_1080p_202606260037.mp4" muted autoplay playsinline preload="auto"></video>
    <div class="site-loader-shade"></div>
</div>`;
    },

    createHeader() {
        const images = this.getImages().filter(image => !this.isDuplicateGalleryMedia(image));
        const previewFallback = images[0] || '20160804_193605.jpg';
        const previewFor = (index) => this.mediaSrc(images[index] || previewFallback);
        const navItems = [
            ['Home', '#home', previewFor(8), 'Begin The Circle'],
            ['About', '#about', previewFor(35), 'Meet The Travel Circle'],
            ['Destination', '#destination', previewFor(48), 'Handpicked Escapes'],
            ['Services', '#services', previewFor(63), 'Plans With Polish'],
            ['Gallery', '#gallery', previewFor(76), 'Moments Worth Keeping'],
            ['Blogs', '#blogs', previewFor(92), 'Stories Before You Pack'],
            ['Contact', '#contact', previewFor(112), 'Talk To The Travel Circle']
        ];
        const navLinks = navItems.map(([title, href, preview, label], index) => `
            <a data-aos="zoom-in-left" data-aos-delay="${250 + index * 80}" href="${href}" class="menu-link-item roll-link" data-preview="${preview}" data-preview-title="${label}">${this.rollText(title)}</a>`).join('');

        return `
<header class="header atelier-header ttc-modern-header">
    <a data-aos="zoom-in-left" data-aos-delay="150" href="#home" class="logo header-logo ttc-direct-logo">
        <img src="images/logoTTC.png" alt="The Travel Circle logo">
        <span>The Travel Circle</span>
    </a>
    <nav class="navbar" id="navbar">
        <div class="nav-links">
            ${navLinks}
        </div>
        <div class="nav-preview" aria-hidden="true">
            <div class="nav-preview-media">
                <img src="${navItems[0][2]}" alt="">
            </div>
            <strong>${navItems[0][3]}</strong>
        </div>
    </nav>
    <div class="header-actions">
        <a data-aos="zoom-in-left" data-aos-delay="850" href="#contact" class="reach-link">Reach Out</a>
        <a data-aos="zoom-in-left" data-aos-delay="950" href="#book-form" class="talk-btn">Plan My Tour</a>
        <button id="menu-btn" class="hamburger-btn" aria-label="Open menu" aria-controls="navbar" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>`;
    },

    createHome() {
        const heroVideo = this.mediaSrc('VID_20240316_100533931.mp4');

        return `
<section class="home" id="home">
    <video class="hero-video" src="${heroVideo}" muted autoplay loop playsinline preload="metadata"></video>
    <div class="hero-overlay"></div>
    <div class="content atelier-hero-content">
        <h1 data-aos="fade-up" data-aos-delay="150">
            The Travel Circle<br>
            You Dream, <em>We Plan</em><br>
            You Explore
        </h1>
        <p data-aos="fade-up" data-aos-delay="300">Dream routes, seamless plans, and real stories. <br class="desktop-break">Step into handcrafted tours shaped around the way you love to travel.</p>
        <div class="hero-actions" data-aos="fade-up" data-aos-delay="450">
            <a href="#book-form" class="hero-primary">Start My Journey
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a href="#gallery" class="hero-secondary">
                <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                Watch Travel Reel
            </a>
        </div>
    </div>
</section>`;
    },

    createBookingForm() {
        return `
<section class="book-form is-hidden" id="book-form" aria-hidden="true">
    <form action="" id="booking-form">
        <div class="inputBox">
            <span><i class="fas fa-map-marker-alt"></i> dream destination</span>
            <input type="text" placeholder="city, country, or experience" required>
        </div>
        <div class="inputBox">
            <span><i class="fas fa-calendar-alt"></i> travel date</span>
            <input type="date" required>
        </div>
        <div class="inputBox">
            <span><i class="fas fa-users"></i> travelers</span>
            <input type="number" placeholder="number of guests" min="1" required>
        </div>
        <input type="submit" value="plan my tour" class="btn">
        <div class="form-message"></div>
    </form>
</section>`;
    },
    
    createAbout() {
        const videos = this.getVideos();
        const aboutFilms = [
            ['VID_20220614_073953.mp4', 'Morning Trail'],
            ['VID_20240425_180456108.mp4', 'Golden Hour'],
            ['VID_20240617_073859278.mp4', 'Scenic Motion']
        ].filter(([video]) => videos.includes(video));
        const featuredFilms = aboutFilms.length ? aboutFilms : videos.slice(0, 3).map((video, index) => [video, `Travel Film ${index + 1}`]);
        const firstVideo = featuredFilms[0] ? this.mediaSrc(featuredFilms[0][0]) : 'images/ttc/VID-20200407-WA0035.mp4';
        const videoControls = featuredFilms.map(([video, label], index) => `
            <button class="control-btn${index === 0 ? ' active' : ''}" data-src="${this.mediaSrc(video)}" data-label="${label}" aria-label="Play ${label}"></button>`).join('');

        return `
<section class="about" id="about">
    <div class="video-container">
        <video src="${firstVideo}" muted autoplay loop playsinline class="video"></video>
        <div class="controls" role="group" aria-label="Video selection controls">
            ${videoControls}
        </div>
    </div>
    <div class="content">
        <span>why choose us?</span>
        <h3>Nature's Majesty Awaits You</h3>
        <p>The Travel Circle creates personalized travel experiences with thoughtful local guidance, comfortable stays, curated routes, and reliable support. Your dream gets a clear plan, and your journey stays effortless from start to finish.</p>
        <div class="about-highlights">
            <strong>Custom routes</strong>
            <strong>Smooth stays</strong>
            <strong>Real support</strong>
        </div>
        <a href="#services" class="btn">see our promise <i class="fas fa-info-circle"></i></a>
    </div>
</section>`;
    },

    createDestination() {
        const images = this.getImages();
        const destinationStories = [
            ['Himalayan Highs', 'Wake up above the clouds with scenic stays, guided trails, and crisp mountain mornings.'],
            ['Beachside Bliss', 'Slow sunsets, blue waters, and stays that keep you close to the rhythm of the shore.'],
            ['Culture Trails', 'Walk through old streets, sacred spaces, local markets, and stories that stay with you.'],
            ['City Breaks', 'Food walks, skyline views, shopping corners, nightlife, and the best parts of a new city.'],
            ['Desert Safaris', 'Ride golden dunes, dine under stars, and feel the calm magic of wide open landscapes.'],
            ['Wildlife Getaways', 'Forest roads, quiet lodges, expert naturalists, and thrilling chances to spot the wild.'],
            ['Island Hopping', 'Hop between turquoise lagoons, hidden coves, beach cafes, and easy-breezy resort stays.'],
            ['Snow Escapes', 'Chase snowfall, cozy cabins, alpine views, and picture-perfect winter experiences.']
        ];
        const destinationCards = destinationStories.map(([title, description], index) => `
        <div class="box" data-aos="fade-up" data-aos-delay="${150 + index * 150}">
            <div class="image">
                <img src="${this.mediaSrc(images[index] || images[0])}" alt="${title} curated by The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <h3>${title}</h3>
                <p>${description}</p>
                <a href="#book-form">plan this tour <i class="fas fa-angle-right"></i></a>
            </div>
        </div>`).join('');

        return `
<section class="destination" id="destination">
    <div class="heading">
        <span>handpicked escapes</span>
        <h1>choose your next circle on the map</h1>
    </div>
    <div class="box-container">
        ${destinationCards}
    </div>
</section>`;
    },

    createServices() {
        return `
<section class="services" id="services">
    <div class="heading">
        <span>what we arrange</span>
        <h1>every detail, beautifully handled</h1>
    </div>
    <div class="box-container">
        <div class="box" data-aos="zoom-in-up" data-aos-delay="150">
            <i class="fas fa-globe"></i>
            <h3>custom itineraries</h3>
            <p>Trips shaped around your dates, budget, pace, interests, and travel style.</p>
        </div>
        <div class="box" data-aos="zoom-in-up" data-aos-delay="300">
            <i class="fas fa-hiking"></i>
            <h3>adventure tours</h3>
            <p>Treks, safaris, water sports, road trips, and active escapes arranged with care.</p>
        </div>
        <div class="box" data-aos="zoom-in-up" data-aos-delay="450">
            <i class="fas fa-utensils"></i>
            <h3>local flavors</h3>
            <p>Handpicked food stops, cafes, tastings, and regional meals worth remembering.</p>
        </div>
        <div class="box" data-aos="zoom-in-up" data-aos-delay="600">
            <i class="fas fa-hotel"></i>
            <h3>trusted stays</h3>
            <p>Comfortable hotels, resorts, villas, and homestays matched to your mood.</p>
        </div>
        <div class="box" data-aos="zoom-in-up" data-aos-delay="750">
            <i class="fas fa-wallet"></i>
            <h3>clear pricing</h3>
            <p>Smart packages, honest inclusions, and no surprise costs after you say yes.</p>
        </div>
        <div class="box" data-aos="zoom-in-up" data-aos-delay="900">
            <i class="fas fa-headset"></i>
            <h3>trip support</h3>
            <p>Friendly help before, during, and after your journey whenever you need us.</p>
        </div>
    </div>
</section>`;
    },

    createGallery() {
        const images = this.getImages().filter(image => !this.isDuplicateGalleryMedia(image));
        const videos = this.getVideos();
        const visibleLimit = 12;
        const tileShapes = ['portrait', 'landscape', 'square', 'tall', 'landscape', 'portrait'];
        const imageItems = images.map((image, index) => `
        <div class="box gallery-tile gallery-tile--${tileShapes[index % tileShapes.length]}${index >= visibleLimit ? ' is-hidden' : ''}" data-type="image" data-src="${this.mediaSrc(image)}" tabindex="0" role="button" aria-label="View The Travel Circle photo ${index + 1}">
            <img src="${this.mediaSrc(image)}" alt="The Travel Circle journey photo ${index + 1}" loading="lazy">
            <span class="gallery-shine" aria-hidden="true"></span>
        </div>`).join('');
        const videoItems = videos.map((video, index) => `
        <div class="box gallery-tile gallery-tile--landscape video-box is-hidden" data-type="video" data-src="${this.mediaSrc(video)}" tabindex="0" role="button" aria-label="Play The Travel Circle travel film ${index + 1}">
            <div class="video-thumb">
                <img src="${this.mediaSrc(images[(index * 11) % images.length] || images[0])}" alt="Preview for The Travel Circle travel film ${index + 1}" loading="lazy">
                <i class="fas fa-play"></i>
            </div>
            <span class="gallery-shine" aria-hidden="true"></span>
        </div>`).join('');
        const totalItems = images.length + videos.length;

        return `
<section class="gallery" id="gallery">
    <div class="heading">
        <span>journey moments</span>
        <h1>memories from every mile</h1>
    </div>
    <div class="box-container">
        ${imageItems}
        ${videoItems}
    </div>
    ${totalItems > visibleLimit ? '<button class="btn gallery-more-btn" id="gallery-load-more" type="button">view more</button>' : ''}
</section>`;
    },

    createReview() {
        const images = this.getImages();
        const reviewerImages = [images[56], images[72], images[96], images[120]].map(image => image || images[0]);

        return `
<section class="review" id="review">
    <div class="content" data-aos="fade-right" data-aos-delay="300">
        <span>traveler stories</span>
        <h3>people return with better stories</h3>
        <p>Every itinerary is personal, so every review feels different. Here is what travelers love about letting The Travel Circle plan the details while they enjoy the journey.</p>
    </div>
    <div class="review-slider" data-aos="fade-left" data-aos-delay="600">
        <div class="slider-wrapper">
            <div class="box-container">
                <div class="box">
                    <p>The Travel Circle turned our honeymoon into a dream route. Every transfer, stay, and sunset felt perfectly timed.</p>
                    <div class="user">
                        <img src="${this.mediaSrc(reviewerImages[0])}" alt="The Travel Circle traveler memory" loading="lazy">
                        <div class="info">
                            <h3>Aarav Mehta</h3>
                            <span>honeymoon traveler</span>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <p>We asked for a relaxed beach holiday, and they gave us calm mornings, beautiful rooms, and zero stress.</p>
                    <div class="user">
                        <img src="${this.mediaSrc(reviewerImages[1])}" alt="The Travel Circle family travel memory" loading="lazy">
                        <div class="info">
                            <h3>Nisha Kapoor</h3>
                            <span>family traveler</span>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <p>Our mountain trip had the right mix of thrill and comfort. The planning was sharp, thoughtful, and easy.</p>
                    <div class="user">
                        <img src="${this.mediaSrc(reviewerImages[2])}" alt="The Travel Circle adventure memory" loading="lazy">
                        <div class="info">
                            <h3>Rohan Verma</h3>
                            <span>adventure seeker</span>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <p>The local experiences were the best part. We did not just visit places; we actually felt connected to them.</p>
                    <div class="user">
                        <img src="${this.mediaSrc(reviewerImages[3])}" alt="The Travel Circle culture travel memory" loading="lazy">
                        <div class="info">
                            <h3>Meera Iyer</h3>
                            <span>culture explorer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slider-controls">
            <button id="prev-review" class="slider-btn" aria-label="Previous review"><i class="fas fa-chevron-left"></i></button>
            <button id="next-review" class="slider-btn" aria-label="Next review"><i class="fas fa-chevron-right"></i></button>
        </div>
    </div>
</section>`;
    },

    createBlogs() {
        const images = this.getImages();
        const blogImages = [images[8], images[24], images[40]].map(image => image || images[0]);

        return `
<section class="blogs" id="blogs">
    <div class="heading">
        <span>travel notes</span>
        <h1>ideas before you pack</h1>
    </div>
    <div class="box-container">
        <div class="box" data-aos="fade-up" data-aos-delay="150">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[0])}" alt="Planning a meaningful journey with The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#" class="link">The Road That Became A Memory</a>
                <p>A simple route turned into a collection of scenic stops, shared laughter, local flavors, and the kind of views that make travelers go quiet.</p>
                <div class="icon">
                    <a href="#"><i class="fas fa-clock"></i> 15th Sept, 2025</a>
                    <a href="#"><i class="fas fa-user"></i> by The Travel Circle</a>
                </div>
            </div>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="300">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[1])}" alt="A scenic travel story by The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#" class="link">When The Plan Feels Effortless</a>
                <p>The best holidays are not rushed. They have the right stays, the right pauses, and enough space to discover something beautiful along the way.</p>
                <div class="icon">
                    <a href="#"><i class="fas fa-clock"></i> 10th Sept, 2025</a>
                    <a href="#"><i class="fas fa-user"></i> by The Travel Circle</a>
                </div>
            </div>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="450">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[2])}" alt="Hidden travel experience arranged by The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#" class="link">Small Detours, Big Stories</a>
                <p>Sometimes the unforgettable part is not the famous spot. It is the bend in the road, the surprise viewpoint, or the evening nobody wanted to end.</p>
                <div class="icon">
                    <a href="#"><i class="fas fa-clock"></i> 5th Sept, 2025</a>
                    <a href="#"><i class="fas fa-user"></i> by The Travel Circle</a>
                </div>
            </div>
        </div>
    </div>
</section>`;
    },

    createBanner() {
        return `
<div class="banner">
    <div class="content" data-aos="zoom-in-up" data-aos-delay="300">
        <span>ready when you are</span>
        <h3>Your Next Story Starts With A Plan</h3>
        <p>Tell The Travel Circle what you are dreaming about. We will shape the route, polish the details, and hand you a journey you will want to talk about for years.</p>
        <a href="#book-form" class="btn">plan my journey</a>
    </div>
</div>`;
    },

    createFooter() {
        const footerLinks = [
            ['home', '#home'],
            ['about', '#about'],
            ['destination', '#destination'],
            ['services', '#services'],
            ['gallery', '#gallery'],
            ['blogs', '#blogs'],
            ['contact', '#contact']
        ].map(([label, href]) => `<a href="${href}" class="links roll-link"> <i class="fas fa-arrow-right"></i> ${this.rollText(label)} </a>`).join('');

        return `
<section class="footer" id="contact">
    <div class="box-container">
        <div class="box" data-aos="fade-up" data-aos-delay="150">
            <a href="#home" class="logo brand-logo footer-logo">
                <img src="images/logoTTC-pdf.png" alt="The Travel Circle logo">
                <span>The Travel Circle</span>
            </a>
            <p>You Dream, We Plan, You Explore. Thoughtful tours, smooth bookings, and memorable journeys designed around you.</p>
            <div class="share">
                <a href="#" class="fab fa-facebook-f" aria-label="Facebook" target="_blank" rel="noopener noreferrer"></a>
                <a href="#" class="fab fa-twitter" aria-label="Twitter" target="_blank" rel="noopener noreferrer"></a>
                <a href="#" class="fab fa-instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer"></a>
                <a href="#" class="fab fa-linkedin" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"></a>
            </div>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="300">
            <h3>explore</h3>
            ${footerLinks}
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="450">
            <h3>contact The Travel Circle</h3>
            <p> <i class="fas fa-map"></i> Uttar Pradesh, india </p>
            <p> <i class="fas fa-phone"></i> +91 6394729329 </p>
            <p> <i class="fas fa-envelope"></i> yashsrivastava561@gmail.com </p>
            <p> <i class="fas fa-clock"></i> 7:00am - 10:00pm </p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="600">
            <h3><i class="fas fa-envelope-open-text"></i> travel inspiration</h3>
            <p>get trip ideas, seasonal escapes, and planning tips</p>
            <form action="" id="newsletter-form">
                <input type="email" name="email" placeholder="enter your email" class="email" id="newsletter-email" required>
                <button type="submit" class="btn">send me ideas <i class="fas fa-paper-plane"></i></button>
                <div class="form-message"></div>
            </form>
        </div>
    </div>
</section>
<div class="credit"><span>The Travel Circle</span> | You Dream, We Plan, You Explore</div>`;
    },

    createScrollTopButton() {
        return `<a href="#home" class="scroll-top-btn fas fa-arrow-up"></a>`;
    },

    createLightbox() {
        return `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-heading">
    <h2 id="lightbox-heading" class="visually-hidden">The Travel Circle Gallery</h2>
    <div class="lightbox-backdrop" aria-hidden="true"></div>
    <div class="lightbox-stage">
        <img src="" alt="Enlarged gallery image" class="lightbox-content" id="lightbox-img" draggable="false">
        <video src="" class="lightbox-content lightbox-video" id="lightbox-video" controls playsinline></video>
    </div>
    <button class="close-btn" type="button" aria-label="Close gallery"><i class="fas fa-times"></i></button>
</div>`;
    },

    createPageStructure() {
        return `
            ${this.createPageLoader()}
            ${this.createHeader()}
            <main>
                ${this.createHome()}
                ${this.createBookingForm()}
                ${this.createAbout()}
                ${this.createDestination()}
                ${this.createServices()}
                ${this.createGallery()}
                ${this.createReview()}
                ${this.createBlogs()}
                ${this.createBanner()}
            </main>
            ${this.createFooter()}
            ${this.createScrollTopButton()}
            ${this.createLightbox()}
        `;
    }
};




'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Utility to throttle function execution
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    // Initialize all interactive components
    const app = {
        render() {
            const appContainer = document.getElementById('app');
            if (appContainer && typeof templates !== 'undefined') {
                appContainer.innerHTML = templates.createPageStructure();
            } else {
                console.error('App container or templates object not found!');
                document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">Error: Could not load page content.</h1>';
            }
        },

        init() {
            this.render();
            this.initAOS();
            this.initPageLoader();
            this.initNavbar();
            this.initMenuPreview();
            this.initSmoothScrolling();
            this.initFullSiteSlowScroll();
            this.initScrollEffects();
            this.initHeroSectionFlow();
            this.initVideoSwitcher();
            this.initActiveLinkObserver();
            this.initBookingReveal();
            this.initBookingForm();
            this.initNewsletterForm();
            this.initReviewSlider();
            this.initGalleryReveal();
            this.initGalleryLightbox();
        },

        initAOS() {
            // Respect user's motion preferences
            const motionQuery = window.matchMedia('(prefers-reduced-motion)');
            if (!motionQuery || !motionQuery.matches) {
                AOS.init({
                    duration: 800,
                    offset: 150,
                });
            }
        },

        initPageLoader() {
            const loader = document.querySelector('#site-loader');
            const video = loader ? loader.querySelector('video') : null;

            if (!loader || !video) return;
            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            let isHidden = false;
            const hideLoader = () => {
                if (isHidden) return;
                isHidden = true;
                document.body.classList.add('site-revealing');
                loader.classList.add('is-hidden');
                window.setTimeout(() => {
                    loader.remove();
                    document.body.classList.remove('is-loading');
                    document.body.classList.add('site-ready');
                    window.setTimeout(() => {
                        document.body.classList.remove('site-revealing');
                    }, 850);
                }, 850);
            };

            document.body.classList.add('is-loading');
            if (reduceMotion) {
                window.setTimeout(hideLoader, 350);
                return;
            }

            video.play().catch(() => {
                window.setTimeout(hideLoader, 900);
            });

            video.addEventListener('ended', hideLoader, { once: true });
            video.addEventListener('error', hideLoader, { once: true });

            // If the loading video file cannot buffer at all, avoid trapping visitors.
            window.setTimeout(() => {
                if (video.readyState === 0) {
                    hideLoader();
                }
            }, 8000);
        },

        initNavbar() {
            const menuBtn = document.querySelector('#menu-btn');
            const navbar = document.querySelector('.header .navbar');

            if (menuBtn && navbar) {
                const closeMenu = () => {
                    navbar.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menuBtn.setAttribute('aria-label', 'Open menu');
                };

                const openMenu = () => {
                    navbar.classList.add('active');
                    menuBtn.classList.add('active');
                    document.body.classList.add('nav-open');
                    menuBtn.setAttribute('aria-expanded', 'true');
                    menuBtn.setAttribute('aria-label', 'Close menu');
                };

                menuBtn.onclick = (event) => {
                    event.stopPropagation();
                    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                    if (isExpanded) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                };

                document.querySelectorAll('.header .navbar a').forEach(link => {
                    link.onclick = closeMenu;
                });

                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape' && navbar.classList.contains('active')) {
                        closeMenu();
                    }
                });

                document.addEventListener('click', (event) => {
                    if (!navbar.classList.contains('active')) return;
                    if (event.target.closest('.header')) return;
                    closeMenu();
                });
            }
        },

        initMenuPreview() {
            const navbar = document.querySelector('.header .navbar');
            const preview = document.querySelector('.nav-preview');
            const previewMedia = document.querySelector('.nav-preview-media');
            const previewTitle = document.querySelector('.nav-preview strong');
            const menuItems = document.querySelectorAll('.menu-link-item[data-preview]');

            if (!navbar || !preview || !previewMedia || !previewTitle || menuItems.length === 0) return;

            let lastPreview = menuItems[0].dataset.preview;

            const updatePreview = (item) => {
                const nextPreview = item.dataset.preview;
                if (!nextPreview || nextPreview === lastPreview) return;

                lastPreview = nextPreview;
                preview.classList.add('is-changing');
                previewTitle.textContent = item.dataset.previewTitle || item.textContent.trim();

                const image = document.createElement('img');
                image.src = nextPreview;
                image.alt = '';
                image.className = 'nav-preview-img';
                previewMedia.appendChild(image);

                window.requestAnimationFrame(() => {
                    image.classList.add('is-active');
                });

                window.setTimeout(() => {
                    Array.from(previewMedia.querySelectorAll('img')).slice(0, -1).forEach((oldImage) => {
                        oldImage.remove();
                    });
                    preview.classList.remove('is-changing');
                }, 850);
            };

            menuItems.forEach((item) => {
                item.addEventListener('mouseenter', () => updatePreview(item));
                item.addEventListener('mouseover', () => updatePreview(item));
                item.addEventListener('pointerenter', () => updatePreview(item));
                item.addEventListener('focus', () => updatePreview(item));
            });
        },

        getScrollOffset() {
            const header = document.querySelector('.header');
            return (header ? header.offsetHeight : 80) + 18;
        },

        getSlowScrollDuration(distance) {
            const pixels = Math.abs(distance);
            return Math.min(4200, Math.max(1700, 1100 + pixels * 0.55));
        },

        jumpToTarget(target) {
            const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            let targetY = 0;

            if (typeof target === 'number') {
                targetY = target;
            } else if (target && target.getBoundingClientRect) {
                targetY = (window.scrollY || window.pageYOffset) + target.getBoundingClientRect().top - this.getScrollOffset();
            } else {
                return;
            }

            targetY = Math.min(Math.max(targetY, 0), maxY);
            this.cancelSmoothScroll();
            if (this.fullSiteScroller && typeof this.fullSiteScroller.cancelSmoothMotion === 'function') {
                this.fullSiteScroller.cancelSmoothMotion();
            }
            this.siteScrollTarget = targetY;
            window.scrollTo(0, targetY);
        },

        stopSlowScrollLibrary() {
            if (this.slowScrollInstance && typeof this.slowScrollInstance.stop === 'function') {
                this.slowScrollInstance.stop();
            }
            this.slowScrollInstance = null;
        },

        ensureFullSiteScroller() {
            if (this.fullSiteScroller) return this.fullSiteScroller;
            if (!window.SlowScroll || typeof window.SlowScroll.createSlowScroll !== 'function') return null;

            this.fullSiteScroller = window.SlowScroll.createSlowScroll({
                target: 'body',
                interpolationTarget: 'main',
                speed: 0,
                interpolation: true,
                autoplay: false,
                bounce: false
            });

            document.documentElement.dataset.fullSiteSlowScroll = 'ready';
            return this.fullSiteScroller;
        },

        scrollSiteBy(delta, duration = 950) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                window.scrollBy(0, delta);
                return;
            }

            const maxScroll = Math.max(0, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight);
            const currentY = window.scrollY || window.pageYOffset;
            if (typeof this.siteScrollTarget !== 'number' || Math.abs(currentY - this.siteScrollTarget) > 900) {
                this.siteScrollTarget = currentY;
            }

            this.siteScrollTarget = Math.min(Math.max(this.siteScrollTarget + delta, 0), maxScroll);

            const scroller = this.ensureFullSiteScroller();
            if (scroller && typeof scroller.smoothTo === 'function') {
                scroller.smoothTo(this.siteScrollTarget, { duration });
                document.documentElement.dataset.fullSiteSlowScrollMode = 'library';
                return;
            }

            this.smoothScrollTo(this.siteScrollTarget, {
                duration,
                forceFallback: true
            });
            document.documentElement.dataset.fullSiteSlowScrollMode = 'fallback';
        },

        shouldSkipFullSiteScroll(event) {
            const target = event.target;
            const editableSelector = 'input, textarea, select, option, [contenteditable="true"]';
            return Boolean(
                event.ctrlKey ||
                event.metaKey ||
                document.querySelector('.lightbox.active') ||
                (target && target.closest && target.closest(editableSelector))
            );
        },

        cancelSmoothScroll() {
            if (this.smoothScrollFrame) {
                cancelAnimationFrame(this.smoothScrollFrame);
                this.smoothScrollFrame = null;
            }
            this.stopSlowScrollLibrary();
            this.smoothScrollToken = null;
            this.isSmoothScrolling = false;
        },

        smoothScrollWithLibrary(startY, targetY, distance, duration) {
            if (!window.SlowScroll || typeof window.SlowScroll.createSlowScroll !== 'function') {
                document.documentElement.dataset.slowScrollMode = 'fallback';
                return false;
            }

            const speed = Math.max(120, Math.min(2200, Math.abs(distance) / (duration / 1000)));
            const token = Symbol('slow-scroll-library');
            const startTime = performance.now();
            const isScrollingDown = distance > 0;

            try {
                this.stopSlowScrollLibrary();
                this.smoothScrollToken = token;
                this.isSmoothScrolling = true;
                this.slowScrollInstance = window.SlowScroll.createSlowScroll({
                    target: 'body',
                    interpolationTarget: 'main',
                    speed: isScrollingDown ? speed : -speed,
                    interpolation: true,
                    autoplay: true,
                    bounce: false,
                    pauseOnTouch: true,
                    pauseOnMouseMove: false,
                    userScrollResumeDelay: 250
                });
                document.documentElement.dataset.slowScrollMode = 'library';
            } catch (error) {
                this.stopSlowScrollLibrary();
                document.documentElement.dataset.slowScrollMode = 'fallback';
                return false;
            }

            const finish = () => {
                this.stopSlowScrollLibrary();
                window.scrollTo(0, targetY);
                this.smoothScrollFrame = null;
                this.smoothScrollToken = null;
                this.isSmoothScrolling = false;
            };

            const monitor = (now) => {
                if (this.smoothScrollToken !== token) return;

                const currentY = window.scrollY || window.pageYOffset;
                const reachedTarget = isScrollingDown ? currentY >= targetY : currentY <= targetY;
                const timedOut = now - startTime > duration + 900;

                if (reachedTarget || timedOut || Math.abs(currentY - targetY) < 4) {
                    finish();
                    return;
                }

                this.smoothScrollFrame = requestAnimationFrame(monitor);
            };

            this.smoothScrollFrame = requestAnimationFrame(monitor);
            return true;
        },

        smoothScrollTo(target, options = {}) {
            const startY = window.scrollY || window.pageYOffset;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            let targetY = 0;

            if (typeof target === 'number') {
                targetY = target;
            } else if (target && target.getBoundingClientRect) {
                const rect = target.getBoundingClientRect();
                if (options.center) {
                    targetY = startY + rect.top - Math.max(0, (window.innerHeight - rect.height) / 2);
                } else {
                    targetY = startY + rect.top - (options.offset ?? this.getScrollOffset());
                }
            } else {
                return;
            }

            targetY = Math.min(Math.max(targetY, 0), maxY);
            this.siteScrollTarget = targetY;
            this.cancelSmoothScroll();

            const distance = targetY - startY;
            const finalDuration = options.duration || this.getSlowScrollDuration(distance);

            if (prefersReducedMotion || Math.abs(targetY - startY) < 3) {
                window.scrollTo(0, targetY);
                this.siteScrollTarget = targetY;
                return;
            }

            if (!options.forceFallback && this.smoothScrollWithLibrary(startY, targetY, distance, finalDuration)) {
                return;
            }

            const token = Symbol('smooth-scroll');
            const startTime = performance.now();
            this.smoothScrollToken = token;
            this.isSmoothScrolling = true;

            const easeSlowScroll = (progress) => {
                return progress < 0.5
                    ? 16 * progress * progress * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 5) / 2;
            };

            const step = (now) => {
                if (this.smoothScrollToken !== token) return;

                const elapsed = now - startTime;
                const progress = Math.min(elapsed / finalDuration, 1);
                window.scrollTo(0, startY + distance * easeSlowScroll(progress));

                if (progress < 1) {
                    this.smoothScrollFrame = requestAnimationFrame(step);
                } else {
                    this.smoothScrollFrame = null;
                    this.smoothScrollToken = null;
                    this.isSmoothScrolling = false;
                }
            };

            this.smoothScrollFrame = requestAnimationFrame(step);
        },

        initSmoothScrolling() {
            const cancelKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
            document.documentElement.dataset.slowScrollLibrary = window.SlowScroll && typeof window.SlowScroll.createSlowScroll === 'function' ? 'ready' : 'fallback';

            window.addEventListener('wheel', () => this.cancelSmoothScroll(), { passive: true });
            window.addEventListener('touchstart', () => this.cancelSmoothScroll(), { passive: true });
            window.addEventListener('keydown', (event) => {
                if (cancelKeys.has(event.key)) {
                    this.cancelSmoothScroll();
                }
            });

            document.addEventListener('click', (event) => {
                const link = event.target.closest('a[href^="#"]');
                if (!link) return;

                const hash = link.getAttribute('href');
                if (!hash || hash === '#' || hash === '#book-form') return;

                const target = document.querySelector(hash);
                if (!target) return;

                event.preventDefault();
                this.jumpToTarget(hash === '#home' ? 0 : target);

                if (history.pushState) {
                    history.pushState(null, '', hash);
                }
            });
        },

        initFullSiteSlowScroll() {
            const scroller = this.ensureFullSiteScroller();
            if (!scroller) {
                document.documentElement.dataset.fullSiteSlowScroll = 'fallback';
                return;
            }

            let touchStartY = 0;
            let touchLastY = 0;
            let touchActive = false;

            const normalizeWheelDelta = (event) => {
                const lineHeight = 18;
                const pageHeight = window.innerHeight * .82;
                if (event.deltaMode === 1) return event.deltaY * lineHeight;
                if (event.deltaMode === 2) return event.deltaY * pageHeight;
                return event.deltaY;
            };

            window.addEventListener('wheel', (event) => {
                if (this.shouldSkipFullSiteScroll(event)) return;

                if (event.cancelable) {
                    event.preventDefault();
                }
                this.cancelSmoothScroll();
                const delta = normalizeWheelDelta(event);
                const distance = Math.max(-780, Math.min(780, delta * 1.05));
                const duration = Math.min(720, Math.max(360, 260 + Math.abs(distance) * .55));
                this.scrollSiteBy(distance, duration);
            }, { passive: false, capture: true });

            window.addEventListener('keydown', (event) => {
                if (this.shouldSkipFullSiteScroll(event) || event.altKey || event.shiftKey) return;

                const keyScrollMap = {
                    ArrowDown: 110,
                    ArrowUp: -110,
                    PageDown: window.innerHeight * .82,
                    PageUp: -window.innerHeight * .82,
                    Home: -Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                    End: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                    ' ': window.innerHeight * .82
                };

                if (!Object.prototype.hasOwnProperty.call(keyScrollMap, event.key)) return;

                if (event.cancelable) {
                    event.preventDefault();
                }
                this.cancelSmoothScroll();
                this.scrollSiteBy(keyScrollMap[event.key], event.key === 'ArrowDown' || event.key === 'ArrowUp' ? 420 : 760);
            }, { capture: true });

            window.addEventListener('touchstart', (event) => {
                if (event.touches.length !== 1 || this.shouldSkipFullSiteScroll(event)) return;
                touchActive = true;
                touchStartY = event.touches[0].clientY;
                touchLastY = touchStartY;
                this.siteScrollTarget = window.scrollY || window.pageYOffset;
            }, { passive: true, capture: true });

            window.addEventListener('touchmove', (event) => {
                if (!touchActive || event.touches.length !== 1 || this.shouldSkipFullSiteScroll(event)) return;
                const currentY = event.touches[0].clientY;
                const delta = (touchLastY - currentY) * 1.18;
                touchLastY = currentY;

                if (Math.abs(delta) < 1) return;

                if (event.cancelable) {
                    event.preventDefault();
                }
                this.cancelSmoothScroll();
                this.scrollSiteBy(delta, 260);
            }, { passive: false, capture: true });

            window.addEventListener('touchend', () => {
                touchActive = false;
            }, { passive: true });
        },

        initScrollEffects() {
            const header = document.querySelector('.header');
            const scrollTopBtn = document.querySelector('.scroll-top-btn');

            const handleScroll = () => {
                if (header) {
        header.classList.toggle('scrolled', window.scrollY > 90);
                }

                if (scrollTopBtn) {
                    scrollTopBtn.classList.toggle('active', window.scrollY > 250);
                }
            };

            window.addEventListener('scroll', throttle(handleScroll, 100));
        },

        initHeroSectionFlow() {
            const hero = document.querySelector('.home');
            const about = document.querySelector('.about');
            const video = document.querySelector('.home .hero-video');
            const content = document.querySelector('.home .atelier-hero-content');

            if (!hero || !about || !video || !content) return;

            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduceMotion) return;

            let ticking = false;
            const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

            const updateFlow = () => {
                ticking = false;
                const heroRect = hero.getBoundingClientRect();
                const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
                const progress = clamp((0 - heroRect.top) / Math.max(heroRect.height * .9, 1), 0, 1);
                const aboutRect = about.getBoundingClientRect();
                const aboutProgress = clamp((viewport - aboutRect.top) / Math.max(viewport * .85, 1), 0, 1);

                video.style.transform = `translate3d(0, ${progress * 7}rem, 0) scale(${1 + progress * .055})`;
                content.style.transform = `translate3d(0, ${progress * -4.2}rem, 0) scale(${1 - progress * .025})`;
                content.style.opacity = String(clamp(1 - progress * 1.15, 0, 1));
                hero.style.setProperty('--hero-veil-opacity', String(progress * .72));
                about.style.setProperty('--about-flow-opacity', String(.72 + aboutProgress * .28));
                about.style.setProperty('--about-flow-y', `${(1 - aboutProgress) * 3.4}rem`);
            };

            const requestUpdate = () => {
                if (ticking) return;
                ticking = true;
                window.requestAnimationFrame(updateFlow);
            };

            window.addEventListener('scroll', requestUpdate, { passive: true });
            window.addEventListener('resize', requestUpdate);
            requestUpdate();
        },

        initBookingReveal() {
            const bookSection = document.querySelector('#book-form');
            const bookingLinks = document.querySelectorAll('a[href="#book-form"]');

            if (!bookSection || bookingLinks.length === 0) return;

            let revealLock = false;

            const showBooking = () => {
                revealLock = true;
                bookSection.classList.remove('is-hidden');
                bookSection.setAttribute('aria-hidden', 'false');
                window.setTimeout(() => {
                    this.smoothScrollTo(bookSection, { duration: 1850, center: true });
                }, 60);
                window.setTimeout(() => {
                    revealLock = false;
                }, 2050);
            };

            const hideBooking = () => {
                bookSection.classList.add('is-hidden');
                bookSection.setAttribute('aria-hidden', 'true');
            };

            bookingLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showBooking();
                });
            });

            window.addEventListener('scroll', throttle(() => {
                if (revealLock || bookSection.classList.contains('is-hidden')) return;

                const rect = bookSection.getBoundingClientRect();
                const hasLeftView = rect.bottom < 90 || rect.top > window.innerHeight - 90;

                if (hasLeftView) {
                    hideBooking();
                }
            }, 120));
        },

        initVideoSwitcher() {
            const controlBtns = document.querySelectorAll('.about .controls .control-btn');
            const videoPlayer = document.querySelector('.about .video-container .video');
            const videoTitle = document.querySelector('#about-video-title');

            if (!controlBtns.length || !videoPlayer) return;

            const activateButton = (btn) => {
                const src = btn.getAttribute('data-src');
                if (src) {
                    videoPlayer.classList.add('is-switching');
                    window.setTimeout(() => {
                        videoPlayer.src = src;
                        videoPlayer.load();
                        videoPlayer.play().catch(() => {});
                        videoPlayer.classList.remove('is-switching');
                    }, 180);
                    controlBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (videoTitle) {
                        videoTitle.textContent = btn.getAttribute('data-label') || btn.textContent.trim();
                    }
                }
            };

            controlBtns.forEach(btn => {
                btn.addEventListener('click', () => activateButton(btn));
            });

            controlBtns[0].classList.add('active');
        },

        initActiveLinkObserver() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.header .navbar a');

            if (sections.length > 0 && navLinks.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.6
                };

                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const activeId = `#${entry.target.id}`;
                            navLinks.forEach(link => {
                                link.classList.toggle('active', link.getAttribute('href') === activeId);
                            });
                        }
                    });
                }, observerOptions);

                sections.forEach(section => {
                    sectionObserver.observe(section);
                });
            }
        },

        displayFormMessage(form, message, isSuccess = true) {
            const messageEl = form.querySelector('.form-message');
            if (!messageEl) return;

            messageEl.textContent = message;
            messageEl.className = 'form-message'; // Reset classes
            messageEl.classList.add(isSuccess ? 'success' : 'error', 'visible');

            setTimeout(() => {
                messageEl.classList.remove('visible');
            }, 4000);
        },

        initBookingForm() {
            const bookingForm = document.querySelector('#booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const destinationInput = bookingForm.querySelector('input[type="text"]');
                    const dateInput = bookingForm.querySelector('input[type="date"]');
                    const travelersInput = bookingForm.querySelector('input[type="number"]');

                    const destination = destinationInput.value.trim();
                    const date = dateInput.value;
                    const travelers = travelersInput.value;

                    const selectedDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (!destination || !date || !travelers) {
                        this.displayFormMessage(bookingForm, 'Tell us the basics so we can begin shaping your tour.', false);
                        return;
                    }

                    if (selectedDate < today) {
                        this.displayFormMessage(bookingForm, 'Choose an upcoming travel date for your journey.', false);
                        dateInput.focus();
                        return;
                    }

                    if (parseInt(travelers, 10) < 1) {
                        this.displayFormMessage(bookingForm, 'Add at least one traveler to start the plan.', false);
                        travelersInput.focus();
                        return;
                    }

                    this.displayFormMessage(bookingForm, 'Your travel dream is with us. The Travel Circle will contact you shortly.', true);
                    bookingForm.reset();
                });
            }
        },

        initNewsletterForm() {
            const newsletterForm = document.querySelector('#newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailInput = newsletterForm.querySelector('.email');
                    const email = emailInput.value.trim();

                    if (email && /^[^ \s@]+@[^ \s@]+\.[^ \s@]+$/.test(email)) {
                        this.displayFormMessage(newsletterForm, 'Welcome to The Travel Circle. Fresh travel ideas are on the way.', true);
                        emailInput.value = '';
                    } else {
                        this.displayFormMessage(newsletterForm, 'Please enter a valid email address for travel inspiration.', false);
                    }
                });
            }
        },

        initReviewSlider() {
            const slider = document.querySelector('.review .review-slider');
            const sliderContainer = document.querySelector('.review .box-container');
            const prevBtn = document.querySelector('#prev-review');
            const nextBtn = document.querySelector('#next-review');

            if (!sliderContainer || !prevBtn || !nextBtn) return;

            const slides = Array.from(sliderContainer.children);
            if (slides.length === 0) return;

            let currentIndex = 0;
            let autoPlayInterval;
            let touchStartX = 0;
            let touchEndX = 0;
            const swipeThreshold = 50; // Min pixels for a swipe

            const updateSliderPosition = () => {
                const slideWidth = slides[0].offsetWidth;
                const gap = parseFloat(getComputedStyle(sliderContainer).gap) || 0;
                sliderContainer.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSliderPosition();
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSliderPosition();
            };

            const startAutoPlay = () => {
                stopAutoPlay(); // Prevent multiple intervals
                autoPlayInterval = setInterval(nextSlide, 5000);
            };

            const stopAutoPlay = () => {
                clearInterval(autoPlayInterval);
            };

            const handleTouchStart = (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            };

            const handleTouchEnd = (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            };

            const handleSwipe = () => {
                if (touchEndX < touchStartX - swipeThreshold) {
                    nextSlide();
                }
                if (touchEndX > touchStartX + swipeThreshold) {
                    prevSlide();
                }
            };

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            slider.addEventListener('mouseenter', stopAutoPlay);
            slider.addEventListener('mouseleave', startAutoPlay);

            sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

            window.addEventListener('resize', throttle(updateSliderPosition, 200));
            updateSliderPosition();
            startAutoPlay();
        },

        initGalleryReveal() {
            const gallery = document.querySelector('.gallery');
            const loadMoreBtn = document.querySelector('#gallery-load-more');
            if (!gallery || !loadMoreBtn) return;

            const batchSize = 12;
            const revealNextBatch = () => {
                const hiddenItems = Array.from(gallery.querySelectorAll('.box.is-hidden')).slice(0, batchSize);

                hiddenItems.forEach((item) => {
                    item.classList.remove('is-hidden');
                    item.classList.add('is-entering');
                    window.setTimeout(() => item.classList.remove('is-entering'), 420);
                });

                if (!gallery.querySelector('.box.is-hidden')) {
                    loadMoreBtn.remove();
                }
            };

            loadMoreBtn.addEventListener('click', revealNextBatch);
        },

        initGalleryLightbox() {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxVideo = document.getElementById('lightbox-video');
            const lightboxStage = document.querySelector('.lightbox-stage');
            const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
            const galleryItems = document.querySelectorAll('.gallery .box');
            const closeBtn = document.querySelector('.lightbox .close-btn');

            if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxStage || !lightboxBackdrop || !closeBtn || galleryItems.length === 0) return;

            const gallerySources = Array.from(galleryItems).map(item => ({
                type: item.dataset.type || 'image',
                src: item.dataset.src
            }));
            let currentImageIndex = 0;
            let lastFocusedElement;
            let focusTrapReady = false;
            let previousBodyOverflow = '';
            let dragStartY = 0;
            let dragCurrentY = 0;
            let isDragging = false;

            const selectedMedia = () => {
                const current = gallerySources[currentImageIndex];
                return current.type === 'video' ? lightboxVideo : lightboxImg;
            };

            const lockPageScroll = () => {
                previousBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            };

            const unlockPageScroll = () => {
                document.body.style.overflow = previousBodyOverflow || '';
            };

            const animateFromTile = (sourceElement) => {
                if (!sourceElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

                const sourceMedia = sourceElement.querySelector('img, video') || sourceElement;
                const media = selectedMedia();

                const runAnimation = () => {
                    window.requestAnimationFrame(() => {
                        const startRect = sourceMedia.getBoundingClientRect();
                        const endRect = media.getBoundingClientRect();
                        if (!startRect.width || !startRect.height || !endRect.width || !endRect.height) return;

                        const deltaX = startRect.left - endRect.left;
                        const deltaY = startRect.top - endRect.top;
                        const scaleX = startRect.width / endRect.width;
                        const scaleY = startRect.height / endRect.height;

                        media.animate([
                            {
                                transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
                                borderRadius: '1.2rem',
                                opacity: .7
                            },
                            {
                                transform: 'translate(0, 0) scale(1, 1)',
                                borderRadius: '1.2rem',
                                opacity: 1
                            }
                        ], {
                            duration: 520,
                            easing: 'cubic-bezier(.16, 1, .3, 1)'
                        });
                    });
                };

                if (media.tagName === 'IMG' && !media.complete) {
                    media.addEventListener('load', runAnimation, { once: true });
                } else {
                    runAnimation();
                }
            };

            const openLightbox = (index, sourceElement) => {
                lastFocusedElement = document.activeElement;
                currentImageIndex = index;
                updateLightboxMedia();
                lightbox.classList.add('active');
                lockPageScroll();
                animateFromTile(sourceElement);
                document.addEventListener('keydown', handleKeydown);
                trapFocus();
            };

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                lightboxStage.style.transform = '';
                lightbox.classList.remove('show-video');
                lightboxVideo.pause();
                lightboxVideo.removeAttribute('src');
                lightboxImg.removeAttribute('src');
                unlockPageScroll();
                document.removeEventListener('keydown', handleKeydown);
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                }
            };

            const updateLightboxMedia = () => {
                const current = gallerySources[currentImageIndex];
                lightbox.classList.toggle('show-video', current.type === 'video');

                if (current.type === 'video') {
                    lightboxImg.removeAttribute('src');
                    lightboxVideo.src = current.src;
                    lightboxVideo.load();
                } else {
                    lightboxVideo.pause();
                    lightboxVideo.removeAttribute('src');
                    lightboxImg.src = current.src;
                }
            };

            const showNextImage = () => {
                currentImageIndex = (currentImageIndex + 1) % gallerySources.length;
                updateLightboxMedia();
            };

            const showPrevImage = () => {
                currentImageIndex = (currentImageIndex - 1 + gallerySources.length) % gallerySources.length;
                updateLightboxMedia();
            };

            const trapFocus = () => {
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                firstFocusable.focus();

                if (focusTrapReady) return;
                focusTrapReady = true;

                lightbox.addEventListener('keydown', (e) => {
                    if (e.key !== 'Tab') return;

                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                });
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            };

            const beginDrag = (e) => {
                if (!lightbox.classList.contains('active') || lightbox.classList.contains('show-video')) return;
                isDragging = true;
                dragStartY = e.clientY;
                dragCurrentY = 0;
                lightboxStage.setPointerCapture(e.pointerId);
                lightbox.classList.add('is-dragging');
            };

            const moveDrag = (e) => {
                if (!isDragging) return;
                dragCurrentY = e.clientY - dragStartY;
                const opacity = Math.max(.35, 1 - Math.abs(dragCurrentY) / 360);
                lightboxStage.style.transform = `translateY(${dragCurrentY}px) scale(${Math.max(.92, opacity)})`;
                lightbox.style.setProperty('--lightbox-opacity', opacity);
            };

            const endDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                lightbox.classList.remove('is-dragging');
                lightbox.style.removeProperty('--lightbox-opacity');

                if (Math.abs(dragCurrentY) > 110) {
                    closeLightbox();
                    return;
                }

                lightboxStage.style.transform = '';
            };

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(index, item));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index, item);
                    }
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightboxBackdrop.addEventListener('click', closeLightbox);
            lightboxStage.addEventListener('click', (e) => {
                if (e.target === lightboxStage) {
                    closeLightbox();
                }
            });
            lightboxStage.addEventListener('pointerdown', beginDrag);
            lightboxStage.addEventListener('pointermove', moveDrag);
            lightboxStage.addEventListener('pointerup', endDrag);
            lightboxStage.addEventListener('pointercancel', endDrag);
        }
    };

    app.init();
});
(() => {
    document.documentElement.style.scrollBehavior = 'auto';

    const applyNativeScroll = () => {
        document.body.classList.add('native-scroll');
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
    };

    if (document.body) {
        applyNativeScroll();
    } else {
        document.addEventListener('DOMContentLoaded', applyNativeScroll, { once: true });
    }

    const nativeScrollTo = window.scrollTo.bind(window);
    window.scrollTo = (...args) => {
        if (typeof args[0] === 'object' && args[0] !== null) {
            nativeScrollTo({ ...args[0], behavior: 'auto' });
            return;
        }
        nativeScrollTo(...args);
    };

    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoViewNative(options) {
        if (typeof options === 'object' && options !== null) {
            nativeScrollIntoView.call(this, { ...options, behavior: 'auto' });
            return;
        }
        nativeScrollIntoView.call(this, options);
    };

    const keepTopHeaderHonest = () => {
        const header = document.querySelector('.header');
        const hero = document.querySelector('#home');
        if (!header || !hero) return;

        const heroBox = hero.getBoundingClientRect();
        const atHeroTop = window.scrollY <= 12 || (heroBox.top <= 0 && heroBox.bottom > window.innerHeight * .72);
        document.body.classList.toggle('at-hero-top', atHeroTop);
        header.classList.toggle('scrolled', !atHeroTop);
    };

    window.addEventListener('wheel', (event) => {
        if (!event.ctrlKey) event.stopImmediatePropagation();
    }, { capture: true, passive: true });

    window.addEventListener('touchmove', (event) => {
        event.stopImmediatePropagation();
    }, { capture: true, passive: true });

    window.addEventListener('scroll', keepTopHeaderHonest, { passive: true });
    window.addEventListener('resize', keepTopHeaderHonest, { passive: true });
    window.addEventListener('load', keepTopHeaderHonest, { once: true });
    document.addEventListener('DOMContentLoaded', keepTopHeaderHonest, { once: true });
})();
(() => {
    const normalizeImageSrc = (src) => {
        try {
            const url = new URL(src, window.location.href);
            url.search = '';
            url.hash = '';
            return url.href;
        } catch (error) {
            return src;
        }
    };

    const initMobileStoryGallery = () => {
        const gallery = document.querySelector('#gallery') || Array.from(document.querySelectorAll('section')).find((section) => {
            const text = section.textContent.toLowerCase();
            return text.includes('journey moments') || text.includes('memories from every mile') || text.includes('gallery');
        });

        if (!gallery || gallery.querySelector('.mobile-story-gallery')) return;

        const source = gallery.querySelector('.gallery-grid, .gallery-masonry, .gallery-list, .gallery-cards, .photo-grid, .gallery-wrapper, .gallery-content') ||
            Array.from(gallery.children).find((child) => child.querySelectorAll && child.querySelectorAll('img').length >= 3);

        const images = Array.from(gallery.querySelectorAll('img'))
            .filter((img) => {
                const src = img.getAttribute('src') || '';
                const alt = (img.getAttribute('alt') || '').toLowerCase();
                return src && !src.toLowerCase().includes('logo') && !alt.includes('logo');
            })
            .reduce((items, img) => {
                const src = normalizeImageSrc(img.currentSrc || img.src || img.getAttribute('src'));
                if (!items.some((item) => item.key === src)) {
                    items.push({
                        key: src,
                        src: img.getAttribute('src') || img.src,
                        alt: img.getAttribute('alt') || 'The Travel Circle journey memory'
                    });
                }
                return items;
            }, [])
            .slice(0, 5);

        if (images.length < 3) return;

        gallery.classList.add('mobile-gallery-enhanced');
        Array.from(gallery.querySelectorAll('h1, h2, h3, p, .section-title, .section-subtitle, .section-heading, .section-header')).forEach((node) => {
            if (node.closest('.mobile-story-gallery')) return;
            const text = (node.textContent || '').toLowerCase();
            if (text.includes('journey moments') || text.includes('memories from every mile')) {
                node.setAttribute('data-mobile-gallery-heading', 'true');
                const parent = node.parentElement;
                if (parent && parent !== gallery && parent.querySelectorAll('h1, h2, h3, p').length <= 3) {
                    parent.setAttribute('data-mobile-gallery-heading-wrap', 'true');
                }
            }
        });
        if (source) {
            source.setAttribute('data-mobile-gallery-source', 'true');
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-story-gallery';
        wrapper.innerHTML = `
            <div class="mobile-story-copy">
                <p class="mobile-story-eyebrow">Journey moments</p>
                <h3 class="mobile-story-title">Memories from every <span>mile</span></h3>
            </div>
            <div class="mobile-story-stage" aria-label="Featured travel memories">
                ${images.map((image, index) => `
                    <figure class="mobile-story-card" tabindex="0">
                        <img src="${image.src}" alt="${image.alt || `Travel memory ${index + 1}`}" loading="lazy">
                    </figure>
                `).join('')}
            </div>
            <div class="mobile-story-actions">
                <button class="mobile-story-more" type="button">View more memories</button>
            </div>
        `;

        if (source && source.parentNode) {
            source.parentNode.insertBefore(wrapper, source);
        } else {
            gallery.appendChild(wrapper);
        }

        const button = wrapper.querySelector('.mobile-story-more');
        button.addEventListener('click', () => {
            const expanded = gallery.classList.toggle('mobile-gallery-expanded');
            button.textContent = expanded ? 'Show featured moments' : 'View more memories';
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileStoryGallery, { once: true });
    } else {
        initMobileStoryGallery();
    }

    window.addEventListener('load', initMobileStoryGallery, { once: true });
})();
(() => {
    const uniqueImageItems = (root) => {
        const seen = new Set();
        return Array.from(root.querySelectorAll('img'))
            .filter((img) => {
                const src = img.getAttribute('src') || '';
                const alt = (img.getAttribute('alt') || '').toLowerCase();
                return src && !src.toLowerCase().includes('logo') && !alt.includes('logo');
            })
            .map((img) => {
                const card = img.closest('article, .card, .destination-card, .destination-item, .swiper-slide, li, figure, div') || img.parentElement;
                const titleNode = card ? card.querySelector('h1, h2, h3, h4, h5, strong, .title, .card-title, .destination-title') : null;
                let title = titleNode ? titleNode.textContent.trim() : (img.getAttribute('alt') || '').trim();
                title = title.replace(/\s+/g, ' ').replace(/^(image of|photo of)\s+/i, '');
                const fallbackTitles = ['Snow Trails', 'Mountain Skies', 'Sacred Heights', 'River Roads', 'Coastal Calm'];
                if (!title || /^escape\s+\d+$/i.test(title) || title.length > 34) title = fallbackTitles[seen.size] || `Circle ${seen.size + 1}`;
                return {
                    src: img.getAttribute('src') || img.src,
                    title,
                    key: (img.getAttribute('src') || img.src).split('?')[0]
                };
            })
            .filter((item) => {
                if (seen.has(item.key)) return false;
                seen.add(item.key);
                return true;
            })
            .slice(0, 5);
    };

    const initMobileDestinationAccordion = () => {
        const sections = Array.from(document.querySelectorAll('section, main > div, .section'));
        const destination = sections.find((section) => {
            const text = (section.textContent || '').toLowerCase();
            return text.includes('handpicked escapes') || text.includes('choose your next circle') || (text.includes('destination') && section.querySelectorAll('img').length >= 3);
        });

        if (!destination || destination.querySelector('.mobile-destination-accordion')) return;

        const source = destination.querySelector('.destination-grid, .destinations-grid, .destination-cards, .cards-grid, .cards, .grid, .swiper, .destination-wrapper') ||
            Array.from(destination.children).find((child) => child.querySelectorAll && child.querySelectorAll('img').length >= 3);

        const items = uniqueImageItems(source || destination);
        if (items.length < 3) return;

        destination.classList.add('destinations-mobile-enhanced');
        Array.from(destination.querySelectorAll('h1, h2, h3, p, .section-title, .section-subtitle, .section-heading, .section-header')).forEach((node) => {
            if (node.closest('.mobile-destination-accordion')) return;
            const text = (node.textContent || '').toLowerCase();
            if (text.includes('handpicked escapes') || text.includes('choose your next circle') || text.includes('circle on the map')) {
                node.setAttribute('data-mobile-destination-heading', 'true');
                const parent = node.parentElement;
                if (parent && parent !== destination && parent.querySelectorAll('h1, h2, h3, p').length <= 4) {
                    parent.setAttribute('data-mobile-destination-heading-wrap', 'true');
                }
            }
        });
        if (source) source.setAttribute('data-mobile-destination-source', 'true');

        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-destination-accordion';
        wrapper.innerHTML = `
            <div class="mobile-destination-shell">
                <div class="mobile-destination-copy">
                    <p class="mobile-destination-eyebrow">Handpicked escapes</p>
                    <h3 class="mobile-destination-title">Choose your next <span>circle</span> on the map</h3>
                    <p class="mobile-destination-text">Swipe through our most loved routes and tap a place to open the frame.</p>
                </div>
                <div class="mobile-destination-track" aria-label="Handpicked destination accordion">
                    ${items.map((item, index) => `
                        <button class="mobile-destination-item${index === Math.min(2, items.length - 1) ? ' is-active' : ''}" type="button" aria-label="${item.title}">
                            <img src="${item.src}" alt="${item.title}" loading="lazy">
                            <span class="mobile-destination-name">${item.title}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        if (source && source.parentNode) {
            source.parentNode.insertBefore(wrapper, source);
        } else {
            destination.appendChild(wrapper);
        }

        const buttons = Array.from(wrapper.querySelectorAll('.mobile-destination-item'));
        buttons.forEach((button) => {
            const activate = () => {
                buttons.forEach((item) => item.classList.remove('is-active'));
                button.classList.add('is-active');
                button.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
            };
            button.addEventListener('click', activate);
            button.addEventListener('mouseenter', activate);
            button.addEventListener('focus', activate);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileDestinationAccordion, { once: true });
    } else {
        initMobileDestinationAccordion();
    }

    window.addEventListener('load', initMobileDestinationAccordion, { once: true });
})();
(() => {
    const fixMobileTabletSections = () => {
        if (!window.matchMedia('(max-width: 1024px)').matches) return;

        const sectionSelectors = [
            '#services',
            '.services',
            '.services-section',
            '#blogs',
            '.blogs',
            '.blog-section',
            '.blogs-section',
            '.cta-section',
            '.journey-cta',
            '.plan-section',
            '.booking-cta'
        ];

        document.querySelectorAll(sectionSelectors.join(',')).forEach((section) => {
            section.classList.add('mobile-content-ready');
            section.style.minHeight = 'auto';
            section.style.height = 'auto';
            section.style.opacity = '1';
            section.style.visibility = 'visible';

            section.querySelectorAll('[style*="opacity"], [style*="visibility"], .reveal, .scroll-reveal, .fade-in, .fade-up, .hidden, .is-hidden').forEach((node) => {
                node.classList.remove('hidden', 'is-hidden');
                node.style.opacity = '1';
                node.style.visibility = 'visible';
                node.style.transform = 'none';
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixMobileTabletSections, { once: true });
    } else {
        fixMobileTabletSections();
    }

    window.addEventListener('load', fixMobileTabletSections, { once: true });
    window.addEventListener('resize', fixMobileTabletSections, { passive: true });
})();
