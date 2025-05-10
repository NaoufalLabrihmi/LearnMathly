import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Course, Quiz, Question, QuizResult } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface CourseContextType {
  courses: Course[];
  quizzes: Quiz[];
  quizResults: QuizResult[];
  getCourse: (id: string) => Course | undefined;
  getQuizByCourseId: (courseId: string) => Quiz | undefined;
  addCourse: (course: {
    title: string;
    description: string;
    teacher_id: number;
    teacher_name: string;
    pdf_url: string;
  }) => Promise<Course | undefined>;
  addQuiz: (quiz: Omit<Quiz, "id">) => Promise<Quiz | undefined>;
  saveQuizResult: (result: Omit<QuizResult, "id">) => Promise<QuizResult | undefined>;
  loadCourses: () => Promise<void>;
  isLoading: boolean;
  deleteCourse: (courseId: string) => Promise<boolean>;
  updateCourse: (courseId: string, data: any) => Promise<Course | undefined>;
  updateQuiz: (quizId: string, data: any) => Promise<Quiz | undefined>;
  updateQuestion: (questionId: string, data: any) => Promise<Question | undefined>;
}

const initialState = {
  courses: [],
  quizzes: [],
  quizResults: [],
  isLoading: true,
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const API_URL = "http://localhost:8000";

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { courses, quizzes, quizResults, isLoading } = state;
  const auth = useAuth();
  const logoutRef = useRef(auth.logout);
  useEffect(() => { logoutRef.current = auth.logout; }, [auth.logout]);

  const getToken = () => localStorage.getItem("token");

  // Load initial data from FastAPI
  const loadCourses = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Fetch courses
      const coursesRes = await fetch(`${API_URL}/courses/`);
      const coursesData = await coursesRes.json();
      const transformedCourses: Course[] = coursesData.map((course: any) => ({
        id: course.id.toString(),
        title: course.title,
        description: course.description || "",
        teacherId: Number(course.teacher_id),
        teacherName: course.teacher_name,
        pdfUrl: course.pdf_url
          ? course.pdf_url.startsWith("/pdfs/")
            ? `${API_URL}${course.pdf_url}`
            : course.pdf_url.startsWith("http")
              ? course.pdf_url
              : `${API_URL}/pdfs/${course.pdf_url}`
          : "",
        createdAt: new Date(course.created_at),
        updatedAt: new Date(course.updated_at),
      }));

      // Fetch quizzes
      const quizzesRes = await fetch(`${API_URL}/quizzes/`);
      const quizzesData = await quizzesRes.json();
      // For each quiz, fetch questions
      const quizPromises = quizzesData.map(async (quiz: any) => {
        const questionsRes = await fetch(`${API_URL}/questions/${quiz.id}`);
        const questionsData = await questionsRes.json();
        const questions: Question[] = questionsData.map((q: any) => ({
          id: q.id.toString(),
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correct_option_index,
        }));
        return {
          id: quiz.id.toString(),
          courseId: quiz.course_id.toString(),
          title: quiz.title,
          questions,
        };
      });
      const transformedQuizzes: Quiz[] = (await Promise.all(quizPromises)).filter(Boolean) as Quiz[];

      // Fetch quiz results (for all users)
      const resultsRes = await fetch(`${API_URL}/results/1`); // TODO: Use real user id
      const resultsData = await resultsRes.json();
      const transformedResults: QuizResult[] = resultsData.map((result: any) => ({
        id: result.id.toString(),
        userId: result.user_id?.toString() || "guest",
        quizId: result.quiz_id.toString(),
        score: result.score,
        totalQuestions: result.total_questions,
        completedAt: new Date(result.completed_at),
      }));

      setState({
        courses: transformedCourses,
        quizzes: transformedQuizzes,
        quizResults: transformedResults,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading data from backend:", error);
      toast.error("Failed to load courses data");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const getCourse = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  const getQuizByCourseId = (courseId: string): Quiz | undefined => {
    return quizzes.find((quiz) => quiz.courseId === courseId);
  };

  const addCourse = async (courseData: {
    title: string;
    description: string;
    teacher_id: number;
    teacher_name: string;
    pdf_url: string;
  }): Promise<Course | undefined> => {
    try {
      const token = getToken();
      console.log('addCourse token:', token);
      console.log('addCourse payload:', courseData);
      const res = await fetch(`${API_URL}/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(courseData),
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) throw new Error("Failed to create course");
      const data = await res.json();
      const newCourse: Course = {
        id: data.id.toString(),
        title: data.title,
        description: data.description || "",
        teacherId: Number(data.teacher_id),
        teacherName: data.teacher_name,
        pdfUrl: data.pdf_url ? (data.pdf_url.startsWith("/pdfs/") ? `${API_URL}${data.pdf_url}` : `${API_URL}/pdfs/${data.pdf_url}`) : "",
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      setState((prev) => ({ ...prev, courses: [...prev.courses, newCourse] }));
      return newCourse;
    } catch (error) {
      console.error("Error adding course to backend:", error);
      toast.error("Failed to create course");
      return undefined;
    }
  };

  const addQuiz = async (quizData: Omit<Quiz, "id">): Promise<Quiz | undefined> => {
    try {
      const token = getToken();
      // Create quiz
      const quizRes = await fetch(`${API_URL}/quizzes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          course_id: quizData.courseId,
          title: quizData.title,
        }),
      });
      if (quizRes.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!quizRes.ok) throw new Error("Failed to create quiz");
      const quizRecord = await quizRes.json();
      // Create questions (send all)
      const questionsToInsert = quizData.questions.map((q) => ({
        quiz_id: quizRecord.id,
        text: q.text,
        options: q.options,
        correct_option_index: q.correctOptionIndex,
      }));
      // Send each question in a separate POST request
      const createdQuestions: Question[] = [];
      for (const q of questionsToInsert) {
        const questionsRes = await fetch(`${API_URL}/questions/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(q),
        });
        if (questionsRes.status === 401) {
          await logoutRef.current();
          toast.error("Session expired. Please log in again.");
          return undefined;
        }
        if (!questionsRes.ok) throw new Error("Failed to create question");
        const questionData = await questionsRes.json();
        createdQuestions.push({
          id: questionData.id.toString(),
          text: questionData.text,
          options: questionData.options,
          correctOptionIndex: questionData.correct_option_index,
        });
      }
      const newQuiz: Quiz = {
        id: quizRecord.id.toString(),
        courseId: quizRecord.course_id.toString(),
        title: quizRecord.title,
        questions: createdQuestions,
      };
      setState((prev) => ({ ...prev, quizzes: [...prev.quizzes, newQuiz] }));
      return newQuiz;
    } catch (error) {
      console.error("Error adding quiz to backend:", error);
      toast.error("Failed to create quiz");
      return undefined;
    }
  };

  const saveQuizResult = async (resultData: Omit<QuizResult, "id">): Promise<QuizResult | undefined> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/results/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: resultData.userId,
          quiz_id: resultData.quizId,
          score: resultData.score,
          total_questions: resultData.totalQuestions,
          completed_at: resultData.completedAt.toISOString(),
        }),
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) throw new Error("Failed to save quiz result");
      const data = await res.json();
      const newResult: QuizResult = {
        id: data.id.toString(),
        userId: data.user_id?.toString() || "guest",
        quizId: data.quiz_id.toString(),
        score: data.score,
        totalQuestions: data.total_questions,
        completedAt: new Date(data.completed_at),
      };
      setState((prev) => ({ ...prev, quizResults: [...prev.quizResults, newResult] }));
      return newResult;
    } catch (error) {
      console.error("Error saving quiz result to backend:", error);
      toast.error("Failed to save quiz result");
      return undefined;
    }
  };

  const deleteCourse = async (courseId: string): Promise<boolean> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/courses/${courseId}`, {
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
      if (!res.ok) throw new Error("Failed to delete course");
      setState((prev) => ({
        ...prev,
        courses: prev.courses.filter((c) => c.id !== courseId),
      }));
      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
      return false;
    }
  };

  const updateCourse = async (courseId: string, data: any): Promise<Course | undefined> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) throw new Error("Failed to update course");
      const updated = await res.json();
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => c.id === courseId ? {
          ...c,
          ...updated,
          teacherId: Number(updated.teacher_id),
          teacherName: updated.teacher_name,
          pdfUrl: updated.pdf_url,
          createdAt: new Date(updated.created_at),
          updatedAt: new Date(updated.updated_at),
        } : c),
      }));
      return updated;
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
      return undefined;
    }
  };

  const updateQuiz = async (quizId: string, data: any): Promise<Quiz | undefined> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) {
        if (Object.keys(data).length === 1 && data.title) {
          const prevQuiz = quizzes.find(q => q.id === quizId);
          return prevQuiz;
        }
        throw new Error("Failed to update quiz");
      }
      const updated = await res.json();
      setState((prev) => ({
        ...prev,
        quizzes: prev.quizzes.map((q) => q.id === quizId ? { ...q, ...updated } : q),
      }));
      // Reload quizzes/questions to ensure latest data after update
      await loadCourses();
      return updated;
    } catch (error) {
      if (!(Object.keys(data).length === 1 && data.title)) {
        console.error("Error updating quiz:", error);
        toast.error("Failed to update quiz");
      }
      return undefined;
    }
  };

  const updateQuestion = async (questionId: string, data: any): Promise<Question | undefined> => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/questions/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        await logoutRef.current();
        toast.error("Session expired. Please log in again.");
        return undefined;
      }
      if (!res.ok) throw new Error("Failed to update question");
      const updated = await res.json();
      setState((prev) => ({
        ...prev,
        quizzes: prev.quizzes.map((quiz) => ({
          ...quiz,
          questions: quiz.questions.map((q) => q.id === questionId ? { ...q, ...updated } : q),
        })),
      }));
      return updated;
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question");
      return undefined;
    }
  };

  // Helper to handle 401 errors
  const handle401 = async () => {
    await logoutRef.current();
    toast.error("Session expired. Please log in again.");
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        quizzes,
        quizResults,
        isLoading,
        getCourse,
        getQuizByCourseId,
        addCourse,
        addQuiz,
        saveQuizResult,
        loadCourses,
        deleteCourse,
        updateCourse,
        updateQuiz,
        updateQuestion,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};