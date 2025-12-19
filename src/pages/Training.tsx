import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { ModuleCard } from '@/components/ModuleCard';
import { getModules, getUserProgress } from '@/lib/storage';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Training() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modules = getModules();
  const userProgress = user ? getUserProgress(user.id) : [];

  const getModuleProgress = (moduleId: string) => {
    const progress = userProgress.find(p => p.moduleId === moduleId);
    const module = modules.find(m => m.id === moduleId);
    if (!progress || !module) return 0;
    return (progress.completedSteps.length / module.steps.length) * 100;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Training Modules</h1>
            <p className="text-muted-foreground">Learn safety protocols step by step</p>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ModuleCard
                module={module}
                progress={getModuleProgress(module.id)}
                onClick={() => navigate(`/training/${module.id}`)}
              />
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No training modules available yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
