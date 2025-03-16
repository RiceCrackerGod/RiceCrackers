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

// Configuration
const totalChapters = 21; // Manually set: update as needed (0, 1, 2 = 3 chapters)

// Detect fileName and chapterNumber from URL parameters
const getPathInfo = () => {
  const path = window.location.pathname; // e.g., "/read/Becoming-a-God,-Starting-as-water-monkey/chapter1"
  const pathParts = path.split('/').filter(part => part); // Split and remove empty parts

  // Expected format: /read/[fileName]/chapter[i]
  let fileName = '';
  let chapterNumber = 0;

  if (pathParts.length >= 2 && pathParts[0] === 'read') {
    fileName = pathParts[1]; // e.g., "Becoming-a-God,-Starting-as-water-monkey"
    if (pathParts.length >= 3 && pathParts[2].startsWith('chapter')) {
      const chapterMatch = pathParts[2].match(/chapter(\d+)/);
      chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;
    }
  }

  const folderName = fileName || 'default-folder'; // Use fileName as folderName, fallback if empty
  return { folderName, chapterNumber };
};

const { folderName, chapterNumber } = getPathInfo();

// Generate chapter list with dynamic folderName
const generateChapterList = () => {
  const chapterList = document.querySelector(".chapter-list");
  if (!chapterList) return; // Exit if no chapter-list element
  
  chapterList.innerHTML = "";

  const currentDate = new Date("2025-03-17"); // System date
  const dateString = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  for (let i = totalChapters; i >= 0; i--) {
    const chapterItem = document.createElement("div");
    chapterItem.className = "chapter-item";
    chapterItem.style.display = "grid";
    chapterItem.style.gridTemplateColumns = "1fr 1fr";
    chapterItem.style.alignItems = "center";
    chapterItem.style.padding = "8px 10px";
    chapterItem.style.borderBottom = i > 0 ? "1px solid #eee" : "none";

    const chapterLink = document.createElement("a");
    chapterLink.href = `/read/${folderName}/chapter${i}`; // Updated format
    chapterLink.style.color = "#2c3e50";
    chapterLink.style.textDecoration = "none";
    chapterLink.style.fontWeight = "500";
    chapterLink.textContent = `Chapter ${i}`;

    const chapterDate = document.createElement("span");
    chapterDate.className = "chapter-date";
    chapterDate.style.textAlign = "right";
    chapterDate.style.color = "#7f8c8d";
    chapterDate.style.fontSize = "0.9em";
    chapterDate.textContent = dateString;

    chapterItem.appendChild(chapterLink);
    chapterItem.appendChild(chapterDate);
    chapterList.appendChild(chapterItem);
  }
};

generateChapterList();