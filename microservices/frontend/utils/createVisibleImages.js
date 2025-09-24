// Script to create visible placeholder images for the demo
const fs = require('fs');
const path = require('path');

// Function to create a simple SVG that will be saved as PNG-like content
function createImagePlaceholder(name, width = 300, height = 200) {
  // Create a simple colored rectangle with text
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  const color = colors[name.length % colors.length];
  
  // Create SVG content
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="#333" stroke-width="2"/>
  <text x="50%" y="40%" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#333">${name}</text>
  <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">Placeholder Image</text>
</svg>`;
  
  return Buffer.from(svg, 'utf-8');
}

// List of product image names (without extension)
const imageNames = [
  'EclipsmartTravelRefractorTelescope',
  'LensCleaningKit', 
  'NationalParkFoundationExplorascope',
  'OpticalTubeAssembly',
  'RedFlashlight',
  'RoofBinoculars',
  'SolarFilter',
  'SolarSystemColorImager',
  'StarsenseExplorer',
  'TheCometBook'
];

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(path.dirname(imagesDir))) {
  fs.mkdirSync(path.dirname(imagesDir), { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create visible placeholder files for each product
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  
  // Create a visible placeholder with the product name
  const buffer = createImagePlaceholder(name);
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created visible placeholder for ${jpgPath}`);
});

// Also create the missing camera_lens.jpg that was being requested
const cameraLensPath = path.join(imagesDir, 'camera_lens.jpg');
const cameraBuffer = createImagePlaceholder('Camera Lens');
fs.writeFileSync(cameraLensPath, cameraBuffer);
console.log(`Created camera_lens.jpg placeholder at ${cameraLensPath}`);

console.log('All visible placeholder images created successfully!');