import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookOpen, Users, GraduationCap, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-['Poppins','Inter','Montserrat',sans-serif] bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-x-hidden">
      {/* Animated blue particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-blue-400/10 to-blue-100/20 animate-pulse" />
        <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute right-1/4 bottom-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float-slower" />
      </div>
      <Header />
      <main className="flex-1 py-16 px-4 z-10 relative flex items-center justify-center">
        <section className="w-full max-w-6xl mx-auto py-12 px-4 md:px-16 bg-gradient-to-br from-white/70 via-blue-50/60 to-blue-100/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-14 animate-gradient-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-xl">About LearnMathly</h1>
          <div className="space-y-12 w-full">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-blue-100/60 shadow-lg">
                <BookOpen className="w-14 h-14 text-blue-500 animate-fade-in-up" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">Our Platform</h2>
                <p className="text-blue-900/80 text-lg font-medium">LearnMathly connects teachers and students through interactive learning. Our mission is to make education more accessible, engaging, and effective.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-blue-100/60 shadow-lg">
                <Users className="w-14 h-14 text-blue-500 animate-fade-in-up" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">For Teachers</h2>
                <ul className="list-disc pl-5 text-blue-900/80 text-lg font-medium space-y-1">
                  <li>Upload PDF learning materials for students</li>
                  <li>Create custom multiple-choice quizzes</li>
                  <li>Track student performance and engagement</li>
                  <li>Build a library of educational resources</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-blue-100/60 shadow-lg">
                <GraduationCap className="w-14 h-14 text-blue-500 animate-fade-in-up" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">For Students</h2>
                <ul className="list-disc pl-5 text-blue-900/80 text-lg font-medium space-y-1">
                  <li>Access course materials in one convenient location</li>
                  <li>Study at your own pace with our integrated PDF viewer</li>
                  <li>Test your understanding with interactive quizzes</li>
                  <li>Track your progress and performance across courses</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-blue-100/60 shadow-lg">
                <Eye className="w-14 h-14 text-blue-500 animate-fade-in-up" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">Our Vision</h2>
                <p className="text-blue-900/80 text-lg font-medium">We believe in a future where quality education is accessible to everyone, everywhere. LearnMathly empowers educators and learners to connect, share knowledge, and grow together.</p>
              </div>
            </div>
            <div className="text-center pt-8">
              <p className="text-blue-700 text-lg font-semibold">Thank you for being a part of our educational community!</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
