import React, { useState } from "react";
import { useVideos } from "@/context/VideoContext";
import VideoPlayer from "@/components/VideoPlayer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function VideoGallery() {
  const { videos, isLoading, deleteVideo } = useVideos();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const auth = useAuth();
  const CARDS_PER_PAGE = 6;

  const filteredVideos = search
    ? videos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase()) ||
        v.teacherName.toLowerCase().includes(search.toLowerCase())
      )
    : videos;

  const totalPages = Math.ceil(filteredVideos.length / CARDS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  return (
    <div className="min-h-screen flex flex-col font-['Poppins','Inter','Montserrat',sans-serif] bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-x-hidden">
      {/* Animated blue particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-blue-400/10 to-blue-100/20 animate-pulse" />
        <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute right-1/4 bottom-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float-slower" />
      </div>
      <Header />
      <main className="flex-1 py-16 px-4 z-10 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 animate-gradient-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-xl text-center md:text-left m-0 p-0">Video Gallery</h1>
            {/* Impressive Search Bar */}
            <div className="w-full md:w-auto max-w-xl animate-scale-in">
              <div className="relative glass-card p-4 flex items-center gap-3 shadow-2xl border-2 border-blue-200/60 bg-white/60 backdrop-blur-2xl rounded-2xl hover:ring-2 hover:ring-blue-200/60 transition-all duration-300">
                <Input
                  type="search"
                  placeholder="Search Videos"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="w-full bg-transparent text-blue-900 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400 rounded-xl border-0 shadow-none pl-12 font-medium"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                  <Search className="w-6 h-6" />
                </span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center text-lg text-blue-700">Loading videos...</div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-24 animate-fade-in-fast flex flex-col items-center justify-center gap-6">
              {/* Beautiful empty state illustration */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                <circle cx="60" cy="60" r="56" fill="#e0e7ff" />
                <rect x="30" y="50" width="60" height="30" rx="8" fill="#2563eb" fillOpacity="0.15" />
                <rect x="40" y="60" width="40" height="10" rx="5" fill="#2563eb" fillOpacity="0.25" />
                <rect x="50" y="70" width="20" height="6" rx="3" fill="#2563eb" fillOpacity="0.35" />
                <circle cx="60" cy="44" r="8" fill="#2563eb" fillOpacity="0.18" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-900 animate-gradient-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight">No videos found</h2>
              <p className="text-blue-500 text-lg font-medium">
                {search ?
                  `No videos match your search for "${search}"` :
                  "No videos available yet. Check back later!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-12 animate-fade-in-fast transition-all duration-500">
                {paginatedVideos.map((video) => (
                  <div key={video.id} className="transition-transform duration-500 ease-in-out">
                    <div className="glass-card p-6 shadow-2xl border-2 border-blue-200/60 bg-white/70 backdrop-blur-2xl rounded-3xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 animate-fade-in-up flex flex-col relative">
                      {/* Delete Icon Button (only for teacher/owner) */}
                      {auth.user && Number(auth.user.id) === video.teacherId && (
                        <button
                          className="absolute bottom-4 right-4 bg-gradient-to-br from-blue-100/80 to-blue-400/80 text-blue-700 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 rounded-full p-2 shadow-lg border border-blue-200/60 z-20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/30"
                          title="Delete Video"
                          aria-label="Delete Video"
                          disabled={deletingId === video.id}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setDeletingId(video.id);
                            await deleteVideo(video.id);
                            setDeletingId(null);
                          }}
                        >
                          {deletingId === video.id ? (
                            <svg className="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          ) : (
                            <Trash2 className="w-6 h-6" />
                          )}
                        </button>
                      )}
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-blue-50 mb-3">
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                          preload="metadata"
                          muted
                          playsInline
                          onClick={() => setSelectedVideoId(video.id)}
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-blue-900/40 hover:bg-blue-900/60 transition-colors duration-200 rounded-xl"
                          onClick={() => setSelectedVideoId(video.id)}
                        >
                          <span className="text-white text-2xl font-bold bg-blue-600/80 px-6 py-2 rounded-full shadow-lg border-2 border-blue-200">Play</span>
                        </button>
                      </div>
                      <h2 className="text-xl font-bold text-blue-900 mb-1 line-clamp-1">{video.title}</h2>
                      <p className="text-zinc-600 mb-2 line-clamp-2">{video.description}</p>
                      <div className="flex items-center text-xs text-blue-700 mb-2 gap-2">
                        <span className="font-semibold">By {video.teacherName}</span>
                        <span className="mx-1">•</span>
                        <span>{video.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-14 animate-fade-in-fast">
                  <div className="glass-card bg-gradient-to-br from-blue-100/80 to-white/80 border-2 border-blue-200/60 shadow-xl rounded-full px-4 py-2 flex gap-2 items-center">
                    {/* Previous Button */}
                    <button
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-150 font-bold text-blue-700 bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${page === 0 ? 'opacity-60' : ''}`}
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                      aria-label="Previous Page"
                    >
                      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    {/* Page Numbers (show all if <=5 pages) */}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-blue-700 transition-all duration-150 mx-1
                          ${page === i
                            ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-pink-400 text-white shadow-xl scale-110 border-0'
                            : 'bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95'}
                        `}
                        style={{ minWidth: 48 }}
                        aria-current={page === i ? 'page' : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {/* Next Button */}
                    <button
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-150 font-bold text-blue-700 bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${page === totalPages - 1 ? 'opacity-60' : ''}`}
                      disabled={page === totalPages - 1}
                      onClick={() => setPage(page + 1)}
                      aria-label="Next Page"
                    >
                      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* Modal or inline player */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/80 backdrop-blur-xl">
            <div className="relative w-full max-w-2xl mx-auto">
              <button
                className="absolute top-2 right-2 bg-white/80 text-blue-900 rounded-full p-2 hover:bg-blue-200 z-10 shadow-lg border border-blue-200"
                onClick={() => setSelectedVideoId(null)}
                aria-label="Close"
              >
                <span className="text-2xl">&times;</span>
              </button>
              <VideoPlayer
                videoUrl={selectedVideo.videoUrl}
                title={selectedVideo.title}
                description={selectedVideo.description}
                onClose={() => setSelectedVideoId(null)}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 