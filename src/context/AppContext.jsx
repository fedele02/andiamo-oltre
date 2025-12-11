import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMembers } from '../lib/supabase/members';
import { getNews } from '../lib/supabase/news';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [members, setMembers] = useState([]);
    const [news, setNews] = useState([]);
    const [contacts, setContacts] = useState({
        phone: '',
        email: '',
        instagram: '',
        facebook: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch data on app mount
    useEffect(() => {
        async function loadData() {
            try {
                // Fetch in parallel
                const [membersResult, newsResult, contactsResult] = await Promise.all([
                    getMembers(),
                    getNews(),
                    import('../lib/supabase/contacts-info').then(module => module.getContacts())
                ]);

                if (!membersResult.error && membersResult.data) {
                    setMembers(membersResult.data);
                }

                if (!newsResult.error && newsResult.data) {
                    setNews(newsResult.data);
                }

                if (!contactsResult.error && contactsResult.data) {
                    setContacts(contactsResult.data);
                }
            } catch (error) {
                console.error('Error loading app data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Function to refresh members (chiamata dopo aggiunta/modifica)
    const refreshMembers = async () => {
        const { data, error } = await getMembers();
        if (!error && data) {
            setMembers(data);
        }
    };

    // Function to refresh news
    const refreshNews = async () => {
        const { data, error } = await getNews();
        if (!error && data) {
            setNews(data);
        }
    };

    // Function to refresh contacts
    const refreshContacts = async () => {
        const { getContacts } = await import('../lib/supabase/contacts-info');
        const { data, error } = await getContacts();
        if (!error && data) {
            setContacts(data);
        }
    };

    const value = {
        members,
        news,
        contacts,
        loading,
        refreshMembers,
        refreshNews,
        refreshContacts
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppData must be used within AppProvider');
    }
    return context;
}
