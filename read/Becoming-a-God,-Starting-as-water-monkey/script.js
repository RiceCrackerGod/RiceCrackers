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

// Function to extract folder name and chapter number from URL
const getPathInfo = () => {
  const path = window.location.pathname; // e.g., "/Becoming-a-God,-Starting-as-water-monkey/chapter-0.html"
  const match = path.match(/([^/]+)\/chapter-(\d+)/); // Match folder and chapter
  
  if (match) {
    return {
      folderName: match[1], // "Becoming-a-God,-Starting-as-water-monkey"
      chapterNumber: parseInt(match[2]) // e.g., 0
    };
  }
  return {
    folderName: "Default Title",
    chapterNumber: 0
  };
};

// Get the path info
const { folderName, chapterNumber } = getPathInfo();

// Format the folder name
const formatTitle = (str) => {
  return str
    .replace(/[-,]+/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Update the <a> with the formatted folder name
document.getElementById('chapter-title').textContent = formatTitle(folderName);

// Update the <div> with the current chapter number
document.getElementById('chapter-number').textContent = `Chapter ${chapterNumber}`;

// Navigation functions
function handleNext() {
  const nextChapter = chapterNumber + 1;
  window.location.href = `chapter-${nextChapter}.html`; // Adjust path as needed
}

// Navigation functions
function handleInfo() {
  window.location.href = `read/${folderName}html`; // Adjust path as needed
}

function handlePrevious() {
  const prevChapter = chapterNumber - 1;
  if (prevChapter >= 0) { // Prevent going below chapter 0
    window.location.href = `chapter-${prevChapter}.html`;
  }
}

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