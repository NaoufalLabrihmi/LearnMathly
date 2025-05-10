import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseForm from "@/components/courses/CourseForm";
import QuizCreator from "@/components/quiz/QuizCreator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ListChecks } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CourseCreation() {
  const [courseData, setCourseData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<'course' | 'quiz'>('course');
  const navigate = useNavigate();
  const { addCourse, addQuiz } = useCourses();
  const { user } = useAuth();

  // Handlers to collect form data
  const handleCourseFormChange = (data: any) => setCourseData(data);
  const handleQuizFormChange = (data: any) => setQuizData(data);

  // Combined submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseData || !quizData) {
      toast.error("Please fill out both the course and quiz forms.");
      return;
    }
    if (!courseData.pdfFile) {
      toast.error("Please upload a course PDF file before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Upload PDF to FastAPI backend
      const formData = new FormData();
      formData.append("file", courseData.pdfFile);
      const uploadRes = await fetch("http://localhost:8000/upload/pdf/", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        toast.error("Failed to upload PDF");
        setIsSubmitting(false);
        return;
      }
      const uploadData = await uploadRes.json();
      const publicUrl = uploadData && uploadData.url ? uploadData.url : undefined;
      if (!publicUrl) {
        toast.error("PDF upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
      // 2. Create course using context/backend
      const newCourse = await addCourse({
        title: courseData.title,
        description: courseData.description,
        teacher_id: user.id,
        teacher_name: user.name,
        pdf_url: publicUrl
      });
      if (!newCourse) throw new Error("Failed to create course");
      // 3. Create quiz with new courseId
      const quizToAdd = { ...quizData, courseId: newCourse.id };
      const newQuiz = await addQuiz(quizToAdd);
      if (!newQuiz) throw new Error("Failed to create quiz");
      toast.success("Course and quiz created successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error(error.message || "Failed to create course and quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Header />
      <main className="flex-1 py-16 px-4 flex items-center justify-center animate-fade-in-fast">
        <form onSubmit={handleSubmit} className="w-full max-w-full mx-auto px-2 md:px-6">
          <Card className="glass-card bg-gradient-to-br from-blue-100/80 to-white/80 border-2 border-blue-200/60 shadow-2xl rounded-3xl p-0 animate-scale-in w-full">
            {/* Stepper/Toggle */}
            <div className="flex justify-center items-center pt-8 pb-2">
              <div className="flex max-w-2xl w-full bg-gradient-to-br from-blue-200/60 to-blue-50/80 rounded-full border border-blue-200 shadow-md overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 rounded-l-full font-bold text-lg
                    ${activeStep === 'course'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md'
                      : 'bg-transparent text-blue-600 hover:bg-blue-100/60'}
                  `}
                  onClick={() => setActiveStep('course')}
                >
                  <BookOpen className={`w-6 h-6 ${activeStep === 'course' ? 'text-white' : 'text-blue-500'}`} />
                  <span>Course Details</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 rounded-r-full font-bold text-lg
                    ${activeStep === 'quiz'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md'
                      : 'bg-transparent text-blue-600 hover:bg-blue-100/60'}
                  `}
                  onClick={() => setActiveStep('quiz')}
                >
                  <ListChecks className={`w-6 h-6 ${activeStep === 'quiz' ? 'text-white' : 'text-blue-500'}`} />
                  <span>Quiz Details</span>
                </button>
              </div>
            </div>
            {/* Animated Form Switch */}
            <div className="px-2 md:px-8 py-8 min-h-[540px] flex items-start justify-center w-full">
              {activeStep === 'course' && (
                <div className="w-full animate-fade-in-fast">
                  <CourseForm onFormChange={handleCourseFormChange} submitting={isSubmitting} initialValues={courseData} />
                </div>
              )}
              {activeStep === 'quiz' && (
                <div className="w-full animate-fade-in-fast">
                  <QuizCreator onFormChange={handleQuizFormChange} submitting={isSubmitting} initialValues={quizData} />
                </div>
              )}
            </div>
            <div className="flex justify-center pb-8 animate-scale-in">
              <button type="submit" className="btn-primary px-12 py-4 rounded-full text-2xl font-extrabold shadow-2xl glass-card bg-gradient-to-br from-blue-500 to-blue-400 hover:scale-105 active:scale-95 transition-all duration-200 animate-fade-in-fast" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Course & Quiz"}
              </button>
            </div>
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
}