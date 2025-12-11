import React, { useState } from 'react';
import { uploadImage } from '../lib/cloudinary/upload';
import SocialIcon from './ui/SocialIcon';

const MemberCard = ({ member, isAdmin, onDelete, onEdit, variant = 'standard' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMember, setEditedMember] = useState({ ...member });
    const [uploading, setUploading] = useState(false);

    const handleSave = () => {
        // Ensure image_url is populated for the backend (Members.jsx maps it to 'image' for display)
        const memberData = {
            ...editedMember,
            image_url: editedMember.image // Map back to database column name
        };
        onEdit(member.id, memberData);
        setIsEditing(false);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const { url, error } = await uploadImage(file);

        if (error) {
            alert('Errore durante il caricamento dell\'immagine');
            setUploading(false);
            return;
        }

        setEditedMember({ ...editedMember, image: url });
        setUploading(false);
    };

    const isPresident = variant === 'president';

    // WhatsApp Link Generator
    const getWhatsAppLink = (phone, name) => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const text = `Ciao ${name}, ho bisogno di...`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    // PROPER LAYOUT CONFIGURATION
    // Standard Card: "flex-col sm:flex-row items-center sm:items-start" -> Image Left, Content Right on sm+ screens
    const containerClasses = isPresident
        ? "relative group bg-[#66CBFF]/10 p-8 rounded-[30px] shadow-sm hover:shadow-[0_0_30px_rgba(102,203,255,0.6)] transition-all duration-300 flex flex-col md:flex-row flex-wrap items-center md:items-start gap-8 border-none w-full"
        : "relative group bg-white p-6 rounded-[20px] shadow-sm hover:shadow-[0_0_25px_rgba(102,203,255,0.5)] transition-all duration-300 flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-6 border border-gray-100 w-full";

    const imageClasses = isPresident
        ? "bg-center bg-no-repeat bg-cover rounded-full w-40 h-40 md:w-52 md:h-52 border-[6px] border-[#66CBFF]/20 shadow-lg object-cover"
        : "bg-center bg-no-repeat bg-cover rounded-full w-28 h-28 md:w-36 md:h-36 border-[3px] border-[#66CBFF]/20 shadow-md object-cover";

    return (
        <div className={containerClasses}>
            {/* Admin Controls - Visible on Hover */}
            {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/50 p-1 rounded-full backdrop-blur-sm">
                    <button
                        className="p-2 rounded-full bg-white text-gray-500 hover:text-[#66CBFF] shadow-sm transition-colors"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        ✏️
                    </button>
                    <button
                        className="p-2 rounded-full bg-white text-gray-500 hover:text-red-500 shadow-sm transition-colors"
                        onClick={() => onDelete(member.id)}
                    >
                        🗑️
                    </button>
                </div>
            )}

            {/* Image Section */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <img
                    src={editedMember.image || 'https://via.placeholder.com/150'}
                    alt={member.name}
                    className={imageClasses}
                />
                {isEditing && (
                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer bg-[#66CBFF] text-white text-[10px] px-2 py-1 rounded shadow hover:bg-[#5bb8e8] transition-colors">
                            {uploading ? 'Caricamento...' : 'Cambia Foto'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                        </label>
                    </div>
                )}
            </div>

            {/* Content Section - Added min-w-0 to allow text truncation/wrapping inside flex item */}
            <div className={`flex flex-1 flex-col justify-center min-w-0 w-full ${isPresident ? 'text-center md:text-left' : 'text-center sm:text-left'}`}>
                {isEditing ? (
                    <div className="flex flex-col gap-3 w-full">
                        <input
                            value={editedMember.name}
                            onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="Nome"
                        />
                        <input
                            value={editedMember.role}
                            onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="Ruolo"
                        />
                        <textarea
                            value={editedMember.description}
                            onChange={(e) => setEditedMember({ ...editedMember, description: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm min-h-[80px]"
                            placeholder="Descrizione"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                value={editedMember.email || ''}
                                onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Email"
                            />
                            <input
                                value={editedMember.phone || ''}
                                onChange={(e) => setEditedMember({ ...editedMember, phone: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Telefono"
                            />
                            <input
                                value={editedMember.instagram || ''}
                                onChange={(e) => setEditedMember({ ...editedMember, instagram: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Instagram"
                            />
                            <input
                                value={editedMember.facebook || ''}
                                onChange={(e) => setEditedMember({ ...editedMember, facebook: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Facebook"
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs bg-gray-200 rounded-md">Annulla</button>
                            <button onClick={handleSave} className="px-3 py-1 text-xs bg-[#66CBFF] text-white rounded-md" disabled={uploading}>
                                {uploading ? 'Attendi...' : 'Salva'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className={`font-bold text-gray-900 break-words ${isPresident ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                            {member.name}
                        </h3>
                        <p className={`text-[#66CBFF] font-medium mb-3 uppercase tracking-wide break-words ${isPresident ? 'text-lg' : 'text-sm'}`}>
                            {member.role}
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light break-words whitespace-pre-wrap">
                            {member.description}
                        </p>
                    </>
                )}
            </div>

            {/* Contact Icons Footer - Full Width Bottom */}
            {!isEditing && (
                <div className={`w-full flex flex-wrap items-center gap-4 pt-2 ${isPresident ? 'justify-center md:justify-start' : 'justify-center sm:justify-start'}`}>
                    {member.instagram && (
                        <SocialIcon 
                            type="instagram" 
                            href={member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram.replace('@', '').trim()}`} 
                        />
                    )}

                    {member.facebook && (
                        <SocialIcon 
                            type="facebook" 
                            href={member.facebook.includes('OLTRE Laterza') ? 'https://www.facebook.com/people/OLTRE-Laterza/100095539123613/' : (member.facebook.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook.trim().replace(/\s+/g, '-')}`)} 
                        />
                    )}

                    {member.email && (
                        <SocialIcon 
                            type="email" 
                            href={`mailto:${member.email}`} 
                            label={member.email} 
                        />
                    )}

                    {member.phone && (
                        <SocialIcon 
                            type="phone" 
                            href={getWhatsAppLink(member.phone, member.name)} 
                            label={member.phone} 
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberCard;
