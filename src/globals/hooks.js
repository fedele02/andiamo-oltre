import { useState, useEffect } from 'react';

// =====================================================
// CUSTOM HOOKS - Hooks Riutilizzabili
// =====================================================

/**
 * Hook per gestire form state
 * @param {object} initialValues - Valori iniziali del form
 * @returns {object} {values, handleChange, reset}
 */
export function useForm(initialValues = {}) {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const reset = () => setValues(initialValues);

    return { values, handleChange, reset, setValues };
}

/**
 * Hook per gestire lo stato di loading
 * @returns {object} {loading, startLoading, stopLoading}
 */
export function useLoading(initialState = false) {
    const [loading, setLoading] = useState(initialState);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return { loading, startLoading, stopLoading, setLoading };
}

/**
 * Hook per gestire file upload con preview
 * @param {number} maxFiles - Numero massimo di file
 * @returns {object} {files, previews, handleFileChange, removeFile, clearFiles}
 */
export function useFileUpload(maxFiles = 1) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > maxFiles) {
            alert(`Puoi caricare massimo ${maxFiles} file!`);
            return;
        }

        setFiles(prev => [...prev, ...selectedFiles].slice(0, maxFiles));

        // Create previews
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setFiles([]);
        setPreviews([]);
    };

    return { files, previews, handleFileChange, removeFile, clearFiles };
}

/**
 * Hook per modal state
 * @returns {object} {isOpen, open, close, toggle}
 */
export function useModal(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return { isOpen, open, close, toggle };
}

/**
 * Hook per debounce
 * @param {any} value - Valore da debounce
 * @param {number} delay - Delay in ms
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
