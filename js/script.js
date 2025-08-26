let currentSlide = 0;
let currentCategory = 0;
let slideInterval;
let categoryInterval;

const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const categoryCards = document.querySelectorAll('.categoria-card');
const categoriesTrack = document.querySelector('.categorias-track');

document.addEventListener('DOMContentLoaded', function() {
    initializeHeroSlider();
    initializeCategorySlider();
});

function initializeHeroSlider() {
    if (!slides.length) return;
    showSlide(0);
    startSlideShow();
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    prevBtn?.addEventListener('click', () => { stopSlideShow(); previousSlide(); startSlideShow(); });
    nextBtn?.addEventListener('click', () => { stopSlideShow(); nextSlide(); startSlideShow(); });
    indicators.forEach((ind, i) => ind.addEventListener('click', () => { stopSlideShow(); goToSlide(i); startSlideShow(); }));
    document.querySelector('.hero').addEventListener('mouseenter', stopSlideShow);
    document.querySelector('.hero').addEventListener('mouseleave', startSlideShow);
}

function showSlide(i){
    slides.forEach(s=>s.classList.remove('active'));
    indicators.forEach(ind=>ind.classList.remove('active'));
    slides[i]?.classList.add('active');
    indicators[i]?.classList.add('active');
    currentSlide=i;
}
function nextSlide(){showSlide((currentSlide+1)%slides.length);}
function previousSlide(){showSlide((currentSlide-1+slides.length)%slides.length);}
function goToSlide(i){showSlide(i);}
function startSlideShow(){slideInterval=setInterval(nextSlide,4000);}
function stopSlideShow(){slideInterval&&clearInterval(slideInterval);}

function initializeCategorySlider(){
    if(!categoryCards.length) return;
    const prevBtn=document.querySelector('.prev-btn');
    const nextBtn=document.querySelector('.next-btn');
    prevBtn?.addEventListener('click', ()=>{stopCategorySlider(); previousCategory(); startCategorySlider();});
    nextBtn?.addEventListener('click', ()=>{stopCategorySlider(); nextCategory(); startCategorySlider();});
    startCategorySlider();
    const slider = document.querySelector('.categorias-slider');
    slider?.addEventListener('mouseenter', stopCategorySlider);
    slider?.addEventListener('mouseleave', startCategorySlider);
}

function nextCategory(){
    const visible = 3;
    const maxScroll = Math.max(0, categoryCards.length - visible);
    currentCategory = (currentCategory +1) % (maxScroll+1);
    updateCategoryDisplay();
}
function previousCategory(){
    const visible=3;
    const maxScroll = Math.max(0, categoryCards.length - visible);
    currentCategory = (currentCategory-1 + (maxScroll+1)) % (maxScroll+1);
    updateCategoryDisplay();
}
function updateCategoryDisplay(){
    if(categoriesTrack){
        const cardWidth = categoryCards[0].offsetWidth + 20;
        categoriesTrack.style.transform = `translateX(${-currentCategory*cardWidth}px)`;
    }
}
function startCategorySlider(){categoryInterval=setInterval(nextCategory,5000);}
function stopCategorySlider(){categoryInterval&&clearInterval(categoryInterval);}
