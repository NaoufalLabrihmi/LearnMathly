export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: number;
  teacherName: string;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  teacherId: number;
  teacherName: string;
  videoUrl: string;
  createdAt: Date;
}
