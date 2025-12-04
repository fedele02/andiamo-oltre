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
