document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const quotesElement = document.getElementById('Quotes');
    const shareButton = document.getElementById('shareStatus');
    const downloadButton = document.getElementById('downloadStatus');

    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Function to show notification
    function showNotification(message, type = 'default', duration = 3000) {
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
    }

    // Function to get cloud storage value with promise
    function getCloudItem(key) {
        return new Promise((resolve, reject) => {
            Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            });
        });
    }

    // Function to set cloud storage value with promise
    function setCloudItem(key, value) {
        return new Promise((resolve, reject) => {
            Telegram.WebApp.CloudStorage.setItem(key, value, (error, saved) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(saved);
                }
            });
        });
    }

    // Function to save image to server
    async function saveImageToServer(imageData) {
        try {
            const formData = new FormData();
            formData.append('image', imageData);

            const response = await fetch('https://dppas.rav.com.ng/saveimage', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to save image');
            }

            return result.url;
        } catch (error) {
            console.error('Error saving image:', error);
            throw error;
        }
    }

    // Function to convert element to image
    async function elementToImage(element) {
        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas size to match element
            canvas.width = element.offsetWidth;
            canvas.height = element.offsetHeight;
            
            // Use html2canvas to capture the element
            const dataUrl = await html2canvas(element, {
                backgroundColor: null,
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                onclone: function(clonedDoc) {
                    // Style the cloned element for better image quality
                    const clonedElement = clonedDoc.getElementById('Quotes');
                    if (clonedElement) {
                        clonedElement.style.padding = '20px';
                        clonedElement.style.color = '#ffffff';
                        clonedElement.style.fontSize = '18px';
                        clonedElement.style.lineHeight = '1.6';
                        clonedElement.style.textAlign = 'center';
                        clonedElement.style.background = 'url(https://dppas.rav.com.ng/Assets/bg.webp)';
                        clonedElement.style.width = '90%';
                        clonedElement.style.borderRadius = '0px';
                        clonedElement.style.backgroundPosition = 'center';
                        clonedElement.style.backgroundSize = 'cover';
                        clonedElement.style.backgroundRepeat = 'no-repeat';
                        clonedElement.style.textShadow = '-1px -1px 0 #000000, 1px -1px 0 #000000,-1px  1px 0 #000000,1px  1px 0 #000000';
                        clonedElement.style.backgroundColor = '#000000bf';
                        clonedElement.style.backgroundBlendMode = 'overlay';

                    }
                }
            }).then(canvas => canvas.toDataURL('image/png'));
            
            return dataUrl;
        } catch (error) {
            console.error('Error converting element to image:', error);
            throw error;
        }
    }

    // Function to download image
    async function downloadImage() {
        try {
            // Show loading message
            showNotification('Preparing your image for download...', 'default');

            // Convert Quotes element to image
            const imageData = await elementToImage(quotesElement);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'rgl_coin_quote.png';
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            showNotification('Image downloaded successfully! 📥', 'success');
        } catch (error) {
            console.error('Error downloading image:', error);
            showNotification('Error downloading image. Please try again.', 'error');
        }
    }

    // Function to share status and earn rewards
    async function shareStatusAndEarn() {
        try {
            const userId = Telegram.WebApp.initDataUnsafe?.user?.id;
            if (!userId) {
                throw new Error('User ID not available');
            }

            // Check if user has already shared status today
            const today = new Date().toISOString().split('T')[0];
            //const lastShareDate = await getCloudItem('last_status_share');
            const lastShareDate = "2025-03-12";
            
            if (lastShareDate === today) {
                showNotification('You have already shared your status today. Try again tomorrow!', 'warning');
                return;
            }

            // Show loading message
            showNotification('Preparing your story image...', 'default');

            // Convert Quotes element to image
            const imageData = await elementToImage(quotesElement);
            
            // Save image to server and get URL
            const imageUrl = await saveImageToServer(imageData);
            
            // Share to Telegram story using shareToStory
            await Telegram.WebApp.shareToStory(imageUrl, {
                widget_link: {
                    url: 'https://t.me/rlgcoin_bot/rlgcoin'
                }
            }, {
                text: 'Check out my daily inspiration from RGL Coin! 🚀'
            });
            
            // Get current balance
            const currentBalance = parseInt(await getCloudItem('balance') || '0');
            
            // Add reward (500 RGL)
            await setCloudItem('balance', (currentBalance + 500).toString());
            
            // Record today's share
            await setCloudItem('last_status_share', today);

            // Show success message
            showNotification('Congratulations! You earned 500 RGL for sharing your story! 🎉', 'success');
            
            // Update balance display
                Myapps.showbalance();

        } catch (error) {
            console.error('Error sharing story:', error);
            showNotification('Error sharing story. Please try again later.', 'error');
        }
    }

    // Add event listeners
    if (shareButton) {
        shareButton.addEventListener('click', shareStatusAndEarn);
    }
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadImage);
    }



}); 