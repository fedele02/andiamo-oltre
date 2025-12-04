import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import SearchBar from '../components/SearchBar';
import { getNews, deleteNews, updateNews } from '../lib/supabase/news';

const Proposals = ({ isAdmin }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch news from Supabase on component mount
    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        const { data, error } = await getNews();

        if (error) {
            setError('Errore nel caricamento delle notizie');
            console.error(error);
        } else {
            setNewsData(data);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
            const { error } = await deleteNews(id);

            if (error) {
                alert('Errore durante l\'eliminazione della notizia');
                console.error(error);
            } else {
                setNewsData(newsData.filter(item => item.id !== id));
            }
        }
    };

    const handleEdit = async (id, updatedItem) => {
        const { data, error } = await updateNews(id, updatedItem);

        if (error) {
            alert('Errore durante l\'aggiornamento della notizia');
            console.error(error);
        } else {
            setNewsData(newsData.map(item => item.id === id ? updatedItem : item));
        }
    };

    const filteredNews = newsData.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <section className="max-w-[1000px] mx-auto py-10 px-5 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#66CBFF]"></div>
                <p className="mt-4 text-gray-600">Caricamento notizie...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="max-w-[1000px] mx-auto py-10 px-5 text-center">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={fetchNews}
                    className="mt-4 px-6 py-2 bg-[#66CBFF] text-white rounded-lg hover:bg-[#3faae0]"
                >
                    Riprova
                </button>
            </section>
        );
    }

    return (
        <section className="max-w-[1000px] mx-auto py-10 px-5">
            <SearchBar onSearch={setSearchTerm} />
            {filteredNews.length === 0 ? (
                <p className="text-center text-gray-500 text-lg mt-10">
                    {searchTerm ? 'Nessuna notizia trovata' : 'Nessuna notizia disponibile'}
                </p>
            ) : (
                filteredNews.map(news => (
                    <NewsCard
                        key={news.id}
                        data={news}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))
            )}
        </section>
    );
};

export default Proposals;

