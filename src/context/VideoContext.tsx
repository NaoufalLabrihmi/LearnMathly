import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Video } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface VideoContextType {
  videos: Video[];
  isLoading: boolean;
  loadVideos: () => Promise<void>;
  uploadVideo: (data: {
    title: string;
    description: string;
    teacher_id: number;
    teacher_name: string;
    file: File;
  }) => Promise<Video | undefined>;
  deleteVideo: (videoId: string) => Promise<boolean>;
}

const initialState = {
  videos: [],
  isLoading: true,
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const API_URL = "http://localhost:8000";

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { videos, isLoading } = state;
  const auth = useAuth();
  const logoutRef = useRef(auth.logout);
  useEffect(() => { logoutRef.current = auth.logout; }, [auth.logout]);

  const getToken = () => localStorage.getItem("token");

  const loadVideos = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_URL}/videos/`);
      const data = await res.json();
      const transformed: Video[] = data.map((v: any) => ({
        id: v.id.toString(),
        title: v.title,
        description: v.description,
        teacherId: Number(v.teacher_id),
        teacherName: v.teacher_name,
        videoUrl: v.video_url.startsWith("/video-files/")
          ? `${API_URL}${v.video_url}`
          : v.video_url.startsWith("/videos/")
            ? `${API_URL}${v.video_url.replace("/videos/", "/video-files/")}`
            : v.video_url,
        createdAt: new Date(v.created_at),
      }));
      setState({ videos: transformed, isLoading: false });
    } catch (error) {
      toast.error("Failed to load videos");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const uploadVideo = async (data: {
    title: string;
    description: string;
    teacher_id: number;
    teacher_name: string;
    file: File;
  }): Promise<Video | undefined> => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("teacher_id", data.teacher_id.toString());
      formData.append("teacher_name", data.teacher_name);
      formData.append("file", data.file);
      const res = await fetch(`${API_URL}/videos/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) throw new Error("Failed to upload video");
      const v = await res.json();
      const newVideo: Video = {
        id: v.id.toString(),
        title: v.title,
        description: v.description,
        teacherId: Number(v.teacher_id),
        teacherName: v.teacher_name,
        videoUrl: v.video_url.startsWith("/videos/") ? `${API_URL}${v.video_url}` : v.video_url,
        createdAt: new Date(v.created_at),
      };
      setState((prev) => ({ ...prev, videos: [newVideo, ...prev.videos] }));
      toast.success("Video uploaded");
      return newVideo;
    } catch (error) {
      toast.error("Failed to upload video");
      return undefined;
    }
  };

  const deleteVideo = async (videoId: string): Promise<boolean> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return false;
      }
      if (!res.ok) throw new Error("Failed to delete video");
      setState((prev) => ({ ...prev, videos: prev.videos.filter((v) => v.id !== videoId) }));
      toast.success("Video deleted");
      return true;
    } catch (error) {
      toast.error("Failed to delete video");
      return false;
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        isLoading,
        loadVideos,
        uploadVideo,
        deleteVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
}; 