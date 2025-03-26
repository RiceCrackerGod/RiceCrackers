/**
 * Paylines configuration for the Fortune Dragon slot machine
 * Each payline defines a pattern of positions across the reels
 * Format: Array of [column, row] coordinates, with:
 * - columns: 1-6 (left to right)
 * - rows: 1-3 (top to bottom)
 */
const PAYLINES = [
    // 1. Wave Pattern (Water Flow)
    // Path: (1,2) → (2,1) → (3,2) → (4,3) → (5,4) → (6,3)
    // For our grid, we'll adjust this to a 6x3 grid (1-indexed):
    [[0, 1], [1, 0], [2, 1], [3, 2], [4, 2], [5, 1]],
    
    // 2. Double Happiness (Symmetric Peaks)
    // Path: (1,4) → (2,2) → (3,1) → (4,1) → (5,2) → (6,4)
    // Adjusted for 6x3 grid:
    [[0, 2], [1, 1], [2, 0], [3, 0], [4, 1], [5, 2]],
    
    // 3. Dragon's Spine (Undulating Path)
    // Path: (1,1) → (2,3) → (3,2) → (4,4) → (5,3) → (6,1)
    // Adjusted for 6x3 grid:
    [[0, 0], [1, 2], [2, 1], [3, 2], [4, 1], [5, 0]],
    
    // 4. Coin Stack (Vertical Emphasis)
    // Path: (1,3) → (2,4) → (3,3) → (4,2) → (5,1) → (6,2)
    // Adjusted for 6x3 grid:
    [[0, 2], [1, 2], [2, 1], [3, 0], [4, 0], [5, 1]],
    
    // 5. Lantern Glow (Alternating Heights)
    // Path: (1,4) → (2,1) → (3,3) → (4,2) → (5,4) → (6,1)
    // Adjusted for 6x3 grid:
    [[0, 2], [1, 0], [2, 2], [3, 1], [4, 2], [5, 0]],
    
    // 6. Phoenix Rise (Ascending Curve)
    // Path: (1,4) → (2,4) → (3,3) → (4,2) → (5,1) → (6,1)
    // Adjusted for 6x3 grid:
    [[0, 2], [1, 2], [2, 1], [3, 0], [4, 0], [5, 0]]
];

// Visual rendering settings for paylines
const PAYLINE_COLORS = [
    '#FF5722', // Orange-Red for Wave Pattern
    '#E91E63', // Pink for Double Happiness
    '#673AB7', // Deep Purple for Dragon's Spine
    '#2196F3', // Blue for Coin Stack
    '#00BCD4', // Cyan for Lantern Glow
    '#8BC34A'  // Light Green for Phoenix Rise
];

/**
 * Generates path coordinates for drawing paylines on the grid
 * @param {Array} payline - Array of [column, row] coordinates
 * @param {Object} gridDimensions - { cellWidth, cellHeight, padding }
 * @returns {Array} - Array of [x, y] coordinates for drawing
 */
function generatePaylinePath(payline, gridDimensions) {
    const { cellWidth, cellHeight, padding } = gridDimensions;
    
    return payline.map(([col, row]) => {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        return [x, y];
    });
}

/**
 * Creates SVG path string from payline coordinates
 * @param {Array} pathCoords - Array of [x, y] coordinates
 * @returns {String} - SVG path string
 */
function createSVGPath(pathCoords) {
    let pathString = `M ${pathCoords[0][0]} ${pathCoords[0][1]}`;
    
    for (let i = 1; i < pathCoords.length; i++) {
        pathString += ` L ${pathCoords[i][0]} ${pathCoords[i][1]}`;
    }
    
    return pathString;
}

/**
 * Generates preview SVG paths for payline selection UI
 * @param {Number} paylineIndex - Index of the payline to preview
 * @param {Element} container - Container element for the preview
 */
function generatePaylinePreview(paylineIndex, container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Grid dimensions for preview (scaled down version)
    const previewDimensions = {
        cellWidth: width / 6,
        cellHeight: height / 3,
        padding: 0
    };
    
    const pathCoords = generatePaylinePath(PAYLINES[paylineIndex], previewDimensions);
    const pathString = createSVGPath(pathCoords);
    const color = PAYLINE_COLORS[paylineIndex];
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    // Add a grid background to make it more visually appealing
    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 3; row++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", col * previewDimensions.cellWidth);
            rect.setAttribute("y", row * previewDimensions.cellHeight);
            rect.setAttribute("width", previewDimensions.cellWidth);
            rect.setAttribute("height", previewDimensions.cellHeight);
            rect.setAttribute("fill", "rgba(0, 0, 0, 0.2)");
            rect.setAttribute("stroke", "rgba(212, 175, 55, 0.3)");
            rect.setAttribute("stroke-width", "1");
            gridGroup.appendChild(rect);
        }
    }
    svg.appendChild(gridGroup);
    
    // Add points at each cell with improved visibility
    pathCoords.forEach(([x, y], idx) => {
        // Add number label for the sequence
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y + 1); // Small adjustment for centering
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "#fff");
        text.setAttribute("font-size", "10");
        text.setAttribute("font-weight", "bold");
        text.textContent = idx + 1;
        
        // Add glow for the point
        const pointGlow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pointGlow.setAttribute("cx", x);
        pointGlow.setAttribute("cy", y);
        pointGlow.setAttribute("r", 8);
        pointGlow.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
        svg.appendChild(pointGlow);
        
        // Add the main point
        const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", 6);
        point.setAttribute("fill", color);
        svg.appendChild(point);
        
        svg.appendChild(text);
    });
    
    // Add connecting path with animation
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathString);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", 3);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "5,3");
    path.setAttribute("stroke-linecap", "round");
    path.style.animation = "dash 3s linear infinite";
    svg.appendChild(path);
    
    // Add a title with the payline name
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `${document.querySelector(`[data-payline="${paylineIndex}"] .payline-name`).textContent} Payline`;
    svg.appendChild(title);
    
    container.innerHTML = '';
    container.appendChild(svg);
}

/**
 * Initializes payline previews in the UI
 */
function initPaylinePreviews() {
    const previewContainers = document.querySelectorAll('.payline-preview');
    
    previewContainers.forEach((container, index) => {
        generatePaylinePreview(index, container);
    });
}

/**
 * Checks if a spin result matches any paylines
 * @param {Array} results - 2D array of spin results [column][row]
 * @returns {Array} - Array of winning payline indices
 */
function checkPaylines(results) {
    const winningPaylines = [];
    
    PAYLINES.forEach((payline, index) => {
        // Get the value of the first position in the payline
        const firstPos = payline[0];
        const firstValue = results[firstPos[0]][firstPos[1]];
        
        // Check if all positions in the payline have the same value
        const isWinningLine = payline.every(([col, row]) => {
            return results[col][row] === firstValue;
        });
        
        if (isWinningLine) {
            winningPaylines.push(index);
        }
    });
    
    return winningPaylines;
}

/**
 * Renders winning paylines on the overlay
 * @param {Array} winningPaylines - Array of winning payline indices
 * @param {Element} overlay - Overlay element for drawing paylines
 */
function renderWinningPaylines(winningPaylines, overlay) {
    // Clear existing paylines
    overlay.innerHTML = '';
    
    if (winningPaylines.length === 0) return;
    
    // Make sure the overlay has the right positioning and dimensions
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "50";
    
    const width = overlay.clientWidth;
    const height = overlay.clientHeight;
    
    const gridDimensions = {
        cellWidth: width / 6,
        cellHeight: height / 3,
        padding: 0
    };
    
    // Create SVG container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    
    // Add each winning payline
    winningPaylines.forEach(index => {
        const pathCoords = generatePaylinePath(PAYLINES[index], gridDimensions);
        const pathString = createSVGPath(pathCoords);
        const color = PAYLINE_COLORS[index];
        
        // Create path element - make it more visible
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathString);
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", 8); // Increased thickness
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("class", "winning-payline");
        
        // No glow filter - removed as requested
        
        // Add larger dots at intersection points
        pathCoords.forEach(([x, y]) => {
            // Removed outer glow for dots
            
            // Inner dot
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", x);
            dot.setAttribute("cy", y);
            dot.setAttribute("r", 8); // Increased radius
            dot.setAttribute("fill", color);
            dot.setAttribute("class", "winning-dot");
            svg.appendChild(dot);
            
            // Add animation to the dots
            dot.style.animation = "pulse 0.8s infinite alternate";
        });
        
        // Animate the path with more visible effect
        path.style.animation = "glow 1s infinite alternate";
        
        svg.appendChild(path);
    });
    
    overlay.appendChild(svg);
}

// Initialize payline previews when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPaylinePreviews);
