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

// Function to extract path info (title and chapter number)
const getPathInfo = () => {
  const path = window.location.pathname; // e.g., "/read/Becoming-a-God,-Starting-as-water-monkey/chapter-0.html"
  const match = path.match(/\/read\/([^/]+)(?:\/chapter-(\d+))?\.html$/);
  
  if (match) {
    return {
      pageFilename: match[1].toLowerCase(), // "becoming-a-god,-starting-as-water-monkey"
      chapterNumber: match[2] ? parseInt(match[2]) : null // 0 or null if no chapter
    };
  }
  return { pageFilename: null, chapterNumber: null };
};

// Function to create comic reader structure
const createComicReader = (imageUrls) => {
  const container = document.getElementById('read-comic');
  if (!container) return; // Exit if no container exists
  
  container.innerHTML = '<p>Loading images...</p><img src="/path/to/loading.gif" alt="Loading..." class="loading-image">'; // Add loading state
  
  imageUrls.forEach((url, index) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-break no-gaps';
    pageDiv.innerHTML = `
      <img id="image-${index}" src="${url}" class="wp-manga-chapter-img" alt="Chapter image ${index + 1}" 
           onload="this.parentElement.parentElement.querySelector('.loading-image')?.remove();"
           onerror="this.src='/path/to/error-image.jpg'; this.nextElementSibling.style.display='block';">
      <p style="display:none; color:red;">Failed to load image</p>
    `;
    container.appendChild(pageDiv);
  });
  
  // Remove initial loading text after first image loads or fails
  const firstImage = container.querySelector('img');
  if (firstImage) {
    firstImage.onload = () => container.querySelector('p')?.remove();
    firstImage.onerror = () => container.querySelector('p').textContent = 'Error loading images';
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const { pageFilename, chapterNumber } = getPathInfo();
  console.log('Path info:', { pageFilename, chapterNumber });

  const apiUrl = "https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec";
  
  // Manhwa detail page elements
  const titleElement = document.getElementById("manhwa-title");
  const coverElement = document.getElementById("cover-image");
  const descriptionElement = document.getElementById("description");
  const chapterListElement = document.querySelector(".chapter-list");

  // Show loading state for manhwa details if elements exist
  if (titleElement) titleElement.textContent = "Loading...";
  if (descriptionElement) descriptionElement.textContent = "Loading comic details...";

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      console.log("Data received:", data);
      if (!data || !Array.isArray(data.manhwa_list)) {
        throw new Error("Invalid JSON data structure: 'manhwa_list' missing or not an array");
      }

      const manhwa = data.manhwa_list.find(m => {
        const normalizedTitle = m.title.replace(/\s+/g, "-").toLowerCase();
        return normalizedTitle === pageFilename && m.cover_image && m.description;
      });

      if (!manhwa) {
        throw new Error(`Manhwa not found with cover image and description. Looking for: ${pageFilename}`);
      }

      // Update manhwa details if on a detail page
      if (titleElement) titleElement.textContent = manhwa.title;
      if (coverElement) {
        const imgElement = document.createElement("img");
        imgElement.src = manhwa.cover_image;
        imgElement.alt = `${manhwa.title} Cover`;
        imgElement.className = "cover-img";
        coverElement.innerHTML = "";
        coverElement.appendChild(imgElement);
      }
      if (descriptionElement) descriptionElement.textContent = manhwa.description;

      // Update chapter list if on a detail page
      if (chapterListElement && manhwa.chapters && Array.isArray(manhwa.chapters) && manhwa.chapters.length > 0) {
        const sortedChapters = [...manhwa.chapters].sort((a, b) => b.chapter_number - a.chapter_number);
        chapterListElement.innerHTML = "";
        
        sortedChapters.forEach((chapter, index) => {
          const div = document.createElement("div");
          div.className = "chapter-item";
          div.style.display = "grid";
          div.style.gridTemplateColumns = "1fr 1fr";
          div.style.alignItems = "center";
          div.style.padding = "8px 10px";
          div.style.borderBottom = index < sortedChapters.length - 1 ? "1px solid #eee" : "none";
          
          const chapterLink = document.createElement("a");
          chapterLink.href = `/read/${pageFilename}/chapter-${chapter.chapter_number}.html`;
          chapterLink.style.color = "#2c3e50";
          chapterLink.style.textDecoration = "none";
          chapterLink.style.fontWeight = "500";
          chapterLink.textContent = `Chapter-${chapter.chapter_number}`;
          
          const chapterDate = document.createElement("span");
          chapterDate.className = "chapter-date";
          chapterDate.style.textAlign = "right";
          chapterDate.style.color = "#7f8c8d";
          chapterDate.style.fontSize = "0.9em";
          chapterDate.textContent = chapter.date || "No date";
          
          div.appendChild(chapterLink);
          div.appendChild(chapterDate);
          chapterListElement.appendChild(div);
        });
      } else if (chapterListElement) {
        chapterListElement.innerHTML = "<div>No chapters available</div>";
      }

      // Handle chapter page (generate images)
      if (chapterNumber !== null && document.getElementById('read-comic')) {
        const chapter = manhwa.chapters.find(ch => ch.chapter_number === chapterNumber);
        if (chapter && chapter.image_urls) {
          console.log('Chapter found:', chapter);
          const imageUrls = chapter.image_urls.split(','); // Assuming image_urls is a comma-separated string
          createComicReader(imageUrls);
        } else {
          document.getElementById('read-comic').innerHTML = '<p>No images available for this chapter</p>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching or processing data:", error);
      if (titleElement) titleElement.textContent = "Error";
      if (descriptionElement) descriptionElement.textContent = `Error loading manhwa data: ${error.message}`;
      if (chapterListElement) chapterListElement.innerHTML = "<div>Failed to load chapters</div>";
      if (document.getElementById('read-comic')) {
        document.getElementById('read-comic').innerHTML = `<p>Error loading comic images: ${error.message}</p>`;
      }
    });
});

function handleLogo() {
  window.location.href = `/`;
}

function readFirstChapter() {
  window.location.href = 'Becoming-a-God,-Starting-as-water-monkey/chapter-0';
}