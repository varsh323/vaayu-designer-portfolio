/* ===================================================================
   VAAYU DESIGNER — JavaScript
   Particles · Scroll Reveal · Mouse Glow · Navbar · Form
=================================================================== */

/* ─── Cursor / Mouse Glow ──────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

(function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
})();

/* ─── Navbar scroll effect ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ─── Mobile nav toggle ────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ─── Particle Canvas ──────────────────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
        // random purple or pink hue
        this.color = Math.random() > 0.5
            ? `rgba(168, 85, 247, ${this.alpha})`
            : `rgba(236, 72, 153, ${this.alpha})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -10 || this.x > canvas.width + 10 ||
            this.y < -10 || this.y > canvas.height + 10) {
            this.init();
        }
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── Scroll Reveal (IntersectionObserver) ─────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* Also trigger hero elements immediately */
document.querySelectorAll('.hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
});

/* ─── Service card tilt effect ─────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const rotX = (-y / r.height * 8).toFixed(2);
        const rotY = (x / r.width * 8).toFixed(2);
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ─── Info card tilt effect ────────────────────────────────────── */
document.querySelectorAll('.stat-card, .info-card, .about-side-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const rotX = (-y / r.height * 5).toFixed(2);
        const rotY = (x / r.width * 5).toFixed(2);
        card.style.transform = `perspective(500px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ─── Smooth active nav highlight on scroll ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}`
                    ? '#fff'
                    : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── Contact Form ─────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const email = form.email.value.trim();
    const type = form.projectType.value;
    const budget = form.budget.value;
    const message = form.message.value.trim();

    if (!email || !type || !budget || !message) {
        shakeForm();
        return;
    }

    // Simulate send
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        submitBtn.style.display = 'none';
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => {
            successMsg.style.display = 'none';
            submitBtn.style.display = '';
            submitBtn.style.opacity = '';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message 🚀';
        }, 5000);
    }, 1200);
});

function shakeForm() {
    form.style.animation = 'shake 0.4s ease';
    form.addEventListener('animationend', () => form.style.animation = '', { once: true });
}

// Inject shake keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

/* ─── Glowing number counter ───────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const val = Math.floor(progress * target);
        el.textContent = val + '+';
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
    };
    requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const counters = [4, 10, 5];

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNums.forEach((el, i) => animateCounter(el, counters[i]));
            counterObs.disconnect();
        }
    });
}, { threshold: 0.5 });

if (statNums.length) counterObs.observe(statNums[0]);

/* ─── Glow pulse on hero image hover ──────────────────────────── */
const heroFrame = document.querySelector('.hero-img-frame');
if (heroFrame) {
    heroFrame.addEventListener('mouseenter', () => {
        document.querySelector('.img-glow-ring').style.opacity = '0.6';
    });
    heroFrame.addEventListener('mouseleave', () => {
        document.querySelector('.img-glow-ring').style.opacity = '0.35';
    });
}
