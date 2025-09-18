// Miniapp Manager System
document.addEventListener('DOMContentLoaded', function() {

    /**
     * * This part of code is used to handle the app list and fetch data from a JSON file.
     * * It uses the Fetch API to retrieve the data and dynamically create HTML elements to display the app information.
    */
    
       const appListFatch = {
        // Function to initialize the app list
        init: function() {
          appListFatch.fetchData('/Assets/Js/all.json'); // Fetch data from the JSON file
        },
         // Function to Display JSON data from URL
        displayData(data) {
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
        const joinButtons = document.querySelectorAll('#join');
    
        console.log('join buttons', joinButtons);
    
        // Add event listeners to join buttons
        joinButtons.forEach(jbtn => {
              jbtn.addEventListener('click', async function(e) {
               const appItem = e.target.closest('.listitem');
                if (appItem) {
                    const appInfo = {
                        id: appItem.dataset.appId || Date.now().toString(), // Generate unique ID if not provided
                        name: appItem.querySelector('#appname').textContent,
                        description: appItem.querySelector('#appdesc').textContent,
                        image: appItem.querySelector('img').src,
                        stats: {
                            totalUsers: appItem.querySelector('#totaluser').textContent,
                            telegram: appItem.querySelector('#telegram').textContent,
                            x: appItem.querySelector('#x').textContent
                        },
                        link: appItem.querySelector('#join').dataset.link || 'unavillable'
                    };
                    
                    await addToMyApps(appInfo);
                    await displayMyApps();
                    await displayRecentApps();
                }
        });  
        });
        },
         // Function to fetch JSON data from URL
        async fetchData(url) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          appListFatch.displayData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      
      
      
      }
        // Cloud Storage Keys
        const CLOUD_KEYS = {
            MY_APPS: 'my_apps',
            RECENT_APPS: 'recent_apps'
        };
    
        // Initialize cloud storage functions
        function getCloudItem(key) {
            Telegram.WebApp.CloudStorage.getItem(key,function(err, value) {
                if (err) {
                    Myapps.showAlert('Error: ' + err);
                    return [];
                }
                console.log('Cloud Storage Value: on get item ',value);
                // Parse the value if it exists, otherwise return null
                return value ? JSON.parse(value) : [];   
                });
        }
    
        function setCloudItem(key, value) {
         Telegram.WebApp.CloudStorage.setItem(key,JSON.stringify(value), function(err, saved) {
            if (err) {
                Myapps.showAlert('Error: ' + err);
                return false;
            } else {
                if (saved) {
                    if (typeof Myapps.cloudStorageItems[key] === 'undefined') {
                        Myapps.cloudStorageKeys.push(key);
                    }
                    Myapps.cloudStorageItems[key] = value;
                }
                
            Myapps.showNotification('Setting Cloud iteems: '+key, 'success');
                return true;
            }
        });
        }
    
        // Miniapp Management Functions
        async function addToMyApps(appInfo) {
            try {
                // Get current apps
                // 
                Telegram.WebApp.CloudStorage.getItem("my_apps",function(err, myApps) {
                    if (err) {
                        Myapps.showAlert('Error: ' + err);
                        return false;
                    }
                    console.log('Cloud Storage Value: on get item ',myApps);
                    // Parse the value if it exists, otherwise return null
                    myApps = myApps ? JSON.parse(myApps) : [];
                    if (!myApps.some(app => app.id === appInfo.id)) {
                        // Add new app
                        myApps.push({
                            ...appInfo,
                            addedDate: new Date().toISOString()
                        });
                        // Save to cloud
                        setCloudItem("my_apps", myApps);
                        
                        // Add to recent apps
                        addToRecentApps(appInfo);
                        
                        Myapps.showNotification('App added successfully!', 'success');
                        displayMyApps();
                        displayRecentApps();
                        return true;
                    } else {
                        Myapps.showNotification('App already in your library', 'warning');
                        return false;
                    }   
                    });




            } catch (error) {
                console.error('Error adding app:', error);
                Myapps.showNotification('Failed to add app'+error, 'error');
                return false;
            }
        }
    
        async function addToRecentApps(appInfo) {
            try {
                let recentApps = await getCloudItem(CLOUD_KEYS.RECENT_APPS) || [];
                
                // Remove if already exists
                recentApps = recentApps.filter(app => app.id !== appInfo.id);
                
                // Add to beginning
                recentApps.unshift({
                    ...appInfo,
                    lastOpened: new Date().toISOString()
                });
                
                // Keep only last 5 apps
                recentApps = recentApps.slice(0, 5);
                
                await setCloudItem(CLOUD_KEYS.RECENT_APPS, recentApps);
            } catch (error) {
                console.error('Error updating recent apps:', error);
            }
        }
    
        function displayMyApps() {
            try {
              //  telegram.WebApp.alert('Loading your apps...');
              Telegram.WebApp.CloudStorage.getItem("my_apps",function(err, myAppsd) {
                if (err) {
                    Myapps.showAlert('Error: ' + err);
                    return;
                }
                myAppsd = JSON.parse(myAppsd);
                console.log('My Apps: 🚀🚀🚀👀👀', JSON.stringify (myAppsd));  
                Myapps.showNotification('Getting Apps: '+myAppsd.length+" Apps Fonds", 'success');
                // Get the container for displaying apps
                const allMyAppsContainer = document.getElementById('allmyapps');
                
                if (myAppsd.length === 0) {
                    allMyAppsContainer.innerHTML = `
                        <div class="empty">
                            No apps in your library yet {$myApps.length}
                        </div>
                    `;
                    return;
                }
    
                allMyAppsContainer.innerHTML = myAppsd.map(app => `
                    <div class="listitem">
                        <img src="${app.image}" alt="${app.name}">
                        <div class="minappinfo">
                            <div id="appname">${app.name}</div>
                            <div id="appdesc">
                                <div id="totaluser">${app.stats.totalUsers}</div>
                                <div id="telegram">${app.stats.telegram}</div>
                                <div id="x">${app.stats.x}</div>
                            </div>
                        </div>
                        <div id="join" onclick="openApp('${app.link}')">
                            <span class="fi fi-sr-play"></span>
                        </div>
                    </div>
                `).join('');
                });
                //let myAppsd = getCloudItem("my_apps");
                //myAppsd = (!myAppsd) ? [] : myAppsd;




            } catch (error) {
                console.error('Error displaying my apps:', error);
                Myapps.showNotification('Failed to load your apps '+error, 'error');
            }
        }
    
        async function displayRecentApps() {
            try {
                let recentApps = await getCloudItem(CLOUD_KEYS.RECENT_APPS) || [];
                const recentOpenContainer = document.getElementById('recentopen');
                
                if (recentApps.length === 0) {
                    recentOpenContainer.innerHTML = `
                        <div class="empty">
                            No recently opened apps
                        </div>
                    `;
                    return;
                }
    
                recentOpenContainer.innerHTML = recentApps.map(app => `
                    <div class="listitem">
                        <img src="${app.image}" alt="${app.name}">
                        <div class="minappinfo">
                            <div id="appname">${app.name}</div>
                            <div id="appdesc">
                                <div id="totaluser">${app.stats.totalUsers}</div>
                                <div id="telegram">${app.stats.telegram}</div>
                                <div id="x">${app.stats.x}</div>
                            </div>
                        </div>
                        <div id="join" onclick="openApp('${app.link}')">
                            <span class="fi fi-sr-play"></span>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error displaying recent apps:', error);
                Myapps.showNotification('Failed to load recent apps', 'error');
            }
        }
    
        // Helper function to open apps
        window.openApp = function(link) {
            if (link) {
                window.open(link, '_blank');
            }
        };
    
    
        // Initial display
        
        appListFatch.init(); // Initialize the app list
        displayMyApps();
        displayRecentApps();
    
        // Tab Switching Functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons and contents
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
        
                    // Add active class to clicked button and corresponding content
                    button.classList.add('active');
                    const tabId = button.getAttribute('data-tab');
                    document.getElementById(`${tabId}-content`).classList.add('active');
                    displayMyApps();
                    loadbs()
                });
            });
    
    

            // Add this to your JavaScript

(function () {
    const customConsole = document.getElementById('customConsole');
    const consoleContent = document.getElementById('consoleContent');
    const toggleConsole = document.getElementById('toggleConsole');
    const consoleHeader = document.getElementById('consoleHeader');

    // Toggle console visibility
    toggleConsole.addEventListener('click', () => {
        customConsole.classList.toggle('hidden');
    });

    // Variables for dragging
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // Mouse events for dragging
    consoleHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - customConsole.offsetLeft;
        offsetY = e.clientY - customConsole.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            customConsole.style.left = `${e.clientX - offsetX}px`;
            customConsole.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Touch events for dragging
    consoleHeader.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - customConsole.offsetLeft;
        offsetY = touch.clientY - customConsole.offsetTop;
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    });

    function onTouchMove(e) {
        if (isDragging) {
            const touch = e.touches[0];
            customConsole.style.left = `${touch.clientX - offsetX}px`;
            customConsole.style.top = `${touch.clientY - offsetY}px`;
        }
    }

    function onTouchEnd() {
        isDragging = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }

    // Capture console.log outputs
    const originalConsoleLog = console.log;
    console.log = function (...args) {
        originalConsoleLog.apply(console, args);
        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        consoleContent.appendChild(logEntry);
        consoleContent.scrollTop = consoleContent.scrollHeight;
    };
})();













    
    }); 