import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from 'lucide-react';
import confetti from "canvas-confetti";

interface QuizFormProps {
  questions: Question[];
  onComplete: (answers: number[], score: number) => void;
  onClose?: () => void;
}

export default function QuizForm({ questions, onComplete, onClose }: QuizFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(60);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // Pagination logic (moved to top level)
  const QUESTIONS_PER_PAGE = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResults) return;
    setQuestionTimeLeft(60);
    setShowFeedback(false);
    setWasCorrect(null);
    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowFeedback(true);
          setWasCorrect(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResults]);

  useEffect(() => {
    if (showFeedback && wasCorrect) {
      // Confetti burst for correct answer
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#34d399", "#3b82f6", "#f472b6", "#facc15"]
      });
    }
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.classList.remove("animate-flash-bg");
      void feedbackRef.current.offsetWidth; // force reflow
      feedbackRef.current.classList.add("animate-flash-bg");
    }
  }, [showFeedback, wasCorrect]);

  const handleAnswerChange = (value: string) => {
    if (showFeedback) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(value, 10);
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (!showFeedback && answers[currentQuestionIndex] !== -1) {
      // Show feedback first
      setShowFeedback(true);
      setWasCorrect(answers[currentQuestionIndex] === currentQuestion.correctOptionIndex);
      return;
    }
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
  };
  
  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctOptionIndex) {
        correct++;
      }
    });
    
    const calculatedScore = Math.round((correct / questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    onComplete(answers, calculatedScore);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (showResults) {
    const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctOptionIndex ? 1 : 0), 0);
    const incorrectCount = questions.length - correctCount;
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/80 via-fuchsia-100/70 to-teal-100/80 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-6 px-2 w-full max-w-xl mx-auto">
          <div className="text-center w-full mb-2">
            <div className="text-3xl font-extrabold text-blue-900 drop-shadow-lg mb-1">Quiz Results</div>
            <div className="text-base text-blue-700/80 mb-2">
              You scored <span className="font-bold text-blue-900">{score}%</span> <span className="text-sm">({correctCount} of {questions.length} correct)</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-6 mb-4 w-full">
              <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-500">{correctCount}</span>
                <span className="text-xs text-green-700 font-semibold">Correct</span>
              </div>
              <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-red-500">{incorrectCount}</span>
                <span className="text-xs text-red-700 font-semibold">Incorrect</span>
              </div>
              <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-700">{score}%</span>
                <span className="text-xs text-blue-700 font-semibold">Score</span>
              </div>
            </div>
          <div className="w-full max-w-xs h-4 bg-blue-100 rounded-full overflow-hidden shadow-inner border border-blue-200 mb-4">
              <div
              className="h-full bg-gradient-to-r from-green-400 to-lime-400 transition-all duration-500"
                style={{ width: `${(correctCount / questions.length) * 100}%` }}
              />
              <div
              className="h-full bg-gradient-to-r from-red-400 to-pink-400 transition-all duration-500"
                style={{ width: `${(incorrectCount / questions.length) * 100}%`, marginLeft: `${(correctCount / questions.length) * 100}%` }}
              />
          </div>
          <div className={`text-4xl font-extrabold text-center my-2 drop-shadow-xl ${
            score >= 80 ? 'text-green-500' : 
            score >= 50 ? 'text-yellow-500' : 'text-red-500'
          } animate-bounce`}>{score}%</div>
          <div className="flex justify-center w-full mt-4">
          <Button onClick={onClose ? onClose : () => window.location.reload()} variant="outline" className="bg-white/80 border-blue-200 text-blue-900 font-semibold px-4 py-1 rounded-xl shadow-md hover:bg-blue-100/60 text-sm">
            Return to Course
          </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Card
      ref={feedbackRef}
      className={`max-w-xl mx-auto animate-fade-in bg-gradient-to-br from-blue-50/80 via-fuchsia-50/70 to-teal-50/80 border-0 shadow-xl rounded-3xl transition-all duration-500
        ${showFeedback && wasCorrect === true ? 'ring-4 ring-green-400 shadow-green-200 bg-green-50/80' : ''}
        ${showFeedback && wasCorrect === false ? 'ring-4 ring-red-400 shadow-red-200 bg-red-50/80' : ''}
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-1">
          <CardTitle className="text-xl font-extrabold text-blue-900 drop-shadow">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <div className={`text-sm font-semibold px-3 py-0.5 rounded-full shadow-sm ${
            questionTimeLeft > 30 ? 'bg-green-100 text-green-800' : 
            questionTimeLeft > 10 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
          } animate-pulse`}>⏰ {questionTimeLeft}s</div>
        </div>
        <CardDescription className="text-base text-blue-700/80 font-medium">
          Select the correct answer from the options below
        </CardDescription>
        <div className="w-full h-1.5 bg-gradient-to-r from-blue-400 via-fuchsia-400 to-teal-400 rounded-full mt-2 mb-1">
          <div
            className="h-1.5 bg-gradient-to-r from-green-400 to-lime-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-3">
          <div className="text-lg font-bold text-blue-900 mb-1">{currentQuestion.text}</div>
          <RadioGroup
            value={answers[currentQuestionIndex].toString()}
            onValueChange={handleAnswerChange}
            className="space-y-2"
            disabled={showFeedback}
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 border-2 border-blue-100 rounded-xl p-2 bg-white/80 hover:bg-blue-50 transition-all cursor-pointer shadow-sm ${answers[currentQuestionIndex] === index ? 'ring-2 ring-blue-400' : ''} ${showFeedback && currentQuestion.correctOptionIndex === index ? 'border-green-400 bg-green-50' : ''}`}
                onClick={() => handleAnswerChange(index.toString())}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleAnswerChange(index.toString()); }}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showFeedback} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base text-blue-900 font-medium">
                  {option}
                </Label>
                {showFeedback && currentQuestion.correctOptionIndex === index && (
                  <CheckCircle2 className="text-green-500 w-5 h-5 ml-1" />
                )}
                {showFeedback && answers[currentQuestionIndex] === index && answers[currentQuestionIndex] !== currentQuestion.correctOptionIndex && (
                  <XCircle className="text-red-500 w-5 h-5 ml-1" />
                )}
              </div>
            ))}
          </RadioGroup>
          {showFeedback && (
            <div className="mt-3 flex flex-col items-center justify-center animate-fade-in-fast">
              <div className="mb-1">
                {wasCorrect ? (
                  <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400 animate-pulse" />
                )}
              </div>
              <div className="text-lg font-bold text-center transition-all duration-500" style={{ opacity: showFeedback ? 1 : 0 }}>
                {wasCorrect
                  ? <span className="text-green-600">Correct! 🎉</span>
                  : <span className="text-red-600">Incorrect. The correct answer is: <span className="font-bold text-blue-900">{currentQuestion.options[currentQuestion.correctOptionIndex]}</span></span>
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-2">
        <Button 
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0 || showFeedback}
          className="bg-white/80 border-blue-200 text-blue-900 font-semibold px-4 py-1 rounded-xl shadow-md hover:bg-blue-100/60 text-sm"
        >
          Previous
        </Button>
        <div className="text-sm text-blue-700 font-semibold">
          {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Button 
          onClick={handleNext}
          disabled={
            (!showFeedback && answers[currentQuestionIndex] === -1) ||
            (!showFeedback && questionTimeLeft === 0)
          }
          className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-teal-400 text-white font-bold px-6 py-1.5 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 text-base"
        >
          {showFeedback ? (isLastQuestion ? "Submit Quiz" : "Next") : "Check"}
        </Button>
      </CardFooter>
    </Card>
  );
}
