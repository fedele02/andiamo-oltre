import React from 'react';

const SearchBar = ({ onSearch }) => {
    return (
        <div className="my-5 flex justify-center">
            <input
                type="text"
                className="w-full max-w-[500px] px-5 py-3 border-2 border-[#66CBFF] rounded-[25px] text-base outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(102,203,255,0.5)]"
                placeholder="Cerca notizie..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
