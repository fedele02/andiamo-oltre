import React, { useState, useEffect, useRef } from 'react';
import { uploadMultipleImages } from '../lib/cloudinary/upload';

const NewsCard = ({ data, isAdmin, onDelete, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-Scroll Logic for Carousel (Mobile & Desktop)
  useEffect(() => {
    // Determine if we are in carousel mode
    const isCarouselMode = (isMobile && editedData.images.length > 0) || (!isMobile && editedData.images.length > 5);

    // Only auto-scroll if in carousel mode, not editing, not paused, and we have > 1 images
    const shouldScroll = isCarouselMode && !isEditing && !isPaused && editedData.images.length > 1;
    
    if (!shouldScroll) return;

    const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % editedData.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isEditing, isPaused, editedData.images.length]);

  const openLightbox = (imgSrc) => {
    setSelectedImage(imgSrc);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      const newImagesToUpload = editedData.images.filter(img => img.file);
      let updatedImages = [...editedData.images];

      if (newImagesToUpload.length > 0) {
        const filesToUpload = newImagesToUpload.map(img => img.file);
        const { urls, error } = await uploadMultipleImages(filesToUpload);

        if (error) {
          alert('Errore caricamento immagini: ' + error);
          setIsUploading(false);
          return;
        }

        let uploadIndex = 0;
        updatedImages = updatedImages.map(img => {
          if (img.file) {
            const newUrl = urls[uploadIndex];
            uploadIndex++;
            return { src: newUrl, alt: img.alt || '' };
          }
          return img;
        });
      }

      const finalData = { ...editedData, images: updatedImages };
      await onEdit(data.id, finalData);
      setEditedData(finalData);
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Errore durante il salvataggio");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = editedData.images.filter((_, i) => i !== index);
    setEditedData({ ...editedData, images: newImages });
    if (currentSlide >= newImages.length) {
        setCurrentSlide(Math.max(0, newImages.length - 1));
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleVideoChange = (e) => {
    const val = e.target.value;
    setEditedData({ ...editedData, videoUrl: val });
  };

  // --- File Input Handler ---
  const handleFileInputChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files);
          const newImages = files.map(file => ({
              src: URL.createObjectURL(file),
              alt: file.name,
              file: file
          }));
          setEditedData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
          }));
      }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      const newImages = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
        file: file
      }));
      setEditedData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleInternalDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    const newImages = [...editedData.images];
    const draggedItem = newImages[draggedItemIndex];
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);
    setEditedData({ ...editedData, images: newImages });
    setDraggedItemIndex(null);
  };

  const handleContainerDragOver = (e) => {
    e.preventDefault();
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % editedData.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + editedData.images.length) % editedData.images.length);
  };

  // Determine if we should show the Carousel
  // Desktop: > 5 images AND not editing
  // Mobile: Always (if > 0 images) AND not editing
  const showCarousel = !isEditing && (
      (isMobile && editedData.images.length > 0) || 
      (!isMobile && editedData.images.length > 5)
  );

  const displayImages = editedData.images;

  return (
    <>
      <article className="bg-white rounded-3xl shadow-card mb-12 overflow-hidden flex flex-col relative transition-all duration-300 border border-gray-100 p-10 card-hover max-[768px]:p-4">
        {isAdmin && (
          <div className="absolute top-[30px] right-[30px] z-20 flex gap-[15px]">
            <button className="bg-white border-none w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all text-[1.2rem] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]" onClick={() => setIsEditing(!isEditing)}>✏️</button>
            <button className="bg-white border-none w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all text-[1.2rem] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#ff4757] hover:text-white" onClick={() => onDelete(data.id)}>🗑️</button>
          </div>
        )}

        {/* Header Section (Date + Title) */}
        <div className="flex items-center mb-[30px] gap-[30px] max-[768px]:items-start max-[768px]:gap-[10px]">
            {/* Date Box */}
            {isEditing ? (
                <div className="bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white p-[5px] rounded-[15px] flex flex-col items-center justify-center font-[800] font-['Montserrat'] shadow-[0_10px_20px_rgba(102,203,255,0.4)] min-w-[90px] shrink-0 gap-[5px] max-[768px]:min-w-[70px]">
                    <input className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[1.5rem] h-[40px] focus:outline-none focus:bg-white/30 focus:border-white" value={editedData.date.day} onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, day: e.target.value } })} maxLength={2} />
                    <input className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[1rem] uppercase focus:outline-none focus:bg-white/30 focus:border-white" value={editedData.date.month} onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, month: e.target.value } })} maxLength={3} />
                    <input className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[0.8rem] focus:outline-none focus:bg-white/30 focus:border-white" value={editedData.date.year} onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, year: e.target.value } })} maxLength={4} />
                </div>
            ) : (
                <div className="bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white p-[15px_10px] rounded-[15px] flex flex-col items-center justify-center font-[800] font-['Montserrat'] shadow-[0_10px_20px_rgba(102,203,255,0.4)] min-w-[90px] shrink-0 max-[768px]:min-w-[70px] max-[768px]:p-[10px_5px]">
                    <span className="text-[2rem] leading-none max-[768px]:text-[1.5rem]">{data.date.day}</span>
                    <span className="text-[1.1rem] uppercase tracking-[1px] max-[768px]:text-[0.9rem]">{data.date.month}</span>
                    <span className="text-[0.9rem] opacity-90 max-[768px]:text-[0.7rem]">{data.date.year}</span>
                </div>
            )}

            <div className="w-[3px] h-[80px] bg-[#eee] rounded-[2px] max-[768px]:h-[60px] shrink-0 block"></div>

            {/* Title & Subtitle */}
            <div className="flex flex-col justify-center max-[768px]:flex-1 max-[768px]:min-w-0" style={{ width: isEditing ? '100%' : 'auto' }}>
                {isEditing ? (
                    <div className="flex flex-col gap-[10px] w-full">
                        <input value={editedData.title} onChange={(e) => setEditedData({ ...editedData, title: e.target.value })} className="text-[2rem] font-bold p-[10px] border-2 border-[#eee] rounded-[10px] font-['Montserrat'] w-full" placeholder="Titolo" />
                        <input value={editedData.subtitle} onChange={(e) => setEditedData({ ...editedData, subtitle: e.target.value })} className="text-[1.2rem] p-[10px] border-2 border-[#eee] rounded-[10px] w-full" placeholder="Sottotitolo" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl text-gray-900 mb-2 font-title font-extrabold leading-tight text-left break-words w-full">{data.title}</h2>
                        <h3 className="text-[1.3rem] text-[#66CBFF] m-0 font-[600] tracking-[0.5px] text-left break-words w-full">{data.subtitle}</h3>
                    </>
                )}
            </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
            {isEditing ? (
                <div className="flex flex-col gap-[20px] mb-[20px] w-full">
                    <textarea value={editedData.text} onChange={(e) => setEditedData({ ...editedData, text: e.target.value })} className="min-h-[200px] p-[15px] text-[1.1rem] border-2 border-[#eee] rounded-[10px] font-['Open Sans'] leading-[1.6]" placeholder="Testo della notizia" />
                    <div className="flex flex-col gap-[10px]">
                        <label className="font-[600] text-[#333]">YouTube Video ID o Link:</label>
                        <input value={editedData.videoUrl || ''} onChange={handleVideoChange} placeholder="Incolla Link YouTube o ID (es. dQw4w9WgXcQ)" className="p-[10px] border-2 border-[#eee] rounded-[10px] text-[1rem]" />
                        <p className="text-xs text-gray-400">Preview: https://www.youtube.com/watch?v={getYouTubeId(editedData.videoUrl)}</p>
                    </div>
                    
                    {/* Add Image Button */}
                    <div className="flex flex-col gap-[10px]">
                        <label className="font-[600] text-[#333]">Aggiungi Immagini:</label>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="p-[10px] border-2 border-[#eee] rounded-[10px] text-[1rem] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#66CBFF] file:text-white hover:file:bg-[#4facfe]"
                        />
                    </div>

                    <button onClick={handleSave} disabled={isUploading} className={`bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white border-none px-[30px] py-[15px] rounded-[50px] cursor-pointer font-[800] self-start uppercase tracking-[1px] shadow-[0_10px_20px_rgba(102,203,255,0.3)] transition-all hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(102,203,255,0.4)] ${isUploading ? 'opacity-70 cursor-wait' : ''}`}>
                        {isUploading ? 'Salvataggio...' : 'Salva Modifiche Card'}
                    </button>
                </div>
            ) : (
                <p className="text-[1.15rem] leading-[1.9] text-[#555] mb-[40px] font-['Open Sans'] text-left break-words whitespace-pre-wrap w-full">{data.text}</p>
            )}

            <div className="flex flex-col gap-[40px] w-full">
                {/* Video Player */}
                {(editedData.videoUrl && getYouTubeId(editedData.videoUrl)) && (
                    <div className="relative pb-[56.25%] h-0 rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] w-full">
                        <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(editedData.videoUrl)}?playsinline=1&rel=0`} title="YouTube video player" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
                    </div>
                )}

                {/* Images Section */}
                {displayImages && displayImages.length > 0 && (
                    <>
                        {showCarousel ? (
                            // CAROUSEL VIEW
                            <div id="indicators-carousel" className="relative w-full" data-carousel="static" 
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onTouchStart={() => setIsPaused(true)}
                                onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
                            >
                                {/* Carousel wrapper */}
                                <div className="relative h-56 overflow-hidden rounded-base md:h-96 rounded-[20px]">
                                    {displayImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className={`duration-700 ease-in-out absolute w-full h-full top-0 left-0 transition-opacity ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                            data-carousel-item={index === currentSlide ? "active" : ""}
                                        >
                                            <img 
                                                src={img.src} 
                                                className="absolute block w-full h-full object-contain -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
                                                alt={img.alt || `Slide ${index + 1}`} 
                                                onClick={() => openLightbox(img.src)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Slider indicators */}
                                <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
                                    {displayImages.map((_, index) => (
                                        <button 
                                            key={index}
                                            type="button" 
                                            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`} 
                                            aria-current={index === currentSlide} 
                                            aria-label={`Slide ${index + 1}`} 
                                            onClick={() => setCurrentSlide(index)}
                                        ></button>
                                    ))}
                                </div>
                                
                                {/* Slider controls */}
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
                            </div>
                        ) : (
                            // STANDARD GRID/SCROLL VIEW (For Edit Mode or Desktop <= 5 images)
                            <div
                                className={`flex overflow-x-auto gap-[20px] p-[20px_5px] scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-color-[#66CBFF_#f0f0f0] max-[768px]:flex-row max-[768px]:gap-0 max-[768px]:p-[20px_0] max-[768px]:w-full max-[768px]:scrollbar-none ${isEditing ? 'editing-carousel border-2 border-dashed border-gray-300 rounded-xl min-h-[220px] bg-gray-50' : ''}`}
                                onDragOver={isEditing ? handleContainerDragOver : null}
                                onDrop={isEditing ? handleFileDrop : null}
                            >
                                {displayImages.map((img, index) => (
                                    <div
                                        key={`${index}-${img.src}`}
                                        className={`relative ${isEditing ? 'cursor-move' : ''}`}
                                        draggable={isEditing}
                                        onDragStart={isEditing ? (e) => handleDragStart(e, index) : null}
                                        onDragOver={isEditing ? (e) => handleDragOver(e, index) : null}
                                        onDrop={isEditing ? (e) => handleInternalDrop(e, index) : null}
                                    >
                                        <div className={`flex-[0_0_250px] h-[180px] rounded-[15px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] relative snap-start hover:scale-105 hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] max-[768px]:flex-[0_0_85vw] max-[768px]:min-w-[85vw] max-[768px]:w-[85vw] max-[768px]:h-[220px] max-[768px]:hover:transform-none ${isEditing && draggedItemIndex === index ? 'opacity-50' : ''}`} onClick={() => !isEditing && openLightbox(img.src)}>
                                            <img src={img.src} alt={img.alt || `Gallery image ${index + 1}`} className="w-full h-full object-contain bg-gray-50 transition-transform duration-500 ease hover:scale-110 max-[768px]:hover:transform-none" draggable="false" />
                                        </div>
                                        {isEditing && (
                                            <button className="absolute top-[5px] right-[5px] bg-red-600/80 text-white border-none rounded-full w-[25px] h-[25px] cursor-pointer text-[14px] flex items-center justify-center z-[5]" onClick={() => handleImageDelete(index)}>❌</button>
                                        )}
                                    </div>
                                ))}

                                {isEditing && (
                                    <div className="flex-[0_0_200px] border-[3px] border-dashed border-[#66CBFF] flex items-center justify-center min-w-[200px] h-[180px] text-[#66CBFF] rounded-[15px] p-[20px] text-center text-[1rem] font-[600] bg-[#66CBFF]/5 pointer-events-none">
                                        TRASCINA QUI FILE O SPOSTA IMMAGINI
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </article>

      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/95 z-[2000] flex justify-center items-center animate-fadeIn backdrop-blur-[5px]" onClick={closeLightbox}>
          <div className="relative max-w-[90%] max-h-[90%] flex justify-center items-center" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-[50px] -right-[50px] bg-white border-none text-[#333] text-[24px] cursor-pointer w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold transition-all hover:bg-[#ff4757] hover:text-white hover:rotate-90" onClick={closeLightbox}>&times;</button>
            <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] rounded-[10px] shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain" />
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCard;
