import React, { useState } from 'react';
import MemberCard from '../../components/features/members/MemberCard';
import NewsCard from '../../components/features/news/NewsCard';

const Admin = ({ isAdmin }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [previewData, setPreviewData] = useState(null);
    const [previewType, setPreviewType] = useState(null); // 'member' or 'news'

    // Forms state
    const [newMember, setNewMember] = useState({
        name: '', role: '', description: '', email: '', phone: '', image: 'https://via.placeholder.com/150'
    });

    // Date state for news
    const today = new Date();
    const [newsDateInput, setNewsDateInput] = useState(today.toISOString().split('T')[0]);

    const [newNews, setNewNews] = useState({
        title: '', subtitle: '', text: '', videoId: '',
        date: {
            day: String(today.getDate()).padStart(2, '0'),
            month: today.toLocaleString('default', { month: 'short' }).toUpperCase(),
            year: today.getFullYear()
        },
        images: [{ src: 'https://via.placeholder.com/400', alt: 'Preview' }]
    });

    if (!isAdmin) {
        return (
            <div className="py-10 px-5 max-w-[1000px] mx-auto">
                <h2>Accesso Negato</h2>
                <p>Devi essere un amministratore per visualizzare questa pagina.</p>
            </div>
        );
    }

    const handleDateChange = (e) => {
        const dateVal = new Date(e.target.value);
        setNewsDateInput(e.target.value);
        setNewNews({
            ...newNews,
            date: {
                day: String(dateVal.getDate()).padStart(2, '0'),
                month: dateVal.toLocaleString('default', { month: 'short' }).toUpperCase(),
                year: dateVal.getFullYear()
            }
        });
    };

    const getYouTubeId = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const handleVideoInput = (e) => {
        const val = e.target.value;
        const id = getYouTubeId(val);
        setNewNews({ ...newNews, videoId: id });
    };

    const handlePreviewMember = () => {
        setPreviewData({ ...newMember, id: 999 });
        setPreviewType('member');
    };

    const handlePreviewNews = () => {
        setPreviewData({ ...newNews, id: 999 });
        setPreviewType('news');
    };

    const reports = [
        { id: 1, name: "Mario Rossi", email: "mario@test.com", issue: "Vorrei segnalare una buca in via Roma." },
        { id: 2, name: "Luigi Verdi", email: "luigi@test.com", issue: "Proposta per il parco comunale." }
    ];

    return (
        <div className="py-10 px-5 max-w-[1000px] mx-auto">
            <h1 className="text-center text-[#333] mb-10 text-[2rem] font-bold">Pannello di Controllo Admin</h1>

            <div className="flex justify-center gap-5 mb-10 flex-wrap">
                <button className={`py-[15px] px-[30px] border-2 border-[#66CBFF] bg-white text-[#66CBFF] text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:bg-[#66CBFF] hover:text-white hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'members' ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]' : ''}`} onClick={() => { setActiveTab('members'); setPreviewData(null); }}>
                    Aggiungi Membri
                </button>
                <button className={`py-[15px] px-[30px] border-2 border-[#66CBFF] bg-white text-[#66CBFF] text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:bg-[#66CBFF] hover:text-white hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'news' ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]' : ''}`} onClick={() => { setActiveTab('news'); setPreviewData(null); }}>
                    Aggiungi Notizie
                </button>
                <button className={`py-[15px] px-[30px] border-2 border-[#66CBFF] bg-white text-[#66CBFF] text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:bg-[#66CBFF] hover:text-white hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'reports' ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]' : ''}`} onClick={() => { setActiveTab('reports'); setPreviewData(null); }}>
                    Controlla Segnalazioni
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'members' && (
                    <div className="bg-white p-[30px] rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[15px] max-w-[600px] mx-auto animate-fade-in">
                        <h3 className="text-xl font-bold">Aggiungi Nuovo Membro</h3>
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Nome" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Ruolo" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} />
                        <textarea className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Descrizione" value={newMember.description} onChange={e => setNewMember({ ...newMember, description: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Telefono" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="URL Immagine" value={newMember.image} onChange={e => setNewMember({ ...newMember, image: e.target.value })} />
                        <button className="bg-[#333] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold mt-[10px]" onClick={handlePreviewMember}>Preview</button>
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="bg-white p-[30px] rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[15px] max-w-[600px] mx-auto animate-fade-in">
                        <h3 className="text-xl font-bold">Aggiungi Nuova Notizia</h3>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">Data:</label>
                            <input className="p-[12px] border border-[#ddd] rounded-[8px]" type="date" value={newsDateInput} onChange={handleDateChange} />
                        </div>
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Titolo" value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Sottotitolo" value={newNews.subtitle} onChange={e => setNewNews({ ...newNews, subtitle: e.target.value })} />
                        <textarea className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Testo" value={newNews.text} onChange={e => setNewNews({ ...newNews, text: e.target.value })} />
                        <input className="p-[12px] border border-[#ddd] rounded-[8px]" placeholder="Link YouTube (URL completo)" onChange={handleVideoInput} />
                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="URL Immagine (opzionale)"
                            onChange={e => {
                                const newImgs = [...newNews.images];
                                newImgs[0].src = e.target.value || 'https://via.placeholder.com/400';
                                setNewNews({ ...newNews, images: newImgs });
                            }}
                        />
                        <button className="bg-[#333] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold mt-[10px]" onClick={handlePreviewNews}>Preview</button>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">Segnalazioni Ricevute</h3>
                        {reports.map(r => (
                            <div key={r.id} className="bg-white p-[20px] rounded-[10px] mb-[15px] border-l-[5px] border-l-[#ff4757] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                                <h4 className="font-bold mb-2">{r.name} ({r.email})</h4>
                                <p>{r.issue}</p>
                            </div>
                        ))}
                    </div>
                )}

                {previewData && (
                    <div className="mt-[40px] border-t-[2px] border-t-dashed border-t-[#ddd] pt-[40px] text-center animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">Anteprima (Esatta visualizzazione)</h3>
                        <div className="max-w-[1000px] mx-auto p-[20px] bg-[#f8faff]">
                            {previewType === 'member' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                                    <MemberCard member={previewData} isAdmin={false} />
                                </div>
                            )}
                            {previewType === 'news' && <NewsCard data={previewData} isAdmin={false} />}
                        </div>
                        <button className="bg-[#28a745] text-white border-none py-[15px] px-[40px] rounded-[30px] text-[1.2rem] font-bold cursor-pointer mt-5" onClick={() => alert("Elemento aggiunto (simulazione)!")}>Conferma e Aggiungi</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
