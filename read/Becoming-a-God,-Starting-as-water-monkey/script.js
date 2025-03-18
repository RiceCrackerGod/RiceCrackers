// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleBtn?.querySelector('i');
let currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.classList.toggle('dark', currentTheme === 'dark');
updateThemeIcon();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  if (!themeToggleIcon) return;
  themeToggleIcon.classList.toggle('fa-moon', currentTheme === 'light');
  themeToggleIcon.classList.toggle('fa-sun', currentTheme === 'dark');
}

// Navigation functions
function handleLogo() {
  window.location.href = '/';
}

function handleNext() {
  const { folderName, chapterNumber } = getPathInfo();
  const nextChapter = chapterNumber + 1;
  window.location.href = `/read/${folderName}/chapter-${nextChapter}`;
}

function handleInfo() {
  const { folderName } = getPathInfo();
  window.location.href = `/read/${folderName}`;
}

function handlePrevious() {
  const { folderName, chapterNumber } = getPathInfo();
  const prevChapter = chapterNumber - 1;
  if (prevChapter >= 0) {
    window.location.href = `/read/${folderName}/chapter-${prevChapter}`;
  }
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  };
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// Utility to normalize titles for consistent comparison
const normalizeTitle = (str) => {
  return str
    .replace(/[-,]+/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Function to extract folder name and chapter number from URL
const getPathInfo = () => {
  const path = window.location.pathname;
  // Flexible match: /read/<title>/chapter-<num> with optional .html
  const match = path.match(/(?:\/read\/)?([^/]+)(?:\/chapter-(\d+))?(?:\.html)?$/i);

  if (!match) {
    console.error('URL parsing failed:', path);
    return { folderName: null, chapterNumber: null };
  }
  return {
    folderName: match[1], // e.g., "Becoming-a-God,-Starting-as-water-monkey"
    chapterNumber: match[2] ? parseInt(match[2], 10) : null,
  };
};

// Format title for display
const formatTitleForDisplay = (str) => {
  return str
    .replace(/[-,]+/g, ' ')
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get path info
const { folderName, chapterNumber } = getPathInfo();
console.log('Path info:', { folderName, chapterNumber });

// Update DOM with title and chapter
const chapterTitleEl = document.getElementById('chapter-title');
const chapterNumberEl = document.getElementById('chapter-number');
if (chapterTitleEl) chapterTitleEl.textContent = folderName ? formatTitleForDisplay(folderName) : 'Unknown Title';
if (chapterNumberEl) chapterNumberEl.textContent = chapterNumber !== null ? `Chapter ${chapterNumber}` : 'No Chapter';

async function loadComicImages() {
  const comicReader = document.getElementById('read-comic');
  if (!comicReader) {
    console.error('Comic reader element not found');
    return;
  }
  comicReader.innerHTML = 'Loading images...';

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec',
      { mode: 'cors', credentials: 'omit' }
    );
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched JSON:', data);

    if (!data.manhwa_list || !Array.isArray(data.manhwa_list)) {
      throw new Error("Invalid JSON structure: 'manhwa_list' missing or not an array");
    }

    const normalizedUrlTitle = normalizeTitle(folderName || '');
    console.log('Normalized URL Title:', normalizedUrlTitle);

    const matchingManhwa = data.manhwa_list.find((item) => {
      const normalizedJsonTitle = normalizeTitle(item.title);
      console.log('Comparing:', normalizedJsonTitle, 'with', normalizedUrlTitle);
      return normalizedJsonTitle === normalizedUrlTitle;
    });

    if (!matchingManhwa) {
      comicReader.innerHTML = 'No matching manhwa found.';
      console.log('No match found in manhwa_list.');
      return;
    }

    console.log('Matched Manhwa:', matchingManhwa);

    const matchingChapter = matchingManhwa.chapters?.find(
      (chapter) => Number(chapter.chapter_number) === Number(chapterNumber)
    );

    if (!matchingChapter || !Array.isArray(matchingChapter.images)) {
      comicReader.innerHTML = 'No images found for this chapter.';
      console.log('No matching chapter or invalid images:', matchingChapter);
      return;
    }

    console.log('Matched Chapter:', matchingChapter);

    // Clear and populate comic reader
    comicReader.innerHTML = '';
    matchingChapter.images.forEach((imageUrl, index) => {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'comic-page';

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `Chapter ${chapterNumber} Page ${index + 1}`;
      img.style.maxWidth = '100%';
      img.onerror = () => (img.src = 'https://yourdomain.com/fallback-image.jpg'); // Update this

      imageDiv.appendChild(img);

      const adDiv = document.createElement('div');
      adDiv.className = 'banner-ad-container banner-ad';
      adDiv.style.minHeight = '180px';
      adDiv.innerHTML = '<!-- Banner Ad Placeholder -->';

      comicReader.appendChild(imageDiv);
      comicReader.appendChild(adDiv);
    });
  } catch (error) {
    console.error('Error loading comic images:', error);
    comicReader.innerHTML = 'Error loading images. Please try again later.';
  }
}

window.addEventListener('DOMContentLoaded', loadComicImages);
