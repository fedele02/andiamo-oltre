// =====================================================
// CONSTANTS - Costanti Globali del Progetto
// =====================================================

// Colori del Brand
export const COLORS = {
    primary: '#66CBFF',
    primaryDark: '#3faae0',
    accent: '#66CBFF',
    error: '#ff4757',
    success: '#28a745',
    textPrimary: '#333',
    textSecondary: '#666',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8faff',
    border: '#ddd',
    borderLight: '#e0e0e0'
};

// Email di Destinazione
export const ADMIN_EMAIL = 'oltreperlaterza@gmail.com';

// Placeholder Images
export const PLACEHOLDER = {
    member: 'https://via.placeholder.com/150',
    news: 'https://via.placeholder.com/400'
};

// Limiti per immagin
export const LIMITS = {
    contactImages: 5,
    newsImages: Infinity,
    fileSize: {
        image: 10 * 1024 * 1024, // 10MB
        video: 100 * 1024 * 1024, // 100MB
        raw: 10 * 1024 * 1024 // 10MB
    }
};


export const MONTHS_IT = {
    '01': 'GEN',
    '02': 'FEB',
    '03': 'MAR',
    '04': 'APR',
    '05': 'MAG',
    '06': 'GIU',
    '07': 'LUG',
    '08': 'AGO',
    '09': 'SET',
    '10': 'OTT',
    '11': 'NOV',
    '12': 'DIC'
};

// Messaggi Standard
export const MESSAGES = {
    saveSuccess: 'Salvato con successo!',
    saveError: 'Errore durante il salvataggio. Riprova.',
    deleteConfirm: 'Sei sicuro di voler eliminare questo elemento?',
    requiredFields: 'Compila tutti i campi obbligatori!',
    uploadError: 'Errore durante il caricamento. Riprova.',
    anonymous: 'Anonimo'
};
