// =====================================================
// UTILS - Funzioni Helper Riutilizzabili
// =====================================================

/**
 * Formatta una data in formato italiano
 * @param {string|Date} date - Data da formattare
 * @returns {string} Data formattata (es: "04/12/2025")
 */
export function formatDateIT(date) {
    const d = new Date(date);
    return d.toLocaleDateString('it-IT');
}

/**
 * Formatta una data per input date HTML
 * @param {Date} date - Data da formattare
 * @returns {string} Data in formato YYYY-MM-DD
 */
export function formatDateInput(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Ottiene giorno, mese e anno da una data
 * @param {Date} date - Data
 * @returns {object} {day, month, year}
 */
export function getDateParts(date) {
    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        year: date.getFullYear()
    };
}

/**
 * Estrae video ID da URL YouTube
 * @param {string} url - URL YouTube
 * @returns {string} Video ID o URL originale se non trovato
 */
export function getYouTubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

/**
 * Tronca un testo a un numero di caratteri massimo
 * @param {string} text - Testo da troncare
 * @param {number} maxLength - Lunghezza massima
 * @returns {string} Testo troncato con "..."
 */
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Converte file in data URL per preview
 * @param {File} file - File da convertire
 * @returns {Promise<string>} Data URL
 */
export function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Valida email
 * @param {string} email - Email da validare
 * @returns {boolean} True se valida
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Aspetta un numero di millisecondi
 * @param {number} ms - Millisecondi da aspettare
 * @returns {Promise}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Genera un ID univoco random
 * @returns {string} ID univoco
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
