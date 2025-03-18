// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  const themeToggleIcon = themeToggleBtn.querySelector('i');
  let currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  updateThemeIcon();

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!themeToggleIcon) return;
    themeToggleIcon.classList.toggle('fa-moon', currentTheme === 'light');
    themeToggleIcon.classList.toggle('fa-sun', currentTheme === 'dark');
  }
}

// Normalize titles for consistent comparison
const normalizeTitle = (title) => {
  return title
    .replace(/[,]/g, '') // Remove commas
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Lowercase for case-insensitive match
};

// Extract path info from URL
const getPathInfo = () => {
  const path = window.location.pathname;
  const match = path.match(/\/read\/([^/]+)(?:\/chapter-(\d+))?\.html$/i);
  
  return match
    ? {
        pageFilename: match[1].toLowerCase(), // e.g., "becoming-a-god-starting-as-water-monkey"
        chapterNumber: match[2] ? parseInt(match[2], 10) : null,
      }
    : { pageFilename: null, chapterNumber: null };
};

// Create comic reader with per-image loading/error states
const createComicReader = (imageUrls) => {
  const container = document.getElementById('read-comic');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <p>Loading comic pages...</p>
      <img src="/path/to/loading.gif" alt="Loading..." class="loading-image">
    </div>
  `;

  imageUrls.forEach((url, index) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-break no-gaps';
    pageDiv.innerHTML = `
      <div class="image-wrapper">
        <img id="image-${index}" src="${url}" class="wp-manga-chapter-img" alt="Page ${index + 1}">
        <p class="loading-text">Loading page ${index + 1}...</p>
        <p class="error-text" style="display:none; color:red;">Failed to load page ${index + 1}</p>
      </div>
    `;
    container.appendChild(pageDiv);

    const img = pageDiv.querySelector(`#image-${index}`);
    img.onload = () => {
      pageDiv.querySelector('.loading-text').remove();
      if (index === 0) container.querySelector('.loading-state')?.remove();
    };
    img.onerror = () => {
      img.src = '/path/to/error-image.jpg';
      pageDiv.querySelector('.loading-text').remove();
      pageDiv.querySelector('.error-text').style.display = 'block';
      if (index === 0) container.querySelector('.loading-state')?.remove();
    };
  });
};

// Main logic
document.addEventListener('DOMContentLoaded', () => {
  const { pageFilename, chapterNumber } = getPathInfo();
  console.log('Path info:', { pageFilename, chapterNumber });

  const apiUrl = "https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec";
  const elements = {
    title: document.getElementById('manhwa-title'),
    cover: document.getElementById('cover-image'),
    description: document.getElementById('description'),
    chapterList: document.querySelector('.chapter-list'),
    comicReader: document.getElementById('read-comic'),
  };

  // Set initial loading states
  if (elements.title) elements.title.innerHTML = '<span>Loading title...</span>';
  if (elements.cover) elements.cover.innerHTML = '<img src="/path/to/loading.gif" alt="Loading cover...">';
  if (elements.description) elements.description.innerHTML = '<p>Loading description...</p>';
  if (elements.chapterList) elements.chapterList.innerHTML = '<div>Loading chapters...</div>';
  if (elements.comicReader) elements.comicReader.innerHTML = '<p>Loading comic...</p>';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      if (!data?.manhwa_list?.length) throw new Error('Invalid JSON: manhwa_list missing or empty');

      const manhwa = data.manhwa_list.find(m => {
        const normalizedTitle = normalizeTitle(m.title);
        console.log('Comparing:', normalizedTitle, 'with', pageFilename);
        return normalizedTitle === pageFilename;
      });

      if (!manhwa) {
        throw new Error(`No matching manhwa found for: ${pageFilename}`);
      }
      console.log('Matched manhwa:', manhwa);

      // Update manhwa details
      if (elements.title) {
        elements.title.textContent = manhwa.title || 'Untitled';
      }
      if (elements.cover) {
        elements.cover.innerHTML = '';
        const img = document.createElement('img');
        img.src = manhwa.cover_image || '/path/to/default-cover.jpg';
        img.alt = `${manhwa.title} Cover`;
        img.className = 'cover-img';
        img.onerror = () => {
          img.src = '/path/to/default-cover.jpg';
          elements.cover.insertAdjacentHTML('afterbegin', '<p style="color:red;">Failed to load cover</p>');
        };
        elements.cover.appendChild(img);
      }
      if (elements.description) {
        elements.description.textContent = manhwa.description || 'No description available';
      }

      // Update chapter list
      if (elements.chapterList) {
        if (manhwa.chapters?.length) {
          const sortedChapters = [...manhwa.chapters].sort((a, b) => b.chapter_number - a.chapter_number);
          elements.chapterList.innerHTML = '';
          sortedChapters.forEach((chapter, index) => {
            const div = document.createElement('div');
            div.className = 'chapter-item';
            div.style.cssText = `
              display: grid;
              grid-template-columns: 1fr 1fr;
              align-items: center;
              padding: 8px 10px;
              border-bottom: ${index < sortedChapters.length - 1 ? '1px solid #eee' : 'none'};
            `;
            div.innerHTML = `
              <a href="/read/${pageFilename}/chapter-${chapter.chapter_number}.html" 
                 style="color: #2c3e50; text-decoration: none; font-weight: 500;">
                Chapter ${chapter.chapter_number}
              </a>
              <span class="chapter-date" style="text-align: right; color: #7f8c8d; font-size: 0.9em;">
                ${chapter.date || 'No date'}
              </span>
            `;
            elements.chapterList.appendChild(div);
          });
        } else {
          elements.chapterList.innerHTML = '<div style="color:red;">No chapters available</div>';
        }
      }

      // Handle chapter page
      if (chapterNumber !== null && elements.comicReader) {
        const chapter = manhwa.chapters?.find(ch => ch.chapter_number === chapterNumber);
        if (chapter?.images?.length) {
          console.log('Chapter found:', chapter);
          createComicReader(chapter.images);
        } else {
          elements.comicReader.innerHTML = '<p style="color:red;">No images found for this chapter</p>';
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (elements.title) elements.title.innerHTML = '<span style="color:red;">Error loading title</span>';
      if (elements.cover) elements.cover.innerHTML = '<p style="color:red;">Failed to load cover</p>';
      if (elements.description) elements.description.innerHTML = '<p style="color:red;">Error: ' + error.message + '</p>';
      if (elements.chapterList) elements.chapterList.innerHTML = '<div style="color:red;">Failed to load chapters</div>';
      if (elements.comicReader) elements.comicReader.innerHTML = '<p style="color:red;">Error loading images: ' + error.message + '</p>';
    });
});

// Navigation functions
function handleLogo() {
  window.location.href = '/';
}

function readFirstChapter() {
  const { pageFilename } = getPathInfo();
  if (pageFilename) {
    window.location.href = `/read/${pageFilename}/chapter-0.html`;
  } else {
    console.error('Cannot navigate: pageFilename is null');
  }
}
