import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { cn } from '@/lib/utils';
import confetti from "canvas-confetti";
import { X } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  courseId: string;
  onComplete?: () => void;
  onClose?: () => void;
  onQuizClick: () => void;
}

export default function PDFViewer({ pdfUrl, courseId, onComplete, onClose, onQuizClick }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [completed, setCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    setError(`Error loading PDF: ${error.message}`);
    setLoading(false);
  }

  function changePage(offset: number) {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
    }
  }
  
  function zoomIn() {
    setScale(prev => Math.min(prev + 0.1, 2));
  }
  
  function zoomOut() {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }
  
  useEffect(() => {
    if (numPages && pageNumber === numPages && !completed) {
      setCompleted(true);
      if (onComplete) onComplete();
      // Confetti burst when finished
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#34d399", "#3b82f6", "#f472b6", "#facc15"]
      });
    }
    if (pageNumber !== numPages && completed) {
      setCompleted(false);
    }
  }, [pageNumber, numPages, completed, onComplete]);

  // Smooth close with fade-out
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && onClose) {
      setIsVisible(false);
      setTimeout(() => onClose(), 350);
    }
  }

  // Close button handler
  function handleCloseBtn() {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 350);
  }

  // Fullscreen API logic
  const handleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const el = modalRef.current;
      if (el && el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el && (el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Listen for fullscreen change
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        if (pageNumber < (numPages || 1)) changePage(1);
      } else if (e.key === 'ArrowLeft') {
        if (pageNumber > 1) changePage(-1);
      } else if (e.key === '+') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === 'Escape') {
        if (isFullscreen) handleFullscreen();
        else if (onClose) handleCloseBtn();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pageNumber, numPages, isFullscreen, handleFullscreen, onClose]);

  const glassToolbar =
    'bg-white/70 backdrop-blur-lg rounded-b-3xl shadow-lg flex gap-4 items-center px-8 py-3 m-2 animate-fade-in-up';
  const iconBtn =
    'hover:bg-blue-100/60 active:bg-blue-200 focus:ring-2 focus:ring-blue-400 transition-all duration-150 rounded-full p-2 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div 
      className={cn(
        `fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/80 via-fuchsia-100/70 to-teal-100/80 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} animate-fade-in-fast`,
        isFullscreen ? "" : ""
      )}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {/* Top right controls: Fullscreen and Close */}
      <div className="absolute top-6 right-8 z-50 flex flex-row gap-3">
        <button
          onClick={handleFullscreen}
          className="bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-lg rounded-full p-3 hover:scale-110 active:scale-95 transition-all duration-150 border-2 border-white/70 backdrop-blur-md"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 9L5 5M5 9V5h4M15 15l4 4m0-4v4h-4" /></svg>
          ) : (
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5H5v4M5 5l4 4M15 19h4v-4m0 4l-4-4" /></svg>
          )}
        </button>
        <button
          onClick={handleCloseBtn}
          className="bg-white/90 hover:bg-fuchsia-100 text-fuchsia-500 rounded-full shadow-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 border-2 border-white/60 hover:scale-110 active:scale-95"
          title="Close Presentation"
          aria-label="Close Presentation"
        >
          <X className="w-7 h-7" />
        </button>
      </div>
      {/* Progress Bar & Slide Counter (top, floating, pill style) */}
      <div className="w-full flex flex-col items-center justify-center pt-10 pb-6 mb-8 animate-fade-in-fast absolute top-0 left-0 z-20 pointer-events-none">
        <div className="w-full max-w-lg mx-auto flex items-center gap-4 pointer-events-auto">
          <div className="flex-1 h-4 bg-white/60 rounded-full overflow-hidden shadow-inner border border-blue-200">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-400 via-blue-400 to-emerald-300 transition-all duration-500 rounded-full"
              style={{ width: numPages ? `${(pageNumber / numPages) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-base font-bold text-blue-700 bg-white/90 px-4 py-1 rounded-full shadow border border-blue-100 ml-2">
            Slide {pageNumber} / {numPages || '-'}
          </span>
        </div>
        {completed && (
          <div className="mt-2 text-green-600 font-bold flex items-center gap-2 animate-bounce-in">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            Presentation Complete!
          </div>
        )}
      </div>
      {/* PDF Slide (centered, pill/oval, glassy, animated border) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full px-0 py-0 z-10">
        <div
          ref={modalRef}
          className={
            isFullscreen
              ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-500'
              : 'relative w-full max-w-5xl max-h-[80vh] bg-gradient-to-br from-white/90 via-white/80 to-blue-50/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center animate-fade-in-fast transition-all duration-500 border-0'
          }
          onClick={e => e.stopPropagation()}
          style={isFullscreen ? { padding: 0, borderRadius: 0, maxWidth: '100vw', maxHeight: '100vh' } : { boxShadow: '0 8px 48px 0 rgba(80,0,200,0.10)' }}
        >
          <div className="relative mx-auto my-10 max-w-4xl w-full flex items-center justify-center p-0" style={isFullscreen ? { maxHeight: '90vh' } : { maxHeight: '70vh' }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center items-center w-full h-full"
            >
              <Page 
                pageNumber={pageNumber} 
                width={isFullscreen ? window.innerWidth * 0.95 : Math.min(window.innerWidth * 0.8, 900) * scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mx-auto rounded-xl shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>
      {/* Bottom Glassy Toolbar (pill, organized, centered) */}
      <div className="fixed left-0 w-full flex justify-center z-30 pointer-events-none mt-8" style={{ bottom: '32px' }}>
        <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-full shadow-xl border border-fuchsia-200/30 px-6 py-2 flex gap-3 items-center animate-fade-in-up transition-all duration-500">
          <button onClick={zoomOut} className="hover:bg-fuchsia-100/60 active:bg-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 transition-all duration-150 rounded-full p-1.5 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Zoom Out">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12H9" /></svg>
          </button>
          <button onClick={() => changePage(-1)} disabled={pageNumber <= 1 || loading} className="hover:bg-fuchsia-100/60 active:bg-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 transition-all duration-150 rounded-full p-1.5 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Previous">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="font-bold text-blue-700 text-sm select-none px-2">
            {pageNumber} / {numPages || '-'}
          </span>
          <button onClick={() => changePage(1)} disabled={pageNumber >= (numPages || 1) || loading} className="hover:bg-fuchsia-100/60 active:bg-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 transition-all duration-150 rounded-full p-1.5 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Next">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <button onClick={zoomIn} className="hover:bg-fuchsia-100/60 active:bg-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 transition-all duration-150 rounded-full p-1.5 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Zoom In">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v6m3-3H9" /></svg>
          </button>
          {/* Quiz Icon Button */}
          <button
            onClick={onQuizClick}
            className={`ml-3 rounded-full p-1.5 text-white font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg ${completed ? 'bg-gradient-to-r from-green-400 to-lime-400 animate-pulse-glow hover:scale-110' : 'bg-gray-300/60 cursor-not-allowed opacity-60'}`}
            title={numPages && pageNumber === numPages ? 'Take the Quiz' : 'Finish the presentation to unlock the quiz'}
            disabled={!numPages || pageNumber !== numPages}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2M21 5h-4v2a5 5 0 0 1-10 0V5H3v2a7 7 0 0 0 14 0V5h4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
