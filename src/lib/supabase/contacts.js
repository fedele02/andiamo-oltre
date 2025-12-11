import { supabase } from './client'

/**
 * Create a new contact report/segnalazione
 * @param {object} reportData - Contact report data
 * @returns {Promise<{data, error}>}
 */
export async function createContactReport(reportData) {
    try {
        const { error } = await supabase
            .from('contact_reports')
            .insert([{
                name: reportData.name || null,
                surname: reportData.surname || null,
                email: reportData.email || null,
                phone: reportData.phone || null,
                description: reportData.description,
                images: reportData.images || [],
            }])

        if (error) throw error

        return { data: true, error: null }
    } catch (error) {
        console.error('Error creating contact report:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Get all contact reports (Admin only)
 * @returns {Promise<{data, error}>}
 */
export async function getContactReports() {
    try {
        const { data, error } = await supabase
            .from('contact_reports')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error fetching contact reports:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Mark a contact report as read
 * @param {string} id - Report UUID
 * @returns {Promise<{data, error}>}
 */
export async function markAsRead(id) {
    try {
        const { data, error } = await supabase
            .from('contact_reports')
            .update({ is_read: true })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error marking report as read:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Delete a contact report
 * @param {string} id - Report UUID
 * @returns {Promise<{error}>}
 */
export async function deleteContactReport(id) {
    try {
        const { error } = await supabase
            .from('contact_reports')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { error: null }
    } catch (error) {
        console.error('Error deleting contact report:', error)
        return { error: error.message }
    }
}
