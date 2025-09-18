// script.js

class ImageSlider {
    constructor(containerId, jsonData) {
      this.container = document.getElementById(containerId); // Target container div
      this.slidesData = jsonData; // JSON data for slides
      this.slideIndex = 0; // Current slide index
      this.isDragging = false; // Flag to track dragging state
      this.startX = 0; // Start X position of touch/mouse
      this.init(); // Initialize the slider
    }
  
    init() {
      // Create the slider structure
      this.createSlider();
      this.addEventListeners();
      this.showSlide(this.slideIndex);
    }
  
    createSlider() {
      // Create the slider container and slides
      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'slider-container';
  
      const slidesWrapper = document.createElement('div');
      slidesWrapper.className = 'slides';
  
      this.slidesData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.style.backgroundImage = `url(${slide.image})`;
  
        const slideContentDiv = document.createElement('div');
        slideContentDiv.className = 'slidecontent';
  
        const iconImg = document.createElement('img');
        iconImg.src = slide.icon;
        iconImg.alt = `Icon ${index + 1}`;
  
        const condsDiv = document.createElement('div');
        condsDiv.className = 'conds';
  
        const appNameDiv = document.createElement('div');
        appNameDiv.className = 'appname';
        appNameDiv.textContent = slide.appName;
  
        const appDescDiv = document.createElement('div');
        appDescDiv.className = 'appdesc';
        appDescDiv.textContent = slide.appDesc;
  
        const joinNowSpan = document.createElement('span');
        joinNowSpan.className = 'appJoin fi fi-sr-envelope-open-dollar';
        joinNowSpan.textContent = 'Join Now';
  
        condsDiv.appendChild(appNameDiv);
        condsDiv.appendChild(appDescDiv);
  
        slideContentDiv.appendChild(iconImg);
        slideContentDiv.appendChild(condsDiv);
        slideContentDiv.appendChild(joinNowSpan);
  
        slideDiv.appendChild(slideContentDiv);
        slidesWrapper.appendChild(slideDiv);
      });
  
      sliderContainer.appendChild(slidesWrapper);
      this.container.innerHTML = ''; // Clear the container
      this.container.appendChild(sliderContainer);
    }
  
    addEventListeners() {
      const sliderContainer = this.container.querySelector('.slider-container');
  
      // Swipe/drag events
      sliderContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
      sliderContainer.addEventListener('touchmove', this.handleTouchMove.bind(this));
      sliderContainer.addEventListener('touchend', this.handleTouchEnd.bind(this));
  
      sliderContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
      sliderContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
      sliderContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
  
      // Auto-play feature (optional)
      this.autoPlayInterval = setInterval(() => this.changeSlide(1), 3000);
  
      // Pause auto-play on hover
      sliderContainer.addEventListener('mouseenter', () => clearInterval(this.autoPlayInterval));
      sliderContainer.addEventListener('mouseleave', () => {
        this.autoPlayInterval = setInterval(() => this.changeSlide(1), 3000);
      });
    }
  
    showSlide(index) {
      if (index >= this.slidesData.length) {
        this.slideIndex = 0; // Reset to first slide if index exceeds length
      } else if (index < 0) {
        this.slideIndex = this.slidesData.length - 1; // Go to last slide if index is negative
      }
  
      const offset = -this.slideIndex * 100; // Calculate the offset for sliding effect
      this.container.querySelector('.slides').style.transform = `translateX(${offset}%)`;
    }
  
    changeSlide(step) {
      this.slideIndex += step; // Increment or decrement slide index
      this.showSlide(this.slideIndex); // Update the displayed slide
    }
  
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX; // Get the starting X position of the touch
      this.isDragging = true;
    }
  
    handleTouchMove(e) {
      if (!this.isDragging) return;
  
      const currentX = e.touches[0].clientX;
      const diffX = currentX - this.startX;
  
      if (Math.abs(diffX) > 50) { // Minimum distance to trigger swipe
        if (diffX > 0) {
          this.changeSlide(-1); // Swipe right -> Previous slide
        } else {
          this.changeSlide(1); // Swipe left -> Next slide
        }
        this.isDragging = false; // Stop dragging after a swipe
      }
    }
  
    handleTouchEnd() {
      this.isDragging = false; // Reset dragging flag
    }
  
    handleMouseDown(e) {
      this.startX = e.clientX; // Get the starting X position of the mouse
      this.isDragging = true;
    }
  
    handleMouseMove(e) {
      if (!this.isDragging) return;
  
      const currentX = e.clientX;
      const diffX = currentX - this.startX;
  
      if (Math.abs(diffX) > 50) { // Minimum distance to trigger swipe
        if (diffX > 0) {
          this.changeSlide(-1); // Drag right -> Previous slide
        } else {
          this.changeSlide(1); // Drag left -> Next slide
        }
        this.isDragging = false; // Stop dragging after a swipe
      }
    }
  
    handleMouseUp() {
      this.isDragging = false; // Reset dragging flag
    }
  }



  const slidesData = [
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'HamsterCombat',
      appDesc: 'This is HamsterCombat Shit Test app'
    },
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'CatAdventure',
      appDesc: 'Embark on a feline-filled journey!'
    },
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'DogQuest',
      appDesc: 'Join the ultimate canine quest!'
    }
  ];

  const slidesNews = [
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'HamsterCombat News',
      appDesc: 'This is HamsterCombat Shit Test app'
    },
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'CatAdventure News',
      appDesc: 'Embark on a feline-filled journey!'
    },
    {
      image: '/Assets/hamster.jpg',
      icon: '/Assets/hamster icon.jpg',
      appName: 'DogQuest News',
      appDesc: 'Join the ultimate canine quest!'
    }
  ];
  // Initialize the slider
  const slider = new ImageSlider('slidesboxmini', slidesData);
  
  // Initialize the slider
  const slidernews = new ImageSlider('slidesboxnews', slidesNews);
