let currentSlide = 0,
    currentCategory = 0,
    slideInterval,
    categoryInterval;

const slides = document.querySelectorAll(".slide"),
      indicators = document.querySelectorAll(".indicator"),
      categoryCards = document.querySelectorAll(".categoria-card"),
      categoriesTrack = document.querySelector(".categorias-track");

document.addEventListener("DOMContentLoaded", function () {
    initializeHeroSlider();
    initializeCategorySlider();
});

document.getElementById("contactForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let t = document.getElementById("nombre").value,
        a = document.getElementById("email").value,
        r = document.getElementById("asunto").value,
        n = document.getElementById("mensaje").value;

    let l = `Hola, soy ${t} (%20${a}%20).%0AAsunto: ${r}%0AMensaje:%0A${n}`,
        o = `https://wa.me/5492972528022?text=${encodeURIComponent(l)}`;

    window.open(o, "_blank");
});

// ---------------- HERO SLIDER ----------------
function initializeHeroSlider() {
    if (!slides.length) return;

    showSlide(0);
    startSlideShow();

    const prev = document.querySelector(".prev-slide"),
          next = document.querySelector(".next-slide");

    prev?.addEventListener("click", () => {
        stopSlideShow();
        previousSlide();
        startSlideShow();
    });

    next?.addEventListener("click", () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    });

    indicators.forEach((el, i) =>
        el.addEventListener("click", () => {
            stopSlideShow();
            goToSlide(i);
            startSlideShow();
        })
    );

    document.querySelector(".hero")?.addEventListener("mouseenter", stopSlideShow);
    document.querySelector(".hero")?.addEventListener("mouseleave", startSlideShow);
}

function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    indicators.forEach(ind => ind.classList.remove("active"));

    slides[index]?.classList.add("active");
    indicators[index]?.classList.add("active");

    currentSlide = index;
}

function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
function previousSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length); }
function goToSlide(index) { showSlide(index); }
function startSlideShow() { slideInterval = setInterval(nextSlide, 4000); }
function stopSlideShow() { slideInterval && clearInterval(slideInterval); }

// ---------------- CATEGORY SLIDER ----------------
function initializeCategorySlider() {
    if (!categoryCards.length) return;

    const prev = document.querySelector(".prev-btn"),
          next = document.querySelector(".next-btn");

    prev?.addEventListener("click", () => {
        stopCategorySlider();
        previousCategory();
        startCategorySlider();
    });

    next?.addEventListener("click", () => {
        stopCategorySlider();
        nextCategory();
        startCategorySlider();
    });

    const slider = document.querySelector(".categorias-slider");
    slider?.addEventListener("mouseenter", stopCategorySlider);
    slider?.addEventListener("mouseleave", startCategorySlider);

    window.addEventListener("resize", updateCategoryDisplay);

    updateCategoryDisplay();
    startCategorySlider();
}

function getVisibleCards() {
    const width = window.innerWidth;
    if (width < 768) return 1;     // móvil
    if (width < 1024) return 2;    // tablet
    return 3;                       // desktop
}

function nextCategory() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.ceil(categoryCards.length / visibleCards) - 1;
    currentCategory = currentCategory < maxIndex ? currentCategory + 1 : 0;
    updateCategoryDisplay();
}

function previousCategory() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.ceil(categoryCards.length / visibleCards) - 1;
    currentCategory = currentCategory > 0 ? currentCategory - 1 : maxIndex;
    updateCategoryDisplay();
}

function updateCategoryDisplay() {
    if (!categoriesTrack) return;

    const visibleCards = getVisibleCards();
    const gap = 40; // debe coincidir con el gap en CSS
    const cardWidth = categoryCards[0].offsetWidth + gap;
    const totalCards = categoryCards.length;
    const maxIndex = Math.ceil(totalCards / visibleCards) - 1;

    let translate;
    if (currentCategory === maxIndex) {
        translate = (totalCards - visibleCards) * cardWidth;
    } else {
        translate = currentCategory * cardWidth * visibleCards;
    }

    categoriesTrack.style.transform = `translateX(-${translate}px)`;
}

function startCategorySlider() { categoryInterval = setInterval(nextCategory, 12000); }
function stopCategorySlider() { categoryInterval && clearInterval(categoryInterval); }
