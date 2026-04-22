/* ════════════════════════════════════════════════
   Itachi Portfolio — Enhanced Script
   ════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});
document.querySelectorAll("a, .tomoe-hit, .tomoe-dot, .tomoe-tail, button")
  .forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("big"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
  });

/* ── CHAKRA PARTICLE CANVAS ── */
const canvas = document.getElementById("chakra");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
document.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

/* Particle pool */
const PARTICLE_COUNT = 120;
let particles = [];

function makeParticle(fromMouse = false) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.8 + 0.2;
  return {
    x:      fromMouse ? mouse.x : Math.random() * canvas.width,
    y:      fromMouse ? mouse.y : Math.random() * canvas.height,
    size:   Math.random() * 2.5 + 0.5,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    life:   1,
    decay:  Math.random() * 0.004 + 0.002,
    hue:    Math.random() * 30,
    mouse:  fromMouse,
  };
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());

/* Mouse-burst particles */
let lastBurst = 0;
document.addEventListener("mousemove", e => {
  const now = Date.now();
  if (now - lastBurst > 40) {
    particles.push(makeParticle(true));
    lastBurst = now;
  }
});

function drawParticle(p) {
  const alpha = p.life * 0.85;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${alpha})`;
  ctx.shadowBlur  = 12;
  ctx.fillStyle   = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
  ctx.fill();
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const vg = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, 0,
    canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/1.4
  );
  vg.addColorStop(0, "transparent");
  vg.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= p.decay;

    if (p.mouse) {
      p.speedX *= 0.97;
      p.speedY *= 0.97;
    }

    if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      if (p.mouse) {
        particles.splice(i, 1);
      } else {
        particles[i] = makeParticle();
      }
      continue;
    }
    drawParticle(p);
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ── CLOUD GENERATOR ── */
const cloudLayer = document.getElementById("cloud-layer");

function createCloud() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 200 120");
  svg.classList.add("cloud");

  svg.innerHTML = `
    <path d="
      M40 65
      C30 55 30 40 45 35
      C55 15 95 15 105 35
      C120 25 145 35 145 55
      C165 55 175 75 155 85
      L75 85
      C55 85 45 80 45 70
      C35 75 30 70 40 65 Z"
      fill="#cc0000"
      stroke="rgba(255,80,80,0.3)"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <path d="M55 75 C60 65 90 60 110 72" stroke="rgba(255,120,120,0.3)" stroke-width="2" fill="none"/>
  `;

  const scale    = 0.5 + Math.random() * 0.8;
  const duration = 30 + Math.random() * 30;
  const top      = Math.random() * 85;
  const anims    = ["cloudRight", "cloudLeft", "cloudDiagonal"];
  const chosen   = anims[Math.floor(Math.random() * anims.length)];

  svg.style.cssText = `
    top: ${top}vh;
    transform: scale(${scale});
    animation: ${chosen} ${duration}s linear infinite;
    opacity: ${0.5 + Math.random() * 0.4};
  `;

  cloudLayer.appendChild(svg);
  setTimeout(() => svg.remove(), (duration + 5) * 1000);
}

setInterval(createCloud, 4000);
createCloud();

/* ── INTRO SEQUENCE ── */
window.addEventListener("load", () => {

  setTimeout(() => {
    document.querySelector(".top-lid").classList.add("open-top");
    document.querySelector(".bottom-lid").classList.add("open-bottom");
  }, 600);

  setTimeout(() => {
    const intro = document.getElementById("intro");
    intro.style.transition = "opacity 1.2s ease";
    intro.style.opacity    = "0";
    setTimeout(() => { intro.style.display = "none"; }, 1200);

    const wrapper = document.getElementById("main-container");
    wrapper.classList.add("visible");

    const navbar = document.getElementById("navbar");
    navbar.classList.add("visible");

    const eyeRotate = document.getElementById("eyeRotate");
    eyeRotate.style.animation = "spinFast 0.4s linear infinite";

    setTimeout(() => {
      eyeRotate.style.animation = "";
      eyeRotate.classList.add("slow-stop");

      setTimeout(() => {
        eyeRotate.classList.remove("slow-stop");
        eyeRotate.classList.add("stopped");
        document.querySelector(".orbit").classList.add("spinning");
      }, 3200);
    }, 2000);

  }, 3200);
});

/* ── TOMOE CLICK → SMOOTH SCROLL ── */
document.querySelectorAll(".tomoe-group").forEach(g => {
  g.style.cursor = "pointer";
  g.addEventListener("click", () => {
    const id = g.getAttribute("data-target");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ── PUPIL FOLLOWS MOUSE ── */
const pupil      = document.getElementById("pupil");
const pupilInner = document.getElementById("pupil-inner");
const pupilGlint = document.getElementById("pupil-glint");

document.addEventListener("mousemove", e => {
  const svg = document.querySelector(".sharingan");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = e.clientX - cx;
  const dy   = e.clientY - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const maxMove = 14;
  const ratio   = Math.min(dist, 80) / 80;
  const mx = (dx / dist || 0) * maxMove * ratio;
  const my = (dy / dist || 0) * maxMove * ratio;

  if (pupil)      { pupil.setAttribute("cx", 150 + mx);      pupil.setAttribute("cy", 150 + my); }
  if (pupilInner) { pupilInner.setAttribute("cx", 150 + mx); pupilInner.setAttribute("cy", 150 + my); }
  if (pupilGlint) { pupilGlint.setAttribute("cx", 143 + mx); pupilGlint.setAttribute("cy", 143 + my); }
});

/* ── SCROLL → MANGEKYO + REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("revealed");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".section-inner").forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
  const sharingan = document.getElementById("sharinganSVG");
  const eyeRotate = document.getElementById("eyeRotate");
  if (!sharingan) return;

  if (window.scrollY > 200) {
    sharingan.classList.add("mangekyo-active");
    eyeRotate.classList.add("stopped");
    eyeRotate.classList.remove("slow-stop");
    eyeRotate.style.animation = "none";
  } else {
    sharingan.classList.remove("mangekyo-active");
  }
});

/* ── NAVBAR SCROLL HIDE/SHOW ── */
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const current = window.scrollY;
  if (current > lastScroll && current > 80) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }
  lastScroll = current;
});

/* ── CARD HOVER TILT ── */
document.querySelectorAll(".glass-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

/* ── CLICK RIPPLE EFFECT ── */
document.addEventListener("click", e => {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top:  ${e.clientY}px;
    width: 6px; height: 6px;
    border-radius: 50%;
    border: 2px solid #cc0000;
    transform: translate(-50%, -50%) scale(0);
    animation: rippleOut 0.6s ease forwards;
    pointer-events: none;
    z-index: 9998;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

const ks = document.createElement("style");
ks.textContent = `@keyframes rippleOut { to { transform: translate(-50%, -50%) scale(18); opacity: 0; } }`;
document.head.appendChild(ks);

/* ── CERTIFICATE LIGHTBOX ── */
function openCert(src) {
  const lb  = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = src;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCert() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}
// Close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCert();
});