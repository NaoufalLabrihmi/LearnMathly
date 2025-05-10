import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import type { ReactNode } from "react";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import CourseList from "./pages/CourseList";
import CourseView from "./pages/CourseView";
import CourseCreation from "./pages/CourseCreation";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import CourseQuizView from "./pages/CourseQuizView";
import SignUp from "@/pages/SignUp";
import CourseEdit from "./pages/CourseEdit";
import { VideoProvider } from "@/context/VideoContext";
import VideoGallery from "@/pages/VideoGallery";
import VideoUpload from "@/pages/VideoUpload";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CourseProvider>
          <VideoProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/:courseId" element={<CourseView />} />
                  <Route path="/create-course" element={<PrivateRoute><CourseCreation /></PrivateRoute>} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/courses/:courseId/quiz" element={<CourseQuizView />} />
                  <Route path="/courses/:id/edit" element={<PrivateRoute><CourseEdit /></PrivateRoute>} />
                  <Route path="/videos" element={<VideoGallery />} />
                  <Route path="/upload-video" element={<PrivateRoute><VideoUpload /></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </VideoProvider>
        </CourseProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
