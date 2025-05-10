import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCourses } from "@/context/CourseContext";
import { Question } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";
import React from "react";

interface QuizCreatorProps {
  courseId?: string;
  onComplete?: () => void;
  onFormChange?: (data: any) => void;
  submitting?: boolean;
  initialValues?: any;
}

export default function QuizCreator({ courseId, onComplete, onFormChange, submitting, initialValues }: QuizCreatorProps) {
  const { addQuiz } = useCourses();
  
  const [title, setTitle] = useState(initialValues?.title || "");
  const [questions, setQuestions] = useState<Partial<Question>[]>(initialValues?.questions || [
    { 
      text: "", 
      options: ["", "", "", ""], 
      correctOptionIndex: 0 
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please add a quiz title");
      return;
    }
    
    // Validate questions
    const invalidQuestions = questions.filter(
      q => !q.text || q.options?.some(opt => !opt)
    );
    
    if (invalidQuestions.length > 0) {
      toast.error("Please fill in all question texts and options");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert partial questions to full questions with IDs
      const fullQuestions = questions.map((q, index) => ({
        id: `q-${index}-${Date.now()}`, // This ID will be replaced by Supabase
        text: q.text!,
        options: q.options!,
        correctOptionIndex: q.correctOptionIndex!
      }));
      
      const result = await addQuiz({
        courseId,
        title,
        questions: fullQuestions
      });
      
      if (!result) {
        throw new Error("Failed to create quiz");
      }
      
      toast.success("Quiz created successfully");
      onComplete?.();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        text: "", 
        options: ["", "", "", ""], 
        correctOptionIndex: 0 
      }
    ]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("You need at least one question");
      return;
    }
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    setQuestions(updatedQuestions);
  };
  
  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctOptionIndex: optionIndex
    };
    setQuestions(updatedQuestions);
  };
  
  // Call onFormChange with the current quiz data whenever title or questions change
  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        title,
        questions: questions.map(q => ({
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex
        }))
      });
    }
    // eslint-disable-next-line
  }, [title, questions]);
  
  return (
    <Card className="mx-2 md:mx-6 glass-card bg-gradient-to-br from-blue-50/80 to-white/80 border-2 border-blue-200/60 shadow-xl rounded-3xl animate-fade-in-fast p-2 md:p-6">
      <CardHeader className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <PlusCircle className="w-7 h-7 text-blue-400" />
          <CardTitle className="text-2xl font-extrabold text-blue-900 drop-shadow">Quiz Details</CardTitle>
        </div>
        <CardDescription className="text-blue-700/80 font-medium">
          Add questions and options for your course quiz
        </CardDescription>
      </CardHeader>
      <div>
        <CardContent className="space-y-8">
          {/* Quiz Title */}
          <div className="mb-6">
            <Label htmlFor="title" className="block mb-2 text-blue-700 font-bold text-base">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
              required
              disabled={submitting}
              className="bg-white/80 border-2 border-blue-100 rounded-xl px-4 py-4 text-lg text-blue-900 font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Questions */}
          <div className="space-y-8">
            {questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="border-dashed bg-white/90 shadow-md rounded-xl animate-fade-in-fast transition-all duration-300">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-blue-900">Question {questionIndex + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => { removeQuestion(questionIndex); }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2"
                    title="Remove Question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4">
                    <Label htmlFor={`question-${questionIndex}`} className="block mb-2 text-blue-700 font-bold text-base">Question Text</Label>
                    <Textarea
                      id={`question-${questionIndex}`}
                      value={question.text}
                      onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                      placeholder=""
                      rows={2}
                      required
                      disabled={submitting}
                      className="bg-white/80 border-2 border-blue-100 rounded-xl px-4 py-4 text-lg text-blue-900 font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-blue-700 font-semibold">Options</Label>
                    {question.options?.map((option, optionIndex) => {
                      const isCorrect = question.correctOptionIndex === optionIndex;
                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-3 rounded-xl transition-all duration-200 px-2 py-2 ${isCorrect ? 'bg-gradient-to-r from-blue-400/80 to-blue-500/80 text-white shadow-lg' : 'bg-white/60 text-blue-900'}`}
                        >
                          {/* Custom pill toggle */}
                          <button
                            type="button"
                            onClick={() => setCorrectOption(questionIndex, optionIndex)}
                            className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 border-2 ${isCorrect ? 'bg-gradient-to-br from-blue-500 to-blue-400 border-blue-600 shadow-xl' : 'bg-white/70 border-blue-200 hover:bg-blue-100/60'} focus:outline-none`}
                            tabIndex={0}
                            title="Mark as correct answer"
                          >
                            {isCorrect ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <span className="block w-4 h-4 rounded-full border-2 border-blue-300 group-hover:border-blue-500"></span>
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-blue-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                              Mark as correct answer
                            </span>
                          </button>
                          <div className="flex-1">
                            <Label htmlFor={`q${questionIndex}-option${optionIndex}`} className={`block mb-1 text-xs font-bold ${isCorrect ? 'text-white' : 'text-blue-500'}`}>Option {optionIndex + 1}</Label>
                            <Input
                              id={`q${questionIndex}-option${optionIndex}`}
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              placeholder=""
                              required
                              disabled={submitting}
                              className={`bg-white/80 border-2 rounded-xl px-4 py-3 text-base font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all ${isCorrect ? 'border-blue-400 text-blue-900' : 'border-blue-100 text-blue-900'}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-bold rounded-xl shadow hover:scale-105 transition-transform duration-200 flex items-center gap-2"
              disabled={submitting}
            >
              <PlusCircle className="w-5 h-5" /> Add Question
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
