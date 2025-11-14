/* =======================================
    ANIMACIONES ON SCROLL (Fade-In)
   ======================================= */
const faders = document.querySelectorAll('.fade-in');

const options = { threshold: 0.25 };

const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        appearOnScroll.unobserve(entry.target);
    });
}, options);

faders.forEach(fader => appearOnScroll.observe(fader));


/* =======================================
    MENÚ HAMBURGUESA ANIMADO
   ======================================= */
const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    menu.classList.toggle('open');
});

/* Cerrar menú si se hace clic en un enlace */
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggleBtn.classList.remove('open');
    });
});


/* =======================================
    LOADER PREMIUM
   ======================================= */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".loader").classList.add("loader-hidden");
    }, 600);
});


/* =======================================
    PARALLAX REAL DEL HERO
   ======================================= */
const heroBg = document.querySelector(".hero-bg");
document.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth - 0.5) * 6;
    let y = (e.clientY / window.innerHeight - 0.5) * 6;

    heroBg.style.transform = `scale(1.15) translate(${x}px, ${y}px)`;
});


/* =======================================
    TARJETAS 3D (Servicios & Proyectos)
   ======================================= */
function tiltCard(card) {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / 20) * -1;
        const rotateY = (x - centerX) / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
}

document.querySelectorAll(".service-card, .pro-item").forEach(tiltCard);


/* =======================================
    LIGHTBOX PARA PROYECTOS
   ======================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("lightboxClose");

/* Abrir imagen */
document.querySelectorAll(".pro-item").forEach(item => {
    item.addEventListener("click", () => {
        const imgSrc = item.getAttribute("data-img");
        lightboxImg.src = imgSrc;
        lightbox.classList.add("open");
    });
});

/* Cerrar lightbox */
closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
});

/* Cerrar al hacer clic afuera */
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("open");
    }
});

/* Escape para cerrar */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("open");
});
