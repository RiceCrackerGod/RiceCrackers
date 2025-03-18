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

// Normalize URL filename to match JSON title and format correctly
const normalizeForMatching = (str) => {
  return str
    .replace(/[-]+/g, ' ')    // Replace hyphens with spaces
    .replace(/([,])/g, '$1 ') // Preserve commas and add space after
    .split(' ')               // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(' ')                // Rejoin with spaces
    .trim();                  // Remove leading/trailing whitespace
};

// Extract path info from URL with flexible matching and remove .html
const getPathInfo = () => {
  const path = window.location.pathname;
  // Flexible match: /read/<title>/chapter-<num> with optional .html
  const match = path.match(/(?:\/read\/)?([^/]+)(?:\/chapter-(\d+))?(?:\.html)?$/i);
  
  if (!match) {
    console.error('URL parsing failed:', path);
    return { pageFilename: null, chapterNumber: null };
  }
  
  // Remove .html from the pageFilename if present
  let pageFilename = match[1].replace(/\.html$/i, '');

  return {
    pageFilename: pageFilename, // e.g., "Becoming-a-God,-Starting-as-water-monkey"
    chapterNumber: match[2] ? parseInt(match[2], 10) : null,
  };
};

// Create comic reader with configurable assets
const createComicReader = (imageUrls, config = {}) => {
  const { loadingGif = 'https://yourdomain.com/loading.gif', errorImage = 'https://yourdomain.com/error.jpg' } = config;
  const container = document.getElementById('read-comic');
  if (!container) {
    console.warn('Comic container not found');
    return;
  }

  container.innerHTML = `
    <div class="loading-state">
      <p>Loading comic pages...</p>
      <img src="${loadingGif}" alt="Loading..." class="loading-image">
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
      pageDiv.querySelector('.loading-text')?.remove();
      if (index === 0) container.querySelector('.loading-state')?.remove();
    };
    img.onerror = () => {
      img.src = errorImage;
      pageDiv.querySelector('.loading-text')?.remove();
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

  // Set loading states regardless of pageFilename
  Object.entries(elements).forEach(([key, el]) => {
    if (el) {
      switch (key) {
        case 'title': el.innerHTML = '<span>Loading title...</span>'; break;
        case 'cover': el.innerHTML = '<img src="https://yourdomain.com/loading.gif" alt="Loading cover...">'; break;
        case 'description': el.innerHTML = '<p>Loading description...</p>'; break;
        case 'chapterList': el.innerHTML = '<div>Loading chapters...</div>'; break;
        case 'comicReader': el.innerHTML = '<p>Loading comic...</p>'; break;
      }
    } else {
      console.warn(`Element not found: ${key}`);
    }
  });

  if (!pageFilename) {
    console.error('No pageFilename extracted; showing error states.');
    Object.entries(elements).forEach(([key, el]) => {
      if (el) {
        el.innerHTML = `<p style="color:red;">Invalid URL: Unable to load ${key}</p>`;
      }
    });
    return;
  }

  const normalizedPageFilename = normalizeForMatching(pageFilename);
  console.log('Normalized pageFilename:', normalizedPageFilename);

  fetch(apiUrl, { mode: 'cors', credentials: 'omit', cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      console.log('API response:', data);
      if (!data?.manhwa_list?.length) throw new Error('Invalid JSON: manhwa_list missing or empty');

      const manhwa = data.manhwa_list.find(m => {
        const normalizedJsonTitle = normalizeForMatching(m.title);
        console.log('Comparing:', normalizedJsonTitle, 'with', normalizedPageFilename);
        console.log('Raw JSON title:', m.title);
        return normalizedJsonTitle === normalizedPageFilename;
      });

      if (!manhwa) throw new Error(`No matching manhwa found for: ${normalizedPageFilename}`);
      console.log('Matched manhwa:', manhwa);

      // Update DOM
      if (elements.title) elements.title.textContent = manhwa.title || 'Untitled';
      if (elements.cover) {
        elements.cover.innerHTML = '';
        const img = document.createElement('img');
        img.src = manhwa.cover_image || 'https://yourdomain.com/default-cover.jpg';
        img.alt = `${manhwa.title} Cover`;
        img.className = 'cover-img';
        img.onerror = () => {
          img.src = 'https://yourdomain.com/default-cover.jpg';
          elements.cover.insertAdjacentHTML('afterbegin', '<p style="color:red;">Failed to load cover</p>');
        };
        elements.cover.appendChild(img);
      }
      if (elements.description) elements.description.textContent = manhwa.description || 'No description';
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
      if (chapterNumber !== null && elements.comicReader) {
        const chapter = manhwa.chapters?.find(ch => ch.chapter_number === chapterNumber);
        if (chapter?.images?.length) {
          console.log('Chapter found:', chapter);
          createComicReader(chapter.images, {
            loadingGif: 'https://yourdomain.com/loading.gif',
            errorImage: 'https://yourdomain.com/error.jpg',
          });
        } else {
          elements.comicReader.innerHTML = '<p style="color:red;">No images found for this chapter</p>';
        }
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      Object.entries(elements).forEach(([key, el]) => {
        if (el) {
          switch (key) {
            case 'title': el.innerHTML = '<span style="color:red;">Error loading title</span>'; break;
            case 'cover': el.innerHTML = '<p style="color:red;">Failed to load cover</p>'; break;
            case 'description': el.innerHTML = '<p style="color:red;">Error: ' + error.message + '</p>'; break;
            case 'chapterList': el.innerHTML = '<div style="color:red;">Failed to load chapters</div>'; break;
            case 'comicReader': el.innerHTML = '<p style="color:red;">Error loading images: ' + error.message + '</p>'; break;
          }
        }
      });
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
