import { supabase } from './client'
import { deleteFile, getPublicIdFromUrl } from '../cloudinary/upload'

/**
 * Get all news/proposals from database
 * @returns {Promise<{data, error}>}
 */
export async function getNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        // Transform database format to component format
        const transformedData = data.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            text: item.text,
            date: {
                day: item.date_day,
                month: item.date_month,
                year: item.date_year,
            },
            videoUrl: item.video_url,
            images: item.images || [],
            files: item.files || [],
        }))

        return { data: transformedData, error: null }
    } catch (error) {
        console.error('Error fetching news:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Get a single news item by ID
 * @param {string} id - News UUID
 * @returns {Promise<{data, error}>}
 */
export async function getNewsById(id) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        // Transform to component format
        const transformed = {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle,
            text: data.text,
            date: {
                day: data.date_day,
                month: data.date_month,
                year: data.date_year,
            },
            videoUrl: data.video_url,
            images: data.images || [],
            files: data.files || [],
        }

        return { data: transformed, error: null }
    } catch (error) {
        console.error('Error fetching news item:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Create a new news item
 * @param {object} newsData - News data
 * @returns {Promise<{data, error}>}
 */
export async function createNews(newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .insert([{
                title: newsData.title,
                subtitle: newsData.subtitle,
                text: newsData.text,
                date_day: newsData.date.day,
                date_month: newsData.date.month,
                date_year: newsData.date.year,
                video_url: newsData.videoUrl,
                images: newsData.images || [],
                files: newsData.files || [],
            }])
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error creating news:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Update an existing news item
 * @param {string} id - News UUID
 * @param {object} newsData - Updated news data
 * @returns {Promise<{data, error}>}
 */
export async function updateNews(id, newsData) {
    try {
        // 1. Fetch current data to check for removed files
        const { data: currentNews, error: fetchError } = await supabase
            .from('news')
            .select('images, files')
            .eq('id', id)
            .single()

        if (!fetchError && currentNews) {
            // Check for removed images
            const currentImages = currentNews.images || [];
            const newImages = newsData.images || [];
            const newImageUrls = new Set(newImages.map(img => img.src));

            for (const img of currentImages) {
                if (!newImageUrls.has(img.src)) {
                    const publicId = getPublicIdFromUrl(img.src, 'image');
                    if (publicId) {
                        await deleteFile(publicId, 'image');
                    }
                }
            }

            // Check for removed files
            const currentFiles = currentNews.files || [];
            const newFiles = newsData.files || [];
            const newFileUrls = new Set(newFiles.map(f => f.url));

            for (const file of currentFiles) {
                if (!newFileUrls.has(file.url)) {
                    const publicId = getPublicIdFromUrl(file.url, 'raw');
                    if (publicId) {
                        await deleteFile(publicId, 'raw');
                    }
                }
            }
        }

        // 2. Update Database
        const { data, error } = await supabase
            .from('news')
            .update({
                title: newsData.title,
                subtitle: newsData.subtitle,
                text: newsData.text,
                date_day: newsData.date.day,
                date_month: newsData.date.month,
                date_year: newsData.date.year,
                video_url: newsData.videoUrl,
                images: newsData.images || [],
                files: newsData.files || [],
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error updating news:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Delete a news item and its associated files from Cloudinary
 * @param {string} id - News UUID
 * @returns {Promise<{error}>}
 */
export async function deleteNews(id) {
    try {
        // 1. Fetch the news item first to get file URLs
        const { data: newsItem, error: fetchError } = await supabase
            .from('news')
            .select('images, files')
            .eq('id', id)
            .single()

        if (fetchError) {
            console.error('Error fetching news before delete:', fetchError)
            // Proceed with delete anyway to ensure DB consistency? 
            // Or stop? Let's proceed but warn.
        }

        // 2. Delete from Database
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id)

        if (error) throw error

        // 3. Delete files from Cloudinary (Fire and forget, or await?)
        // We should try to delete, but not block the UI if it fails or if keys are missing.
        if (newsItem) {
            // Delete Images
            if (newsItem.images && Array.isArray(newsItem.images)) {
                for (const img of newsItem.images) {
                    const publicId = getPublicIdFromUrl(img.src, 'image');
                    if (publicId) {
                        await deleteFile(publicId, 'image');
                    }
                }
            }

            // Delete Files (Documents)
            if (newsItem.files && Array.isArray(newsItem.files)) {
                for (const file of newsItem.files) {
                    const publicId = getPublicIdFromUrl(file.url, 'raw');
                    if (publicId) {
                        // Try deleting as raw first (most likely)
                        // But wait, we uploaded PDFs as 'image' in previous attempts?
                        // No, we reverted to 'raw' for docs.
                        // However, if some were uploaded as 'image' (during my tests), they might fail.
                        // We'll assume 'raw' for now as per current logic.
                        await deleteFile(publicId, 'raw');
                    }
                }
            }
        }

        return { error: null }
    } catch (error) {
        console.error('Error deleting news:', error)
        return { error: error.message }
    }
}
