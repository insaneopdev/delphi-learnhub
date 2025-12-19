import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { getModules, getUserProgress, getAttemptsByUser, getTests } from '@/lib/storage';
import { BookOpen, ClipboardCheck, BarChart3, ChevronRight, Trophy, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modules = getModules();
  const userProgress = user ? getUserProgress(user.id) : [];
  const attempts = user ? getAttemptsByUser(user.id) : [];
  const tests = getTests();

  // Calculate stats
  const completedModules = userProgress.filter(p => p.completedAt).length;
  const totalModules = modules.length;
  const passedTests = attempts.filter(a => a.passed && a.status === 'completed').length;
  const totalAttempts = attempts.filter(a => a.status === 'completed').length;
  const avgScore = totalAttempts > 0 
    ? Math.round(attempts.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;

  const menuCards = [
    {
      title: 'Training',
      description: 'Learn safety protocols through interactive modules',
      icon: BookOpen,
      path: '/training',
      gradient: 'hero-gradient',
      stats: `${completedModules}/${totalModules} modules completed`,
    },
    {
      title: 'Testing',
      description: 'Test your knowledge with timed assessments',
      icon: ClipboardCheck,
      path: '/testing',
      gradient: 'accent-gradient',
      stats: `${tests.length} tests available`,
    },
    ...(isAdmin
      ? [
          {
            title: 'Review',
            description: 'Manage users, content, and view analytics',
            icon: BarChart3,
            path: '/review',
            gradient: 'success-gradient',
            stats: 'Admin Dashboard',
          },
        ]
      : []),
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient">{user?.username}</span>
          </h1>
          <p className="text-muted-foreground">
            Continue your safety training journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium">Modules</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedModules}/{totalModules}</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-100">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Tests Passed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{passedTests}</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-200">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Score</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-300">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Attempts</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalAttempts}</p>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card, index) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`card-elevated p-6 text-left group animate-slide-up`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${card.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow`}>
                <card.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {card.title}
              </h2>
              
              <p className="text-muted-foreground text-sm mb-4">
                {card.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {card.stats}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* Quick Resume Section */}
        {userProgress.length > 0 && !userProgress.every(p => p.completedAt) && (
          <div className="mt-8 card-elevated p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4">Continue Learning</h3>
            <div className="space-y-3">
              {userProgress
                .filter(p => !p.completedAt)
                .slice(0, 3)
                .map(progress => {
                  const module = modules.find(m => m.id === progress.moduleId);
                  if (!module) return null;
                  const completionPercent = (progress.completedSteps.length / module.steps.length) * 100;
                  
                  return (
                    <button
                      key={progress.moduleId}
                      onClick={() => navigate(`/training/${module.id}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{t(module.title)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full rounded-full accent-gradient"
                              style={{ width: `${completionPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round(completionPercent)}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
