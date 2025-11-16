/* ============================================================
    LOADER
   ============================================================ */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".loader").classList.add("loader-hidden");
    }, 600);
});

/* ============================================================
    MENÚ HAMBURGUESA ANIMADO
   ============================================================ */
const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    menu.classList.toggle('open');
});

/* Cerrar al hacer click en un enlace */
document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
        toggleBtn.classList.remove("open");
        menu.classList.remove("open");
    });
});

/* ============================================================
    FADE-IN + BLUR (4A)
   ============================================================ */
const faders = document.querySelectorAll(".fade-section");

const appearOptions = {
    threshold: 0.28
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

/* ============================================================
    HERO PARALLAX SUAVE
   ============================================================ */
const heroBg = document.querySelector(".hero-bg");

document.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth - 0.5) * 4;
    let y = (e.clientY / window.innerHeight - 0.5) * 4;
    heroBg.style.transform = `scale(1.12) translate(${x}px, ${y}px)`;
});

/* ============================================================
    HOVER 3D (Servicios + Proyectos)
   ============================================================ */
function tiltCard(card) {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y - rect.height / 2) / 18) * -1;
        const rotateY = (x - rect.width / 2) / 18;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
}

document.querySelectorAll(".service-card, .pro-item, .m-item").forEach(tiltCard);

/* ============================================================
    MASONRY GRID (2A) — Auto ajuste al cargar imágenes
   ============================================================ */
window.addEventListener("load", () => {
    const masonry = document.querySelector(".masonry");
    if (masonry) {
        masonry.style.opacity = "1";
    }
});

/* ============================================================
    LIGHTBOX BLANCO ARQUITECTÓNICO (3C)
   ============================================================ */
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `
    <span class="close-lightbox">&times;</span>
    <img id="lightbox-img" src="">
    <div id="lightbox-title"></div>
`;
document.body.appendChild(lightbox);

const lbImg = document.getElementById("lightbox-img");
const lbTitle = document.getElementById("lightbox-title");

document.querySelectorAll(".m-item img, .pro-img").forEach(img => {
    img.addEventListener("click", () => {
        lbImg.src = img.src || img.style.backgroundImage.slice(5, -2);
        lbTitle.textContent = img.dataset.title || "";
        lightbox.style.display = "flex";
    });
});

document.querySelector(".close-lightbox").addEventListener("click", () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
    }
});
