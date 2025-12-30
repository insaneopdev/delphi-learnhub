import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { getModules, getUserProgress, getAttemptsByUser, getTests, getUsers, getAttempts } from '@/lib/storage';
import { BookOpen, ClipboardCheck, BarChart3, ChevronRight, Trophy, Clock, Target, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modules = getModules();
  const userProgress = user ? getUserProgress(user.id) : [];
  const attempts = user ? getAttemptsByUser(user.id) : [];
  const tests = getTests();

  // Calculate trainee stats
  const completedModules = userProgress.filter(p => p.completedAt).length;
  const totalModules = modules.length;
  const passedTests = attempts.filter(a => a.passed && a.status === 'completed').length;
  const totalAttempts = attempts.filter(a => a.status === 'completed').length;
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;

  // Calculate admin stats
  const allUsers = isAdmin ? getUsers() : [];
  const totalUsers = allUsers.filter(u => u.role !== 'admin').length; // Exclude admins from count
  const allAttempts = isAdmin ? getAttempts() : [];
  const completedAttempts = allAttempts.filter(a => a.status === 'completed');
  const overallAvgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length)
    : 0;
  const totalTests = tests.length;

  // Calculate completion rate for admin (percentage of users who completed at least one module)
  const usersWithProgress = isAdmin ? allUsers.filter(u => {
    const progress = getUserProgress(u.id);
    return progress.some(p => p.completedAt);
  }).length : 0;
  const completionRate = totalUsers > 0 ? Math.round((usersWithProgress / totalUsers) * 100) : 0;

  // Translatable UI strings
  const uiStrings = {
    welcomeBack: { en: 'Welcome back,', ta: 'மீ ண்டும் வரவேற்கிறோம்,', hi: 'वापसी पर स्वागत है,', te: 'తిరిగి స్వాగతం,' },
    subtitle: { en: 'Continue your safety training journey', ta: 'உங்கள் பாதுகாப்பு பயிற்சி பயணத்தைத் தொடரவும்', hi: 'अपनी सुरक्षा प्रशिक्षण यात्रा जारी रखें', te: 'మీ భద్రతా శిక్షణ ప్రయాణాన్ని కొనసాగించండి' },
    modules: { en: 'Modules', ta: 'தொகுதிகள்', hi: 'मॉड्यूल', te: 'మాడ్యూల్స్' },
    testsPassed: { en: 'Tests Passed', ta: 'தேர்வுகள் தேர்ச்சி', hi: 'परीक्षण उत्तीर्ण', te: 'పరీక్షలు ఉత్తీర్ణత' },
    avgScore: { en: 'Avg Score', ta: 'சராசரி மதிப்பெண்', hi: 'औसत स्कोर', te: 'సగటు స్కోర్' },
    attempts: { en: 'Attempts', ta: 'முயற்சிகள்', hi: 'प्रयास', te: 'ప్రయత్నాలు' },
    totalUsers: { en: 'Total Users', ta: 'மொத்த பயனர்கள்', hi: 'कुल उपयोगकर्ता', te: 'మొత్తం వినియోగదారులు' },
    activeTests: { en: 'Active Tests', ta: 'செயலில் சோதனைகள்', hi: 'सक्रिय परीक्षण', te: 'క్రియాశీల పరీక్షలు' },
    completionRate: { en: 'Completion Rate', ta: 'நிறைவு விகிதம்', hi: 'पूर्ण होने की दर', te: 'పూర్తి రేటు' },
    overallAvg: { en: 'Overall Avg', ta: 'ஒட்டுமொத்த சராசரி', hi: 'समग्र औसत', te: 'మొత్తం సగటు' },
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
        <div className="mb-10 relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-12 shadow-2xl animate-fade-in group">
          <div className="relative z-10 max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {t(uiStrings.welcomeBack)} {user?.username}
            </h1>
            <p className="text-blue-50/90 text-lg md:text-xl font-medium tracking-wide drop-shadow-md mb-10">
              {t(uiStrings.subtitle)}
            </p>

            {/* Quick Stats Overlay - Center of the dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
              {isAdmin ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.totalUsers)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{totalUsers}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.modules)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{totalModules}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <ClipboardCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.activeTests)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{totalTests}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.completionRate)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{completionRate}%</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.modules)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{completedModules}/{totalModules}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.testsPassed)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{passedTests}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.avgScore)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{avgScore}%</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{t(uiStrings.attempts)}</span>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{totalAttempts}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Decorative circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <div className="absolute right-20 -bottom-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>



        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {menuCards.map((card, index) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-border/50 bg-card text-left animate-slide-up`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Background Gradient Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-primary`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${card.gradient}`}>
                  <card.icon className="w-8 h-8 text-white drop-shadow-md" />
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors tracking-tight">{card.title}</h2>
                <p className="text-muted-foreground text-base mb-6 flex-grow leading-relaxed">{card.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                  <span className="text-sm font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                    {card.stats}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <ChevronRight className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
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
                      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border shadow-sm">
                        {module.imageUrl ? (
                          <img src={module.imageUrl} alt={t(module.title)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full hero-gradient flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                        )}
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
