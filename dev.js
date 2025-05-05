// dev.js
console.log("🚀 Starting development server...\n");

try {
  require('./index.js'); // Runs your main app file
} catch (error) {
  console.error("❌ Failed to start index.js");
  console.error(error.message);
}
