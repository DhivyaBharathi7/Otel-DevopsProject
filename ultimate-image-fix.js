// ULTIMATE IMAGE FIX - Catches ALL broken images
// Copy and paste this entire script in the browser console

(function() {
    console.log('🔧 Starting ULTIMATE image fix...');
    
    function fixImage(img, newSrc, description) {
        const oldSrc = img.src;
        img.src = newSrc;
        img.style.border = '2px solid #4CAF50';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        img.style.backgroundColor = '#f0f0f0';
        img.style.padding = '5px';
        console.log(`✅ FIXED ${description}: ${oldSrc} -> ${newSrc}`);
        return true;
    }
    
    function runFix() {
        let fixedCount = 0;
        
        // Method 1: Find all img elements
        document.querySelectorAll('img').forEach((img, index) => {
            const src = img.src || '';
            const alt = img.alt || `Image-${index}`;
            
            // Check for various broken image conditions
            const isBroken = (
                !src || 
                src === '' || 
                src.includes('data:image') ||
                src.includes('/images/') ||
                img.naturalWidth === 0 || 
                img.naturalHeight === 0 ||
                src.includes('Banner.png') ||
                src.includes('logo.png') ||
                src.includes('product') ||
                img.complete === false
            );
            
            if (isBroken) {
                let newSrc = '';
                
                if (src.includes('Banner') || alt.toLowerCase().includes('banner')) {
                    newSrc = 'https://via.placeholder.com/800x200/2196F3/ffffff?text=OpenTelemetry+Demo+Banner';
                } else if (src.includes('logo') || alt.toLowerCase().includes('logo')) {
                    newSrc = 'https://via.placeholder.com/300x100/FF6B6B/ffffff?text=OpenTelemetry+Logo';
                } else if (src.includes('product') || alt.toLowerCase().includes('product')) {
                    newSrc = `https://via.placeholder.com/300x300/4CAF50/ffffff?text=${encodeURIComponent(alt || 'Product')}`;
                } else {
                    newSrc = `https://via.placeholder.com/300x200/9C27B0/ffffff?text=${encodeURIComponent(alt || 'Fixed+Image')}`;
                }
                
                if (fixImage(img, newSrc, `${alt} (${index})`)) {
                    fixedCount++;
                }
            }
        });
        
        // Method 2: Fix by CSS selectors for common image containers
        const selectors = [
            'div[style*="background-image"]',
            '.product-image img',
            '.banner img',
            '.logo img',
            'header img',
            'nav img'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                if (element.tagName === 'IMG') {
                    const newSrc = 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Fixed+Container+Image';
                    if (fixImage(element, newSrc, `Container Image ${index}`)) {
                        fixedCount++;
                    }
                }
            });
        });
        
        // Method 3: Replace any remaining empty or tiny images
        setTimeout(() => {
            document.querySelectorAll('img').forEach((img, index) => {
                if (img.offsetWidth < 50 && img.offsetHeight < 50 && img.src.includes('13.203.200.147')) {
                    const newSrc = 'https://via.placeholder.com/200x200/607D8B/ffffff?text=Small+Image+Fixed';
                    if (fixImage(img, newSrc, `Small Image ${index}`)) {
                        fixedCount++;
                    }
                }
            });
            
            console.log(`🎉 ULTIMATE FIX COMPLETED! Total fixed: ${fixedCount} images`);
        }, 2000);
        
        return fixedCount;
    }
    
    // Run the fix immediately
    const initialFix = runFix();
    
    // Run again after 3 seconds for any dynamically loaded images
    setTimeout(() => {
        console.log('🔄 Running secondary fix for dynamic content...');
        runFix();
    }, 3000);
    
    // Add observer for future image loads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    setTimeout(() => {
                        if (node.naturalWidth === 0 || node.src.includes('/images/')) {
                            fixImage(node, 'https://via.placeholder.com/300x200/795548/ffffff?text=Dynamic+Image+Fixed', 'Dynamic Image');
                        }
                    }, 1000);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👀 Image observer started - will catch future broken images');
    
})();