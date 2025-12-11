import React, { useState, useEffect } from 'react';
import { getContacts } from '../lib/supabase/contacts-info';
import SocialIcon from './ui/SocialIcon';

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
                                    <SocialIcon 
                                        type="phone" 
                                        href={`https://wa.me/${contacts.phone.replace(/[^0-9]/g, '')}?text=Ciao,%20ho%20bisogno%20di...`} 
                                        label={contacts.phone}
                                        className="p-2 rounded-lg hover:bg-[#66CBFF]/5 w-auto justify-center sm:justify-start"
                                    />
                                </li>
                            )}
                            {contacts.email && (
                                <li className="w-full sm:w-auto flex justify-center">
                                    <SocialIcon 
                                        type="email" 
                                        href={`mailto:${contacts.email}`}
                                        label={contacts.email}
                                        target="_self"
                                        className="p-2 rounded-lg hover:bg-[#66CBFF]/5 w-auto justify-center sm:justify-start"
                                    />
                                </li>
                            )}
                            {(contacts.instagram || contacts.facebook) && (
                                <li className="w-full sm:w-auto flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 items-center">
                                    {contacts.instagram && (
                                        <SocialIcon 
                                            type="instagram" 
                                            href={contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '').replace('https://instagram.com/', '')}`} 
                                            label={contacts.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}
                                            className="p-2 rounded-lg hover:bg-[#66CBFF]/5 w-auto justify-center sm:justify-start"
                                        />
                                    )}
                                    {contacts.facebook && (
                                        <SocialIcon 
                                            type="facebook" 
                                            href={contacts.facebook.includes('OLTRE Laterza') ? 'https://www.facebook.com/people/OLTRE-Laterza/100095539123613/' : (contacts.facebook.startsWith('http') ? contacts.facebook : `https://facebook.com/${contacts.facebook.trim().replace(/\s+/g, '-')}`)} 
                                            label={contacts.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '').replace('people/', '')}
                                            className="p-2 rounded-lg hover:bg-[#66CBFF]/5 w-auto justify-center sm:justify-start"
                                        />
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
