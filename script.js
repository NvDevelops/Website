// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add hover effects to cards
document.querySelectorAll('.skill-card, .ui-card, .work-item, .game-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced intersection observer for fade-in effects - faster appearance
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for cards
            if (entry.target.classList.contains('skills-grid') || 
                entry.target.classList.contains('working-on-grid') ||
                entry.target.classList.contains('ui-grid') || 
                entry.target.classList.contains('work-grid') || 
                entry.target.classList.contains('games-grid')) {
                
                const cards = entry.target.querySelectorAll('.skill-card, .working-on-card, .ui-card, .work-item, .game-card');
                // Make all cards appear at once for the 3D effect
                cards.forEach((card) => {
                    card.classList.add('visible');
                });
            }
        }
    });
}, observerOptions);

// Observe all sections and grids (excluding about section)
document.querySelectorAll('section:not(.about), .skills-grid, .working-on-grid, .ui-grid, .work-grid, .games-grid').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Add particle system
function createParticles() {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
            animation: particleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(particle);
        particles.push(particle);
    }
    
    return particles;
}

// Initialize particles
const particles = createParticles();

// Mouse trail effect removed as requested

// Add magnetic effect to cards
document.querySelectorAll('.skill-card, .working-on-card, .ui-card, .work-item, .game-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});

// Add ripple effect to all clickable elements
document.querySelectorAll('.btn, .social-link, .nav-links a').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add scroll-triggered parallax effect (section titles excluded)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add glitch text effect
function addGlitchEffect(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    
    element.addEventListener('mouseenter', () => {
        let glitchInterval;
        let glitchCount = 0;
        const maxGlitches = 10;
        
        glitchInterval = setInterval(() => {
            if (glitchCount >= maxGlitches) {
                clearInterval(glitchInterval);
                element.textContent = originalText;
                return;
            }
            
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.3) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
            glitchCount++;
        }, 50);
    });
    
    element.addEventListener('mouseleave', () => {
        element.textContent = originalText;
    });
}

// Add typing effect with cursor blink
function typeWriterWithCursor(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s infinite';
    element.appendChild(cursor);
    
    function type() {
        if (i < text.length) {
            const char = document.createTextNode(text.charAt(i));
            element.insertBefore(char, cursor);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                cursor.remove();
            }, 1000);
        }
    }
    
    // Start typing immediately
    type();
}

// Add cursor blink animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(cursorStyle);

// Initialize enhanced typing effect and glitch effects
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Temporarily disable typing animation - just show the full text
        heroTitle.textContent = 'Game Designer & 3D Artist';
        console.log('Hero title set to:', heroTitle.textContent);
    }
    
    // Add glitch effect to section titles and card titles (excluding hero title)
    document.querySelectorAll('.section-title, .skill-card h3, .working-on-card h3, .model-card h4, .game-card h4').forEach(element => {
        if (!element.classList.contains('hero-title')) {
            addGlitchEffect(element);
        }
    });
    
// Force abyss animations to work - wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const abyssIcon = document.querySelector('.abyss-icon');
        const abyssTitle = document.querySelector('.abyss-title');

        console.log('Looking for abyss elements...');
        console.log('Abyss icon:', abyssIcon);
        console.log('Abyss title:', abyssTitle);

        if (abyssIcon) {
            console.log('Abyss icon found, forcing fast rotation');
            
            // Make it bigger
            abyssIcon.style.width = '120px';
            abyssIcon.style.height = '120px';
            
            // Force CSS animation
            abyssIcon.style.animation = 'abyssSpin 2s linear infinite';
            abyssIcon.style.transformOrigin = 'center';
            abyssIcon.style.border = '3px solid #8b5cf6';
            abyssIcon.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.6)';
            
            // Manual rotation as primary method
            let rotation = 0;
            const rotateInterval = setInterval(() => {
                rotation += 4;
                abyssIcon.style.transform = `rotate(${rotation}deg)`;
                abyssIcon.style.transition = 'none';
            }, 50);
            
            console.log('Icon rotation started');
        } else {
            console.log('Abyss icon NOT found!');
        }
        
        // Force tab functionality to work
        initTeamTabs();
        
        // Also add direct event listeners as backup
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        console.log('Adding backup tab listeners...');
        tabButtons.forEach(button => {
            // Remove any existing listeners
            button.onclick = null;
            
            // Add new listener
            button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetTab = this.getAttribute('data-tab');
                console.log('Backup tab clicked:', targetTab);
                
                // Remove active from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('Backup activated panel:', targetTab);
                }
            };
        });
    }, 1000); // Wait 1 second for everything to load
});

if (abyssTitle) {
    console.log('Abyss title found, forcing wrap animation');
    abyssTitle.style.animation = 'abyssGlow 3s ease-in-out infinite, abyssWrap 6s ease-in-out infinite';
    abyssTitle.style.transformOrigin = 'center';
    abyssTitle.style.willChange = 'transform, opacity';
    
    // Manual wrap animation as backup
    let wrapPhase = 0;
    setInterval(() => {
        wrapPhase += 0.1;
        const scale = Math.sin(wrapPhase) * 0.3 + 0.7;
        const rotate = wrapPhase * 180;
        const opacity = Math.sin(wrapPhase * 0.5) * 0.3 + 0.7;
        abyssTitle.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        abyssTitle.style.opacity = opacity;
    }, 100);
} else {
    console.log('Abyss title NOT found!');
}
    
    // Debug all images
    const allImages = document.querySelectorAll('img');
    console.log(`Found ${allImages.length} images total`);
    
    allImages.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, {
            src: img.src,
            alt: img.alt,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
        });
        
        img.addEventListener('load', () => {
            console.log(`✅ Image ${index + 1} loaded successfully:`, img.src);
        });
        
        img.addEventListener('error', (e) => {
            console.error(`❌ Image ${index + 1} failed to load:`, img.src, e);
            // Try to reload the image
            const originalSrc = img.src;
            setTimeout(() => {
                img.src = '';
                img.src = originalSrc;
            }, 500);
        });
        
        // Check if image is already loaded
        if (img.complete && img.naturalWidth > 0) {
            console.log(`✅ Image ${index + 1} already loaded:`, img.src);
        } else if (img.complete && img.naturalWidth === 0) {
            console.error(`❌ Image ${index + 1} failed to load (no dimensions):`, img.src);
        }
    });
    
    // Test if we can access the file system
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // Initialize team tabs
    initTeamTabs();
});

// Team Tab Functionality
function initTeamTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    console.log('Initializing team tabs...');
    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab panels:', tabPanels.length);
    
    tabButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button.textContent, button.getAttribute('data-tab'));
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = button.getAttribute('data-tab');
            console.log('Clicked tab:', targetTab);
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log('Activated panel:', targetTab);
            } else {
                console.log('Panel not found:', targetTab);
            }
        });
    });
}

// Add glow effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
            section.style.boxShadow = `0 0 50px rgba(139, 92, 246, ${0.1 + (scrolled - sectionTop) / 1000})`;
        }
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add parallax effect to hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add glow effect to social links on hover
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 15px 30px rgba(139, 92, 246, 0.3)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Lightbox logic
(function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const imgEl = lightbox.querySelector('.lightbox-image');
    const captionEl = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, alt, caption) {
        imgEl.src = src;
        imgEl.alt = alt || 'Preview';
        captionEl.textContent = caption || '';
        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Clear src after animation frame to stop download if any
        requestAnimationFrame(() => { imgEl.src = ''; });
    }

    // Open from portfolio/game images
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && (target.closest('.work-image img') || target.closest('.game-image img'))) {
            const img = target.closest('img');
            const card = img.closest('.work-item, .game-card');
            const title = card ? (card.querySelector('h4, h3')?.textContent || '') : '';
            openLightbox(img.src, img.alt, title);
        }
    });

    // Close interactions
    backdrop.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Prevent image drag ghosting, enable wheel zoom
    imgEl.addEventListener('dragstart', (e) => e.preventDefault());

    let scale = 1;
    let originX = 0;
    let originY = 0;
    let isPanning = false;
    let startX = 0, startY = 0;

    function applyTransform() {
        imgEl.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
        imgEl.style.transition = 'transform 0.05s linear';
    }

    lightbox.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;
        e.preventDefault();
        const delta = Math.sign(e.deltaY);
        const newScale = Math.min(4, Math.max(1, scale - delta * 0.1));
        if (newScale !== scale) {
            scale = newScale;
            applyTransform();
        }
    }, { passive: false });

    imgEl.addEventListener('mousedown', (e) => {
        if (scale <= 1) return;
        isPanning = true;
        startX = e.clientX - originX;
        startY = e.clientY - originY;
        imgEl.style.cursor = 'grabbing';
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

    // Reset transform when image changes or modal closes
    const resetTransform = () => {
        scale = 1; originX = 0; originY = 0; applyTransform();
    };
    closeBtn.addEventListener('click', resetTransform);
    backdrop.addEventListener('click', resetTransform);
})();

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or menus
        document.querySelectorAll('.modal, .menu').forEach(element => {
            element.style.display = 'none';
        });
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', () => {}, {passive: true});

// Add performance optimization
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});



