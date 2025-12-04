import { supabase } from './client'

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
 * Delete a news item
 * @param {string} id - News UUID
 * @returns {Promise<{error}>}
 */
export async function deleteNews(id) {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { error: null }
    } catch (error) {
        console.error('Error deleting news:', error)
        return { error: error.message }
    }
}
