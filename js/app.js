document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. CONFIGURACIÓN INICIAL & UI
    // =========================================
    const body = document.body;
    const startScreen = document.getElementById('start-screen');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const transitionScreen = document.getElementById('transition-screen');
    
    let gameStarted = false;
    let currentPage = 'main-menu';

    // Bloqueo inicial
    body.classList.add('locked');

    // =========================================
    // 2. SISTEMA DE CURSOR TÁCTICO & SONIDO HOVER
    // =========================================
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let posX = window.innerWidth / 2, posY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        gsap.set(cursor, { x: mouseX, y: mouseY });
    });

    gsap.ticker.add(() => {
        posX += (mouseX - posX) * 0.15; 
        posY += (mouseY - posY) * 0.15;
        gsap.set(follower, { x: posX, y: posY });
    });

    // Efecto Hover Visual + Sonoro
    const addHoverEffect = () => {
        const interactive = document.querySelectorAll('a, button, .project-card, .module-card, li, .selected-lang, .lang-dropdown li, .filter-btn');
        const hoverSound = document.getElementById('sfx-hover');

        // Ajustar volumen del hover si existe
        if(hoverSound) hoverSound.volume = 0.2; 

        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('cursor-active');
                
                // Reproducir sonido breve
                if(hoverSound) {
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(() => {});
                }
            });
            el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
        });
    };
    addHoverEffect();

    // =========================================
    // 3. ANIMACIÓN DE ENTRADA (DEFINICIÓN)
    // =========================================
    function playIntroSequence() {
        // 1. Preparar elementos (Posición inicial y opacidad)
        gsap.set(".hero-name-wrapper", { y: 100 });
        gsap.set(".hemisphere", { y: 30 });
        gsap.set(".split-divider", { scaleY: 0 });
        gsap.set(".hero-actions", { y: 30 });
        
        // Preparar Widget de Audio (Oculto al inicio)
        gsap.set("#audio-widget", { y: 20, autoAlpha: 0 });

        // 2. Secuencia de Animación
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        
        tl.to(".hero-name-wrapper", { duration: 1.5, y: 0, autoAlpha: 1 })
          .to(".split-divider", { duration: 0.8, scaleY: 1 }, "-=0.5")
          .to(".hemisphere", { duration: 0.8, y: 0, autoAlpha: 1, stagger: 0.2 }, "-=0.5")
          .to(".hero-actions", { duration: 1, y: 0, autoAlpha: 1 }, "-=0.3")
          // Aparece el reproductor al final
          .to("#audio-widget", { duration: 1, y: 0, autoAlpha: 1 }, "-=0.5");
    }

    // =========================================
    // 4. LÓGICA DE INICIO (START GAME)
    // =========================================
    function startGame() {
        if (gameStarted) return;
        gameStarted = true;

        // A. Reproducir Sonido de Acceso
        const accessSound = document.getElementById('sfx-access');
        if (accessSound) {
            accessSound.volume = 0.5;
            accessSound.play().catch(error => console.log("SFX Error:", error));
        }

        // B. Reproducir Música de Fondo
        const bgm = document.getElementById('bgm-main');
        if (bgm) {
            bgm.volume = 0.3;
            bgm.play().catch(error => console.log("BGM Error:", error));
        }

        // C. Desvanecer Pantalla de Inicio
        gsap.to(startScreen, {
            duration: 1.5, opacity: 0, ease: "power2.inOut",
            onComplete: () => {
                startScreen.style.display = "none";
                // D. AQUÍ ESTABA EL ERROR: AHORA LLAMAMOS A LA FUNCIÓN CORRECTAMENTE
                playIntroSequence(); 
            }
        });
    }

    document.addEventListener('keydown', startGame);
    document.addEventListener('click', (e) => {
        if (gameStarted && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.lang-container'))) return;
        startGame();
    });

    // =========================================
    // 5. NAVEGACIÓN ENTRE PÁGINAS (SPA)
    // =========================================
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
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2 }
                    );
                }

                setTimeout(() => {
                    gsap.to(transitionScreen, {
                        duration: 1, opacity: 0,
                        onComplete: () => { transitionScreen.style.pointerEvents = "none"; }
                    });
                }, 800);
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
    // 6. SISTEMA DE TRADUCCIÓN (DICCIONARIO COMPLETO)
    // =========================================
    const translations = {
        es: {
            system_status: "SISTEMA: EN LÍNEA",
            press_key: "PRESIONA CUALQUIER TECLA",
            subject_id: "SUJETO IDENTIFICADO:",
            visual_cortex: "[ CORTEZA VISUAL ]",
            narrative_core: "[ NÚCLEO NARRATIVO ]",
            
            // Skills Menu
            v_skill_1: "Modelado 3D y Esculpido",
            v_skill_2: "Diseño Hard Surface",
            v_skill_3: "Concept Art y Texturizado",
            v_skill_4: "Integración Unreal Engine",
            n_skill_1: "Perfilado Psicológico",
            n_skill_2: "Creación de Mundos (Lore)",
            n_skill_3: "Lógica de Sistemas Mágicos",
            n_skill_4: "Narrativa Ambiental",

            // UI General
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
            
            // Títulos Páginas
            visual_log_title: "REGISTRO_VISUAL // MODELOS_3D",
            narrative_log_title: "REGISTRO_NARRATIVO // LORE",
            installed_modules: "MÓDULOS INSTALADOS:",
            cognitive_modules: "MÓDULOS COGNITIVOS:",

            // Filtros
            filter_all: "TODOS LOS DATOS",
            filter_3d: "MODELADO 3D",
            filter_ill: "ILUSTRACIÓN",
            filter_mar: "CLOTH SIM",
            filter_crafts: "ARTESANÍA & FÍSICO",
            filter_write: "TÉCNICA DE ESCRITURA",
            filter_world: "CONSTRUCCIÓN DE MUNDOS",
            filter_audio: "AUDIO / MÚSICA",

            // Descripciones Proyectos
            proj_zenith_desc: "Entorno 3D y Assets en Unreal Engine 5.",
            proj_head_desc: "Esculpido orgánico hard-surface.",
            proj_echoes_desc: "Guion técnico y perfil psicológico.",
            proj_map_desc: "Diseño de geografía y sistemas políticos.",
            proj_vest_desc: "Simulación de ropa táctica avanzada.",
            proj_art_desc: "Concept art de personajes cyberpunk.",
            proj_audio_desc: "Composición lírica y experimental.",

            // Descripciones Módulos (Visual)
            mod_blend_desc: "Hard Surface, Esculpido, Retopología y Mapeo UV.",
            mod_ue5_desc: "Blueprints, Diseño de Niveles, Flujos Lumen & Nanite.",
            mod_marv_desc: "Simulación de telas y creación de patrones complejos.",
            mod_sp_desc: "Texturizado PBR y Materiales Inteligentes.",
            mod_zb_desc: "Esculpido orgánico de alta fidelidad.",
            mod_maya_desc: "Modelado poligonal estándar de industria.",
            mod_ps_desc: "Edición de imagen, composición y post-proceso.",
            mod_ai_desc: "Diseño vectorial y creación de logotipos.",
            mod_ae_desc: "Motion Graphics y efectos visuales.",
            mod_unity_desc: "Implementación de assets y configuración de escenas.",
            mod_krita_desc: "Ilustración digital y pintura open source.",
            mod_inf_desc: "Flujos de trabajo de pintura digital móvil.",
            mod_doll_desc: "Diseño de patrones y confección de peluches.",
            mod_crochet_desc: "Tejido básico y creación de estructuras textiles.",

            // Descripciones Módulos (Narrativo)
            mod_story_desc: "Estructura narrativa, ritmo y arcos dramáticos.",
            mod_ling_desc: "Sintaxis, diálogo fluido y creación de lenguas (Conlangs).",
            mod_back_desc: "Desarrollo de pasado y motivaciones de personajes.",
            mod_psy_desc: "Perfiles psicológicos, arquetipos y conducta.",
            mod_soc_desc: "Estructuras sociales, jerarquías y cultura.",
            mod_phil_desc: "Dilemas éticos, moralidad y profundidad temática.",
            mod_world_desc: "Geografía, historia, política y lore cohesivo.",
            mod_magic_desc: "Lógica interna de sistemas de magia y ciencia.",
            mod_color_desc: "Psicología del color aplicada a la atmósfera narrativa.",
            mod_chrono_desc: "Gestión de líneas temporales y pacing.",
            mod_lyrics_desc: "Composición lírica, métrica y rima.",
            mod_sound_desc: "Fundamentos de frecuencia y mezcla.",
            mod_fl_desc: "Flujo de trabajo en DAW y composición básica.",

            // Idiomas
            comm_protocols: "PROTOCOLOS DE COMUNICACIÓN:",
            lang_es_title: "ESPAÑOL",
            lang_en_title: "INGLÉS",
            lang_it_title: "ITALIANO",
            lang_fr_title: "FRANCÉS",
            lang_de_title: "ALEMÁN",
            lang_jp_title: "JAPONÉS",
            lang_native: "Nativo / Lengua Materna.",
            lang_inter: "Competencia Intermedia.",
            lang_basic_inter: "Básico / Intermedio.",
            lang_basic: "Nociones Básicas."
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

            filter_all: "ALL DATA",
            filter_3d: "3D MODELING",
            filter_ill: "ILLUSTRATION",
            filter_mar: "CLOTH SIM",
            filter_crafts: "CRAFTS & PHYSICAL",
            filter_write: "WRITING TECH",
            filter_world: "WORLDBUILDING",
            filter_audio: "AUDIO / MUSIC",

            proj_zenith_desc: "3D Environment and Assets in Unreal Engine 5.",
            proj_head_desc: "Organic hard-surface sculpting.",
            proj_echoes_desc: "Technical script and protagonist psychological profile.",
            proj_map_desc: "Geography design and political systems.",
            proj_vest_desc: "Advanced tactical gear simulation.",
            proj_art_desc: "Cyberpunk character concept art.",
            proj_audio_desc: "Lyrical and experimental composition.",

            mod_blend_desc: "Hard Surface, Sculpting, Retopology & UV Mapping.",
            mod_ue5_desc: "Blueprints, Level Design, Lumen & Nanite Workflows.",
            mod_marv_desc: "Cloth simulation and complex pattern creation.",
            mod_sp_desc: "PBR Texturing and Smart Materials.",
            mod_zb_desc: "High-fidelity organic sculpting.",
            mod_maya_desc: "Industry-standard polygonal modeling.",
            mod_ps_desc: "Image editing, composition, and post-processing.",
            mod_ai_desc: "Vector design and logo creation.",
            mod_ae_desc: "Motion Graphics and visual effects.",
            mod_unity_desc: "Asset implementation and scene setup.",
            mod_krita_desc: "Digital illustration and open-source painting.",
            mod_inf_desc: "Mobile digital painting workflows.",
            mod_doll_desc: "Pattern design and plush toy tailoring.",
            mod_crochet_desc: "Basic knitting and textile structures.",

            mod_story_desc: "Narrative structure, pacing, and dramatic arcs.",
            mod_ling_desc: "Syntax, dialogue flow, and Conlangs.",
            mod_back_desc: "Character background and motivations.",
            mod_psy_desc: "Psychological profiling, archetypes, and behavior.",
            mod_soc_desc: "Social structures, hierarchies, and culture.",
            mod_phil_desc: "Ethical dilemmas, morality, and thematic depth.",
            mod_world_desc: "Geography, history, politics, and cohesive lore.",
            mod_magic_desc: "Internal logic of magic and science systems.",
            mod_color_desc: "Color psychology applied to narrative atmosphere.",
            mod_chrono_desc: "Timeline management and pacing.",
            mod_lyrics_desc: "Lyrical composition, meter, and rhyme.",
            mod_sound_desc: "Fundamentals of frequency and mixing.",
            mod_fl_desc: "DAW workflow and basic composition.",

            comm_protocols: "COMMUNICATION PROTOCOLS:",
            lang_es_title: "SPANISH",
            lang_en_title: "ENGLISH",
            lang_it_title: "ITALIANO",
            lang_fr_title: "FRENCH",
            lang_de_title: "GERMAN",
            lang_jp_title: "JAPANESE",
            lang_native: "Native / Mother Tongue.",
            lang_inter: "Intermediate Proficiency.",
            lang_basic_inter: "Basic / Intermediate.",
            lang_basic: "Basic Knowledge."
        },
        it: {
            system_status: "SISTEMA: ONLINE",
            press_key: "PREMI UN TASTO",
            subject_id: "SOGGETTO IDENTIFICATO:",
            visual_cortex: "[ CORTECCIA VISIVA ]",
            narrative_core: "[ NUCLEO NARRATIVO ]",
            btn_visual: "ACCESSO DATI VISIVI",
            btn_narrative: "ACCESSO ARCHIVI LORE",
            filter_all: "TUTTI I DATI",
            filter_3d: "MODELLAZIONE 3D",
            filter_ill: "ILLUSTRAZIONE",
            filter_mar: "SIMULAZIONE STOFFA",
            filter_crafts: "ARTIGIANATO",
            filter_write: "TECNICA DI SCRITTURA",
            filter_world: "WORLDBUILDING",
            filter_audio: "AUDIO / MUSICA",
            v_skill_1: "Modellazione 3D e Scultura",
            v_skill_2: "Design Hard Surface",
            v_skill_3: "Concept Art e Texture",
            v_skill_4: "Integrazione Unreal Engine",
            n_skill_1: "Profilazione Psicologica",
            n_skill_2: "Creazione di Mondi (Lore)",
            n_skill_3: "Logica dei Sistemi Magici",
            n_skill_4: "Narrazione Ambientale",
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
            proj_vest_desc: "Simulazione abbigliamento tattico.",
            proj_art_desc: "Concept art di personaggi cyberpunk.",
            proj_audio_desc: "Composizione lirica e sperimentale.",
            mod_blend_desc: "Hard Surface, Scultura, Retopology e Mappatura UV.",
            mod_ue5_desc: "Blueprints, Level Design, Workflow Lumen & Nanite.",
            mod_marv_desc: "Simulazione stoffa e creazione modelli complessi.",
            mod_sp_desc: "Texturizzazione PBR e Materiali Smart.",
            mod_zb_desc: "Scultura organica ad alta fedeltà.",
            mod_maya_desc: "Modellazione poligonale standard industriale.",
            mod_ps_desc: "Fotoritocco, composizione e post-produzione.",
            mod_ai_desc: "Design vettoriale e creazione loghi.",
            mod_ae_desc: "Motion Graphics ed effetti visivi.",
            mod_unity_desc: "Implementazione asset e setup scene.",
            mod_krita_desc: "Illustrazione digitale e pittura open source.",
            mod_inf_desc: "Flussi di lavoro per pittura digitale mobile.",
            mod_doll_desc: "Design di modelli e confezione peluche.",
            mod_crochet_desc: "Lavoro a maglia base e strutture tessili.",
            mod_story_desc: "Struttura narrativa, ritmo e archi drammatici.",
            mod_ling_desc: "Sintassi, flusso di dialogo e Conlangs.",
            mod_back_desc: "Background dei personaggi e motivazioni.",
            mod_psy_desc: "Profilazione psicologica, archetipi e comportamento.",
            mod_soc_desc: "Strutture sociali, gerarchie e cultura.",
            mod_phil_desc: "Dilemmi etici, moralità e profondità tematica.",
            mod_world_desc: "Geografia, storia, politica e lore coesa.",
            mod_magic_desc: "Logica interna dei sistemi di magia e scienza.",
            mod_color_desc: "Psicologia del colore applicata all'atmosfera.",
            mod_chrono_desc: "Gestione temporale e ritmo.",
            mod_lyrics_desc: "Composizione lirica, metrica e rima.",
            mod_sound_desc: "Fondamenti di frequenza e missaggio.",
            mod_fl_desc: "Flusso di lavoro DAW e composizione base.",
            comm_protocols: "PROTOCOLLI DI COMUNICAZIONE:",
            lang_es_title: "SPAGNOLO",
            lang_en_title: "INGLESE",
            lang_it_title: "ITALIANO",
            lang_fr_title: "FRANCESE",
            lang_de_title: "TEDESCO",
            lang_jp_title: "GIAPPONESE",
            lang_native: "Madrelingua.",
            lang_inter: "Competenza Intermedia.",
            lang_basic_inter: "Base / Intermedio.",
            lang_basic: "Nozioni di Base."
        },
        fr: {
            system_status: "SYSTÈME: EN LIGNE",
            press_key: "APPUYEZ SUR UNE TOUCHE",
            subject_id: "SUJET IDENTIFIÉ:",
            visual_cortex: "[ CORTEX VISUEL ]",
            narrative_core: "[ NOYAU NARRATIF ]",
            btn_visual: "ACCÈS DONNÉES VISUELLES",
            btn_narrative: "ACCÈS ARCHIVES LORE",
            filter_all: "TOUTES LES DONNÉES",
            filter_3d: "MODÉLISATION 3D",
            filter_ill: "ILLUSTRATION",
            filter_mar: "SIMULATION TISSU",
            filter_crafts: "ARTISANAT",
            filter_write: "TECHNIQUE D'ÉCRITURE",
            filter_world: "CONSTRUCTION DU MONDE",
            filter_audio: "AUDIO / MUSIQUE",
            visual_log_title: "LOG_VISUEL // MODÈLES_3D",
            narrative_log_title: "LOG_NARRATIF // LORE",
            installed_modules: "MODULES INSTALLÉS:",
            cognitive_modules: "MODULES COGNITIFS:",
            recruit_label: "DISPONIBLE POUR DÉPLOIEMENT",
            btn_contact: "ÉTABLIR_LIAISON [EMAIL]",
            mod_blend_desc: "Hard Surface, Sculpture, Retopologie et Mappage UV.",
            mod_ue5_desc: "Blueprints, Level Design, Flux Lumen & Nanite.",
            mod_marv_desc: "Simulation de tissu et création de patrons.",
            mod_sp_desc: "Texturation PBR et Matériaux Intelligents.",
            mod_zb_desc: "Sculpture organique haute fidélité.",
            mod_maya_desc: "Modélisation polygonale standard.",
            mod_ps_desc: "Retouche d'image et post-traitement.",
            mod_ai_desc: "Conception vectorielle et logos.",
            mod_ae_desc: "Motion Graphics et effets visuels.",
            mod_unity_desc: "Implémentation d'assets et scènes.",
            mod_krita_desc: "Illustration numérique open source.",
            mod_inf_desc: "Peinture numérique mobile.",
            mod_doll_desc: "Conception de patrons et confection de peluches.",
            mod_crochet_desc: "Tricot de base et structures textiles.",
            mod_story_desc: "Structure narrative, rythme et arcs dramatiques.",
            mod_ling_desc: "Syntaxe, dialogue fluide et Conlangs.",
            mod_back_desc: "Passé du personnage et motivations.",
            mod_psy_desc: "Profilage psychologique et archétypes.",
            mod_soc_desc: "Structures sociales et culture.",
            mod_phil_desc: "Dilemmes éthiques et profondeur thématique.",
            mod_world_desc: "Géographie, histoire et lore.",
            mod_magic_desc: "Logique interne des systèmes magiques.",
            mod_color_desc: "Psychologie de la couleur et atmosphère.",
            mod_chrono_desc: "Gestion de la chronologie et rythme.",
            mod_lyrics_desc: "Composition lyrique et rimes.",
            mod_sound_desc: "Fondamentaux du mixage.",
            mod_fl_desc: "Workflow DAW et composition de base.",
            comm_protocols: "PROTOCOLES DE COMMUNICATION:",
            lang_es_title: "ESPAGNOL",
            lang_en_title: "ANGLAIS",
            lang_it_title: "ITALIEN",
            lang_fr_title: "FRANÇAIS",
            lang_de_title: "ALLEMAND",
            lang_jp_title: "JAPONAIS",
            lang_native: "Langue Maternelle.",
            lang_inter: "Compétence Intermédiaire.",
            lang_basic_inter: "Basique / Intermédiaire.",
            lang_basic: "Notions de Base."
        },
        de: {
            system_status: "SYSTEM: ONLINE",
            press_key: "TASTE DRÜCKEN",
            subject_id: "SUBJEKT IDENTIFIZIERT:",
            visual_cortex: "[ VISUELLER KORTEX ]",
            narrative_core: "[ NARRATIVER KERN ]",
            btn_visual: "ZUGRIFF VISUELLE DATEN",
            btn_narrative: "ZUGRIFF LORE-ARCHIV",
            filter_all: "ALLE DATEN",
            filter_3d: "3D-MODELLIERUNG",
            filter_ill: "ILLUSTRATION",
            filter_mar: "STOFFSIMULATION",
            filter_crafts: "HANDWERK",
            filter_write: "SCHREIBTECHNIK",
            filter_world: "WELTENBAU",
            filter_audio: "AUDIO / MUSIK",
            visual_log_title: "VISUELLES_PROTOKOLL // 3D_MODELLE",
            narrative_log_title: "NARRATIVES_PROTOKOLL // LORE",
            installed_modules: "INSTALLIERTE MODULE:",
            cognitive_modules: "KOGNITIVE MODULE:",
            recruit_label: "VERFÜGBAR FÜR EINSATZ",
            btn_contact: "VERBINDUNG_HERSTELLEN [EMAIL]",
            mod_blend_desc: "Hard Surface, Skulpting, Retopologie & UV-Mapping.",
            mod_ue5_desc: "Blueprints, Level Design, Lumen & Nanite Workflows.",
            mod_marv_desc: "Stoffsimulation und Mustererstellung.",
            mod_sp_desc: "PBR-Texturierung und Smart Materials.",
            mod_zb_desc: "Organisches Skulpting in hoher Qualität.",
            mod_maya_desc: "Industriestandard-Polygonmodellierung.",
            mod_ps_desc: "Bildbearbeitung und Post-Processing.",
            mod_ai_desc: "Vektordesign und Logoerstellung.",
            mod_ae_desc: "Motion Graphics und visuelle Effekte.",
            mod_unity_desc: "Asset-Implementierung und Szenen-Setup.",
            mod_krita_desc: "Digitale Illustration und Malerei.",
            mod_inf_desc: "Mobile digitale Malerei.",
            mod_doll_desc: "Schnittmusterentwurf und Plüschtierherstellung.",
            mod_crochet_desc: "Grundlegendes Häkeln und textile Strukturen.",
            mod_story_desc: "Erzählstruktur und dramatische Bögen.",
            mod_ling_desc: "Syntax, Dialogfluss und Conlangs.",
            mod_back_desc: "Charakterhintergrund und Motivationen.",
            mod_psy_desc: "Psychologisches Profiling und Archetypen.",
            mod_soc_desc: "Soziale Strukturen und Kultur.",
            mod_phil_desc: "Ethische Dilemmata und thematische Tiefe.",
            mod_world_desc: "Geographie, Geschichte und Lore.",
            mod_magic_desc: "Interne Logik von Magiesystemen.",
            mod_color_desc: "Farbpsychologie und Atmosphäre.",
            mod_chrono_desc: "Zeitmanagement und Pacing.",
            mod_lyrics_desc: "Lyrische Komposition und Reim.",
            mod_sound_desc: "Grundlagen der Mischung.",
            mod_fl_desc: "DAW-Workflow und Basiskomposition.",
            comm_protocols: "KOMMUNIKATIONSPROTOKOLLE:",
            lang_es_title: "SPANISCH",
            lang_en_title: "ENGLISCH",
            lang_it_title: "ITALIENISCH",
            lang_fr_title: "FRANZÖSISCH",
            lang_de_title: "DEUTSCH",
            lang_jp_title: "JAPANISCH",
            lang_native: "Muttersprache.",
            lang_inter: "Mittelstufe.",
            lang_basic_inter: "Grundkenntnisse / Mittelstufe.",
            lang_basic: "Grundkenntnisse."
        },
        jp: {
            system_status: "システム: オンライン",
            press_key: "キーを押してください",
            subject_id: "被写体特定:",
            visual_cortex: "[ 視覚皮質 ]",
            narrative_core: "[ 物語核 ]",
            btn_visual: "視覚データアクセス",
            btn_narrative: "伝承アーカイブアクセス",
            filter_all: "すべてのデータ",
            filter_3d: "3Dモデリング",
            filter_ill: "イラスト",
            filter_mar: "布シミュレーション",
            filter_crafts: "工芸 & 物理",
            filter_write: "執筆技術",
            filter_world: "世界構築",
            filter_audio: "オーディオ / 音楽",
            visual_log_title: "視覚ログ // 3Dモデル",
            narrative_log_title: "物語ログ // 伝承",
            installed_modules: "インストール済みモジュール:",
            cognitive_modules: "認知モジュール:",
            recruit_label: "配備可能",
            btn_contact: "通信リンク確立 [EMAIL]",
            mod_blend_desc: "ハードサーフェス、スカルプト、リトポロジー、UV。",
            mod_ue5_desc: "ブループリント、レベルデザイン、Lumen & Nanite。",
            mod_marv_desc: "布のシミュレーションと複雑なパターン作成。",
            mod_sp_desc: "PBRテクスチャリングとスマートマテリアル。",
            mod_zb_desc: "高忠実度の有機的スカルプト。",
            mod_maya_desc: "業界標準のポリゴンモデリング。",
            mod_ps_desc: "画像編集、合成、ポストプロセス。",
            mod_ai_desc: "ベクターデザインとロゴ作成。",
            mod_ae_desc: "モーショングラフィックスと視覚効果。",
            mod_unity_desc: "アセットの実装とシーン設定。",
            mod_krita_desc: "デジタルイラストレーションとOSSペイント。",
            mod_inf_desc: "モバイルデジタルペイントワークフロー。",
            mod_doll_desc: "型紙設計とぬいぐるみの縫製。",
            mod_crochet_desc: "基本的な編み物と繊維構造。",
            mod_story_desc: "物語構造、ペース配分、ドラマチックな展開。",
            mod_ling_desc: "構文、対話フロー、人工言語作成。",
            mod_back_desc: "キャラクターの背景と動機。",
            mod_psy_desc: "心理プロファイリングと行動。",
            mod_soc_desc: "社会構造、階層、文化。",
            mod_phil_desc: "倫理的ジレンマとテーマの深さ。",
            mod_world_desc: "地理、歴史、政治、そして一貫した伝承。",
            mod_magic_desc: "魔法と科学システムの内部論理。",
            mod_color_desc: "物語の雰囲気に適用される色彩心理学。",
            mod_chrono_desc: "タイムライン管理とペーシング。",
            mod_lyrics_desc: "叙情的な作曲、韻律。",
            mod_sound_desc: "周波数とミキシングの基礎。",
            mod_fl_desc: "DAWワークフローと基本的な作曲。",
            comm_protocols: "通信プロトコル:",
            lang_es_title: "スペイン語",
            lang_en_title: "英語",
            lang_it_title: "イタリア語",
            lang_fr_title: "フランス語",
            lang_de_title: "ドイツ語",
            lang_jp_title: "日本語",
            lang_native: "母国語",
            lang_inter: "中級レベル",
            lang_basic_inter: "初級 / 中級",
            lang_basic: "基礎知識"
        }
    };

    // Lógica del Selector de Idioma
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
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        currentLangText.innerText = lang.toUpperCase();
        
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

    // Iniciar en Español
    changeLanguage('es');

    // =========================================
    // 7. FONDO INTERACTIVO (BIO-NETWORK)
    // =========================================
    const canvas = document.getElementById('bio-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const particleCount = 80;
        const connectionDistance = 180;
        const mouseDistance = 250;

        const styles = getComputedStyle(document.body);
        const accentColor = styles.getPropertyValue('--accent-blood').trim() || '#ff0000';

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = accentColor;
                ctx.font = "10px monospace";
                ctx.fillText("+", this.x, this.y);
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = accentColor;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = accentColor;
                        ctx.lineWidth = 1; 
                        ctx.globalAlpha = 1 - (distance / connectionDistance); 
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }

                const dxMouse = particles[i].x - mouseX; 
                const dyMouse = particles[i].y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < mouseDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = accentColor;
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
            let email = contactBtn.getAttribute('data-email');
            
            if (!email || email === "null") {
                const rawHref = contactBtn.getAttribute('href'); 
                email = rawHref.replace('mailto:', '').split('?')[0];
            }

            const btnTextSpan = contactBtn.querySelector('.btn-text');
            const currentLang = document.getElementById('current-lang-text').innerText.toLowerCase();

            navigator.clipboard.writeText(email).then(() => {
                btnTextSpan.innerText = ">> EMAIL COPIADO <<"; 
                contactBtn.style.borderColor = "#00ff41";
                contactBtn.style.color = "#00ff41";
                contactBtn.style.boxShadow = "0 0 15px #00ff41";

                setTimeout(() => {
                    contactBtn.style.borderColor = "";
                    contactBtn.style.color = "";
                    contactBtn.style.boxShadow = "";

                    if (translations[currentLang] && translations[currentLang]['btn_contact']) {
                        btnTextSpan.innerText = translations[currentLang]['btn_contact'];
                    } else {
                        btnTextSpan.innerText = "ESTABLECER_ENLACE [EMAIL]"; 
                    }
                }, 3000);

            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        });
    }

    // =========================================
    // 9. SISTEMA DE FILTRADO (SCOPED)
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Buscamos el contenedor padre (visual o narrativa)
                const parentPage = this.closest('.content-page');
                if (!parentPage) return; 

                // Gestionar clase active solo en esta página
                const pageFilters = parentPage.querySelectorAll('.filter-btn');
                pageFilters.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Obtener filtro y tarjetas de esta página
                const filterValue = this.getAttribute('data-filter');
                const pageCards = parentPage.querySelectorAll('.project-card');

                // Animación
                gsap.to(pageCards, {
                    duration: 0.3, opacity: 0, scale: 0.95,
                    onComplete: () => {
                        pageCards.forEach(card => {
                            const category = card.getAttribute('data-category');
                            if (filterValue === 'all' || category === filterValue) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });

                        const visibleCards = Array.from(pageCards).filter(c => c.style.display !== 'none');
                        gsap.to(visibleCards, {
                            duration: 0.4, opacity: 1, scale: 1, stagger: 0.1, clearProps: "scale"
                        });
                    }
                });
            });
        });
    }

    // =========================================
    // 10. WIDGET DE AUDIO (CONTROLADOR)
    // =========================================
    const bgm = document.getElementById('bgm-main');
    const audioWidget = document.getElementById('audio-widget');
    const audioBtn = document.getElementById('audio-toggle');

    if (bgm && audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (bgm.paused) {
                bgm.play();
                audioBtn.innerText = "[ || ]"; // Símbolo Pausa
                audioWidget.classList.remove('paused'); // Activar animación
            } else {
                bgm.pause();
                audioBtn.innerText = "[ ► ]"; // Símbolo Play
                audioWidget.classList.add('paused'); // Detener animación
            }
        });
    }

});