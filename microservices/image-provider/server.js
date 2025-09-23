const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.IMAGE_PROVIDER_PORT || 8081;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve images with query parameter support for width and quality
app.get('/*', (req, res) => {
  const { w: width, q: quality } = req.query;
  const imagePath = req.path;
  
  console.log(`Image request: ${imagePath} (w=${width}, q=${quality})`);
  
  // Try to find the image in the frontend public directory
  const frontendPublicPath = path.join(__dirname, '../../frontend/public', imagePath);
  
  if (fs.existsSync(frontendPublicPath)) {
    // For now, just serve the original image without optimization
    res.sendFile(frontendPublicPath);
  } else {
    // If image doesn't exist, send a 1x1 transparent PNG
    const transparentPNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAWA0ddgAAAABJRU5ErkJggg==',
      'base64'
    );
    res.set('Content-Type', 'image/png');
    res.send(transparentPNG);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Image provider listening on port ${PORT}`);
});