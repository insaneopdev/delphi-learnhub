import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from '@/components/ProgressBar';
import {
  getTestById,
  getQuestionById,
  saveAttempt,
  getAttemptById,
  type TestAttempt,
  type Question,
} from '@/lib/storage';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  Check,
  Pause,
  Play,
  Send,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TestSession() {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const test = React.useMemo(() => testId ? getTestById(testId) : undefined, [testId]);
  const questions = React.useMemo(() =>
    test ? test.questionIds.map((id) => getQuestionById(id)).filter(Boolean) as Question[] : [],
    [test]
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({});

  // Initialize test
  useEffect(() => {
    if (!test || !user) return;

    // Check for existing in-progress attempt
    const existingAttemptId = sessionStorage.getItem(`test_attempt_${test.id}`);
    if (existingAttemptId) {
      const existing = getAttemptById(existingAttemptId);
      if (existing && existing.status === 'in_progress') {
        setAttemptId(existing.id);
        setStartTime(new Date(existing.startedAt));
        // Restore answers
        const restoredAnswers: Record<string, string | string[]> = {};
        existing.answers.forEach((a) => {
          restoredAnswers[a.questionId] = a.answer;
        });
        setAnswers(restoredAnswers);
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - new Date(existing.startedAt).getTime()) / 1000);
        setTimeRemaining(Math.max(0, test.timeLimitMinutes * 60 - elapsed));
        return;
      }
    }

    // Start new attempt
    const newAttemptId = crypto.randomUUID();
    const now = new Date();
    setAttemptId(newAttemptId);
    setStartTime(now);
    setTimeRemaining(test.timeLimitMinutes * 60);

    const attempt: TestAttempt = {
      id: newAttemptId,
      userId: user.id,
      testId: test.id,
      answers: [],
      score: 0,
      passed: false,
      startedAt: now.toISOString(),
      durationSeconds: 0,
      status: 'in_progress',
    };

    saveAttempt(attempt);
    sessionStorage.setItem(`test_attempt_${test.id}`, newAttemptId);
  }, [test, user]);


  // Auto-save progress
  useEffect(() => {
    if (!attemptId || !user || !test) return;

    const saveProgress = () => {
      const attempt = getAttemptById(attemptId);
      if (attempt && attempt.status === 'in_progress') {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer: Array.isArray(answer) ? answer : answer,
          timeSpent: timePerQuestion[questionId] || 0,
        }));

        saveAttempt({
          ...attempt,
          answers: answersArray,
        });
      }
    };

    const interval = setInterval(saveProgress, 5000);
    return () => clearInterval(interval);
  }, [attemptId, answers, timePerQuestion, user, test]);

  // Block navigation during test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Test in progress. Are you sure you want to leave? Your progress will be lost.';
      return e.returnValue;
    };

    const handlePopState = (e: PopStateEvent) => {
      const confirmLeave = window.confirm('Test in progress. Are you sure you want to leave? Your progress will be lost.');
      if (!confirmLeave) {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = useCallback(() => {
    let correct = 0;
    let total = questions.length;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;

      if (q.type === 'single') {
        if (String(userAnswer) === String(q.answer)) correct++;
      } else if (q.type === 'multi') {
        const correctAnswers = (q.answer as number[]).map(String).sort();
        const userAnswers = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).map(String).sort();
        if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswers)) correct++;
      } else if (q.type === 'fill') {
        if (String(userAnswer).toLowerCase().trim() === String(q.answer).toLowerCase().trim()) {
          correct++;
        }
      }
    });

    return Math.round((correct / total) * 100);
  }, [answers, questions]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!attemptId || !user || !test || isSubmitting) return;

    setIsSubmitting(true);

    const score = calculateScore();
    const passed = score >= test.passScore;

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer: Array.isArray(answer) ? answer : answer,
      timeSpent: timePerQuestion[questionId] || 0,
    }));

    // Calculate actual duration based on timestamps
    const now = new Date();
    const duration = startTime ? Math.floor((now.getTime() - startTime.getTime()) / 1000) : 0;

    const attempt: TestAttempt = {
      id: attemptId,
      userId: user.id,
      testId: test.id,
      answers: answersArray,
      score,
      passed,
      startedAt: startTime?.toISOString() || new Date().toISOString(),
      finishedAt: now.toISOString(),
      durationSeconds: duration,
      status: 'completed',
    };

    saveAttempt(attempt);
    sessionStorage.removeItem(`test_attempt_${test.id}`);

    toast({
      title: passed ? 'Congratulations! 🎉' : 'Test Completed',
      description: passed
        ? `You passed with a score of ${score}%!`
        : `Your score: ${score}%. Required: ${test.passScore}%`,
    });

    navigate(`/testing/${test.id}/results/${attemptId}`);
  }, [attemptId, user, test, isSubmitting, calculateScore, answers, timePerQuestion, startTime, toast, navigate]);

  // Timer
  useEffect(() => {
    if (!test || isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, isPaused, handleSubmit, timeRemaining]);

  const handleQuestionChange = (newIndex: number) => {
    // Save time spent on current question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQ = questions[currentQuestionIndex];
    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
    }));

    setCurrentQuestionIndex(newIndex);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: string, optionIndex: number) => {
    const current = (answers[questionId] as string[]) || [];
    const indexStr = String(optionIndex);
    const newValue = current.includes(indexStr)
      ? current.filter((v) => v !== indexStr)
      : [...current, indexStr];
    handleAnswerChange(questionId, newValue);
  };

  if (!test || questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Test not found or has no questions</p>
          <Button onClick={() => navigate('/testing')} className="mt-4">
            Back to Testing
          </Button>
        </div>
      </Layout>
    );
  }

  // Prevent admins from taking tests
  if (user?.role === 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Admins cannot take tests here. Use the Admin panel to manage tests and questions.</p>
          <Button onClick={() => navigate('/admin')} className="mt-4 btn-hero text-primary-foreground">
            Go to Admin Panel
          </Button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isUrgent = timeRemaining < 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">{t(test.title)}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${isUrgent
              ? 'bg-destructive/10 text-destructive timer-urgent'
              : 'bg-muted text-foreground'
              }`}
          >
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeRemaining)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar value={progress} />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{answeredCount} answered</span>
            <span>{questions.length - answeredCount} remaining</span>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => handleQuestionChange(index)}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${index === currentQuestionIndex
                ? 'hero-gradient text-primary-foreground'
                : answers[q.id]
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {answers[q.id] ? <Check className="w-4 h-4" /> : index + 1}
            </button>
          ))}
        </div>

        {/* Paused Overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
            <div className="text-center">
              <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Test Paused</h2>
              <p className="text-muted-foreground mb-4">
                Time remaining: {formatTime(timeRemaining)}
              </p>
              <Button onClick={() => setIsPaused(false)} className="btn-hero text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="card-elevated p-6 md:p-8 mb-6 animate-fade-in">
          {/* Question Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
              {currentQuestion.type}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentQuestion.difficulty === 'complex'
              ? 'bg-warning/10 text-warning'
              : 'bg-muted text-muted-foreground'
              }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <p className="text-lg text-foreground font-medium mb-6">
            {t(currentQuestion.text)}
          </p>

          {/* Question Image */}
          {currentQuestion.imageUrl && (
            <div className="mb-6">
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="max-w-md rounded-lg shadow"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          {/* Answer Options */}
          {currentQuestion.type === 'single' && currentQuestion.options && (
            <div className="space-y-3">
              {(t(currentQuestion.options) as string[] || []).map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(currentQuestion.id, String(index))}
                  className={`quiz-option ${answers[currentQuestion.id] === String(index) ? 'selected' : ''
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestion.id] === String(index)
                      ? 'bg-primary border-primary'
                      : 'border-border'
                      }`}
                  >
                    {answers[currentQuestion.id] === String(index) && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-foreground">{option}</span>
                    {/* Option Image */}
                    {currentQuestion.optionImages && currentQuestion.optionImages[index] && (
                      <img
                        src={currentQuestion.optionImages[index]}
                        alt={`Option ${index + 1}`}
                        className="mt-2 max-w-sm max-h-40 rounded shadow"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multi' && currentQuestion.options && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">Select all that apply</p>
              {(t(currentQuestion.options) as string[] || []).map((option: string, index: number) => {
                const selected = ((answers[currentQuestion.id] as string[]) || []).includes(
                  String(index)
                );
                return (
                  <button
                    key={index}
                    onClick={() => handleMultiSelect(currentQuestion.id, index)}
                    className={`quiz-option ${selected ? 'selected' : ''}`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 border-2 ${selected ? 'bg-primary border-primary' : 'border-border'
                        }`}
                    >
                      {selected && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-foreground">{option}</span>
                      {/* Option Image */}
                      {currentQuestion.optionImages && currentQuestion.optionImages[index] && (
                        <img
                          src={currentQuestion.optionImages[index]}
                          alt={`Option ${index + 1}`}
                          className="mt-2 max-w-sm max-h-40 rounded shadow"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'fill' && (
            <Input
              placeholder="Type your answer..."
              value={(answers[currentQuestion.id] as string) || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="max-w-md"
            />
          )}

          {currentQuestion.type === 'code' && (
            <Textarea
              placeholder="Write your code here..."
              value={(answers[currentQuestion.id] as string) || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="font-mono min-h-[200px]"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => handleQuestionChange(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="btn-hero text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleQuestionChange(Math.min(questions.length - 1, currentQuestionIndex + 1))
              }
              className="btn-hero text-primary-foreground"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Submit Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Test?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} of {questions.length} questions.
                {answeredCount < questions.length && (
                  <span className="block mt-2 text-warning">
                    <AlertTriangle className="inline w-4 h-4 mr-1" />
                    {questions.length - answeredCount} questions are unanswered.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Review Answers</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="btn-hero text-primary-foreground"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
