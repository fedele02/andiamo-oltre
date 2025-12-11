import SHA1 from 'crypto-js/sha1';

/**
 * Upload an image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<{url, error}>}
 */
export async function uploadImage(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
        return {
            url: null,
            error: 'Missing Cloudinary configuration. Check your .env file.'
        }
    }

    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data = await response.json()

        return { url: data.secure_url, error: null }
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        return { url: null, error: error.message }
    }
}

/**
 * Upload a generic file (PDF, Doc, etc.) to Cloudinary
 * @param {File} file - File to upload
 * @returns {Promise<{url, name, error}>}
 */
export async function uploadFile(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
        return {
            url: null,
            error: 'Missing Cloudinary configuration.'
        }
    }

    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)
        // Generate a unique public_id that includes the original extension
        // This replaces 'use_filename' which is not allowed in unsigned uploads
        // We sanitize the filename slightly to avoid issues, but keep the extension
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueFileName = `${Date.now()}_${safeName}`;
        formData.append('public_id', uniqueFileName);
        
        // Determine resource type
        // We use 'raw' for documents (including PDFs) to ensure they are stored as files
        // We use 'image' only for actual images
        const isImage = file.type.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`)
        }

        const data = await response.json()

        return { 
            url: data.secure_url, 
            name: file.name, // Return original filename
            error: null 
        }
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error)
        return { url: null, error: error.message }
    }
}

/**
 * Upload multiple files to Cloudinary
 * @param {FileList|Array<File>} files - Array of files
 * @returns {Promise<{files: Array<{url, name}>, error}>}
 */
export async function uploadMultipleFiles(files) {
    try {
        const uploadPromises = Array.from(files).map(file => uploadFile(file))
        const results = await Promise.all(uploadPromises)

        const errors = results.filter(res => res.error)
        if (errors.length > 0) {
            return { files: [], error: errors[0].error }
        }

        const uploadedFiles = results.map(res => ({
            url: res.url,
            name: res.name
        }))

        return { files: uploadedFiles, error: null }
    } catch (error) {
        return { files: [], error: error.message }
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param {FileList|Array<File>} files - Array of image files
 * @returns {Promise<{urls, error}>}
 */
export async function uploadMultipleImages(files) {
    try {
        const uploadPromises = Array.from(files).map(file => uploadImage(file))
        const results = await Promise.all(uploadPromises)

        // Check if any upload failed
        const failedUpload = results.find(result => result.error)
        if (failedUpload) {
            throw new Error(failedUpload.error)
        }

        const urls = results.map(result => result.url)

        return { urls, error: null }
    } catch (error) {
        console.error('Error uploading multiple images:', error)
        return { urls: null, error: error.message }
    }
}

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the asset to delete
 * @param {string} resourceType - 'image' or 'raw'
 * @returns {Promise<{result, error}>}
 */
export async function deleteFile(publicId, resourceType = 'image') {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
        console.warn('Missing Cloudinary API Key/Secret. Cannot delete file.')
        return { result: null, error: 'Missing configuration' }
    }

    const timestamp = Math.round((new Date()).getTime() / 1000);
    
    // Generate signature
    // Signature is SHA1 of sorted parameters + api_secret
    const paramsStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = SHA1(paramsStr).toString();

    try {
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        
        if (data.result !== 'ok') {
            throw new Error(data.result || 'Delete failed');
        }

        return { result: 'ok', error: null };
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return { result: null, error: error.message };
    }
}

/**
 * Extract Public ID from Cloudinary URL
 * @param {string} url 
 * @param {string} resourceType - 'image' or 'raw'
 * @returns {string|null}
 */
export function getPublicIdFromUrl(url, resourceType = 'image') {
    if (!url) return null;
    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        
        let path = parts[1];
        // Remove version (v12345...) if present
        path = path.replace(/^v\d+\//, '');
        
        if (resourceType === 'image') {
            // Remove extension for images
            return path.substring(0, path.lastIndexOf('.'));
        } else {
            // Keep extension for raw files (as we set public_id with extension)
            return path;
        }
    } catch (e) {
        return null;
    }
}
