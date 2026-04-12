// Main entry point - initializes and starts the game
// NOTE: This file is NOT loaded when using minecraft-full.js
// It's only needed when using the modular version with a bundler

// Initialize the game after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Initialize MineKhan
    if (typeof MineKhan === 'function') {
        init = MineKhan();
        
        // Cancel any existing animation frame from parent window
        if (window.parent.raf) {
            window.cancelAnimationFrame(window.parent.raf);
            console.log("Canceled", window.parent.raf);
        }
        
        // Start the game
        init();
    } else {
        console.error("MineKhan function not found!");
    }
});
