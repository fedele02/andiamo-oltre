import { supabase } from './client'

/**
 * Sign in with email and password (Admin only)
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        return { user: data.user, session: data.session, error: null }
    } catch (error) {
        console.error('Login error:', error)
        return { user: null, session: null, error: error.message }
    }
}

/**
 * Sign out current user
 * @returns {Promise<{error}>}
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) throw error

        return { error: null }
    } catch (error) {
        console.error('Logout error:', error)
        return { error: error.message }
    }
}

/**
 * Get current authenticated user
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) throw error

        return { user, error: null }
    } catch (error) {
        console.error('Get user error:', error)
        return { user: null, error: error.message }
    }
}

/**
 * Listen to authentication state changes
 * @param {function} callback - Function to call when auth state changes
 * @returns {object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
    })
}

/**
 * Check if user is currently authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
    const { user } = await getCurrentUser()
    return !!user
}
