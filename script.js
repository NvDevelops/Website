// Smooth scrolling for navigation links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100; // Adjust based on your header height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Matrix Effect
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class MatrixEffect {
    constructor() {
        this.fontSize = 14;
        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    }

    draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff9d';
        ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
}

const matrix = new MatrixEffect();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    matrix.draw();
    requestAnimationFrame(animate);
}

animate();

// Project data structure with enhanced details
const projects = [];

// Dynamically create project cards
const projectGrid = document.querySelector('.project-grid');

projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-image" style="height:200px;display:flex;align-items:center;justify-content:center;background:#111;">
            <img src="${project.image}" alt="${project.title}" style="max-width:100%;max-height:100%;object-fit:contain;">
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
                <a href="${project.links['Play Game']}" target="_blank" class="btn secondary">View Project</a>
            </div>
        </div>
    `;
    projectGrid.appendChild(card);
});

// Enhanced hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 255, 157, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

// Enhanced Project Card Parallax
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        // Apply 3D transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Move image in opposite direction for parallax effect
        const image = card.querySelector('.project-image');
        if (image) {
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            image.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        const image = card.querySelector('.project-image');
        if (image) {
            image.style.transform = 'translateX(0) translateY(0)';
        }
    });
});

// Enhanced form submission handling with validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic form validation
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message with animation
    showMessage('Message sent successfully!', 'success');
    
    // Clear form
    contactForm.reset();
});

// Helper function to show messages
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    contactForm.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Enhanced scroll reveal animation
const revealElements = document.querySelectorAll('.projects, .about, .contact');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for reveal elements
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
});

// Add scroll event listener with throttling
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            revealOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Trigger initial reveal check
revealOnScroll();

// Fixed Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
        this.originalText = el.innerText;
        this.isAnimating = false;
    }
    
    setText(newText) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.isAnimating = false;
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize text scramble on headings with fixed event listeners
document.querySelectorAll('h1, h2, h3').forEach(heading => {
    const fx = new TextScramble(heading);
    const originalText = heading.innerText;
    
    // Scramble on hover
    heading.addEventListener('mouseenter', () => {
        if (!fx.isAnimating) {
            fx.setText(originalText);
        }
    });
    
    // Initial scramble
    fx.setText(originalText);
});

// Scroll Progress
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
});

// Project Modal System
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
document.body.appendChild(modalOverlay);

function createImagePreview(modal) {
    const gallery = modal.querySelector('.modal-gallery');
    const images = gallery.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <div class="preview-content">
                    <img src="${img.src}" alt="Preview">
                    <button class="preview-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(preview);
            
            setTimeout(() => {
                preview.classList.add('active');
            }, 10);
            
            preview.addEventListener('click', (e) => {
                if (e.target === preview || e.target.className === 'preview-close') {
                    preview.classList.remove('active');
                    setTimeout(() => {
                        preview.remove();
                    }, 300);
                }
            });
        });
    });
}

function createModal(project) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${project.title}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
            <div class="modal-gallery">
                ${project.images ? project.images.map(img => `
                    <img src="${img}" alt="${project.title} screenshot">
                `).join('') : ''}
            </div>
            <div class="modal-info">
                <p class="modal-description">${project.longDescription || project.description}</p>
                <div class="modal-features">
                    ${project.features ? project.features.map(feature => `
                        <li>${feature}</li>
                    `).join('') : ''}
                </div>
                <div class="modal-links">
                    ${project.links ? Object.entries(project.links).map(([text, url]) => `
                        <a href="${url}" target="_blank">${text}</a>
                    `).join('') : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add image preview functionality
    createImagePreview(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modal);
        }
    });
    
    // Open modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
        modal.classList.add('active');
    }, 10);
    
    return modal;
}

function closeModal(modal) {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Update project card click handlers
document.querySelectorAll('.project-card').forEach(card => {
    const viewButton = card.querySelector('.btn');
    if (viewButton) {
        viewButton.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = card.querySelector('h3').textContent;
            const project = projects.find(p => p.title === projectTitle);
            if (project) {
                createModal(project);
            }
        });
    }
});

// Section Transitions
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Add typing effect to skill list
const skillList = document.querySelectorAll('.skill-list li');
skillList.forEach((skill, index) => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        skill.style.transition = 'all 0.5s ease';
        skill.style.opacity = '1';
        skill.style.transform = 'translateX(0)';
    }, index * 100);
});

// Twitter Feed Integration
async function fetchLatestTweet() {
    const tweetContainer = document.getElementById('tweet-container');
    const username = 'EnviousDevelops'; // Your Twitter username

    try {
        // Using Twitter API v2 through a proxy server
        const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}/tweets?max_results=1&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`, {
            headers: {
                'Authorization': 'Bearer YOUR_TWITTER_API_BEARER_TOKEN' // You'll need to replace this with your actual bearer token
            }
        });

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const tweet = data.data[0];
            const media = data.includes?.media || [];
            
            // Format the tweet HTML
            const tweetHTML = `
                <div class="tweet">
                    <div class="tweet-header">
                        <img src="ProfilePic.jpg" alt="Profile" class="tweet-avatar">
                        <div class="tweet-user">
                            <span class="tweet-name">Nv</span>
                            <span class="tweet-username">@${username}</span>
                        </div>
                    </div>
                    <div class="tweet-content">
                        ${formatTweetText(tweet.text)}
                    </div>
                    ${formatTweetMedia(media)}
                    <div class="tweet-stats">
                        <div class="tweet-stat">
                            <i class="far fa-comment"></i>
                            <span>${tweet.public_metrics.reply_count}</span>
                        </div>
                        <div class="tweet-stat">
                            <i class="fas fa-retweet"></i>
                            <span>${tweet.public_metrics.retweet_count}</span>
                        </div>
                        <div class="tweet-stat">
                            <i class="far fa-heart"></i>
                            <span>${tweet.public_metrics.like_count}</span>
                        </div>
                    </div>
                </div>
            `;
            
            tweetContainer.innerHTML = tweetHTML;
        }
    } catch (error) {
        console.error('Error fetching tweet:', error);
        tweetContainer.innerHTML = `
            <div class="tweet-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load latest tweet</p>
            </div>
        `;
    }
}

function formatTweetText(text) {
    // Convert URLs to clickable links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert hashtags to links
    text = text.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>');
    
    // Convert mentions to links
    text = text.replace(/@(\w+)/g, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
    
    return text;
}

function formatTweetMedia(media) {
    if (!media.length) return '';
    
    return media.map(item => {
        if (item.type === 'photo') {
            return `
                <div class="tweet-media">
                    <img src="${item.url}" alt="Tweet media">
                </div>
            `;
        } else if (item.type === 'video') {
            return `
                <div class="tweet-media">
                    <video controls>
                        <source src="${item.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
        return '';
    }).join('');
}

// Fetch tweet when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestTweet();
    // Refresh tweet every 5 minutes
    setInterval(fetchLatestTweet, 300000);
}); 