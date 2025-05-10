import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuizForm from "@/components/quiz/QuizForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CourseQuizView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, getQuizByCourseId, saveQuizResult } = useCourses();
  const navigate = useNavigate();
  const course = courseId ? getCourse(courseId) : undefined;
  const quiz = courseId ? getQuizByCourseId(courseId) : undefined;

  const handleQuizComplete = async (answers: number[], score: number) => {
    if (!quiz) return;
    try {
      await saveQuizResult({
        userId: "guest",
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date(),
      });
      toast.success("Quiz results saved successfully!");
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save quiz results");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main text-blue-900">
      <Header />
      <main className="flex-1 py-12 px-2 md:px-6 lg:px-0">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <Button onClick={() => navigate(`/courses/${courseId}`)} variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50/40 px-5 py-2 rounded-xl animate-fade-in-fast">
              ← Back to Course
            </Button>
            {course && <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg animate-scale-in">Quiz: {course.title}</h1>}
          </div>
          <div className="flex justify-center items-center min-h-[60vh]">
            {quiz ? (
              <div className="glass-card shadow-2xl rounded-3xl p-6 w-full animate-fade-in-fast">
                <QuizForm questions={quiz.questions} onComplete={handleQuizComplete} />
              </div>
            ) : (
              <div className="glass-card shadow-xl rounded-2xl p-8 text-center animate-fade-in-fast">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">No Quiz Available</h2>
                <p className="text-blue-500 mb-4">The instructor hasn't added a quiz for this course yet.</p>
                <Button onClick={() => navigate(`/courses/${courseId}`)} variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50/40 px-5 py-2 rounded-xl">Back to Course</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 