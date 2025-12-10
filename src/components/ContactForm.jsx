import React, { useState, useEffect } from 'react';
import { createContactReport } from '../lib/supabase/contacts';
import { uploadMultipleImages } from '../lib/cloudinary/upload';
import { sendContactEmail } from '../lib/emailjs/send';
import { useAppData } from '../context/AppContext';

const ContactForm = ({ isAdmin }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        description: ''
    });

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { contacts: globalContacts, refreshContacts } = useAppData();
    const [contacts, setContacts] = useState(globalContacts);

    // Sync local state when global state changes (initial load)
    useEffect(() => {
        setContacts(globalContacts);
    }, [globalContacts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Max 3 images
        if (images.length + files.length > 3) {
            alert('Puoi caricare massimo 3 immagini!');
            return;
        }

        setImages(prev => [...prev, ...files].slice(0, 3));
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔐 HIDDEN ADMIN LOGIN
        // If name = "oltreperlaterza@gmail.com" and surname = admin password, login as admin
        if (formData.name.trim() === 'oltreperlaterza@gmail.com' && formData.surname.trim()) {
            setLoading(true);

            try {
                const { signIn } = await import('../lib/supabase/auth');
                const { data, error } = await signIn(formData.name, formData.surname);

                if (error) {
                    alert('Credenziali admin non valide.');
                    setLoading(false);
                    return;
                }

                // Success! Redirect to admin
                alert('Accesso admin effettuato! Sarai reindirizzato...');
                window.location.href = '/admin';
                return;
            } catch (error) {
                console.error('Admin login error:', error);
                alert('Errore durante il login admin.');
                setLoading(false);
                return;
            }
        }

        // Validate description is not empty
        if (!formData.description.trim()) {
            alert('Il messaggio è obbligatorio!');
            return;
        }

        setLoading(true);
        setSuccess(false);

        try {
            // 1. Upload images to Cloudinary if present
            let imageUrls = [];
            if (images.length > 0) {
                const { urls, error } = await uploadMultipleImages(images);
                if (error) {
                    alert('Errore durante il caricamento delle immagini. Riprova.');
                    setLoading(false);
                    return;
                }
                imageUrls = urls;
            }

            // 2. Save contact report to Supabase
            const { data, error } = await createContactReport({
                name: formData.name.trim() || null,
                surname: formData.surname.trim() || null,
                email: formData.email.trim() || null,
                phone: formData.phone.trim() || null,
                description: formData.description.trim(),
                images: imageUrls
            });

            if (error) {
                alert('Errore durante l\'invio della segnalazione. Riprova.');
                setLoading(false);
                return;
            }

            // 3. Send email notification via EmailJS
            const { success: emailSuccess, error: emailError } = await sendContactEmail(formData, imageUrls);

            if (emailError) {
                console.warn('Email notification failed:', emailError);
                // Inform user about partial success
                alert(`Segnalazione salvata con successo! Tuttavia, l'invio dell'email di notifica è fallito (Errore: ${emailError}). Controlla la console per i dettagli.`);
            }

            // Success!
            setSuccess(true);
            alert('Grazie per averci contattato! Ti risponderemo presto.');

            // Reset form
            setFormData({
                name: '',
                surname: '',
                email: '',
                phone: '',
                description: ''
            });
            setImages([]);

        } catch (error) {
            console.error('Unexpected error:', error);
            alert('Si è verificato un errore. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    const [isEditingContacts, setIsEditingContacts] = useState(false);
    const [editedContacts, setEditedContacts] = useState({ ...contacts });

    const handleContactsChange = (e) => {
        const { name, value } = e.target;
        setEditedContacts(prev => ({ ...prev, [name]: value }));
    };

    const saveContacts = async () => {
        const { updateContacts } = await import('../lib/supabase/contacts-info');
        const { data, error } = await updateContacts(editedContacts);
        if (error) {
            alert('Errore aggiornamento contatti: ' + error);
        } else {
            await refreshContacts(); // Aggiorna i dati globali
            setContacts(editedContacts);
            setIsEditingContacts(false);
            alert('Contatti aggiornati!');
        }
    };

    return (

        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Contact Form Section */}
                <div className="lg:col-span-2 bg-white p-5 md:p-10 rounded-2xl shadow-card border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-title">Parla con Noi</h2>
                    <p className="text-gray-500 mb-4 md:mb-8 text-sm md:text-base">Hai domande o segnalazioni? Scrivici qui sotto.</p>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="mb-2 font-medium text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                                    placeholder="Il tuo nome"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="surname" className="mb-2 font-medium text-gray-700">Cognome</label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                                    placeholder="Il tuo cognome"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                                    placeholder="tuo@email.com"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="phone" className="mb-2 font-medium text-gray-700">Telefono</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                                    placeholder="+39 333 1234567"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="description" className="mb-2 font-medium text-gray-700">
                                Descrizione del problema / Segnalazione <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                required
                                className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none resize-none"
                                placeholder="Scrivi qui il tuo messaggio..."
                            ></textarea>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="images" className="mb-2 font-medium text-gray-700">
                                Carica immagini (opzionale - max 3)
                            </label>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-accent transition-colors text-center cursor-pointer bg-gray-50">
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-gray-500">
                                    <span className="text-accent font-medium">Clicca per caricare</span> o trascina qui
                                    <p className="text-sm mt-1">Massimo 3 immagini</p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary mt-4 w-full md:w-auto md:self-start"
                            disabled={loading}
                        >
                            {loading ? '⏳ Invio in corso...' : 'Invia Segnalazione'}
                        </button>

                        <p className="text-sm text-gray-500 mt-2">
                            <span className="text-red-500">*</span> Solo il messaggio è obbligatorio. Gli altri campi sono facoltativi.
                        </p>
                    </form>
                </div>

                {/* Side Info Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#66CBFF] to-[#3faae0] text-white p-6 md:p-10 rounded-2xl shadow-card h-full relative overflow-hidden">
                        {/* Admin Controls */}
                        {isAdmin && (
                            <div className="absolute top-4 right-4 z-20">
                                {isEditingContacts ? (
                                    <div className="flex gap-2">
                                        <button onClick={saveContacts} className="bg-white text-green-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">💾</button>
                                        <button onClick={() => setIsEditingContacts(false)} className="bg-white text-red-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">❌</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditingContacts(true)} className="bg-white text-[#66CBFF] p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">✏️</button>
                                )}
                            </div>
                        )}

                        {/* Decorative Circle */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                        <h3 className="text-2xl font-bold mb-6 font-title relative z-10">Puoi anche contattarci qui</h3>
                        <p className="text-white/90 mb-10 relative z-10">
                            Siamo sempre disponibili per ascoltare le tue idee e risolvere i tuoi dubbi.
                        </p>

                        <div className="flex flex-col gap-8 relative z-10">
                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-white/80 font-medium uppercase tracking-wider mb-1">Telefono</p>
                                    {isEditingContacts ? (
                                        <input
                                            name="phone"
                                            value={editedContacts.phone}
                                            onChange={handleContactsChange}
                                            className="text-black p-1 rounded w-full"
                                        />
                                    ) : (
                                        <a href={`https://wa.me/${contacts.phone.replace(/[^0-9]/g, '')}?text=Ciao,%20ho%20bisogno%20di...`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-white/80 transition-colors cursor-pointer decoration-dotted underline underline-offset-4">
                                            {contacts.phone}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-white/80 font-medium uppercase tracking-wider mb-1">Email</p>
                                    {isEditingContacts ? (
                                        <input
                                            name="email"
                                            value={editedContacts.email}
                                            onChange={handleContactsChange}
                                            className="text-black p-1 rounded w-full"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold cursor-default">{contacts.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-white/80 font-medium uppercase tracking-wider mb-1">Instagram</p>
                                    {isEditingContacts ? (
                                        <input
                                            name="instagram"
                                            value={editedContacts.instagram}
                                            onChange={handleContactsChange}
                                            className="text-black p-1 rounded w-full"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold hover:text-white/80 transition-colors cursor-pointer">{contacts.instagram}</p>
                                    )}
                                </div>
                            </div>

                            {/* Facebook */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-white/80 font-medium uppercase tracking-wider mb-1">Facebook</p>
                                    {isEditingContacts ? (
                                        <input
                                            name="facebook"
                                            value={editedContacts.facebook}
                                            onChange={handleContactsChange}
                                            className="text-black p-1 rounded w-full"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold hover:text-white/80 transition-colors cursor-pointer">{contacts.facebook}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom decorative line */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/50 to-white/20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
