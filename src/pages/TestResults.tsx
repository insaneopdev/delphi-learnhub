import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getAttemptById, getTestById, getQuestionById } from '@/lib/storage';
import { Trophy, XCircle, Clock, Target, ArrowLeft, RotateCcw, Check, X } from 'lucide-react';

export default function TestResults() {
  const { testId, attemptId } = useParams<{ testId: string; attemptId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const attempt = attemptId ? getAttemptById(attemptId) : undefined;
  const test = testId ? getTestById(testId) : undefined;

  if (!attempt || !test) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Results not found</p>
          <Button onClick={() => navigate('/testing')} className="mt-4">
            Back to Testing
          </Button>
        </div>
      </Layout>
    );
  }

  const questions = test.questionIds.map((id) => getQuestionById(id)).filter(Boolean);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getAnswerStatus = (questionId: string) => {
    const question = questions.find((q) => q?.id === questionId);
    const userAnswer = attempt.answers.find((a) => a.questionId === questionId);

    if (!question || !userAnswer) return { correct: false, userAnswer: null };

    let correct = false;
    if (question.type === 'single') {
      correct = String(userAnswer.answer) === String(question.answer);
    } else if (question.type === 'multi') {
      const correctAnswers = (question.answer as number[]).map(String).sort();
      const userAnswers = (Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer]).map(String).sort();
      correct = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
    } else if (question.type === 'fill') {
      correct = String(userAnswer.answer).toLowerCase().trim() === String(question.answer).toLowerCase().trim();
    }

    return { correct, userAnswer: userAnswer.answer };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Result Header */}
        <div className="card-elevated p-8 text-center mb-8 animate-scale-in">
          <div
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${attempt.passed ? 'success-gradient' : 'bg-destructive'
              }`}
          >
            {attempt.passed ? (
              <Trophy className="w-10 h-10 text-success-foreground" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive-foreground" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {attempt.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>

          <p className="text-muted-foreground mb-6">
            {attempt.passed
              ? 'You have successfully passed this test.'
              : `You need ${test.passScore}% to pass. Try again!`}
          </p>

          {/* Score Display */}
          <div className="inline-flex items-center justify-center gap-1 text-5xl font-bold">
            <span className={attempt.passed ? 'text-success' : 'text-destructive'}>
              {attempt.score}
            </span>
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-xs">Pass Score</span>
            </div>
            <p className="text-xl font-bold text-foreground">{test.passScore}%</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-100">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatDuration(attempt.durationSeconds)}</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-200">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4" />
              <span className="text-xs">Correct</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {attempt.answers.filter((a) => getAnswerStatus(a.questionId).correct).length}/
              {questions.length}
            </p>
          </div>
        </div>

        {/* Admin-Only Question Review */}
        {user?.role === 'admin' && (
          <div className="card-elevated p-6 mb-8">
            <h2 className="font-semibold text-foreground mb-4">Detailed Question Review (Admin Only)</h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                if (!question) return null;
                const { correct, userAnswer } = getAnswerStatus(question.id);

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${correct
                      ? 'border-success/30 bg-success/5'
                      : 'border-destructive/30 bg-destructive/5'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${correct ? 'bg-success' : 'bg-destructive'
                          }`}
                      >
                        {correct ? (
                          <Check className="w-4 h-4 text-success-foreground" />
                        ) : (
                          <X className="w-4 h-4 text-destructive-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">Question {index + 1}</p>
                        <p className="text-foreground font-medium mb-2">{t(question.text)}</p>

                        {question.options && (
                          <div className="mt-2 text-sm space-y-1">
                            <p className={correct ? "text-success font-medium" : "text-destructive"}>
                              User's answer:{' '}
                              {question.type === 'multi' && Array.isArray(userAnswer)
                                ? userAnswer.map((i) => t(question.options)?.[Number(i)]).join(', ')
                                : t(question.options)?.[Number(userAnswer)] || userAnswer || 'Not answered'}
                            </p>
                            {!correct && (
                              <p className="text-success font-medium">
                                Correct answer:{' '}
                                {question.type === 'multi'
                                  ? (question.answer as number[])
                                    .map((i) => t(question.options)?.[i])
                                    .join(', ')
                                  : t(question.options)?.[question.answer as number]}
                              </p>
                            )}
                          </div>
                        )}

                        {!question.options && (
                          <div className="mt-2 text-sm space-y-1">
                            <p className={correct ? "text-success font-medium" : "text-destructive"}>
                              User's answer: {userAnswer || 'Not answered'}
                            </p>
                            {!correct && (
                              <p className="text-success font-medium">Correct answer: {question.answer}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/testing')} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    </Layout>
  );
}
