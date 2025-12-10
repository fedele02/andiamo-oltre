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
                        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 w-full">
                            {contacts.phone && (
                                <li className="flex justify-center">
                                    <a href={`https://wa.me/${contacts.phone.replace(/[^0-9]/g, '')}?text=Ciao,%20ho%20bisogno%20di...`} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-2 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-xs font-medium group-hover:text-[#66CBFF] transition-colors whitespace-nowrap">
                                            {contacts.phone}
                                        </span>
                                    </a>
                                </li>
                            )}
                            {contacts.email && (
                                <li className="flex justify-center">
                                    <div className="flex items-center gap-2 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-xs font-medium cursor-default whitespace-nowrap">
                                            {contacts.email}
                                        </span>
                                    </div>
                                </li>
                            )}
                            {(contacts.instagram || contacts.facebook) && (
                                <li className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                                    {contacts.instagram && (
                                        <a href={`https://instagram.com/${contacts.instagram.replace('@', '').replace('https://instagram.com/', '')}`} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-2 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 group-hover:text-[#66CBFF] transition-colors">
                                                {contacts.instagram}
                                            </span>
                                        </a>
                                    )}
                                    {contacts.facebook && (
                                        <a href={`https://facebook.com/${contacts.facebook.replace('https://facebook.com/', '')}`} target="_blank" rel="noopener noreferrer" className="filter hover:brightness-110 flex items-center gap-2 group p-2 rounded-lg hover:bg-[#66CBFF]/5 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 group-hover:text-[#66CBFF] transition-colors">
                                                {contacts.facebook}
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
