// Slot machine game logic
class SlotMachine {
    constructor() {
      // Game state
      this.state = {
        credits: 1000,
        currentBet: 5,
        minBet: 1,
        maxBet: 100,
        betIncrement: 1,
        lastWin: 0,
        activePaylines: 6, // Reduced to 6 paylines
        reels: [],
        isSpinning: false,
        winningSymbols: [],
        winningLines: [],
        totalSymbols: 80, // Total number of unique symbols in the game
        isAutoSpinning: false,
        autoSpinRemaining: 0,
        autoSpinOptions: [5, 10, 25, 50, 100]
      };
      
      // Constants
      this.REEL_COUNT = 6;
      this.SYMBOLS_PER_REEL = 4;
      this.SPIN_DURATION = 2000; // in milliseconds
      this.TARGET_RTP = 0.50; // Target Return to Player: 50%
      
      // Elements will be initialized in the init() method
      this.elements = {};
    }
    
    // Initialize the game
    init() {
      // Cache DOM elements after they are loaded
      this.elements = {
        reelsContainer: document.getElementById('reels-container'),
        creditsValue: document.getElementById('credits-value'),
        lastWinValue: document.getElementById('last-win-value'),
        linesValue: document.getElementById('lines-value'),
        currentBet: document.getElementById('current-bet'),
        spinButton: document.getElementById('spin-button'),
        betIncrease: document.getElementById('bet-increase'),
        betDecrease: document.getElementById('bet-decrease'),
        betMin: document.getElementById('bet-min'),
        betMax: document.getElementById('bet-max'),
        winOverlay: document.getElementById('win-overlay'),
        winAmount: document.getElementById('win-amount'),
        paylineOverlay: document.getElementById('paylines-overlay'),
        paytableButton: document.getElementById('paytable-button'),
        paytableModal: document.getElementById('paytable-modal'),
        closeModalButton: document.querySelector('.close-button'),
        autoSpinButton: document.getElementById('auto-spin-button'),
        autoSpinOptions: document.getElementById('auto-spin-options'),
        autoSpinCount: document.getElementById('auto-spin-count'),
        autoSpinStatus: document.getElementById('auto-spin-status'),
        stopAutoSpinButton: document.getElementById('stop-auto-spin-button')
      };
      
      this.initReels();
      this.updateUI();
      this.setupEventListeners();
      this.populatePaytable();
    }
    
    // Initialize the reels with random symbols
    initReels() {
      // Clear existing reels
      this.elements.reelsContainer.innerHTML = '';
      this.state.reels = [];
      
      // Create reels
      for (let i = 0; i < this.REEL_COUNT; i++) {
        const reelElement = document.createElement('div');
        reelElement.className = 'reel';
        reelElement.id = `reel-${i}`;
        
        const reelSymbols = this.getRandomSymbols(this.SYMBOLS_PER_REEL);
        this.state.reels.push(reelSymbols);
        
        // Create symbol elements
        reelSymbols.forEach((symbol, symbolIndex) => {
          const symbolElement = document.createElement('div');
          symbolElement.className = 'symbol';
          symbolElement.id = `symbol-${i}-${symbolIndex}`;
          symbolElement.textContent = symbol.emoji;
          
          // Add data attributes for easy access
          symbolElement.dataset.type = symbol.type;
          symbolElement.dataset.name = symbol.name;
          
          reelElement.appendChild(symbolElement);
        });
        
        this.elements.reelsContainer.appendChild(reelElement);
      }
    }
    
    // Get random symbols for a reel using weighted selection to achieve 50% RTP
    getRandomSymbols(count) {
      const result = [];
      
      for (let i = 0; i < count; i++) {
        // Use weighted selection for better RTP control
        const symbolPool = [];
        
        // Add wild with its weight
        symbolPool.push({
          symbol: symbolsConfig.wild,
          weight: symbolsConfig.wild.weight
        });
        
        // Add scatter with its weight
        symbolPool.push({
          symbol: symbolsConfig.scatter,
          weight: symbolsConfig.scatter.weight
        });
        
        // Add all regular symbols with their weights
        const regularSymbols = Object.values(symbolsConfig.regular);
        regularSymbols.forEach(symbol => {
          symbolPool.push({
            symbol: symbol,
            weight: symbol.weight
          });
        });
        
        // Calculate total weight
        const totalWeight = symbolPool.reduce((sum, item) => sum + item.weight, 0);
        
        // Generate a random value between 0 and totalWeight
        const randomValue = Math.random() * totalWeight;
        
        // Find the selected symbol based on weight
        let weightSum = 0;
        let selectedSymbol = null;
        
        for (const item of symbolPool) {
          weightSum += item.weight;
          if (randomValue <= weightSum) {
            selectedSymbol = item.symbol;
            break;
          }
        }
        
        // If somehow we didn't select a symbol (shouldn't happen), select a random one
        if (!selectedSymbol) {
          const randomIndex = Math.floor(Math.random() * symbolPool.length);
          selectedSymbol = symbolPool[randomIndex].symbol;
        }
        
        result.push(selectedSymbol);
      }
      
      return result;
    }
    
    // Update the UI to reflect the current game state
    updateUI() {
      // Update credit and bet displays
      this.elements.creditsValue.textContent = this.state.credits;
      this.elements.lastWinValue.textContent = this.state.lastWin;
      this.elements.linesValue.textContent = this.state.activePaylines;
      this.elements.currentBet.textContent = this.state.currentBet;
      
      // Update button states
      const canIncreaseBet = this.state.currentBet < this.state.maxBet && this.state.credits >= this.state.currentBet + this.state.betIncrement;
      const canDecreaseBet = this.state.currentBet > this.state.minBet;
      const canSpin = this.state.credits >= this.state.currentBet && !this.state.isSpinning;
      
      this.elements.betIncrease.disabled = !canIncreaseBet || this.state.isSpinning || this.state.isAutoSpinning;
      this.elements.betDecrease.disabled = !canDecreaseBet || this.state.isSpinning || this.state.isAutoSpinning;
      this.elements.betMin.disabled = !canDecreaseBet || this.state.isSpinning || this.state.isAutoSpinning;
      this.elements.betMax.disabled = !canIncreaseBet || this.state.isSpinning || this.state.isAutoSpinning;
      this.elements.spinButton.disabled = !canSpin || this.state.isAutoSpinning;
      
      // Update auto spin status
      if (this.elements.autoSpinStatus) {
        if (this.state.isAutoSpinning) {
          this.elements.autoSpinStatus.classList.add('active');
          this.elements.autoSpinCount.textContent = this.state.autoSpinRemaining;
        } else {
          this.elements.autoSpinStatus.classList.remove('active');
          this.elements.autoSpinCount.textContent = '0';
        }
      }
      
      // Update button visuals
      if (this.state.isSpinning) {
        this.elements.spinButton.classList.add('spinning');
      } else {
        this.elements.spinButton.classList.remove('spinning');
      }
      
      // Update auto spin button visual state
      if (this.elements.autoSpinButton) {
        if (this.state.isAutoSpinning) {
          this.elements.autoSpinButton.classList.add('active');
        } else {
          this.elements.autoSpinButton.classList.remove('active');
        }
      }
    }
    
    // Setup event listeners for the game controls
    setupEventListeners() {
      this.elements.spinButton.addEventListener('click', () => this.spin());
      this.elements.betIncrease.addEventListener('click', () => this.adjustBet('increase'));
      this.elements.betDecrease.addEventListener('click', () => this.adjustBet('decrease'));
      this.elements.betMin.addEventListener('click', () => this.setBet('min'));
      this.elements.betMax.addEventListener('click', () => this.setBet('max'));
      this.elements.paytableButton.addEventListener('click', () => this.togglePaytable(true));
      this.elements.closeModalButton.addEventListener('click', () => this.togglePaytable(false));
      
      // Setup autospin button
      this.elements.autoSpinButton.addEventListener('click', () => this.toggleAutoSpinOptions());
      
      // Setup autospin options
      if (this.elements.autoSpinOptions) {
        this.state.autoSpinOptions.forEach(count => {
          const optionButton = document.createElement('button');
          optionButton.className = 'auto-spin-option';
          optionButton.textContent = count;
          optionButton.addEventListener('click', () => this.startAutoSpin(count));
          this.elements.autoSpinOptions.appendChild(optionButton);
        });
      }
      
      // Setup stop autospin button
      if (this.elements.stopAutoSpinButton) {
        this.elements.stopAutoSpinButton.addEventListener('click', () => this.stopAutoSpin());
      }
      
      // Close paytable when clicking outside
      window.addEventListener('click', (event) => {
        if (event.target === this.elements.paytableModal) {
          this.togglePaytable(false);
        }
        
        // Also close auto spin options if clicked outside
        if (this.elements.autoSpinOptions && 
            event.target !== this.elements.autoSpinOptions && 
            event.target !== this.elements.autoSpinButton &&
            !this.elements.autoSpinOptions.contains(event.target)) {
          this.elements.autoSpinOptions.classList.remove('show');
        }
      });
    }
    
    // Adjust the bet amount
    adjustBet(action) {
      if (this.state.isSpinning) return;
      
      if (action === 'increase' && this.state.currentBet < this.state.maxBet) {
        this.state.currentBet += this.state.betIncrement;
      } else if (action === 'decrease' && this.state.currentBet > this.state.minBet) {
        this.state.currentBet -= this.state.betIncrement;
      }
      
      this.updateUI();
    }
    
    // Set bet to min or max
    setBet(type) {
      if (this.state.isSpinning) return;
      
      if (type === 'min') {
        this.state.currentBet = this.state.minBet;
      } else if (type === 'max') {
        // Set to max bet or the maximum affordable
        this.state.currentBet = Math.min(this.state.maxBet, Math.floor(this.state.credits));
      }
      
      this.updateUI();
    }
    
    // Spin the reels
    spin() {
      if (this.state.isSpinning || this.state.credits < this.state.currentBet) return;
      
      // Deduct bet
      this.state.credits -= this.state.currentBet;
      this.state.lastWin = 0;
      this.state.isSpinning = true;
      this.state.winningSymbols = [];
      this.state.winningLines = [];
      
      // Reset any previous win classes
      document.querySelectorAll('.symbol.winning').forEach(el => {
        el.classList.remove('winning');
      });
      
      // Reset paylines
      document.querySelectorAll('.payline').forEach(el => {
        el.classList.remove('active');
      });
      
      // Hide win overlay
      this.elements.winOverlay.classList.remove('show');
      
      this.updateUI();
      
      // Animate reels
      this.animateReels().then(() => {
        // Generate new symbols
        this.state.reels = [];
        for (let i = 0; i < this.REEL_COUNT; i++) {
          this.state.reels.push(this.getRandomSymbols(this.SYMBOLS_PER_REEL));
        }
        
        // Update the DOM to show new symbols
        this.updateReelsDOM();
        
        // Check for wins
        this.checkWins();
        
        // End spinning state
        this.state.isSpinning = false;
        this.updateUI();
        
        // Continue auto spinning if needed
        if (this.state.isAutoSpinning && this.state.autoSpinRemaining > 0) {
          this.state.autoSpinRemaining--;
          
          // Update autospin count display
          if (this.elements.autoSpinCount) {
            this.elements.autoSpinCount.textContent = this.state.autoSpinRemaining;
          }
          
          // If we have spins remaining and enough credits, queue up the next spin
          if (this.state.autoSpinRemaining > 0 && this.state.credits >= this.state.currentBet) {
            setTimeout(() => this.spin(), 1000);
          } else {
            // Otherwise stop auto spinning
            this.stopAutoSpin();
          }
        }
      });
    }
    
    // Animate the reels spinning - simplified version
    animateReels() {
      return new Promise(resolve => {
        const reels = Array.from(document.querySelectorAll('.reel'));
        const durations = [];
        
        // Set staggered durations for each reel
        reels.forEach((_, index) => {
          durations[index] = this.SPIN_DURATION + index * 200; // Staggered stops
        });
        
        // Add spinning class to all reels for visual effects
        reels.forEach(reel => reel.classList.add('spinning'));
        
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          let allDone = true;
          
          reels.forEach((reel, reelIndex) => {
            if (elapsed < durations[reelIndex]) {
              allDone = false;
              
              // Animate symbols
              const symbols = Array.from(reel.querySelectorAll('.symbol'));
              symbols.forEach(symbol => {
                // Simple vertical movement based on time
                const offset = (elapsed * (0.4 + reelIndex * 0.1)) % 400;
                symbol.style.transform = `translateY(${offset}px)`;
              });
            } else {
              // Reset transformations when complete
              reel.classList.remove('spinning');
              const symbols = Array.from(reel.querySelectorAll('.symbol'));
              symbols.forEach(symbol => {
                symbol.style.transform = '';
              });
            }
          });
          
          if (allDone) {
            resolve();
          } else {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      });
    }
    
    // Update the DOM to show new symbols
    updateReelsDOM() {
      for (let i = 0; i < this.REEL_COUNT; i++) {
        const reel = document.getElementById(`reel-${i}`);
        reel.innerHTML = ''; // Clear existing symbols
        
        this.state.reels[i].forEach((symbol, symbolIndex) => {
          const symbolElement = document.createElement('div');
          symbolElement.className = 'symbol';
          symbolElement.id = `symbol-${i}-${symbolIndex}`;
          symbolElement.textContent = symbol.emoji;
          
          // Add data attributes for easy access
          symbolElement.dataset.type = symbol.type;
          symbolElement.dataset.name = symbol.name;
          
          reel.appendChild(symbolElement);
        });
      }
    }
    
    // Check for winning combinations
    checkWins() {
      const result = this.checkWinningCombinations(
        this.state.reels,
        this.state.currentBet,
        this.state.activePaylines
      );
      
      this.state.lastWin = result.winAmount;
      this.state.winningLines = result.winningLines;
      this.state.winningSymbols = result.winningSymbols;
      
      // Add win amount to credits
      this.state.credits += result.winAmount;
      
      // Update UI with win
      this.updateUI();
      
      // Show winning symbols
      this.highlightWinningSymbols();
      
      // Show win animation if there's a win
      if (result.winAmount > 0) {
        this.showWinAnimation(result.winAmount);
      }
    }
    
    // Check for winning combinations across paylines - adjusted for 50% RTP
    checkWinningCombinations(reels, betAmount, totalPaylines) {
      let totalWin = 0;
      const winningLines = [];
      const winningSymbols = [];
      
      // RTP adjustment factor (50%)
      const rtpFactor = 0.50;
      
      // Check each payline
      for (let lineIndex = 0; lineIndex < totalPaylines; lineIndex++) {
        const payline = paylinePatterns[lineIndex];
        
        // Get symbols on this payline
        const symbolsOnLine = [];
        
        for (let reelIndex = 0; reelIndex < reels.length; reelIndex++) {
          const symbolIndex = Math.floor(payline.positions[reelIndex] * reels[reelIndex].length);
          symbolsOnLine.push(reels[reelIndex][symbolIndex]);
        }
        
        // Check for winning combinations
        const { win, count, symbol } = this.evaluatePaylineWin(symbolsOnLine);
        
        if (win > 0) {
          // Apply RTP factor to the win amount
          const adjustedWin = win * rtpFactor;
          totalWin += adjustedWin * (betAmount / totalPaylines);
          winningLines.push(lineIndex);
          
          // Record winning symbol positions
          for (let i = 0; i < count; i++) {
            const reelIndex = i;
            const symbolIndex = Math.floor(payline.positions[i] * reels[i].length);
            winningSymbols.push({ reelIndex, symbolIndex });
          }
        }
      }
      
      // Check for scatter wins (these pay anywhere, not just on paylines)
      const scatterCount = reels.reduce((count, reel) => {
        return count + reel.filter(symbol => symbol.type === 'scatter').length;
      }, 0);
      
      if (scatterCount >= 3) {
        // Scatter wins are multiplied by total bet
        // Apply RTP factor to scatter wins as well
        const scatterWin = scatterCount * betAmount * 5 * rtpFactor;
        totalWin += scatterWin;
        
        // Mark scatter symbols as winning
        reels.forEach((reel, reelIndex) => {
          reel.forEach((symbol, symbolIndex) => {
            if (symbol.type === 'scatter') {
              winningSymbols.push({ reelIndex, symbolIndex });
            }
          });
        });
      }
      
      // Higher RTP chance for larger number of symbols
      // This helps maintain 50% RTP with 80 symbols
      const randomBonus = Math.random();
      if (randomBonus < 0.05 && totalWin > 0) {
        totalWin *= 1.1; // Occasional 10% bonus to maintain target RTP
      }
      
      return {
        winAmount: Math.floor(totalWin),
        winningLines,
        winningSymbols,
      };
    }
    
    // Evaluate a single payline for wins - adjusted for 80 symbols
    evaluatePaylineWin(symbols) {
      // Start from the leftmost symbol
      const firstSymbol = symbols[0];
      let currentCount = 1;
      
      // Count consecutive matching symbols from left to right
      for (let i = 1; i < symbols.length; i++) {
        const currentSymbol = symbols[i];
        
        // If current symbol matches the first or is wild, increment count
        if (
          currentSymbol.type === firstSymbol.type || 
          currentSymbol.type === 'wild' ||
          (firstSymbol.type !== 'scatter' && firstSymbol.type !== 'wild' && currentSymbol.type === 'wild')
        ) {
          currentCount++;
        } else {
          break;
        }
      }
      
      // Determine win amount based on symbol type and count
      let winAmount = 0;
      if (currentCount >= 2) {
        if (firstSymbol.type === 'wild') {
          // Wild symbol wins - slightly increased due to larger symbol pool
          if (currentCount === 2) winAmount = 10;
          else if (currentCount === 3) winAmount = 50;
          else if (currentCount === 4) winAmount = 200;
          else if (currentCount === 5) winAmount = 500;
          else if (currentCount === 6) winAmount = 1000;
        } else if (firstSymbol.type === 'scatter') {
          // Scatter wins are handled separately
          winAmount = 0;
        } else {
          // Regular symbol wins
          const payoutIndex = currentCount - 2;
          if (payoutIndex >= 0 && payoutIndex < firstSymbol.payouts.length) {
            winAmount = firstSymbol.payouts[payoutIndex];
            
            // For lower paying symbols, apply small RTP boost to maintain 50% 
            // with higher number of symbols
            if (winAmount < 10 && Math.random() < 0.1) {
              winAmount++;
            }
          }
        }
      }
      
      return {
        win: winAmount,
        count: currentCount,
        symbol: currentCount >= 2 ? firstSymbol : null,
      };
    }
    
    // Highlight winning symbols on the reels
    highlightWinningSymbols() {
      // Reset any previous highlights
      document.querySelectorAll('.symbol.winning').forEach(el => {
        el.classList.remove('winning');
      });
      
      // Highlight new winning symbols
      this.state.winningSymbols.forEach(({ reelIndex, symbolIndex }) => {
        const symbolElement = document.getElementById(`symbol-${reelIndex}-${symbolIndex}`);
        if (symbolElement) {
          symbolElement.classList.add('winning');
        }
      });
      
      // Show active paylines
      this.showActivePaylines();
    }
    
    // Show active paylines with clear visualization of winning symbols
    showActivePaylines() {
      // Clear previous paylines
      this.elements.paylineOverlay.innerHTML = '';
      
      // First, clear any previous win-label elements
      document.querySelectorAll('.win-label').forEach(el => el.remove());
      
      // Add new paylines with clear identification
      this.state.winningLines.forEach((lineIndex, index) => {
        const payline = paylinePatterns[lineIndex];
        
        // Create colored connector between winning symbols
        const paylineElement = document.createElement('div');
        
        // Add different classes based on pattern type
        let lineClass = 'payline active';
        if (lineIndex < 4) {
          lineClass += ' horizontal';
        } else {
          lineClass += ' special';
        }
        
        paylineElement.className = lineClass;
        paylineElement.style.top = `${payline.position}%`;
        
        // Add pattern indicator
        const patternIndicator = document.createElement('div');
        patternIndicator.className = 'pattern-indicator';
        patternIndicator.textContent = lineIndex < 4 ? 'Row ' + (lineIndex + 1) : 'Pattern ' + (lineIndex + 1);
        paylineElement.appendChild(patternIndicator);
        
        this.elements.paylineOverlay.appendChild(paylineElement);
        
        // Get the winning symbol count (how many symbols in a row actually won)
        const winningSymbolsOnThisLine = this.state.winningSymbols.filter(ws => {
          const symbolPosition = payline.positions[ws.reelIndex];
          const symbolIndexOnReel = Math.floor(symbolPosition * this.SYMBOLS_PER_REEL);
          return symbolIndexOnReel === ws.symbolIndex;
        });
        
        // Label each winning symbol on this payline
        const winCount = winningSymbolsOnThisLine.length;
        
        // Create win connector to visually link winning symbols
        if (winCount > 0) {
          // For each winning symbol on this payline, add visual indicator
          for (let reelIndex = 0; reelIndex < winCount; reelIndex++) {
            const symbolIndex = Math.floor(payline.positions[reelIndex] * this.SYMBOLS_PER_REEL);
            const symbolElement = document.getElementById(`symbol-${reelIndex}-${symbolIndex}`);
            
            if (symbolElement) {
              // Add number label to show winning sequence
              const winLabel = document.createElement('div');
              winLabel.className = 'win-label';
              winLabel.textContent = `${index + 1}`; // Show which payline number
              
              // Use different color based on payline type
              if (lineIndex < 4) {
                winLabel.classList.add('horizontal');
              } else if (lineIndex === 4) {
                winLabel.classList.add('pattern5');
              } else {
                winLabel.classList.add('pattern6');
              }
              
              symbolElement.appendChild(winLabel);
              
              // Ensure winning class is applied 
              symbolElement.classList.add('winning');
              
              // Add animation to draw attention to winning symbols
              setTimeout(() => {
                symbolElement.classList.add('highlight');
                
                // Remove highlight after a delay for next animation
                setTimeout(() => {
                  symbolElement.classList.remove('highlight');
                }, 500);
              }, reelIndex * 150);
            }
          }
        }
      });
      
      // Add winning symbol information display
      if (this.state.winningSymbols.length > 0) {
        // Get unique winning symbols to display information
        const uniqueWinningSymbols = new Set();
        this.state.winningSymbols.forEach(({reelIndex, symbolIndex}) => {
          if (reelIndex < this.state.reels.length && symbolIndex < this.state.reels[reelIndex].length) {
            const symbol = this.state.reels[reelIndex][symbolIndex];
            uniqueWinningSymbols.add(symbol.emoji);
          }
        });
        
        // Create winning symbol info display
        const winSymbolInfo = document.createElement('div');
        winSymbolInfo.className = 'win-symbol-info';
        winSymbolInfo.innerHTML = '<div class="win-symbol-title">Winning Symbols:</div>';
        
        uniqueWinningSymbols.forEach(emoji => {
          const symbolDisplay = document.createElement('div');
          symbolDisplay.className = 'win-symbol-display';
          symbolDisplay.textContent = emoji;
          winSymbolInfo.appendChild(symbolDisplay);
        });
        
        // Add to the overlay
        this.elements.paylineOverlay.appendChild(winSymbolInfo);
      }
    }
    
    // Show win animation with confetti for big wins
    showWinAnimation(winAmount) {
      // Set the win amount
      this.elements.winAmount.textContent = winAmount;
      
      // Display the win overlay
      this.elements.winOverlay.classList.add('show');
      
      // Determine if this is a big win
      const isBigWin = winAmount >= this.state.currentBet * 10;
      const isHugeWin = winAmount >= this.state.currentBet * 50;
      const isMegaWin = winAmount >= this.state.currentBet * 100;
      
      // Add classes based on win size
      if (isBigWin) {
        this.elements.winOverlay.classList.add('big-win');
        
        // For big wins, show confetti!
        if (typeof confetti !== 'undefined') {
          // Configure confetti based on win size
          if (isMegaWin) {
            // Mega win (100x bet or more) - extreme confetti!
            confetti.configure({
              particleCount: 300,
              duration: 7000,
              spread: 180,
              colors: [
                '#FFD700', // More gold
                '#FFA500', 
                '#FF8C00',
                '#FFD700',
                '#FFDF00',
                '#FFFF00',
                '#F0E68C',
                '#FFFF00',
                '#FFD700',
              ]
            });
          } else if (isHugeWin) {
            // Huge win (50x bet or more) - lots of confetti
            confetti.configure({
              particleCount: 200,
              duration: 6000
            });
          } else {
            // Regular big win (10x bet or more) - standard confetti
            confetti.configure({
              particleCount: 150,
              duration: 5000
            });
          }
          
          // Start the confetti
          confetti.start();
          
          // Add congratulatory message to title bar
          const winType = isMegaWin ? "MEGA WIN" : (isHugeWin ? "HUGE WIN" : "BIG WIN");
          document.title = `🎰 ${winType}! ${winAmount} 🎰`;
        }
      } else {
        // Normal win
        this.elements.winOverlay.classList.remove('big-win');
        document.title = "🎰 WIN! " + winAmount + " 🎰";
      }
      
      // Simple pulse animation for the win amount
      this.elements.winAmount.classList.add('pulse');
      setTimeout(() => {
        this.elements.winAmount.classList.remove('pulse');
      }, 1000);
      
      // Hide after a delay, longer for bigger wins
      const displayDuration = isMegaWin ? 7000 : (isHugeWin ? 6000 : (isBigWin ? 5000 : 2500));
      
      setTimeout(() => {
        this.elements.winOverlay.classList.remove('show');
        this.elements.winOverlay.classList.remove('big-win');
        document.title = "Food Frenzy Slots";
        
        // If confetti is still running, stop it
        if (typeof confetti !== 'undefined' && confetti.isAnimating) {
          confetti.stop();
        }
      }, displayDuration);
    }
    
    // Toggle paytable visibility
    togglePaytable(show) {
      if (show) {
        this.elements.paytableModal.classList.add('show');
      } else {
        this.elements.paytableModal.classList.remove('show');
      }
    }
    
    // Toggle auto spin options visibility
    toggleAutoSpinOptions() {
      if (this.state.isAutoSpinning) {
        this.stopAutoSpin();
        return;
      }
      
      if (this.elements.autoSpinOptions) {
        this.elements.autoSpinOptions.classList.toggle('show');
      }
    }
    
    // Start auto spinning
    startAutoSpin(count) {
      if (this.state.isSpinning || this.state.isAutoSpinning) return;
      
      // Set auto spinning state
      this.state.isAutoSpinning = true;
      this.state.autoSpinRemaining = count;
      
      // Hide the options
      if (this.elements.autoSpinOptions) {
        this.elements.autoSpinOptions.classList.remove('show');
      }
      
      // Update UI
      this.updateUI();
      
      // Start spinning
      this.spin();
    }
    
    // Stop auto spinning
    stopAutoSpin() {
      this.state.isAutoSpinning = false;
      this.state.autoSpinRemaining = 0;
      
      // Update UI
      this.updateUI();
    }
    
    // Populate the paytable with symbols and payouts - optimized for 80 symbols
    populatePaytable() {
      const symbolsGrid = document.querySelector('.symbols-grid');
      const paylinesGrid = document.querySelector('.paylines-grid');
      
      // Clear existing content
      symbolsGrid.innerHTML = '';
      paylinesGrid.innerHTML = '';
      
      // Add wild and scatter (special symbols)
      [symbolsConfig.wild, symbolsConfig.scatter].forEach(symbol => {
        const symbolItem = document.createElement('div');
        symbolItem.className = 'symbol-item special';
        
        const symbolEmoji = document.createElement('div');
        symbolEmoji.className = 'symbol-emoji';
        symbolEmoji.textContent = symbol.emoji;
        
        const symbolName = document.createElement('div');
        symbolName.className = 'symbol-name';
        symbolName.textContent = symbol.type.toUpperCase();
        
        const symbolDescription = document.createElement('div');
        symbolDescription.className = 'symbol-description';
        symbolDescription.textContent = symbol.type === 'wild' 
          ? 'Substitutes for any symbol except scatter' 
          : '3+ triggers bonus';
        
        symbolItem.appendChild(symbolEmoji);
        symbolItem.appendChild(symbolName);
        symbolItem.appendChild(symbolDescription);
        
        symbolsGrid.appendChild(symbolItem);
      });
      
      // Add symbol category explanation for the 80 symbols
      const categoryExplanation = document.createElement('div');
      categoryExplanation.className = 'category-explanation';
      categoryExplanation.innerHTML = `
        <h3>FOOD FRENZY SLOTS</h3>
        <p>This game features ${this.state.totalSymbols} unique food emoji symbols organized in groups:</p>
        <ul>
          <li>High Value: Rare and exotic food items</li>
          <li>Medium Value: Common restaurant dishes</li>
          <li>Low Value: Everyday food items</li>
        </ul>
        <p>Target RTP: ${this.TARGET_RTP * 100}%</p>
      `;
      symbolsGrid.appendChild(categoryExplanation);
      
      // Add only the high value regular symbols (to avoid cluttering with 80 symbols)
      const highValueSymbols = Object.values(symbolsConfig.regular)
        .filter(symbol => symbol.payouts[0] >= 10) // Filter only high-value symbols
        .slice(0, 8); // Show maximum 8 examples
      
      highValueSymbols.forEach(symbol => {
        const symbolItem = document.createElement('div');
        symbolItem.className = 'symbol-item';
        
        const symbolEmoji = document.createElement('div');
        symbolEmoji.className = 'symbol-emoji';
        symbolEmoji.textContent = symbol.emoji;
        
        const symbolName = document.createElement('div');
        symbolName.className = 'symbol-name';
        symbolName.textContent = symbol.name;
        
        const symbolPayout = document.createElement('div');
        symbolPayout.className = 'symbol-payout';
        
        // Add payout values
        symbol.payouts.forEach((payout, index) => {
          const multiplier = document.createElement('div');
          multiplier.className = 'symbol-multiplier';
          multiplier.textContent = `${index + 2}x`;
          
          const value = document.createElement('div');
          value.className = 'symbol-value';
          value.textContent = payout;
          
          symbolPayout.appendChild(multiplier);
          symbolPayout.appendChild(value);
        });
        
        symbolItem.appendChild(symbolEmoji);
        symbolItem.appendChild(symbolName);
        symbolItem.appendChild(symbolPayout);
        
        symbolsGrid.appendChild(symbolItem);
      });
      
      // Add paylines information
      const paylinesInfo = document.createElement('div');
      paylinesInfo.className = 'paylines-info';
      paylinesInfo.innerHTML = `
        <h3>PAYLINES</h3>
        <p>This game features ${this.state.activePaylines} paylines for maximum winning opportunities!</p>
        <p>• 4 horizontal lines (one on each row)</p>
        <p>• 2 special patterns following the diagram (patterns 5 & 6)</p>
      `;
      paylinesGrid.appendChild(paylinesInfo);
      
      // Add all 6 paylines with enhanced visual representation
      paylinePatterns.forEach((pattern, index) => {
        const paylineItem = document.createElement('div');
        paylineItem.className = 'payline-item';
        
        // Create a more visual representation of the payline pattern
        if (index < 4) {
          // For horizontal paylines (first 4)
          const paylineVisual = document.createElement('div');
          paylineVisual.className = 'payline-visual horizontal';
          paylineVisual.style.top = `${pattern.position}%`;
          paylineItem.appendChild(paylineVisual);
        } else {
          // For special patterns (5 and 6), create a more detailed visual
          const patternContainer = document.createElement('div');
          patternContainer.className = 'pattern-container';
          
          // Create a 4x6 grid representation of the reels
          for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
              const cell = document.createElement('div');
              cell.className = 'pattern-cell';
              
              // Highlight cells that are part of this pattern
              if (index === 4) { // Pattern 5
                // Mark positions based on the diagram
                if ((row === 0 && col === 0) || 
                    (row === 0 && col === 2) || 
                    (row === 1 && col === 1) || 
                    (row === 1 && col === 3) || 
                    (row === 1 && col === 4) || 
                    (row === 2 && col === 4) || 
                    (row === 3 && col === 5)) {
                  cell.classList.add('pattern5');
                  cell.textContent = '5';
                }
              } else if (index === 5) { // Pattern 6
                // Mark positions based on the diagram
                if ((row === 0 && col === 5) || 
                    (row === 1 && col === 4) || 
                    (row === 2 && col === 1) || 
                    (row === 2 && col === 3) || 
                    (row === 3 && col === 0) || 
                    (row === 3 && col === 2)) {
                  cell.classList.add('pattern6');
                  cell.textContent = '6';
                }
              }
              
              patternContainer.appendChild(cell);
            }
          }
          
          paylineItem.appendChild(patternContainer);
        }
        
        const paylineNumber = document.createElement('div');
        paylineNumber.className = 'payline-number';
        
        // Change the label based on pattern type
        if (index < 4) {
          paylineNumber.textContent = `Horizontal ${index + 1}`;
        } else {
          paylineNumber.textContent = `Pattern ${index + 1}`;
        }
        
        paylineItem.appendChild(paylineNumber);
        paylinesGrid.appendChild(paylineItem);
      });
      
      // Add additional information about RTP
      const rtpInfo = document.createElement('div');
      rtpInfo.className = 'rtp-info';
      rtpInfo.innerHTML = `
        <p>Return to Player: ${this.TARGET_RTP * 100}% - This means that for every 100 credits wagered, players can expect to win back ${this.TARGET_RTP * 100} credits on average over time.</p>
      `;
      paylinesGrid.appendChild(rtpInfo);
    }
  }