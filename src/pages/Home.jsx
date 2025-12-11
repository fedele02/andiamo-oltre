import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useAppData } from '../context/AppContext';
import { updateContent } from '../lib/supabase/content';

const Home = ({ isAdmin }) => {
    const { homeDescription, updateHomeDescription } = useAppData();
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Sync local editing state with global state when opening edit mode
    useEffect(() => {
        if (isEditing) {
            setEditedDescription(homeDescription);
        }
    }, [isEditing, homeDescription]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Update Supabase
            const { error } = await updateContent('home_description', editedDescription);
            
            if (error) {
                alert('Errore durante il salvataggio: ' + error);
            } else {
                // 2. Update Global State (and localStorage)
                updateHomeDescription(editedDescription);
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
            alert('Errore imprevisto durante il salvataggio');
        } finally {
            setIsSaving(false);
        }
    };

    // Fallback text if description is empty (e.g. first load ever)
    const displayDescription = homeDescription || "Benvenuti su Andiamo Oltre. Nessun contenuto presente.";

    return (
        <div className="flex flex-col items-center p-0 bg-transparent w-full">
            <div className="w-full min-h-[35vh] md:min-h-[60vh] flex justify-center items-center bg-transparent relative mb-6 md:mb-10 pt-8 md:pt-[60px]">
                {/* Soft Blue Glow behind Logo */}
                <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-[#66CBFF]/30 rounded-full blur-[60px] pointer-events-none z-0"></div>
                
                <img src={logo} alt="Logo Partito" className="w-[240px] h-[240px] md:w-[350px] md:h-[350px] rounded-full object-cover shadow-[0_0_50px_rgba(102,203,255,0.6)] transition-transform duration-500 animate-float relative z-10" />
            </div>

            <div className={`text-center relative px-4 md:px-10 pb-[100px] mx-auto transition-all duration-300 ${isEditing ? 'w-full max-w-[95vw]' : 'max-w-[1000px]'}`}>
                {isAdmin && (
                    <button className="absolute -top-[50px] right-5 bg-white border-none text-[#66CBFF] px-6 py-2.5 rounded-[30px] cursor-pointer font-extrabold shadow-md transition-all uppercase tracking-widest hover:-translate-y-[3px] hover:shadow-[0_10px_20px_rgba(102,203,255,0.3)]" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? '❌ Annulla' : '✏️ Modifica Descrizione'}
                    </button>
                )}

                {isEditing ? (
                    <div className="w-full">
                        <textarea
                            className="w-full h-[60vh] p-[20px] md:p-[30px] border-2 border-[#eee] rounded-[20px] text-[1.1rem] leading-[1.8] mb-5 font-['Open Sans'] shadow-inner focus:outline-none focus:border-[#66CBFF] resize-y"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <button 
                            className={`bg-[#66CBFF] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5bb8e8] transition-colors shadow-md cursor-pointer ${isSaving ? 'opacity-70 cursor-wait' : ''}`} 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Salvataggio...' : 'Salva'}
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        {displayDescription.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className="text-lg leading-loose text-gray-600 mb-8 text-center font-light font-body">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
