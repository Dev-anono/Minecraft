// Global configuration
window.canvas = document.getElementById("overlay");
window.ctx = canvas.getContext("2d");
window.savebox = document.getElementById("savebox");
window.boxCenterTop = document.getElementById("boxcentertop");
window.saveDirections = document.getElementById("savedirections");
window.message = document.getElementById("message");
window.worlds = document.getElementById("worlds");
window.quota = document.getElementById("quota");
var hoverbox = document.getElementById("onhover");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// Preserve global Math reference
var MathGlob = Math;
