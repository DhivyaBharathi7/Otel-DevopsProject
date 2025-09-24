// Script to create proper product placeholder images with text and styling
const fs = require('fs');
const path = require('path');

// Function to create an HTML canvas-like structure and convert to PNG
function createProductPlaceholder(productName, width = 300, height = 200) {
  // Create SVG with proper product information
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  // Choose color based on product name
  const colorIndex = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Create a more product-like name display
  const displayName = productName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  // Split long names into multiple lines
  const words = displayName.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).length <= 20) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Create SVG with product-like styling
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
    </linearGradient>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="10" cy="10" r="1" fill="white" opacity="0.3"/>
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  
  <!-- Border -->
  <rect x="5" y="5" width="${width-10}" height="${height-10}" fill="none" stroke="white" stroke-width="2" opacity="0.8"/>
  
  <!-- Product placeholder icon -->
  <rect x="${width/2-30}" y="40" width="60" height="40" fill="white" opacity="0.9" rx="5"/>
  <rect x="${width/2-25}" y="45" width="50" height="30" fill="${bgColor}" opacity="0.7" rx="3"/>
  <circle cx="${width/2}" cy="60" r="8" fill="white" opacity="0.9"/>
  <circle cx="${width/2}" cy="60" r="5" fill="${bgColor}"/>
  
  <!-- Product name -->
  ${lines.map((line, index) => `
    <text x="50%" y="${110 + index * 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">
      ${line}
    </text>
  `).join('')}
  
  <!-- "Demo Product" label -->
  <text x="50%" y="${130 + lines.length * 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" opacity="0.8">
    Demo Product Image
  </text>
  
  <!-- Decorative elements -->
  <circle cx="20" cy="20" r="3" fill="white" opacity="0.6"/>
  <circle cx="${width-20}" cy="20" r="3" fill="white" opacity="0.6"/>
  <circle cx="20" cy="${height-20}" r="3" fill="white" opacity="0.6"/>
  <circle cx="${width-20}" cy="${height-20}" r="3" fill="white" opacity="0.6"/>
</svg>`;

  return Buffer.from(svg, 'utf-8');
}

// Function to convert SVG to a more PNG-like format by creating a data URL
function createBetterPlaceholder(productName, width = 300, height = 200) {
  const colors = [
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#34495E', '#E67E22', '#95A5A6', '#16A085'
  ];
  
  const colorIndex = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Create a simple but informative placeholder
  const displayName = productName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  // For now, let's create a simple text-based image
  // This creates a minimal PNG with just a colored background
  const createSimplePNG = () => {
    // PNG signature
    let png = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // Convert hex color to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0);
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr.writeUInt8(8, 16);   // bit depth
    ihdr.writeUInt8(2, 17);   // color type (RGB)
    ihdr.writeUInt8(0, 18);   // compression
    ihdr.writeUInt8(0, 19);   // filter
    ihdr.writeUInt8(0, 20);   // interlace
    
    // Simple CRC32 calculation
    const crc32 = require('zlib').crc32;
    const ihdrCrc = crc32(ihdr.slice(4, 21));
    ihdr.writeUInt32BE(ihdrCrc, 21);
    png = Buffer.concat([png, ihdr]);
    
    // Create pixel data with gradient effect
    const pixelData = Buffer.alloc(height * (width * 3 + 1));
    for (let y = 0; y < height; y++) {
      const rowStart = y * (width * 3 + 1);
      pixelData[rowStart] = 0; // filter type
      
      for (let x = 0; x < width; x++) {
        const pixelStart = rowStart + 1 + x * 3;
        
        // Create a simple gradient and border effect
        const borderSize = 5;
        const isBorder = x < borderSize || x >= width - borderSize || y < borderSize || y >= height - borderSize;
        const isInner = x > borderSize + 10 && x < width - borderSize - 10 && y > borderSize + 10 && y < height - borderSize - 10;
        
        if (isBorder) {
          // White border
          pixelData[pixelStart] = 255;
          pixelData[pixelStart + 1] = 255;
          pixelData[pixelStart + 2] = 255;
        } else if (isInner) {
          // Slightly darker center
          pixelData[pixelStart] = Math.max(0, r - 30);
          pixelData[pixelStart + 1] = Math.max(0, g - 30);
          pixelData[pixelStart + 2] = Math.max(0, b - 30);
        } else {
          // Main color
          pixelData[pixelStart] = r;
          pixelData[pixelStart + 1] = g;
          pixelData[pixelStart + 2] = b;
        }
      }
    }
    
    // Compress and add IDAT chunk
    const zlib = require('zlib');
    const compressedData = zlib.deflateSync(pixelData);
    
    const idat = Buffer.alloc(compressedData.length + 12);
    idat.writeUInt32BE(compressedData.length, 0);
    idat.write('IDAT', 4);
    compressedData.copy(idat, 8);
    const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressedData]));
    idat.writeUInt32BE(idatCrc, 8 + compressedData.length);
    png = Buffer.concat([png, idat]);
    
    // IEND chunk
    const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
    png = Buffer.concat([png, iend]);
    
    return png;
  };
  
  return createSimplePNG();
}

// List of product image names
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

// Create the images directory
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(path.dirname(imagesDir))) {
  fs.mkdirSync(path.dirname(imagesDir), { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create better placeholder images
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  const buffer = createBetterPlaceholder(name, 300, 200);
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created better placeholder for ${name} (${buffer.length} bytes)`);
});

// Create camera_lens.jpg
const cameraLensPath = path.join(imagesDir, 'camera_lens.jpg');
const cameraBuffer = createBetterPlaceholder('Camera Lens', 300, 200);
fs.writeFileSync(cameraLensPath, cameraBuffer);
console.log(`Created camera_lens.jpg placeholder (${cameraBuffer.length} bytes)`);

console.log('All better placeholder images created successfully!');