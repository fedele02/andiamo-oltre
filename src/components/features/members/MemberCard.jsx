import React, { useState } from 'react';

const MemberCard = ({ member, isAdmin, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMember, setEditedMember] = useState({ ...member });

    const handleSave = () => {
        onEdit(member.id, editedMember);
        setIsEditing(false);
    };

    const isPresident = member.role === 'Presidente';

    return (
        <div className={`flex flex-col bg-white rounded-[30px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] items-center text-center border border-black/3 h-full hover:-translate-y-[15px] hover:shadow-[0_30px_60px_rgba(102,203,255,0.25)] max-[768px]:flex-col max-[768px]:text-center max-[768px]:p-[30px_20px]
            ${isPresident ? 'col-span-full flex-row p-20 border-none shadow-[0_20px_60px_rgba(102,203,255,0.15)] mb-[60px] overflow-hidden before:content-[\'\'] before:absolute before:top-0 before:left-0 before:w-full before:h-[10px] before:bg-gradient-to-r before:from-[#66CBFF] before:to-[#4facfe] max-[768px]:p-[40px_20px] max-[768px]:border-b-[5px] max-[768px]:border-b-[#66CBFF]' : ''}`}>

            {isAdmin && (
                <div className="absolute top-[10px] right-[10px] flex gap-[10px]">
                    <button className="bg-none border-none cursor-pointer text-[1.2rem] p-[5px] rounded-[5px] transition-colors hover:bg-[#f0f0f0]" onClick={() => setIsEditing(!isEditing)}>✏️</button>
                    <button className="bg-none border-none cursor-pointer text-[1.2rem] p-[5px] rounded-[5px] transition-colors hover:bg-[#f0f0f0]" onClick={() => onDelete(member.id)}>🗑️</button>
                </div>
            )}

            <div className={`shrink-0 mb-[30px] relative ${isPresident ? 'mb-0 mr-[60px] max-[768px]:mr-0 max-[768px]:mb-5' : ''}`}>
                <img src={member.image} alt={member.name} className={`rounded-full object-cover border-[5px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] aspect-square
                    ${isPresident ? 'w-[280px] h-[280px] min-w-[280px] min-h-[280px] border-[8px] shadow-[0_20px_40px_rgba(102,203,255,0.3)]' : 'w-[160px] h-[160px] min-w-[160px] min-h-[160px]'}`} />
            </div>

            <div className={`grow w-full max-[768px]:text-center ${isPresident ? 'text-left' : ''}`}>
                {isEditing ? (
                    <>
                        <input
                            value={editedMember.name}
                            onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                            className="w-full p-[8px] mb-[10px] border border-[#ddd] rounded-[5px]"
                        />
                        <input
                            value={editedMember.role}
                            onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })}
                            className="w-full p-[8px] mb-[10px] border border-[#ddd] rounded-[5px]"
                        />
                        <textarea
                            value={editedMember.description}
                            onChange={(e) => setEditedMember({ ...editedMember, description: e.target.value })}
                            className="w-full p-[8px] mb-[10px] border border-[#ddd] rounded-[5px] min-h-[100px]"
                        />
                        <button onClick={handleSave} className="bg-[#66CBFF] text-white border-none p-[5px_15px] rounded-[5px] cursor-pointer">Ok</button>
                    </>
                ) : (
                    <>
                        <h3 className={`text-gray-900 mb-3 font-extrabold font-title ${isPresident ? 'text-4xl max-[768px]:text-3xl' : 'text-2xl'}`}>{member.name}</h3>
                        <h4 className="text-[#66CBFF] m-[0_0_25px_0] font-[700] uppercase tracking-[2px] text-[0.85rem]">{member.role}</h4>
                        <p className="text-[#555] leading-[1.8] mb-[30px] text-[1rem] font-[400]">{member.description}</p>
                    </>
                )}

                <div className={`border-t-[2px] border-t-[#f5f5f5] pt-[25px] flex gap-[25px] items-center flex-wrap max-[768px]:justify-center ${isPresident ? 'justify-start' : 'justify-center'}`}>
                    <div className="flex gap-[10px]">
                        <span className="text-[1.2rem] cursor-pointer">📷</span> {/* Instagram placeholder */}
                        <span className="text-[1.2rem] cursor-pointer">📘</span> {/* Facebook placeholder */}
                    </div>
                    <p className="">{member.email}</p>
                    <p className="">{member.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default MemberCard;
