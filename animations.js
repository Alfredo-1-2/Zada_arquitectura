/* ============================================================
   LOADER + MASONRY INIT
   ============================================================ */
window.addEventListener("load", () => {

    // Ocultar loader
    setTimeout(() => {
        document.querySelector(".loader").classList.add("loader-hidden");
    }, 600);

    // Mostrar masonry al cargar imágenes
    const masonry = document.querySelector(".masonry");
    if (masonry) masonry.style.opacity = "1";
});

/* ============================================================
   MENÚ HAMBURGUESA
   ============================================================ */
const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    menu.classList.toggle('open');
});

// Cerrar al hacer click en un enlace
document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
        toggleBtn.classList.remove("open");
        menu.classList.remove("open");
    });
});

/* ============================================================
   FADE + BLUR
   ============================================================ */
const faders = document.querySelectorAll(".fade-section");
const appearOptions = { threshold: 0.28 };

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
    let x = (e.clientX / window.innerWidth - 0.5) * 3;
    let y = (e.clientY / window.innerHeight - 0.5) * 3;
    heroBg.style.transform = `scale(1.12) translate(${x}px, ${y}px)`;
});

/* ============================================================
   HOVER 3D (Servicios + Masonry)
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

document.querySelectorAll(".service-card, .m-item").forEach(tiltCard);

/* ============================================================
   LIGHTBOX PREMIUM
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbTitle = document.getElementById("lightbox-title");
const closeBtn = document.querySelector(".close-lightbox");

// Abrir
document.querySelectorAll(".m-item img").forEach(img => {
    img.addEventListener("click", () => {
        lbImg.src = img.src;
        lbTitle.textContent = img.dataset.title || "";
        lightbox.style.display = "flex";
    });
});

// Cerrar botón
closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// Cerrar haciendo click fuera
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
    }
});
