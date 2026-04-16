import { X } from 'lucide-react';
import { useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}

const Lightbox = ({ isOpen, imageSrc, onClose }: LightboxProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="lightbox active"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-[#1C1C1E] border border-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.1)] hover:border-[#C79A6B] transition-all z-10"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div 
        className="relative max-w-5xl max-h-[85vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1C1C1E] rounded-xl overflow-hidden border border-[rgba(199,154,107,0.2)]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Gallery image"
              className="max-w-full max-h-[85vh] object-contain"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <p className="text-[#6B6560]">Image not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
