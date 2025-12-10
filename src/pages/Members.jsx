import React, { useState, useEffect } from 'react';
import MemberCard from '../components/MemberCard';
import { getMembers, deleteMember, updateMember } from '../lib/supabase/members';

const Members = ({ isAdmin }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch members from Supabase on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await getMembers();

        if (error) {
            setError('Errore nel caricamento dei membri');
            console.error(error);
        } else {
            // Transform the data to match the expected format
            const transformedData = data.map(m => ({
                id: m.id,
                name: m.name,
                role: m.role,
                description: m.description,
                email: m.email,
                phone: m.phone,
                image: m.image_url
            }));
            setMembers(transformedData);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo membro?")) {
            const { error } = await deleteMember(id);

            if (error) {
                alert('Errore durante l\'eliminazione del membro');
                console.error(error);
            } else {
                // Remove from local state
                setMembers(members.filter(m => m.id !== id));
            }
        }
    };

    const handleEdit = async (id, updatedMember) => {
        const { data, error } = await updateMember(id, updatedMember);

        if (error) {
            alert('Errore durante l\'aggiornamento del membro');
            console.error(error);
        } else {
            // Update local state
            setMembers(members.map(m => m.id === id ? updatedMember : m));
        }
    };

    // Sort members: President first
    const sortedMembers = [...members].sort((a, b) => {
        if (a.role === 'Presidente') return -1;
        if (b.role === 'Presidente') return 1;
        return 0;
    });

    if (loading) {
        return (
            <div className="py-20 px-5 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#66CBFF]"></div>
                <p className="mt-4 text-gray-600">Caricamento membri...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 px-5 text-center">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={fetchMembers}
                    className="mt-4 px-6 py-2 bg-[#66CBFF] text-white rounded-lg hover:bg-[#3faae0]"
                >
                    Riprova
                </button>
            </div>
        );
    }

    return (
        <div className="py-20 px-5 max-w-[1400px] mx-auto">
            <h1 className="text-center text-gray-900 mb-10 md:mb-20 text-3xl md:text-5xl font-extrabold font-title relative table mx-auto after:content-[''] after:block after:w-full after:h-[6px] after:bg-accent after:mt-4 after:mx-auto after:rounded-full after:opacity-80">I Nostri Membri</h1>
            {sortedMembers.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Nessun membro trovato</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[50px] items-start">
                    {sortedMembers.map(member => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            isAdmin={isAdmin}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Members;

