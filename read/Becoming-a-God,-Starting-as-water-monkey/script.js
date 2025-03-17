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


function handleLogo() {
  window.location.href = `/`; // Adjust path as needed
}

// Navigation functions
function handleNext() {
  const nextChapter = chapterNumber + 1;
  window.location.href = `chapter-${nextChapter}`; // Adjust path as needed
}

// Navigation functions
function handleInfo() {
  window.location.href = `read/${folderName}`; // Adjust path as needed
}

function handlePrevious() {
  const prevChapter = chapterNumber - 1;
  if (prevChapter >= 0) { // Prevent going below chapter 0
    window.location.href = `chapter-${prevChapter}`;
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

// Utility to normalize titles for consistent comparison
const normalizeTitle = (str) => {
  return str
    .replace(/[-,]+/g, " ") // Replace hyphens and commas with spaces
    .toLowerCase() // Convert to lowercase for case-insensitive comparison
    .split(/\s+/) // Split on any whitespace
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join back with single spaces
};

// Function to extract folder name and chapter number from URL
const getPathInfo = () => {
  const path = window.location.pathname; // e.g., "/Becoming-a-God,-Starting-as-water-monkey/chapter-0.html"
  const match = path.match(/\/([^/]+)\/chapter-(\d+)\.html$/i); // Match folder and chapter with .html

  return match
    ? {
        folderName: match[1], // e.g., "Becoming-a-God,-Starting-as-water-monkey"
        chapterNumber: parseInt(match[2], 10), // e.g., 0
      }
    : {
        folderName: "Default Title",
        chapterNumber: 0,
      };
};

// Format title for display (not comparison)
const formatTitleForDisplay = (str) => {
  return normalizeTitle(str); // Reuse normalization for consistency
};

// Get path info
const { folderName, chapterNumber } = getPathInfo();

// Update DOM with title and chapter
document.getElementById("chapter-title").textContent = formatTitleForDisplay(folderName);
document.getElementById("chapter-number").textContent = `Chapter ${chapterNumber}`;

async function loadComicImages() {
  const comicReader = document.getElementById("read-comic");
  comicReader.innerHTML = "Loading images...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec"
    );
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched JSON:", data);

    if (!data.manhwa_list || !Array.isArray(data.manhwa_list)) {
      throw new Error("Invalid JSON structure: 'manhwa_list' missing or not an array");
    }

    const normalizedUrlTitle = normalizeTitle(folderName);
    console.log("Normalized URL Title:", normalizedUrlTitle);

    const matchingManhwa = data.manhwa_list.find((item) => {
      const normalizedJsonTitle = normalizeTitle(item.title);
      console.log("Comparing:", normalizedJsonTitle, "with", normalizedUrlTitle);
      return normalizedJsonTitle === normalizedUrlTitle;
    });

    if (!matchingManhwa) {
      comicReader.innerHTML = "No matching manhwa found.";
      console.log("No match found in manhwa_list.");
      return;
    }

    console.log("Matched Manhwa:", matchingManhwa);

    const matchingChapter = matchingManhwa.chapters?.find(
      (chapter) => chapter.chapter_number === chapterNumber
    );

    if (!matchingChapter || !Array.isArray(matchingChapter.images)) {
      comicReader.innerHTML = "No images found for this chapter.";
      console.log("No matching chapter or invalid images:", matchingChapter);
      return;
    }

    console.log("Matched Chapter:", matchingChapter);

    // Clear and populate comic reader
    comicReader.innerHTML = "";
    matchingChapter.images.forEach((imageUrl, index) => {
      const imageDiv = document.createElement("div");
      imageDiv.className = "comic-page";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = `Chapter ${chapterNumber} Page ${index + 1}`;
      img.style.maxWidth = "100%";
      img.onerror = () => (img.src = "/path/to/fallback-image.jpg"); // Fallback for broken images

      imageDiv.appendChild(img);

      const adDiv = document.createElement("div");
      adDiv.className = "banner-ad-container banner-ad";
      adDiv.style.minHeight = "180px";
      adDiv.innerHTML = "<!-- Banner Ad Placeholder -->";

      comicReader.appendChild(imageDiv);
      comicReader.appendChild(adDiv);
    });
  } catch (error) {
    console.error("Error loading comic images:", error);
    comicReader.innerHTML = "Error loading images. Please try again later.";
  }
}

window.addEventListener("DOMContentLoaded", loadComicImages);