document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los carouseles
  document.querySelectorAll(".image-container").forEach(container => {
    const images = container.querySelectorAll(".carousel img");
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");
    let currentIndex = 0;
    let autoSlide;

    // Mostrar imagen actual
    function showImage(index) {
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
    }

    // Siguiente
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }

    // Anterior
    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }

    // Eventos botones
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextImage();
        resetAutoSlide();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevImage();
        resetAutoSlide();
      });
    }

    // Autoplay
    function startAutoSlide() {
      autoSlide = setInterval(nextImage, 4000); // cada 4s cambia
    }

    function resetAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    // Inicializar
    showImage(currentIndex);
    startAutoSlide();
  });
});