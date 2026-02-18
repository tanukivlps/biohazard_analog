document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONFIGURACIÓN INICIAL ---
    const body = document.body;
    const startScreen = document.getElementById('start-screen');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const transitionScreen = document.getElementById('transition-screen');
    
    let gameStarted = false;
    let currentPage = 'main-menu';

    body.classList.add('locked');

    // --- 2. SISTEMA DE CURSOR ---
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let posX = window.innerWidth / 2, posY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        gsap.set(cursor, { x: mouseX, y: mouseY });
    });

    gsap.ticker.add(() => {
        posX += (mouseX - posX) * 0.15; posY += (mouseY - posY) * 0.15;
        gsap.set(follower, { x: posX, y: posY });
    });

    const addHoverEffect = () => {
        const interactive = document.querySelectorAll('a, button, .project-card, .module-card, li, .selected-lang, .lang-dropdown li');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
        });
    };
    addHoverEffect();

    // --- 3. LÓGICA DE START SCREEN ---
    function startGame() {
        if (gameStarted) return;
        gameStarted = true;

        gsap.to(startScreen, {
            duration: 1.5, opacity: 0, ease: "power2.inOut",
            onComplete: () => {
                startScreen.style.display = "none";
                playIntroSequence();
            }
        });
    }

    document.addEventListener('keydown', startGame);
    document.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.lang-container')) return;
        startGame();
    });

    // --- 4. SECUENCIA DE INTRO MENÚ ---
    function playIntroSequence() {
        gsap.set(".hero-name-wrapper", { y: 100, opacity: 0 });
        gsap.set(".hemisphere", { opacity: 0, y: 20 });
        gsap.set(".split-divider", { scaleY: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(".hero-name-wrapper", { duration: 1.5, y: 0, opacity: 1 })
          .to(".split-divider", { duration: 0.8, scaleY: 1 }, "-=0.5")
          .to(".hemisphere", { duration: 0.8, opacity: 1, y: 0, stagger: 0.2 }, "-=0.5");
    }

    // --- 5. NAVEGACIÓN ENTRE PÁGINAS ---
    const pageTriggers = document.querySelectorAll('.page-trigger');
    const backButtons = document.querySelectorAll('.btn-back');

    function switchPage(targetId) {
        transitionScreen.style.pointerEvents = "all";
        gsap.to(transitionScreen, {
            duration: 0.5, opacity: 1,
            onComplete: () => {
                document.getElementById(currentPage).style.display = 'none';
                
                const targetPage = document.getElementById(targetId);
                targetPage.style.display = 'block';
                currentPage = targetId;
                window.scrollTo(0, 0);

                if(targetId === 'main-menu') {
                    body.classList.add('locked');
                } else {
                    body.classList.remove('locked');
                    gsap.fromTo(`#${targetId} .project-card`, 
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.2 }
                    );
                }

                setTimeout(() => {
                    gsap.to(transitionScreen, {
                        duration: 1, opacity: 0,
                        onComplete: () => { transitionScreen.style.pointerEvents = "none"; }
                    });
                }, 1000);
            }
        });
    }

    pageTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(btn.getAttribute('data-target'));
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(btn.getAttribute('data-target'));
        });
    });

    // =========================================
    // 6. SISTEMA DE TRADUCCIÓN COMPLETO
    // =========================================
    
    const translations = {
        es: {
            system_status: "SISTEMA: EN LÍNEA",
            press_key: "PRESIONA CUALQUIER TECLA",
            subject_id: "SUJETO IDENTIFICADO:",
            visual_cortex: "[ CORTEZA VISUAL ]",
            narrative_core: "[ NÚCLEO NARRATIVO ]",
            
            // Skills Visuales
            v_skill_1: "Modelado 3D y Esculpido",
            v_skill_2: "Diseño Hard Surface",
            v_skill_3: "Concept Art y Texturizado",
            v_skill_4: "Integración Unreal Engine",
            
            // Skills Narrativas
            n_skill_1: "Perfilado Psicológico",
            n_skill_2: "Creación de Mundos (Lore)",
            n_skill_3: "Lógica de Sistemas Mágicos",
            n_skill_4: "Narrativa Ambiental",

            btn_visual: "ACCEDER A DATOS VISUALES",
            btn_narrative: "ACCEDER A ARCHIVOS DE LORE",
            session_status: "ESTADO DE SESIÓN:",
            waiting_input: "ESPERANDO COMANDO...",
            init_comm: "INICIAR_PROTOCOLO_COMUNICACIÓN",
            rights: "TODOS LOS DERECHOS RESERVADOS.",
            return_main: "VOLVER AL SISTEMA PRINCIPAL",
            loading: "CARGANDO DATOS...",
            recruit_label: "DISPONIBLE PARA DESPLIEGUE",
            btn_contact: "ESTABLECER_ENLACE [EMAIL]",
            
            // Títulos de Páginas
            visual_log_title: "REGISTRO_VISUAL // MODELOS_3D",
            narrative_log_title: "REGISTRO_NARRATIVO // LORE",
            installed_modules: "MÓDULOS INSTALADOS:",
            cognitive_modules: "MÓDULOS COGNITIVOS:",

            // Proyectos y Módulos
            proj_zenith_desc: "Entorno 3D y Assets en Unreal Engine 5.",
            proj_head_desc: "Esculpido orgánico hard-surface.",
            proj_echoes_desc: "Guion técnico y perfil psicológico del protagonista.",
            proj_map_desc: "Diseño de geografía y sistemas políticos.",
            
            mod_ue5_desc: "Blueprints, Diseño de Niveles, Flujos Lumen & Nanite.",
            mod_blend_desc: "Hard Surface, Esculpido, Retopología y Mapeo UV.",
            mod_narr_desc: "Narrativa Ambiental, Creación de Lore, Psicología de Personajes."
        },
        en: {
            system_status: "SYSTEM: ONLINE",
            press_key: "PRESS ANY KEY",
            subject_id: "SUBJECT IDENTIFIED:",
            visual_cortex: "[ VISUAL CORTEX ]",
            narrative_core: "[ NARRATIVE CORE ]",
            
            v_skill_1: "3D Modeling & Sculpting",
            v_skill_2: "Hard Surface Design",
            v_skill_3: "Concept Art & Texturing",
            v_skill_4: "Unreal Engine Integration",

            n_skill_1: "Psychological Profiling",
            n_skill_2: "World Building & Lore",
            n_skill_3: "Magic Systems Logic",
            n_skill_4: "Environmental Storytelling",

            btn_visual: "ACCESS VISUAL DATA",
            btn_narrative: "ACCESS LORE ARCHIVES",
            session_status: "SESSION STATUS:",
            waiting_input: "WAITING FOR INPUT...",
            init_comm: "INITIATE_COMMUNICATION_PROTOCOL",
            rights: "ALL RIGHTS RESERVED.",
            return_main: "RETURN TO MAIN SYSTEM",
            loading: "LOADING DATA...",
            recruit_label: "AVAILABLE FOR DEPLOYMENT",
            btn_contact: "ESTABLISH_UPLINK [EMAIL]",

            visual_log_title: "VISUAL_LOG // 3D_MODELS",
            narrative_log_title: "NARRATIVE_LOG // LORE",
            installed_modules: "INSTALLED MODULES:",
            cognitive_modules: "COGNITIVE MODULES:",

            proj_zenith_desc: "3D Environment and Assets in Unreal Engine 5.",
            proj_head_desc: "Organic hard-surface sculpting.",
            proj_echoes_desc: "Technical script and protagonist psychological profile.",
            proj_map_desc: "Geography design and political systems.",

            mod_ue5_desc: "Blueprints, Level Design, Lumen & Nanite Workflows.",
            mod_blend_desc: "Hard Surface, Sculpting, Retopology & UV Mapping.",
            mod_narr_desc: "Environmental Storytelling, Lore Creation, Character Psychology."
        },
        it: {
            system_status: "SISTEMA: ONLINE",
            press_key: "PREMI UN TASTO",
            subject_id: "SOGGETTO IDENTIFICATO:",
            visual_cortex: "[ CORTECCIA VISIVA ]",
            narrative_core: "[ NUCLEO NARRATIVO ]",

            v_skill_1: "Modellazione 3D e Scultura",
            v_skill_2: "Design Hard Surface",
            v_skill_3: "Concept Art e Texture",
            v_skill_4: "Integrazione Unreal Engine",

            n_skill_1: "Profilazione Psicologica",
            n_skill_2: "Creazione di Mondi (Lore)",
            n_skill_3: "Logica dei Sistemi Magici",
            n_skill_4: "Narrazione Ambientale",

            btn_visual: "ACCESSO DATI VISIVI",
            btn_narrative: "ACCESSO ARCHIVI LORE",
            session_status: "STATO SESSIONE:",
            waiting_input: "IN ATTESA DI INPUT...",
            init_comm: "AVVIARE_PROTOCOLLO_COMUNICAZIONE",
            rights: "TUTTI I DIRITTI RISERVATI.",
            return_main: "RITORNA AL SISTEMA",
            loading: "CARICAMENTO DATI...",
            recruit_label: "DISPONIBILE PER L'IMPIEGO",
            btn_contact: "STABILIRE_COLLEGAMENTO [EMAIL]",

            visual_log_title: "REGISTRO_VISIVO // MODELLI_3D",
            narrative_log_title: "REGISTRO_NARRATIVO // LORE",
            installed_modules: "MODULI INSTALLATI:",
            cognitive_modules: "MODULI COGNITIVI:",

            proj_zenith_desc: "Ambiente 3D e Asset in Unreal Engine 5.",
            proj_head_desc: "Scultura organica hard-surface.",
            proj_echoes_desc: "Sceneggiatura tecnica e profilo psicologico.",
            proj_map_desc: "Design geografico e sistemi politici.",

            mod_ue5_desc: "Blueprints, Level Design, Workflow Lumen & Nanite.",
            mod_blend_desc: "Hard Surface, Scultura, Retopology e Mappatura UV.",
            mod_narr_desc: "Narrazione Ambientale, Creazione Lore, Psicologia dei Personaggi."
        },
        fr: {
            system_status: "SYSTÈME: EN LIGNE",
            press_key: "APPUYEZ SUR UNE TOUCHE",
            subject_id: "SUJET IDENTIFIÉ:",
            visual_cortex: "[ CORTEX VISUEL ]",
            narrative_core: "[ NOYAU NARRATIF ]",

            v_skill_1: "Modélisation 3D et Sculpture",
            v_skill_2: "Conception Hard Surface",
            v_skill_3: "Concept Art et Texturage",
            v_skill_4: "Intégration Unreal Engine",

            n_skill_1: "Profilage Psychologique",
            n_skill_2: "Construction de Mondes (Lore)",
            n_skill_3: "Logique des Systèmes Magiques",
            n_skill_4: "Narration Environnementale",

            btn_visual: "ACCÈS DONNÉES VISUELLES",
            btn_narrative: "ACCÈS ARCHIVES LORE",
            session_status: "ÉTAT SESSION:",
            waiting_input: "EN ATTENTE D'ENTRÉE...",
            init_comm: "INITIER_PROTOCOLE_COMMUNICATION",
            rights: "TOUS DROITS RÉSERVÉS.",
            return_main: "RETOUR SYSTÈME PRINCIPAL",
            loading: "CHARGEMENT DES DONNÉES...",
            recruit_label: "DISPONIBLE POUR DÉPLOIEMENT",
            btn_contact: "ÉTABLIR_LIAISON [EMAIL]",

            visual_log_title: "LOG_VISUEL // MODÈLES_3D",
            narrative_log_title: "LOG_NARRATIF // LORE",
            installed_modules: "MODULES INSTALLÉS:",
            cognitive_modules: "MODULES COGNITIFS:",

            proj_zenith_desc: "Environnement 3D et Assets sous Unreal Engine 5.",
            proj_head_desc: "Sculpture organique hard-surface.",
            proj_echoes_desc: "Scénario technique et profil psychologique.",
            proj_map_desc: "Conception géographique et systèmes politiques.",

            mod_ue5_desc: "Blueprints, Level Design, Flux Lumen & Nanite.",
            mod_blend_desc: "Hard Surface, Sculpture, Retopologie et Mappage UV.",
            mod_narr_desc: "Narration Environnementale, Création de Lore, Psychologie."
        },
        de: {
            system_status: "SYSTEM: ONLINE",
            press_key: "TASTE DRÜCKEN",
            subject_id: "SUBJEKT IDENTIFIZIERT:",
            visual_cortex: "[ VISUELLER KORTEX ]",
            narrative_core: "[ NARRATIVER KERN ]",

            v_skill_1: "3D-Modellierung & Skulptur",
            v_skill_2: "Hard-Surface-Design",
            v_skill_3: "Concept Art & Texturierung",
            v_skill_4: "Unreal Engine Integration",

            n_skill_1: "Psychologisches Profiling",
            n_skill_2: "Weltenbau & Lore",
            n_skill_3: "Logik magischer Systeme",
            n_skill_4: "Umgebungsnarrative",

            btn_visual: "ZUGRIFF VISUELLE DATEN",
            btn_narrative: "ZUGRIFF LORE-ARCHIV",
            session_status: "SITZUNGSSTATUS:",
            waiting_input: "WARTE AUF EINGABE...",
            init_comm: "KOMMUNIKATIONSPROTOKOLL_STARTEN",
            rights: "ALLE RECHTE VORBEHALTEN.",
            return_main: "ZURÜCK ZUM HAUPTSYSTEM",
            loading: "DATEN WERDEN GELADEN...",
            recruit_label: "VERFÜGBAR FÜR EINSATZ",
            btn_contact: "VERBINDUNG_HERSTELLEN [EMAIL]",

            visual_log_title: "VISUELLES_PROTOKOLL // 3D_MODELLE",
            narrative_log_title: "NARRATIVES_PROTOKOLL // LORE",
            installed_modules: "INSTALLIERTE MODULE:",
            cognitive_modules: "KOGNITIVE MODULE:",

            proj_zenith_desc: "3D-Umgebung und Assets in Unreal Engine 5.",
            proj_head_desc: "Organische Hard-Surface-Skulptur.",
            proj_echoes_desc: "Technisches Skript und psychologisches Profil.",
            proj_map_desc: "Geografisches Design und politische Systeme.",

            mod_ue5_desc: "Blueprints, Level Design, Lumen & Nanite Workflows.",
            mod_blend_desc: "Hard Surface, Skulpting, Retopologie & UV-Mapping.",
            mod_narr_desc: "Umgebungsnarrative, Lore-Erstellung, Charakterpsychologie."
        },
        jp: {
            system_status: "システム: オンライン",
            press_key: "キーを押してください",
            subject_id: "被写体特定:",
            visual_cortex: "[ 視覚皮質 ]",
            narrative_core: "[ 物語核 ]",

            v_skill_1: "3Dモデリング & スカルプト",
            v_skill_2: "ハードサーフェスデザイン",
            v_skill_3: "コンセプトアート & テクスチャ",
            v_skill_4: "アンリアルエンジン統合",

            n_skill_1: "心理プロファイリング",
            n_skill_2: "世界構築 (Lore)",
            n_skill_3: "魔法システムの論理",
            n_skill_4: "環境ストーリーテリング",

            btn_visual: "視覚データアクセス",
            btn_narrative: "伝承アーカイブアクセス",
            session_status: "セッション状態:",
            waiting_input: "入力待機中...",
            init_comm: "通信プロトコル開始",
            rights: "全著作権所有",
            return_main: "メインシステムに戻る",
            loading: "データ読み込み中...",
            recruit_label: "配備可能",
            btn_contact: "通信リンク確立 [EMAIL]",

            visual_log_title: "視覚ログ // 3Dモデル",
            narrative_log_title: "物語ログ // 伝承",
            installed_modules: "インストール済みモジュール:",
            cognitive_modules: "認知モジュール:",

            proj_zenith_desc: "Unreal Engine 5での3D環境とアセット。",
            proj_head_desc: "有機的なハードサーフェススカルプト。",
            proj_echoes_desc: "技術脚本と主人公の心理プロファイル。",
            proj_map_desc: "地理設計と政治システム。",

            mod_ue5_desc: "ブループリント、レベルデザイン、Lumen & Nanite。",
            mod_blend_desc: "ハードサーフェス、スカルプト、リトポロジー、UV。",
            mod_narr_desc: "環境ストーリーテリング、伝承作成、キャラクター心理。"
        }
    };

    // Lógica del Selector
    const langToggle = document.getElementById('lang-toggle');
    const langList = document.getElementById('lang-list');
    const currentLangText = document.getElementById('current-lang-text');
    const langOptions = document.querySelectorAll('.lang-dropdown li');

    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langList.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-container')) {
            langList.classList.remove('active');
        }
    });

    function changeLanguage(lang) {
        // Actualizar textos simples
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // Actualizar estado visual del menú
        currentLangText.innerText = lang.toUpperCase();
        
        // Ajustar fuente para Japonés
        if (lang === 'jp') {
            document.body.style.fontFamily = "'Noto Sans JP', sans-serif";
            document.body.style.letterSpacing = "0px";
        } else {
            document.body.style.fontFamily = "";
            document.body.style.letterSpacing = "";
        }
    }

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            changeLanguage(selectedLang);
            langList.classList.remove('active');
        });
    });

    // --- ACTIVAR IDIOMA ESPAÑOL POR DEFECTO ---
    changeLanguage('es');

    // =========================================
    // 7. FONDO INTERACTIVO (BIO-NETWORK)
    // =========================================
    
    const canvas = document.getElementById('bio-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Configuración
        const particleCount = 80;      // MÁS PARTÍCULAS
        const connectionDistance = 180; // CONEXIONES MÁS LARGAS
        const mouseDistance = 250;      // RADIO MOUSE MÁS AMPLIO

        // Obtener color del tema (Rojo Sangre)
        const styles = getComputedStyle(document.body);
        const accentColor = styles.getPropertyValue('--accent-blood').trim() || '#ff0000';

        // Redimensionar
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        // Clase Partícula
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Velocidad lenta X
                this.vy = (Math.random() - 0.5) * 0.5; // Velocidad lenta Y
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebote en bordes
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = accentColor;
                ctx.font = "10px monospace";
                ctx.fillText("+", this.x, this.y); // Dibuja una cruz táctica
            }
        }

        // Inicializar
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // Bucle de Animación
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // EFECTO NEÓN (GLOW)
            ctx.shadowBlur = 15;            // Cantidad de resplandor
            ctx.shadowColor = accentColor;  // Color del resplandor

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Conectar líneas entre partículas cercanas
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = accentColor;
                        
                        // LÍNEAS MÁS GRUESAS
                        ctx.lineWidth = 1; // Antes era 0.5
                        
                        ctx.globalAlpha = 1 - (distance / connectionDistance); 
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }

                // Conectar con el Mouse (Efecto Radar)
                const dxMouse = particles[i].x - mouseX; 
                const dyMouse = particles[i].y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < mouseDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = accentColor;
                    
                    // LÍNEA DEL MOUSE AÚN MÁS FUERTE
                    ctx.lineWidth = 1.5; 
                    
                    ctx.globalAlpha = 1 - (distMouse / mouseDistance);
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    // =========================================
    // 8. SISTEMA DE CONTACTO (ROBUSTO)
    // =========================================
    
    const contactBtn = document.getElementById('contact-btn');
    
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            // 1. Obtener email (Primero intenta data-email, si falla, lo saca del href)
            let email = contactBtn.getAttribute('data-email');
            
            if (!email || email === "null") {
                // Fallback de seguridad: Extraer limpio del mailto:
                const rawHref = contactBtn.getAttribute('href'); 
                email = rawHref.replace('mailto:', '').split('?')[0];
            }

            // Guardar texto original para restaurarlo luego
            const btnTextSpan = contactBtn.querySelector('.btn-text');
            const originalText = btnTextSpan.innerText;
            
            // 2. Copiar al portapapeles
            navigator.clipboard.writeText(email).then(() => {
                
                // 3. Feedback Visual (Mensaje de Éxito)
                btnTextSpan.innerText = ">> EMAIL COPIADO <<"; 
                contactBtn.style.borderColor = "#00ff41"; // Verde Hacker
                contactBtn.style.color = "#00ff41";
                contactBtn.style.boxShadow = "0 0 15px #00ff41";

                // 4. Restaurar botón después de 3 segundos
                setTimeout(() => {
                    // Restaurar estilo
                    contactBtn.style.borderColor = "";
                    contactBtn.style.color = "";
                    contactBtn.style.boxShadow = "";

                    // Restaurar texto (Inteligente: busca traducción o usa el original)
                    const currentLang = document.getElementById('current-lang-text').innerText.toLowerCase();
                    
                    // Verificamos si existe la traducción para evitar errores
                    if (translations[currentLang] && translations[currentLang]['btn_contact']) {
                        btnTextSpan.innerText = translations[currentLang]['btn_contact'];
                    } else {
                        // Si falla el idioma, vuelve al texto que tenía antes de hacer clic
                        btnTextSpan.innerText = "ESTABLECER_ENLACE [EMAIL]"; 
                    }
                }, 3000);

            }).catch(err => {
                console.error('Error al copiar: ', err);
                btnTextSpan.innerText = "ERROR DE COPIA";
            });
        });
    }

});