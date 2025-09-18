document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const createReferBtn = document.getElementById('createReferLink');
    const referralModal = document.getElementById('referralModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const referralLink = document.getElementById('referralLink');
    const copyBtn = document.getElementById('copyLink');
    const shareBtn = document.getElementById('shareLink');
    const totalReferrals = document.getElementById('totalReferrals');

    // API endpoint
    const API_BASE_URL = 'https://dppas.rav.com.ng/referral';
    const BOT_USERNAME = 'rlgcoin_bot'; // Your bot username

    // Create referral link
    async function createReferralLink() {
        try {
            const userId = Telegram.WebApp.initDataUnsafe.user.id;
            if (!userId) {
                throw new Error('User ID not available');
            }

            const response = await fetch(`${API_BASE_URL}/create_referral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    initData: Telegram.WebApp.initData
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // Create the Telegram bot referral link
            return `https://t.me/${BOT_USERNAME}/rlgcoin?startapp=ref_${data.referral_code}`;
        } catch (error) {
            
            Telegram.WebApp.showAlert('try again. l'+error);
            console.error('Error creating referral link:', error);
            return null;
        }
    }

    // Show modal with referral link
    async function showReferralModal() {
        const link = await createReferralLink();
        if (link) {
            referralLink.textContent = link;
            modalOverlay.classList.add('active');
            referralModal.classList.add('active');
        } else {
            Telegram.WebApp.showAlert('Error creating referral link. Please try again.');
        }
    }

    // Hide modal
    function hideModal() {
        modalOverlay.classList.remove('active');
        referralModal.classList.remove('active');
    }

    // Copy referral link
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(referralLink.textContent);
            Telegram.WebApp.showAlert('Referral link copied to clipboard!');
        } catch (err) {
            Telegram.WebApp.showAlert('Failed to copy link. Please copy manually.');
        }
    }

    // Share referral link
    function shareReferralLink() {
        const link = referralLink.textContent;
        const text = `Join me on RGL Coin and earn rewards! Use my referral link: ${link}`;
        
        if (Telegram.WebApp.platform === 'web') {
            // Web sharing
            if (navigator.share) {
                navigator.share({
                    title: 'RGL Coin Referral',
                    text: text,
                    url: link
                }).catch(console.error);
            } else {
                copyToClipboard();
            }
        } else {
            // Telegram sharing
            Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
        }
    }

    // Check and process referral
    async function checkReferral() {
        try {
            // Get referral code from start parameter
            const startParam = Telegram.WebApp.initDataUnsafe?.start_param;
            if (!startParam || !startParam.startsWith('ref_')) {
                return;
            }

            const referralCode = startParam.substring(4); // Remove 'ref_' prefix
            const userId = Telegram.WebApp.initDataUnsafe?.user?.id;
            if (!userId) {
                console.error('User ID not available');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/process_referral`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    referral_code: referralCode,
                    initData: Telegram.WebApp.initData
                })
            });

            const data = await response.json();
            if (data.error) {
                Telegram.WebApp.showAlert(data.error);
            } else {
                Telegram.WebApp.showAlert('Welcome! You received 500 RGL as a welcome bonus, and your referrer received 1000 RGL!');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Error processing referral:', error);
            Telegram.WebApp.showAlert('Error processing referral. Please try again later.');
        }
    }

    // Update referral count display
    async function updateReferralCount() {
        try {
            const userId = Telegram.WebApp.initDataUnsafe?.user?.id;
            if (!userId) {
                return;
            }

            const response = await fetch(`${API_BASE_URL}/get_referral_count&user_id=${userId}&initData=${encodeURIComponent(Telegram.WebApp.initData)}`);
            const data = await response.json();
            
            if (data.success) {
                totalReferrals.textContent = data.count;
            }
        } catch (error) {
            console.error('Error updating referral count:', error);
        }
    }

    // Event Listeners
    createReferBtn.addEventListener('click', showReferralModal);
    modalOverlay.addEventListener('click', hideModal);
    copyBtn.addEventListener('click', copyToClipboard);
    shareBtn.addEventListener('click', shareReferralLink);

    // Initialize
    checkReferral();
    updateReferralCount();
    
    // Update referral count periodically
    setInterval(updateReferralCount, 30000);
}); 