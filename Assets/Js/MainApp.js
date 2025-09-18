    /*
     * This is a My Code for Telegram WebApp for Bots
     * It contains examples of how to use the API
     * Note: all requests to backend are disabled in this demo, you should use your own backend
     */


    const Myapps = {
        initData      : Telegram.WebApp.initData || '',
        initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
        BackButton: Telegram.WebApp.BackButton,
        SettingsButton: Telegram.WebApp.SettingsButton,

        init: function(options) {
            document.body.style.visibility = ''; // Show content
            Telegram.WebApp.ready(); 
            // This method should be called as soon as possible to initialize the Web App with all the required variables

            Myapps.BackButton.show();
            Myapps.SettingsButton.show();
            
            Telegram.WebApp.BackButton.onClick(function() {
                Myapps.showConfirm("Do You went To Close App?");
            });

            Telegram.WebApp.SettingsButton.onClick(function() {
                Myapps.showAlert('Settings opened!');
            });
        },
        doesntSupport(version) {
            // console.log("version: " + version);
            // console.log("realVersion: " + this.version());
            // console.log("doesntSupport: " + this.isVersionAtLeast(version));
            if (!this.isVersionAtLeast(version)) {
                Telegram.WebApp.showAlert('This feature is not supported in this version of Telegram', function () {
                    Telegram.WebApp.close();
                });
                throw new Error('This feature is not supported in this version of Telegram');
            }
        },
        sendText(spam) {
            const textField = document.querySelector('#text_field');
            const text      = textField.value;
            if (!text.length) {
                return textField.focus();
            }
            if (byteLength(text) > 4096) {
                return alert('Text is too long');
            }

            const repeat = spam ? 10 : 1;
            for (let i = 0; i < repeat; i++) {
                Telegram.WebApp.sendData(text);
            }
        },
        sendTime(spam) {
            const repeat = spam ? 10 : 1;
            for (let i = 0; i < repeat; i++) {
                Telegram.WebApp.sendData(new Date().toString());
            }
        },
        // Alerts
        showAlert(message) {
            Telegram.WebApp.showAlert(message);
        },
        showConfirm(message) {
            Telegram.WebApp.showConfirm(message ,function (yes,no) {
                if (yes) {
                    Telegram.WebApp.close();
                }
            });
        },
        isVersionAtLeast(version) {
            return Telegram.WebApp.isVersionAtLeast(version);
        },
        showPopup() {
            Telegram.WebApp.showPopup({
                title  : 'Popup title',
                message: 'Popup message',
                buttons: [
                    {id: 'delete', type: 'destructive', text: 'Delete all'},
                    {id: 'faq', type: 'default', text: 'Open FAQ'},
                    {type: 'cancel'},
                ]
            }, function (buttonId) {
                if (buttonId === 'delete') {
                    Myapps.showAlert("'Delete all' selected");
                } else if (buttonId === 'faq') {
                    Telegram.WebApp.openLink('https://telegram.org/faq');
                }
            });
        },
        Clipboard(el) {
            Telegram.WebApp.readTextFromClipboard(function (clipText) {
                if (clipText === null) {
                    el.nextElementSibling.innerHTML = 'Clipboard text unavailable.';
                    el.nextElementSibling.className = 'err';
                } else {
                    el.nextElementSibling.innerHTML = '(Read from clipboard: Â«' + clipText + 'Â»)';
                    el.nextElementSibling.className = 'ok';
                }
            });
            return false;
        },
        requestWriteAccess(el) {
            Telegram.WebApp.requestWriteAccess(function(allowed) {
                if (allowed) {
                    el.nextElementSibling.innerHTML = '(Access granted)'
                    el.nextElementSibling.className = 'ok'
                } else {
                    el.nextElementSibling.innerHTML = '(User declined this request)'
                    el.nextElementSibling.className = 'err'
                }
            })
        },
        requestServerTime(el) {
            Telegram.WebApp.invokeCustomMethod('getCurrentTime', {}, function(err, time) {
                if (err) {
                    el.nextElementSibling.innerHTML = '(' + err + ')'
                    el.nextElementSibling.className = 'err'
                } else {
                    el.nextElementSibling.innerHTML = '(' + (new Date(time * 1000)).toString() + ')'
                    el.nextElementSibling.className = 'ok'
                }
            });
        },
        // home screen
        homeScreenInit() {
            Telegram.WebApp.onEvent('homeScreenAdded', function(params) {
                const span = document.getElementById('add_to_home_btn').nextElementSibling;
                span.textContent = '(added!)';
                span.className = 'ok';
            })
        },
        addToHomeScreen(el) {
            Telegram.WebApp.addToHomeScreen()
        },
        checkHomeScreenStatus(el) {
            Telegram.WebApp.checkHomeScreenStatus(function(status) {
                const span = el.nextElementSibling;
                span.textContent = '(status: ' + status + ')';
                span.className = 'ok';
            })
        },

        // activity
        activityStartTime: new Date(),
        activityPrevDuration: false,
        activityTo: null,
        activityInit: function() {
            Telegram.WebApp.onEvent('activated', function(params) {
                Myapps.activityStartTime = new Date();
                Myapps.activityUpdate();
            });

            Telegram.WebApp.onEvent('deactivated', function(params) {
                Myapps.activityPrevDuration = new Date() - Myapps.activityStartTime;
                Myapps.activityStartTime = false;
                clearTimeout(Myapps.activityTo);
                Myapps.activityUpdate();
            });

            Myapps.activityUpdate();
        },
        activityUpdate: function() {
            const curActivityElement = document.getElementById('cur_activity');
            const prevActivityElement = document.getElementById('prev_activity');

            if (Telegram.WebApp.isActive) {
                const nowDuration = new Date() - Myapps.activityStartTime;
                curActivityElement.innerHTML = 'Mini App is active for <b>' + Math.round(nowDuration / 1000) + '</b> sec';
                Myapps.activityTo = setTimeout(Myapps.activityUpdate, 100);
            } else {
                curActivityElement.innerHTML = 'Mini App is <b>inactive</b>';
            }

            if (Myapps.activityPrevDuration !== false) {
                const prevDuration = Myapps.activityPrevDuration;
                prevActivityElement.innerHTML = ', <br>previously was active for <b>' + Math.round(prevDuration / 1000) + '</b> sec';
            }
        },
        // Other
        apiRequest(method, data, onCallback) {
            // DISABLE BACKEND FOR FRONTEND DEMO
            // YOU CAN USE YOUR OWN REQUESTS TO YOUR OWN BACKEND
            // CHANGE THIS CODE TO YOUR OWN
            return onCallback && onCallback({error: 'This function (' + method + ') should send requests to your backend. Please, change this code to your own.'});

            const authData = Myapps.initData || '';
            fetch('/demo/api', {
                method     : 'POST',
                body       : JSON.stringify(Object.assign(data, {
                    _auth : authData,
                    method: method,
                })),
                credentials: 'include',
                headers    : {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (result) {
                onCallback && onCallback(result);
            }).catch(function (error) {
                onCallback && onCallback({error: 'Server error'});
            });
        },
        downloadFile: function(el, url, file_name) {
            Telegram.WebApp.downloadFile({url: url, file_name: file_name}, function(result) {
                const span = el.nextElementSibling;
                if (result) {
                    span.textContent = '(downloading...)';
                    span.className = 'ok';
                } else {
                    span.textContent = '(declined)';
                    span.className = 'err';
                }
            });
        },
        // cloud storage My Edits
        cloudStorageKeys: {},
        cloudStorageItems: {},
        editCloud(key, event) {
            event.preventDefault();
            const values = Myapps.cloudStorageItems
            const mainvalue = values[key];
            return {key,mainvalue}
        },
        saveCloud(key,value) {
            Telegram.WebApp.CloudStorage.setItem(key, value, function(err, saved) {
                if (err) {
                    Myapps.showAlert('Error: ' + err);
                } else {
                    if (saved) {
                        if (typeof Myapps.cloudStorageItems[key] === 'undefined') {
                            Myapps.cloudStorageKeys.push(key);
                        }
                        Myapps.cloudStorageItems[key] = value;
                    }
                }
            });
        },
        getCloudKey(key) {
             Telegram.WebApp.CloudStorage.getItem(key, function(err, values) {
                if (err) {
                    Myapps.showAlert('Error: ' + err);
                    return "0";
                } else {
                    return values;
                }
            }); 
        },
        Opener(on) {
            if (on == true) {
                document.getElementById("aniloader").style.display = "flex";
            }else{
                document.getElementById("aniloader").style.display = "none";
            }
        },
        //Checkin intervers Functions
        checkIn() {
            Telegram.WebApp.CloudStorage.getItem('nextCheckIn',function(err,nextCheck){
            const nextCheckIn = nextCheck;
            if (nextCheckIn !== "") {
                const now = new Date();
                const nextCheckInDate = new Date(nextCheckIn);
                if (now >= nextCheckInDate) {
                    // Check-in is allowed
                    Myapps.savecoin();
                    Myapps.newchecks();
                }
            }else{ Myapps.newchecks();  } });
        },
        newchecks() {
                const now = new Date();
                const nextCheckIn = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
                //setCookie("", nextCheckIn.toISOString(), 1); 
                Myapps.saveCloud('nextCheckIn',nextCheckIn.toISOString());// Save the next check-in time in a cookie
                document.getElementById("status").innerText = `Checked in! Next check-in at ${nextCheckIn.toLocaleTimeString()}`;
                Myapps.startCountdown(nextCheckIn);
                Myapps.startProgressPercentage(nextCheckIn);
                
        },
        startProgressPercentage(nextCheckIn) {
            const progressPercentageElement = document.getElementById("progressPercentage");
            const totalDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
            const interval = setInterval(() => {
                const now = new Date();
                const elapsedTime = now - (nextCheckIn - totalDuration);
                const percentage = (elapsedTime / totalDuration) * 1000;
            
                if (percentage >= 1000) {
                    clearInterval(interval);
                    progressPercentageElement.innerText = "1000";
                    document.getElementById('checkInButton').disabled = false;
                    return;
                }
            
                progressPercentageElement.innerText = `${percentage.toFixed(3)}`;
            }, 1000);
        },
        checkIfTimeToCheckIn() {
            Telegram.WebApp.CloudStorage.getItem('nextCheckIn',function(err,nextCheck){
                console.log("This is the next check in "+nextCheck);
            const nextCheckIn = nextCheck;
            if (nextCheckIn !== "") {
                const now = new Date();
                const nextCheckInDate = new Date(nextCheckIn);
                if (now >= nextCheckInDate) {
                    document.getElementById("status").innerText = "It's time to check in!";
                    document.getElementById("progressPercentage").innerText = "1000";
                    document.getElementById('checkInButton').disabled = false;
                } else {
                    document.getElementById('checkInButton').disabled = true;
                    document.getElementById("status").innerText = `Next check-in at ${nextCheckInDate.toLocaleTimeString()}`;
                    Myapps.startCountdown(nextCheckInDate);
                    Myapps.startProgressPercentage(nextCheckInDate);
                }
            } else {
                document.getElementById("status").innerText = "God You Haven't check-in.";
                document.getElementById('checkInButton').disabled = false;
            }
            setTimeout(() => {
            Myapps.Opener(false)
            }, 5000);
            
            });
            
        },
        startCountdown(nextCheckIn) {
            const countdownElement = document.getElementById("countdown");
            const interval = setInterval(() => {
                const now = new Date();
                const timeLeft = nextCheckIn - now;
            
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    countdownElement.innerText = "Time's up! Please check in.";
                    return;
                }
            
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
                countdownElement.innerText = `Time left: ${hours}h ${minutes}m ${seconds}s`;
            }, 1000);
        },
        savecoin() {
            //var balance = userCookie();
            document.getElementById('checkInButton').disabled = true;
            Telegram.WebApp.CloudStorage.getItem('balance',function(err,item){
                    var count = document.getElementById('progressPercentage').innerHTML;
                     let bitem = (item !== "") ? item : 0;
                     var mainbalance = parseInt(bitem) + parseInt(count); 
                     console.log("This is the added balance "+item+" count is "+count+" main balance is "+mainbalance); 
                     Myapps.saveCloud('balance',mainbalance);
                     Myapps.showbalance();
            });     
     
        },
        showbalance() {
          try {
            Telegram.WebApp.CloudStorage.getItem('balance',function(err,item){
             document.getElementById('coinbl').innerHTML = Myapps.formatNumbers(parseInt(item));
               });
           } catch (error) { console.log(error)  }  
        },
        formatNumbers(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }else if(num >= 1000){
                return (num / 1000).toFixed(1) + 'K';
             }
        return num.toString();
        },  // Function to show notification
        showNotification(message, type = 'default', duration = 3000) {
             // Create notification container if it doesn't exist
           let notificationContainer = document.querySelector('.notification-container');
           if (!notificationContainer) {
           notificationContainer = document.createElement('div');
           notificationContainer.className = 'notification-container';
           document.body.appendChild(notificationContainer);
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            // Add appropriate icon based on type
            let icon = '';
            switch(type) {
                case 'success':
                    icon = '✓';
                    break;
                case 'error':
                    icon = '✕';
                    break;
                case 'warning':
                    icon = '⚠';
                    break;
                default:
                    icon = 'ℹ';
            }
            
            notification.innerHTML = `<span>${icon}</span> ${message}`;
            notificationContainer.appendChild(notification);
    
            // Trigger reflow
            notification.offsetHeight;
    
            // Show notification
            notification.classList.add('show');
    
            // Remove notification after duration
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, duration);
        },
        close() {
            Telegram.WebApp.close();
        }
    };