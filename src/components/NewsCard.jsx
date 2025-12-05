import React, { useState, useEffect, useRef } from 'react';
import { uploadMultipleImages } from '../lib/cloudinary/upload';

const NewsCard = ({ data, isAdmin, onDelete, onEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const [isUploading, setIsUploading] = useState(false);
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Auto-Scroll Logic for mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || isEditing || isPaused) return;

    // Auto-scroll on mobile if 2+ images
    const shouldScroll = isMobile && editedData.images.length >= 2;
    if (!shouldScroll) return;

    let currentIndex = 0;

    const scrollInterval = setInterval(() => {
      // Move to next image
      currentIndex = (currentIndex + 1) % editedData.images.length;

      // Calculate scroll position for this image
      const scrollPosition = currentIndex * carousel.offsetWidth;

      // Smooth scroll to that position
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(scrollInterval);
  }, [isEditing, isPaused, isMobile, editedData.images.length]);

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
      // Identify new files (they have a 'file' property)
      const newImagesToUpload = editedData.images.filter(img => img.file);

      // Upload new images to Cloudinary
      let updatedImages = [...editedData.images];

      if (newImagesToUpload.length > 0) {
        const filesToUpload = newImagesToUpload.map(img => img.file);
        const { urls, error } = await uploadMultipleImages(filesToUpload);

        if (error) {
          alert('Errore caricamento immagini: ' + error);
          setIsUploading(false);
          return;
        }

        // Replace local blob URLs with Cloudinary URLs
        let uploadIndex = 0;
        updatedImages = updatedImages.map(img => {
          if (img.file) {
            const newUrl = urls[uploadIndex];
            uploadIndex++;
            return { src: newUrl, alt: img.alt || '' }; // Strip 'file' prop
          }
          return img;
        });
      }

      const finalData = { ...editedData, images: updatedImages };
      // Call the parent onEdit with the final data (including new Image URLs)
      await onEdit(data.id, finalData);
      setEditedData(finalData); // Update local state to match saved data for UI consistency
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
  };

  // Helper to extract YouTube ID
  const getYouTubeId = (url) => {
    if (!url) return '';
    // Handle standard URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleVideoChange = (e) => {
    const val = e.target.value;
    // If it looks like a full URL, try to extract ID. 
    // If it's just an ID (or partial), keep it as is.
    // Ideally we assume the user pastes a URL or types an ID.
    const id = getYouTubeId(val);

    // We check if the extraction was "clean" (i.e. we found a specific ID from a URL)
    // If getYouTubeId returns the input string itself, it means it didn't find a match, 
    // so we treat the input as the potential ID (or just the text user is typing).
    setEditedData({ ...editedData, videoId: id });
  };

  // --- Drag & Drop for UPLOAD (External) ---
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if dropping files
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

      const newImages = files.map(file => ({
        src: URL.createObjectURL(file), // Preview URL
        alt: file.name,
        file: file // Store actual file for upload later
      }));

      setEditedData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  // --- Drag & Drop for REORDER (Internal) ---
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    // Allow drop
    e.dataTransfer.dropEffect = 'move';

    // If dragging over another item, handle the reorder visual feedback here potentially
    // but actual swap happens on Drop for stability, or could be here for live-swap.
    // Let's implement live-swap if we throttle it, but simple Drop swap is safer first.
    // Actually, simple drop swap is easier to implement robustly without libs.
  };

  const handleInternalDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to the container's file drop handler

    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const newImages = [...editedData.images];
    const draggedItem = newImages[draggedItemIndex];

    // Remove dragged item
    newImages.splice(draggedItemIndex, 1);
    // Insert at new position
    newImages.splice(targetIndex, 0, draggedItem);

    setEditedData({ ...editedData, images: newImages });
    setDraggedItemIndex(null);
  };

  const handleContainerDragOver = (e) => {
    e.preventDefault(); // Enable drop zone
  }


  // Duplicate images ONLY for desktop with > 5 images (not mobile!)
  const displayImages = (!isMobile && editedData.images.length > 5) && !isEditing
    ? [...editedData.images, ...editedData.images]
    : editedData.images;

  return (
    <>
      <article className="bg-white rounded-3xl shadow-card mb-12 overflow-hidden flex flex-col relative transition-all duration-300 border border-gray-100 p-10 card-hover max-[768px]:p-6">
        {isAdmin && (
          <div className="absolute top-[30px] right-[30px] z-20 flex gap-[15px]">
            <button className="bg-white border-none w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all text-[1.2rem] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]" onClick={() => setIsEditing(!isEditing)}>✏️</button>
            <button className="bg-white border-none w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all text-[1.2rem] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#ff4757] hover:text-white" onClick={() => onDelete(data.id)}>🗑️</button>
          </div>
        )}

        <div className="flex items-center mb-[30px] gap-[30px] max-[768px]:items-start max-[768px]:gap-[10px]">
          {isEditing ? (
            <div className="bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white p-[5px] rounded-[15px] flex flex-col items-center justify-center font-[800] font-['Montserrat'] shadow-[0_10px_20px_rgba(102,203,255,0.4)] min-w-[90px] shrink-0 gap-[5px] max-[768px]:min-w-[70px]">
              <input
                className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[1.5rem] h-[40px] focus:outline-none focus:bg-white/30 focus:border-white"
                value={editedData.date.day}
                onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, day: e.target.value } })}
                maxLength={2}
              />
              <input
                className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[1rem] uppercase focus:outline-none focus:bg-white/30 focus:border-white"
                value={editedData.date.month}
                onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, month: e.target.value } })}
                maxLength={3}
              />
              <input
                className="bg-white/20 border border-white/50 text-white text-center rounded-[5px] font-['Montserrat'] font-bold w-full text-[0.8rem] focus:outline-none focus:bg-white/30 focus:border-white"
                value={editedData.date.year}
                onChange={(e) => setEditedData({ ...editedData, date: { ...editedData.date, year: e.target.value } })}
                maxLength={4}
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white p-[15px_10px] rounded-[15px] flex flex-col items-center justify-center font-[800] font-['Montserrat'] shadow-[0_10px_20px_rgba(102,203,255,0.4)] min-w-[90px] shrink-0 max-[768px]:min-w-[70px] max-[768px]:p-[10px_5px]">
              <span className="text-[2rem] leading-none max-[768px]:text-[1.5rem]">{data.date.day}</span>
              <span className="text-[1.1rem] uppercase tracking-[1px] max-[768px]:text-[0.9rem]">{data.date.month}</span>
              <span className="text-[0.9rem] opacity-90 max-[768px]:text-[0.7rem]">{data.date.year}</span>
            </div>
          )}

          <div className="w-[3px] h-[80px] bg-[#eee] rounded-[2px] max-[768px]:h-[60px] shrink-0 block"></div>

          <div className="flex flex-col justify-center max-[768px]:flex-1 max-[768px]:min-w-0" style={{ width: isEditing ? '100%' : 'auto' }}>
            {isEditing ? (
              <div className="flex flex-col gap-[10px] w-full">
                <input
                  value={editedData.title}
                  onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                  className="text-[2rem] font-bold p-[10px] border-2 border-[#eee] rounded-[10px] font-['Montserrat'] w-full"
                  placeholder="Titolo"
                />
                <input
                  value={editedData.subtitle}
                  onChange={(e) => setEditedData({ ...editedData, subtitle: e.target.value })}
                  className="text-[1.2rem] p-[10px] border-2 border-[#eee] rounded-[10px] w-full"
                  placeholder="Sottotitolo"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl text-gray-900 mb-2 font-title font-extrabold leading-tight text-left break-words w-full">{data.title}</h2>
                <h3 className="text-[1.3rem] text-[#66CBFF] m-0 font-[600] tracking-[0.5px] text-left break-words w-full">{data.subtitle}</h3>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {isEditing ? (
            <div className="flex flex-col gap-[20px] mb-[20px] w-full">
              <textarea
                value={editedData.text}
                onChange={(e) => setEditedData({ ...editedData, text: e.target.value })}
                className="min-h-[200px] p-[15px] text-[1.1rem] border-2 border-[#eee] rounded-[10px] font-['Open Sans'] leading-[1.6]"
                placeholder="Testo della notizia"
              />
              <div className="flex flex-col gap-[10px]">
                <label className="font-[600] text-[#333]">YouTube Video ID o Link:</label>
                <input
                  value={editedData.videoId}
                  onChange={handleVideoChange}
                  placeholder="Incolla Link YouTube o ID (es. dQw4w9WgXcQ)"
                  className="p-[10px] border-2 border-[#eee] rounded-[10px] text-[1rem]"
                />
                <p className="text-xs text-gray-400">Preview: https://www.youtube.com/watch?v={editedData.videoId}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className={`bg-gradient-to-br from-[#66CBFF] to-[#4facfe] text-white border-none px-[30px] py-[15px] rounded-[50px] cursor-pointer font-[800] self-start uppercase tracking-[1px] shadow-[0_10px_20px_rgba(102,203,255,0.3)] transition-all hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(102,203,255,0.4)] ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isUploading ? 'Salvataggio...' : 'Salva Modifiche Card'}
              </button>
            </div>
          ) : (
            <p className="text-[1.15rem] leading-[1.9] text-[#555] mb-[40px] font-['Open Sans'] text-left break-words whitespace-pre-wrap w-full">{data.text}</p>
          )}

          <div className="flex flex-col gap-[40px] w-full">
            <div className="relative pb-[56.25%] h-0 rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] w-full">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${editedData.videoId}`}
                title="YouTube video player"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

            <div
              className={`flex overflow-x-auto gap-[20px] p-[20px_5px] scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-color-[#66CBFF_#f0f0f0] max-[768px]:flex-row max-[768px]:gap-0 max-[768px]:p-[20px_0] max-[768px]:w-full max-[768px]:scrollbar-none ${isEditing ? 'editing-carousel border-2 border-dashed border-gray-300 rounded-xl min-h-[220px] bg-gray-50' : ''}`}
              ref={carouselRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)} // Resume after 2s

              // Only attach File drop check on container if Editing
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
                  <div className={`flex-[0_0_250px] h-[180px] rounded-[15px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] relative snap-start hover:scale-105 hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] max-[768px]:flex-[0_0_calc(100vw-40px)] max-[768px]:min-w-[calc(100vw-40px)] max-[768px]:w-[calc(100vw-40px)] max-[768px]:h-[280px] max-[768px]:hover:transform-none ${isEditing && draggedItemIndex === index ? 'opacity-50' : ''}`} onClick={() => !isEditing && openLightbox(img.src)}>
                    <img src={img.src} alt={img.alt || `Gallery image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 ease hover:scale-110 max-[768px]:hover:transform-none" draggable="false" />
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
