import React from "react";
import { X } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, description, onClose }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-blue-200/70 via-blue-400/40 to-blue-900/80 backdrop-blur-2xl animate-fade-in-fast">
      {/* Animated blue particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute right-1/4 bottom-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float-slower" />
        <div className="absolute left-1/2 top-1/2 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl animate-float" />
      </div>
      <div className="relative z-50 max-w-3xl w-full mx-auto p-0 flex flex-col items-center mt-16">
        <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-blue-300/60 animate-glow-card w-full px-10 pt-12 pb-8 flex flex-col items-center" style={{boxShadow: '0 16px 64px 0 rgba(59, 130, 246, 0.18)'}}>
          {onClose && (
            <button
              className="absolute top-5 right-5 bg-gradient-to-br from-blue-400 to-blue-700 text-white rounded-full p-3 hover:scale-110 hover:shadow-xl shadow-lg border-2 border-blue-200 z-10 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
              onClick={onClose}
              aria-label="Close"
              style={{fontSize: 28, lineHeight: 1}}
            >
              <X className="w-8 h-8" />
            </button>
          )}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-blue-800 drop-shadow-lg line-clamp-1" title={title} style={{letterSpacing: '-0.01em'}}>{title}</h2>
          {description && (
            <p
              className="mb-6 max-w-2xl w-full text-blue-700/90 text-center text-lg font-medium line-clamp-2"
              title={description}
            >
              {description}
            </p>
          )}
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100/80 via-white/70 to-blue-200/80 border-4 border-blue-200 shadow-xl mb-2 animate-glow-card backdrop-blur-xl flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain rounded-2xl bg-transparent"
              preload="metadata"
              autoFocus
              style={{background: 'transparent'}}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <style>{`
        .animate-glow-card {
          box-shadow: 0 0 32px 0 #60a5fa33, 0 0 0 4px #3b82f6cc;
          animation: glow-blue-card 2.5s ease-in-out infinite alternate;
        }
        @keyframes glow-blue-card {
          0% { box-shadow: 0 0 32px 0 #60a5fa33, 0 0 0 4px #3b82f6cc; }
          100% { box-shadow: 0 0 64px 12px #3b82f6cc, 0 0 0 8px #60a5fa33; }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite alternate;
        }
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite alternate;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
        @keyframes float-slow {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes float-slower {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.12); }
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer; 