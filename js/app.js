document.addEventListener("DOMContentLoaded", () => {
    
// --- 1. SISTEMA DE CURSOR (REPARADO) ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Seleccionamos todo lo interactivo
    const interactiveElements = document.querySelectorAll('a, button, .project-card');

    let mouseX = window.innerWidth / 2; // Empezar en el centro
    let mouseY = window.innerHeight / 2;
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;

    // Movimiento
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Mover el punto rojo INSTANTÁNEAMENTE
        gsap.set(cursor, { x: mouseX, y: mouseY });
    });

    // Loop de animación para el círculo (con retraso suave)
    gsap.ticker.add(() => {
        posX += (mouseX - posX) * 0.15; // Factor de suavizado
        posY += (mouseY - posY) * 0.15;
        
        gsap.set(follower, { x: posX, y: posY });
    });

    // Efecto Hover (Lock-on System)
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('cursor-active');
        });
    });

    // --- 2. SECUENCIA DE INICIO (BOOT SEQUENCE FIX) ---
    
    // Ocultar elementos inicialmente
    // Nota: Animamos el WRAPPER, no el texto glitch directamente
    gsap.set(".hero-name-wrapper", { y: 100, opacity: 0 }); 
    gsap.set(".hero-role", { opacity: 0, x: -20 });
    gsap.set(".btn-cyber", { opacity: 0, y: 20 });
    gsap.set(".project-card", { opacity: 0, y: 50 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".hero-name-wrapper", { 
        duration: 1.5, 
        y: 0, 
        opacity: 1,
        delay: 0.2
    })
    .to(".hero-role", { 
        duration: 1, 
        opacity: 1, 
        x: 0 
    }, "-=1.0")
    .to(".btn-cyber", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "back.out(1.7)"
    }, "-=0.5");

    // --- 3. SCROLL TRIGGER (Ya funcionaba, lo mantenemos) ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15
        });
    });
});