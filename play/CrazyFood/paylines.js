// Define the payline patterns for the slot machine
const paylinePatterns = [
    // Four horizontal lines (rows 1-4)
    {
      position: 20, // Row 1
      positions: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2] // Normalized positions (0-1) for each reel
    },
    {
      position: 40, // Row 2
      positions: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
    },
    {
      position: 60, // Row 3
      positions: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6]
    },
    {
      position: 80, // Row 4
      positions: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
    },
    
    // Special pattern #5 (based on diagram)
    // 5 in R1C1, R1C3, R2C2, R2C4, R2C5, R3C5, R4C6
    {
      position: 35,
      positions: [0.2, 0.4, 0.2, 0.4, 0.4, 0.8]
    },
    
    // Special pattern #6 (based on diagram)
    // 6 in R1C6, R2C5, R3C2, R3C4, R4C1, R4C3
    {
      position: 65,
      positions: [0.8, 0.6, 0.6, 0.6, 0.2, 0.2]
    }
  ];