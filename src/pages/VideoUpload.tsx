import React, { useState, useRef } from "react";
import { useVideos } from "@/context/VideoContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { UploadCloud } from "lucide-react";

const VideoUpload: React.FC = () => {
  const { uploadVideo, isLoading } = useVideos();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleCardClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !description.trim() || !user) return;
    setSubmitting(true);
    await uploadVideo({
      title,
      description,
      teacher_id: user.id,
      teacher_name: user.name,
      file,
    });
    setSubmitting(false);
    setTitle("");
    setDescription("");
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-24 pb-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl border-2 border-blue-200 bg-white animate-fade-in-fast overflow-hidden relative">
          <div className="bg-gradient-to-r from-blue-100 via-white to-blue-200 py-4 px-6 text-center border-b-2 border-blue-100">
            <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow mb-1 tracking-tight">Upload a Video</h1>
            <p className="text-blue-700 text-lg font-medium mb-1">Share your knowledge with the world!</p>
            <p className="text-blue-500 text-base">Upload a video lesson for your students in seconds.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            <div className="flex flex-col gap-1">
              <label className="block font-bold text-blue-900 text-lg mb-1">Title</label>
              <input
                type="text"
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200/40 bg-white text-blue-900 text-lg font-semibold shadow-sm"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={submitting}
                placeholder="Enter a catchy title..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block font-bold text-blue-900 text-lg mb-1">Description</label>
              <textarea
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-200/40 bg-white text-blue-900 text-lg font-semibold shadow-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={1}
                disabled={submitting}
                placeholder="Describe your video..."
              />
            </div>
            <div
              className={`relative flex flex-col items-center justify-center border-4 border-dashed rounded-2xl p-3 transition-all duration-200 cursor-pointer ${dragActive ? 'border-blue-400 bg-blue-50 shadow-xl animate-pulse' : 'border-blue-200 bg-white'} hover:border-blue-400`}
              onClick={handleCardClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{ minHeight: 80 }}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gradient-to-br from-blue-200 via-blue-400 to-blue-500 rounded-full p-2 shadow-lg border-4 border-blue-100 animate-float">
                  <UploadCloud className="w-8 h-8 text-white drop-shadow-xl" />
                </div>
                <span className="font-bold text-blue-700 text-base mt-1">Drag & drop your video here, or click to select</span>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={inputRef}
                required={!file}
                disabled={submitting}
                className="hidden"
              />
              {file && <span className="mt-1 text-blue-700 font-bold text-base">{file.name}</span>}
            </div>
            {previewUrl && (
              <div className="my-2">
                <video src={previewUrl} controls className="w-full h-40 rounded-2xl shadow-2xl border-4 border-blue-200 object-contain bg-blue-50" />
              </div>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 text-white rounded-2xl font-extrabold text-xl shadow-xl transition-all duration-200 disabled:opacity-60 focus:ring-4 focus:ring-blue-200/50 focus:outline-none hover:scale-105 hover:shadow-blue-400/40 border-0"
              style={{ boxShadow: '0 6px 32px 0 rgba(59, 130, 246, 0.18), 0 1.5px 8px 0 rgba(59, 130, 246, 0.10)' }}
              disabled={submitting || isLoading}
            >
              <UploadCloud className="w-6 h-6 text-white drop-shadow" />
              {submitting ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoUpload;

// Tailwind custom animation for floating icon
// .animate-float { animation: float 2.5s ease-in-out infinite; }
// @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } 