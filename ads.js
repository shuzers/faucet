// Ad Integration Module
// This file handles all ad-related functionality

// Ad Configuration
const AD_CONFIG = {
    // PopAds Configuration
    POPADS_ENABLED: true,
    POPADS_SITE_ID: 729268868310, // Your PopAds Site ID
    POPADS_WEBSITE_ID: 5249384, // Your website ID
    POPADS_API_KEY: '97c71a4825eae4a5d17707c9e40eed5dda9d50a2', // Replace with your actual API key

    // Ad Timing
    AD_MINIMUM_DURATION: 5000, // Minimum time ad must be open (5 seconds)
    AD_COMPLETION_DELAY: 1000, // Delay before counting as watched

    // Auto-detect environment
    DEMO_MODE: isLocalhost() // Automatically use demo mode on localhost
};

// Check if running on localhost
function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname === '' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.includes('local');
}

// Ad State
let adWindow = null;
let adStartTime = null;
let adTimerInterval = null;

// Initialize Ad System
function initializeAdSystem() {
    console.log('Ad system initialized');

    if (AD_CONFIG.POPADS_ENABLED && !AD_CONFIG.DEMO_MODE) {
        loadPopAdsScript();
    }
}

// Load your PopAds script
function loadPopAdsScript() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('data-cfasync', 'false');
    script.innerHTML = `
        (function(){
            var p=window,
            e="c0957e80ec0d84f7f2a0a6174c04f446",
            q=[
                ["siteId",${AD_CONFIG.POPADS_SITE_ID}],
                ["minBid",0],
                ["popundersPerIP","0"],
                ["delayBetween",0],
                ["default",false],
                ["defaultPerDay",0],
                ["topmostLayer","auto"]
            ],
            h=["d3d3LnZpc2FyaW9tZWRpYS5jb20venVSTmZkL2Vib290c3RyYXAtZGF0ZXRpbWVwaWNrZXIubWluLmpz","ZDEzazdwcmF4MXlpMDQuY2xvdWRmcm9udC5uZXQvWGUvdFdWL3Bjc3NvYmoubWluLmNzcw=="],
            u=-1,z,m,
            g=function(){
                clearTimeout(m);
                u++;
                if(h[u]&&!(1787546725000<(new Date).getTime()&&1<u)){
                    z=p.document.createElement("script");
                    z.type="text/javascript";
                    z.async=!0;
                    var j=p.document.getElementsByTagName("script")[0];
                    z.src="https://"+atob(h[u]);
                    z.crossOrigin="anonymous";
                    z.onerror=g;
                    z.onload=function(){
                        clearTimeout(m);
                        p[e.slice(0,16)+e.slice(0,16)]||g()
                    };
                    m=setTimeout(g,5E3);
                    j.parentNode.insertBefore(z,j)
                }
            };
            if(!p[e]){
                try{
                    Object.freeze(p[e]=q)
                }catch(e){}
                g()
            }
        })();
    `;
    document.head.appendChild(script);
    console.log('PopAds script loaded');
}

// Load PopAds Script Dynamically
function loadPopAdsScript() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    // PopAds script format (replace with your actual PopAds code)
    script.innerHTML = `
        var _pop = _pop || [];
        _pop.push(['siteId', ${AD_CONFIG.POPADS_SITE_ID}]);
        _pop.push(['minBid', 0]);
        _pop.push(['popundersPerIP', 1]);
        _pop.push(['delayBetween', 0]);
        _pop.push(['default', false]);
        _pop.push(['defaultPerDay', 0]);
        _pop.push(['topmostLayer', false]);
        (function() {
            var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
            var s = document.getElementsByTagName('script')[0]; 
            pa.src = '//c1.popads.net/pop.js';
            pa.onerror = function() {console.error('PopAds script failed to load');};
            s.parentNode.insertBefore(pa, s);
        })();
    `;

    document.head.appendChild(script);
    console.log('PopAds script loaded');
}

// Display Ad Function
function displayAd() {
    console.log('Display ad called. Demo mode:', AD_CONFIG.DEMO_MODE, 'Hostname:', window.location.hostname);
    
    // On localhost: use YouTube ads for testing
    if (AD_CONFIG.DEMO_MODE) {
        console.log('Using YouTube ads (localhost detected)');
        if (typeof getRandomAd === 'function') {
            displayYouTubeAd();
        } else {
            displayDemoAd();
        }
        return;
    }
    
    // On production: use PopAds
    if (AD_CONFIG.POPADS_ENABLED && !AD_CONFIG.DEMO_MODE) {
        console.log('Using PopAds (production domain detected)');
        displayPopAd();
        return;
    }
    
    // Fallback
    displayDemoAd();
}

// YouTube Ad Display
function displayYouTubeAd() {
    const adContainer = document.getElementById('adContainer');

    if (!adContainer) {
        console.error('Ad container not found');
        return;
    }

    const adVideo = getRandomAd();
    const embedUrl = `https://www.youtube.com/embed/${adVideo.id}?autoplay=1&controls=0&modestbranding=1&rel=0`;

    // Create YouTube ad content
    adContainer.innerHTML = `
        <div class="p-8 space-y-6 relative">
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
                <h3 class="text-xl font-light">Watch Advertisement</h3>
                <button onclick="closeAd()" class="text-gray-400 hover:text-black transition-colors" disabled id="closeAdBtn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="${embedUrl}" 
                        frameborder="0" 
                        allow="autoplay; encrypted-media" 
                        allowfullscreen
                        id="youtubePlayer">
                    </iframe>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-light mb-2" id="adTimer">${adVideo.duration}</div>
                    <p class="text-gray-600">Please watch for <span id="adCountdown">${adVideo.duration}</span> seconds</p>
                </div>
            </div>
        </div>
    `;

    adContainer.classList.remove('hidden');
    adContainer.classList.add('flex');
    adStartTime = Date.now();

    // Start countdown timer
    let countdown = adVideo.duration;
    const countdownElement = document.getElementById('adCountdown');
    const timerElement = document.getElementById('adTimer');
    const closeBtn = document.getElementById('closeAdBtn');

    adTimerInterval = setInterval(() => {
        countdown--;
        if (countdownElement) countdownElement.textContent = countdown;
        if (timerElement) timerElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(adTimerInterval);
            if (timerElement) timerElement.textContent = '✓';
            if (closeBtn) {
                closeBtn.disabled = false;
                closeBtn.classList.add('text-black', 'hover:text-gray-600');
            }
        }
    }, 1000);
}

// Demo Ad Display (for testing)
function displayDemoAd() {
    const adContainer = document.getElementById('adContainer');

    if (!adContainer) {
        console.error('Ad container not found');
        return;
    }

    // Create demo ad content
    adContainer.innerHTML = `
        <div class="p-8 space-y-6">
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
                <h3 class="text-xl font-light">Advertisement</h3>
                <button onclick="closeAd()" class="text-gray-400 hover:text-black transition-colors" disabled id="closeAdBtn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="text-center py-12 space-y-6">
                <div class="text-6xl font-light" id="adTimer">5</div>
                <p class="text-gray-600">Please wait <span id="adCountdown">5</span> seconds</p>
                <p class="text-sm text-gray-400">Demo ad - In production, real ads will display here</p>
            </div>
        </div>
    `;

    adContainer.classList.remove('hidden');
    adContainer.classList.add('flex');
    adStartTime = Date.now();

    // Start countdown timer
    let countdown = 5;
    const countdownElement = document.getElementById('adCountdown');
    const timerElement = document.getElementById('adTimer');
    const closeBtn = document.getElementById('closeAdBtn');

    adTimerInterval = setInterval(() => {
        countdown--;
        if (countdownElement) countdownElement.textContent = countdown;
        if (timerElement) timerElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(adTimerInterval);
            if (timerElement) timerElement.textContent = '✓';
            if (closeBtn) {
                closeBtn.disabled = false;
                closeBtn.classList.add('text-black', 'hover:text-gray-600');
            }
        }
    }, 1000);
}

// Display PopAds (Production)
function displayPopAd() {
    adStartTime = Date.now();
    console.log('PopAds triggered');

    // Check if PopAds is loaded
    const popAdsKey = "c0957e80ec0d84f7f2a0a6174c04f446";
    if (!window[popAdsKey]) {
        console.warn('PopAds not loaded yet, falling back to YouTube ads');
        if (typeof getRandomAd === 'function') {
            displayYouTubeAd();
        } else {
            displayDemoAd();
        }
        return;
    }

    // PopAds will automatically trigger a popunder
    // Show a message
    if (typeof showAlert === 'function') {
        showAlert('Ad will open in a new window. Please wait 5 seconds...', 'info');
    }

    // Try to trigger a click event to help PopAds fire
    // PopAds usually triggers on user interaction
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    document.body.dispatchEvent(clickEvent);

    // Wait minimum duration then count as watched
    setTimeout(() => {
        const adDuration = Date.now() - adStartTime;
        if (adDuration >= AD_CONFIG.AD_MINIMUM_DURATION) {
            if (typeof onAdCompleted === 'function') {
                onAdCompleted();
            }
        }
    }, AD_CONFIG.AD_MINIMUM_DURATION);
}

// Handle Ad Close
function closeAd() {
    const adDuration = Date.now() - adStartTime;

    if (adTimerInterval) {
        clearInterval(adTimerInterval);
    }

    const adContainer = document.getElementById('adContainer');
    if (adContainer) {
        adContainer.classList.add('hidden');
        adContainer.classList.remove('flex');
        adContainer.innerHTML = '';
    }

    // Check if ad was watched for minimum duration
    if (adDuration >= AD_CONFIG.AD_MINIMUM_DURATION) {
        setTimeout(() => {
            if (typeof onAdCompleted === 'function') {
                onAdCompleted();
            }
        }, AD_CONFIG.AD_COMPLETION_DELAY);
    } else {
        if (typeof showAlert === 'function') {
            showAlert('Please watch the ad for at least 5 seconds', 'error');
        }
    }
}

// Handle Ad Window Closed (for PopAds)
function handleAdClosed() {
    const adDuration = Date.now() - adStartTime;

    console.log('Ad window closed after', adDuration, 'ms');

    // Check if ad was watched for minimum duration
    if (adDuration >= AD_CONFIG.AD_MINIMUM_DURATION) {
        setTimeout(() => {
            if (typeof onAdCompleted === 'function') {
                onAdCompleted();
            }
        }, AD_CONFIG.AD_COMPLETION_DELAY);
    } else {
        if (typeof showAlert === 'function') {
            showAlert('Please watch the ad for at least 5 seconds.', 'error');
        }
    }
}

// Alternative: Iframe-based Ad Display
function displayIframeAd() {
    const adContainer = document.getElementById('adContainer');

    if (!adContainer) {
        console.error('Ad container not found');
        return;
    }

    adStartTime = Date.now();

    // Create iframe for ad
    adContainer.innerHTML = `
        <div class="ad-frame">
            <button class="ad-close" onclick="closeAd()" id="closeAdBtn" style="display:none;">
                ✕ Close Ad
            </button>
            <iframe 
                src="YOUR_AD_URL_HERE" 
                style="width: 100%; height: 100%; border: none; border-radius: 10px;"
                sandbox="allow-scripts allow-same-origin allow-popups"
            ></iframe>
        </div>
    `;

    adContainer.classList.add('active');

    // Enable close button after minimum duration
    setTimeout(() => {
        const closeBtn = document.getElementById('closeAdBtn');
        if (closeBtn) {
            closeBtn.style.display = 'block';
        }
    }, AD_CONFIG.AD_MINIMUM_DURATION);
}

// PopAds Integration Functions
// These functions handle PopAds-specific events

// Called by PopAds when ad is served
function onPopAdsServed() {
    console.log('PopAds: Ad served');
    adStartTime = Date.now();
}

// Called by PopAds when ad is closed/completed
function onPopAdsCompleted() {
    console.log('PopAds: Ad completed');
    const adDuration = Date.now() - adStartTime;

    if (adDuration >= AD_CONFIG.AD_MINIMUM_DURATION) {
        if (typeof onAdCompleted === 'function') {
            onAdCompleted();
        }
    }
}

// Called by PopAds on error
function onPopAdsError(error) {
    console.error('PopAds error:', error);
    if (typeof showAlert === 'function') {
        showAlert('Ad failed to load. Please try again.', 'error');
    }
}

// Alternative Ad Networks Integration Examples

// Example: Google AdSense Integration
function initializeAdSense() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

// Example: PropellerAds Integration
function initializePropellerAds() {
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//yourcdnlink.com/script.js';
    document.body.appendChild(script);
}

// Example: Custom Ad Network Integration
function displayCustomAd(adUrl) {
    window.open(adUrl, '_blank', 'width=800,height=600');
    adStartTime = Date.now();

    // Track ad completion (you'll need to implement tracking mechanism)
    setTimeout(() => {
        if (typeof onAdCompleted === 'function') {
            onAdCompleted();
        }
    }, 10000); // Assume ad watched after 10 seconds
}

// Ad Analytics and Tracking
const AdAnalytics = {
    totalAdsServed: 0,
    totalAdsCompleted: 0,
    totalAdsFailed: 0,

    trackAdServed() {
        this.totalAdsServed++;
        console.log('Analytics: Ads served -', this.totalAdsServed);
    },

    trackAdCompleted() {
        this.totalAdsCompleted++;
        console.log('Analytics: Ads completed -', this.totalAdsCompleted);

        // Send to your analytics service
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_completed', {
                'event_category': 'ads',
                'event_label': 'faucet_ad',
                'value': 1
            });
        }
    },

    trackAdFailed(reason) {
        this.totalAdsFailed++;
        console.log('Analytics: Ads failed -', this.totalAdsFailed, reason);
    },

    getStats() {
        return {
            served: this.totalAdsServed,
            completed: this.totalAdsCompleted,
            failed: this.totalAdsFailed,
            completionRate: this.totalAdsServed > 0
                ? (this.totalAdsCompleted / this.totalAdsServed * 100).toFixed(2) + '%'
                : '0%'
        };
    }
};

// Ad Blocker Detection
function detectAdBlocker() {
    // Create a bait element
    const bait = document.createElement('div');
    bait.className = 'ad banner advertisement';
    bait.style.height = '1px';
    document.body.appendChild(bait);

    setTimeout(() => {
        if (bait.offsetHeight === 0) {
            console.warn('Ad blocker detected');
            if (typeof showAlert === 'function') {
                showAlert('Please disable your ad blocker to use this faucet.', 'error');
            }
        }
        document.body.removeChild(bait);
    }, 100);
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdSystem);
} else {
    initializeAdSystem();
}

// Detect ad blockers
setTimeout(detectAdBlocker, 1000);

// Export functions for use in app.js
window.displayAd = displayAd;
window.closeAd = closeAd;
window.AdAnalytics = AdAnalytics;

// PopAds callback functions (if needed)
window.onPopAdsServed = onPopAdsServed;
window.onPopAdsCompleted = onPopAdsCompleted;
window.onPopAdsError = onPopAdsError;