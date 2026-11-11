(() => {
    "use strict";

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover     = matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ============================================================
       LOADER
       Se oculta al cargar la página, y por seguridad a los 3.5 s
       aunque alguna imagen tarde (o falle) en cargar.
       ============================================================ */
    const loader = $(".loader");
    const hideLoader = () => loader && loader.classList.add("loader-hidden");

    if (document.readyState === "complete") {
        setTimeout(hideLoader, 300);
    } else {
        window.addEventListener("load", () => setTimeout(hideLoader, 300));
    }
    setTimeout(hideLoader, 3500);

    /* ============================================================
       AÑO DEL FOOTER
       ============================================================ */
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    /* ============================================================
       MENÚ HAMBURGUESA
       ============================================================ */
    const toggleBtn = $(".menu-toggle");
    const menu = $("#menu");

    const setMenu = (open) => {
        toggleBtn.classList.toggle("open", open);
        menu.classList.toggle("open", open);
        toggleBtn.setAttribute("aria-expanded", String(open));
        toggleBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };

    toggleBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));

    $$(".menu a").forEach(link => link.addEventListener("click", () => setMenu(false)));

    // Cerrar al tocar fuera del menú
    document.addEventListener("click", (e) => {
        if (menu.classList.contains("open") && !menu.contains(e.target) && !toggleBtn.contains(e.target)) {
            setMenu(false);
        }
    });

    /* ============================================================
       FADE-IN AL HACER SCROLL
       threshold bajo: con 0.28 una sección muy alta (como Proyectos
       en celular) podía no llegar nunca a "verse" y quedar invisible.
       ============================================================ */
    const faders = $$(".fade-section");

    if ("IntersectionObserver" in window) {
        const fadeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

        faders.forEach(f => fadeObserver.observe(f));
    } else {
        faders.forEach(f => f.classList.add("visible"));
    }

    /* ============================================================
       SECCIÓN ACTIVA EN EL MENÚ
       ============================================================ */
    const navLinks = $$('.menu a[href^="#"]');

    if ("IntersectionObserver" in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === "#" + entry.target.id) {
                        link.setAttribute("aria-current", "true");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        $$("main section[id]").forEach(s => spy.observe(s));
    }

    /* ============================================================
       PARALLAX DEL HERO
       Antes asignaba "transform" por JS, pero la animación CSS de zoom
       lo pisaba, así que nunca se veía. Ahora usa --px / --py + "translate".
       ============================================================ */
    const hero = $(".hero");
    const heroBg = $(".hero-bg");

    if (hero && heroBg && canHover && !reduceMotion) {
        let raf = 0;

        hero.addEventListener("mousemove", (e) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const r = hero.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width  - 0.5) * -16;
                const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
                heroBg.style.setProperty("--px", x.toFixed(1) + "px");
                heroBg.style.setProperty("--py", y.toFixed(1) + "px");
            });
        });

        hero.addEventListener("mouseleave", () => {
            heroBg.style.setProperty("--px", "0px");
            heroBg.style.setProperty("--py", "0px");
        });
    }

    /* ============================================================
       HOVER 3D (solo con mouse; en celular no hace nada)
       ============================================================ */
    if (canHover && !reduceMotion) {
        $$(".service-card, .m-item").forEach(card => {
            let raf = 0;

            card.addEventListener("mousemove", (e) => {
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    const r = card.getBoundingClientRect();
                    const rotateX = -((e.clientY - r.top)  / r.height - 0.5) * 10;
                    const rotateY =  ((e.clientX - r.left) / r.width  - 0.5) * 10;
                    card.style.transform =
                        `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`;
                });
            });

            card.addEventListener("mouseleave", () => {
                cancelAnimationFrame(raf);
                raf = 0;
                card.style.transform = "";
            });
        });
    }

    /* ============================================================
       LIGHTBOX: abrir, cerrar, anterior/siguiente
       Teclado: Esc cierra, ← → navegan, Tab queda dentro.
       Celular: deslizar el dedo para cambiar de foto.
       ============================================================ */
    const lightbox = $("#lightbox");
    const lbImg    = $(".lightbox-img", lightbox);
    const lbTitle  = $(".lightbox-title", lightbox);
    const lbClose  = $(".lightbox-close", lightbox);
    const lbPrev   = $(".lightbox-nav.prev", lightbox);
    const lbNext   = $(".lightbox-nav.next", lightbox);
    const items    = $$(".m-btn");

    let current = -1;
    let lastFocus = null;

    const isOpen = () => lightbox.classList.contains("open");

    const show = (index) => {
        current = (index + items.length) % items.length;
        const btn = items[current];
        const img = $("img", btn);
        const title = btn.dataset.title || "";

        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = title;
        lbTitle.textContent = title;

        // reinicia la animación de entrada al cambiar de foto
        lbImg.style.animation = "none";
        void lbImg.offsetWidth;
        lbImg.style.animation = "";
    };

    const openLightbox = (index) => {
        lastFocus = document.activeElement;
        show(index);
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lbClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus) lastFocus.focus();
    };

    items.forEach((btn, i) => btn.addEventListener("click", () => openLightbox(i)));

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => show(current - 1));
    lbNext.addEventListener("click", () => show(current + 1));

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (isOpen()) closeLightbox(); else setMenu(false);
            return;
        }
        if (!isOpen()) return;

        if (e.key === "ArrowRight") show(current + 1);
        if (e.key === "ArrowLeft")  show(current - 1);

        if (e.key === "Tab") {
            const focusables = [lbClose, lbPrev, lbNext];
            const first = focusables[0];
            const last  = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }
    });

    let touchX = null;
    lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
})();
