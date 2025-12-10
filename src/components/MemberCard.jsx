import React, { useState } from 'react';
import { uploadImage } from '../lib/cloudinary/upload';

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

    // Icons from Footer (reused for consistency)
    const icons = {
        phone: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        email: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        instagram: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth={2} />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
            </svg>
        ),
        instagram_legacy_hidden: (
            <div style={{ display: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            </div>
        ),
        facebook: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#66CBFF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
        )
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
                    {/* Instagram - Icon Only */}
                    {member.instagram && (
                        <a href={member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram.replace('@', '').trim()}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#66CBFF] transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                {icons.instagram}
                            </div>
                        </a>
                    )}

                    {/* Facebook - Icon Only */}
                    {member.facebook && (
                        <a href={member.facebook.includes('OLTRE Laterza') ? 'https://www.facebook.com/people/OLTRE-Laterza/100095539123613/' : (member.facebook.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook.trim().replace(/\s+/g, '-')}`)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#66CBFF] transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                {icons.facebook}
                            </div>
                        </a>
                    )}

                    {/* Email - Icon + Text */}
                    {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-500 hover:text-[#66CBFF] transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                {icons.email}
                            </div>
                            <span className="text-xs font-medium truncate max-w-[150px]">{member.email}</span>
                        </a>
                    )}

                    {/* Phone - Icon + Text */}
                    {member.phone && (
                        <a href={getWhatsAppLink(member.phone, member.name)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#66CBFF] transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0">
                                {icons.phone}
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">{member.phone}</span>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberCard;
