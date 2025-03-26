/**
 * Animations module for Fortune Dragon Slot Machine
 * Handles reel spinning animations and visual effects
 */

/**
 * Animates the spinning of a reel in the given direction
 * @param {Element} reelElement - The reel DOM element to animate
 * @param {String} direction - Either 'clockwise' or 'counter-clockwise'
 * @param {Number} duration - Spin duration in milliseconds
 * @param {Number} endPosition - Final position in pixels for the reel strip
 * @returns {Promise} - Resolves when animation completes
 */
function animateReelSpin(reelElement, direction, duration, endPosition) {
    return new Promise((resolve) => {
        const reelStrip = reelElement.querySelector('.reel-strip');
        
        // Reset any existing transforms
        reelStrip.style.transition = 'none';
        
        // Apply initial position for continuous effect
        if (direction === 'clockwise') {
            reelStrip.style.transform = 'translateY(0)';
        } else {
            reelStrip.style.transform = 'translateY(0)';
        }
        
        // Force reflow to ensure the reset takes effect
        void reelStrip.offsetWidth;
        
        // Apply spinning animation
        reelStrip.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        reelStrip.style.transform = `translateY(${endPosition}px)`;
        
        // Detect when animation completes
        reelStrip.addEventListener('transitionend', function onTransitionEnd() {
            reelStrip.removeEventListener('transitionend', onTransitionEnd);
            resolve();
        }, { once: true });
    });
}

/**
 * Creates a bouncing effect at the end of a reel spin
 * @param {Element} reelElement - The reel DOM element
 * @param {Number} finalPosition - Final position in pixels
 * @returns {Promise} - Resolves when bounce animation completes
 */
function animateReelBounce(reelElement, finalPosition) {
    return new Promise((resolve) => {
        const reelStrip = reelElement.querySelector('.reel-strip');
        
        // Small bounce up
        reelStrip.style.transition = 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        reelStrip.style.transform = `translateY(${finalPosition - 20}px)`;
        
        setTimeout(() => {
            // Bounce back to final position
            reelStrip.style.transition = 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)';
            reelStrip.style.transform = `translateY(${finalPosition}px)`;
            
            setTimeout(() => {
                resolve();
            }, 150);
        }, 150);
    });
}

/**
 * Highlights winning cells in the grid
 * @param {Array} positions - Array of [column, row] positions to highlight
 * @param {NodeList} cells - NodeList of all cell elements
 */
function highlightWinningCells(positions, cells) {
    // First, remove any existing highlights
    cells.forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    // Add highlight class to winning cells
    positions.forEach(([col, row]) => {
        const index = row * 6 + col; // Calculate index in the flat cells array
        if (cells[index]) {
            cells[index].classList.add('highlight');
        }
    });
}

/**
 * Creates and displays a notification
 * @param {String} type - Notification type: 'win', 'lose', or 'info'
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {Number} duration - How long to display the notification (ms)
 */
function showNotification(type, title, message, duration = 4000) {
    const notificationsContainer = document.getElementById('notifications');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create close button
    const closeButton = document.createElement('span');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Create title
    const titleElement = document.createElement('div');
    titleElement.className = 'notification-title';
    titleElement.textContent = title;
    
    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    
    // Assemble notification
    notification.appendChild(closeButton);
    notification.appendChild(titleElement);
    notification.appendChild(messageElement);
    
    // Add to container
    notificationsContainer.appendChild(notification);
    
    // Set up auto-removal
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    return notification;
}

/**
 * Removes a notification with a fade-out animation
 * @param {Element} notification - The notification element to remove
 */
function removeNotification(notification) {
    notification.style.animation = 'fadeOut 0.3s forwards';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Shakes the slot machine container on loss
 * @param {Element} container - The slot machine container element
 * @returns {Promise} - Resolves when animation completes
 */
function shakeSlotMachine(container) {
    return new Promise((resolve) => {
        container.style.animation = 'none';
        void container.offsetWidth; // Trigger reflow
        container.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        setTimeout(() => {
            container.style.animation = '';
            resolve();
        }, 500);
    });
}

/**
 * Creates a fireworks celebration effect on big wins
 * @param {Element} container - The slot machine container element
 * @param {Number} duration - Duration in milliseconds
 */
function celebrateWin(container, duration = 3000) {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks-container';
    fireworksContainer.style.position = 'absolute';
    fireworksContainer.style.top = '0';
    fireworksContainer.style.left = '0';
    fireworksContainer.style.width = '100%';
    fireworksContainer.style.height = '100%';
    fireworksContainer.style.overflow = 'hidden';
    fireworksContainer.style.pointerEvents = 'none';
    fireworksContainer.style.zIndex = '100';
    
    container.appendChild(fireworksContainer);
    
    // Create multiple fireworks
    const colors = ['#d4af37', '#ff5722', '#e91e63', '#673ab7', '#2196f3'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFirework(fireworksContainer, colors[Math.floor(Math.random() * colors.length)]);
        }, i * 200);
    }
    
    // Remove fireworks container after duration
    setTimeout(() => {
        if (fireworksContainer.parentNode) {
            container.removeChild(fireworksContainer);
        }
    }, duration);
}

/**
 * Creates a single firework particle
 * @param {Element} container - Container to add the firework to
 * @param {String} color - Color of the firework
 */
function createFirework(container, color) {
    const firework = document.createElement('div');
    
    // Position randomly
    const x = Math.random() * 100;
    const y = 20 + Math.random() * 60; // Keep within the middle section
    
    firework.style.position = 'absolute';
    firework.style.left = `${x}%`;
    firework.style.top = `${y}%`;
    firework.style.width = '6px';
    firework.style.height = '6px';
    firework.style.borderRadius = '50%';
    firework.style.backgroundColor = color;
    firework.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
    
    container.appendChild(firework);
    
    // Create explosion after a short delay
    setTimeout(() => {
        // Remove initial firework
        if (firework.parentNode) {
            container.removeChild(firework);
        }
        
        // Create explosion particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 5px ${color}`;
            
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 2 + Math.random() * 5;
            const duration = 500 + Math.random() * 1000;
            
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.transition = `all ${duration}ms cubic-bezier(0.075, 0.82, 0.165, 1)`;
            
            container.appendChild(particle);
            
            // Force reflow
            void particle.offsetWidth;
            
            // Set explosion animation
            particle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}vw), calc(-50% + ${Math.sin(angle) * distance}vh))`;
            particle.style.opacity = '0';
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    container.removeChild(particle);
                }
            }, duration);
        }
    }, 200);
}

/**
 * Creates CSS keyframes animation for shake effect if it doesn't exist
 */
function createShakeAnimation() {
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animations when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createShakeAnimation();
});
