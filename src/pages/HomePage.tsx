import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import CourseCard from "@/components/courses/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LogIn, UserPlus, BookOpen, GraduationCap, CheckCircle2, Plus } from 'lucide-react';
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-200 via-blue-50 to-white animate-gradient-move font-['Poppins','Inter','Montserrat',sans-serif]">
          {/* Animated floating shapes */}
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
          {/* Hero background image with blur and opacity */}
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="w-full h-full bg-[url('https://plus.unsplash.com/premium_photo-1682403136717-77c9b41a52b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-60 blur-sm" />
          </div>
          <div className="container mx-auto max-w-6xl z-10 relative flex items-center justify-center min-h-[32rem]">
            <div className="relative w-full md:w-3/4 lg:w-2/3 mx-auto animate-fade-in-fast">
              {/* Animated blue particle overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-blue-400/10 to-blue-100/20 animate-pulse" />
                <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float-slow" />
                <div className="absolute right-1/4 bottom-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-float-slower" />
              </div>
              <div className="relative glass-card p-14 shadow-2xl border-2 border-blue-300/40 bg-gradient-to-br from-white/60 via-blue-50/60 to-blue-100/60 backdrop-blur-2xl rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:ring-4 hover:ring-blue-300/40 before:absolute before:inset-0 before:rounded-[2.5rem] before:bg-gradient-to-br before:from-blue-400/20 before:to-blue-200/10 before:blur-xl before:opacity-60 before:z-0 overflow-hidden">
                <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold leading-tight text-blue-900 mb-6 animate-gradient-text tracking-tight drop-shadow-xl text-center break-words bg-gradient-to-r from-blue-400 via-blue-600 to-blue-300 bg-clip-text text-transparent animate-shimmer">
                  Empower Your{' '}
                  <span className="inline-block animate-bounce bg-gradient-to-r from-blue-300 via-blue-500 to-blue-200 bg-clip-text text-transparent whitespace-nowrap drop-shadow-lg">Learning</span>
                </h1>
                <p className="relative z-10 text-xl md:text-2xl text-blue-900/80 mb-8 animate-fade-in-fast font-medium text-center drop-shadow-md">
                  The next-generation platform for teachers and students. Create, share, and learn with interactive courses and quizzes.
                </p>
                <div className="flex gap-4 items-center mb-6">
                  <Button asChild size="lg" className="relative z-10 btn-primary shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold px-8 py-4 rounded-full text-xl animate-glow ring-2 ring-blue-300/40 hover:ring-4 hover:ring-blue-400/60">
                    <Link to="/courses">
                      <BookOpen className="inline-block mr-2 animate-fade-in" />
                      Explore Courses
                    </Link>
                  </Button>
                </div>
                {!user && (
                  <div className="flex gap-4 items-center">
                    <Button asChild size="lg" variant="outline" className="relative z-10 flex items-center gap-2 text-blue-900 border-blue-400 hover:bg-blue-50/40 animate-fade-in-fast font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200 ring-1 ring-blue-200/40 hover:ring-2 hover:ring-blue-400/60">
                      <Link to="/login">
                        <LogIn className="w-5 h-5 mr-1" />
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="relative z-10 flex items-center gap-2 text-blue-700 border-blue-400 hover:bg-blue-100/40 animate-fade-in-fast font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200 ring-1 ring-blue-200/40 hover:ring-2 hover:ring-blue-400/60">
                      <Link to="/signup">
                        <UserPlus className="w-5 h-5 mr-1" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-blue-900 animate-fade-in-fast tracking-tight">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="glass-card p-10 text-center shadow-2xl border-2 border-blue-200/60 bg-white/80 backdrop-blur-lg rounded-3xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 animate-fade-in-up">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-bounce">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-900">Create Courses</h3>
                <p className="text-blue-900/70 text-lg font-medium">Teachers can upload PDF materials and create engaging quizzes for their students.</p>
              </div>
              <div className="glass-card p-10 text-center shadow-2xl border-2 border-blue-200/60 bg-white/80 backdrop-blur-lg rounded-3xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 animate-fade-in-up delay-100">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-bounce">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-900">Learn Materials</h3>
                <p className="text-blue-900/70 text-lg font-medium">Students can access and study course materials directly within the platform.</p>
              </div>
              <div className="glass-card p-10 text-center shadow-2xl border-2 border-blue-200/60 bg-white/80 backdrop-blur-lg rounded-3xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 animate-fade-in-up delay-200">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-900">Test Knowledge</h3>
                <p className="text-blue-900/70 text-lg font-medium">After studying, students can take quizzes to test their understanding of the material.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Courses Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-white/90 to-blue-50/60">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-14">
              <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">Featured Courses</h2>
              <Button asChild variant="ghost" className="text-blue-700 font-bold animate-fade-in-fast text-lg">
                <Link to="/courses">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {featuredCourses.map(course => (
                <Link
                  key={course.id}
                  to="/courses"
                  className="group relative glass-card p-6 shadow-2xl border-2 border-blue-200/60 bg-white/80 backdrop-blur-lg rounded-3xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 animate-fade-in-up cursor-pointer block focus:outline-none focus:ring-4 focus:ring-blue-300/40"
                  tabIndex={0}
                  aria-label={`See all courses`}
                >
                  <CourseCard course={course} onView={undefined} />
                </Link>
              ))}
            </div>
            {featuredCourses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-blue-500 mb-4">No courses available yet.</p>
                {user && (
                  <Button asChild className="btn-primary animate-scale-in">
                    <Link to="/create-course">Create Your First Course</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
        {/* Floating Action Button for Teachers */}
        {user && (
          <Button asChild className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full shadow-2xl p-0 w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform duration-500 animate-bounce-slow">
            <Link to="/create-course">
              <Plus className="w-8 h-8" />
              <span className="sr-only">Create Course</span>
            </Link>
          </Button>
        )}
      </main>
      <Footer />
    </div>
  );
}
