import { supabase } from './client'

/**
 * Get contact information
 * @returns {Promise<{data, error}>}
 */
export async function getContacts() {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .single() // We only have one record

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Update contact information
 * @param {object} contactData - Updated contact data
 * @returns {Promise<{data, error}>}
 */
export async function updateContacts(contactData) {
    try {
        // Get the current record ID
        const { data: currentData, error: fetchError } = await supabase
            .from('contacts')
            .select('id')
            .single()

        if (fetchError) throw fetchError

        // Update the record
        const { data, error } = await supabase
            .from('contacts')
            .update({
                phone: contactData.phone,
                email: contactData.email,
                instagram: contactData.instagram,
                facebook: contactData.facebook,
                updated_at: new Date().toISOString(),
            })
            .eq('id', currentData.id)
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error updating contacts:', error)
        return { data: null, error: error.message }
    }
}
