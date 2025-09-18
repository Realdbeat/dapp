// script.js

let slideIndex = 0; // Current slide index
const slides = document.querySelectorAll('.slide'); // Get all slides
let startX = 0; // Start X position of touch/mouse
let isDragging = false; // Flag to track if dragging is happening

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0; // Reset to first slide if index exceeds length
  } else if (index < 0) {
    slideIndex = slides.length - 1; // Go to last slide if index is negative
  }

  const offset = -slideIndex * 100; // Calculate the offset for sliding effect
  document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
}

function changeSlide(step) {
  slideIndex += step; // Increment or decrement slide index
  showSlide(slideIndex); // Update the displayed slide
}

// Handle touch and mouse events for swiping
const sliderContainer = document.querySelector('.slider-container');

sliderContainer.addEventListener('touchstart', handleTouchStart);
sliderContainer.addEventListener('touchmove', handleTouchMove);
sliderContainer.addEventListener('touchend', handleTouchEnd);

sliderContainer.addEventListener('mousedown', handleMouseDown);
sliderContainer.addEventListener('mousemove', handleMouseMove);
sliderContainer.addEventListener('mouseup', handleMouseUp);

function handleTouchStart(e) {
  startX = e.touches[0].clientX; // Get the starting X position of the touch
  isDragging = true;
}

function handleTouchMove(e) {
  if (!isDragging) return;

  const currentX = e.touches[0].clientX;
  const diffX = currentX - startX;

  if (Math.abs(diffX) > 50) { // Minimum distance to trigger swipe
    if (diffX > 0) {
      changeSlide(-1); // Swipe right -> Previous slide
    } else {
      changeSlide(1); // Swipe left -> Next slide
    }
    isDragging = false; // Stop dragging after a swipe
  }
}

function handleTouchEnd() {
  isDragging = false; // Reset dragging flag
}

function handleMouseDown(e) {
  startX = e.clientX; // Get the starting X position of the mouse
  isDragging = true;
}

function handleMouseMove(e) {
  if (!isDragging) return;

  const currentX = e.clientX;
  const diffX = currentX - startX;

  if (Math.abs(diffX) > 50) { // Minimum distance to trigger swipe
    if (diffX > 0) {
      changeSlide(-1); // Drag right -> Previous slide
    } else {
      changeSlide(1); // Drag left -> Next slide
    }
    isDragging = false; // Stop dragging after a swipe
  }
}

function handleMouseUp() {
  isDragging = false; // Reset dragging flag
}

// Auto-play feature (optional)
let autoPlayInterval = setInterval(() => changeSlide(1), 3000);

// Pause auto-play on hover
sliderContainer.addEventListener('mouseenter', () => {
  clearInterval(autoPlayInterval);
});

sliderContainer.addEventListener('mouseleave', () => {
  autoPlayInterval = setInterval(() => changeSlide(1), 3000);
});

// Initialize the slider
showSlide(slideIndex);