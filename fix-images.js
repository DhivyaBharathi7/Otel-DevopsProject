// Temporary fix for missing images in the OpenTelemetry demo
// Run this in the browser console to replace broken images with working ones

(function() {
    console.log('Starting image fix...');
    
    // Find all images and replace broken ones
    const images = document.querySelectorAll('img');
    let fixedCount = 0;
    
    images.forEach(img => {
        const src = img.src;
        
        // If image is broken or shows a tiny placeholder
        if (src.includes('/images/Banner.png')) {
            img.src = 'https://via.placeholder.com/800x200/4A90E2/ffffff?text=OpenTelemetry+Demo+Banner';
            img.alt = 'OpenTelemetry Demo Banner';
            fixedCount++;
            console.log('Fixed banner image');
        }
        
        if (src.includes('/images/opentelemetry-demo-logo.png')) {
            img.src = 'https://via.placeholder.com/300x100/FF6B6B/ffffff?text=OTel+Logo';
            img.alt = 'OpenTelemetry Logo';
            fixedCount++;
            console.log('Fixed logo image');
        }
        
        // Fix product images
        if (src.includes('/images/products/')) {
            const productName = src.split('/').pop().split('.')[0];
            img.src = `https://via.placeholder.com/300x300/2ECC71/ffffff?text=${productName}`;
            img.alt = productName;
            fixedCount++;
            console.log(`Fixed product image: ${productName}`);
        }
    });
    
    // Fix cart icon if it's missing
    const cartIcons = document.querySelectorAll('svg, img[src*="cart"], img[src*="Cart"]');
    cartIcons.forEach(icon => {
        if (icon.tagName === 'IMG' && (icon.src.includes('/icons/Cart') || icon.src.includes('/icons/cart'))) {
            // Replace with a simple cart emoji or Unicode
            const cartSpan = document.createElement('span');
            cartSpan.innerHTML = '🛒';
            cartSpan.style.fontSize = '24px';
            cartSpan.title = 'Cart';
            if (icon.parentNode) {
                icon.parentNode.replaceChild(cartSpan, icon);
                fixedCount++;
                console.log('Fixed cart icon');
            }
        }
    });
    
    console.log(`Image fix complete! Fixed ${fixedCount} images/icons.`);
    
    // Add some styling to make it look better
    const style = document.createElement('style');
    style.textContent = `
        img[src*="placeholder"] {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
    
})();