import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

interface CourseCardProps {
  course: Course;
  hasQuiz?: boolean;
  onView?: () => void;
  onQuiz?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function CourseCard({ course, hasQuiz, onView, onQuiz, canDelete, onDelete, onEdit }: CourseCardProps) {
  return (
    <div className="glass-card overflow-hidden shadow-2xl rounded-3xl border-2 border-blue-200/60 transition-transform duration-300 hover:-translate-y-2 hover:shadow-3xl animate-fade-in-fast flex flex-col min-h-[340px]">
      <div className="relative h-40 md:h-48 overflow-hidden group flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100 animate-gradient-x">
        <div className="absolute inset-0 w-full h-full animate-gradient-move bg-gradient-to-br from-blue-400/60 via-pink-200/60 to-blue-100/60" />
        <svg className="relative z-10 w-20 h-20 md:w-24 md:h-24 drop-shadow-xl animate-float" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trophy cup */}
          <ellipse cx="32" cy="56" rx="16" ry="4" fill="#e0e7ef" fillOpacity="0.7" />
          <rect x="26" y="44" width="12" height="6" rx="3" fill="#fbbf24" stroke="#eab308" strokeWidth="2" />
          <rect x="28" y="50" width="8" height="4" rx="2" fill="#fbbf24" stroke="#eab308" strokeWidth="1.5" />
          <path d="M20 20c0 10 6 18 12 18s12-8 12-18" fill="#fde68a" stroke="#eab308" strokeWidth="3" />
          <ellipse cx="32" cy="20" rx="12" ry="8" fill="#fbbf24" stroke="#eab308" strokeWidth="3" />
          <path d="M20 20c-4 0-6 4-6 8s2 8 6 8" stroke="#60a5fa" strokeWidth="2.5" fill="none" />
          <path d="M44 20c4 0 6 4 6 8s-2 8-6 8" stroke="#60a5fa" strokeWidth="2.5" fill="none" />
          {/* Confetti */}
          <circle cx="16" cy="12" r="2" fill="#f472b6" className="animate-sparkle" />
          <circle cx="48" cy="10" r="1.5" fill="#38bdf8" className="animate-sparkle" />
          <rect x="24" y="8" width="2" height="2" rx="1" fill="#fbbf24" className="animate-sparkle" />
          <rect x="40" y="6" width="2" height="2" rx="1" fill="#a3e635" className="animate-sparkle" />
          <circle cx="32" cy="6" r="1.2" fill="#fbbf24" className="animate-sparkle" />
        </svg>
        <Badge
          variant="outline"
          className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold shadow-lg rounded-full px-4 py-1 text-xs animate-scale-in backdrop-blur-md border-0"
        >
          Course
        </Badge>
        {hasQuiz && (
          <span className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold shadow-lg rounded-full px-4 py-1 text-xs animate-float backdrop-blur-md border-0">
            <svg className="w-5 h-5 mr-1 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3" fill="#fff" fillOpacity="0.8" />
              <path d="M8 10l2 2 4-4" stroke="#22c55e" strokeWidth="2.5" />
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="#22c55e" strokeWidth="2.5" />
            </svg>
            QCM
          </span>
        )}
      </div>
      <CardContent className="pt-5 pb-2 flex-1">
        <h3 className="text-xl font-extrabold text-blue-900 mb-2 line-clamp-2 animate-fade-in-fast">{course.title}</h3>
        <p className="text-base text-blue-900/70 line-clamp-3 mb-4 animate-fade-in-fast">{course.description}</p>
        <div className="flex items-center text-xs text-blue-900/50 gap-2 animate-fade-in-fast">
          <span>By {course.teacherName}</span>
          <span className="mx-1">•</span>
          <span>{course.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent px-6 py-4 animate-fade-in-fast flex gap-2">
        {/* No View Course button. Only show edit/delete if canDelete is true */}
        {canDelete && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-blue-500 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400/60 transition-all duration-150 rounded-full border border-transparent hover:border-blue-200 shadow-md"
              aria-label="Edit course"
              onClick={onEdit}
            >
              <Pencil className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-400/60 transition-all duration-150 rounded-full border border-transparent hover:border-red-200 shadow-md"
              aria-label="Delete course"
              onClick={onDelete}
            >
              <Trash2 className="w-6 h-6" />
            </Button>
          </>
        )}
      </CardFooter>
    </div>
  );
}
