import { supabase } from './client';

/**
 * Get content by section key
 * @param {string} key - The unique key for the content (e.g., 'home_description')
 * @returns {Promise<{data, error}>}
 */
export async function getContent(key) {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('section_key', key)
            .single();

        if (error) throw error;
        return { data: data?.content, error: null };
    } catch (error) {
        console.error(`Error fetching content for ${key}:`, error);
        return { data: null, error: error.message };
    }
}

/**
 * Update content by section key
 * @param {string} key - The unique key for the content
 * @param {string} newContent - The new text content
 * @returns {Promise<{data, error}>}
 */
export async function updateContent(key, newContent) {
    try {
        // Upsert allows inserting if it doesn't exist, or updating if it does
        const { data, error } = await supabase
            .from('site_content')
            .upsert({ 
                section_key: key, 
                content: newContent,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section_key' })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error(`Error updating content for ${key}:`, error);
        return { data: null, error: error.message };
    }
}
