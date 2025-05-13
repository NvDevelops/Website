// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Parallax effect for hero section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    hero.style.backgroundPosition = `${mouseX * 50}px ${mouseY * 50}px`;
});

// Add project cards dynamically
const projects = [
    {
        title: "Game 1",
        description: "Game",
        image: "path/to/image1.jpg",
        link: "https://www.roblox.com/games/your-game-id"
    },
    {
        title: "Game 2",
        description: "Game",
        image: "path/to/image2.jpg",
        link: "https://www.roblox.com/games/your-game-id"
    },
    // Add more projects here
];

const projectGrid = document.querySelector('.project-grid');

projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="btn secondary" target="_blank">View Project</a>
        </div>
    `;
    projectGrid.appendChild(card);
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 255, 157, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add your form submission logic here
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Example: Send data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Message sent successfully!';
    contactForm.appendChild(successMessage);
    
    // Clear form
    contactForm.reset();
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
});

// Add scroll reveal animation
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

// Add scroll event listener
window.addEventListener('scroll', revealOnScroll);

// Trigger initial reveal check
revealOnScroll();

// Particle Background FX
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particleCount = 60;
    const particles = [];
    const colors = ['#00ff9d', '#00ffff', '#ff00ff', '#ffffff'];

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        const radius = randomBetween(1.5, 3.5);
        return {
            x: randomBetween(radius, width - radius),
            y: randomBetween(radius, height - radius),
            vx: randomBetween(-0.3, 0.3),
            vy: randomBetween(-0.3, 0.3),
            radius,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: randomBetween(0.5, 0.9)
        };
    }

    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
    }

    function updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < p.radius || p.x > width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > height - p.radius) p.vy *= -1;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let p of particles) {
            updateParticle(p);
            drawParticle(p);
        }
        requestAnimationFrame(animate);
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
    animate();
})(); 