/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".loader").classList.add("loader-hidden");
    }, 600);
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
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.28 });

faders.forEach(f => observer.observe(f));

/* ============================================================
   PARALLAX HERO
   ============================================================ */
const heroBg = document.querySelector(".hero-bg");
document.addEventListener("mousemove", e => {
    let x = (e.clientX / window.innerWidth - 0.5) * 3;
    let y = (e.clientY / window.innerHeight - 0.5) * 3;
    heroBg.style.transform = `scale(1.12) translate(${x}px, ${y}px)`;
});

/* ============================================================
   HOVER 3D
   ============================================================ */
function tiltCard(card) {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let rotateX = ((y - rect.height / 2) / 18) * -1;
        let rotateY = (x - rect.width / 2) / 18;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
}

document.querySelectorAll(".service-card, .m-item").forEach(tiltCard);

/* ============================================================
   LIGHTBOX PREMIUM (CORREGIDO)
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lbImg = document.querySelector(".lightbox-img");
const lbTitle = document.querySelector(".lightbox-title");
const closeBtn = document.querySelector(".lightbox-close");

document.querySelectorAll(".m-item img").forEach(img => {
    img.addEventListener("click", () => {
        lbImg.src = img.src;
        lbTitle.textContent = img.dataset.title || "";
        lightbox.classList.add("open");
    });
});

closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("open");
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("open");
    }
});
