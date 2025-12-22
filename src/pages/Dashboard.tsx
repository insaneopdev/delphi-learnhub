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

  // Translatable UI strings
  const uiStrings = {
    welcomeBack: { en: 'Welcome back,', ta: 'மீ ண்டும் வரவேற்கிறோம்,', hi: 'वापसी पर स्वागत है,', te: 'తిరిగి స్వాగతం,' },
    subtitle: { en: 'Continue your safety training journey', ta: 'உங்கள் பாதுகாப்பு பயிற்சி பயணத்தைத் தொடரவும்', hi: 'अपनी सुरक्षा प्रशिक्षण यात्रा जारी रखें', te: 'మీ భద్రతా శిక్షణ ప్రయాణాన్ని కొనసాగించండి' },
    modules: { en: 'Modules', ta: 'தொகுதிகள்', hi: 'मॉड्यूल', te: 'మాడ్యూల్స్' },
    testsPassed: { en: 'Tests Passed', ta: 'தேர்வுகள் தேர்ச்சி', hi: 'परीक्षण उत्तीर्ण', te: 'పరీక్షలు ఉత్తీర్ణత' },
    avgScore: { en: 'Avg Score', ta: 'சராசரி மதிப்பெண்', hi: 'औसत स्कोर', te: 'సగటు స్కోర్' },
    attempts: { en: 'Attempts', ta: 'முயற்சிகள்', hi: 'प्रयास', te: 'ప్రయత్నాలు' },
    training: { en: 'Training', ta: 'பயிற்சி', hi: 'प्रशिक्षण', te: 'శిక్షణ' },
    trainingDesc: { en: 'Learn safety protocols through interactive modules', ta: 'ஊடாடும் தொகுதிகள் மூலம் பாதுகாப்பு நெறிமுறைகளை அறியவும்', hi: 'इंटरैक्टिव मॉड्यूल के माध्यम से सुरक्षा प्रोटोकॉल सीखें', te: 'ఇంటరాక్టివ్ మాడ్యూల్స్ ద్వారా భద్రతా ప్రోటోకాల్స్ నేర్చుకోండి' },
    modulesCompleted: { en: 'modules completed', ta: 'தொகுதிகள் நிறைவு', hi: 'मॉड्यूल पूर्ण', te: 'మాడ్యూల్స్ పూర్తయింది' },
    testing: { en: 'Testing', ta: 'சோதனை', hi: 'परीक्षण', te: 'పరీక్ష' },
    testingDesc: { en: 'Test your knowledge with timed assessments', ta: 'நேர மதிப்பீடுகளுடன் உங்கள் அறிவைச் சோதிக்கவும்', hi: 'समयबद्ध आकलन के साथ अपने ज्ञान का परीक्षण करें', te: 'సమయ అంచనాలతో మీ జ్ఞానాన్ని పరీక్షించండి' },
    testsAvailable: { en: 'tests available', ta: 'சோதனைகள் கிடைக்கும்', hi: 'परीक्षण उपलब्ध', te: 'పరీక్షలు అందుబాటులో' },
    review: { en: 'Review', ta: 'மதிப்பாய்வு', hi: 'समीक्षा', te: 'సమీక్ష' },
    reviewDesc: { en: 'Manage users and view analytics', ta: 'பயனர்களை நிர்வகிக்கவும் மற்றும் பகுப்பாய்வுகளைக் காண்கவும்', hi: 'उपयोगकर्ताओं का प्रबंधन करें और विश्लेषण देखें', te: 'వినియోగదారులను నిర్వహించండి మరియు విశ్లేషణలను వీక్షించండి' },
    userManagement: { en: 'User Management', ta: 'பயனர் மேலாண்மை', hi: 'उपयोगकर्ता प्रबंधन', te: 'వినియోగదారు నిర్వహణ' },
    admin: { en: 'Admin', ta: 'நிர்வாகி', hi: 'व्यवस्थापक', te: 'నిర్వాహకుడు' },
    adminDesc: { en: 'Manage modules, tests, and content', ta: 'தொகுதிகள், சோதனைகள் மற்றும் உள்ளடக்கத்தை நிர்வகிக்கவும்', hi: 'मॉड्यूल, परीक्षण और सामग्री प्रबंधित करें', te: 'మాడ్యూల్స్, పరీక్షలు మరియు కంటెంట్‌ను నిర్వహించండి' },
    contentManagement: { en: 'Content Management', ta: 'உள்ளடக்க மேலாண்மை', hi: 'सामग्री प्रबंधन', te: 'కంటెంట్ నిర్వహణ' },
    testManagement: { en: 'Test Management', ta: 'சோதனை மேலாண்மை', hi: 'परीक्षण प्रबंधन', te: 'పరీక్ష నిర్వహణ' },
    testManagementDesc: { en: 'Manage test attempts and user assessments', ta: 'சோதனை முயற்சிகள் மற்றும் பயனர் மதிப்பீடுகளை நிர்வகிக்கவும்', hi: 'परीक्षण प्रयासों और उपयोगकर्ता मूल्यांकन का प्रबंधन करें', te: 'పరీక్ష ప్రయత్నాలు మరియు వినియోగదారు అంచనాలను నిర్వహించండి' },
    continueLearning: { en: 'Continue Learning', ta: 'கற்றல் தொடரவும்', hi: 'सीखना जारी रखें', te: 'నేర్చుకోవడం కొనసాగించండి' },
  };

  const menuCards = [
    // Hide Training/Testing quick cards for admin users (admins manage content in Admin panel)
    ...(!isAdmin ? [
      {
        title: t(uiStrings.training),
        description: t(uiStrings.trainingDesc),
        icon: BookOpen,
        path: '/training',
        gradient: 'hero-gradient',
        stats: `${completedModules}/${totalModules} ${t(uiStrings.modulesCompleted)}`,
      },
      {
        title: t(uiStrings.testing),
        description: t(uiStrings.testingDesc),
        icon: ClipboardCheck,
        path: '/testing',
        gradient: 'accent-gradient',
        stats: `${tests.length} ${t(uiStrings.testsAvailable)}`,
      }
    ] : []),
    ...(isAdmin
      ? [
        {
          title: t(uiStrings.testing),
          description: t(uiStrings.testManagementDesc),
          icon: ClipboardCheck,
          path: '/testing',
          gradient: 'accent-gradient',
          stats: t(uiStrings.testManagement),
        },
        {
          title: t(uiStrings.review),
          description: t(uiStrings.reviewDesc),
          icon: BarChart3,
          path: '/review',
          gradient: 'success-gradient',
          stats: t(uiStrings.userManagement),
        },
        {
          title: t(uiStrings.admin),
          description: t(uiStrings.adminDesc),
          icon: BookOpen,
          path: '/admin',
          gradient: 'hero-gradient',
          stats: t(uiStrings.contentManagement),
        },
      ]
      : []),
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span>EHS Induction Program</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {t(uiStrings.welcomeBack)} <span style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.username}</span>
          </h1>
          <p className="text-muted-foreground">
            {t(uiStrings.subtitle)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card animate-slide-up">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium">{t(uiStrings.modules)}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedModules}/{totalModules}</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-100">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">{t(uiStrings.testsPassed)}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{passedTests}</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-200">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">{t(uiStrings.avgScore)}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
          </div>
          <div className="stat-card animate-slide-up animation-delay-300">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">{t(uiStrings.attempts)}</span>
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
            <h3 className="font-semibold text-foreground mb-4">{t(uiStrings.continueLearning)}</h3>
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
