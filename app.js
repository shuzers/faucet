// Main Application Logic

// Global State
let provider, signer, contract, userAddress;
let balanceRefreshInterval;

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const connectSection = document.getElementById('connectSection');
const walletSection = document.getElementById('walletSection');
const walletAddress = document.getElementById('walletAddress');
const watchAdBtn = document.getElementById('watchAdBtn');
const claimBtn = document.getElementById('claimBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const adsRemaining = document.getElementById('adsRemaining');
const faucetBalance = document.getElementById('faucetBalance');
const alertBox = document.getElementById('alertBox');
const alertText = document.getElementById('alertText');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const darkIcon = document.getElementById('darkIcon');
const lightIcon = document.getElementById('lightIcon');

// Tab Elements
const faucetTab = document.getElementById('faucetTab');
const spinTab = document.getElementById('spinTab');
const donateTab = document.getElementById('donateTab');
const sponsorTab = document.getElementById('sponsorTab');
const faucetContent = document.getElementById('faucetContent');
const spinContent = document.getElementById('spinContent');
const donateContent = document.getElementById('donateContent');
const sponsorContent = document.getElementById('sponsorContent');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Faucet App Initialized');
    updateAdProgress();
    initTheme();
    initTabs();
});

// Tab Management
function initTabs() {
    faucetTab.addEventListener('click', () => switchTab('faucet'));
    spinTab.addEventListener('click', () => switchTab('spin'));
    donateTab.addEventListener('click', () => switchTab('donate'));
    sponsorTab.addEventListener('click', () => switchTab('sponsor'));
}

function switchTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-white');
        btn.classList.add('border-transparent');
    });

    // Hide all content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected tab
    if (tab === 'faucet') {
        faucetTab.classList.add('active', 'border-white');
        faucetTab.classList.remove('border-transparent');
        faucetContent.classList.remove('hidden');
    } else if (tab === 'spin') {
        spinTab.classList.add('active', 'border-white');
        spinTab.classList.remove('border-transparent');
        spinContent.classList.remove('hidden');
        // Initialize wheel and check cooldown (functions from spin-wheel.js)
        if (typeof initWheel === 'function') {
            initWheel();
        }
        if (typeof checkSpinCooldown === 'function') {
            checkSpinCooldown();
        }
    } else if (tab === 'donate') {
        donateTab.classList.add('active', 'border-white');
        donateTab.classList.remove('border-transparent');
        donateContent.classList.remove('hidden');
    } else if (tab === 'sponsor') {
        sponsorTab.classList.add('active', 'border-white');
        sponsorTab.classList.remove('border-transparent');
        sponsorContent.classList.remove('hidden');
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const alertContent = document.getElementById('alertContent');
    const headers = document.querySelectorAll('header, footer');
    const borders = document.querySelectorAll('.border-gray-800');

    if (theme === 'light') {
        body.classList.remove('bg-black', 'text-white');
        body.classList.add('bg-white', 'text-black');

        if (alertContent) {
            alertContent.classList.remove('bg-white', 'text-black', 'border-gray-200');
            alertContent.classList.add('bg-black', 'text-white', 'border-gray-800');
        }

        headers.forEach(el => {
            el.classList.remove('border-gray-800');
            el.classList.add('border-gray-300');
        });

        borders.forEach(el => {
            el.classList.remove('border-gray-800');
            el.classList.add('border-gray-300');
        });

        const progressBg = document.querySelector('.bg-gray-700');
        if (progressBg) {
            progressBg.classList.remove('bg-gray-700');
            progressBg.classList.add('bg-gray-300');
        }

        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.classList.remove('bg-white');
            progressFill.classList.add('bg-black');
        }

        if (faucetBalance) {
            faucetBalance.classList.remove('text-white');
            faucetBalance.classList.add('text-black');
        }

        themeToggle.classList.remove('hover:bg-gray-700');
        themeToggle.classList.add('hover:bg-gray-200');

        logoutBtn.classList.remove('hover:text-white');
        logoutBtn.classList.add('hover:text-black');

        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    } else {
        body.classList.remove('bg-white', 'text-black');
        body.classList.add('bg-black', 'text-white');

        if (alertContent) {
            alertContent.classList.remove('bg-black', 'text-white', 'border-gray-800');
            alertContent.classList.add('bg-white', 'text-black', 'border-gray-200');
        }

        headers.forEach(el => {
            el.classList.remove('border-gray-300');
            el.classList.add('border-gray-700');
        });

        document.querySelectorAll('.border-gray-300').forEach(el => {
            el.classList.remove('border-gray-300');
            el.classList.add('border-gray-700');
        });

        const progressBg = document.querySelector('.bg-gray-300');
        if (progressBg) {
            progressBg.classList.remove('bg-gray-300');
            progressBg.classList.add('bg-gray-700');
        }

        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.classList.remove('bg-black');
            progressFill.classList.add('bg-white');
        }

        if (faucetBalance) {
            faucetBalance.classList.remove('text-black');
            faucetBalance.classList.add('text-white');
        }

        themeToggle.classList.remove('hover:bg-gray-200');
        themeToggle.classList.add('hover:bg-gray-700');

        logoutBtn.classList.remove('hover:text-black');
        logoutBtn.classList.add('hover:text-white');

        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    }

    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Logout Function
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to disconnect your wallet?')) {
        disconnectWallet();
    }
});

function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    userAddress = null;

    if (balanceRefreshInterval) {
        clearInterval(balanceRefreshInterval);
        balanceRefreshInterval = null;
    }

    connectSection.classList.remove('hidden');
    walletSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    faucetBalance.textContent = '--';
    watchAdBtn.disabled = false;
    watchAdBtn.textContent = 'Watch Ad (5 remaining)';

    showAlert('Disconnected from app. To fully disconnect, go to MetaMask settings.', 'info');
}

// Connect Wallet Function
connectBtn.addEventListener('click', connectWallet);

async function connectWallet() {
    try {
        if (!window.ethereum) {
            showAlert('Please install MetaMask to use this faucet! Visit https://metamask.io', 'error');
            return;
        }

        showAlert('Connecting wallet...', 'info');

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== CONFIG.SEPOLIA_CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CONFIG.SEPOLIA_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [SEPOLIA_NETWORK],
                        });
                    } catch (addError) {
                        showAlert('Failed to add Sepolia network', 'error');
                        return;
                    }
                } else {
                    showAlert('Please switch to Sepolia Testnet', 'error');
                    return;
                }
            }
        }

        userAddress = accounts[0];
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // Expose to global scope for spin-wheel.js
        window.contract = contract;
        window.signer = signer;
        window.userAddress = userAddress;

        walletAddress.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        connectSection.classList.add('hidden');
        walletSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');

        showAlert('Wallet connected successfully', 'success');

        fetchFaucetBalance();
        balanceRefreshInterval = setInterval(fetchFaucetBalance, CONFIG.BALANCE_REFRESH_INTERVAL);

        await checkUserClaimInfo();

    } catch (error) {
        console.error('Connection error:', error);
        showAlert('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Fetch Faucet Balance
async function fetchFaucetBalance() {
    try {
        if (!contract) {
            faucetBalance.textContent = '--';
            return;
        }

        const balance = await contract.getBalance();
        const balanceInEth = ethers.formatEther(balance);
        faucetBalance.textContent = parseFloat(balanceInEth).toFixed(4) + ' ETH';
    } catch (error) {
        console.error('Balance fetch error:', error);
        faucetBalance.textContent = 'Error';
    }
}

// Check User Claim Information
async function checkUserClaimInfo() {
    try {
        if (!contract || !userAddress) return;
        
        const claimInfo = await contract.getUserClaimInfo(userAddress);
        const lastClaimTime = Number(claimInfo[0]);
        const claimsToday = Number(claimInfo[1]);
        
        console.log('User claim info:', {
            lastClaimTime: lastClaimTime,
            claimsToday: claimsToday
        });
        
        const dailyLimit = await contract.dailyLimit();
        const cooldown = await contract.cooldown();
        const currentTime = Math.floor(Date.now() / 1000);
        
        const timeSinceLastClaim = currentTime - lastClaimTime;
        const cooldownRemaining = Number(cooldown) - timeSinceLastClaim;
        
        if (lastClaimTime > 0 && cooldownRemaining > 0) {
            const hours = Math.floor(cooldownRemaining / 3600);
            const minutes = Math.floor((cooldownRemaining % 3600) / 60);
            watchAdBtn.disabled = true;
            watchAdBtn.textContent = `Cooldown: ${hours}h ${minutes}m remaining`;
            showAlert(`Please wait ${hours}h ${minutes}m before claiming again`, 'info');
            return false;
        }
        
        if (claimsToday >= dailyLimit && currentTime < lastClaimTime + 86400) {
            watchAdBtn.disabled = true;
            watchAdBtn.textContent = 'Daily limit reached';
            showAlert('Daily claim limit reached. Come back tomorrow!', 'info');
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error('Error fetching claim info:', error);
        return true;
    }
}

// Watch Ad Button Handler
watchAdBtn.addEventListener('click', async () => {
    const canClaim = await checkUserClaimInfo();
    if (!canClaim) {
        return;
    }
    
    const currentCount = getAdsWatched();
    
    if (currentCount >= CONFIG.REQUIRED_ADS) {
        showAlert('You have already watched all required ads!', 'info');
        return;
    }

    if (typeof displayAd === 'function') {
        displayAd();
    } else {
        showAlert('Ad system initializing...', 'info');
        setTimeout(() => {
            onAdCompleted();
        }, 3000);
    }
});

// Update Ad Progress UI
function updateAdProgress() {
    const watched = getAdsWatched();
    const percentage = (watched / CONFIG.REQUIRED_ADS) * 100;
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = watched;
    adsRemaining.textContent = CONFIG.REQUIRED_ADS - watched;

    if (watched >= CONFIG.REQUIRED_ADS) {
        claimBtn.disabled = false;
        claimBtn.textContent = 'Claim Reward';
        watchAdBtn.disabled = true;
        watchAdBtn.textContent = 'All Ads Completed';
    } else {
        claimBtn.disabled = true;
        watchAdBtn.disabled = false;
        watchAdBtn.textContent = `Watch Ad (${CONFIG.REQUIRED_ADS - watched} remaining)`;
    }
}

// Called when an ad is successfully watched
function onAdCompleted() {
    incrementAdsWatched();
    updateAdProgress();
    showAlert('Ad watched successfully! Progress updated.', 'success');
}

// Claim Reward Button Handler
claimBtn.addEventListener('click', async () => {
    try {
        if (!contract) {
            showAlert('Please connect your wallet first', 'error');
            return;
        }

        const adsWatched = getAdsWatched();
        if (adsWatched < CONFIG.REQUIRED_ADS) {
            showAlert(`Please watch all ${CONFIG.REQUIRED_ADS} ads before claiming`, 'error');
            return;
        }

        claimBtn.disabled = true;
        claimBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div> Processing...';
        showAlert('Confirm transaction in MetaMask', 'info');

        const tx = await contract.claimReward();
        showAlert('Transaction submitted! Waiting for confirmation...', 'info');
        
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);
        
        showAlert(`Successfully claimed ${CONFIG.REWARD_AMOUNT} ETH`, 'success');
        
        resetAdsWatched();
        updateAdProgress();
        
        setTimeout(() => {
            fetchFaucetBalance();
            checkUserClaimInfo();
        }, 3000);

    } catch (error) {
        console.error('Claim error:', error);
        let errorMsg = 'Claim failed: ';
        
        if (error.message.includes('user rejected')) {
            errorMsg += 'Transaction rejected by user';
        } else if (error.message.includes('insufficient funds')) {
            errorMsg += 'Faucet has insufficient funds';
        } else if (error.message.includes('daily limit')) {
            errorMsg += 'Daily claim limit reached. Try again tomorrow!';
        } else if (error.message.includes('Too soon')) {
            errorMsg += 'Please wait before claiming again';
        } else {
            errorMsg += error.reason || error.message;
        }
        
        showAlert(errorMsg, 'error');
        
    } finally {
        claimBtn.disabled = false;
        claimBtn.textContent = 'Claim Reward';
    }
});

// LocalStorage Helper Functions
function getAdsWatched() {
    return parseInt(localStorage.getItem(CONFIG.STORAGE_KEY) || '0');
}

function incrementAdsWatched() {
    const current = getAdsWatched();
    if (current < CONFIG.REQUIRED_ADS) {
        localStorage.setItem(CONFIG.STORAGE_KEY, (current + 1).toString());
    }
}

function resetAdsWatched() {
    localStorage.setItem(CONFIG.STORAGE_KEY, '0');
}

// Alert Helper Function
function showAlert(message, type) {
    alertText.textContent = message;
    alertBox.classList.remove('hidden');
    
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, CONFIG.ALERT_DURATION);
}

// Handle MetaMask Events
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            showAlert('Wallet disconnected. Please reconnect.', 'info');
            setTimeout(() => location.reload(), 2000);
        } else {
            showAlert('Account changed. Reconnecting...', 'info');
            setTimeout(() => connectWallet(), 1000);
        }
    });

    window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed to:', chainId);
        location.reload();
    });

    window.ethereum.on('disconnect', () => {
        showAlert('Connection lost. Please refresh the page.', 'error');
    });
}

// Donate Functionality
function setDonateAmount(amount) {
    const donateAmountInput = document.getElementById('donateAmount');
    if (donateAmountInput) {
        donateAmountInput.value = amount;
    }
}

// Make it global for onclick
window.setDonateAmount = setDonateAmount;

// Donate Button Handler
document.addEventListener('DOMContentLoaded', () => {
    const donateBtn = document.getElementById('donateBtn');
    const donateAmountInput = document.getElementById('donateAmount');
    const donateStatus = document.getElementById('donateStatus');
    
    if (donateBtn) {
        donateBtn.addEventListener('click', async () => {
            try {
                if (!signer || !userAddress) {
                    showAlert('Please connect your wallet first', 'error');
                    return;
                }

                const amount = parseFloat(donateAmountInput.value);
                
                if (!amount || amount <= 0) {
                    showAlert('Please enter a valid amount', 'error');
                    return;
                }

                if (amount < 0.001) {
                    showAlert('Minimum donation is 0.001 ETH', 'error');
                    return;
                }

                donateBtn.disabled = true;
                donateBtn.innerHTML = '<div class="loading-spinner inline-block mr-2"></div> Processing...';
                donateStatus.textContent = 'Preparing transaction...';

                // Convert to Wei
                const amountInWei = ethers.parseEther(amount.toString());

                // Send transaction to contract
                const tx = await signer.sendTransaction({
                    to: CONFIG.CONTRACT_ADDRESS,
                    value: amountInWei
                });

                donateStatus.textContent = 'Transaction submitted! Waiting for confirmation...';
                showAlert('Transaction submitted! Waiting for confirmation...', 'info');

                await tx.wait();

                donateStatus.textContent = `✓ Successfully donated ${amount} ETH! Thank you!`;
                showAlert(`Thank you for donating ${amount} ETH! 💝`, 'success');

                // Clear input
                donateAmountInput.value = '';

                // Refresh balance
                setTimeout(fetchFaucetBalance, 3000);

            } catch (error) {
                console.error('Donation error:', error);
                let errorMsg = 'Donation failed: ';

                if (error.message.includes('user rejected')) {
                    errorMsg += 'Transaction rejected';
                } else if (error.message.includes('insufficient funds')) {
                    errorMsg += 'Insufficient funds in your wallet';
                } else {
                    errorMsg += error.message;
                }

                showAlert(errorMsg, 'error');
                donateStatus.textContent = 'Donation failed. Please try again.';

            } finally {
                donateBtn.disabled = false;
                donateBtn.textContent = 'Send Donation';
            }
        });
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (balanceRefreshInterval) {
        clearInterval(balanceRefreshInterval);
    }
});
