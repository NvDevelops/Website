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

// ==========================================
// Scroll-triggered fade-up animations
// ==========================================
const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = (entry.target.dataset.index || 0) * 80;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            animateObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.now-card, .work-item, .tg-card').forEach((el, i) => {
    el.dataset.index = i % 6;
    animateObserver.observe(el);
});

// ==========================================
// Image lazy-load fade-in
// ==========================================
document.querySelectorAll('img').forEach(img => {
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

    let scale = 1, originX = 0, originY = 0;
    let isPanning = false, startX = 0, startY = 0;

    function applyTransform() {
        imgEl.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    }

    function resetTransform() {
        scale = 1; originX = 0; originY = 0;
        imgEl.style.transition = 'transform 0.2s ease';
        applyTransform();
    }

    function open(src, alt, caption) {
        resetTransform();
        imgEl.src = src;
        imgEl.alt = alt || 'Preview';
        captionEl.textContent = caption || '';
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
        const img = e.target.closest('.work-image img');
        if (img) {
            const card = img.closest('.work-item');
            const title = card?.querySelector('h4')?.textContent || '';
            open(img.src, img.alt, title);
        }
    });

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
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
