// Script to create placeholder images with product names overlaid
const fs = require('fs');
const path = require('path');

// Function to create PNG with text overlay using a simple text-to-image approach
function createImageWithText(productName, width = 300, height = 200) {
  // Create a more readable product name
  const displayName = productName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
  
  // Colors for different products
  const colors = [
    {bg: '#3498DB', text: '#FFFFFF'}, // Blue
    {bg: '#E74C3C', text: '#FFFFFF'}, // Red
    {bg: '#2ECC71', text: '#FFFFFF'}, // Green
    {bg: '#F39C12', text: '#FFFFFF'}, // Orange
    {bg: '#9B59B6', text: '#FFFFFF'}, // Purple
    {bg: '#1ABC9C', text: '#FFFFFF'}, // Teal
    {bg: '#34495E', text: '#FFFFFF'}, // Dark gray
    {bg: '#E67E22', text: '#FFFFFF'}, // Dark orange
    {bg: '#95A5A6', text: '#FFFFFF'}, // Light gray
    {bg: '#16A085', text: '#FFFFFF'}  // Dark teal
  ];
  
  const colorIndex = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const selectedColor = colors[colorIndex];
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const bgColor = hexToRgb(selectedColor.bg);
  
  // Create PNG buffer
  const createPNGWithText = () => {
    // PNG signature
    let png = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
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
    
    const crc32 = require('zlib').crc32;
    const ihdrCrc = crc32(ihdr.slice(4, 21));
    ihdr.writeUInt32BE(ihdrCrc, 21);
    png = Buffer.concat([png, ihdr]);
    
    // Create pixel data with text-like pattern
    const pixelData = Buffer.alloc(height * (width * 3 + 1));
    
    // Simple font-like pattern for text (very basic)
    const drawText = (text, startX, startY) => {
      const charWidth = 8;
      const charHeight = 12;
      
      // Simple letter patterns (very basic 5x7 pixel patterns)
      const letterPatterns = {
        'A': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'B': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
        'C': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
        'E': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        'L': [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'S': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        ' ': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
      };
      
      for (let i = 0; i < Math.min(text.length, 30); i++) {
        const char = text[i].toUpperCase();
        const pattern = letterPatterns[char] || letterPatterns[' '];
        const charX = startX + i * 6;
        
        if (charX + 5 >= width) break;
        
        for (let row = 0; row < 7; row++) {
          for (let col = 0; col < 5; col++) {
            const pixelX = charX + col;
            const pixelY = startY + row;
            
            if (pixelX < width && pixelY < height && pattern[row][col]) {
              const rowStart = pixelY * (width * 3 + 1);
              const pixelStart = rowStart + 1 + pixelX * 3;
              
              if (pixelStart < pixelData.length - 2) {
                pixelData[pixelStart] = 255;     // R - white text
                pixelData[pixelStart + 1] = 255; // G
                pixelData[pixelStart + 2] = 255; // B
              }
            }
          }
        }
      }
    };
    
    // Fill background and draw text
    for (let y = 0; y < height; y++) {
      const rowStart = y * (width * 3 + 1);
      pixelData[rowStart] = 0; // filter type
      
      for (let x = 0; x < width; x++) {
        const pixelStart = rowStart + 1 + x * 3;
        
        // Background color with slight gradient
        const gradientFactor = 1 - (y / height) * 0.2;
        pixelData[pixelStart] = Math.floor(bgColor.r * gradientFactor);
        pixelData[pixelStart + 1] = Math.floor(bgColor.g * gradientFactor);
        pixelData[pixelStart + 2] = Math.floor(bgColor.b * gradientFactor);
      }
    }
    
    // Add border
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < 3; y++) { // Top border
        const rowStart = y * (width * 3 + 1);
        const pixelStart = rowStart + 1 + x * 3;
        if (pixelStart < pixelData.length - 2) {
          pixelData[pixelStart] = 255;
          pixelData[pixelStart + 1] = 255;
          pixelData[pixelStart + 2] = 255;
        }
      }
      for (let y = height - 3; y < height; y++) { // Bottom border
        const rowStart = y * (width * 3 + 1);
        const pixelStart = rowStart + 1 + x * 3;
        if (pixelStart < pixelData.length - 2) {
          pixelData[pixelStart] = 255;
          pixelData[pixelStart + 1] = 255;
          pixelData[pixelStart + 2] = 255;
        }
      }
    }
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < 3; x++) { // Left border
        const rowStart = y * (width * 3 + 1);
        const pixelStart = rowStart + 1 + x * 3;
        if (pixelStart < pixelData.length - 2) {
          pixelData[pixelStart] = 255;
          pixelData[pixelStart + 1] = 255;
          pixelData[pixelStart + 2] = 255;
        }
      }
      for (let x = width - 3; x < width; x++) { // Right border
        const rowStart = y * (width * 3 + 1);
        const pixelStart = rowStart + 1 + x * 3;
        if (pixelStart < pixelData.length - 2) {
          pixelData[pixelStart] = 255;
          pixelData[pixelStart + 1] = 255;
          pixelData[pixelStart + 2] = 255;
        }
      }
    }
    
    // Draw product name (split into multiple lines if needed)
    const words = displayName.split(' ');
    const linesOfText = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).length <= 25) {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      } else {
        if (currentLine) linesOfText.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) linesOfText.push(currentLine);
    
    // Draw each line of text
    const startY = Math.floor(height / 2) - (linesOfText.length * 8);
    linesOfText.forEach((line, index) => {
      const textY = Math.max(20, startY + index * 16);
      const textX = Math.max(10, Math.floor((width - line.length * 6) / 2));
      drawText(line, textX, textY);
    });
    
    // Add "DEMO" text at bottom
    drawText('DEMO PRODUCT', Math.floor((width - 12 * 6) / 2), height - 25);
    
    // Compress data
    const zlib = require('zlib');
    const compressedData = zlib.deflateSync(pixelData);
    
    // IDAT chunk
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
  
  return createPNGWithText();
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

// Create images with product names
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  const buffer = createImageWithText(name, 300, 200);
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created ${name} with text overlay (${buffer.length} bytes)`);
});

// Create camera_lens.jpg
const cameraLensPath = path.join(imagesDir, 'camera_lens.jpg');
const cameraBuffer = createImageWithText('Camera Lens', 300, 200);
fs.writeFileSync(cameraLensPath, cameraBuffer);
console.log(`Created camera_lens.jpg with text overlay (${cameraBuffer.length} bytes)`);

console.log('All product images with text overlays created successfully!');