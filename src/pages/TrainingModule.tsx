import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import {
  getModuleById,
  getModuleProgress,
  saveProgress,
  getQuestionsByModuleAndStep,
  type Step,
  type UserProgress
} from '@/lib/storage';
import { ChevronLeft, ChevronRight, CheckCircle, CheckCircle2, Play, PlayCircle, Info, AlertTriangle, ArrowLeft, ArrowRight, X, BookOpen, HelpCircle, Lightbulb, Check } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { InteractiveImage } from '@/components/InteractiveImage';

export default function TrainingModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const module = moduleId ? getModuleById(moduleId) : undefined;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Map<string, number | number[]>>(new Map());
  const [showResult, setShowResult] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!module || !user) return;

    // Load existing progress
    const progress = getModuleProgress(user.id, module.id);
    if (progress) {
      setCompletedSteps(new Set(progress.completedSteps));
      // Resume from first incomplete step ONLY ON MOUNT
      // We check if currentStepIndex is 0 to avoid resetting if user has already navigated
      if (currentStepIndex === 0) {
        const firstIncomplete = module.steps.findIndex(
          step => !progress.completedSteps.includes(step.id)
        );
        if (firstIncomplete > 0) {
          setCurrentStepIndex(firstIncomplete);
        }
      }
    }
    // Disable ESLint warning for missing dependency 'currentStepIndex' 
    // We intentionally only want this to run when the module loads, not when step changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id, user?.id]);

  // Load questions when current step changes
  useEffect(() => {
    if (!module || !moduleId) return;
    const currentStep = module.steps[currentStepIndex];
    if (currentStep?.type === 'quiz') {
      const questions = getQuestionsByModuleAndStep(moduleId, currentStep.id);
      setCurrentQuestions(questions);
    } else {
      setCurrentQuestions([]);
    }
  }, [module, moduleId, currentStepIndex]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  if (!module) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Module not found</p>
          <Button onClick={() => navigate('/training')} className="mt-4">
            Back to Training
          </Button>
        </div>
      </Layout>
    );
  }

  // If admin, show shortcut to admin editor instead of trainee view
  if (user?.role === 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">Admin: Edit Module</h2>
          <p className="text-muted-foreground mb-4">Admins can edit module content from the Admin panel. Changes will apply to trainees immediately.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/admin')} className="btn-hero text-primary-foreground">Open Admin Panel</Button>
            <Button variant="outline" onClick={() => navigate('/training')} >Back to Training</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStep = module.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / module.steps.length) * 100;
  const isLastStep = currentStepIndex === module.steps.length - 1;

  const markStepComplete = (stepId: string) => {
    if (!user) return;

    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);

    const isModuleComplete = newCompleted.size === module.steps.length;

    const progressData: UserProgress = {
      userId: user.id,
      moduleId: module.id,
      completedSteps: Array.from(newCompleted),
      lastAccessedAt: new Date().toISOString(),
      ...(isModuleComplete && { completedAt: new Date().toISOString() }),
    };

    saveProgress(progressData);

    if (isModuleComplete) {
      toast({
        title: "Module Completed! 🎉",
        description: `You've completed ${t(module.title)}`,
      });
    }
  };

  const handleNext = () => {
    markStepComplete(currentStep.id);

    if (isLastStep) {
      navigate('/training');
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setQuizAnswers(new Map());
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setQuizAnswers(new Map());
      setShowResult(false);
    }
  };

  const handleQuizAnswer = (questionId: string, index: number) => {
    if (showResult) return;
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    setQuizAnswers(prev => {
      const newAnswers = new Map(prev);
      if (question.type === 'multi') {
        // Multiple choice - toggle selection
        const current = Array.isArray(newAnswers.get(questionId)) ? newAnswers.get(questionId) as number[] : [];
        if (current.includes(index)) {
          newAnswers.set(questionId, current.filter(i => i !== index));
        } else {
          newAnswers.set(questionId, [...current, index]);
        }
      } else {
        // Single choice
        newAnswers.set(questionId, index);
      }
      return newAnswers;
    });
  };

  const checkAnswer = () => {
    if (quizAnswers.size === 0 || currentQuestions.length === 0) return;
    setShowResult(true);

    // Check if all answers are correct
    let allCorrect = true;
    for (const question of currentQuestions) {
      const userAnswer = quizAnswers.get(question.id);
      if (userAnswer === undefined) {
        allCorrect = false;
        break;
      }

      let isCorrect = false;
      if (question.type === 'multi') {
        const correctAnswers = Array.isArray(question.answer) ? [...question.answer].sort() : [];
        const selectedAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
        isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers);
      } else {
        isCorrect = userAnswer === question.answer;
      }

      if (!isCorrect) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      toast({
        title: "Correct! ✓",
        description: `You got all ${currentQuestions.length} question(s) right!`,
      });
    }
  };

  const renderStepContent = (step: Step) => {
    const getStepIcon = () => {
      switch (step.type) {
        case 'intro':
          return <BookOpen className="w-5 h-5" />;
        case 'video':
          return <PlayCircle className="w-5 h-5" />;
        case 'content':
          return <BookOpen className="w-5 h-5" />;
        case 'quiz':
          return <HelpCircle className="w-5 h-5" />;
        case 'interactive':
          return <CheckCircle2 className="w-5 h-5" />;
        default:
          return <BookOpen className="w-5 h-5" />;
      }
    };

    return (
      <div className="animate-fade-in">
        {/* Step Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {getStepIcon()}
            <span className="capitalize">{step.type}</span>
          </div>
          {completedSteps.has(step.id) && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </div>
          )}
        </div>

        {/* Step Title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">{t(step.title)}</h2>

        {/* Step Image */}
        {step.imageUrl && (
          <div className="mb-6">
            <img
              src={step.imageUrl}
              alt={t(step.title)}
              className="rounded-lg shadow-lg"
              style={{
                width: step.imageWidth || 'auto',
                height: step.imageHeight || 'auto',
                maxWidth: '100%'
              }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}

        {/* Step Video - YouTube or Uploaded */}
        {step.type === 'video' && step.videoUrl && (() => {
          // Extract YouTube video ID from various URL formats
          const getYouTubeId = (url: string): string | null => {
            const patterns = [
              /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/\s]+)/,
              /youtube\.com\/embed\/([^&\?\/\s]+)/,
            ];
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match) return match[1];
            }
            return null;
          };

          const youtubeId = getYouTubeId(step.videoUrl);

          if (youtubeId) {
            // Render YouTube embed
            return (
              <div className="mb-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={t(step.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            );
          } else {
            // Render uploaded video
            return (
              <div className="mb-6">
                <video
                  controls
                  className="w-full max-w-4xl rounded-lg shadow-lg"
                  src={step.videoUrl}
                  onError={(e) => {
                    console.error('Video failed to load');
                    (e.currentTarget.style.display = 'none');
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
        })()}

        {/* Content based on step type */}
        {step.type === 'quiz' && currentQuestions.length > 0 ? (
          <div className="space-y-6">
            {currentQuestions.map((question, qIdx) => {
              const isMulti = question.type === 'multi';
              const isSingle = question.type === 'single';

              return (
                <div key={question.id} className="space-y-4">
                  <p className="text-lg text-foreground font-medium">
                    {qIdx + 1}. {t(question.text)}
                  </p>

                  {/* Question Image */}
                  {question.imageUrl && (
                    <div className="my-4">
                      <img
                        src={question.imageUrl}
                        alt="Question"
                        className="max-w-md rounded-lg shadow"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}

                  {(isSingle || isMulti) && question.options && (
                    <div className="space-y-3">
                      {(t(question.options) as string[] || []).map((option: string, index: number) => {
                        const userAnswer = quizAnswers.get(question.id);
                        const isSelected = isMulti
                          ? Array.isArray(userAnswer) && userAnswer.includes(index)
                          : userAnswer === index;
                        const correctAnswer = question.answer;
                        const isCorrect = isMulti
                          ? Array.isArray(correctAnswer) && correctAnswer.includes(index)
                          : correctAnswer === index;

                        let optionClass = 'quiz-option';
                        if (showResult) {
                          if (isCorrect) optionClass += ' correct';
                          else if (isSelected && !isCorrect) optionClass += ' incorrect';
                        } else if (isSelected) {
                          optionClass += ' selected';
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(question.id, index)}
                            disabled={showResult}
                            className={optionClass}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                              ? showResult
                                ? isCorrect ? 'bg-success border-success' : 'bg-destructive border-destructive'
                                : 'bg-primary border-primary'
                              : 'border-border'
                              }`}>
                              {showResult && isCorrect && <Check className="w-4 h-4 text-success-foreground" />}
                              {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-destructive-foreground" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-foreground">{option}</span>
                              {/* Option Image */}
                              {question.optionImages && question.optionImages[index] && (
                                <img
                                  src={question.optionImages[index]}
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

                  {question.hint && !showResult && (
                    <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
                      <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{t(question.hint)}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {quizAnswers.size > 0 && !showResult && (
              <Button onClick={checkAnswer} className="mt-4 btn-hero text-primary-foreground">
                Check Answer{currentQuestions.length > 1 ? 's' : ''}
              </Button>
            )}

            {showResult && (
              <div className={`p-4 rounded-lg ${
                // Check if all correct
                (() => {
                  let allCorrect = true;
                  for (const question of currentQuestions) {
                    const userAnswer = quizAnswers.get(question.id);
                    if (userAnswer === undefined) {
                      allCorrect = false;
                      break;
                    }
                    let isCorrect = false;
                    if (question.type === 'multi') {
                      const correctAnswers = Array.isArray(question.answer) ? [...question.answer].sort() : [];
                      const selectedAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
                      isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers);
                    } else {
                      isCorrect = userAnswer === question.answer;
                    }
                    if (!isCorrect) {
                      allCorrect = false;
                      break;
                    }
                  }
                  return allCorrect
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-destructive/10 border border-destructive/20';
                })()
                }`}>
                <p className={`font-medium ${(() => {
                  let allCorrect = true;
                  for (const question of currentQuestions) {
                    const userAnswer = quizAnswers.get(question.id);
                    if (userAnswer === undefined) {
                      allCorrect = false;
                      break;
                    }
                    let isCorrect = false;
                    if (question.type === 'multi') {
                      const correctAnswers = Array.isArray(question.answer) ? [...question.answer].sort() : [];
                      const selectedAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
                      isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers);
                    } else {
                      isCorrect = userAnswer === question.answer;
                    }
                    if (!isCorrect) {
                      allCorrect = false;
                      break;
                    }
                  }
                  return allCorrect ? 'text-success' : 'text-destructive';
                })()
                  }`}>
                  {(() => {
                    let allCorrect = true;
                    for (const question of currentQuestions) {
                      const userAnswer = quizAnswers.get(question.id);
                      if (!userAnswer) {
                        allCorrect = false;
                        break;
                      }
                      let isCorrect = false;
                      if (question.type === 'multi') {
                        const correctAnswers = Array.isArray(question.answer) ? [...question.answer].sort() : [];
                        const selectedAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
                        isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers);
                      } else {
                        isCorrect = userAnswer === question.answer;
                      }

                      if (!isCorrect) {
                        allCorrect = false;
                        break;
                      }
                    }
                    return allCorrect ? '✓ Correct! Well done.' : '✗ Please review the correct answers highlighted above.';
                  })()}
                </p>
              </div>
            )}
          </div>
        ) : step.type === 'interactive' && step.interactive ? (
          <InteractiveImage
            step={step.interactive}
            language={language}
            onComplete={() => markStepComplete(step.id)}
          />
        ) : step.type === 'quiz' ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No questions available for this quiz yet.</p>
          </div>
        ) : (
          <div
            className="prose prose-slate max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: t(step.content) || '' }}
          />
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Exit Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">{t(module.title)}</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {module.steps.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/training')}
            title="Exit Module"
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar value={progress} showLabel />
        </div>

        {/* Step Navigation Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {module.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(index);
                setQuizAnswers(new Map());
                setShowResult(false);
              }}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${index === currentStepIndex
                ? 'hero-gradient text-primary-foreground'
                : completedSteps.has(step.id)
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {completedSteps.has(step.id) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="card-elevated p-6 md:p-8 mb-8">
          {renderStepContent(currentStep)}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="btn-hero text-primary-foreground"
          >
            {isLastStep ? 'Complete Module' : 'Next'}
            {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
