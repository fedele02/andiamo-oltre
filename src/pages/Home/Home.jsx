import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';

const Home = ({ isAdmin }) => {
    const [description, setDescription] = useState(`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
    `); // Shortened for brevity in code, but represents the idea.

    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);

    const handleSave = () => {
        setDescription(editedDescription);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col items-center p-0 bg-transparent w-full">
            <div className="w-full min-h-[60vh] flex justify-center items-center bg-transparent relative mb-10 pt-[60px]">
                <img src={logo} alt="Logo Partito" className="w-[350px] h-[350px] rounded-full object-cover border-[10px] border-white shadow-[0_20px_60px_rgba(102,203,255,0.3)] transition-transform duration-500 animate-float" />
            </div>

            <div className="max-w-[1000px] text-center relative px-10 pb-[100px] mx-auto">
                {isAdmin && (
                    <button className="absolute -top-[50px] right-5 bg-white border-none text-[#66CBFF] px-6 py-2.5 rounded-[30px] cursor-pointer font-extrabold shadow-md transition-all uppercase tracking-widest hover:-translate-y-[3px] hover:shadow-[0_10px_20px_rgba(102,203,255,0.3)]" onClick={() => setIsEditing(!isEditing)}>
                        ✏️ Modifica Descrizione
                    </button>
                )}

                {isEditing ? (
                    <div className="w-full">
                        <textarea
                            className="w-full min-h-[500px] p-[30px] border-2 border-[#eee] rounded-[20px] text-[1.1rem] leading-[1.8] mb-5 font-['Open Sans'] shadow-inner focus:outline-none focus:border-[#66CBFF]"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <button className="bg-[#66CBFF] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5bb8e8] transition-colors shadow-md cursor-pointer" onClick={handleSave}>Salva</button>
                    </div>
                ) : (
                    <div className="text-center">
                        {description.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-lg leading-loose text-gray-600 mb-8 text-center font-light font-body first:text-3xl first:font-extrabold first:text-gray-900 first:mb-10 first:font-title first:tracking-tight">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
