import React, { useState, useEffect } from 'react';
import MemberCard from '../components/MemberCard';
import NewsCard from '../components/NewsCard';
import { getContactReports } from '../lib/supabase/contacts';
import { getContacts, updateContacts } from '../lib/supabase/contacts-info';
import { createMember } from '../lib/supabase/members';
import { createNews } from '../lib/supabase/news';
import { uploadImage, uploadMultipleImages, uploadMultipleFiles } from '../lib/cloudinary/upload';
import { useAppData } from '../context/AppContext';

const Admin = ({ isAdmin }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [previewData, setPreviewData] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const { refreshMembers, refreshNews } = useAppData();

    // Member form state
    const [newMember, setNewMember] = useState({
        name: '',
        role: '',
        description: '',
        email: '',
        phone: '',
        instagram: '',
        facebook: '',
        is_president: false
    });
    const [memberImage, setMemberImage] = useState(null);
    const [memberImagePreview, setMemberImagePreview] = useState(null);

    // News form state
    const today = new Date();
    const [newsDateInput, setNewsDateInput] = useState(today.toISOString().split('T')[0]);
    const [newNews, setNewNews] = useState({
        title: '',
        subtitle: '',
        text: '',
        videoUrl: '',
        date: {
            day: String(today.getDate()).padStart(2, '0'),
            month: today.toLocaleString('default', { month: 'short' }).toUpperCase(),
            year: today.getFullYear()
        }
    });
    const [newsImages, setNewsImages] = useState([]);
    const [newsImagesPreviews, setNewsImagesPreviews] = useState([]);
    const [newsFiles, setNewsFiles] = useState([]); // For documents (PDF, Doc, etc.)

    // Fetch contact reports
    useEffect(() => {
        if (activeTab === 'reports' && isAdmin) {
            fetchReports();
        }
    }, [activeTab, isAdmin]);

    const fetchReports = async () => {
        setLoadingReports(true);
        const { data, error } = await getContactReports();
        if (!error && data) {
            setReports(data);
        } else {
            console.error('Error fetching reports:', error);
        }
        setLoadingReports(false);
    };

    if (!isAdmin) {
        return (
            <div className="py-10 px-5 max-w-[1000px] mx-auto">
                <h2>Accesso Negato</h2>
                <p>Devi essere un amministratore per visualizzare questa pagina.</p>
            </div>
        );
    }

    // === MEMBER HANDLERS ===
    const handleMemberImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMemberImage(file);
            setMemberImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveMember = async () => {
        if (!newMember.name || !newMember.role) {
            alert('Nome e Ruolo sono obbligatori!');
            return;
        }

        setSaving(true);

        try {
            // 1. Upload image to Cloudinary
            let imageUrl = '';
            if (memberImage) {
                const { url, error } = await uploadImage(memberImage);
                if (error) {
                    alert('Errore durante il caricamento dell\'immagine');
                    setSaving(false);
                    return;
                }
                imageUrl = url;
            }

            // 2. Save to database
            const { data, error } = await createMember({
                ...newMember,
                image_url: imageUrl
            });

            if (error) {
                alert('Errore durante il salvataggio: ' + error);
                setSaving(false);
                return;
            }

            // 3. Success!
            alert('Membro aggiunto con successo!');
            await refreshMembers(); // Refresh global data

            // Reset form
            setNewMember({
                name: '',
                role: '',
                description: '',
                email: '',
                phone: '',
                instagram: '',
                facebook: '',
                is_president: false
            });
            setMemberImage(null);
            setMemberImagePreview(null);
            setPreviewData(null);
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Errore imprevisto');
        } finally {
            setSaving(false);
        }
    };

    const handlePreviewMember = () => {
        setPreviewData({
            ...newMember,
            image: memberImagePreview || 'https://via.placeholder.com/150',
            id: 999
        });
        setPreviewType('member');
    };

    // === NEWS HANDLERS ===
    const handleNewsImagesChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewsImages(files);

            // Create previews
            const previews = files.map(file => URL.createObjectURL(file));
            setNewsImagesPreviews(previews);
        }
    };

    const handleNewsFilesChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewsFiles(files);
        }
    };

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

    const handleSaveNews = async () => {
        if (!newNews.title || !newNews.text) {
            alert('Titolo e Testo sono obbligatori!');
            return;
        }

        setSaving(true);

        try {
            // 1. Upload images to Cloudinary
            let imageUrls = [];
            if (newsImages.length > 0) {
                const { urls, error } = await uploadMultipleImages(newsImages);
                if (error) {
                    alert('Errore durante il caricamento delle immagini');
                    setSaving(false);
                    return;
                }
                imageUrls = urls;
            }

            // 2. Upload documents to Cloudinary
            let uploadedFiles = [];
            if (newsFiles.length > 0) {
                const { files, error } = await uploadMultipleFiles(newsFiles);
                if (error) {
                    alert('Errore durante il caricamento dei documenti: ' + error);
                    setSaving(false);
                    return;
                }
                uploadedFiles = files;
            }

            // 3. Save to database
            const newsData = {
                ...newNews,
                images: imageUrls.map(url => ({ src: url, alt: newNews.title })),
                files: uploadedFiles
            };

            const { data, error } = await createNews(newsData);

            if (error) {
                alert('Errore durante il salvataggio: ' + error);
                setSaving(false);
                return;
            }

            // 3. Success!
            alert('Notizia aggiunta con successo!');
            await refreshNews(); // Refresh global data

            // Reset form
            setNewNews({
                title: '',
                subtitle: '',
                text: '',
                videoUrl: '',
                date: {
                    day: String(today.getDate()).padStart(2, '0'),
                    month: today.toLocaleString('default', { month: 'short' }).toUpperCase(),
                    year: today.getFullYear()
                }
            });
            setNewsImages([]);
            setNewsImagesPreviews([]);
            setNewsFiles([]);
            setNewsDateInput(today.toISOString().split('T')[0]);
            setPreviewData(null);
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Errore imprevisto');
        } finally {
            setSaving(false);
        }
    };

    const handlePreviewNews = () => {
        setPreviewData({
            ...newNews,
            images: newsImagesPreviews.map((preview, idx) => ({
                src: preview,
                alt: `Preview ${idx + 1}`
            })),
            files: (newsFiles || []).map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            })),
            videoUrl: newNews.videoUrl,
            id: 999
        });
        setPreviewType('news');
    };

    return (
        <div className="py-6 px-4 md:py-10 md:px-5 max-w-[1000px] mx-auto">
            <h1 className="text-center text-[#333] mb-6 md:mb-10 text-2xl md:text-[2rem] font-bold">Pannello di Controllo Admin</h1>

            <div className="flex justify-center gap-5 mb-10 flex-wrap">
                <button
                    className={`py-3 px-5 md:py-[15px] md:px-[30px] border-2 border-[#66CBFF] text-base md:text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'members'
                        ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]'
                        : 'bg-white text-[#66CBFF] hover:bg-[#66CBFF] hover:text-white'
                        }`}
                    onClick={() => {
                        setActiveTab('members');
                        setPreviewData(null);
                    }}
                >
                    Aggiungi Membri
                </button>
                <button
                    className={`py-3 px-5 md:py-[15px] md:px-[30px] border-2 border-[#66CBFF] text-base md:text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'news'
                        ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]'
                        : 'bg-white text-[#66CBFF] hover:bg-[#66CBFF] hover:text-white'
                        }`}
                    onClick={() => {
                        setActiveTab('news');
                        setPreviewData(null);
                    }}
                >
                    Aggiungi Notizie
                </button>
                <button
                    className={`py-3 px-5 md:py-[15px] md:px-[30px] border-2 border-[#66CBFF] text-base md:text-[1.1rem] font-bold rounded-[30px] cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(102,203,255,0.4)] ${activeTab === 'reports'
                        ? 'bg-[#66CBFF] text-white -translate-y-[3px] shadow-[0_5px_15px_rgba(102,203,255,0.4)]'
                        : 'bg-white text-[#66CBFF] hover:bg-[#66CBFF] hover:text-white'
                        }`}
                    onClick={() => {
                        setActiveTab('reports');
                        setPreviewData(null);
                    }}
                >
                    Controlla Segnalazioni
                </button>
            </div>

            <div className="admin-content">
                {/* === MEMBERS TAB === */}
                {activeTab === 'members' && (
                    <div className="bg-white p-6 md:p-[30px] rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[15px] max-w-[600px] mx-auto animate-fade-in">
                        <h3 className="text-xl font-bold">Aggiungi Nuovo Membro</h3>

                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Nome *"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        />

                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Ruolo *"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        />

                        <textarea
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Descrizione"
                            value={newMember.description}
                            onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                        />

                        {/* Contatti Opzionali */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                className="p-[12px] border border-[#ddd] rounded-[8px]"
                                placeholder="Email (opzionale)"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            />
                            <input
                                className="p-[12px] border border-[#ddd] rounded-[8px]"
                                placeholder="Telefono (opzionale)"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            />
                            <input
                                className="p-[12px] border border-[#ddd] rounded-[8px]"
                                placeholder="Instagram (User o Link - opzionale)"
                                value={newMember.instagram}
                                onChange={(e) => setNewMember({ ...newMember, instagram: e.target.value })}
                            />
                            <input
                                className="p-[12px] border border-[#ddd] rounded-[8px]"
                                placeholder="Facebook (User o Link - opzionale)"
                                value={newMember.facebook}
                                onChange={(e) => setNewMember({ ...newMember, facebook: e.target.value })}
                            />
                        </div>

                        {/* FILE UPLOAD */}
                        <div>
                            <label className="block font-semibold mb-2">Immagine</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMemberImageChange}
                                className="p-[12px] border border-[#ddd] rounded-[8px] w-full"
                            />
                            {memberImagePreview && (
                                <img src={memberImagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                            )}
                        </div>

                        {/* CHECKBOX PRESIDENTE */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newMember.is_president}
                                onChange={(e) => setNewMember({ ...newMember, is_president: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <span className="font-semibold">👑 Flag Presidente (card più grande)</span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                className="bg-[#66CBFF] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold flex-1"
                                onClick={handlePreviewMember}
                            >
                                👁️ Preview
                            </button>
                            <button
                                className="bg-[#28a745] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold flex-1"
                                onClick={handleSaveMember}
                                disabled={saving}
                            >
                                {saving ? '⏳ Salvataggio...' : '💾 Salva nel Database'}
                            </button>
                        </div>
                    </div>
                )}

                {/* === NEWS TAB === */}
                {activeTab === 'news' && (
                    <div className="bg-white p-[30px] rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[15px] max-w-[600px] mx-auto animate-fade-in">
                        <h3 className="text-xl font-bold">Aggiungi Nuova Notizia</h3>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">Data:</label>
                            <input
                                className="p-[12px] border border-[#ddd] rounded-[8px]"
                                type="date"
                                value={newsDateInput}
                                onChange={handleDateChange}
                            />
                        </div>

                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Titolo *"
                            value={newNews.title}
                            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        />

                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Sottotitolo"
                            value={newNews.subtitle}
                            onChange={(e) => setNewNews({ ...newNews, subtitle: e.target.value })}
                        />

                        <textarea
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Testo *"
                            value={newNews.text}
                            onChange={(e) => setNewNews({ ...newNews, text: e.target.value })}
                        />

                        <input
                            className="p-[12px] border border-[#ddd] rounded-[8px]"
                            placeholder="Link YouTube (URL completo)"
                            value={newNews.videoUrl}
                            onChange={(e) => setNewNews({ ...newNews, videoUrl: e.target.value })}
                        />

                        {/* FILE UPLOAD MULTIPLE IMAGES */}
                        <div>
                            <label className="block font-semibold mb-2">Immagini (opzionale)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleNewsImagesChange}
                                className="p-[12px] border border-[#ddd] rounded-[8px] w-full"
                            />
                            {newsImagesPreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {newsImagesPreviews.map((preview, idx) => (
                                        <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* FILE UPLOAD DOCUMENTS */}
                        <div>
                            <label className="block font-semibold mb-2">Allegati (PDF, Word, Excel - opzionale)</label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                onChange={handleNewsFilesChange}
                                className="p-[12px] border border-[#ddd] rounded-[8px] w-full"
                            />
                            {newsFiles.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p className="font-semibold">File selezionati:</p>
                                    <ul className="list-disc pl-5">
                                        {newsFiles.map((file, idx) => (
                                            <li key={idx}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="bg-[#66CBFF] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold flex-1"
                                onClick={handlePreviewNews}
                            >
                                👁️ Preview
                            </button>
                            <button
                                className="bg-[#28a745] text-white border-none p-[12px] rounded-[8px] cursor-pointer font-bold flex-1"
                                onClick={handleSaveNews}
                                disabled={saving}
                            >
                                {saving ? '⏳ Salvataggio...' : '💾 Salva nel Database'}
                            </button>
                        </div>
                    </div>
                )}

                {/* === REPORTS TAB === */}
                {activeTab === 'reports' && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">Segnalazioni Ricevute</h3>

                        {loadingReports ? (
                            <p className="text-center py-4">Caricamento...</p>
                        ) : reports.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">Nessuna segnalazione ricevuta</p>
                        ) : (
                            reports.map((r) => (
                                <div key={r.id} className="bg-white p-[20px] rounded-[10px] mb-[15px] border-l-[5px] border-l-[#ff4757] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-lg">
                                            {r.name || 'Anonimo'} {r.surname || ''}
                                        </h4>
                                        <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString('it-IT')}</span>
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-sm font-semibold text-gray-600">Email:</span>
                                        <span className="text-sm ml-2">{r.email || 'Anonimo'}</span>
                                    </div>

                                    {r.phone && (
                                        <div className="mb-2">
                                            <span className="text-sm font-semibold text-gray-600">Telefono:</span>
                                            <span className="text-sm ml-2">{r.phone}</span>
                                        </div>
                                    )}

                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Messaggio:</p>
                                        <p className="text-sm whitespace-pre-wrap">{r.description}</p>
                                    </div>

                                    {r.images && r.images.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-gray-600 mb-2">Immagini allegate:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {r.images.map((imgUrl, idx) => (
                                                    <div key={idx} className="relative group cursor-pointer" onClick={() => setSelectedImage(imgUrl)}>
                                                        <img
                                                            src={imgUrl}
                                                            alt={`Immagine ${idx + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-accent transition-colors"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* === PREVIEW SECTION === */}
                {previewData && (
                    <div className="mt-[40px] border-t-[2px] border-t-dashed border-t-[#ddd] pt-[40px] text-center animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">Anteprima (Visualizzazione Finale)</h3>

                        {previewType === 'member' && (
                            <div className="w-full max-w-7xl mx-auto p-[20px] bg-[#f8faff]">
                                {previewData.is_president ? (
                                    // President Preview: Full Width
                                    <div className="w-full mb-8">
                                        <MemberCard
                                            member={previewData}
                                            isAdmin={false}
                                            variant="president"
                                        />
                                    </div>
                                ) : (
                                    // Standard Member Preview: 2-Column Grid Context
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <MemberCard
                                            member={previewData}
                                            isAdmin={false}
                                            variant="standard"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {previewType === 'news' && (
                            <div className="max-w-4xl mx-auto p-[20px] bg-[#f8faff]">
                                <NewsCard data={previewData} isAdmin={false} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300" onClick={() => setSelectedImage(null)}>
                            ×
                        </button>
                        <img src={selectedImage} alt="Immagine ingrandita" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
