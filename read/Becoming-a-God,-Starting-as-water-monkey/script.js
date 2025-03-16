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


// Add market button functionality
const pricebtn = document.querySelector('.price-display');
if (pricebtn) {
  pricebtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://polygonscan.com/token/0x9d6432b17Bf74b3645b85760be95F7bCB550AB60', '_blank');
  });
}



// Chapter Navigation
// Get current chapter number from URL
const getCurrentChapter = () => {
  const path = window.location.pathname;
  const match = path.match(/chapter-(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const currentChapter = getCurrentChapter();
const totalChapters = 1; // Update this as you add more chapters

function handleNext() {
  const nextChapter = currentChapter + 1;
  window.location.href = `chapter-${nextChapter}.html`;
}

function handlePrevious() {
  const prevChapter = currentChapter - 1;
  window.location.href = `chapter-${prevChapter}.html`;
}

function handleInfo() {
  window.location.href = '/';
}

// Initialize navigation buttons
window.onload = function() {
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const infoBtn = document.getElementById('infoBtn');

  const hasNextChapter = currentChapter < totalChapters;
  const hasPrevChapter = currentChapter > 0;

  if (!hasNextChapter && !hasPrevChapter) {
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    infoBtn.style.display = 'inline-flex';
  } else {
    if (!hasNextChapter) {
      nextBtn.style.display = 'none';
      infoBtn.style.display = 'inline-flex';
    }
    if (!hasPrevChapter) {
      prevBtn.style.display = 'none';
      infoBtn.style.display = 'inline-flex';
    }
  }
};

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize navigation buttons
window.onload = function() {
  if (currentChapter === 0) {
    document.getElementById('prevBtn').style.display = 'none';
  }
  if (currentChapter === totalChapters) {
    document.getElementById('nextBtn').style.display = 'none';
  }
};