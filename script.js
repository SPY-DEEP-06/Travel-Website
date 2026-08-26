const templates = {
    mediaBase: 'images/ttc/',

    getImages() {
        return (window.ttcMedia && window.ttcMedia.images) || [];
    },

    getVideos() {
        return (window.ttcMedia && window.ttcMedia.videos) || [];
    },

    mediaSrc(fileName) {
        if (!fileName) return '';
        if (fileName.startsWith('images/') || fileName.startsWith('http')) return encodeURI(fileName);
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
        const usePortrait = window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches || window.matchMedia('(max-width: 768px)').matches;
        const videoSrc = usePortrait
            ? 'assets/loading/portrait_Loading_animation_travel_website…_1080p_202606260037.mp4'
            : 'assets/loading/landscape_Loading_animation_travel_website…_1080p_202606260037.mp4';
        return `
<div class="site-loader" id="site-loader" aria-label="Loading The Travel Circle">
    <video class="site-loader-video" src="${videoSrc}" muted autoplay loop playsinline webkit-playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback"></video>
    <div class="site-loader-shade"></div>
</div>`;
    },

    createHeader() {
        const images = this.getImages().filter(image => !this.isDuplicateGalleryMedia(image));
        const previewFallback = images[0] || 'images/logoTTC.png';
        const previewFor = (index) => this.mediaSrc(images[index] || previewFallback);
        const navItems = [
            ['Home', '#home', previewFor(8), 'Begin The Circle', '1'],
            ['About', '#about', previewFor(35), 'Meet The Travel Circle', '2'],
            ['Destination', '#destination', previewFor(48), 'Handpicked Escapes', '3'],
            ['Services', '#services', previewFor(63), 'Plans With Polish', '4'],
            ['Gallery', '#gallery', previewFor(76), 'Moments Worth Keeping', '5'],
            ['Vlogs', '#vlogs', previewFor(100), 'Travel Experiences & Reels', '1'],
            ['Blogs', '#blogs', previewFor(92), 'Stories Before You Pack', '2'],
            ['Contact', '#contact', previewFor(112), 'Talk To The Travel Circle', '3']
        ];

        const topNavLinks = navItems.map(([title, href, preview, label], index) => `
            <a data-aos="zoom-in-left" data-aos-delay="${250 + index * 70}" href="${href}" class="menu-link-item roll-link" data-preview="${preview}" data-preview-title="${label}">${this.rollText(title)}</a>`).join('');

        const overlayNavLinks = navItems.map(([title, href, preview, label, shape], index) => `
            <li class="menu-list-item" data-shape="${shape}" data-preview="${preview}" data-preview-title="${label}">
                <a href="${href}" class="nav-link menu-link-item roll-link w-inline-block">
                    <p class="nav-link-text">${this.rollText(title)}</p>
                    <div class="nav-link-hover-bg"></div>
                </a>
            </li>`).join('');

        return `
<header class="header atelier-header ttc-modern-header">
    <a data-aos="zoom-in-left" data-aos-delay="150" href="#home" class="logo header-logo ttc-direct-logo" aria-label="The Travel Circle Home">
        <img src="images/logoTTC.png" alt="The Travel Circle logo" class="ttc-original-logo-img">
        <span class="brand-title-text">The Travel Circle</span>
    </a>
    <nav class="navbar" id="navbar">
        <div class="nav-links">
            ${topNavLinks}
        </div>
    </nav>
    <div class="header-actions">
        <a data-aos="zoom-in-left" data-aos-delay="850" href="#contact" class="reach-link">Reach Out</a>
        <a data-aos="zoom-in-left" data-aos-delay="950" href="#book-form" class="talk-btn">Plan My Tour</a>
        <button id="menu-btn" role="button" class="nav-close-btn kinetic-menu-btn" aria-label="Toggle menu" aria-expanded="false">
            <div class="menu-button-text">
                <p class="p-large">Menu</p>
                <p class="p-large">Close</p>
            </div>
            <div class="icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" class="menu-button-icon">
                    <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                    <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                    <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                    <path d="M10 7.33333L8.66667 8.66667L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                    <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                    <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                </svg>
            </div>
        </button>
    </div>
</header>

<section class="fullscreen-menu-container">
    <div data-nav="closed" class="nav-overlay-wrapper">
        <button id="menu-close-cross" type="button" class="menu-close-cross-btn" aria-label="Close menu"><i class="fas fa-times"></i></button>
        <div class="overlay"></div>
        <nav class="menu-content">
            <div class="menu-bg">
                <div class="backdrop-layer first"></div>
                <div class="backdrop-layer second"></div>
                <div class="backdrop-layer"></div>

                <div class="ambient-background-shapes">
                    <svg class="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                        <circle class="shape-element" cx="80" cy="120" r="40" fill="rgba(99,102,241,0.18)" />
                        <circle class="shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.15)" />
                        <circle class="shape-element" cx="200" cy="300" r="80" fill="rgba(236,72,153,0.12)" />
                        <circle class="shape-element" cx="350" cy="280" r="30" fill="rgba(99,102,241,0.18)" />
                    </svg>
                    <svg class="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                        <path class="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(99,102,241,0.22)" stroke-width="60" fill="none" />
                        <path class="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(139,92,246,0.18)" stroke-width="40" fill="none" />
                    </svg>
                    <svg class="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                        <circle class="shape-element" cx="50" cy="50" r="8" fill="rgba(99,102,241,0.3)" />
                        <circle class="shape-element" cx="150" cy="50" r="8" fill="rgba(139,92,246,0.3)" />
                        <circle class="shape-element" cx="250" cy="50" r="8" fill="rgba(236,72,153,0.3)" />
                        <circle class="shape-element" cx="350" cy="50" r="8" fill="rgba(99,102,241,0.3)" />
                        <circle class="shape-element" cx="100" cy="150" r="12" fill="rgba(139,92,246,0.25)" />
                        <circle class="shape-element" cx="200" cy="150" r="12" fill="rgba(236,72,153,0.25)" />
                        <circle class="shape-element" cx="300" cy="150" r="12" fill="rgba(99,102,241,0.25)" />
                    </svg>
                    <svg class="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                        <path class="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(99,102,241,0.15)" />
                        <path class="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(236,72,153,0.12)" />
                    </svg>
                    <svg class="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                        <line class="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.18)" stroke-width="30" />
                        <line class="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(139,92,246,0.15)" stroke-width="25" />
                        <line class="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(236,72,153,0.12)" stroke-width="20" />
                    </svg>
                </div>
            </div>

            <div class="menu-content-wrapper">
                <ul class="menu-list">
                    ${overlayNavLinks}
                </ul>
            </div>

            <div class="nav-preview" aria-hidden="true">
                <div class="nav-preview-media">
                    <img src="${navItems[0][2]}" alt="Preview backdrop">
                </div>
                <strong>${navItems[0][3]}</strong>
            </div>
        </nav>
    </div>
</section>`;
    },

    createHome() {
        const heroVideo = this.mediaSrc('images/about-vid-2.mp4');
        const heroPoster = this.mediaSrc('images/national/Kashmir/1.jpg');

        return `
<section class="home" id="home">
    <video class="hero-video" src="${heroVideo}" poster="${heroPoster}" muted autoplay loop playsinline webkit-playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" aria-hidden="true"></video>
    <div class="hero-overlay"></div>
    <div class="content atelier-hero-content">
        <span class="hero-eyebrow" data-aos="fade-up" data-aos-delay="100">YOUR JOURNEY STARTS HERE</span>
        <h1 data-aos="fade-up" data-aos-delay="200">
            We're Officially<br>
            <em>Taking Off.</em>
        </h1>
        <p data-aos="fade-up" data-aos-delay="350">Welcome to <strong>The Travel Circle</strong> — your trusted partner in creating unforgettable journeys.<br class="desktop-break">Whether it's a relaxing beach escape, a thrilling adventure, a family vacation, a romantic honeymoon, or an international getaway, we're here to turn your travel dreams into reality.</p>

        <div class="hero-actions" data-aos="fade-up" data-aos-delay="500">
            <a href="#book-form" class="hero-primary">Start My Journey
                <svg viewBox="0 0 24 24" aria-hidden="true" class="cta-arrow"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
        </div>
    </div>
</section>`;
    },

    createBookingForm() {
        return `
<section class="book-form is-hidden" id="book-form" aria-hidden="true">
    <form action="" id="booking-form" novalidate>
        <h2 class="form-title">
            <span class="title-text"><i class="fas fa-paper-plane"></i> Plan Your Journey / Tour Request</span>
            <button type="button" class="form-close-btn" id="close-book-form" aria-label="Close Tour Form"><i class="fas fa-times"></i></button>
        </h2>
        <div class="inputBox">
            <span><i class="fas fa-map-marker-alt"></i> Dream Destination</span>
            <input type="text" id="book-destination" placeholder="City, State, Country, or Experience" required autocomplete="off">
        </div>
        <div class="inputBox">
            <span><i class="fas fa-phone-alt"></i> Contact Number <small class="label-compulsory">(Compulsory)</small></span>
            <input type="tel" id="book-contact" placeholder="Enter 10-digit Contact Number (e.g. 8108776019)" required autocomplete="tel">
        </div>
        <div class="inputBox">
            <span><i class="fas fa-envelope"></i> Email Address <small class="label-optional">(Optional)</small></span>
            <input type="email" id="book-email" placeholder="Enter Email Address (optional)" autocomplete="email">
        </div>
        <div class="inputBox date-range-box">
            <span><i class="fas fa-calendar-alt"></i> Travel Dates (From - To Range)</span>
            <div class="date-inputs">
                <input type="date" id="book-date-from" aria-label="Going Date (From)" required>
                <span class="date-sep">to</span>
                <input type="date" id="book-date-to" aria-label="Coming Date (To)" required>
            </div>
        </div>
        <div class="inputBox">
            <span><i class="fas fa-users"></i> Travelers</span>
            <input type="number" id="book-travelers" placeholder="Number of Guests" min="1" required>
        </div>
        <button type="submit" class="btn form-submit-btn">Submit Tour Plan <i class="fas fa-paper-plane"></i></button>
        <div class="form-message"></div>
    </form>
</section>`;
    },
    
    createAbout() {
        const aboutFilms = [
            ['images/VID_20240316_100533931.mp4', 'Grand Horizon'],
            ['images/about-vid-1.mp4', 'Coastal Paradise'],
            ['images/about-vid-3.mp4', 'Mountain Vista']
        ];
        const firstVideo = this.mediaSrc(aboutFilms[0][0]);
        const firstVideoPoster = this.mediaSrc('images/national/Himachal/1.jpg');
        const videoControls = aboutFilms.map(([video, label], index) => `
            <button class="control-btn${index === 0 ? ' active' : ''}" data-src="${this.mediaSrc(video)}" data-label="${label}" aria-label="Play ${label}"></button>`).join('');

        return `
<section class="about" id="about">
    <div class="video-container">
        <video src="${firstVideo}" poster="${firstVideoPoster}" muted autoplay loop playsinline webkit-playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" class="video"></video>
        <div class="controls" role="group" aria-label="Video selection controls">
            ${videoControls}
        </div>
    </div>
    <div class="content">
        <span>about us</span>
        <h3>Crafting Unforgettable Journeys</h3>
        <p>At The Travel Circle, we believe that travel is not just about reaching a destination—it's about creating memories, discovering new cultures, and experiencing the world in meaningful ways. Founded with a passion for exploration and a commitment to exceptional service, our mission is to turn every travel dream into an unforgettable journey.</p>
        <p>We understand that every traveller is unique, and so are their travel aspirations. Whether you're planning a relaxing beach escape, an exciting adventure, a romantic honeymoon, a family vacation, a corporate retreat, or an international getaway, we create personalized travel experiences tailored to your preferences, budget, and interests.</p>
        <p>Our team is dedicated to making travel plans simple, seamless, and stress-free. From flight and hotel bookings to visa assistance, curated holiday packages, cruise vacations, group tours, and customized itineraries, we take care of every detail so you can focus on enjoying your journey.</p>
        
        <div class="about-vision-mission">
            <div class="about-card" data-aos="fade-right">
                <h4><i class="fas fa-eye"></i> Our Vision</h4>
                <p>To be the most trusted travel partner, inspiring people to explore the world by delivering exceptional, personalized, and unforgettable travel experiences.</p>
            </div>
            <div class="about-card" data-aos="fade-left">
                <h4><i class="fas fa-bullseye"></i> Our Mission</h4>
                <p>To provide personalized, reliable, and hassle-free travel experiences that turn every journey into a memorable and meaningful adventure.</p>
            </div>
        </div>
    </div>
</section>`;
    },

    createWhyChooseUs() {
        return `
<section class="why-choose-us" id="why-us">
    <div class="heading">
        <span>our values</span>
        <h1>why travel with the circle?</h1>
    </div>
    <div class="box-container">
        <div class="box" data-aos="fade-up" data-aos-delay="150">
            <i class="fas fa-user-check"></i>
            <h3>Personalized Experiences</h3>
            <p>Every journey is thoughtfully designed to match your preferences, interests, budget, and travel aspirations.</p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="300">
            <i class="fas fa-compass"></i>
            <h3>Expert Travel Guidance</h3>
            <p>Our experienced travel experts provide valuable insights and recommendations to help you choose the perfect destination.</p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="450">
            <i class="fas fa-tags"></i>
            <h3>Competitive Pricing</h3>
            <p>We offer the best value for your money through competitive pricing and special deals without compromising quality.</p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="600">
            <i class="fas fa-route"></i>
            <h3>End-to-End Planning</h3>
            <p>From the initial planning stage to your safe return home, we manage every aspect of your trip for a seamless experience.</p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="750">
            <i class="fas fa-map-marked-alt"></i>
            <h3>Curated Holiday Packages</h3>
            <p>We curate a wide range of customized holiday packages across India and around the world to suit every type of traveller.</p>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="900">
            <i class="fas fa-award"></i>
            <h3>Attention to Every Detail</h3>
            <p>Our committed team provides personalized assistance and takes care of every detail to ensure a memorable journey.</p>
        </div>
    </div>
    <div class="why-choose-us-tagline" data-aos="zoom-in">
        "At The Travel Circle, we don't just plan trips—we create experiences that stay with you forever."
    </div>
</section>`;
    },

    createDestination() {
        const images = this.getImages();
        
        const domesticDestinations = [
            {
                title: 'Goa',
                folder: 'GOA',
                vibe: 'Beaches, nightlife, and water sports.',
                custom: 'Beach resorts, cruise parties, and heritage chapel tours.'
            },
            {
                title: 'Kashmir',
                folder: 'KASHMIR',
                vibe: 'The "Paradise on Earth" with stunning landscapes.',
                custom: 'Shikara rides on Dal Lake, Gulmarg gondola rides, and Pahalgam valley stays.'
            },
            {
                title: 'Manali',
                folder: 'MANALI',
                vibe: 'Adventure, snow, and mountain retreats.',
                custom: 'Solang valley sports, Rohtang pass snow tours, and riverside pine stays.'
            },
            {
                title: 'Udaipur',
                folder: 'Udaipur',
                vibe: 'The City of Lakes and royal heritage.',
                custom: 'Palace stays, Lake Pichola sunset boat tours, and Marwari cultural dinners.'
            },
            {
                title: 'Jaipur',
                folder: 'JAIPUR',
                vibe: 'Palaces, forts, and rich culture.',
                custom: 'Amer fort elephant rides, Pink City heritage walks, and royal dining.'
            },
            {
                title: 'Keralam',
                folder: 'KERALAM',
                vibe: 'Backwaters, beaches, and Ayurveda.',
                custom: 'Alleppey luxury houseboat stays, Munnar tea plantation tours, and Kovalam wellness retreats.'
            },
            {
                title: 'Andaman & Nicobar',
                folder: 'Andaman Nicobar',
                vibe: 'Crystal-clear waters and island escapes.',
                custom: 'Radhanagar beach escapes, Havelock scuba diving, and Cellular Jail light shows.'
            },
            {
                title: 'Leh Ladakh',
                folder: 'Leh Ladakh',
                vibe: 'Scenic high-altitude landscapes and adventure tourism.',
                custom: 'Pangong Tso lake camping, Khardung La bike expeditions, and Nubra valley camel safaris.',
                isLeh: true
            },
            {
                title: 'Uttarakhand - The Land of Divine Peaks',
                folder: 'Uttrakhand',
                vibe: 'Snow-capped Himalayas, sacred pilgrimage sites, serene lakes, charming hill stations, and thrilling adventure escapes.',
                custom: 'Spiritual journeys to Char Dham, luxury stays in Mussoorie and Nainital, wildlife safaris in Jim Corbett National Park, and adventure-filled itineraries featuring river rafting, trekking, camping, and skiing.'
            },
            {
                title: 'The Seven Sisters - India\'s Untouched Paradise',
                folder: 'Seven sisters',
                vibe: 'Pristine landscapes, rolling tea gardens, cascading waterfalls, vibrant tribal cultures, dense forests, and breathtaking mountain scenery.',
                custom: 'Curated Northeast expeditions covering Meghalaya, Arunachal Pradesh, Assam, Nagaland, Manipur, Mizoram, and Tripura, living root bridge treks, Kaziranga wildlife safaris, Tawang monastery tours, and authentic cultural immersion experiences.'
            },
            {
                title: 'Rann of Kutch - The White Desert Wonderland',
                folder: 'RANN of Kuch',
                vibe: 'Endless white salt plains, colorful cultural heritage, vibrant handicrafts, folk music, and mesmerizing desert sunsets.',
                custom: 'Exclusive Rann Utsav experiences, luxury tent accommodations, handicraft village tours, camel safaris, stargazing evenings, and customized Gujarat cultural circuits including Bhuj and Mandvi.'
            },
            {
                title: 'Kasol',
                folder: 'Kasol',
                vibe: 'Scenic Parvati Valley views, lush pine forests, and chilled mountain vibes.',
                custom: 'Trek to Kheerganga, Manikaran hot springs, and Israel-flavored cafes.'
            },
            {
                title: 'Darjeeling',
                folder: 'Darjeeling',
                vibe: 'Tea gardens and Himalayan views.',
                custom: 'Toy train rides, Tiger Hill sunrise views, and tea estate walks.'
            },
            {
                title: 'Maharashtra',
                folder: 'Maharastra',
                vibe: 'Beaches, hill stations, heritage sites, vineyards, and city experience.',
                custom: 'Lonavala & Mahabaleshwar retreats, Nashik vineyard tours, and Konkan coastal drives.'
            },
            {
                title: 'Odisha',
                folder: 'Odisha',
                vibe: 'Spiritual, heritage, cultural, and wildlife experience.',
                custom: 'Jagannath Puri pilgrimage, Konark Sun Temple tours, and Chilika Lake bird watching.'
            }
        ];
        
        const internationalDestinations = [
            {
                title: 'Singapore',
                folder: 'Singapore',
                vibe: 'Vibrant tropical megacity, iconic skyline, Gardens by the Bay, Marina Bay Sands, world-class dining and shopping.',
                custom: 'Luxury Singapore city tour, Night Safari, Universal Studios, and Sentosa Island getaway.'
            },
            {
                title: 'Malaysia',
                folder: 'Malaysia',
                vibe: 'Modern skylines, misty highlands, ancient rainforests, and rich multicultural heritage.',
                custom: 'Petronas Twin Towers, Batu Caves, Genting Highlands cable car, and Langkawi beach resorts.'
            },
            {
                title: 'Thailand',
                folder: 'thailand',
                vibe: 'Golden temples, bustling street markets, tropical islands, and legendary Thai hospitality.',
                custom: 'Bangkok Grand Palace, Phuket beach escapes, Phi Phi island cruises, and Chiang Mai retreats.'
            },
            {
                title: 'Dubai',
                folder: 'dubai',
                vibe: 'Luxury shopping, desert safaris, and iconic sky-high architecture.',
                custom: 'Burj Khalifa observation deck, desert dune bashing, Dubai Marina yacht cruises, and Miracle Garden tours.'
            },
            {
                title: 'Bali',
                folder: 'Bali',
                vibe: 'Tropical paradise, volcanic landscapes, wellness retreats, and vibrant beach culture.',
                custom: 'Ubud jungle villas, Tanah Lot sunsets, Nusa Penida island tours, and sacred water temple blessings.'
            },
            {
                title: 'Vietnam',
                folder: 'Vietnam',
                vibe: 'Natural beauty, emerald bays, lush rice terraces, and rich historical heritage.',
                custom: 'Ha Long Bay overnight cruises, Hoi An lantern city walks, Hanoi Old Quarter tours, and Mekong delta excursions.'
            },
            {
                title: 'Sri Lanka - The Pearl of the Indian Ocean',
                folder: 'srilanka',
                vibe: 'Golden beaches, misty tea plantations, ancient heritage sites, lush rainforests, and wildlife safaris.',
                custom: 'Scenic train journeys through Ella, cultural tours of Kandy and Sigiriya, beach escapes in Bentota, and Yala National Park wildlife safaris.'
            },
            {
                title: 'Azerbaijan - Where Europe Meets Asia',
                folder: 'azerbaijaan',
                vibe: 'Modern cityscapes, ancient Silk Route heritage, dramatic mountain landscapes, and Caspian Sea coastline.',
                custom: 'Luxury Baku city tours, Gobustan mud volcano excursions, Shahdag mountain retreats, and Gabala nature escapes.'
            }
        ];

        const domesticCards = domesticDestinations.map((dest, index) => {
            const destMap = window.ttcMedia && window.ttcMedia.destinations;
            const folderImages = (destMap && dest.folder && destMap[dest.folder]) || [];
            const fallbackIndex = (index * 3) % (images.length || 1);
            
            const img1 = this.mediaSrc(folderImages[0] || images[fallbackIndex] || '');
            const img2 = this.mediaSrc(folderImages[1] || folderImages[0] || images[fallbackIndex + 1] || img1);
            const img3 = this.mediaSrc(folderImages[2] || folderImages[1] || folderImages[0] || images[fallbackIndex + 2] || img1);
            const safeTitle = (dest.title || '').replace(/"/g, '&quot;');
            const safeVibe = (dest.vibe || '').replace(/"/g, '&quot;');
            const actionBtn = dest.isLeh 
                ? `<button type="button" class="card-action-btn leh-popup-trigger" data-leh="true">Plan Leh Ladakh Tour <i class="fas fa-motorcycle"></i></button>`
                : `<button type="button" class="card-action-btn dest-wa-btn" data-dest-title="${safeTitle}" data-dest-category="India" data-dest-vibe="${safeVibe}">plan this tour <i class="fas fa-arrow-right"></i></button>`;

            return `
        <div class="photo-stack-card${dest.isLeh ? ' card-highlight-leh' : ''}" data-aos="fade-up" data-aos-delay="${100 + (index % 4) * 80}" data-dest-card="${dest.title}">
            <div class="card-text">
                <span class="card-category">INDIA</span>
                <h3 class="card-title">${dest.title}</h3>
                <p class="card-subtitle"><strong>The Vibe:</strong> ${dest.vibe}</p>
                ${actionBtn}
            </div>
            <div class="photo-stack">
                <img class="stack-img stack-img-1" src="${img1}" alt="${dest.title} gallery 1" loading="lazy">
                <img class="stack-img stack-img-2" src="${img2}" alt="${dest.title} gallery 2" loading="lazy">
                <img class="stack-img stack-img-3" src="${img3}" alt="${dest.title} gallery 3" loading="lazy">
            </div>
        </div>`;
        }).join('');

        const internationalCards = internationalDestinations.map((dest, index) => {
            const destMap = window.ttcMedia && window.ttcMedia.destinations;
            const folderImages = (destMap && dest.folder && destMap[dest.folder]) || [];
            const fallbackIndex = (index * 3) % (images.length || 1);
            
            const img1 = this.mediaSrc(folderImages[0] || images[fallbackIndex] || '');
            const img2 = this.mediaSrc(folderImages[1] || folderImages[0] || images[fallbackIndex + 1] || img1);
            const img3 = this.mediaSrc(folderImages[2] || folderImages[1] || folderImages[0] || images[fallbackIndex + 2] || img1);
            const safeTitle = (dest.title || '').replace(/"/g, '&quot;');
            const safeVibe = (dest.vibe || '').replace(/"/g, '&quot;');
            
            return `
        <div class="photo-stack-card" data-aos="fade-up" data-aos-delay="${100 + (index % 4) * 80}" data-dest-card="${dest.title}">
            <div class="card-text">
                <span class="card-category">INTERNATIONAL</span>
                <h3 class="card-title">${dest.title}</h3>
                <p class="card-subtitle"><strong>The Vibe:</strong> ${dest.vibe}</p>
                <button type="button" class="card-action-btn dest-wa-btn" data-dest-title="${safeTitle}" data-dest-category="International" data-dest-vibe="${safeVibe}">plan this tour <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="photo-stack">
                <img class="stack-img stack-img-1" src="${img1}" alt="${dest.title} gallery 1" loading="lazy">
                <img class="stack-img stack-img-2" src="${img2}" alt="${dest.title} gallery 2" loading="lazy">
                <img class="stack-img stack-img-3" src="${img3}" alt="${dest.title} gallery 3" loading="lazy">
            </div>
        </div>`;
        }).join('');

        return `
<section class="destination" id="destination">
    <div class="heading">
        <span>popular destinations</span>
        <h1>Choose Your Next Circle On The Map</h1>
    </div>
    
    <div class="destination-tabs">
        <button class="destination-tab-btn active" data-target="domestic">Domestic Destinations</button>
        <button class="destination-tab-btn" data-target="international">International Destinations</button>
    </div>
    
    <div class="destination-tab-content active" id="domestic-content">
        ${domesticCards}
    </div>
    <div class="destination-tab-content" id="international-content">
        ${internationalCards}
    </div>
    
    <div class="why-choose-us-tagline" data-aos="zoom-in" style="margin-top: 5rem; text-align: center;">
        "From the nearest getaway to the farthest corner of the world, no destination is beyond our reach. If you can dream it, we can plan it."
    </div>
</section>`;
    },

    createServices() {
        const servicesList = [
            ['Domestic & International Holiday Packages', 'Curated travel packages to destinations across India and around the world, designed to suit every budget and travel style.', 'fas fa-globe-asia'],
            ['Customized Tour Planning', 'Personalized itineraries tailored to your interests, preferences, and travel requirements for a unique experience.', 'fas fa-map-marked-alt'],
            ['Hotel & Resort Bookings', 'Handpicked accommodation options ranging from budget stays to luxury resorts, ensuring comfort and convenience.', 'fas fa-hotel'],
            ['Flight, Train, Bus & Car Bookings', 'Complete transportation booking assistance with the best routes and competitive fares.', 'fas fa-plane-departure'],
            ['Group Tours & Family Vacations', 'Specially designed packages for families & friends groups and special interest travellers.', 'fas fa-users'],
            ['M.I.C.E. Group Tours', 'Efficient Corporate and business travel solutions, including flight bookings, hotel arrangements, and itinerary management.', 'fas fa-briefcase'],
            ['Honeymoon & Romantic Getaways', 'Exclusive packages crafted for couples seeking memorable and romantic travel experiences.', 'fas fa-heart'],
            ['Adventure & Weekend Getaways (Coming Soon)', 'Exciting trips featuring trekking, camping, water sports, wildlife experiences, and short escapes.', 'fas fa-hiking'],
            ['School & College Special Tours', 'Customized tours for schools, colleges, senior citizens, and themed travel groups.', 'fas fa-graduation-cap']
        ];

        const serviceCards = servicesList.map(([title, description, icon], index) => `
        <div class="box" data-aos="zoom-in-up" data-aos-delay="${100 + (index % 3) * 100}">
            <i class="${icon}"></i>
            <h3>${title}</h3>
            <p>${description}</p>
        </div>`).join('');

        return `
<section class="services" id="services">
    <div class="heading">
        <span>what we arrange</span>
        <h1>Every Detail, Beautifully Handled</h1>
    </div>
    <div class="box-container">
        ${serviceCards}
    </div>
</section>`;
    },

    getGalleryItems() {
        const images = this.getImages().filter(image => !this.isDuplicateGalleryMedia(image));
        const videos = this.getVideos();
        const tileShapes = ['portrait', 'landscape', 'square', 'tall', 'landscape', 'portrait'];
        const items = [];

        images.forEach((image, index) => {
            items.push({
                type: 'image',
                src: this.mediaSrc(image),
                alt: `The Travel Circle journey photo ${index + 1}`,
                shape: tileShapes[index % tileShapes.length]
            });
        });

        videos.forEach((video, index) => {
            const previewImg = images[(index * 11) % images.length] || images[0];
            items.push({
                type: 'video',
                src: this.mediaSrc(video),
                thumb: this.mediaSrc(previewImg),
                alt: `Preview for The Travel Circle travel film ${index + 1}`,
                shape: 'landscape'
            });
        });

        return items;
    },

    createGallery() {
        const items = this.getGalleryItems();
        const initialCount = 8;
        const initialItems = items.slice(0, initialCount);

        const cardHtml = (item) => {
            if (item.type === 'video') {
                return `
        <div class="box gallery-tile gallery-tile--landscape video-box" data-type="video" data-src="${item.src}" tabindex="0" role="button" aria-label="${item.alt}">
            <div class="video-thumb">
                <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
                <i class="fas fa-play"></i>
            </div>
            <span class="gallery-shine" aria-hidden="true"></span>
        </div>`;
            }
            return `
        <div class="box gallery-tile gallery-tile--${item.shape}" data-type="image" data-src="${item.src}" tabindex="0" role="button" aria-label="${item.alt}">
            <img src="${item.src}" alt="${item.alt}" loading="lazy">
            <span class="gallery-shine" aria-hidden="true"></span>
        </div>`;
        };

        const initialCards = initialItems.map(cardHtml).join('');
        const hasMore = items.length > initialCount;

        return `
<section class="gallery" id="gallery">
    <div class="heading">
        <span>journey moments</span>
        <h1>memories from every mile</h1>
    </div>
    <div class="box-container" id="gallery-box-container">
        ${initialCards}
    </div>
    <div class="gallery-actions" style="text-align: center; margin-top: 3.5rem;">
        ${hasMore ? '<button class="btn gallery-more-btn" id="gallery-load-more" type="button">View More Memories</button>' : ''}
    </div>
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
        <div class="box blog-card-trigger" data-blog-id="blog-1" data-aos="fade-up" data-aos-delay="150" role="button" tabindex="0">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[0])}" alt="Planning a meaningful journey with The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#blog-modal" class="link blog-link-btn" data-blog-id="blog-1">The Road That Became A Memory</a>
                <p>A simple route turned into a collection of scenic stops, shared laughter, local flavors, and the kind of views that make travelers go quiet.</p>
                <div class="icon">
                    <span><i class="fas fa-clock"></i> 15th Sept, 2025</span>
                    <span><i class="fas fa-user"></i> by The Travel Circle</span>
                </div>
            </div>
        </div>
        <div class="box blog-card-trigger" data-blog-id="blog-2" data-aos="fade-up" data-aos-delay="300" role="button" tabindex="0">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[1])}" alt="A scenic travel story by The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#blog-modal" class="link blog-link-btn" data-blog-id="blog-2">When The Plan Feels Effortless</a>
                <p>The best holidays are not rushed. They have the right stays, the right pauses, and enough space to discover something beautiful along the way.</p>
                <div class="icon">
                    <span><i class="fas fa-clock"></i> 10th Sept, 2025</span>
                    <span><i class="fas fa-user"></i> by The Travel Circle</span>
                </div>
            </div>
        </div>
        <div class="box blog-card-trigger" data-blog-id="blog-3" data-aos="fade-up" data-aos-delay="450" role="button" tabindex="0">
            <div class="image">
                <img src="${this.mediaSrc(blogImages[2])}" alt="Hidden travel experience arranged by The Travel Circle" loading="lazy">
            </div>
            <div class="content">
                <a href="#blog-modal" class="link blog-link-btn" data-blog-id="blog-3">Small Detours, Big Stories</a>
                <p>Sometimes the unforgettable part is not the famous spot. It is the bend in the road, the surprise viewpoint, or the evening nobody wanted to end.</p>
                <div class="icon">
                    <span><i class="fas fa-clock"></i> 5th Sept, 2025</span>
                    <span><i class="fas fa-user"></i> by The Travel Circle</span>
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
        <p>At The Travel Circle, we don't just plan trips—we create experiences that stay with you forever. Let's start planning your next adventure together!</p>
        <a href="#book-form" class="btn">plan my journey</a>
    </div>
</div>`;
    },

    createVlogs() {
        const images = this.getImages();
        const videos = this.getVideos();
        const vlogItems = [
            {
                title: 'High Passes & Bike Expeditions in Leh Ladakh',
                destination: 'Leh Ladakh',
                image: this.mediaSrc(images[12] || images[0]),
                video: videos[0] ? this.mediaSrc(videos[0]) : '',
                duration: '04:15 min',
                desc: 'Riding through Khardung La pass, Pangong Lake shores, and high-altitude mountain trails.'
            },
            {
                title: 'Backwater Houseboats & Spice Trails of Keralam',
                destination: 'Keralam',
                image: this.mediaSrc(images[24] || images[0]),
                video: videos[1] ? this.mediaSrc(videos[1]) : '',
                duration: '03:40 min',
                desc: 'Sailing through Alleppey backwaters, palm-fringed lagoons, and tea plantations.'
            },
            {
                title: 'Spiritual Divine Peaks & Rafting in Uttarakhand',
                destination: 'Uttarakhand',
                image: this.mediaSrc(images[36] || images[0]),
                video: videos[2] ? this.mediaSrc(videos[2]) : '',
                duration: '05:10 min',
                desc: 'Exploring Char Dham routes, Rishikesh Ganga rafting, and Mussoorie mountain views.'
            },
            {
                title: 'Living Root Bridges & Cascades of The Seven Sisters',
                destination: 'The Seven Sisters',
                image: this.mediaSrc(images[48] || images[0]),
                video: videos[3] ? this.mediaSrc(videos[3]) : '',
                duration: '06:20 min',
                desc: 'Trekking Meghalaya living root bridges, Dawki river waters, and Kaziranga safaris.'
            }
        ];

        const vlogCards = vlogItems.map((vlog, idx) => {
            const safeDest = (vlog.destination || '').replace(/"/g, '&quot;');
            const safeTitle = (vlog.title || '').replace(/"/g, '&quot;');
            const safeDesc = (vlog.desc || '').replace(/"/g, '&quot;');

            return `
        <div class="vlog-card" data-aos="fade-up" data-aos-delay="${150 + idx * 100}">
            <div class="vlog-media">
                <img src="${vlog.image}" alt="${vlog.title}" loading="lazy">
                <span class="vlog-badge"><i class="fas fa-play-circle"></i> ${vlog.duration}</span>
                <span class="vlog-tag">${vlog.destination}</span>
            </div>
            <div class="vlog-info">
                <h3>${vlog.title}</h3>
                <p>${vlog.desc}</p>
                <button type="button" class="vlog-action-btn vlog-wa-btn" data-vlog-dest="${safeDest}" data-vlog-title="${safeTitle}" data-vlog-desc="${safeDesc}">
                    Plan This Vlog Route <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        </div>`;
        }).join('');

        return `
<section class="vlogs" id="vlogs">
    <div class="heading">
        <span>travel vlogs & reels</span>
        <h1>Real Journeys, Real Stories</h1>
    </div>
    <div class="vlogs-grid">
        ${vlogCards}
    </div>
</section>`;
    },

    createFooter() {
        const footerLinks = [
            ['home', '#home'],
            ['about', '#about'],
            ['why choose us', '#why-us'],
            ['destination', '#destination'],
            ['services', '#services'],
            ['gallery', '#gallery'],
            ['vlogs', '#vlogs'],
            ['blogs', '#blogs'],
            ['contact', '#contact']
        ].map(([label, href]) => `<a href="${href}" class="links roll-link"> <i class="fas fa-arrow-right"></i> ${this.rollText(label)} </a>`).join('');

        return `
<section class="footer" id="contact">
    <div class="box-container">
        <div class="box" data-aos="fade-up" data-aos-delay="150">
            <a href="#home" class="logo brand-logo footer-logo" aria-label="The Travel Circle Home">
                <div class="logo-box">
                    <div class="logo-circle-avatar">
                        <img src="images/logoTTC.png" alt="The Travel Circle logo">
                    </div>
                </div>
            </a>
            <p>You Dream. We Plan. You Explore. Thoughtful tours, smooth bookings, and memorable journeys designed around you. No Boundaries. No Limits. Just Endless Journeys.</p>
            <div class="share">
                <a href="https://wa.me/917304979500" class="fab fa-whatsapp" aria-label="WhatsApp Business 7304979500" target="_blank" rel="noopener noreferrer" title="WhatsApp 7304979500"></a>
                <a href="#" class="fab fa-facebook-f" aria-label="Facebook" target="_blank" rel="noopener noreferrer"></a>
                <a href="#" class="fab fa-instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer"></a>
            </div>
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="300">
            <h3>explore</h3>
            ${footerLinks}
        </div>
        <div class="box" data-aos="fade-up" data-aos-delay="450">
            <h3>contact The Travel Circle</h3>
            <div class="footer-contact-list">
                <div class="footer-contact-item">
                    <i class="fas fa-envelope"></i>
                    <div class="footer-contact-text">
                        <span class="contact-label">Email</span>
                        <a href="mailto:info@thetravelcircle.co.in">info@thetravelcircle.co.in</a>
                        <a href="mailto:thetravelcircle26@gmail.com">thetravelcircle26@gmail.com</a>
                    </div>
                </div>
                <div class="footer-contact-item">
                    <i class="fas fa-globe"></i>
                    <div class="footer-contact-text">
                        <span class="contact-label">Website</span>
                        <a href="https://thetravelcircle.co.in" target="_blank" rel="noopener noreferrer">thetravelcircle.co.in</a>
                    </div>
                </div>
                <div class="footer-contact-item">
                    <i class="fas fa-phone-alt"></i>
                    <div class="footer-contact-text">
                        <span class="contact-label">Contact Number</span>
                        <a href="tel:7304979500">7304979500</a>
                    </div>
                </div>
                <div class="footer-contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="footer-contact-text">
                        <span class="contact-label">Address</span>
                        <a href="https://maps.google.com/?q=House+no.+4166+A,+Shop+no.+112,+First+Floor,+Karanja+Navapada,+Near+New+Karanja,+Taluka+Uran,+District+Raigad,+PIN+400702" target="_blank" rel="noopener noreferrer" class="address-link">
                            House no. 4166 A, Shop no. 112,<br>
                            First Floor, Karanja Navapada,<br>
                            Near New Karanja,<br>
                            Taluka Uran, District Raigad,<br>
                            PIN 400702
                        </a>
                    </div>
                </div>
            </div>
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
<div class="credit"><span>The Travel Circle</span> | You Dream. We Plan. You Explore.</div>`;
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

    createLehModal() {
        return `
<div class="leh-modal" id="leh-modal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal-backdrop"></div>
    <div class="modal-card">
        <button class="modal-close-btn" id="leh-modal-close" type="button" aria-label="Close"><i class="fas fa-times"></i></button>
        <div class="modal-header">
            <i class="fas fa-mountain modal-icon"></i>
            <h3>Leh Ladakh Expeditions</h3>
            <p>Select your preferred tour package style for Leh Ladakh:</p>
        </div>
        <div class="modal-options">
            <button type="button" class="btn modal-opt-btn" data-leh-choice="Option 1: Plan Destination Tour">
                <i class="fas fa-map-marked-alt"></i> Option 1: Plan Destination Tour
            </button>
            <button type="button" class="btn modal-opt-btn bike-opt" data-leh-choice="Option 2: Plan Bike Ride Tour">
                <i class="fas fa-motorcycle"></i> Option 2: Plan Bike Ride Tour
            </button>
        </div>
    </div>
</div>`;
    },

    createBlogModal() {
        return `
<div class="blog-modal" id="blog-modal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="blog-modal-backdrop"></div>
    <div class="blog-modal-card">
        <button class="blog-modal-close" id="blog-modal-close" type="button" aria-label="Close article"><i class="fas fa-times"></i></button>
        <div class="blog-modal-banner">
            <img id="blog-modal-img" src="" alt="Blog article header image">
            <span class="blog-modal-category" id="blog-modal-category">Travel Notes</span>
        </div>
        <div class="blog-modal-body">
            <div class="blog-modal-meta">
                <span><i class="fas fa-clock"></i> <span id="blog-modal-date">15th Sept, 2025</span></span>
                <span><i class="fas fa-user"></i> <span id="blog-modal-author">by The Travel Circle</span></span>
            </div>
            <h2 class="blog-modal-title" id="blog-modal-title"></h2>
            <div class="blog-modal-text" id="blog-modal-text"></div>
            <div class="blog-modal-footer">
                <a href="#contact" class="btn blog-modal-cta" id="blog-modal-cta">Plan A Trip Like This <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</div>`;
    },

    createFloatingWhatsapp() {
        return `
<a href="https://wa.me/917304979500?text=Hi%20The%20Travel%20Circle%2C%20I%20want%20to%20plan%20a%20tour!" target="_blank" rel="noopener noreferrer" class="floating-whatsapp-widget" title="Chat with us on WhatsApp 7304979500" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i>
    <span class="whatsapp-tooltip">Chat with us!</span>
</a>`;
    },

    createPageStructure() {
        return `
            ${this.createPageLoader()}
            ${this.createHeader()}
            <main>
                ${this.createHome()}
                ${this.createBookingForm()}
                ${this.createAbout()}
                ${this.createWhyChooseUs()}
                ${this.createDestination()}
                ${this.createServices()}
                ${this.createGallery()}
                ${this.createVlogs()}
                ${this.createReview()}
                ${this.createBlogs()}
                ${this.createBanner()}
            </main>
            ${this.createFooter()}
            ${this.createScrollTopButton()}
            ${this.createLightbox()}
            ${this.createLehModal()}
            ${this.createBlogModal()}
            ${this.createFloatingWhatsapp()}
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
            this.initSkeletonScreens();
            this.initNavbar();
            this.initMenuPreview();
            this.initRevealSystem();
            this.initSmoothScrolling();
            this.initFullSiteSlowScroll();
            this.initScrollEffects();
            this.initHeroSectionFlow();
            this.initVideoSwitcher();
            this.initActiveLinkObserver();
            this.initBookingReveal();
            this.initBookingForm();
            this.initDestinationWhatsApp();
            this.initVlogWhatsApp();
            this.initNewsletterForm();
            this.initReviewSlider();
            this.initGalleryReveal();
            this.initGalleryLightbox();
            this.initDestinationTabs();
            this.initStateSearch();
            this.initLehModal();
            this.initBlogModal();
        },

        initSkeletonScreens() {
            const targets = document.querySelectorAll('.vlog-media, .gallery .box, .photo-stack-card .card-media-box, .about .video-container');
            
            targets.forEach((container) => {
                const img = container.querySelector('img');
                const video = container.querySelector('video');
                const media = img || video;
                if (!media) return;

                const isReady = img 
                    ? (img.complete && img.naturalHeight !== 0) 
                    : (video ? video.readyState >= 3 : false);

                if (!isReady) {
                    const skeleton = document.createElement('div');
                    skeleton.className = 'boneyard-skeleton-overlay boneyard-skeleton';
                    container.appendChild(skeleton);
                    container.classList.add('boneyard-loading');

                    const removeSkeleton = () => {
                        skeleton.classList.add('is-resolved');
                        container.classList.remove('boneyard-loading');
                        container.classList.add('boneyard-loaded');
                        window.setTimeout(() => {
                            skeleton.remove();
                        }, 350);
                    };

                    if (img) {
                        img.addEventListener('load', removeSkeleton, { once: true });
                        img.addEventListener('error', removeSkeleton, { once: true });
                    }
                    if (video) {
                        video.addEventListener('canplay', removeSkeleton, { once: true });
                        video.addEventListener('error', removeSkeleton, { once: true });
                    }

                    // Safety auto-resolve: ensure skeleton never remains stuck indefinitely
                    window.setTimeout(removeSkeleton, 2500);
                } else {
                    container.classList.add('boneyard-loaded');
                }
            });
        },

        initDestinationTabs() {
            const tabButtons = document.querySelectorAll('.destination-tab-btn');
            const domesticContent = document.getElementById('domestic-content');
            const internationalContent = document.getElementById('international-content');
            
            if (!tabButtons.length || !domesticContent || !internationalContent) return;
            
            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const target = btn.getAttribute('data-target');
                    if (target === 'domestic') {
                        domesticContent.classList.add('active');
                        internationalContent.classList.remove('active');
                    } else {
                        domesticContent.classList.remove('active');
                        internationalContent.classList.add('active');
                    }
                    
                    // Refresh AOS animations
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                });
            });
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

            // Strict Scroll Locking during loader
            const preventLoaderScroll = (e) => {
                if (document.body.classList.contains('is-loading')) {
                    e.preventDefault();
                }
            };
            window.addEventListener('wheel', preventLoaderScroll, { passive: false });
            window.addEventListener('touchmove', preventLoaderScroll, { passive: false });
            document.body.classList.add('is-loading');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            let isHidden = false;
            const hideLoader = () => {
                if (isHidden) return;
                isHidden = true;
                document.body.classList.add('site-revealing');
                loader.classList.add('is-hidden');

                // Cinematic Morph Transition: wait 750ms for loader scale-down & home fade-in
                window.setTimeout(() => {
                    loader.remove();
                    document.body.classList.remove('is-loading');
                    document.body.classList.add('site-ready');
                    
                    // Unlock page scrolling ONLY AFTER visual morph transition finishes
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    window.removeEventListener('wheel', preventLoaderScroll);
                    window.removeEventListener('touchmove', preventLoaderScroll);

                    window.setTimeout(() => {
                        document.body.classList.remove('site-revealing');
                    }, 400);
                }, 750);
            };

            if (reduceMotion) {
                window.setTimeout(hideLoader, 350);
                return;
            }

            video.play().catch(() => {
                window.setTimeout(hideLoader, 900);
            });

            video.addEventListener('ended', hideLoader, { once: true });
            video.addEventListener('error', hideLoader, { once: true });

            // Safety timeout
            window.setTimeout(() => {
                if (video.readyState === 0) {
                    hideLoader();
                }
            }, 8000);
        },

        initRevealSystem() {
            const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isReduced) return;

            // 1. Tag headings for clean fade-up reveal as whole elements (NO word splitting)
            const headings = document.querySelectorAll('.heading h1, .about .content h3, .services .heading h1, .why-choose-us .heading h1, .vlogs .heading h1, .blogs .heading h1, .contact .heading h1, .gallery .heading h1, .destination .heading h1');
            headings.forEach(heading => {
                heading.setAttribute('data-reveal', 'fade-up');
            });

            // 2. Tag section eyebrows and alternating card grid elements
            document.querySelectorAll('.heading span').forEach(el => el.setAttribute('data-reveal', 'fade-up'));

            const cardContainers = document.querySelectorAll('.why-choose-us .box-container, .services .box-container, .blogs .box-container, .vlogs-grid, .destination-card-grid');
            cardContainers.forEach(grid => {
                const cards = grid.querySelectorAll('.box, .card, .vlog-card, .destination-card');
                cards.forEach((card, index) => {
                    if (!card.dataset.cardDirection) {
                        const dir = index % 2 === 0 ? 'reveal-card-left' : 'reveal-card-right';
                        card.dataset.cardDirection = dir;
                        card.classList.add(dir);
                        card.style.transitionDelay = `${(index % 4) * 80}ms`;
                    }
                });
            });

            // 3. Setup IntersectionObserver
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.12
            };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        el.classList.add('is-revealed');
                        
                        // Reveal child stagger items & alternating cards if present
                        el.querySelectorAll('.reveal-stagger-item, .reveal-card-left, .reveal-card-right').forEach((child, i) => {
                            if (!child.style.transitionDelay) {
                                child.style.transitionDelay = `${i * 60}ms`;
                            }
                            child.classList.add('is-revealed');
                        });
                        
                        obs.unobserve(el);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('[data-reveal], [data-aos], .heading, .why-choose-us .box-container, .services .box-container, .blogs .box-container, .vlogs-grid').forEach(el => {
                observer.observe(el);
            });
        },

        initNavbar() {
            const menuBtn = document.querySelector('#menu-btn');
            const menuContainer = document.querySelector('.fullscreen-menu-container');
            const navWrap = document.querySelector('.nav-overlay-wrapper');
            const menu = document.querySelector('.menu-content');
            const overlay = document.querySelector('.fullscreen-menu-container .overlay');
            const bgPanels = document.querySelectorAll('.backdrop-layer');
            const menuLinks = document.querySelectorAll('.menu-list .nav-link, .header .menu-link-item');
            const menuItems = document.querySelectorAll('.menu-list-item[data-shape]');
            const shapesContainer = document.querySelector('.ambient-background-shapes');
            const menuButtonTexts = menuBtn?.querySelectorAll('p');
            const menuButtonIcon = menuBtn?.querySelector('.menu-button-icon');

            if (!menuBtn || !navWrap || !menuContainer) return;

            // CRITICAL PORTAL FIX: Escape any parent stacking context
            if (menuContainer.parentElement !== document.body) {
                document.body.appendChild(menuContainer);
            }

            // Setup CustomEase if GSAP is available
            try {
                if (typeof gsap !== 'undefined' && gsap.CustomEase && !gsap.parseEase('main')) {
                    gsap.registerPlugin(gsap.CustomEase);
                    gsap.CustomEase.create('main', '0.65, 0.01, 0.05, 0.99');
                    gsap.defaults({ ease: 'main', duration: 0.7 });
                }
            } catch (e) {
                if (typeof gsap !== 'undefined') gsap.defaults({ ease: 'power2.out', duration: 0.7 });
            }

            // Shape Hover Interactions
            menuItems.forEach((item) => {
                const shapeIndex = item.getAttribute('data-shape');
                const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
                if (!shape) return;

                const shapeEls = shape.querySelectorAll('.shape-element');

                const onEnter = () => {
                    if (shapesContainer) {
                        shapesContainer.querySelectorAll('.bg-shape').forEach((s) => s.classList.remove('active'));
                    }
                    shape.classList.add('active');

                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(shapeEls,
                            { scale: 0.5, opacity: 0, rotation: -10 },
                            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)', overwrite: 'auto' }
                        );
                    }
                };

                const onLeave = () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(shapeEls, {
                            scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
                            onComplete: () => shape.classList.remove('active'),
                            overwrite: 'auto'
                        });
                    } else {
                        shape.classList.remove('active');
                    }
                };

                item.addEventListener('mouseenter', onEnter);
                item.addEventListener('mouseleave', onLeave);
            });

            let isMenuOpen = false;

            const lockScroll = () => {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
                document.body.dataset.menuScrollY = scrollY;
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
            };

            const unlockScroll = (skipScrollRestore = false) => {
                const savedScrollY = parseInt(document.body.dataset.menuScrollY || '0', 10);
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                if (!skipScrollRestore) {
                    window.scrollTo(0, savedScrollY);
                }
            };

            const closeMenu = (skipScrollRestore = false, onCompleteCallback) => {
                if (!isMenuOpen) {
                    if (onCompleteCallback) onCompleteCallback();
                    return;
                }
                isMenuOpen = false;
                navWrap.setAttribute('data-nav', 'closed');
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');

                const finalizeClose = () => {
                    navWrap.style.display = 'none';
                    unlockScroll(skipScrollRestore);
                    if (onCompleteCallback) onCompleteCallback();
                };

                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({ onComplete: finalizeClose });
                    tl.to(menu, { x: '100%', duration: 0.4, ease: 'power3.in' })
                      .to(bgPanels, { x: '100%', stagger: 0.05, duration: 0.3, ease: 'power3.in' }, '<')
                      .to(overlay, { autoAlpha: 0, duration: 0.25 }, '<')
                      .to(menuButtonTexts, { yPercent: 0, duration: 0.25 }, '<')
                      .to(menuButtonIcon, { rotate: 0, duration: 0.25 }, '<');
                } else {
                    finalizeClose();
                }
            };

            const openMenu = () => {
                if (isMenuOpen) return;
                isMenuOpen = true;
                lockScroll();
                navWrap.style.display = 'block';
                navWrap.setAttribute('data-nav', 'open');
                menuBtn.setAttribute('aria-expanded', 'true');
                document.body.classList.add('nav-open');

                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline();
                    tl.set(navWrap, { display: 'block' })
                      .to(overlay, { autoAlpha: 1, duration: 0.4 })
                      .fromTo(bgPanels, { x: '100%' }, { x: '0%', stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '<')
                      .fromTo(menu, { x: '100%' }, { x: '0%', duration: 0.55, ease: 'power3.out' }, '<')
                      .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.12, duration: 0.35 }, '<')
                      .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.35 }, '<')
                      .fromTo(menuLinks, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.35, ease: 'power2.out' }, '<+=0.15');
                }
            };

            menuBtn.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (isMenuOpen) {
                    closeMenu(false);
                } else {
                    openMenu();
                }
            };

            const closeCrossBtn = document.querySelector('#menu-close-cross');
            if (closeCrossBtn) {
                closeCrossBtn.onclick = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    closeMenu(false);
                };
            }

            if (overlay) {
                overlay.onclick = (event) => {
                    event.stopPropagation();
                    closeMenu(false);
                };
            }

            // Menu Link Item Click & Destination Navigation
            document.querySelectorAll('.menu-list .nav-link, .menu-link-item').forEach(link => {
                link.onclick = (event) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        event.preventDefault();
                        const target = document.querySelector(href);
                        closeMenu(true, () => {
                            if (target) {
                                window.setTimeout(() => {
                                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 80);
                            }
                        });
                    } else {
                        closeMenu(false);
                    }
                };
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && isMenuOpen) {
                    closeMenu(false);
                }
            });
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
            // Using default native browser scrolling
            document.documentElement.dataset.fullSiteSlowScroll = 'native';
        },

        initScrollEffects() {
            const header = document.querySelector('.header');
            const scrollTopBtn = document.querySelector('.scroll-top-btn');

            let ticking = false;
            const updateScrollState = () => {
                const scrollY = window.scrollY || window.pageYOffset;
                const isScrolled = scrollY > 20;

                if (header) {
                    header.classList.toggle('scrolled', isScrolled);
                }

                if (scrollTopBtn) {
                    scrollTopBtn.classList.toggle('active', scrollY > 250);
                }
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateScrollState);
                    ticking = true;
                }
            }, { passive: true });
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

            if (!bookSection) return;

            const showBooking = () => {
                bookSection.classList.remove('is-hidden');
                bookSection.setAttribute('aria-hidden', 'false');
                window.setTimeout(() => {
                    this.smoothScrollTo(bookSection, { duration: 800, center: true });
                    const firstInput = bookSection.querySelector('#book-destination');
                    if (firstInput) firstInput.focus();
                }, 100);
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

            const closeBtn = bookSection.querySelector('#close-book-form');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    hideBooking();
                });
            }
        },

        openBookingFormWithDestination(destinationName, forceUpdate = false) {
            const bookSection = document.querySelector('#book-form');
            if (!bookSection) return;

            bookSection.classList.remove('is-hidden');
            bookSection.setAttribute('aria-hidden', 'false');

            const destInput = document.querySelector('#book-destination');
            if (destInput && destinationName) {
                const isUserEdited = destInput.dataset.userEdited === 'true' && destInput.value.trim().length > 0;
                if (!isUserEdited || forceUpdate) {
                    destInput.value = destinationName;
                    destInput.dataset.userEdited = 'false';
                }
                destInput.closest('.inputBox')?.classList.remove('is-invalid');
            }

            window.setTimeout(() => {
                this.smoothScrollTo(bookSection, { duration: 800, center: true });
                const contactInput = document.querySelector('#book-contact');
                if (destInput && (!destInput.value || destInput.value.trim().length === 0)) {
                    destInput.focus();
                } else if (contactInput) {
                    contactInput.focus();
                }
            }, 100);
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

        whatsappConfig: {
            phoneNumber: '917304979500'
        },

        openWhatsAppEnquiry(messageText) {
            if (!messageText) return;
            const phone = this.whatsappConfig.phoneNumber;
            const encodedText = encodeURIComponent(messageText);
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const waUrl = isMobile 
                ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`
                : `https://wa.me/${phone}?text=${encodedText}`;
            
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        },

        formatDateReadable(dateStr) {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const year = parts[0];
                const monthIndex = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                if (monthIndex >= 0 && monthIndex < 12) {
                    return `${day} ${months[monthIndex]} ${year}`;
                }
            }
            return dateStr;
        },

        generateTourPlanWhatsAppMessage(formData) {
            const dest = (formData.destination || '').trim();
            const contact = (formData.contact || '').trim();
            const dateFromFormatted = this.formatDateReadable(formData.dateFrom);
            const dateToFormatted = this.formatDateReadable(formData.dateTo);
            const travelers = String(formData.travelers || '').trim();
            const email = (formData.email || '').trim();

            const lines = [
                "🌟 *NEW TOUR PLAN ENQUIRY — THE TRAVEL CIRCLE* 🌟",
                "",
                `📍 *Destination:* ${dest}`,
                `📞 *Contact Number:* ${contact}`,
                email ? `✉️ *Email Address:* ${email}` : null,
                `📅 *Travel Dates:* ${dateFromFormatted} to ${dateToFormatted}`,
                `👥 *Number of Guests:* ${travelers} Guest(s)`,
                "",
                "Hello! I would like to plan this tour with *The Travel Circle*.",
                "Please share detailed itinerary options, package inclusions, and best pricing.",
                "",
                "Thank you! Looking forward to your response."
            ].filter(line => line !== null);

            return lines.join("\n");
        },

        generateDestinationWhatsAppMessage(destObj) {
            const title = (destObj.title || 'Selected Destination').trim();
            const category = (destObj.category || 'India').trim();
            const vibe = (destObj.vibe || '').trim();

            const lines = [
                "Hello The Travel Circle,",
                "",
                `I am interested in planning a trip to ${title}.`,
                "",
                "Destination:",
                title,
                "",
                "Location:",
                category
            ];

            if (vibe) {
                lines.push("");
                lines.push("About the Destination:");
                lines.push(vibe);
            }

            lines.push(
                "",
                "I would like to know more about:",
                "",
                "- Available tour packages",
                "- Itinerary",
                "- Pricing",
                "- Travel dates",
                "- Inclusions",
                "- Accommodation",
                "- Other available options",
                "",
                "Please share the details and help me plan this trip.",
                "",
                "Thank you,",
                "I look forward to hearing from you."
            );

            return lines.join("\n");
        },

        generateVlogWhatsAppMessage(vlogObj) {
            const dest = (vlogObj.destination || '').trim();
            const title = (vlogObj.title || '').trim();
            const desc = (vlogObj.desc || '').trim();

            const lines = [
                "Hello The Travel Circle,",
                "",
                `I came across your travel vlog and I am interested in planning a trip to ${dest}.`,
                "",
                "Destination:",
                dest,
                "",
                "Travel Experience:",
                title
            ];

            if (desc) {
                lines.push("");
                lines.push("Experience Details:");
                lines.push(desc);
            }

            lines.push(
                "",
                "I would like to know more about:",
                "",
                "- Itinerary",
                "- Available travel dates",
                "- Package options",
                "- Pricing",
                "- Accommodation",
                "- Inclusions",
                "- Other trip details",
                "",
                "Please share the details and help me plan this journey.",
                "",
                "Thank you,",
                "I look forward to hearing from you."
            );

            return lines.join("\n");
        },

        initDestinationWhatsApp() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.dest-wa-btn');
                if (btn) {
                    e.preventDefault();
                    const title = btn.getAttribute('data-dest-title') || '';
                    const category = btn.getAttribute('data-dest-category') || '';
                    const vibe = btn.getAttribute('data-dest-vibe') || '';
                    const message = this.generateDestinationWhatsAppMessage({ title, category, vibe });
                    this.openWhatsAppEnquiry(message);
                }
            });
        },

        initVlogWhatsApp() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.vlog-wa-btn');
                if (btn) {
                    e.preventDefault();
                    const destination = btn.getAttribute('data-vlog-dest') || btn.getAttribute('data-vlog-title') || '';
                    this.openBookingFormWithDestination(destination);
                }
            });
        },

        initBookingForm() {
            const bookingForm = document.querySelector('#booking-form');
            if (!bookingForm) return;

            const attachInputListeners = (formEl) => {
                const destInput = formEl.querySelector('#book-destination');
                if (destInput) {
                    destInput.addEventListener('input', () => {
                        destInput.dataset.userEdited = 'true';
                    });
                }

                const allInputs = formEl.querySelectorAll('input');
                allInputs.forEach(input => {
                    const clearInvalid = () => {
                        const box = input.closest('.inputBox');
                        if (box) box.classList.remove('is-invalid');
                    };
                    input.addEventListener('input', clearInvalid);
                    input.addEventListener('change', clearInvalid);
                });
            };

            attachInputListeners(bookingForm);

            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const currentForm = e.currentTarget || bookingForm;

                // DYNAMIC LIVE ELEMENT RE-QUERY ON SUBMIT
                const destInput = currentForm.querySelector('#book-destination') || document.querySelector('#book-destination');
                const contactInput = currentForm.querySelector('#book-contact') || document.querySelector('#book-contact');
                const emailInput = currentForm.querySelector('#book-email') || document.querySelector('#book-email');
                const dateFromInput = currentForm.querySelector('#book-date-from') || document.querySelector('#book-date-from');
                const dateToInput = currentForm.querySelector('#book-date-to') || document.querySelector('#book-date-to');
                const travelersInput = currentForm.querySelector('#book-travelers') || document.querySelector('#book-travelers');

                const liveInputs = [destInput, contactInput, emailInput, dateFromInput, dateToInput, travelersInput].filter(Boolean);

                liveInputs.forEach(input => {
                    const box = input.closest('.inputBox');
                    if (box) box.classList.remove('is-invalid');
                });

                const destination = destInput ? destInput.value.trim() : '';
                const rawContact = contactInput ? contactInput.value.trim() : '';
                const email = emailInput ? emailInput.value.trim() : '';
                const dateFrom = dateFromInput ? dateFromInput.value : '';
                const dateTo = dateToInput ? dateToInput.value : '';
                const travelers = travelersInput ? travelersInput.value.trim() : '';

                let firstInvalidInput = null;
                let errorMessage = '';

                // 1. Validate Dream Destination
                if (!destination) {
                    errorMessage = 'Please enter your Dream Destination (e.g. Mumbai, Kashmir, Goa).';
                    if (destInput) {
                        destInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || destInput;
                    }
                }

                // 2. Validate Contact Number (10 to 13 digits allowed)
                const digitsOnly = rawContact.replace(/\D/g, '');
                if (!errorMessage && (!rawContact || digitsOnly.length < 10 || digitsOnly.length > 13)) {
                    errorMessage = 'Please enter a valid compulsory 10-digit Contact Number (e.g. 8108776019).';
                    if (contactInput) {
                        contactInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || contactInput;
                    }
                }

                // 3. Validate Optional Email (if filled)
                if (!errorMessage && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errorMessage = 'Please enter a valid email address (or leave it blank).';
                    if (emailInput) {
                        emailInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || emailInput;
                    }
                }

                // 4. Validate Travel Going Date (From)
                if (!errorMessage && !dateFrom) {
                    errorMessage = 'Please select your Travel Going Date (From).';
                    if (dateFromInput) {
                        dateFromInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || dateFromInput;
                    }
                }

                // 5. Validate Travel Return Date (To)
                if (!errorMessage && !dateTo) {
                    errorMessage = 'Please select your Travel Return Date (To).';
                    if (dateToInput) {
                        dateToInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || dateToInput;
                    }
                }

                // 6. Validate Date Range Order
                if (!errorMessage && dateFrom && dateTo) {
                    const startDate = new Date(dateFrom);
                    const endDate = new Date(dateTo);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (startDate < today) {
                        errorMessage = 'Please choose an upcoming travel going date.';
                        if (dateFromInput) {
                            dateFromInput.closest('.inputBox')?.classList.add('is-invalid');
                            firstInvalidInput = firstInvalidInput || dateFromInput;
                        }
                    } else if (endDate < startDate) {
                        errorMessage = 'Return date (To) must be on or after your travel going date (From).';
                        if (dateToInput) {
                            dateToInput.closest('.inputBox')?.classList.add('is-invalid');
                            firstInvalidInput = firstInvalidInput || dateToInput;
                        }
                    }
                }

                // 7. Validate Travelers Count
                const numTravelers = parseInt(travelers, 10);
                if (!errorMessage && (isNaN(numTravelers) || numTravelers < 1)) {
                    errorMessage = 'Please specify at least 1 guest/traveler.';
                    if (travelersInput) {
                        travelersInput.closest('.inputBox')?.classList.add('is-invalid');
                        firstInvalidInput = firstInvalidInput || travelersInput;
                    }
                }

                // IF ANY REQUIRED FIELD IS MISSING/INVALID -> BLOCK SUBMISSION & SHOW ERROR MESSAGE
                if (errorMessage) {
                    this.displayFormMessage(currentForm, `⚠️ ${errorMessage}`, false);
                    if (firstInvalidInput) firstInvalidInput.focus();
                    return;
                }

                // ALL REQUIRED FIELDS COMPLETE & VALID -> FORMAT WHATSAPP MESSAGE & REDIRECT TO WHATSAPP
                const waMsg = this.generateTourPlanWhatsAppMessage({
                    destination,
                    contact: digitsOnly,
                    email,
                    dateFrom,
                    dateTo,
                    travelers: numTravelers
                });

                this.displayFormMessage(currentForm, `✅ Details verified! Opening WhatsApp with your enquiry for ${destination}...`, true);

                this.openWhatsAppEnquiry(waMsg);

                if (destInput) destInput.dataset.userEdited = 'false';
                currentForm.reset();
            });
        },

        initStateSearch() {
            const selectEl = document.querySelector('#state-search-select');
            const btnSearch = document.querySelector('#btn-state-search');
            const bikeRideBtn = document.querySelector('#hero-bike-ride-btn');

            const performSearch = (stateName) => {
                if (!stateName) return;
                
                // Switch destination tab to domestic
                const domesticBtn = document.querySelector('.destination-tab-btn[data-target="domestic"]');
                if (domesticBtn) domesticBtn.click();

                // Scroll to destination section
                const destSection = document.querySelector('#destination');
                if (destSection) {
                    this.smoothScrollTo(destSection);
                }

                // Highlight matching card
                window.setTimeout(() => {
                    const cards = document.querySelectorAll('#domestic-content .photo-stack-card');
                    cards.forEach(card => {
                        card.classList.remove('state-searched');
                        const titleEl = card.querySelector('.card-title');
                        if (titleEl && titleEl.textContent.toLowerCase().includes(stateName.toLowerCase())) {
                            card.classList.add('state-searched');
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                }, 400);
            };

            if (btnSearch && selectEl) {
                btnSearch.addEventListener('click', () => {
                    const selectedState = selectEl.value;
                    if (selectedState) performSearch(selectedState);
                });

                selectEl.addEventListener('change', (e) => {
                    const selectedState = e.target.value;
                    if (selectedState) performSearch(selectedState);
                });
            }

            if (bikeRideBtn) {
                bikeRideBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    performSearch('Leh Ladakh');
                });
            }
        },

        initLehModal() {
            const lehModal = document.querySelector('#leh-modal');
            const closeBtn = document.querySelector('#leh-modal-close');
            const backdrop = lehModal ? lehModal.querySelector('.modal-backdrop') : null;
            const optionBtns = lehModal ? lehModal.querySelectorAll('.modal-opt-btn') : [];

            const openLehModal = () => {
                if (!lehModal) return;
                lehModal.classList.add('is-active');
                lehModal.setAttribute('aria-hidden', 'false');
            };

            const closeLehModal = () => {
                if (!lehModal) return;
                lehModal.classList.remove('is-active');
                lehModal.setAttribute('aria-hidden', 'true');
            };

            document.addEventListener('click', (e) => {
                const trigger = e.target.closest('.leh-popup-trigger');
                if (trigger) {
                    e.preventDefault();
                    openLehModal();
                }
            });

            if (closeBtn) closeBtn.addEventListener('click', closeLehModal);
            if (backdrop) backdrop.addEventListener('click', closeLehModal);

            optionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const choice = btn.getAttribute('data-leh-choice') || 'Leh Ladakh Tour';
                    closeLehModal();
                    this.openBookingFormWithDestination(`Leh Ladakh (${choice})`);
                });
            });
        },

        initBlogModal() {
            const blogModal = document.querySelector('#blog-modal');
            if (!blogModal) return;

            const closeBtn = document.querySelector('#blog-modal-close');
            const backdrop = blogModal.querySelector('.blog-modal-backdrop');
            const modalImg = document.querySelector('#blog-modal-img');
            const modalCategory = document.querySelector('#blog-modal-category');
            const modalDate = document.querySelector('#blog-modal-date');
            const modalAuthor = document.querySelector('#blog-modal-author');
            const modalTitle = document.querySelector('#blog-modal-title');
            const modalText = document.querySelector('#blog-modal-text');
            const modalCta = document.querySelector('#blog-modal-cta');

            const blogDatabase = {
                'blog-1': {
                    title: 'The Road That Became A Memory',
                    category: 'Scenic Journeys',
                    date: '15th Sept, 2025',
                    author: 'by The Travel Circle',
                    image: 'images/national/Kashmir/1.jpg',
                    content: `
                        <p class="blog-lead">We started the morning with no rigid timeline—just a coastal road map, a full tank of fuel, and the shared promise of stopping whenever a view demanded our attention.</p>
                        <p>By midday, the highway gave way to winding mountain roads lined with pine trees and misty valleys. We stopped at a tiny roadside cafe where an elderly local served us cardamom chai and warm bread fresh from a wood-fired oven. It wasn't on any travel itinerary, but that 45-minute pause became the highlight of our day.</p>
                        <blockquote class="blog-quote">"The road itself had created a tapestry of shared laughter, quiet wonder, and unforgettable sights."</blockquote>
                        <p>As the sun dipped toward the horizon, painting the sky in deep ambers and violets, we realized that the destination was almost secondary. That is the magic of traveling with an open mind and a handcrafted itinerary—leaving room for spontaneous perfection.</p>
                    `
                },
                'blog-2': {
                    title: 'When The Plan Feels Effortless',
                    category: 'Travel Tips',
                    date: '10th Sept, 2025',
                    author: 'by The Travel Circle',
                    image: 'images/national/Himachal/1.jpg',
                    content: `
                        <p class="blog-lead">The finest travel experiences rarely feel over-scheduled. They strike an artful balance between seamless logistics and unhurried freedom.</p>
                        <p>When every transfer is pre-arranged, every hotel check-in is smooth, and every local guide is genuinely passionate, your mind is freed from the friction of decision fatigue. You no longer worry about taxi tariffs, missing train connections, or finding a decent dinner spot in an unfamiliar city.</p>
                        <blockquote class="blog-quote">"True luxury in travel is not just five-star linen—it is the rare, precious feeling of total peace of mind."</blockquote>
                        <p>Instead, you wake up calmly, savor your morning coffee overlooking emerald rice terraces or pristine sea waves, and let the day unfold with grace.</p>
                    `
                },
                'blog-3': {
                    title: 'Small Detours, Big Stories',
                    category: 'Hidden Gems',
                    date: '5th Sept, 2025',
                    author: 'by The Travel Circle',
                    image: 'images/international/dubai/1.jpg',
                    content: `
                        <p class="blog-lead">Ask any seasoned traveler about their favorite holiday memory, and they will rarely point to the famous landmark everyone posts on social media. More often than not, they will tell you about the accidental discovery.</p>
                        <p>On a recent trip through Rajasthan, our driver suggested taking a 15-minute detour through a sleepy village near Jal Mahal. That small turn took us to a centuries-old stepwell hidden behind a quiet temple, completely free of crowds and shimmering softly in the afternoon light. We sat on the ancient stone steps for an hour, listening to peacocks call in the distance.</p>
                        <blockquote class="blog-quote">"Never be afraid of the bend in the road. That is where the biggest stories are born."</blockquote>
                        <p>At The Travel Circle, we craft itineraries that leave room for those quiet detours—because those are the moments you carry home forever.</p>
                    `
                }
            };

            const openBlogModal = (blogId) => {
                const blogData = blogDatabase[blogId] || blogDatabase['blog-1'];
                const cardImg = document.querySelector(`.blog-card-trigger[data-blog-id="${blogId}"] img`);

                if (modalImg) modalImg.src = cardImg ? cardImg.src : blogData.image;
                if (modalCategory) modalCategory.textContent = blogData.category;
                if (modalDate) modalDate.textContent = blogData.date;
                if (modalAuthor) modalAuthor.textContent = blogData.author;
                if (modalTitle) modalTitle.textContent = blogData.title;
                if (modalText) modalText.innerHTML = blogData.content;

                blogModal.classList.add('active');
                blogModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            };

            const closeBlogModal = () => {
                blogModal.classList.remove('active');
                blogModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            };

            // Event Listeners for Blog Triggers
            document.addEventListener('click', (e) => {
                const blogTrigger = e.target.closest('.blog-card-trigger, .blog-link-btn');
                if (blogTrigger) {
                    e.preventDefault();
                    const blogId = blogTrigger.getAttribute('data-blog-id') || 'blog-1';
                    openBlogModal(blogId);
                }
            });

            if (closeBtn) closeBtn.addEventListener('click', closeBlogModal);
            if (backdrop) backdrop.addEventListener('click', closeBlogModal);

            if (modalCta) {
                modalCta.addEventListener('click', () => {
                    closeBlogModal();
                    const blogTitle = modalTitle ? modalTitle.textContent.trim() : '';
                    this.openBookingFormWithDestination(blogTitle || 'Blog Tour Enquiry');
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && blogModal.classList.contains('active')) {
                    closeBlogModal();
                }
            });
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
            const container = document.getElementById('gallery-box-container') || document.querySelector('.gallery .box-container');
            const loadMoreBtn = document.getElementById('gallery-load-more');
            if (!container || !loadMoreBtn || typeof templates === 'undefined') return;

            const allItems = templates.getGalleryItems();
            let currentIndex = container.querySelectorAll('.box').length;

            if (currentIndex >= allItems.length) {
                loadMoreBtn.style.display = 'none';
                return;
            }

            const buildCardNode = (item) => {
                const div = document.createElement('div');
                div.className = item.type === 'video'
                    ? 'box gallery-tile gallery-tile--landscape video-box is-entering'
                    : `box gallery-tile gallery-tile--${item.shape} is-entering`;
                div.dataset.type = item.type;
                div.dataset.src = item.src;
                div.tabIndex = 0;
                div.setAttribute('role', 'button');
                div.setAttribute('aria-label', item.alt);

                if (item.type === 'video') {
                    div.innerHTML = `
                        <div class="video-thumb">
                            <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
                            <i class="fas fa-play"></i>
                        </div>
                        <span class="gallery-shine" aria-hidden="true"></span>`;
                } else {
                    div.innerHTML = `
                        <img src="${item.src}" alt="${item.alt}" loading="lazy">
                        <span class="gallery-shine" aria-hidden="true"></span>`;
                }

                return div;
            };

            const batchSize = 8;

            loadMoreBtn.addEventListener('click', () => {
                const nextBatch = allItems.slice(currentIndex, currentIndex + batchSize);
                if (!nextBatch.length) {
                    loadMoreBtn.style.display = 'none';
                    return;
                }

                nextBatch.forEach((item, idx) => {
                    const node = buildCardNode(item);
                    node.style.animationDelay = `${idx * 65}ms`;
                    container.appendChild(node);

                    setTimeout(() => {
                        node.classList.remove('is-entering');
                        node.style.animationDelay = '';
                    }, 520 + idx * 65);
                });

                currentIndex += nextBatch.length;

                if (currentIndex >= allItems.length) {
                    loadMoreBtn.style.display = 'none';
                }
            });
        },

        initGalleryLightbox() {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxVideo = document.getElementById('lightbox-video');
            const lightboxStage = document.querySelector('.lightbox-stage');
            const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
            const closeBtn = document.querySelector('.lightbox .close-btn');
            const container = document.getElementById('gallery-box-container') || document.querySelector('.gallery .box-container');

            if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxStage || !lightboxBackdrop || !closeBtn || !container) return;

            let currentImageIndex = 0;
            let lastFocusedElement;
            let focusTrapReady = false;
            let previousBodyOverflow = '';
            let dragStartY = 0;
            let dragCurrentY = 0;
            let isDragging = false;

            const getGallerySources = () => {
                return Array.from(container.querySelectorAll('.box')).map(item => ({
                    type: item.dataset.type || 'image',
                    src: item.dataset.src
                }));
            };

            const selectedMedia = () => {
                const sources = getGallerySources();
                const current = sources[currentImageIndex] || sources[0];
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
                            duration: 480,
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

            const updateLightboxMedia = () => {
                const sources = getGallerySources();
                const current = sources[currentImageIndex];
                if (!current) return;
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

            const showNextImage = () => {
                const sources = getGallerySources();
                if (!sources.length) return;
                currentImageIndex = (currentImageIndex + 1) % sources.length;
                updateLightboxMedia();
            };

            const showPrevImage = () => {
                const sources = getGallerySources();
                if (!sources.length) return;
                currentImageIndex = (currentImageIndex - 1 + sources.length) % sources.length;
                updateLightboxMedia();
            };

            const trapFocus = () => {
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (!focusableElements.length) return;
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                firstFocusable.focus();

                if (focusTrapReady) return;
                focusTrapReady = true;

                lightbox.addEventListener('keydown', (e) => {
                    if (e.key !== 'Tab') return;

                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
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

            container.addEventListener('click', (e) => {
                const box = e.target.closest('.box');
                if (!box) return;
                const boxes = Array.from(container.querySelectorAll('.box'));
                const idx = boxes.indexOf(box);
                if (idx !== -1) {
                    openLightbox(idx, box);
                }
            });

            container.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const box = e.target.closest('.box');
                    if (!box) return;
                    e.preventDefault();
                    const boxes = Array.from(container.querySelectorAll('.box'));
                    const idx = boxes.indexOf(box);
                    if (idx !== -1) {
                        openLightbox(idx, box);
                    }
                }
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

    // ==========================================================================
    // MOTION REVEAL & INTERACTION SYSTEM ENGINE
    // ==========================================================================
    const initMotionSystem = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // 1. IntersectionObserver for Section & Card Scroll Reveals
        const revealTargets = document.querySelectorAll('section, .heading, .box, .photo-stack-card, .vlog-card, .blog-card, .review-card, .about-card, .book-form');
        
        revealTargets.forEach((el, idx) => {
            if (!el.hasAttribute('data-motion-reveal')) {
                el.setAttribute('data-motion-reveal', 'true');
                if (!el.hasAttribute('data-reveal-delay') && (el.classList.contains('box') || el.classList.contains('photo-stack-card'))) {
                    const delay = (idx % 4) * 100 + 100;
                    el.setAttribute('data-reveal-delay', delay.toString());
                }
            }
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.12
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealTargets.forEach((el) => revealObserver.observe(el));

        // 2. Sequential Hero Introduction Timeline
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            const heroElements = heroSection.querySelectorAll('.hero-eyebrow, h1, p, .hero-actions');
            heroElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 140}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 140}ms`;
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                });
            });
        }

        // 3. Desktop Pointer Parallax & Spatial Response
        if (window.matchMedia('(pointer: fine)').matches) {
            const spatialCards = document.querySelectorAll('.hero-primary, .box, .photo-stack-card');
            
            spatialCards.forEach((card) => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    const tiltX = (y / (rect.height / 2)) * -3;
                    const tiltY = (x / (rect.width / 2)) * 3;
                    
                    card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMotionSystem);
    } else {
        initMotionSystem();
    }
});
(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const keepTopHeaderHonest = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        const scrollY = window.scrollY || window.pageYOffset;
        const isScrolled = scrollY > 20;
        document.body.classList.toggle('at-hero-top', !isScrolled);
        header.classList.toggle('scrolled', isScrolled);
    };

    window.addEventListener('scroll', keepTopHeaderHonest, { passive: true });
    window.addEventListener('resize', keepTopHeaderHonest, { passive: true });
    window.addEventListener('load', keepTopHeaderHonest, { once: true });
    document.addEventListener('DOMContentLoaded', keepTopHeaderHonest, { once: true });
})();
// Mobile Story Gallery disabled in favor of unified progressive View More gallery
(() => {
    // Standard progressive gallery handles mobile and desktop unified
})();
// Mobile Destination Accordion Disabled
(() => {
    const fixMobileTabletSections = () => {
        const sectionSelectors = [
            'section',
            '#home', '.home',
            '#services', '.services',
            '#destination', '.destination',
            '#vlogs', '.vlogs',
            '#blogs', '.blogs',
            '#review', '.review',
            '#gallery', '.gallery',
            '#book-form', '.book-form',
            '.banner', '.why-choose-us'
        ];

        document.querySelectorAll(sectionSelectors.join(',')).forEach((section) => {
            section.classList.add('mobile-content-ready');
            section.style.minHeight = 'auto';
            section.style.opacity = '1';
            section.style.visibility = 'visible';

            section.querySelectorAll('[data-aos], [style*="opacity"], [style*="visibility"], .reveal, .scroll-reveal, .fade-in, .fade-up, .hidden, .is-hidden').forEach((node) => {
                node.classList.remove('hidden', 'is-hidden');
                node.style.opacity = '1';
                node.style.visibility = 'visible';
                node.style.transform = 'none';
            });
        });

        // Force-refresh AOS on mobile if loaded
        if (window.AOS && typeof window.AOS.refresh === 'function') {
            window.AOS.refresh();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixMobileTabletSections, { once: true });
    } else {
        fixMobileTabletSections();
    }

    window.addEventListener('load', fixMobileTabletSections);
    window.addEventListener('resize', fixMobileTabletSections, { passive: true });
    window.addEventListener('scroll', fixMobileTabletSections, { passive: true, once: true });
})();
