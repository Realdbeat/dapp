/*
  * This part of code is used to initialize the demo app and set up the event handlers we need.
  */

try {
Myapps.init();
Myapps.showbalance(); // Show balance
// Check if it's time to check in when the page loads
window.onload = Myapps.checkIfTimeToCheckIn();


// theme
Telegram.WebApp.onEvent('themeChanged', function () {
  bgColorInput.value = Telegram.WebApp.backgroundColor
  document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor)
})
  if (typeof Myapps.initDataUnsafe !== 'undefined') {
    document.getElementById('user_name').innerHTML = Myapps.initDataUnsafe.user.first_name + ' ' + Myapps.initDataUnsafe.user.last_name;
    if (Myapps.initDataUnsafe.user.photo_url) {
      document.getElementById('user_img').setAttribute('src', Myapps.initDataUnsafe.user.photo_url);
    } else {
      // document.getElementById('peer_photo').style.display = 'none';
    }
  } else if (Myapps.initDataUnsafe.chat) {
    document.getElementById('user_name').innerHTML = Myapps.initDataUnsafe.chat.title;
    if (Myapps.initDataUnsafe.chat.photo_url) {
      document.getElementById('user_img').setAttribute('src', Myapps.initDataUnsafe.chat.photo_url);
    } else {
      // document.getElementById('peer_photo').style.display = 'none';
    }
  }
} catch (error) {
  console.log(error);
}


/* 
* Navigation Menus 
* Version 2.0 Ai
*/
// Select the navigation items
const clicks = document.getElementById('clicks');
const miniapps = document.getElementById('miniapps');
const news = document.getElementById('news');
const tasks = document.getElementById('tasks');
const wallsection = document.getElementById('wallsection');
// Select all navigation items
const navItems = document.querySelectorAll('input[type="radio"]');
navItems.forEach(item => item.addEventListener('click', handleNavClick));
updateContent("home");
// Function to handle navigation item click
function handleNavClick(event) {
  //const targetPage = event.target.getAttribute('data-page');
  const targetPage = event.target.getAttribute('data-page');
  console.log(targetPage);
  //document.getElementById('show').innerHTML = targetPage;
  // Update the content based on the selected page
  updateContent(targetPage);
}
// Function to update the content dynamically
function updateContent(page) {
  switch (page) {
    case 'home':
      clicks.style.display = 'flex';
      miniapps.style.display = 'none';
      news.style.display = 'none';
      tasks.style.display = 'none';
      wallsection.style.display = 'none';
      
      break;
    case 'apps':
      clicks.style.display = 'none';
      miniapps.style.display = 'flex';
      news.style.display = 'none';
      tasks.style.display = 'none';
      wallsection.style.display = 'none';
      break;
    case 'news':
      clicks.style.display = 'none';
      miniapps.style.display = 'none';
      news.style.display = 'flex';
      tasks.style.display = 'none';
      wallsection.style.display = 'none';
      break;
    case 'wallsection':
      clicks.style.display = 'none';
      miniapps.style.display = 'none';
      news.style.display = 'none';
      wallsection.style.display = 'flex';
      tasks.style.display = 'none';
      break;
    case 'tasks':
      clicks.style.display = 'none';
      miniapps.style.display = 'none';
      news.style.display = 'none';
      tasks.style.display = 'flex';
      wallsection.style.display = 'none';
      break;
    default: ;
  }
}
// 
// End of Navigation Menus 
// Version 2.0 Ai
//

// Function to fetch JSON data from URL and display it

function displayData(data) {
  const appList = document.getElementById("lists");
  data.forEach(app => {
    // Create a container for each app
    let html = '';
    const appContainer = document.createElement("div");
    appContainer.classList.add("listitem");


    html += '<img src="' + app.image + '"><div class="minappinfo"><div id="appname">' + app.name + '</div><div id="appdesc"><div id="totaluser">' + app.totalUser + '</div><div id="telegram">' + app.telegram + '</div><div id="x">' + app.twiter + '</div></div></div><div id="join">Join App</div><!--End Minapps Items-->';
    appContainer.innerHTML = html
    // Append the app container to the app list
    appList.appendChild(appContainer);
  });
}
// Fetch data from URL and display it
fetchData('/Assets/Js/all.json');


// Function to fetch JSON data from URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Event listener for the check-in button
document.getElementById("checkInButton").addEventListener("click", Myapps.checkIn);

