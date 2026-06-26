function getAppBasePath() {
    if (typeof window === "undefined") return "";

    const { pathname } = window.location;

    if (!pathname) return "";

    const publicIndex = pathname.indexOf("/public/");
    if (publicIndex !== -1) {
        return pathname.slice(0, publicIndex + "/public".length);
    }

    if (pathname.endsWith("/public")) {
        return pathname.slice(0, pathname.length);
    }

    return "";
}

function withBasePath(path) {
    const basePath = getAppBasePath();
    return `${basePath}${path}`;
}

/**
 * Get proper image URL - handles both full URLs and filenames
 * @param {string} image - Image path (can be filename or full URL)
 * @param {string} folder - Storage folder (products, categories, etc)
 * @returns {string|null} - Proper image URL or null
 */
export function getImageUrl(image, folder = "products") {
    if (!image) return null;

    // If already a storage path, keep it
    if (image.startsWith("/storage/")) {
        return withBasePath(image);
    }

    // If backend returns absolute URL from a different host/port,
    // normalize it back to local storage path so it still works in XAMPP.
    if (image.startsWith("http://") || image.startsWith("https://")) {
        try {
            const normalizedUrl = new URL(image);
            if (normalizedUrl.pathname.startsWith("/storage/")) {
                return withBasePath(normalizedUrl.pathname);
            }
        } catch (error) {
            // Fallback to existing value if URL parsing fails.
            return image;
        }

        return image;
    }

    // Otherwise, prepend storage path
    return withBasePath(`/storage/${folder}/${image}`);
}

/**
 * Get product image URL
 * @param {string} image - Product image
 * @returns {string|null}
 */
export function getProductImageUrl(image) {
    return getImageUrl(image, "products");
}

/**
 * Get category image URL
 * @param {string} image - Category image
 * @returns {string|null}
 */
export function getCategoryImageUrl(image) {
    return getImageUrl(image, "category");
}

export default { getImageUrl, getProductImageUrl, getCategoryImageUrl };
