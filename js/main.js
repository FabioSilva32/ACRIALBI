document.addEventListener('DOMContentLoaded', () => {
    // Robust Preloader Removal
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                preloader.remove();
            }, 500);
        }
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
    
    // Backup: Force hide preloader after 3 seconds
    setTimeout(hidePreloader, 3000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const form = document.getElementById('ideaForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'A enviar...';
            btn.disabled = true;

            const formData = new FormData(form);

            fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                btn.textContent = 'Enviado com sucesso!';
                btn.style.backgroundColor = '#27ae60';
                form.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error(error);
                btn.textContent = 'Erro ao enviar.';
                btn.style.backgroundColor = '#e74c3c';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to cards
    document.querySelectorAll('.service-card, .team-card, .gallery-item, .timeline-item').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });

    // Lightbox implementation for gallery images
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Enlarged view">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Add click listeners to all gallery items
    const setupLightbox = () => {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                lightboxImg.src = item.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });
    };

    setupLightbox();

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    // Close lightbox on click outside or on close button
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Team Modal Implementation
    const teamModal = document.getElementById('teamModal');
    if (teamModal) {
        const teamModalClose = teamModal.querySelector('.team-modal-close');
        const modalName = document.getElementById('modalName');
        const modalImage = document.getElementById('modalImage');
        const modalRole = document.getElementById('modalRole');
        const modalProfile = document.getElementById('modalProfile');
        const modalExperience = document.getElementById('modalExperience');

        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                modalName.innerHTML = card.dataset.name.replace(' ', '<br>');
                modalImage.style.backgroundImage = `url('${card.dataset.image}')`;
                modalRole.textContent = card.dataset.role;
                modalProfile.textContent = card.dataset.profile;
                modalExperience.textContent = card.dataset.experience;
                
                teamModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeTeamModal = () => {
            teamModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        teamModalClose.addEventListener('click', closeTeamModal);

        teamModal.addEventListener('click', (e) => {
            if (e.target === teamModal) {
                closeTeamModal();
            }
        });
    }

    // Optimized Global Scroll Handler
    const header = document.querySelector('header');
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    document.body.appendChild(progressBar);

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }, { passive: true });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });


    // Dark Mode Toggle & Persistence
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            
            if (body.classList.contains('dark-mode')) {
                icon.className = 'fa-solid fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fa-solid fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Tilt Effect for Gallery Items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const count = +entry.target.innerText;
                const speed = 200;
                const inc = target / speed;

                const updateCount = () => {
                    const current = +entry.target.innerText;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    stats.forEach(stat => statsObserver.observe(stat));

    // Page Transitions
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'pageTransition';
    document.body.appendChild(transitionOverlay);

    document.querySelectorAll('a').forEach(link => {
        // Only apply transition if it's a real page change (not an anchor link like #team)
        const isInternalPage = link.hostname === window.location.hostname;
        const isAnchor = link.getAttribute('href').startsWith('#');
        const isExternal = link.target === '_blank';

        if (isInternalPage && !isAnchor && !isExternal) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.href;
                transitionOverlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = target;
                }, 300); // 300ms transition
            });
        }
    });

    // Remove overlay on back button
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            transitionOverlay.classList.remove('active');
        }
    });

    // WhatsApp Welcome Bubble
    const waBubble = document.getElementById('whatsappBubble');
    if (waBubble) {
        setTimeout(() => {
            waBubble.classList.add('active');
            // Hide after 10 seconds
            setTimeout(() => {
                waBubble.classList.remove('active');
            }, 10000);
        }, 5000); // Appear after 5 seconds
    }

    // Language Toggle & Persistence
    const langToggle = document.querySelector('.nav-extra button:last-child');
    const translations = {
        pt: {
            nav_home: "Início",
            nav_services: "Serviços",
            nav_ideias: "O Seu Projeto",
            nav_team: "Equipa",
            nav_testimonials: "Testemunhos",
            nav_faq: "FAQ",
            nav_contact: "Contactos",
            hero_title: "Acrialbi",
            hero_subtitle: "Soluções à medida do seu negócio",
            hero_btn: "Descubra Mais",
            services_title: "Os Nossos Serviços",
            service1_title: "Produção e Fabrico à Medida",
            service1_text: "Trabalhamos com Acrílico, PVC e Madeira. Produzimos vitrinas, troféus e peças exclusivas para as suas necessidades.",
            service2_title: "Gravação Laser",
            service2_text: "Gravações de alta precisão com atenção a detalhes em texto e imagens em diversos materiais resistentes.",
            service3_title: "Publicidade e Comunicação Visual",
            service3_text: "Destaque a sua marca com decoração de viaturas, sinalética profissional, camisolas e t-shirts personalizadas.",
            service4_title: "Design Gráfico",
            service4_text: "Criação de logótipos memoráveis, identidade visual corporativa e design de catálogos impressionantes.",
            idea_title: "Ideias para um futuro projeto",
            idea_name: "O seu nome",
            idea_phone: "O seu telefone",
            idea_email: "O seu email",
            idea_message: "Descreva a sua ideia em algumas palavras... (Opcional)",
            idea_btn: "Enviar Ideia",
            team_title: "A Nossa Equipa",
            testimonials_title: "O que dizem os nossos clientes",
            faq_title: "Perguntas Frequentes",
            stats_projects: "Projetos Concluídos",
            stats_clients: "Clientes Felizes",
            stats_years: "Anos de Experiência",
            stats_quality: "Qualidade Garantida %",
            footer_desc: "Soluções à medida do seu negócio. Transformamos ideias em realidade com a nossa equipa especializada.",
            footer_contact: "Contactos",
            footer_location: "Localização",
            footer_rights: "Todos os direitos reservados.",
            back_to_top: "Voltar ao topo",
            wa_bubble: "Olá! Precisa de um orçamento para o seu projeto? Fale connosco!",
            timeline_title: "Do Conceito à Realidade",
            tl1_title: "Conceito e Ideia",
            tl1_text: "Partilhamos a sua visão e analisamos as necessidades específicas do seu projeto.",
            tl2_title: "Design e Prototipagem",
            tl2_text: "Criamos modelos digitais e protótipos para garantir que tudo está perfeito.",
            tl3_title: "Produção de Precisão",
            tl3_text: "Utilizamos tecnologia de ponta para fabricar as suas peças com rigor.",
            tl4_title: "Entrega Final",
            tl4_text: "O seu projeto ganha vida e é entregue com os mais altos padrões de qualidade.",
            breadcrumb_home: "Início",
            prod_title: "Produção e Fabrico à Medida",
            prod_desc1: "A Acrialbi é especialista no trabalho e transformação de <strong>Acrílico, PVC e Madeira</strong>. Com anos de experiência no mercado, oferecemos soluções personalizadas que dão vida às suas ideias com a máxima precisão.",
            prod_desc2: "Seja para a criação de vitrinas de exposição requintadas, troféus personalizados para eventos corporativos e desportivos, ou peças industriais exclusivas, garantimos acabamentos impecáveis que destacam o seu projeto.",
            prod_gallery: "Galeria de Vitrinas e Troféus",
            prod_btn: "Pedir Orçamento para esta área",
            laser_title: "Gravação Laser",
            laser_desc1: "A tecnologia de <strong>Gravação Laser</strong> da Acrialbi permite um nível de detalhe impressionante. Somos capazes de gravar textos finos, logótipos complexos e imagens fotográficas numa vasta gama de materiais.",
            laser_desc2: "O laser garante que a gravação não se apaga com o tempo, proporcionando um acabamento elegante e permanente para sinalética fina, brindes, placas comemorativas e marcação industrial de alta precisão.",
            laser_gallery: "Galeria de Gravações",
            visual_title: "Publicidade e Comunicação Visual",
            visual_desc1: "Destaque a sua marca onde quer que vá! A Acrialbi oferece serviços completos de <strong>Comunicação Visual</strong> para dar visibilidade ao seu negócio de forma profissional e impactante.",
            visual_desc2: "Os nossos serviços incluem a <strong>Decoração de Viaturas</strong> com vinil de alta qualidade, criação de <strong>Sinalética</strong> interior e exterior para empresas, e personalização de têxteis como <strong>T-shirts e Camisolas</strong> para uniformizar a sua equipa e promover a sua marca.",
            visual_gallery: "Galeria de Trabalhos",
            design_title: "Design Gráfico",
            design_desc1: "O <strong>Design Gráfico</strong> é onde a sua identidade começa. A nossa equipa cria logótipos e materiais de marketing que comunicam profissionalismo e modernidade.",
            design_desc2: "Criamos estacionários (cartões de visita, envelopes), catálogos de produtos e flyers que ajudam o seu negócio a crescer e a comunicar melhor com os seus clientes.",
            design_gallery: "Portfólio de Design"
        },
        en: {
            nav_home: "Home",
            nav_services: "Services",
            nav_ideias: "Your Project",
            nav_team: "Team",
            nav_testimonials: "Testimonials",
            nav_faq: "FAQ",
            nav_contact: "Contact",
            hero_title: "Acrialbi",
            hero_subtitle: "Tailor-made solutions for your business",
            hero_btn: "Discover More",
            services_title: "Our Services",
            service1_title: "Custom Production & Manufacturing",
            service1_text: "We work with Acrylic, PVC, and Wood. We produce display cases, trophies, and exclusive pieces for your needs.",
            service2_title: "Laser Engraving",
            service2_text: "High-precision engraving with attention to detail in text and images on various durable materials.",
            service3_title: "Advertising & Visual Communication",
            service3_text: "Highlight your brand with vehicle decoration, professional signage, and personalized apparel.",
            service4_title: "Graphic Design",
            service4_text: "Creation of memorable logos, corporate visual identity, and impressive catalog designs.",
            idea_title: "Ideas for a future project",
            idea_name: "Your name",
            idea_phone: "Your phone",
            idea_email: "Your email",
            idea_message: "Describe your idea in a few words... (Optional)",
            idea_btn: "Send Idea",
            team_title: "Our Team",
            testimonials_title: "What our clients say",
            faq_title: "Frequently Asked Questions",
            stats_projects: "Completed Projects",
            stats_clients: "Happy Clients",
            stats_years: "Years of Experience",
            stats_quality: "Guaranteed Quality %",
            footer_desc: "Tailor-made solutions for your business. We turn ideas into reality with our specialized team.",
            footer_contact: "Contact Us",
            footer_location: "Location",
            footer_rights: "All rights reserved.",
            back_to_top: "Back to top",
            wa_bubble: "Hi! Need a quote for your project? Chat with us!",
            timeline_title: "From Concept to Reality",
            tl1_title: "Concept and Idea",
            tl1_text: "We share your vision and analyze the specific needs of your project.",
            tl2_title: "Design and Prototyping",
            tl2_text: "We create digital models and prototypes to ensure everything is perfect.",
            tl3_title: "Precision Production",
            tl3_text: "We use cutting-edge technology to manufacture your parts with rigor.",
            tl4_title: "Final Delivery",
            tl4_text: "Your project comes to life and is delivered with the highest quality standards.",
            breadcrumb_home: "Home",
            prod_title: "Custom Production & Manufacturing",
            prod_desc1: "Acrialbi is a specialist in the work and transformation of <strong>Acrylic, PVC, and Wood</strong>. With years of experience in the market, we offer personalized solutions that bring your ideas to life with maximum precision.",
            prod_desc2: "Whether for creating exquisite display cases, personalized trophies for corporate and sports events, or exclusive industrial pieces, we guarantee impeccable finishes that highlight your project.",
            prod_gallery: "Vitrines and Trophies Gallery",
            prod_btn: "Request Quote for this area",
            laser_title: "Laser Engraving",
            laser_desc1: "Acrialbi's <strong>Laser Engraving</strong> technology allows for an impressive level of detail. We are able to engrave fine text, complex logos, and photographic images on a wide range of materials.",
            laser_desc2: "The laser ensures that the engraving does not fade over time, providing an elegant and permanent finish for fine signage, gifts, commemorative plaques, and high-precision industrial marking.",
            laser_gallery: "Engraving Gallery",
            visual_title: "Advertising and Visual Communication",
            visual_desc1: "Highlight your brand wherever you go! Acrialbi offers complete <strong>Visual Communication</strong> services to give visibility to your business professionally and impactfully.",
            visual_desc2: "Our services include <strong>Vehicle Decoration</strong> with high-quality vinyl, creation of indoor and outdoor <strong>Signage</strong> for companies, and customization of textiles like <strong>T-shirts and Sweatshirts</strong> to unify your team and promote your brand.",
            visual_gallery: "Works Gallery",
            design_title: "Graphic Design",
            design_desc1: "<strong>Graphic Design</strong> is where your identity begins. Our team creates logos and marketing materials that communicate professionalism and modernity.",
            design_desc2: "We create stationery (business cards, envelopes), product catalogs, and flyers that help your business grow and communicate better with your customers.",
            design_gallery: "Design Portfolio"
        }
    };

    const updateLanguage = (lang) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else if (key.includes('_desc') || key.includes('_text')) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });
        if (langToggle) langToggle.innerText = lang.toUpperCase();
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    };

    // Load saved language
    const savedLang = localStorage.getItem('lang') || 'pt';
    updateLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('lang') || 'pt';
            const newLang = currentLang === 'pt' ? 'en' : 'pt';
            updateLanguage(newLang);
        });
    }
});
