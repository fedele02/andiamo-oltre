import React, { useState, useEffect } from 'react';
import { getContacts } from '../lib/supabase/contacts-info';

const Footer = () => {
    const [contacts, setContacts] = useState({
        phone: '',
        email: '',
        instagram: '',
        facebook: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const { data, error } = await getContacts();

        if (error) {
            console.error('Error loading contacts:', error);
        } else if (data) {
            setContacts(data);
        }

        setLoading(false);
    };

    if (loading) {
        return null;
    }

    return (
        <footer className="bg-gradient-to-b from-white via-[#f0f9ff] to-white border-t border-[#66CBFF]/30 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-6">

                    {/* Brand Section - Top & Centered */}
                    <div className="flex flex-col items-center text-center w-full">
                        <h2 className="text-xl font-extrabold font-title uppercase text-[#66CBFF] mb-2 drop-shadow-sm tracking-wide">
                            Andiamo Oltre
                        </h2>
                        <p className="text-gray-600 text-xs leading-relaxed w-full max-w-2xl">
                            Un movimento per il cambiamento e il progresso della nostra comunità.
                        </p>
                    </div>

                    {/* Contact Info - Bottom & Grid/Flex */}
                    <div className="w-full max-w-4xl">
                        {/* Mobile: Strict Column (flex-col), Desktop: Row (sm:flex-row) */}
                        <ul className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 w-full">
                            {contacts.phone && (
                                <li className="w-full sm:w-auto flex justify-center">
                                    <a href={`https://wa.me/${contacts.phone.replace(/[^0-9]/g, '')}?text=Ciao,%20ho%20bisogno%20di...`} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-3 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all w-auto justify-center sm:justify-start">
                                        <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium group-hover:text-[#66CBFF] transition-colors whitespace-nowrap">
                                            {contacts.phone}
                                        </span>
                                    </a>
                                </li>
                            )}
                            {contacts.email && (
                                <li className="w-full sm:w-auto flex justify-center">
                                    <div className="flex items-center gap-3 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all w-auto justify-center sm:justify-start">
                                        <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium cursor-default whitespace-nowrap">
                                            {contacts.email}
                                        </span>
                                    </div>
                                </li>
                            )}
                            {(contacts.instagram || contacts.facebook) && (
                                <li className="w-full sm:w-auto flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 items-center">
                                    {contacts.instagram && (
                                        <a href={contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '').replace('https://instagram.com/', '')}`} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-3 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all w-auto justify-center sm:justify-start">
                                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                                {/* Outlined Instagram Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth={2} />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-[#66CBFF] transition-colors">
                                                {contacts.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}
                                            </span>
                                        </a>
                                    )}
                                    {contacts.facebook && (
                                        <a href={contacts.facebook.includes('OLTRE Laterza') ? 'https://www.facebook.com/people/OLTRE-Laterza/100095539123613/' : (contacts.facebook.startsWith('http') ? contacts.facebook : `https://facebook.com/${contacts.facebook.trim().replace(/\s+/g, '-')}`)} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-3 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all w-auto justify-center sm:justify-start">
                                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 group-hover:text-[#66CBFF] transition-colors">
                                                {contacts.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '').replace('people/', '')}
                                            </span>
                                        </a>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-4 border-t border-[#66CBFF]/20 text-center mt-4">
                    <p className="text-gray-400 text-[10px]">
                        &copy; {new Date().getFullYear()} <span className="text-[#66CBFF] font-bold">Andiamo Oltre</span>. Tutti i diritti riservati.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
