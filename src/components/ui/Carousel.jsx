import React, { useState, useEffect } from 'react';

const Carousel = ({ images, autoScroll = true, interval = 3000, onImageClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoScroll || isPaused || images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoScroll, isPaused, images.length, interval]);

    const nextSlide = (e) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e) => {
        e?.stopPropagation();
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    return (
        <div 
            id="indicators-carousel" 
            className="relative w-full" 
            data-carousel="static" 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        >
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-base md:h-96 rounded-[20px]">
                {images.map((img, index) => (
                    <div 
                        key={index} 
                        className={`duration-700 ease-in-out absolute w-full h-full top-0 left-0 transition-opacity ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        data-carousel-item={index === currentSlide ? "active" : ""}
                    >
                        <img 
                            src={img.src} 
                            className="absolute block w-full h-full object-contain -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 cursor-pointer" 
                            alt={img.alt || `Slide ${index + 1}`} 
                            onClick={() => onImageClick && onImageClick(img.src)}
                        />
                    </div>
                ))}
            </div>
            
            {/* Slider indicators */}
            {images.length > 1 && (
                <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
                    {images.map((_, index) => (
                        <button 
                            key={index}
                            type="button" 
                            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`} 
                            aria-current={index === currentSlide} 
                            aria-label={`Slide ${index + 1}`} 
                            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                        ></button>
                    ))}
                </div>
            )}
            
            {/* Slider controls */}
            {images.length > 1 && (
                <>
                    <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={prevSlide}>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                            </svg>
                            <span className="sr-only">Previous</span>
                        </span>
                    </button>
                    <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={nextSlide}>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="sr-only">Next</span>
                        </span>
                    </button>
                </>
            )}
        </div>
    );
};

export default Carousel;
