// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create the slot machine instance
    const slotMachine = new SlotMachine();
    
    // Initialize the game
    slotMachine.init();
    
    // Console message for debugging
    console.log('Food Frenzy Slots initialized!');
  });