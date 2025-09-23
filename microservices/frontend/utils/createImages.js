// Script to create placeholder images for the demo
const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel transparent PNG in base64
const transparentPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAWA0ddgAAAABJRU5ErkJggg==';

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

// Create JPG files for each product
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  
  // Create a simple placeholder image by converting the transparent PNG to buffer
  const buffer = Buffer.from(transparentPNG, 'base64');
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created ${jpgPath}`);
});

console.log('All placeholder images created successfully!');