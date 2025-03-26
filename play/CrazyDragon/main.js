/**
 * Fortune Dragon Slot Machine
 * Main game logic and initialization
 */

// Game configuration
const CONFIG = {
    reels: 6,
    rows: 3,
    minNumber: 0,
    maxNumber: 32,
    initialBalance: 1000,
    defaultBet: 10,
    minBet: 1,
    maxBet: 100,
    betStep: 1,
    spinDuration: 3000,
    autoSpinInterval: 2000,
    autoSpinAmounts: [25, 50, 100],
    storageKey: 'fortuneDragonSlots',
    rtp: 0.9 // 90% Return to Player rate
};

// Emoji mapping for numbers
const EMOJI_MAP = {
    0: '🍘', // Rice Cracker
    1: '🥮', // Moon Cake
    2: '🐉', // Dragon
    3: '🏮', // Red Lantern
    4: '🎋', // Tanabata Tree
    5: '🧧', // Red Envelope
    6: '🐼', // Panda
    7: '🍵', // Tea
    8: '🐟', // Fish
    9: '🌸', // Cherry Blossom
    10: '🦇', // Bat
    11: '🥟', // Dumpling
    12: '🐅', // Tiger
    13: '🏯', // Japanese Castle
    14: '🎏', // Carp Streamer
    15: '🧨', // Firecracker
    16: '🍚', // Cooked Rice
    17: '🐍', // Snake
    18: '🦋', // Butterfly
    19: '🌕', // Full Moon
    20: '🐓', // Rooster
    21: '🍊', // Tangerine
    22: '🐎', // Horse
    23: '🥢', // Chopsticks
    24: '🌊', // Water Wave
    25: '🐖', // Pig
    26: '🦅', // Eagle
    27: '🍜', // Steaming Bowl
    28: '🐇', // Rabbit
    29: '🌟', // Star
    30: '🦜', // Parrot
    31: '🥚', // Egg
    32: '💮'  // White Flower
};

// Game state
let gameState = {
    balance: CONFIG.initialBalance,
    currentBet: CONFIG.defaultBet,
    isSpinning: false,
    isAutoSpinActive: false,
    autoSpinCount: 0,
    selectedAutoSpinAmount: 0,
    reelResults: Array(CONFIG.reels).fill().map(() => Array(CONFIG.rows).fill(0)),
    winningPaylines: [],
    showPaylines: false
};

// DOM elements
let elements = {};

/**
 * Initializes the game
 */
function initGame() {
    // Cache DOM elements
    cacheElements();
    
    // Load saved state if available
    loadGameState();
    
    // Initialize reels
    initReels();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI with initial values
    updateUI();
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
    elements = {
        reels: Array.from(document.querySelectorAll('.reel')),
        reelStrips: Array.from(document.querySelectorAll('.reel-strip')),
        resultCells: document.querySelector('.result-cells'),
        balance: document.getElementById('balance'),
        betAmount: document.getElementById('bet-amount'),
        spinButton: document.getElementById('spin-btn'),
        autoSpinButton: document.getElementById('auto-spin-btn'),
        increaseBetButton: document.getElementById('increase-bet'),
        decreaseBetButton: document.getElementById('decrease-bet'),
        paylinesOverlay: document.getElementById('paylines-overlay'),
        paylineItems: document.querySelectorAll('.payline-item'),
        slotContainer: document.querySelector('.slot-container'),
        paylinesInfo: document.querySelector('.paylines-info'),
        paylinesGuideButton: document.getElementById('paylines-guide-btn')
    };
}

/**
 * Load game state from local storage
 */
function loadGameState() {
    const savedState = localStorage.getItem(CONFIG.storageKey);
    
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            gameState.balance = parsedState.balance || CONFIG.initialBalance;
            gameState.currentBet = parsedState.currentBet || CONFIG.defaultBet;
        } catch (e) {
            console.error('Error loading saved game state:', e);
            // Use default values if there's an error
            gameState.balance = CONFIG.initialBalance;
            gameState.currentBet = CONFIG.defaultBet;
        }
    }
}

/**
 * Save current game state to local storage
 */
function saveGameState() {
    const stateToSave = {
        balance: gameState.balance,
        currentBet: gameState.currentBet
    };
    
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(stateToSave));
}

/**
 * Initialize reels with number tiles
 */
function initReels() {
    // Create result cells
    for (let row = 0; row < CONFIG.rows; row++) {
        for (let col = 0; col < CONFIG.reels; col++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            elements.resultCells.appendChild(cell);
        }
    }
    
    // Generate number tiles for each reel
    elements.reelStrips.forEach((reelStrip, reelIndex) => {
        // Generate tiles (create more than needed for continuous spin effect)
        for (let i = 0; i < 50; i++) {
            const tile = document.createElement('div');
            tile.className = 'number-tile';
            
            // Set random number for initial display
            const num = Math.floor(Math.random() * (CONFIG.maxNumber - CONFIG.minNumber + 1)) + CONFIG.minNumber;
            
            // Set the emoji corresponding to the number
            tile.textContent = EMOJI_MAP[num];
            tile.dataset.number = num; // Keep original number in dataset for logic
            
            // Add Chinese-themed styling based on number
            styleTileBasedOnNumber(tile, num);
            
            reelStrip.appendChild(tile);
        }
    });
}

/**
 * Apply Chinese-themed styling to number tiles
 * @param {Element} tile - The tile DOM element
 * @param {Number} num - The number value
 */
function styleTileBasedOnNumber(tile, num) {
    // Determine color based on number range
    if (num % 8 === 0) {
        // Lucky 8's are gold (symbol of wealth)
        tile.style.color = '#d4af37';
        tile.style.textShadow = '0 0 5px #d4af37';
        tile.style.fontWeight = 'bold';
    } else if (num % 9 === 0) {
        // 9's are red (symbol of longevity)
        tile.style.color = '#e60000';
    } else if (num % 6 === 0) {
        // 6's are green (symbol of smooth progress)
        tile.style.color = '#00cc66';
    } else if (num % 7 === 0) {
        // 7's are purple
        tile.style.color = '#9966ff';
    } else if (num % 5 === 0) {
        // 5's are blue
        tile.style.color = '#3399ff';
    }
    
    // Add background variation
    const bgIntensity = 0.05 + (num % 5) * 0.02;
    tile.style.backgroundImage = `radial-gradient(circle, rgba(212, 175, 55, ${bgIntensity}) 10%, transparent 70%)`;
}

/**
 * Set up event listeners for game controls
 */
function setupEventListeners() {
    // Spin button
    elements.spinButton.addEventListener('click', () => {
        if (!gameState.isSpinning) {
            spin();
        }
    });
    
    // Auto-spin button
    elements.autoSpinButton.addEventListener('click', toggleAutoSpin);
    
    // Bet control buttons
    elements.increaseBetButton.addEventListener('click', () => {
        if (!gameState.isSpinning) {
            increaseBet();
        }
    });
    
    elements.decreaseBetButton.addEventListener('click', () => {
        if (!gameState.isSpinning) {
            decreaseBet();
        }
    });
    
    // Paylines guide button
    elements.paylinesGuideButton.addEventListener('click', () => {
        togglePaylinesGuide();
    });
    
    // Payline preview hover effects
    elements.paylineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!gameState.isSpinning && gameState.winningPaylines.includes(index)) {
                // Highlight this specific payline
                renderWinningPaylines([index], elements.paylinesOverlay);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            // Space to spin
            e.preventDefault();
            if (!gameState.isSpinning) {
                spin();
            }
        } else if (e.code === 'KeyA') {
            // 'A' for auto-spin
            e.preventDefault();
            toggleAutoSpin();
        }
    });
}

/**
 * Update UI elements with current game state
 */
function updateUI() {
    elements.balance.textContent = gameState.balance;
    elements.betAmount.textContent = gameState.currentBet;
    
    // Enable/disable bet controls based on limits
    elements.increaseBetButton.disabled = (
        gameState.currentBet >= CONFIG.maxBet || 
        gameState.isSpinning
    );
    
    elements.decreaseBetButton.disabled = (
        gameState.currentBet <= CONFIG.minBet || 
        gameState.isSpinning
    );
    
    // Update auto-spin button appearance
    if (gameState.isAutoSpinActive) {
        elements.autoSpinButton.textContent = 'Stop Auto';
        elements.autoSpinButton.classList.add('active');
    } else {
        elements.autoSpinButton.textContent = 'Auto Spin';
        elements.autoSpinButton.classList.remove('active');
    }
    
    // Enable/disable spin button
    elements.spinButton.disabled = (
        gameState.isSpinning || 
        gameState.balance < gameState.currentBet
    );
}

/**
 * Increase the bet amount
 */
function increaseBet() {
    const newBet = Math.min(gameState.currentBet + CONFIG.betStep, CONFIG.maxBet);
    gameState.currentBet = newBet;
    updateUI();
    saveGameState();
}

/**
 * Decrease the bet amount
 */
function decreaseBet() {
    const newBet = Math.max(gameState.currentBet - CONFIG.betStep, CONFIG.minBet);
    gameState.currentBet = newBet;
    updateUI();
    saveGameState();
}

/**
 * Toggle paylines guide visibility
 */
function togglePaylinesGuide() {
    gameState.showPaylines = !gameState.showPaylines;
    
    if (gameState.showPaylines) {
        // Create close button for paylines guide if it doesn't exist
        if (!document.querySelector('.paylines-close-btn')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'btn paylines-close-btn';
            closeButton.innerHTML = '&times;';
            closeButton.title = 'Close Paylines Guide';
            closeButton.addEventListener('click', togglePaylinesGuide);
            
            // Position it at the top right of paylines info
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.fontSize = '1.2rem';
            closeButton.style.lineHeight = '1';
            closeButton.style.backgroundColor = '#8B0000';
            closeButton.style.zIndex = '10';
            
            elements.paylinesInfo.appendChild(closeButton);
        }
        
        elements.paylinesInfo.style.display = 'block';
        elements.paylinesGuideButton.textContent = 'Hide Paylines';
        
        // Initialize the payline previews with better visibility
        initPaylinePreviews();
    } else {
        elements.paylinesInfo.style.display = 'none';
        elements.paylinesGuideButton.textContent = 'Paylines Guide';
    }
}

/**
 * Toggle auto-spin mode
 */
function toggleAutoSpin() {
    // If auto-spin is active, just turn it off
    if (gameState.isAutoSpinActive) {
        gameState.isAutoSpinActive = false;
        gameState.autoSpinCount = 0;
        updateUI();
        return;
    }
    
    // Show auto-spin options
    const autoSpinOptions = document.createElement('div');
    autoSpinOptions.className = 'auto-spin-options';
    autoSpinOptions.innerHTML = `
        <div class="auto-spin-title">Select Auto-Spin Amount</div>
        <div class="auto-spin-buttons">
            ${CONFIG.autoSpinAmounts.map(amount => 
                `<button class="btn auto-spin-amount" data-amount="${amount}">${amount}</button>`
            ).join('')}
        </div>
        <button class="btn auto-spin-cancel">Cancel</button>
    `;
    
    document.querySelector('.container').appendChild(autoSpinOptions);
    
    // Add event listeners to auto-spin amount buttons
    autoSpinOptions.querySelectorAll('.auto-spin-amount').forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            gameState.selectedAutoSpinAmount = amount;
            gameState.autoSpinCount = amount;
            gameState.isAutoSpinActive = true;
            
            // Remove the options dialog
            document.querySelector('.container').removeChild(autoSpinOptions);
            
            // Start auto-spinning
            if (!gameState.isSpinning) {
                spin();
            }
            
            updateUI();
        });
    });
    
    // Add event listener to cancel button
    autoSpinOptions.querySelector('.auto-spin-cancel').addEventListener('click', () => {
        document.querySelector('.container').removeChild(autoSpinOptions);
    });
}

/**
 * Execute a single spin
 */
async function spin() {
    // Check if player has enough balance
    if (gameState.balance < gameState.currentBet) {
        showNotification('info', 'Insufficient Balance', 'Please add more credits or decrease your bet.', 3000);
        return;
    }
    
    // Set spinning state
    gameState.isSpinning = true;
    
    // Update UI
    updateUI();
    
    // Decrease auto-spin count if active
    if (gameState.isAutoSpinActive && gameState.autoSpinCount > 0) {
        gameState.autoSpinCount--;
        
        // Update auto-spin button text to show remaining spins
        elements.autoSpinButton.textContent = `Auto: ${gameState.autoSpinCount}`;
        
        // If this was the last auto spin, deactivate auto-spin after it completes
        if (gameState.autoSpinCount === 0) {
            gameState.isAutoSpinActive = false;
        }
    }
    
    // Deduct bet amount
    gameState.balance -= gameState.currentBet;
    elements.balance.textContent = gameState.balance;
    
    // Clear previous winning paylines
    elements.paylinesOverlay.innerHTML = '';
    gameState.winningPaylines = [];
    
    // Generate new random results
    const results = generateSpinResults();
    
    // Start spinning animation for each reel
    await spinReels(results);
    
    // Check for wins
    const winnings = checkForWins(results);
    
    // Update game state and UI
    gameState.isSpinning = false;
    gameState.balance += winnings;
    
    // Save state
    saveGameState();
    
    // Update UI
    updateUI();
    
    // Show win/loss notification
    if (winnings > 0) {
        showNotification(
            'win', 
            'You Won!', 
            `You won ${winnings} credits on ${gameState.winningPaylines.length} payline${gameState.winningPaylines.length > 1 ? 's' : ''}!`,
            4000
        );
        
        // Celebrate big wins
        if (winnings >= gameState.currentBet * 3) {
            celebrateWin(elements.slotContainer, 3000);
        }
    } else {
        showNotification('lose', 'No Win', 'Better luck next time!', 2000);
        
        // Small shake animation on loss
        await shakeSlotMachine(elements.slotContainer);
    }
    
    // Continue auto-spin if active
    if (gameState.isAutoSpinActive && gameState.balance >= gameState.currentBet) {
        setTimeout(() => {
            if (gameState.isAutoSpinActive) {
                spin();
            }
        }, CONFIG.autoSpinInterval);
    } else if (gameState.isAutoSpinActive && gameState.balance < gameState.currentBet) {
        // Stop auto-spin if insufficient balance
        gameState.isAutoSpinActive = false;
        gameState.autoSpinCount = 0;
        updateUI();
        showNotification('info', 'Auto-Spin Stopped', 'Insufficient balance to continue auto-spin.', 3000);
    }
}

/**
 * Generate random results for all reels
 * @returns {Array} - 2D array of spin results [col][row]
 */
function generateSpinResults() {
    const results = Array(CONFIG.reels).fill().map(() => 
        Array(CONFIG.rows).fill().map(() => 
            Math.floor(Math.random() * (CONFIG.maxNumber - CONFIG.minNumber + 1)) + CONFIG.minNumber
        )
    );
    
    // Store results in game state
    gameState.reelResults = results;
    
    return results;
}

/**
 * Animate the spinning of all reels with the given results
 * @param {Array} results - 2D array of spin results [col][row]
 * @returns {Promise} - Resolves when all reels have stopped spinning
 */
async function spinReels(results) {
    const spinPromises = elements.reels.map(async (reel, reelIndex) => {
        // Add delay to stagger reel spins
        await new Promise(resolve => setTimeout(resolve, reelIndex * 200));
        
        const direction = reel.dataset.direction;
        const reelStrip = reel.querySelector('.reel-strip');
        
        // First, we need to position the final numbers to make sure they show up
        const tileHeight = reelStrip.firstChild.offsetHeight;
        
        // Update strip with result values (at positions that will end up visible)
        const tiles = reelStrip.querySelectorAll('.number-tile');
        
        // For each row in this reel, set the correct result value
        for (let row = 0; row < CONFIG.rows; row++) {
            // Calculate which tile will end up at this row position
            // We place the results at positions 20, 21, 22 (for a 3-row display)
            // These will be scrolled into view at the end of the animation
            const resultTileIndex = 20 + row;
            
            if (tiles[resultTileIndex]) {
                const resultValue = results[reelIndex][row];
                tiles[resultTileIndex].textContent = EMOJI_MAP[resultValue];
                tiles[resultTileIndex].dataset.number = resultValue; // Store original number
                styleTileBasedOnNumber(tiles[resultTileIndex], resultValue);
            }
        }
        
        // Calculate final position (tiles 20-22 should be visible at end)
        const finalPosition = -(tileHeight * 20);
        
        // Spin animation
        await animateReelSpin(
            reel, 
            direction, 
            CONFIG.spinDuration - (reelIndex * 120), // Slightly different durations
            finalPosition
        );
        
        // Add a small bounce effect at the end
        await animateReelBounce(reel, finalPosition);
    });
    
    // Wait for all reels to finish spinning
    await Promise.all(spinPromises);
}

/**
 * Check for winning combinations in the spin results
 * @param {Array} results - 2D array of spin results [col][row]
 * @returns {Number} - Total winnings
 */
function checkForWins(results) {
    // Get winning paylines
    gameState.winningPaylines = checkPaylines(results);
    
    // Calculate total winnings (bet amount for each winning payline),
    // adjusted for RTP (Return to Player)
    const totalWinnings = Math.floor(gameState.winningPaylines.length * gameState.currentBet * CONFIG.rtp);
    
    // Display winning paylines
    if (gameState.winningPaylines.length > 0) {
        renderWinningPaylines(gameState.winningPaylines, elements.paylinesOverlay);
        
        // Highlight winning number tiles
        highlightWinningNumbers(results, gameState.winningPaylines);
    }
    
    return totalWinnings;
}

/**
 * Highlight the winning numbers on the reels
 * @param {Array} results - 2D array of spin results
 * @param {Array} winningPaylines - Array of winning payline indices
 */
function highlightWinningNumbers(results, winningPaylines) {
    // Clear any previous highlights
    elements.reelStrips.forEach(reelStrip => {
        const tiles = reelStrip.querySelectorAll('.number-tile');
        tiles.forEach(tile => {
            tile.classList.remove('winning');
        });
    });
    
    // Collect all positions from winning paylines
    const winningPositions = new Set();
    
    winningPaylines.forEach(paylineIndex => {
        const payline = PAYLINES[paylineIndex];
        
        payline.forEach(([col, row]) => {
            winningPositions.add(`${col},${row}`);
        });
    });
    
    // Apply highlighting to visible number tiles
    elements.reelStrips.forEach((reelStrip, reelIndex) => {
        const tiles = reelStrip.querySelectorAll('.number-tile');
        
        for (let row = 0; row < CONFIG.rows; row++) {
            // Highlight numbers in winning positions (at positions 20, 21, 22)
            const tileIndex = 20 + row;
            
            if (tiles[tileIndex] && winningPositions.has(`${reelIndex},${row}`)) {
                tiles[tileIndex].classList.add('winning');
            }
        }
    });
}

// Initialize the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
