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
                instagram: m.instagram,
                facebook: m.facebook,
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

    // Filter Logic: Find President and Council
    const president = members.find(m => m.is_president || m.role?.trim().toLowerCase() === 'presidente');
    const council = members.filter(m => m.id !== president?.id); // Everyone else

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
        <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col gap-3 text-center mb-12 md:mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: '#66CBFF' }}>
                    I Nostri Membri
                </h1>
                <p className="text-base md:text-lg font-normal text-gray-500">
                    Scopri le persone che guidano il nostro partito.
                </p>
            </div>

            {/* President Section */}
            {president && (
                <section className="mb-16 animate-fade-in">
                    <MemberCard
                        key={president.id}
                        member={president}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        variant="president"
                    />
                </section>
            )}

            {/* Council Section */}
            {council.length > 0 && (
                <section className="animate-fade-in animation-delay-200">
                    {/* <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left text-gray-800">
                        Consiglio Direttivo
                    </h2> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {council.map(member => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                isAdmin={isAdmin}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                variant="standard"
                            />
                        ))}
                    </div>
                </section>
            )}

            {members.length === 0 && (
                <p className="text-center text-gray-500 text-lg py-12">Nessun membro trovato</p>
            )}
        </div>
    );
};

export default Members;

