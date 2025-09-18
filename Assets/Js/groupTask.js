document.addEventListener('DOMContentLoaded', function() {
    // Get all task buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    const verifyButtons = document.querySelectorAll('.verify-btn');
    
    // Function to safely open links
    function safeOpenLink(url) {
        if (Telegram.WebApp.platform === 'web') {
            window.open(url, '_blank');
        } else {
            try {
                Telegram.WebApp.openLink(url, {
                    try_instant_view: false,
                    open_in_new_tab: true
                });
            } catch (error) {
                window.open(url, '_blank');
            }
        }
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

    // Initialize tasks from cloud storage
    async function initializeTasks() {
        try {
           // Telegram.WebApp.showAlert('Reloading Tasks...');
            // Check completion status for all tasks
            joinButtons.forEach(async (btn) => {
                const taskId = btn.dataset.taskid;
                try {
                    const isCompleted = await getCloudItem(`completed_${taskId}`);
                    if (isCompleted === 'true') {
                        const taskBox = btn.closest('.tasks-box');
                        const verifyBtn = taskBox.querySelector('.verify-btn');
                        const actionBtn = taskBox.querySelector('.join-btn');
                        
                        // Disable buttons and update UI
                        btn.disabled = true;
                        verifyBtn.disabled = true;
                        verifyBtn.classList.add('completed');
                        verifyBtn.textContent = 'Completed';
                        actionBtn.style.display = 'none';
                        verifyBtn.style.display = 'flex';
                    }
                } catch (err) {
                    console.error('Error checking task completion:', err);
                }
            });
        } catch (error) {
            console.error('Error initializing tasks:', error);
        }
    }

    // Handle join button clicks
    joinButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            try {
                const taskId = this.dataset.taskid;
                const link = this.dataset.link;
                
                // Save task attempt to cloud storage with timestamp
                const timestamp = Date.now();
                const saved = await setCloudItem(`attempt_${taskId}`, timestamp.toString());
                
                if (saved) {
                    // Open the link
                    safeOpenLink(link);
                    
                    // Enable verify button with animation
                    const taskBox = this.closest('.tasks-box');
                    const verifyBtn = taskBox.querySelector('.verify-btn');
                    const actionBtn = taskBox.querySelector('.join-btn');
                    actionBtn.style.display = 'none';
                    verifyBtn.style.display = 'flex';
                    verifyBtn.disabled = false;
                    verifyBtn.classList.add('animate');
                    
                    // Show message
                    Telegram.WebApp.showAlert('Task started! Click verify after completion.');
                } else {
                    Telegram.WebApp.showAlert('Error starting task. Please try again.');
                }
                
            } catch (error) {
                console.error('Error saving task attempt:', error);
                Telegram.WebApp.showAlert('Error starting task. Please try again.');
            }
        });
    });

    // Handle verify button clicks
    verifyButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            try {
                const taskBox = this.closest('.tasks-box');
                const joinBtn = taskBox.querySelector('.join-btn');
                const taskId = joinBtn.dataset.taskid;
                const reward = parseInt(joinBtn.dataset.reward);

                // Add loading state
                this.textContent = 'Verifying...';
                this.classList.add('verifying');

                // Check if task was actually started
                const taskAttempt = await getCloudItem(`attempt_${taskId}`);
                if (!taskAttempt) {
                    this.textContent = 'Verify';
                    this.classList.remove('verifying');
                    Telegram.WebApp.showAlert('Please click Join/Start button first!');
                    return;
                }

                // Check if task is already completed
                const isCompleted = await getCloudItem(`completed_${taskId}`);
                if (isCompleted === 'true') {
                    this.textContent = 'Completed';
                    this.classList.remove('verifying');
                    this.classList.add('completed');
                    Telegram.WebApp.showAlert('Task already completed!');
                    return;
                }

                // Save completion status to Telegram cloud
                const completionSaved = await setCloudItem(`completed_${taskId}`, 'true');
                
                if (completionSaved) {
                    // Get current balance
                    const currentBalanceStr = await getCloudItem('balance') || '0';
                    const currentBalance = parseInt(currentBalanceStr);
                    const newBalance = currentBalance + reward;
                    
                    // Update balance in cloud storage
                    const balanceSaved = await setCloudItem('balance', newBalance.toString());
                    
                    if (balanceSaved) {
                        // Update UI with animation
                        document.getElementById('coinbl').textContent = newBalance;
                        joinBtn.disabled = true;
                        this.disabled = true;
                        this.classList.remove('verifying');
                        this.classList.add('completed');
                        this.textContent = 'Completed';
                        
                        // Show success message
                        Telegram.WebApp.showAlert(`Task completed! You earned ${reward} RGL coins!`);
                    } else {
                        this.textContent = 'Verify';
                        this.classList.remove('verifying');
                        Telegram.WebApp.showAlert('Error updating balance. Please try again.');
                    }
                } else {
                    this.textContent = 'Verify';
                    this.classList.remove('verifying');
                    Telegram.WebApp.showAlert('Error completing task. Please try again.');
                }
                
            } catch (error) {
                console.error('Error:', error);
                this.textContent = 'Verify';
                this.classList.remove('verifying');
                Telegram.WebApp.showAlert('Error verifying task completion. Please try again.');
            }
        });
    });

    // Load balance from cloud storage
    async function loadBalance() {
        try {
            const savedBalance = await getCloudItem('balance');
            if (savedBalance) {
                document.getElementById('coinbl').textContent = Myapps.formatNumbers(savedBalance);
            }
        } catch (error) {
            console.error('Error loading balance:', error);
        }

    }

    // Initialize tasks and load balance
    initializeTasks();
    loadBalance();

    // Initially disable all verify buttons until task is started
    verifyButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Verify';
    });
});
