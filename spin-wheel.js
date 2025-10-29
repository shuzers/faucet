// Spin Wheel Module
// Handles all spin wheel functionality

// Configuration
const SPIN_COOLDOWN_KEY = 'last_spin_time';
const COOLDOWN_DURATION = 10 * 1000; // 10 seconds for testing (change to 24 * 60 * 60 * 1000 for production)

// Wheel state
let currentRotation = 0;
let isSpinning = false;
let winningSegment = null;

// Wheel segments configuration
const segments = [
    { text: 'Better Luck', color: '#1f2937', prize: 0 },
    { text: '0.0001 ETH', color: '#374151', prize: 0.0001 },
    { text: 'Better Luck', color: '#1f2937', prize: 0 },
    { text: '0.0005 ETH', color: '#374151', prize: 0.0005 },
    { text: 'Better Luck', color: '#1f2937', prize: 0 },
    { text: '0.001 ETH', color: '#374151', prize: 0.001 },
    { text: 'Better Luck', color: '#1f2937', prize: 0 },
    { text: 'Better Luck', color: '#374151', prize: 0 }
];

// Initialize Wheel with Canvas
function initWheel() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (!wheelCanvas) return;
    drawWheel();
    console.log('Canvas wheel initialized');
}

// Draw the wheel on canvas
function drawWheel() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (!wheelCanvas) return;

    const ctx = wheelCanvas.getContext('2d');
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = 220;
    const numSegments = segments.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    // Clear canvas
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    // Save context and rotate
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const angle = i * anglePerSegment;

        // Draw segment
        ctx.beginPath();
        ctx.arc(0, 0, radius, angle, angle + anglePerSegment);
        ctx.lineTo(0, 0);
        ctx.fillStyle = segments[i].color;
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(segments[i].text, radius * 0.7, 10);
        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Draw "SPIN" text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', 0, 5);

    ctx.restore();
}

// Check spin cooldown
function checkSpinCooldown() {
    const spinBtn = document.getElementById('spinBtn');
    const spinStatus = document.getElementById('spinStatus');

    const lastSpinTime = localStorage.getItem(SPIN_COOLDOWN_KEY);

    if (!lastSpinTime) {
        spinBtn.disabled = false;
        spinStatus.textContent = 'Free spin available!';
        return;
    }

    const timeSinceLastSpin = Date.now() - parseInt(lastSpinTime);
    const timeRemaining = COOLDOWN_DURATION - timeSinceLastSpin;

    if (timeRemaining > 0) {
        spinBtn.disabled = true;
        updateSpinCooldownDisplay(timeRemaining);
    } else {
        spinBtn.disabled = false;
        spinStatus.textContent = 'Free spin available!';
    }
}

// Update cooldown display
function updateSpinCooldownDisplay(timeRemaining) {
    const spinStatus = document.getElementById('spinStatus');
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    if (hours > 0) {
        spinStatus.textContent = `Next spin in ${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        spinStatus.textContent = `Next spin in ${minutes}m ${seconds}s`;
    } else {
        spinStatus.textContent = `Next spin in ${seconds}s`;
    }

    // Update every second for better UX
    setTimeout(() => {
        if (timeRemaining > 1000) {
            checkSpinCooldown();
        }
    }, 1000);
}

// Spin the wheel
function spinTheWheel() {
    if (isSpinning) return;

    const spinBtn = document.getElementById('spinBtn');
    const spinResult = document.getElementById('spinResult');
    const spinStatus = document.getElementById('spinStatus');

    isSpinning = true;
    spinBtn.disabled = true;
    spinResult.classList.add('hidden');
    spinStatus.textContent = 'Spinning...';

    // Randomly select a winning segment
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = (2 * Math.PI) / segments.length;

    // Calculate rotation to land on the selected segment
    const spins = 8; // Number of full rotations
    const targetSegmentAngle = randomSegmentIndex * segmentAngle;
    // Add random offset within the segment (not at edges)
    const randomOffset = (Math.random() * 0.6 + 0.2) * segmentAngle;
    const targetRotation = currentRotation + (spins * 2 * Math.PI) + (2 * Math.PI - targetSegmentAngle - randomOffset);

    // Store the winning segment
    winningSegment = segments[randomSegmentIndex];

    // Animation parameters
    const duration = 5000; // 5 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelStopped();
        }
    }

    animate();
}

// Handle wheel stopped
async function wheelStopped() {
    isSpinning = false;
    const spinResult = document.getElementById('spinResult');

    // Check if user won
    if (winningSegment.prize > 0) {
        // User won! Send them ETH
        spinResult.innerHTML = `
            <p class="text-2xl mb-2 text-green-400">🎉 Congratulations!</p>
            <p class="text-xl mb-4">You won ${winningSegment.prize} ETH!</p>
            <p class="text-gray-400 text-sm">Sending to your wallet...</p>
        `;
        spinResult.classList.remove('hidden');

        // Send ETH to user
        await sendSpinReward(winningSegment.prize);
    } else {
        // User lost
        spinResult.innerHTML = `
            <p class="text-xl mb-2">Better luck next time!</p>
            <p class="text-gray-400 text-sm">Come back in 10 seconds to spin again</p>
        `;
        spinResult.classList.remove('hidden');
        if (typeof showAlert === 'function') {
            showAlert('Better luck next time! Come back in 10 seconds', 'info');
        }
    }

    localStorage.setItem(SPIN_COOLDOWN_KEY, Date.now().toString());
    checkSpinCooldown();
}

// Send spin reward to user
async function sendSpinReward(amount) {
    try {
        // Get contract and user from global scope (set in app.js)
        if (!window.contract || !window.userAddress || !window.signer) {
            if (typeof showAlert === 'function') {
                showAlert('Wallet not connected', 'error');
            }
            return;
        }

        if (typeof showAlert === 'function') {
            showAlert('Sending reward... Please wait', 'info');
        }

        // Convert amount to Wei
        const amountInWei = ethers.parseEther(amount.toString());

        // Send transaction
        const tx = await window.signer.sendTransaction({
            to: window.userAddress,
            value: amountInWei
        });

        if (typeof showAlert === 'function') {
            showAlert('Transaction submitted! Waiting for confirmation...', 'info');
        }
        await tx.wait();

        if (typeof showAlert === 'function') {
            showAlert(`Success! ${amount} ETH sent to your wallet 🎉`, 'success');
        }

        // Update result
        const spinResult = document.getElementById('spinResult');
        spinResult.innerHTML = `
            <p class="text-2xl mb-2 text-green-400">🎉 Congratulations!</p>
            <p class="text-xl mb-4">You won ${amount} ETH!</p>
            <p class="text-green-400 text-sm">✓ Sent to your wallet successfully!</p>
        `;

        // Refresh balance
        if (typeof fetchFaucetBalance === 'function') {
            setTimeout(fetchFaucetBalance, 3000);
        }

    } catch (error) {
        console.error('Reward send error:', error);
        let errorMsg = 'Failed to send reward: ';

        if (error.message.includes('insufficient funds')) {
            errorMsg += 'Faucet has insufficient funds';
        } else if (error.message.includes('user rejected')) {
            errorMsg += 'Transaction rejected';
        } else {
            errorMsg += error.message;
        }

        if (typeof showAlert === 'function') {
            showAlert(errorMsg, 'error');
        }

        const spinResult = document.getElementById('spinResult');
        spinResult.innerHTML = `
            <p class="text-2xl mb-2 text-yellow-400">⚠️ Prize Won!</p>
            <p class="text-xl mb-4">You won ${amount} ETH!</p>
            <p class="text-red-400 text-sm">Failed to send. Please contact support.</p>
        `;
    }
}

// Initialize spin button event listener
document.addEventListener('DOMContentLoaded', () => {
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.addEventListener('click', spinTheWheel);
    }
});

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.initWheel = initWheel;
    window.checkSpinCooldown = checkSpinCooldown;
    window.spinTheWheel = spinTheWheel;
}
