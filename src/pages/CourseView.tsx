import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PDFViewer from "@/components/pdf/PDFViewer";
import QuizCreator from "@/components/quiz/QuizCreator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QuizForm from "@/components/quiz/QuizForm";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, getQuizByCourseId, loadCourses, isLoading } = useCourses();
  const navigate = useNavigate();
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const course = courseId ? getCourse(courseId) : undefined;
  const quiz = courseId ? getQuizByCourseId(courseId) : undefined;
  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (!isLoading && courseId && !course) { toast.error("Course not found"); navigate("/courses"); } }, [courseId, course, navigate, isLoading]);
  if (isLoading) return (<div className="min-h-screen flex items-center justify-center bg-gradient-main animate-pulse"><p className="text-2xl font-semibold text-blue-400">Loading...</p></div>);
  if (!course) return (<div className="min-h-screen flex items-center justify-center bg-gradient-main"><p className="text-2xl font-semibold text-blue-400">Loading...</p></div>);
  const handlePDFComplete = () => { setCourseComplete(true); toast.success("You've completed the course material!"); };
  const handleCreateQuiz = () => { setShowQuizCreator(true); };
  const handleQuizCreationComplete = async () => {
    setShowQuizCreator(false);
    await loadCourses();
    toast.success("Quiz created successfully!");
    navigate("/courses");
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-main text-blue-900">
      {(!showQuizModal) && <Header />}
      <main className="flex-1 py-12 px-2 md:px-6 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          {/* Course Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-fast">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-blue-900 drop-shadow-lg animate-scale-in">{course.title}</h1>
              <p className="text-xl text-blue-900/80 mb-2 max-w-2xl animate-fade-in-fast">{course.description}</p>
              <div className="flex items-center text-base text-blue-900/60 gap-2 animate-fade-in-fast">
                <span className="font-medium">By {course.teacherName}</span>
                <span className="mx-1">•</span>
                <span>Updated <span className="font-mono">{course.updatedAt.toLocaleDateString()}</span></span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!quiz && (
                <Button onClick={handleCreateQuiz} className="btn-primary shadow-lg animate-scale-in">Create Quiz</Button>
              )}
              <Button onClick={() => navigate("/courses")} variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50/40 px-5 py-2 rounded-xl animate-fade-in-fast">Back to Courses</Button>
            </div>
          </div>
          {/* Main Content */}
          <div className="space-y-10">
            {/* PDF Viewer Card - wider, glassy, floating, wow */}
            {!showQuizCreator && (
              <div className="glass-card shadow-2xl rounded-3xl overflow-visible animate-fade-in-fast px-2 md:px-8 py-8 flex flex-col items-center">
                <div className="w-full max-w-[1200px] mx-auto">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-blue-100/40 bg-gradient-to-r from-blue-50/80 to-blue-100/60 rounded-2xl">
                    <div className="flex flex-col gap-1 px-2 py-2">
                      <span className="text-2xl font-bold text-blue-900 tracking-wide">Course Presentation</span>
                      <span className="text-blue-900/70">View the course material below</span>
                    </div>
                    <div className="flex gap-2 px-2 py-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50/40 transition-all">Download</Button>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50/40 transition-all">Share</Button>
                    </div>
                  </div>
                  <div className="pt-0 pb-0 px-0 flex justify-center items-center">
                    <div className="w-full" style={{ maxWidth: 1100 }}>
                      <PDFViewer
                        pdfUrl={course.pdfUrl}
                        courseId={course.id}
                        onComplete={handlePDFComplete}
                        onClose={() => {}}
                        onQuizClick={() => setShowQuizModal(true)}
                      />
                    </div>
                  </div>
                </div>
                {/* Take Quiz Button (if quiz exists) */}
                {quiz && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={() => setShowQuizModal(true)} className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-lg font-semibold px-8 py-3 rounded-xl text-lg animate-scale-in">
                      Take Quiz
                    </Button>
                  </div>
                )}
              </div>
            )}
            {/* Quiz Modal */}
            {showQuizModal && quiz && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600/80 via-fuchsia-600/70 to-teal-400/80 backdrop-blur-2xl">
                <div className="bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in-fast max-w-2xl w-full relative border-4 border-blue-200/40" style={{boxShadow: '0 8px 40px 0 rgba(80,0,200,0.18)'}}>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-blue-100 text-blue-700 rounded-full shadow-2xl p-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50 border-2 border-white/60 hover:scale-110 active:scale-95"
                    title="Close Quiz"
                    aria-label="Close Quiz"
                  >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                  <div className="w-full">
                    <QuizForm questions={quiz.questions} onComplete={() => {}} onClose={() => setShowQuizModal(false)} />
                  </div>
                </div>
              </div>
            )}
            {/* Quiz Creator Section */}
            {showQuizCreator && (
              <QuizCreator courseId={course.id} onComplete={handleQuizCreationComplete} />
            )}
            {/* Quiz CTA */}
            {courseComplete && quiz && !showQuizCreator && (
              <div className="glass-card shadow-xl rounded-2xl animate-fade-in-fast">
                <div className="px-8 py-6">
                  <span className="text-xl font-bold text-blue-900">Ready for a quiz?</span>
                  <span className="block text-blue-900/70 mt-1 mb-4">Now that you've completed the course material, test your knowledge with a quiz!</span>
                  <Button onClick={() => navigate(`/courses/${course.id}/quiz`)} className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-lg font-semibold px-5 py-2 rounded-xl animate-scale-in">Start Quiz</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}