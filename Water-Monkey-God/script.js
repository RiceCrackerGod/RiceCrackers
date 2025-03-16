// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleBtn.querySelector('i');
let currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.classList.toggle('dark', currentTheme === 'dark');
updateThemeIcon();

// Toggle theme when button is clicked
themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
});

// Update the moon/sun icon
function updateThemeIcon() {
  if (currentTheme === 'dark') {
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
  } else {
    themeToggleIcon.classList.remove('fa-sun');
    themeToggleIcon.classList.add('fa-moon');
  }
}


// Add notification for the Continue button
const continueBtn = document.querySelector('.continue-btn');
if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = 'This feature will be soon available';
    
    // Add notification styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add the notification to the document
    document.body.appendChild(notification);
    
    // Show the notification with animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      // Remove from DOM after fade out
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  });
}

// Add share button functionality
const shareBtn = document.querySelector('.primary-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://x.com/ricecrackergod', '_blank');
  });
}

// Add market button functionality
const marketBtn = document.querySelector('.hero-image');
if (marketBtn) {
  marketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://x.com/ricecrackergod', '_blank');
  });
}

// Add market button functionality
const pricebtn = document.querySelector('.price-display');
if (pricebtn) {
  pricebtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://polygonscan.com/token/0x9d6432b17Bf74b3645b85760be95F7bCB550AB60', '_blank');
  });
}

// Add animations when scrolling into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, {
  threshold: 0.1
});

// Observe elements to animate
document.querySelectorAll('.service-card, .community').forEach(el => {
  el.classList.add('animate-item');
  observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  .animate-item {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
