// ==========================================
// Navbar: scroll effect + active link tracking
// ==========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// Active nav link on scroll
const sections = Array.from(document.querySelectorAll('section[id]'));
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ==========================================
// Hamburger Menu
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ==========================================
// Smooth Scroll
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Put each piece of work in the kind of portfolio section it belongs in.
(function organizePortfolio() {
    const portfolio = document.querySelector('#portfolio');
    const host = portfolio?.querySelector('.portfolio-groups');
    if (!portfolio || !host) return;

    const categories = [
        {
            title: 'Maps & environment assets',
            work: ['Theme Maps', 'Chained Portal', 'Road Kit', 'Urban Prop Kit', 'Anime Style Cloud', "Kami's Lookout"]
        },
        {
            title: 'Weapons & combat assets',
            work: ['Revolver', 'Sniper Set', 'Pistol', 'Trident', 'Turret']
        },
        {
            title: 'Brainrots, pets & UGC',
            work: ['Brainrot Asset Collection', 'Pet Models: Then and Now', 'Jester Hat Variants', 'Custom Wings', 'Angel Wings', 'R6 Muscles']
        },
        {
            title: 'Game-inspired models',
            work: ["Jinx's Minigun", 'Chest', "Shuu's Kagune", 'Coilhead Model', 'Centipede Kagune', "Jinx's Hand Grenade", 'Patrick Star', 'CHICKEN JOCKEY!', 'Enderman']
        },
        {
            title: 'Miscellaneous & experiments',
            work: ['Axe', 'Turtle Shell Shield', 'Texture Painting WIP', 'Mech?', 'Donut', 'Sea Urchin', 'Man Fan']
        }
    ];

    const allCards = Array.from(portfolio.querySelectorAll('.collection-card, .work-item'));
    const getTitle = (card) => card.dataset.title || card.querySelector('h3, h4')?.textContent || '';

    categories.forEach((category) => {
        const section = document.createElement('section');
        section.className = 'work-category portfolio-category';

        const label = document.createElement('p');
        label.className = 'category-label';
        label.textContent = category.title;

        const collectionGrid = document.createElement('div');
        collectionGrid.className = 'collection-grid';
        const workGrid = document.createElement('div');
        workGrid.className = 'work-grid';

        category.work.forEach((title) => {
            const card = allCards.find((item) => getTitle(item) === title);
            if (card) (card.classList.contains('collection-card') ? collectionGrid : workGrid).append(card);
        });

        section.append(label);
        if (collectionGrid.childElementCount) section.append(collectionGrid);
        if (workGrid.childElementCount) section.append(workGrid);
        host.append(section);
    });

    portfolio.querySelectorAll('.featured-work, .work-category:not(.portfolio-category)').forEach((section) => section.remove());
})();

// The individual asset cards are older archive work, rather than a new batch.
document.querySelectorAll('.work-item .work-content').forEach((content) => {
    const archiveTag = document.createElement('span');
    archiveTag.className = 'archive-tag';
    archiveTag.textContent = '2025 or earlier';
    content.prepend(archiveTag);
});

// Make the older gallery work with a mouse, touch, or keyboard.
document.querySelectorAll('.work-item').forEach((card) => {
    const title = card.querySelector('h4')?.textContent || 'portfolio item';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${title}`);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// ==========================================
// Image lazy-load fade-in
// ==========================================
document.querySelectorAll('img:not(.lightbox-image)').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => {
            img.style.opacity = '0.3';
        });
    }
});

// ==========================================
// Lightbox
// ==========================================
(function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const imgEl = lightbox.querySelector('.lightbox-image');
    const captionEl = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let scale = 1, originX = 0, originY = 0;
    let isPanning = false, startX = 0, startY = 0;
    let gallery = [];
    let galleryIndex = 0;

    function applyTransform() {
        imgEl.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    }

    function resetTransform() {
        scale = 1; originX = 0; originY = 0;
        imgEl.style.transition = 'transform 0.2s ease';
        applyTransform();
    }

    function renderGalleryImage() {
        const src = gallery[galleryIndex];
        const hasMultipleImages = gallery.length > 1;
        resetTransform();
        imgEl.style.opacity = '1';
        imgEl.style.filter = 'none';
        imgEl.style.mixBlendMode = 'normal';
        imgEl.src = src;
        imgEl.alt = lightbox.dataset.title || 'Preview';
        captionEl.textContent = hasMultipleImages
            ? `${lightbox.dataset.title} · ${galleryIndex + 1} of ${gallery.length}`
            : lightbox.dataset.title || '';
        prevBtn.hidden = !hasMultipleImages;
        nextBtn.hidden = !hasMultipleImages;
    }

    function open(images, title) {
        gallery = images;
        galleryIndex = 0;
        lightbox.dataset.title = title || '';
        resetTransform();
        renderGalleryImage();
        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        requestAnimationFrame(() => { imgEl.src = ''; });
    }

    // Open on portfolio image click
    document.addEventListener('click', (e) => {
        const collection = e.target.closest('.collection-card');
        if (collection) {
            open(collection.dataset.gallery.split('|'), collection.dataset.title);
            return;
        }

        const card = e.target.closest('.work-item');
        if (card) {
            const img = card.querySelector('.work-image img');
            const title = card.querySelector('h4')?.textContent || '';
            if (img) open([img.src], title);
        }
    });

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
        renderGalleryImage();
    });
    nextBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex + 1) % gallery.length;
        renderGalleryImage();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('is-visible') && gallery.length > 1) prevBtn.click();
        if (e.key === 'ArrowRight' && lightbox.classList.contains('is-visible') && gallery.length > 1) nextBtn.click();
    });

    imgEl.addEventListener('dragstart', (e) => e.preventDefault());

    // Wheel zoom
    lightbox.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;
        e.preventDefault();
        imgEl.style.transition = 'none';
        scale = Math.min(4, Math.max(1, scale - Math.sign(e.deltaY) * 0.12));
        applyTransform();
    }, { passive: false });

    // Pan when zoomed
    imgEl.addEventListener('mousedown', (e) => {
        if (scale <= 1) return;
        isPanning = true;
        startX = e.clientX - originX;
        startY = e.clientY - originY;
        imgEl.style.cursor = 'grabbing';
        imgEl.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        originX = e.clientX - startX;
        originY = e.clientY - startY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
        imgEl.style.cursor = '';
    });
})();
