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
  type Step, 
  type UserProgress 
} from '@/lib/storage';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  Check,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TrainingModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const module = moduleId ? getModuleById(moduleId) : undefined;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!module || !user) return;
    
    // Load existing progress
    const progress = getModuleProgress(user.id, module.id);
    if (progress) {
      setCompletedSteps(new Set(progress.completedSteps));
      // Resume from first incomplete step
      const firstIncomplete = module.steps.findIndex(
        step => !progress.completedSteps.includes(step.id)
      );
      if (firstIncomplete > 0) {
        setCurrentStepIndex(firstIncomplete);
      }
    }
  }, [module, user]);

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
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    
    if (currentStep.quiz && selectedAnswer === currentStep.quiz.correctIndex) {
      toast({
        title: "Correct! ✓",
        description: "Great job! You got it right.",
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

        {/* Content based on step type */}
        {step.type === 'quiz' && step.quiz ? (
          <div className="space-y-4">
            <p className="text-lg text-foreground font-medium mb-6">
              {t(step.quiz.question)}
            </p>

            <div className="space-y-3">
              {(t(step.quiz.options) as string[] || []).map((option: string, index: number) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = step.quiz?.correctIndex === index;
                
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
                    onClick={() => handleQuizAnswer(index)}
                    disabled={showResult}
                    className={optionClass}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected 
                        ? showResult 
                          ? isCorrect ? 'bg-success border-success' : 'bg-destructive border-destructive'
                          : 'bg-primary border-primary'
                        : 'border-border'
                    }`}>
                      {showResult && isCorrect && <Check className="w-4 h-4 text-success-foreground" />}
                      {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-destructive-foreground" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>

            {step.quiz.hint && !showResult && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border mt-4">
                <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{t(step.quiz.hint)}</p>
              </div>
            )}

            {selectedAnswer !== null && !showResult && (
              <Button onClick={checkAnswer} className="mt-4 btn-hero text-primary-foreground">
                Check Answer
              </Button>
            )}

            {showResult && (
              <div className={`p-4 rounded-lg mt-4 ${
                selectedAnswer === step.quiz.correctIndex 
                  ? 'bg-success/10 border border-success/20' 
                  : 'bg-destructive/10 border border-destructive/20'
              }`}>
                <p className={`font-medium ${
                  selectedAnswer === step.quiz.correctIndex ? 'text-success' : 'text-destructive'
                }`}>
                  {selectedAnswer === step.quiz.correctIndex 
                    ? '✓ Correct! Well done.' 
                    : `✗ Incorrect. The correct answer was: ${t(step.quiz.options)?.[step.quiz.correctIndex]}`}
                </p>
              </div>
            )}
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/training')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">{t(module.title)}</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {module.steps.length}
            </p>
          </div>
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
                setSelectedAnswer(null);
                setShowResult(false);
              }}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index === currentStepIndex
                  ? 'hero-gradient text-primary-foreground'
                  : completedSteps.has(step.id)
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {completedSteps.has(step.id) ? (
                <Check className="w-4 h-4" />
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
            disabled={currentStep.type === 'quiz' && !showResult}
          >
            {isLastStep ? 'Complete Module' : 'Next'}
            {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
