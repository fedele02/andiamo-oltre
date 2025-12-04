import { supabase } from './client'

/**
 * Get all members from database
 * @returns {Promise<{data, error}>}
 */
export async function getMembers() {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error fetching members:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Get a single member by ID
 * @param {string} id - Member UUID
 * @returns {Promise<{data, error}>}
 */
export async function getMemberById(id) {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error fetching member:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Create a new member
 * @param {object} memberData - Member data
 * @returns {Promise<{data, error}>}
 */
export async function createMember(memberData) {
    try {
        const { data, error } = await supabase
            .from('members')
            .insert([{
                name: memberData.name,
                role: memberData.role,
                description: memberData.description,
                email: memberData.email,
                phone: memberData.phone,
                image_url: memberData.image_url,
                is_president: memberData.is_president || false,
            }])
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error creating member:', error)
        return { data: null, error: error.message }
    }
}

/**
 * Update an existing member
 * @param {string} id - Member UUID
 * @param {object} memberData - Updated member data
 * @returns {Promise<{data, error}>}
 */
export async function updateMember(id, memberData) {
    try {
        const { data, error } = await supabase
            .from('members')
            .update({
                name: memberData.name,
                role: memberData.role,
                description: memberData.description,
                email: memberData.email,
                phone: memberData.phone,
                image_url: memberData.image_url,
                is_president: memberData.is_president || false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return { data, error: null }
    } catch (error) {
        console.error('Error updating member:', error)
        return { data, error: error.message }
    }
}

/**
 * Delete a member
 * @param {string} id - Member UUID
 * @returns {Promise<{error}>}
 */
export async function deleteMember(id) {
    try {
        const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { error: null }
    } catch (error) {
        console.error('Error deleting member:', error)
        return { error: error.message }
    }
}
