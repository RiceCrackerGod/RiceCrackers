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

fetch('https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec')
.then(response => response.json())
.then(data => {
    const manhwaList = data.manhwa_list;
    const manhwaContainer = document.getElementById("manhwa-container");
    const latestContainer = document.getElementById("latest-manhwa");

    // Step 1: Group manhwa by title and find the max chapter number
    const titleMap = new Map();

    manhwaList.forEach(manhwa => {
        const title = manhwa.title;
        const maxChapter = manhwa.chapters.length > 0 
            ? Math.max(...manhwa.chapters.map(ch => ch.chapter_number)) 
            : "N/A";

        if (titleMap.has(title)) {
            const existing = titleMap.get(title);
            if (maxChapter !== "N/A" && (existing.maxChapter === "N/A" || maxChapter > existing.maxChapter)) {
                titleMap.set(title, { ...existing, maxChapter, cover_image: manhwa.cover_image || existing.cover_image });
            }
        } else {
            titleMap.set(title, {
                title,
                maxChapter,
                cover_image: manhwa.cover_image || "https://via.placeholder.com/200"
            });
        }
    });

    // Step 2: Convert titleMap to array and determine the latest manhwa
    const titleArray = Array.from(titleMap.values());
    const latestManhwa = titleArray.pop(); // Last unique title is the latest
    const otherManhwas = titleArray; // All other titles

    // Step 3: Populate #manhwa-container with other manhwas
    otherManhwas.forEach(manhwa => {
        const div = document.createElement("div");
        div.style.cssText = "display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 200px; max-height: 270px; padding: 5px; box-sizing: border-box; flex: 1;";
        div.innerHTML = `
            <img src="${manhwa.cover_image}" style="width: 150px; height: 200px; object-fit: cover; display: block; margin: 2px auto;">
            <h4 style="font-size: clamp(0.6rem, 1.5vw, 1rem); margin: 2px 0; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-wrap:wrap; transform: scale(0.8);">${manhwa.title}</h4>
            <a href="${manhwa.title.replace(/\s+/g, '-').toLowerCase()}/Chapter-${manhwa.maxChapter}" style="text-align: center; margin: 2px 0; flex: 1;">
                <p style="font-size: clamp(0.7rem, 1.2vw, 0.875rem); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Latest Chapter: ${manhwa.maxChapter}</p>
            </a>
            <hr style="width: 80%; margin: 2px auto;">
        `;
        manhwaContainer.appendChild(div);
    });

    // Step 4: Populate #latest-manhwa with the latest manhwa
    if (latestManhwa) {
        const div = document.createElement("div");
        div.style.cssText = "display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 200px; max-height: 270px; padding: 5px; box-sizing: border-box; flex: 1;";
        div.innerHTML = `
            <img src="${latestManhwa.cover_image}" style="width: 150px; height: 200px; object-fit: cover; display: block; margin: 2px auto;">
            <h4 style="font-size: clamp(0.6rem, 1.5vw, 1rem); margin: 2px 0; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-wrap:wrap; transform: scale(0.8);">${latestManhwa.title}</h4>
            <a href="${latestManhwa.title.replace(/\s+/g, '-').toLowerCase()}/Chapter-${latestManhwa.maxChapter}" style="text-align: center; margin: 2px 0; flex: 1;">
                <p style="font-size: clamp(0.7rem, 1.2vw, 0.875rem); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Latest Chapter: ${latestManhwa.maxChapter}</p>
            </a>
            <hr style="width: 80%; margin: 2px auto;">
        `;
        latestContainer.appendChild(div);
    }
})
.catch(error => console.error("Error fetching JSON:", error));