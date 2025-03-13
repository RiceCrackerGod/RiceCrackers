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

// Connect Wallet Functionality
const connectWalletBtn = document.getElementById('connect-wallet');
const connectWalletText = connectWalletBtn.querySelector('span');
let isConnecting = false;

connectWalletBtn.addEventListener('click', async () => {
  if (isConnecting) return;

  isConnecting = true;
  connectWalletText.textContent = 'Connecting...';
  connectWalletBtn.disabled = true;

  try {
    // This would be replaced with actual wallet connection logic
    // For example, using MetaMask or Web3.js
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Check if on Polygon network, switch if not
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // if (chainId !== '0x89') { // Polygon Mainnet
      //   // Switch to Polygon
      // }
      
      // Successfully connected
      connectWalletText.textContent = 'Connected';
      connectWalletBtn.classList.add('connected');
    } else {
      alert("Please install a compatible wallet like MetaMask to connect to the Polygon network.");
      connectWalletText.textContent = 'Connect Wallet';
    }
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    connectWalletText.textContent = 'Connect Wallet';
  } finally {
    isConnecting = false;
    connectWalletBtn.disabled = false;
  }
});

// Additional receiving addresses functionality
const addAddressBtn = document.getElementById('add-address-btn');
const addressContainer = document.getElementById('address-container');
let addressCount = 1;
const MAX_ADDRESSES = 5;

// Function to create a new address input field
function createAddressField(id) {
  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('input-field-container');
  fieldContainer.id = `address-field-${id}`;
  
  const label = document.createElement('label');
  label.classList.add('input-label');
  label.setAttribute('for', `mix_address_${id}`);
  label.textContent = `Additional address ${id - 1}`;
  
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `mix_address_${id}`;
  input.classList.add('mix-input');
  input.placeholder = 'Enter additional receiving address';
  
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-address-btn');
  removeBtn.innerHTML = '<i class="fas fa-times"></i>';
  removeBtn.setAttribute('aria-label', 'Remove address');
  removeBtn.onclick = function() {
    addressContainer.removeChild(fieldContainer);
    addressCount--;
    
    // Show the add button if we're below max
    if (addressCount < MAX_ADDRESSES) {
      addAddressBtn.style.display = 'inline-flex';
    }
    
    // Update the labels for all address fields
    updateAddressLabels();
  };
  
  fieldContainer.appendChild(label);
  fieldContainer.appendChild(input);
  fieldContainer.appendChild(removeBtn);
  
  return fieldContainer;
}

// Update the labels for all address fields to keep them sequential
function updateAddressLabels() {
  const fields = addressContainer.querySelectorAll('.input-field-container');
  fields.forEach((field, index) => {
    const label = field.querySelector('label');
    if (index === 0) {
      label.textContent = 'Address to receive mixed tokens';
    } else {
      label.textContent = `Additional address ${index}`;
    }
  });
}

// Add a new address field when the button is clicked
addAddressBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  if (addressCount < MAX_ADDRESSES) {
    addressCount++;
    const newField = createAddressField(addressCount);
    addressContainer.appendChild(newField);
    
    // Hide the add button if we reach the maximum
    if (addressCount >= MAX_ADDRESSES) {
      addAddressBtn.style.display = 'none';
    }
  }
});

// Fee selection affects the amount placeholder
const feeSelect = document.getElementById('mix_fee');
const amountInput = document.getElementById('mix_amount');

feeSelect.addEventListener('change', function() {
  const selectedFee = this.value;
  
  if (selectedFee === 'low') {
    amountInput.placeholder = amountInput.dataset.lowLimit;
  } else if (selectedFee === 'standard') {
    amountInput.placeholder = amountInput.dataset.standardLimit;
  } else if (selectedFee === 'high') {
    amountInput.placeholder = amountInput.dataset.highLimit;
  }
});

// Contract display functionality
const priceDisplay = document.querySelector('.price-display');
if (priceDisplay) {
  priceDisplay.addEventListener('click', () => {
    window.open('https://polygonscan.com/token/0x9d6432b17Bf74b3645b85760be95F7bCB550AB60', '_blank');
  });
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

// Add whitepaper button functionality
const whitepaperBtn = document.querySelector('.outline-btn');
if (whitepaperBtn) {
  whitepaperBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/RiceCrackerGod/RiceCrackers/blob/main/Untitled.txt', '_blank');
  });
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