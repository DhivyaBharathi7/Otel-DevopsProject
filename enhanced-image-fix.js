// Enhanced image fix script for OpenTelemetry demo
// Run this in the browser console (F12 > Console)

(function() {
    console.log('Starting enhanced image fix...');
    
    // Function to replace broken images
    function fixImage(img, newSrc, description) {
        const originalSrc = img.src;
        img.src = newSrc;
        img.style.border = '2px solid #ddd';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        console.log(`Fixed ${description}: ${originalSrc} -> ${newSrc}`);
    }
    
    // Fix all images with a delay to ensure DOM is loaded
    setTimeout(() => {
        // Fix banner images
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            
            // Banner images
            if (src.includes('Banner.png') || src.includes('banner')) {
                fixImage(img, 'https://via.placeholder.com/800x200/4A90E2/ffffff?text=OpenTelemetry+Demo+Banner', 'Banner');
            }
            
            // Logo images
            if (src.includes('logo.png') || src.includes('opentelemetry-demo-logo')) {
                fixImage(img, 'https://via.placeholder.com/300x100/FF6B6B/ffffff?text=OpenTelemetry+Logo', 'Logo');
            }
            
            // Product images
            if (src.includes('/images/products/') || src.includes('product')) {
                const productName = img.alt || 'Product';
                fixImage(img, `https://via.placeholder.com/300x300/2ECC71/ffffff?text=${encodeURIComponent(productName)}`, `Product: ${productName}`);
            }
            
            // Any other broken images (small white squares, error images)
            if (img.naturalWidth === 0 || img.naturalHeight === 0 || src.includes('data:image') || img.complete === false) {
                fixImage(img, 'https://via.placeholder.com/300x200/9B59B6/ffffff?text=Image+Not+Found', 'Broken Image');
            }
        });
        
        // Fix cart icons (SVG or missing icons)
        document.querySelectorAll('[data-testid*="cart"], .cart-icon, *[class*="cart"]').forEach(element => {
            if (element.tagName === 'IMG' || element.tagName === 'SVG') {
                const cartIcon = document.createElement('span');
                cartIcon.innerHTML = '🛒';
                cartIcon.style.fontSize = '24px';
                cartIcon.style.cursor = 'pointer';
                cartIcon.title = 'Shopping Cart';
                element.parentNode?.replaceChild(cartIcon, element);
                console.log('Fixed cart icon');
            }
        });
        
        // Look for any elements that might be cart icons based on their position/class
        document.querySelectorAll('header img, nav img, .header img').forEach(img => {
            if (img.src.includes('cart') || img.src.includes('Cart') || img.alt?.toLowerCase().includes('cart')) {
                const cartIcon = document.createElement('span');
                cartIcon.innerHTML = '🛒';
                cartIcon.style.fontSize = '24px';
                cartIcon.style.cursor = 'pointer';
                cartIcon.title = 'Shopping Cart';
                img.parentNode?.replaceChild(cartIcon, img);
                console.log('Fixed header cart icon');
            }
        });
        
        console.log('Enhanced image fix completed!');
        
        // Re-run the fix every 5 seconds for dynamically loaded content
        setTimeout(arguments.callee, 5000);
        
    }, 1000);
    
    // Also fix images when new ones are loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                    images.forEach(img => {
                        if (img.src.includes('/images/') && (img.naturalWidth === 0 || img.src.includes('13.203.200.147'))) {
                            setTimeout(() => {
                                if (img.naturalWidth === 0) {
                                    fixImage(img, 'https://via.placeholder.com/300x200/E74C3C/ffffff?text=Product+Image', 'Dynamic Product');
                                }
                            }, 500);
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Image fix observer started');
})();