import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseForm from "@/components/courses/CourseForm";
import QuizCreator from "@/components/quiz/QuizCreator";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { BookOpen, ListChecks } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, quizzes, getCourse, getQuizByCourseId, updateCourse, updateQuiz, updateQuestion } = useCourses();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<'course' | 'quiz'>('course');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    // Find course and quiz
    const course = getCourse(id);
    if (!course) return;
    const quiz = getQuizByCourseId(id);
    setCourseData({
      title: course.title,
      description: course.description,
      teacherId: course.teacherId,
      teacherName: course.teacherName,
      pdfUrl: course.pdfUrl,
      pdfFile: null, // We'll handle PDF upload/edit later
      removeOldPdf: false,
    });
    setOriginalPdfUrl(course.pdfUrl);
    setQuizData(quiz ? {
      title: quiz.title,
      questions: quiz.questions.map(q => ({ ...q })),
    } : null);
    setIsLoading(false);
  }, [id, courses, quizzes]);

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let pdfUrl = courseData.pdfUrl;
      // If user removed old PDF, delete the original PDF from backend
      if (courseData.removeOldPdf && originalPdfUrl) {
        await fetch(`http://localhost:8000/pdf_delete?url=${encodeURIComponent(originalPdfUrl)}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        pdfUrl = "";
      }
      // Handle PDF upload if changed
      if (courseData.pdfFile && courseData.pdfFile instanceof File) {
        const formData = new FormData();
        formData.append("file", courseData.pdfFile);
        const res = await fetch("http://localhost:8000/upload/pdf/", {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to upload PDF");
        const data = await res.json();
        pdfUrl = data.url;
      }
      // Update course
      await updateCourse(id, {
        title: courseData.title,
        description: courseData.description,
        teacher_id: courseData.teacherId,
        teacher_name: courseData.teacherName,
        pdf_url: pdfUrl,
      });
      // Update quiz
      if (quizData) {
        const quiz = quizzes.find(q => q.courseId === id);
        if (quiz) {
          await updateQuiz(quiz.id, { title: quizData.title, course_id: quiz.courseId });
          // Update questions
          for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            if (quiz.questions[i]) {
              await updateQuestion(quiz.questions[i].id, {
                quiz_id: quiz.id,
                text: q.text,
                options: q.options,
                correct_option_index: q.correctOptionIndex,
              });
            }
          }
        }
      }
      toast.success("Course updated successfully");
      navigate("/courses");
    } catch (e) {
      toast.error("Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-blue-700">Loading...</div>;
  }

  if (!courseData || (user && user.id !== courseData.teacherId)) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">You are not allowed to edit this course.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Header />
      <main className="flex-1 py-16 px-4 flex items-center justify-center animate-fade-in-fast">
        <div className="w-full max-w-full mx-auto px-2 md:px-6">
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
                  <CourseForm onFormChange={setCourseData} submitting={false} initialValues={courseData} />
                </div>
              )}
              {activeStep === 'quiz' && (
                <div className="w-full animate-fade-in-fast">
                  <QuizCreator onFormChange={setQuizData} submitting={false} initialValues={quizData} />
                </div>
              )}
            </div>
            {/* Save button */}
            <div className="flex justify-end px-8 pb-8">
              <Button
                className="btn-primary px-8 py-3 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 