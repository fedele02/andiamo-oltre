import React, { useEffect } from 'react';

const Lightbox = ({ isOpen, imageSrc, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !imageSrc) return null;

    return (
        <div 
            className="fixed top-0 left-0 w-full h-full bg-gray-900/95 z-[2000] flex justify-center items-center animate-fadeIn backdrop-blur-[5px]" 
            onClick={onClose}
        >
            <div 
                className="relative max-w-[90%] max-h-[90%] flex justify-center items-center" 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    className="absolute -top-[50px] -right-[50px] bg-white border-none text-[#333] text-[24px] cursor-pointer w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold transition-all hover:bg-[#ff4757] hover:text-white hover:rotate-90" 
                    onClick={onClose}
                >
                    &times;
                </button>
                <img 
                    src={imageSrc} 
                    alt="Full size" 
                    className="max-w-full max-h-[90vh] rounded-[10px] shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain" 
                />
            </div>
        </div>
    );
};

export default Lightbox;
