// Variables globales
let currentSlide = 0;
let currentCategory = 0;
let slideInterval;
let categoryInterval;

// Elementos del DOM
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const categoryCards = document.querySelectorAll('.categoria-card');
const categoriesTrack = document.querySelector('.categorias-track');

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeHeroSlider();
    initializeNavigation();
    initializeForm();
    initializeGallery();
    initializeCategorySlider();
    initializeScrollEffects();
});

// ===== HERO SLIDER =====
function initializeHeroSlider() {
    if (slides.length === 0) return;
    
    // Mostrar primera imagen
    showSlide(0);
    
    // Auto-play del slider
    startSlideShow();
    
    // Event listeners para controles
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopSlideShow();
        previousSlide();
        startSlideShow();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    });
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            goToSlide(index);
            startSlideShow();
        });
    });
    
    // Pausar en hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideShow);
        heroSection.addEventListener('mouseleave', startSlideShow);
    }
}

function showSlide(index) {
    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Mostrar slide actual
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

function goToSlide(index) {
    showSlide(index);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 4000);
}

function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Menú hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Smooth scroll para todos los enlaces internos
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
    
    // Botón del hero
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            const historiaSection = document.querySelector('#historia');
            if (historiaSection) {
                historiaSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ===== SLIDER DE CATEGORÍAS =====
function initializeCategorySlider() {
    if (!categoriesTrack || categoryCards.length === 0) return;
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopCategorySlider();
        previousCategory();
        startCategorySlider();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopCategorySlider();
        nextCategory();
        startCategorySlider();
    });
    
    // Auto-scroll de categorías
    startCategorySlider();
    
    // Pausar en hover
    const categoriasSection = document.querySelector('.categorias-slider');
    if (categoriasSection) {
        categoriasSection.addEventListener('mouseenter', stopCategorySlider);
        categoriasSection.addEventListener('mouseleave', startCategorySlider);
    }
    
    // Event listeners para botones de categorías
    categoryCards.forEach((card, index) => {
        const btn = card.querySelector('.categoria-btn');
        if (btn) {
            btn.addEventListener('click', function() {
                const categoryName = card.querySelector('h3').textContent;
                showNotification(`Más información sobre ${categoryName} próximamente`, 'success');
            });
        }
    });
}

function nextCategory() {
    const maxScroll = Math.max(0, categoryCards.length - 3);
    currentCategory = (currentCategory + 1) % maxScroll;
    updateCategoryDisplay();
}

function previousCategory() {
    const maxScroll = Math.max(0, categoryCards.length - 3);
    currentCategory = (currentCategory - 1 + maxScroll) % maxScroll;
    updateCategoryDisplay();
}

function updateCategoryDisplay() {
    if (categoriesTrack) {
        const cardWidth = 350; // ancho de la tarjeta + gap
        const offset = -currentCategory * cardWidth;
        categoriesTrack.style.transform = `translateX(${offset}px)`;
    }
}

function startCategorySlider() {
    categoryInterval = setInterval(nextCategory, 5000);
}

function stopCategorySlider() {
    if (categoryInterval) {
        clearInterval(categoryInterval);
    }
}

// ===== GALERÍA =====
function initializeGallery() {
    const galleryTrack = document.querySelector('.galeria-track');
    
    if (galleryTrack) {
        // Duplicar imágenes para efecto infinito
        const images = galleryTrack.querySelectorAll('img');
        images.forEach(img => {
            const clone = img.cloneNode(true);
            galleryTrack.appendChild(clone);
        });
        
        // Pausar animación al hover
        galleryTrack.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        galleryTrack.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
}

// ===== FORMULARIO =====
function initializeForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validar campos requeridos
            if (!data.nombre || !data.email || !data.asunto || !data.mensaje) {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }
            
            // Validar email
            if (!isValidEmail(data.email)) {
                showNotification('Por favor, ingresa un email válido.', 'error');
                return;
            }
            
            // Simular envío del formulario
            const submitBtn = form.querySelector('.form-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (isValidEmail(email)) {
                showNotification('¡Suscripción exitosa! Recibirás nuestras noticias.', 'success');
                this.querySelector('input').value = '';
            } else {
                showNotification('Por favor, ingresa un email válido.', 'error');
            }
        });
    }
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    // Cambiar header en scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(135, 206, 235, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #87CEEB 0%, #ffffff 100%)';
                header.style.backdropFilter = 'none';
            }
        }
    });
    
    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementsToAnimate = document.querySelectorAll('.historia-image, .contacto-form, .stat');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== FUNCIONES AUXILIARES =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// ===== EVENTOS ADICIONALES =====
// Prevenir comportamiento por defecto en algunos enlaces
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href="#"]')) {
        e.preventDefault();
    }
});

// Mejorar accesibilidad con teclado
document.addEventListener('keydown', function(e) {
    // Controlar slider con flechas del teclado
    if (e.key === 'ArrowLeft') {
        stopSlideShow();
        previousSlide();
        startSlideShow();
    } else if (e.key === 'ArrowRight') {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    }
});

// Optimización de rendimiento
let ticking = false;

function updateOnScroll() {
    // Aquí puedes agregar más efectos de scroll si es necesario
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

