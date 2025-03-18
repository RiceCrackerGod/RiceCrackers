// Theme Toggle Functionality (optimized for Safari)
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  const themeToggleIcon = themeToggleBtn.querySelector('i');
  let currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  if (themeToggleIcon) {
    themeToggleIcon.classList.toggle('fa-moon', currentTheme === 'light');
    themeToggleIcon.classList.toggle('fa-sun', currentTheme === 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', currentTheme);
    if (themeToggleIcon) {
      themeToggleIcon.classList.toggle('fa-moon');
      themeToggleIcon.classList.toggle('fa-sun');
    }
  });
}

// Normalize URL filename efficiently
const normalizeForMatching = (str) => {
  return str
    .replace(/[-]+/g, ' ')
    .replace(/([,])/g, '$1 ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

// Extract path info with minimal regex overhead
const getPathInfo = () => {
  const path = window.location.pathname;
  const match = path.match(/(?:\/read\/)?([^/]+)(?:\/chapter-(\d+))?(?:\.html)?$/i);
  
  if (!match) return { pageFilename: null, chapterNumber: null };
  
  return {
    pageFilename: match[1].replace(/\.html$/i, ''),
    chapterNumber: match[2] ? parseInt(match[2], 10) : null,
  };
};

// Optimized comic reader for Safari on iPhone 11
const createComicReader = (imageUrls, config = {}) => {
  const { loadingGif = 'https://yourdomain.com/loading.gif', errorImage = 'https://yourdomain.com/error.jpg' } = config;
  const container = document.getElementById('read-comic');
  if (!container) return;

  container.innerHTML = '<div class="loading-state"><p>Loading...</p></div>';

  // Preload first image with Safari-compatible headers
  if (imageUrls.length > 0) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = imageUrls[0];
    preloadLink.as = 'image';
    preloadLink.setAttribute('crossorigin', 'anonymous'); // Ensure CORS compatibility
    document.head.appendChild(preloadLink);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '50px' }); // Smaller margin for faster loading on smaller screens

  const fragment = document.createDocumentFragment();
  imageUrls.forEach((url, index) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-break no-gaps';
    pageDiv.innerHTML = `
      <div class="image-wrapper">
        <img id="image-${index}" 
             data-src="${url}" 
             class="wp-manga-chapter-img" 
             alt="Page ${index + 1}" 
             loading="lazy" 
             decoding="async" 
             style="max-width: 100%; height: auto;">
      </div>
    `;
    fragment.appendChild(pageDiv);

    const img = pageDiv.querySelector(`#image-${index}`);
    observer.observe(img);

    img.onload = () => {
      if (index === 0) container.querySelector('.loading-state')?.remove();
    };
    img.onerror = () => {
      img.src = errorImage;
      img.onerror = null;
      if (index === 0) container.querySelector('.loading-state')?.remove();
    };
  });
  container.appendChild(fragment);
};

// Main logic with Safari-specific tweaks
document.addEventListener('DOMContentLoaded', () => {
  const { pageFilename, chapterNumber } = getPathInfo();
  const apiUrl = "https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec";
  const elements = {
    title: document.getElementById('manhwa-title'),
    cover: document.getElementById('cover-image'),
    description: document.getElementById('description'),
    chapterList: document.querySelector('.chapter-list'),
    comicReader: document.getElementById('read-comic'),
  };

  if (!pageFilename) {
    Object.values(elements).forEach(el => {
      if (el) el.innerHTML = '<p style="color:red;">Invalid URL</p>';
    });
    return;
  }

  const normalizedPageFilename = normalizeForMatching(pageFilename);

  fetch(apiUrl, { 
    mode: 'cors', 
    credentials: 'omit', 
    cache: 'no-store',
    headers: { 'Accept': 'application/json' } // Ensure JSON response
  })
    .then(response => response.ok ? response.json() : Promise.reject(`Network error: ${response.status}`))
    .then(data => {
      if (!data?.manhwa_list?.length) throw new Error('Empty manhwa_list');
      const manhwa = data.manhwa_list.find(m => normalizeForMatching(m.title) === normalizedPageFilename);
      if (!manhwa) throw new Error(`No match for: ${normalizedPageFilename}`);

      if (elements.title) elements.title.textContent = manhwa.title || 'Untitled';
      if (elements.cover) {
        elements.cover.innerHTML = '';
        const img = document.createElement('img');
        img.src = manhwa.cover_image || 'https://yourdomain.com/default-cover.jpg';
        img.alt = `${manhwa.title} Cover`;
        img.className = 'cover-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.cssText = 'max-width: 100%; height: auto;';
        img.onerror = () => img.src = 'https://yourdomain.com/default-cover.jpg';
        elements.cover.appendChild(img);
      }
      if (elements.description) elements.description.textContent = manhwa.description || 'No description';

      if (elements.chapterList && manhwa.chapters?.length) {
        const fragment = document.createDocumentFragment();
        const sortedChapters = [...manhwa.chapters].sort((a, b) => b.chapter_number - a.chapter_number);
        sortedChapters.forEach((chapter, index) => {
          const div = document.createElement('div');
          div.className = 'chapter-item';
          div.style.cssText = `
            display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 8px 10px;
            border-bottom: ${index < sortedChapters.length - 1 ? '1px solid #eee' : 'none'};
          `;
          div.innerHTML = `
            <a href="/read/${pageFilename}/chapter-${chapter.chapter_number}.html" 
               style="color: #2c3e50; text-decoration: none; font-weight: 500;">
              Chapter ${chapter.chapter_number}
            </a>
            <span style="text-align: right; color: #7f8c8d; font-size: 0.9em;">
              ${chapter.date || 'No date'}
            </span>
          `;
          fragment.appendChild(div);
        });
        elements.chapterList.innerHTML = '';
        elements.chapterList.appendChild(fragment);
      } else if (elements.chapterList) {
        elements.chapterList.innerHTML = '<div style="color:red;">No chapters</div>';
      }

      if (chapterNumber !== null && elements.comicReader) {
        const chapter = manhwa.chapters?.find(ch => ch.chapter_number === chapterNumber);
        if (chapter?.images?.length) {
          createComicReader(chapter.images, {
            loadingGif: 'https://yourdomain.com/loading.gif',
            errorImage: 'https://yourdomain.com/error.jpg',
          });
        } else {
          elements.comicReader.innerHTML = '<p style="color:red;">No images</p>';
        }
      }
    })
    .catch(error => {
      Object.values(elements).forEach(el => {
        if (el) el.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      });
    });
});

// Navigation functions
function handleLogo() {
  window.location.href = '/';
}

function readFirstChapter() {
  const { pageFilename } = getPathInfo();
  if (pageFilename) window.location.href = `/read/${pageFilename}/chapter-0.html`;
}
