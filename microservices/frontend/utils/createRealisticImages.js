// Script to create realistic product placeholder images
const fs = require('fs');
const path = require('path');

// Function to create realistic product placeholder images
function createRealisticPlaceholder(productName, width = 300, height = 200) {
  // Product-specific styling
  const productStyles = {
    'EclipsmartTravelRefractorTelescope': { bg: '#f8f9fa', accent: '#2c3e50', shape: 'telescope' },
    'LensCleaningKit': { bg: '#fff5f5', accent: '#e53e3e', shape: 'kit' },
    'NationalParkFoundationExplorascope': { bg: '#f0fff4', accent: '#38a169', shape: 'telescope' },
    'OpticalTubeAssembly': { bg: '#fafafa', accent: '#4a5568', shape: 'tube' },
    'RedFlashlight': { bg: '#fff5f5', accent: '#e53e3e', shape: 'flashlight' },
    'RoofBinoculars': { bg: '#f7fafc', accent: '#2d3748', shape: 'binoculars' },
    'SolarFilter': { bg: '#fffbf0', accent: '#d69e2e', shape: 'filter' },
    'SolarSystemColorImager': { bg: '#f0f4ff', accent: '#3182ce', shape: 'camera' },
    'StarsenseExplorer': { bg: '#f7fafc', accent: '#2b6cb0', shape: 'telescope' },
    'TheCometBook': { bg: '#fdf6e3', accent: '#b7791f', shape: 'book' },
    'Camera Lens': { bg: '#f8f9fa', accent: '#4a5568', shape: 'lens' }
  };
  
  const style = productStyles[productName] || { bg: '#f8f9fa', accent: '#4a5568', shape: 'generic' };
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 248, g: 249, b: 250 };
  };
  
  const bgColor = hexToRgb(style.bg);
  const accentColor = hexToRgb(style.accent);
  
  // Create PNG with realistic product styling
  const createRealisticPNG = () => {
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
    
    // Create pixel data with product shapes
    const pixelData = Buffer.alloc(height * (width * 3 + 1));
    
    // Function to draw shapes based on product type
    const drawProductShape = (shape, centerX, centerY) => {
      switch (shape) {
        case 'telescope':
          // Draw telescope silhouette
          drawRectangle(centerX - 60, centerY - 10, 120, 20, accentColor); // Main tube
          drawRectangle(centerX - 70, centerY - 5, 20, 10, accentColor);   // Eyepiece
          drawRectangle(centerX + 50, centerY - 15, 20, 30, accentColor);  // Front end
          // Tripod legs
          drawLine(centerX - 20, centerY + 10, centerX - 40, centerY + 50, accentColor, 3);
          drawLine(centerX + 20, centerY + 10, centerX + 40, centerY + 50, accentColor, 3);
          drawLine(centerX, centerY + 10, centerX, centerY + 50, accentColor, 3);
          break;
          
        case 'binoculars':
          // Draw binoculars
          drawCircle(centerX - 25, centerY, 20, accentColor);
          drawCircle(centerX + 25, centerY, 20, accentColor);
          drawRectangle(centerX - 15, centerY - 5, 30, 10, accentColor);
          break;
          
        case 'flashlight':
          // Draw flashlight
          drawRectangle(centerX - 40, centerY - 8, 80, 16, accentColor);
          drawCircle(centerX + 40, centerY, 12, { r: 255, g: 255, b: 0 }); // Light end
          break;
          
        case 'book':
          // Draw book
          drawRectangle(centerX - 30, centerY - 20, 60, 40, accentColor);
          drawRectangle(centerX - 28, centerY - 18, 56, 36, bgColor);
          // Draw lines for pages
          for (let i = 0; i < 5; i++) {
            drawLine(centerX - 20, centerY - 10 + i * 4, centerX + 20, centerY - 10 + i * 4, accentColor, 1);
          }
          break;
          
        case 'lens':
          // Draw camera lens
          drawCircle(centerX, centerY, 35, accentColor);
          drawCircle(centerX, centerY, 25, bgColor);
          drawCircle(centerX, centerY, 15, accentColor);
          break;
          
        default:
          // Generic product shape
          drawRectangle(centerX - 40, centerY - 20, 80, 40, accentColor);
          drawCircle(centerX, centerY, 15, bgColor);
          break;
      }
    };
    
    // Helper functions for drawing shapes
    const drawRectangle = (x, y, w, h, color) => {
      for (let py = Math.max(0, y); py < Math.min(height, y + h); py++) {
        for (let px = Math.max(0, x); px < Math.min(width, x + w); px++) {
          setPixel(px, py, color);
        }
      }
    };
    
    const drawCircle = (centerX, centerY, radius, color) => {
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y <= radius * radius) {
            const px = centerX + x;
            const py = centerY + y;
            if (px >= 0 && px < width && py >= 0 && py < height) {
              setPixel(px, py, color);
            }
          }
        }
      }
    };
    
    const drawLine = (x1, y1, x2, y2, color, thickness = 1) => {
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = x1 < x2 ? 1 : -1;
      const sy = y1 < y2 ? 1 : -1;
      let err = dx - dy;
      
      let x = x1, y = y1;
      
      while (true) {
        for (let i = -thickness; i <= thickness; i++) {
          for (let j = -thickness; j <= thickness; j++) {
            const px = x + i, py = y + j;
            if (px >= 0 && px < width && py >= 0 && py < height) {
              setPixel(px, py, color);
            }
          }
        }
        
        if (x === x2 && y === y2) break;
        
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += sx; }
        if (e2 < dx) { err += dx; y += sy; }
      }
    };
    
    const setPixel = (x, y, color) => {
      const rowStart = y * (width * 3 + 1);
      const pixelStart = rowStart + 1 + x * 3;
      
      if (pixelStart < pixelData.length - 2) {
        pixelData[pixelStart] = color.r;
        pixelData[pixelStart + 1] = color.g;
        pixelData[pixelStart + 2] = color.b;
      }
    };
    
    // Fill background with subtle gradient
    for (let y = 0; y < height; y++) {
      const rowStart = y * (width * 3 + 1);
      pixelData[rowStart] = 0; // filter type
      
      for (let x = 0; x < width; x++) {
        const pixelStart = rowStart + 1 + x * 3;
        
        // Create subtle gradient background
        const gradientFactor = 1 - (y / height) * 0.1;
        pixelData[pixelStart] = Math.floor(bgColor.r * gradientFactor);
        pixelData[pixelStart + 1] = Math.floor(bgColor.g * gradientFactor);
        pixelData[pixelStart + 2] = Math.floor(bgColor.b * gradientFactor);
      }
    }
    
    // Draw product shape in center
    drawProductShape(style.shape, Math.floor(width / 2), Math.floor(height / 2));
    
    // Add subtle shadow effect
    const shadowColor = { r: 0, g: 0, b: 0 };
    for (let y = Math.floor(height * 0.8); y < height - 5; y++) {
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        const rowStart = y * (width * 3 + 1);
        const pixelStart = rowStart + 1 + x * 3;
        
        if (pixelStart < pixelData.length - 2) {
          // Blend shadow with existing color
          pixelData[pixelStart] = Math.floor(pixelData[pixelStart] * 0.9);
          pixelData[pixelStart + 1] = Math.floor(pixelData[pixelStart + 1] * 0.9);
          pixelData[pixelStart + 2] = Math.floor(pixelData[pixelStart + 2] * 0.9);
        }
      }
    }
    
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
  
  return createRealisticPNG();
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

// Create realistic product images
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  const buffer = createRealisticPlaceholder(name, 300, 200);
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created realistic placeholder for ${name} (${buffer.length} bytes)`);
});

// Create camera_lens.jpg
const cameraLensPath = path.join(imagesDir, 'camera_lens.jpg');
const cameraBuffer = createRealisticPlaceholder('Camera Lens', 300, 200);
fs.writeFileSync(cameraLensPath, cameraBuffer);
console.log(`Created realistic camera_lens.jpg placeholder (${cameraBuffer.length} bytes)`);

console.log('All realistic product placeholder images created successfully!');