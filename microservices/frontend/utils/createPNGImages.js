// Script to create actual PNG placeholder images for the demo
const fs = require('fs');
const path = require('path');

// Function to create a simple PNG image buffer
function createPNGPlaceholder(name, width = 300, height = 200) {
  // Create a simple PNG header and IDAT chunk for a colored rectangle
  // This creates a minimal valid PNG with a solid color
  const colors = [
    [255, 107, 107], [78, 205, 196], [69, 183, 209], [150, 206, 180], [255, 234, 167],
    [221, 160, 221], [152, 216, 200], [247, 220, 111], [187, 143, 206], [133, 193, 233]
  ];
  const color = colors[name.length % colors.length];
  
  // Create a minimal PNG with solid color
  // PNG signature
  let png = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk (image header)
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);  // width
  ihdr.writeUInt32BE(height, 12); // height
  ihdr.writeUInt8(8, 16);   // bit depth
  ihdr.writeUInt8(2, 17);   // color type (2 = RGB)
  ihdr.writeUInt8(0, 18);   // compression
  ihdr.writeUInt8(0, 19);   // filter
  ihdr.writeUInt8(0, 20);   // interlace
  
  // Calculate CRC32 for IHDR
  const crc32 = require('zlib').crc32;
  const ihdrCrc = crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(ihdrCrc, 21);
  
  png = Buffer.concat([png, ihdr]);
  
  // Simple IDAT chunk with compressed pixel data (solid color)
  const pixelData = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    pixelData[rowStart] = 0; // filter type
    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 3;
      pixelData[pixelStart] = color[0];     // R
      pixelData[pixelStart + 1] = color[1]; // G
      pixelData[pixelStart + 2] = color[2]; // B
    }
  }
  
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

// Create actual PNG files for each product
imageNames.forEach(name => {
  const jpgPath = path.join(imagesDir, `${name}.jpg`);
  
  // Create a colored PNG image
  const buffer = createPNGPlaceholder(name);
  fs.writeFileSync(jpgPath, buffer);
  console.log(`Created PNG placeholder for ${jpgPath} (${buffer.length} bytes)`);
});

// Also create the missing camera_lens.jpg that was being requested
const cameraLensPath = path.join(imagesDir, 'camera_lens.jpg');
const cameraBuffer = createPNGPlaceholder('Camera Lens');
fs.writeFileSync(cameraLensPath, cameraBuffer);
console.log(`Created camera_lens.jpg PNG placeholder at ${cameraLensPath} (${cameraBuffer.length} bytes)`);

console.log('All PNG placeholder images created successfully!');