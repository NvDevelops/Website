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
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                message: data.message,
                to: 'nvdevelops@gmail.com'
            })
        });
        
        if (response.ok) {
            showMessage('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            showMessage('Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again later.', 'error');
    }
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


document.querySelectorAll('h1, h2, h3').forEach(heading => {
    const fx = new TextScramble(heading);
    const originalText = heading.innerText;
    

    heading.addEventListener('mouseenter', () => {
        if (!fx.isAnimating) {
            fx.setText(originalText);
        }
    });
    

    fx.setText(originalText);
});


const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
});


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
    

    createImagePreview(modal);
    

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modal);
        }
    });
    

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


const dotsCanvas = document.createElement('canvas');
dotsCanvas.id = 'dots-bg-canvas';
dotsCanvas.style.position = 'fixed';
dotsCanvas.style.top = '0';
dotsCanvas.style.left = '0';
dotsCanvas.style.width = '100vw';
dotsCanvas.style.height = '100vh';
dotsCanvas.style.zIndex = '-1';
document.body.prepend(dotsCanvas);

const dctx = dotsCanvas.getContext('2d');
let dots = [];
const DOTS_COUNT = 60;
const DOT_COLOR = '#00ff9d';
const DOT_RADIUS = 2.5;

function resizeDotsCanvas() {
    dotsCanvas.width = window.innerWidth;
    dotsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeDotsCanvas);
resizeDotsCanvas();

function createDots() {
    dots = [];
    for (let i = 0; i < DOTS_COUNT; i++) {
        dots.push({
            x: Math.random() * dotsCanvas.width,
            y: Math.random() * dotsCanvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2
        });
    }
}
createDots();

function animateDots() {
    dctx.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
    for (let dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > dotsCanvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > dotsCanvas.height) dot.vy *= -1;
        dctx.beginPath();
        dctx.arc(dot.x, dot.y, DOT_RADIUS, 0, 2 * Math.PI);
        dctx.fillStyle = DOT_COLOR;
        dctx.globalAlpha = 0.6;
        dctx.fill();
        dctx.globalAlpha = 1;
    }
    requestAnimationFrame(animateDots);
}
animateDots();


(function() {
    const container = document.getElementById('tic-tac-toe-container');
    if (!container) return;
    let board = Array(9).fill(null);
    let player = 'X';
    let ai = 'O';
    let gameOver = false;

    function render() {
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(3, 60px)';
        grid.style.gridGap = '8px';
        grid.style.margin = '0 auto';
        grid.style.justifyContent = 'center';
        grid.style.alignItems = 'center';
        grid.style.placeItems = 'center';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.textContent = board[i] || '';
            cell.style.width = '60px';
            cell.style.height = '60px';
            cell.style.fontSize = '2em';
            cell.style.background = '#181818';
            cell.style.color = '#00ff9d';
            cell.style.border = '2px solid #00ff9d';
            cell.style.borderRadius = '8px';
            cell.style.cursor = board[i] || gameOver ? 'not-allowed' : 'pointer';
            cell.onclick = () => move(i);
            grid.appendChild(cell);
        }
        container.appendChild(grid);
        const status = document.createElement('div');
        status.style.color = '#fff';
        status.style.marginTop = '16px';
        status.style.fontFamily = 'Orbitron, sans-serif';
        status.style.fontSize = '1.1em';
        if (gameOver) {
            const winner = getWinner();
            status.textContent = winner ? (winner === player ? 'You win!' : 'AI wins!') : 'Draw!';
        } else {
            status.textContent = 'Your turn!';
        }
        container.appendChild(status);
        if (gameOver) {
            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Restart';
            resetBtn.style.marginTop = '12px';
            resetBtn.style.background = '#111';
            resetBtn.style.color = '#00ff9d';
            resetBtn.style.border = '2px solid #00ff9d';
            resetBtn.style.borderRadius = '6px';
            resetBtn.style.padding = '8px 18px';
            resetBtn.style.fontFamily = 'Orbitron, sans-serif';
            resetBtn.style.fontSize = '1em';
            resetBtn.style.cursor = 'pointer';
            resetBtn.onclick = () => {
                board = Array(9).fill(null);
                gameOver = false;
                render();
            };
            container.appendChild(resetBtn);
        }
    }

    function move(i) {
        if (board[i] || gameOver) return;
        board[i] = player;
        if (getWinner() || board.every(cell => cell)) {
            gameOver = true;
            render();
            return;
        }
        aiMove();
        if (getWinner() || board.every(cell => cell)) {
            gameOver = true;
        }
        render();
    }

    function aiMove() {

        let bestScore = -Infinity;
        let moveIdx = -1;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = ai;
                let score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    moveIdx = i;
                }
            }
        }
        if (moveIdx !== -1) board[moveIdx] = ai;
    }

    function minimax(b, depth, isMaximizing) {
        const winner = getWinner(b);
        if (winner === ai) return 10 - depth;
        if (winner === player) return depth - 10;
        if (b.every(cell => cell)) return 0;
        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = ai;
                    best = Math.max(best, minimax(b, depth + 1, false));
                    b[i] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = player;
                    best = Math.min(best, minimax(b, depth + 1, true));
                    b[i] = null;
                }
            }
            return best;
        }
    }

    function getWinner(b = board) {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (let [a,b1,c] of wins) {
            if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
        }
        return null;
    }

    render();
})();


document.addEventListener('DOMContentLoaded', function() {
    const viewBtn = document.getElementById('viewProjectBtn');
    const modal = document.getElementById('coinRunnerModal');
    const closeBtn = document.getElementById('closeCoinRunnerModal');
    if (viewBtn && modal && closeBtn) {
        viewBtn.onclick = () => { modal.style.display = 'flex'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
});

const style = document.createElement('style');
style.innerHTML = `
#viewProjectBtn:hover {
  box-shadow: 0 0 16px #00ff9d, 0 0 32px #00ff9d66;
  transform: scale(1.07);
  background: #181818;
}
`;
document.head.appendChild(style);



