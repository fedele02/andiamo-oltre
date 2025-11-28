import React, { useState } from 'react';
import MemberCard from '../../components/features/members/MemberCard';

const Members = ({ isAdmin }) => {
    const [members, setMembers] = useState([
        {
            id: 1,
            name: "Antonio Casarola",
            role: "Presidente",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            email: "antonio.casarola@example.com",
            phone: "+39 333 1234567",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
        },
        {
            id: 2,
            name: "Giulia Rossi",
            role: "Segretario",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
            email: "giulia.rossi@example.com",
            phone: "+39 333 7654321",
            image: "https://images.unsplash.com/photo-1573496359-136d47552640?w=400"
        },
        {
            id: 3,
            name: "Marco Bianchi",
            role: "Tesoriere",
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
            email: "marco.bianchi@example.com",
            phone: "+39 333 9876543",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
        },
        {
            id: 4,
            name: "Elena Verdi",
            role: "Consigliere",
            description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            email: "elena.verdi@example.com",
            phone: "+39 333 4567890",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
        },
        {
            id: 5,
            name: "Luca Neri",
            role: "Consigliere",
            description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.",
            email: "luca.neri@example.com",
            phone: "+39 333 1122334",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
        }
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo membro?")) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const handleEdit = (id, updatedMember) => {
        setMembers(members.map(m => m.id === id ? updatedMember : m));
    };

    // Sort members: President first
    const sortedMembers = [...members].sort((a, b) => {
        if (a.role === 'Presidente') return -1;
        if (b.role === 'Presidente') return 1;
        return 0;
    });

    return (
        <div className="py-20 px-5 max-w-[1400px] mx-auto">
            <h1 className="text-center text-gray-900 mb-20 text-5xl font-extrabold font-title relative table mx-auto after:content-[''] after:block after:w-full after:h-[6px] after:bg-accent after:mt-4 after:mx-auto after:rounded-full after:opacity-80">I Nostri Membri</h1>
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
        </div>
    );
};

export default Members;
