// Confetti Animation System
class ConfettiSystem {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.confettiElements = [];
      this.isAnimating = false;
      this.animationId = null;
      
      // Configuration
      this.config = {
        particleCount: 150,
        particleSize: {
          min: 5,
          max: 15
        },
        speed: {
          min: 1,
          max: 5
        },
        spread: 120, // How wide the confetti spreads from the center (in degrees)
        duration: 5000, // ms
        colors: [
          '#f94144', // red
          '#f3722c', // orange
          '#f8961e', // yellow-orange
          '#f9c74f', // yellow
          '#90be6d', // green
          '#43aa8b', // teal
          '#4d908e', // cyan
          '#577590', // blue
          '#277da1', // dark blue
          '#9d4edd', // purple
          '#ff9e00', // gold
        ]
      };
    }
    
    // Initialize the canvas
    initialize() {
      // Create canvas element
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      
      // Set canvas dimensions
      this.resizeCanvas();
      
      // Get 2d context
      this.ctx = this.canvas.getContext('2d');
      
      // Add resize event listener
      window.addEventListener('resize', () => this.resizeCanvas());
      
      // Append to body
      document.body.appendChild(this.canvas);
    }
    
    // Resize canvas to match window size
    resizeCanvas() {
      if (!this.canvas) return;
      
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    
    // Create confetti particles
    createConfetti() {
      this.confettiElements = [];
      
      // Center point for confetti spread
      const centerX = this.canvas.width / 2;
      const startY = -20;
      
      // Convert spread from degrees to radians
      const spreadRad = (this.config.spread * Math.PI) / 180;
      
      for (let i = 0; i < this.config.particleCount; i++) {
        // Random properties for this particle
        const size = Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min;
        const speed = Math.random() * (this.config.speed.max - this.config.speed.min) + this.config.speed.min;
        const colorIndex = Math.floor(Math.random() * this.config.colors.length);
        
        // Calculate position based on spread
        const angle = (Math.random() * spreadRad) - (spreadRad / 2);
        const distance = Math.random() * (this.canvas.width / 2);
        const x = centerX + Math.cos(angle) * distance;
        
        // Create different confetti shapes
        const shapes = ['rect', 'circle', 'triangle', 'line'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Create particle
        this.confettiElements.push({
          x: x,
          y: startY - Math.random() * 100,
          size,
          color: this.config.colors[colorIndex],
          speed,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          shape,
          oscillationSpeed: 0.5 + Math.random(),
          oscillationDistance: 40 + Math.random() * 60,
          initialX: 0, // Will be set during first update
        });
      }
    }
    
    // Draw a single confetti particle
    drawConfetti(particle) {
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate((particle.rotation * Math.PI) / 180);
      
      this.ctx.fillStyle = particle.color;
      
      switch (particle.shape) {
        case 'rect':
          // Draw rectangle
          this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          break;
          
        case 'circle':
          // Draw circle
          this.ctx.beginPath();
          this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'triangle':
          // Draw triangle
          this.ctx.beginPath();
          this.ctx.moveTo(0, -particle.size / 2);
          this.ctx.lineTo(particle.size / 2, particle.size / 2);
          this.ctx.lineTo(-particle.size / 2, particle.size / 2);
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case 'line':
          // Draw line
          this.ctx.lineWidth = particle.size / 5;
          this.ctx.strokeStyle = particle.color;
          this.ctx.beginPath();
          this.ctx.moveTo(-particle.size / 2, 0);
          this.ctx.lineTo(particle.size / 2, 0);
          this.ctx.stroke();
          break;
          
        default:
          // Default to square
          this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      }
      
      this.ctx.restore();
    }
    
    // Update confetti animation
    update() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw each particle
      let allParticlesOffscreen = true;
      
      for (let i = 0; i < this.confettiElements.length; i++) {
        const particle = this.confettiElements[i];
        
        // Set initial X position on first update
        if (particle.initialX === 0) {
          particle.initialX = particle.x;
        }
        
        // Update position
        particle.y += particle.speed;
        particle.x = particle.initialX + Math.sin(particle.y * 0.01 * particle.oscillationSpeed) * particle.oscillationDistance;
        
        // Update rotation
        particle.rotation += particle.rotationSpeed;
        
        // Draw the particle
        this.drawConfetti(particle);
        
        // Check if particle is still visible
        if (particle.y < this.canvas.height + 20) {
          allParticlesOffscreen = false;
        }
      }
      
      // Stop animation if all particles are offscreen
      if (allParticlesOffscreen) {
        this.stop();
        return;
      }
      
      // Continue animation
      this.animationId = requestAnimationFrame(() => this.update());
    }
    
    // Start confetti animation
    start() {
      if (this.isAnimating) return;
      
      // Initialize if not already done
      if (!this.canvas) {
        this.initialize();
      }
      
      // Create confetti particles
      this.createConfetti();
      
      // Start animation
      this.isAnimating = true;
      this.update();
      
      // Auto-stop after duration
      setTimeout(() => {
        this.stop();
      }, this.config.duration);
    }
    
    // Stop confetti animation
    stop() {
      if (!this.isAnimating) return;
      
      // Cancel animation frame
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      // Clear canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      // Reset state
      this.isAnimating = false;
    }
    
    // Configure the confetti with custom options
    configure(options) {
      if (!options) return;
      
      // Merge options with defaults
      this.config = {
        ...this.config,
        ...options
      };
    }
  }
  
  // Export a singleton instance
  const confetti = new ConfettiSystem();