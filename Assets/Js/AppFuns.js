// This file contains the main functions for the Telegram Web App, including user authentication, balance display, and check-in functionality.
// It also handles the navigation menu and app list display using JSON data.


/* 
* Navigation Menus *Version 0.1
* This part of code is used to handle the navigation menu and show/hide sections based on user  interaction. It uses event listeners to detect clicks on the navigation items and updates the displayed content accordingly.
*/
const Navi = {
  clicks : document.getElementById('clicks'),
  miniapps : document.getElementById('miniapps'),
  news : document.getElementById('news'),
  tasks : document.getElementById('tasks'),
  wallsection : document.getElementById('wallsection'),
  // Select all navigation items
  navItems : document.querySelectorAll('input[type="radio"]'),
  init: function() {
  this.navItems.forEach(item => item.addEventListener('click', this.handleNavClick));
  Navi.updateContent("home");
   },
  // Function to handle navigation item click
  handleNavClick(event) {
  //const targetPage = event.target.getAttribute('data-page');
  const targetPage = event.target.getAttribute('data-page');
  console.log(targetPage);
  //document.getElementById('show').innerHTML = targetPage;
  // Update the content based on the selected page
  Navi.updateContent(targetPage);
   },
   // Function to update the content dynamically
  updateContent(page) {
  switch (page) {
    case 'home':
      this.clicks.style.display = 'flex';
      this.miniapps.style.display = 'none';
      this.news.style.display = 'none';
      this.tasks.style.display = 'none';
      this.wallsection.style.display = 'none';
      
      break;
    case 'apps':
      this.clicks.style.display = 'none';
      this.miniapps.style.display = 'flex';
      this.news.style.display = 'none';
      this.tasks.style.display = 'none';
      this.wallsection.style.display = 'none';
      break;
    case 'news':
      this.clicks.style.display = 'none';
      this.miniapps.style.display = 'none';
      this.news.style.display = 'flex';
      this.tasks.style.display = 'none';
      this.wallsection.style.display = 'none';
      break;
    case 'wallsection':
      this.clicks.style.display = 'none';
      this.miniapps.style.display = 'none';
      this.news.style.display = 'none';
      this.wallsection.style.display = 'flex';
      this.tasks.style.display = 'none';
      break;
    case 'tasks':
      this.clicks.style.display = 'none';
      this.miniapps.style.display = 'none';
      this.news.style.display = 'none';
      this.tasks.style.display = 'flex';
      this.wallsection.style.display = 'none';
      break;
    default: ;
  } }

}


document.addEventListener('DOMContentLoaded', () => {
 try {
  Navi.init(); // Initialize the navigation menu
  Myapps.Opener(false); // Open the app list
  Myapps.init(); // Telegram Intrallize
  Myapps.showbalance(); // Show balance
  // Check if it's time to check in when the page loads
  Myapps.checkIfTimeToCheckIn(); // Check Checkins
  // theme
  Telegram.WebApp.onEvent('themeChanged', function () {
  bgColorInput.value = Telegram.WebApp.backgroundColor
  document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor)
  })
  
  if (typeof Myapps.initDataUnsafe !== 'undefined') {
    document.getElementById('user_name').innerHTML = Myapps.initDataUnsafe.user.first_name + ' ' + Myapps.initDataUnsafe.user.last_name;
    if (Myapps.initDataUnsafe.user.photo_url) {
      document.getElementById('user_img').setAttribute('src', Myapps.initDataUnsafe.user.photo_url);
    } 
  } else if (Myapps.initDataUnsafe.chat) {
    document.getElementById('user_name').innerHTML = Myapps.initDataUnsafe.chat.title;
    if (Myapps.initDataUnsafe.chat.photo_url) {
      document.getElementById('user_img').setAttribute('src', Myapps.initDataUnsafe.chat.photo_url);
    } 
  }

  // Event listener for the check-in button
  document.getElementById("checkInButton").addEventListener("click", Myapps.checkIn);
} catch (error) {
  console.log(error);
}


 });