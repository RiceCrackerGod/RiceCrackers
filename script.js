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


function openDonationInfo() {
  window.location.href = `/`; // Adjust path as needed
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

function openDonationInfo() {
  const donationInfo = document.getElementById('donation-info');
  if (donationInfo.style.display === 'none' || donationInfo.style.display === '') {
    donationInfo.style.display = 'block';
  } else {
    donationInfo.style.display = 'none';
  }
}


// Copy Contract Address on Click with Notification
document.querySelectorAll('.contract-address').forEach(address => {
  address.addEventListener('click', () => {
    // Extract text before and after ": "
    const fullText = address.textContent;
    const [cryptoName, cryptoAddress] = fullText.split(': ').map(part => part.trim());
    
    // Copy to clipboard
    navigator.clipboard.writeText(cryptoAddress)
      .then(() => {
        // Visual feedback on the address
        address.style.backgroundColor = 'rgba(var(--primary), 0.3)';
        setTimeout(() => {
          address.style.backgroundColor = 'var(--card)';
        }, 500);

        // Create and show notification
        showNotification(`${cryptoName} Copied`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  });
});

// Notification Function
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10); // Small delay to trigger transition

  // Hide and remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300); // Match transition duration
  }, 2000);
}

function twitter() {
  window.location.href = `https://x.com/ricecrackergod`; 
}