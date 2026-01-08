/**
 * Checks if WebGL is available and supported by the current environment.
 * @returns {boolean} True if WebGL is supported, false otherwise.
 */
export function isWebGLAvailable(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

/**
 * Checks if the device is likely to be a low-end mobile device based on concurrency
 * or user agent strings, which might struggle with heavy 3D.
 * @returns {boolean} True if likely low-end/mobile that should fallback.
 */
export function isLowPerformanceDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    // Low concurrency (likely older mobile)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        return true; 
    }
    
    // User Agent check for specific constrained environments (optional)
    return false;
}
