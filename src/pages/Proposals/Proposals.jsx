import React, { useState } from 'react';
import NewsCard from '../../components/features/news/NewsCard';
import SearchBar from '../../components/common/SearchBar/SearchBar';

const Proposals = ({ isAdmin }) => {
    const [newsData, setNewsData] = useState([
        {
            id: 1,
            date: { day: '26', month: 'NOV', year: '2025' },
            title: "La Gravina di Laterza: Un Canyon Mozzafiato",
            subtitle: "Uno dei canyon più profondi d'Europa nel cuore della Puglia",
            text: "La Gravina di Laterza si estende per 12 chilometri con pareti verticali alte fino a 200 metri, creando uno spettacolo naturale unico. Questo imponente canyon calcareo, parte dell'Oasi LIPU e del Parco Naturale Regionale Terra delle Gravine, ospita una ricca biodiversità con grillaio, lanario, corvo imperiale e falco pellegrino. Un paradiso per escursionisti, fotografi e amanti della natura.",
            videoId: "mA_OGxIc1TQ",
            images: [
                { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", alt: "Canyon vista panoramica" },
                { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400", alt: "Vegetazione mediterranea" },
                { src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400", alt: "Sentiero naturalistico" },
                { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400", alt: "Fauna locale" },
            ]
        },
        {
            id: 2,
            date: { day: '20', month: 'NOV', year: '2025' },
            title: "La Ceramica Artistica di Laterza",
            subtitle: "Secoli di tradizione artigianale che continua a brillare",
            text: "Dal XV secolo, Laterza è rinomata per le sue maioliche artistiche, caratterizzate dal tipico blu turchino su smalto bianco e motivi floreali intricati. Maestri ceramisti come Angelo Antonio D'Alessandro hanno reso famosa questa arte in tutta Europa. Oggi, il Museo della Maiolica (MuMa) custodisce preziose collezioni, mentre gli artigiani locali mantengono viva questa tradizione millenaria con botteghe che uniscono tecniche antiche e innovazione.",
            videoId: "qh4hLELlGno",
            images: [
                { src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400", alt: "Ceramica artigianale" },
                { src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400", alt: "Decorazioni tradizionali" },
                { src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400", alt: "Bottega ceramista" },
                { src: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400", alt: "Maioliche colorate" },
            ]
        },
        {
            id: 3,
            date: { day: '15', month: 'NOV', year: '2025' },
            title: "Il Pane di Laterza: Eccellenza Gastronomica",
            subtitle: "La tradizione del pane cotto nei forni a legna",
            text: "Il pane di Laterza è un simbolo della gastronomia pugliese, cotto secondo ricette antiche nei tradizionali forni a legna. Caratterizzato da una crosta spessa e croccante e una mollica soffice e profumata, questo pane è il risultato di una lavorazione artigianale che si tramanda di generazione in generazione. Insieme al capocollo e ad altri prodotti tipici, rappresenta l'autenticità e la genuinità della cucina locale, celebrata anche durante eventi come la 'Laterza Bread Experience'.",
            videoId: "wkZ1T_B4lwc",
            images: [
                { src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", alt: "Pane artigianale" },
                { src: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400", alt: "Forno a legna tradizionale" },
                { src: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400", alt: "Prodotti tipici pugliesi" },
                { src: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400", alt: "Tavola imbandita" },
            ]
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
            setNewsData(newsData.filter(item => item.id !== id));
        }
    };

    const handleEdit = (id, updatedItem) => {
        setNewsData(newsData.map(item => item.id === id ? updatedItem : item));
    };

    const filteredNews = newsData.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="max-w-[1000px] mx-auto py-10 px-5">
            <SearchBar onSearch={setSearchTerm} />
            {filteredNews.map(news => (
                <NewsCard
                    key={news.id}
                    data={news}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ))}
        </section>
    );
};

export default Proposals;
