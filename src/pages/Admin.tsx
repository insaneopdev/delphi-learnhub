import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, languageNames } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  getUsers,
  saveUser,
  deleteUser,
  hashPassword,
  getModules,
  saveModule,
  getTests,
  getQuestions,
  getQuestionsByModule,
  getQuestionsByModuleAndStep,
  saveTest,
  saveQuestion,
  deleteQuestion,
  getAttempts,
  deleteAttempt,
  addAuditLog,
  type User,
  type Module,
  type Test,
  type TestAttempt,
} from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { translateToAllLanguages } from '@/lib/translator';
import { htmlToMarkdown, markdownToHtml } from '@/lib/markdown';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Shield, BookOpen, AlertTriangle, Zap, Heart, Star, Award, Target, Lightbulb, Briefcase, Wrench, HardHat } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'trainee'>('trainee');

  // Content (modules/tests)
  const [modules, setModules] = useState<Module[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [editingJson, setEditingJson] = useState('');
  const [editingType, setEditingType] = useState<'module' | 'test' | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const editingRef = useRef<HTMLDivElement | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'trainee'>('trainee');
  const [editingUserPassword, setEditingUserPassword] = useState('');
  // Friendly form state for modules/tests
  const [moduleForm, setModuleForm] = useState<{
    id?: string;
    title: Record<string, string>;
    description: Record<string, string>;
    icon: string;
    imageUrl?: string;
    steps: { id: string; type: string; title: Record<string, string>; content: Record<string, string>; imageUrl?: string; imageWidth?: string; imageHeight?: string; videoUrl?: string; questions?: any[] }[];
  }>({ title: {}, description: {}, icon: '', imageUrl: '', steps: [] });

  const [testForm, setTestForm] = useState<{
    id?: string;
    title: Record<string, string>;
    moduleId: string;
    questionIds: string[];
    timeLimitMinutes: number;
    passScore: number;
    questions?: any[];
  }>({ title: {}, moduleId: '', questionIds: [], timeLimitMinutes: 10, passScore: 70, questions: [] });
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [questionEditorVisible, setQuestionEditorVisible] = useState(false);
  const { language, setLanguage } = useLanguage();
  const languageKeys = Object.keys(languageNames) as Array<keyof typeof languageNames>;

  const [questionForm, setQuestionForm] = useState<{
    id?: string;
    moduleId: string;
    stepId?: string;
    text: Record<string, string>;
    type: 'single' | 'multi' | 'code' | 'fill';
    options: Record<string, string[]>;
    correct: number | number[] | string;
    difficulty: 'simple' | 'complex';
    imageUrl?: string;
    optionImages?: string[];
  }>({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple', imageUrl: '', optionImages: [] });

  const refreshQuestions = () => {
    setQuestionsList(getQuestions());
  };

  // Helper function to convert image file to base64
  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      // Limit file size to 500KB
      if (file.size > 500 * 1024) {
        toast({ title: 'Image too large', description: 'Please select an image smaller than 500KB' });
        reject(new Error('File too large'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const refreshQuestionsFor = (moduleId?: string, stepId?: string) => {
    if (moduleId && stepId) setQuestionsList(getQuestionsByModuleAndStep(moduleId, stepId));
    else if (moduleId) setQuestionsList(getQuestionsByModule(moduleId));
    else setQuestionsList(getQuestions());
  };

  useEffect(() => {
    setUsers(getUsers());
    setModules(getModules());
    setTests(getTests());
    setAttempts(getAttempts());
  }, []);

  useEffect(() => {
    refreshQuestions();
  }, []);

  const refresh = () => {
    setUsers(getUsers());
    setModules(getModules());
    setTests(getTests());
    setAttempts(getAttempts());
  };

  const showQuestionEditor = (moduleId?: string, stepId?: string, q?: any) => {
    if (moduleId) setQuestionForm(prev => ({ ...prev, moduleId }));
    if (stepId) setQuestionForm(prev => ({ ...prev, stepId }));
    // load questions for this module/step context
    refreshQuestionsFor(moduleId, stepId);
    startEditQuestion(q);
    setQuestionEditorVisible(true);
    setTimeout(() => editingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      toast({ title: 'Missing fields', description: 'Provide username and password' });
      return;
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(newPassword);

    const u: User = {
      id,
      username: newUsername,
      passwordHash,
      role: newRole,
      createdAt: new Date().toISOString(),
    };

    saveUser(u);
    addAuditLog({ userId: user?.id ?? 'system', action: 'create', entityType: 'user', entityId: u.id, details: JSON.stringify({ username: u.username, role: u.role }) });
    setNewUsername('');
    setNewPassword('');
    refresh();
    toast({ title: 'User created', description: `${u.username} (${u.role})` });
  };

  const handleDeleteUser = (id: string) => {
    if (user?.id === id) {
      toast({ title: 'Action blocked', description: 'You cannot delete your own account' });
      return;
    }
    const deleted = getUsers().find(u => u.id === id);
    deleteUser(id);
    addAuditLog({ userId: user?.id ?? 'system', action: 'delete', entityType: 'user', entityId: id, details: JSON.stringify({ username: deleted?.username, role: deleted?.role }) });
    refresh();
    toast({ title: 'User deleted' });
  };

  const handleResetAttempt = (attemptId: string) => {
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return;

    deleteAttempt(attemptId);
    addAuditLog({
      userId: user?.id ?? 'system',
      action: 'delete',
      entityType: 'test',
      entityId: attempt.testId,
      details: JSON.stringify({ action: 'reset_attempt', userId: attempt.userId, attemptId })
    });
    refresh();
    toast({ title: 'Test attempt reset', description: 'User can now retake the test' });
  };

  const startEdit = (type: 'module' | 'test', id?: string) => {
    // load questions for test form
    setQuestionsList(getQuestions());

    if (type === 'module') {
      const item = id ? getModules().find(m => m.id === id) : undefined;
      if (item) {
        setModuleForm({
          id: item.id,
          title: item.title || {},
          description: item.description || {},
          icon: item.icon ?? '',
          imageUrl: item.imageUrl ?? '',
          steps: item.steps.map(s => {
            const stepQuestions = s.id ? getQuestionsByModuleAndStep(item.id, s.id) : [];
            return {
              id: s.id,
              type: s.type,
              title: s.title || {},
              content: s.content || {},
              imageUrl: s.imageUrl ?? '',
              imageWidth: s.imageWidth ?? '',
              imageHeight: s.imageHeight ?? '',
              videoUrl: s.videoUrl ?? '',
              questions: stepQuestions
            };
          }),
        });
      } else {
        setModuleForm({ title: {}, description: {}, icon: '', imageUrl: '', steps: [] });
      }
      setIsModuleDialogOpen(true);
    } else {
      const item = id ? getTests().find(t => t.id === id) : undefined;
      if (item) {
        // Load questions for this test
        const testQuestions = item.questionIds.map(qId => getQuestions().find((q: any) => q.id === qId)).filter(Boolean);
        setTestForm({
          id: item.id,
          title: item.title || {},
          moduleId: item.moduleId ?? '',
          questionIds: item.questionIds ?? [],
          timeLimitMinutes: item.timeLimitMinutes ?? 10,
          passScore: item.passScore ?? 70,
          questions: testQuestions,
        });
      } else {
        setTestForm({ title: {}, moduleId: '', questionIds: [], timeLimitMinutes: 10, passScore: 70, questions: [] });
      }
      setIsTestDialogOpen(true);
    }
  };

  const saveEditing = () => {
    // JSON editor is deprecated in favor of the friendly form UI.
    toast({ title: 'Use the form to save modules/tests' });
  };

  // Save module from form
  const saveModuleFromForm = () => {
    try {
      const m: Module = {
        id: moduleForm.id ?? crypto.randomUUID(),
        title: moduleForm.title,
        description: moduleForm.description,
        icon: moduleForm.icon,
        imageUrl: moduleForm.imageUrl,
        steps: moduleForm.steps.map(s => ({
          id: s.id || crypto.randomUUID(),
          type: s.type as any,
          title: s.title,
          content: s.content && Object.keys(s.content).length > 0 ? s.content : undefined,
          imageUrl: s.imageUrl || undefined,
          imageWidth: s.imageWidth || undefined,
          imageHeight: s.imageHeight || undefined,
          videoUrl: s.videoUrl || undefined,
        })),
      };

      console.log('Saving module with imageUrl:', m.imageUrl, 'and steps:', m.steps.map(s => ({ id: s.id, imageUrl: s.imageUrl })));

      const exists = Boolean(getModules().find(mm => mm.id === m.id));
      saveModule(m);
      addAuditLog({ userId: user?.id ?? 'system', action: exists ? 'update' : 'create', entityType: 'module', entityId: m.id, details: JSON.stringify({ title: m.title }) });
      toast({ title: 'Module saved successfully' });
      setIsModuleDialogOpen(false);
      refresh();
    } catch (error) {
      console.error('Save error:', error);
      if (error instanceof Error && error.message.includes('quota')) {
        toast({
          title: 'Storage limit exceeded',
          description: 'Module has too much data. Use YouTube links for videos instead of uploads.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Failed to save module',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive'
        });
      }
    }
  };

  const addModuleStep = () => {
    setModuleForm(prev => ({ ...prev, steps: [...prev.steps, { id: crypto.randomUUID(), type: 'content', title: {}, content: {}, questions: [] }] }));
  };

  const removeModuleStep = (id: string) => {
    setModuleForm(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }));
  };

  // Save test from form
  const saveTestFromForm = () => {
    const tt: Test = {
      id: testForm.id ?? crypto.randomUUID(),
      title: testForm.title,
      moduleId: testForm.moduleId,
      questionIds: (testForm.questions || []).map((q: any) => q.id),
      timeLimitMinutes: testForm.timeLimitMinutes,
      passScore: testForm.passScore,
    };
    const exists = Boolean(getTests().find(t => t.id === tt.id));
    saveTest(tt);
    addAuditLog({ userId: user?.id ?? 'system', action: exists ? 'update' : 'create', entityType: 'test', entityId: tt.id, details: JSON.stringify({ title: tt.title, moduleId: tt.moduleId }) });
    toast({ title: 'Test saved' });
    setIsTestDialogOpen(false);
    refresh();
  };

  // Questions handlers
  const startEditQuestion = (q?: any) => {
    if (!q) {
      setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple', imageUrl: '', optionImages: [] });
      return;
    }
    setQuestionForm({
      id: q.id,
      moduleId: q.moduleId,
      text: q.text || {},
      type: q.type,
      options: q.options || {},
      correct: q.answer ?? 0,
      difficulty: q.difficulty ?? 'simple',
      imageUrl: q.imageUrl ?? '',
      optionImages: q.optionImages ?? [],
    });
    setTimeout(() => editingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const saveQuestionFromForm = () => {
    // build Question
    const q = {
      id: questionForm.id ?? crypto.randomUUID(),
      moduleId: questionForm.moduleId,
      stepId: questionForm.stepId,
      text: questionForm.text,
      type: questionForm.type,
      options: Object.keys(questionForm.options).length ? questionForm.options : undefined,
      answer: questionForm.correct,
      difficulty: questionForm.difficulty,
      imageUrl: questionForm.imageUrl,
      optionImages: questionForm.optionImages,
    } as any;

    saveQuestion(q);
    addAuditLog({ userId: user?.id ?? 'system', action: questionForm.id ? 'update' : 'create', entityType: 'question', entityId: q.id, details: JSON.stringify({ text: q.text }) });
    toast({ title: 'Question saved' });
    setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple', imageUrl: '', optionImages: [] });
    refreshQuestionsFor(q.moduleId, q.stepId);
  };

  const handleDeleteQuestion = (id: string) => {
    const existing = getQuestions().find((x: any) => x.id === id);
    deleteQuestion(id);
    addAuditLog({ userId: user?.id ?? 'system', action: 'delete', entityType: 'question', entityId: id, details: JSON.stringify({ text: existing?.text }) });
    toast({ title: 'Question deleted' });
    refreshQuestions();
  };

  const startEditUser = (u: User) => {
    setEditingUserId(u.id);
    setEditingUserRole(u.role);
    setEditingUserPassword('');
    setTimeout(() => editingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const saveUserEdits = async () => {
    if (!editingUserId) return;
    const existing = getUsers().find(x => x.id === editingUserId);
    if (!existing) return;

    const updated: User = { ...existing, role: editingUserRole };
    if (editingUserPassword) {
      updated.passwordHash = await hashPassword(editingUserPassword);
    }

    saveUser(updated);
    addAuditLog({ userId: user?.id ?? 'system', action: 'update', entityType: 'user', entityId: updated.id, details: JSON.stringify({ username: updated.username, role: updated.role }) });
    setEditingUserId(null);
    setEditingUserPassword('');
    refresh();
    toast({ title: 'User updated' });
  };

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Access denied. Admins only.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>


        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Modules</h2>
          <div className="grid gap-3 mb-3">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => startEdit('module')}>Create Module</Button>
            </div>

            {modules.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 card-elevated">
                <div>
                  <div className="font-medium">{t(m.title)}</div>
                  <div className="text-xs text-muted-foreground">{m.id}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit('module', m.id)}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Tests</h2>
          <div className="grid gap-3 mb-3">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => startEdit('test')}>Create Test</Button>
            </div>

            {tests.map(tst => (
              <div key={tst.id} className="flex items-center justify-between p-3 card-elevated">
                <div>
                  <div className="font-medium">{t(tst.title)}</div>
                  <div className="text-xs text-muted-foreground">{tst.id}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit('test', tst.id)}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Module Editor Dialog */}
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{moduleForm.id ? 'Edit Module' : 'Create Module'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Module Title (all languages)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const englishTitle = moduleForm.title.en || '';
                      if (!englishTitle.trim()) {
                        toast({ title: 'Please enter English title first', variant: 'destructive' });
                        return;
                      }
                      try {
                        toast({ title: 'Translating...', description: 'Please wait' });
                        const translations = await translateToAllLanguages(englishTitle);
                        setModuleForm(prev => ({
                          ...prev,
                          title: {
                            ...prev.title,
                            ta: translations.ta,
                            hi: translations.hi,
                            te: translations.te,
                          }
                        }));
                        toast({ title: 'Translation complete!' });
                      } catch (error) {
                        toast({ title: 'Translation failed', description: 'Please try again', variant: 'destructive' });
                      }
                    }}
                  >
                    🌐 Translate Title
                  </Button>
                </div>
                <div className="grid gap-2">
                  {languageKeys.map((lk) => (
                    <Input key={lk} placeholder={`Title (${languageNames[lk]})`} value={moduleForm.title[lk] ?? ''} onChange={(e) => setModuleForm(prev => ({ ...prev, title: { ...prev.title, [lk]: (e.target as HTMLInputElement).value } }))} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Module Description (all languages)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const englishDesc = moduleForm.description.en || '';
                      if (!englishDesc.trim()) {
                        toast({ title: 'Please enter English description first', variant: 'destructive' });
                        return;
                      }
                      try {
                        toast({ title: 'Translating...', description: 'Please wait' });
                        const translations = await translateToAllLanguages(englishDesc);
                        setModuleForm(prev => ({
                          ...prev,
                          description: {
                            ...prev.description,
                            ta: translations.ta,
                            hi: translations.hi,
                            te: translations.te,
                          }
                        }));
                        toast({ title: 'Translation complete!' });
                      } catch (error) {
                        toast({ title: 'Translation failed', description: 'Please try again', variant: 'destructive' });
                      }
                    }}
                  >
                    🌐 Translate Description
                  </Button>
                </div>
                <div className="grid gap-2">
                  {languageKeys.map((lk) => (
                    <Textarea key={lk} placeholder={`Description (${languageNames[lk]})`} value={moduleForm.description[lk] ?? ''} onChange={(e) => setModuleForm(prev => ({ ...prev, description: { ...prev.description, [lk]: (e.target as HTMLTextAreaElement).value } }))} />
                  ))}
                </div>
              </div>

              <div>
                <Label>Icon (Select or use Module Image below)</Label>
                <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg bg-muted/30">
                  {['Shield', 'BookOpen', 'AlertTriangle', 'Zap', 'Heart', 'Star', 'Award', 'Target', 'Lightbulb', 'Briefcase', 'Tool', 'HardHat'].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setModuleForm(prev => ({ ...prev, icon: iconName }))}
                      className={`p-3 rounded-lg border-2 transition-all ${moduleForm.icon === iconName
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                        }`}
                      title={iconName}
                    >
                      {iconName === 'Shield' && <Shield className="w-6 h-6 mx-auto" />}
                      {iconName === 'BookOpen' && <BookOpen className="w-6 h-6 mx-auto" />}
                      {iconName === 'AlertTriangle' && <AlertTriangle className="w-6 h-6 mx-auto" />}
                      {iconName === 'Zap' && <Zap className="w-6 h-6 mx-auto" />}
                      {iconName === 'Heart' && <Heart className="w-6 h-6 mx-auto" />}
                      {iconName === 'Star' && <Star className="w-6 h-6 mx-auto" />}
                      {iconName === 'Award' && <Award className="w-6 h-6 mx-auto" />}
                      {iconName === 'Target' && <Target className="w-6 h-6 mx-auto" />}
                      {iconName === 'Lightbulb' && <Lightbulb className="w-6 h-6 mx-auto" />}
                      {iconName === 'Briefcase' && <Briefcase className="w-6 h-6 mx-auto" />}
                      {iconName === 'Tool' && <Wrench className="w-6 h-6 mx-auto" />}
                      {iconName === 'HardHat' && <HardHat className="w-6 h-6 mx-auto" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {moduleForm.icon || 'None'} • Upload an image below to use as custom icon
                </p>
              </div>

              <div>
                <Label>Module Icon Image Upload (Overrides icon selection)</Label>
                <p className="text-xs text-muted-foreground mb-2">This image will be used as the module icon on cards</p>
                <div className="flex gap-2">
                  <Input placeholder="https://example.com/icon.jpg" value={moduleForm.imageUrl || ''} onChange={(e) => setModuleForm(prev => ({ ...prev, imageUrl: (e.target as HTMLInputElement).value }))} />
                  <Button type="button" variant="outline" onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        try {
                          const base64 = await handleImageUpload(file);
                          setModuleForm(prev => ({ ...prev, imageUrl: base64 }));
                          toast({ title: 'Image uploaded successfully' });
                        } catch (error) {
                          toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                        }
                      }
                    };
                    input.click();
                  }}>Upload</Button>
                </div>
                {moduleForm.imageUrl && (
                  <div className="mt-2">
                    <img src={moduleForm.imageUrl} alt="Module preview" className="max-w-xs max-h-40 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <h3 className="font-medium mb-2">Steps</h3>
              <div className="space-y-3">
                {moduleForm.steps.map((s, idx) => (
                  <div key={s.id} className="p-3 card-elevated">
                    <div className="flex items-center gap-2 mb-2">
                      <select value={s.type} onChange={(e) => setModuleForm(prev => { const steps = [...prev.steps]; steps[idx].type = (e.target as HTMLSelectElement).value; return { ...prev, steps }; })} className="input w-40">
                        <option value="content">Content</option>
                        <option value="intro">Intro</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <Button variant="destructive" onClick={() => removeModuleStep(s.id)}>Remove</Button>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Step Title (all languages)</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const englishTitle = s.title.en || '';
                            if (!englishTitle.trim()) {
                              toast({ title: 'Please enter English title first', variant: 'destructive' });
                              return;
                            }
                            try {
                              toast({ title: 'Translating...' });
                              const translations = await translateToAllLanguages(englishTitle);
                              const steps = [...moduleForm.steps];
                              steps[idx].title = {
                                ...steps[idx].title,
                                ta: translations.ta,
                                hi: translations.hi,
                                te: translations.te,
                              };
                              setModuleForm(prev => ({ ...prev, steps }));
                              toast({ title: 'Translation complete!' });
                            } catch (error) {
                              toast({ title: 'Translation failed', variant: 'destructive' });
                            }
                          }}
                        >
                          🌐 Translate
                        </Button>
                      </div>
                      <div className="grid gap-2 mt-1">
                        {languageKeys.map((lk) => (
                          <Input
                            key={lk}
                            placeholder={`${languageNames[lk]}`}
                            value={s.title[lk] ?? ''}
                            onChange={(e) => {
                              const steps = [...moduleForm.steps];
                              steps[idx].title = { ...steps[idx].title, [lk]: (e.target as HTMLInputElement).value };
                              setModuleForm(prev => ({ ...prev, steps }));
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {s.type !== 'quiz' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Content (all languages)</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const englishContent = s.content.en || '';
                              if (!englishContent.trim()) {
                                toast({ title: 'Please enter English content first', variant: 'destructive' });
                                return;
                              }
                              try {
                                toast({ title: 'Translating...' });
                                const translations = await translateToAllLanguages(englishContent);
                                const steps = [...moduleForm.steps];
                                steps[idx].content = {
                                  ...steps[idx].content,
                                  ta: translations.ta,
                                  hi: translations.hi,
                                  te: translations.te,
                                };
                                setModuleForm(prev => ({ ...prev, steps }));
                                toast({ title: 'Translation complete!' });
                              } catch (error) {
                                toast({ title: 'Translation failed', variant: 'destructive' });
                              }
                            }}
                          >
                            🌐 Translate
                          </Button>
                        </div>
                        <div className="grid gap-4 mt-1">
                          {languageKeys.map((lk) => (
                            <div key={lk}>
                              <Label className="text-xs text-muted-foreground mb-1">{languageNames[lk]}</Label>
                              <RichTextEditor
                                value={htmlToMarkdown(s.content[lk] ?? '')}
                                onChange={(markdown) => {
                                  const steps = [...moduleForm.steps];
                                  steps[idx].content = { ...steps[idx].content, [lk]: markdownToHtml(markdown) };
                                  setModuleForm(prev => ({ ...prev, steps }));
                                }}
                                placeholder={`Enter ${languageNames[lk]} content...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm">Step Image</Label>
                      <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1">Image URL or Upload</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://example.com/step-image.jpg"
                              value={s.imageUrl || ''}
                              onChange={(e) => {
                                const steps = [...moduleForm.steps];
                                steps[idx].imageUrl = (e.target as HTMLInputElement).value;
                                setModuleForm(prev => ({ ...prev, steps }));
                              }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  try {
                                    const base64 = await handleImageUpload(file);
                                    const steps = [...moduleForm.steps];
                                    steps[idx].imageUrl = base64;
                                    setModuleForm(prev => ({ ...prev, steps }));
                                    toast({ title: 'Image uploaded' });
                                  } catch (error) {
                                    toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                                  }
                                }
                              };
                              input.click();
                            }}>Upload</Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1">Width (optional)</Label>
                            <Input
                              placeholder="e.g. 50% or 300px"
                              value={s.imageWidth || ''}
                              onChange={(e) => {
                                const steps = [...moduleForm.steps];
                                steps[idx].imageWidth = (e.target as HTMLInputElement).value;
                                setModuleForm(prev => ({ ...prev, steps }));
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1">Height (optional)</Label>
                            <Input
                              placeholder="e.g. 200px"
                              value={s.imageHeight || ''}
                              onChange={(e) => {
                                const steps = [...moduleForm.steps];
                                steps[idx].imageHeight = (e.target as HTMLInputElement).value;
                                setModuleForm(prev => ({ ...prev, steps }));
                              }}
                            />
                          </div>
                        </div>

                        {s.imageUrl && (
                          <div className="mt-2 text-center text-xs text-muted-foreground">
                            <p className="mb-2">Preview (with applied size)</p>
                            <div className="border rounded p-2 bg-background inline-block">
                              <img
                                src={s.imageUrl}
                                alt="Step preview"
                                style={{
                                  width: s.imageWidth || 'auto',
                                  height: s.imageHeight || 'auto',
                                  maxWidth: '100%'
                                }}
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video URL for Video Steps */}
                    {s.type === 'video' && (
                      <div>
                        <Label className="text-sm">Video URL (YouTube or Upload)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://www.youtube.com/watch?v=... or upload video"
                            value={s.videoUrl || ''}
                            onChange={(e) => {
                              const steps = [...moduleForm.steps];
                              steps[idx].videoUrl = (e.target as HTMLInputElement).value;
                              setModuleForm(prev => ({ ...prev, steps }));
                            }}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'video/*';
                            input.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                // Check file size (max 5MB for video to prevent storage issues)
                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: 'File too large',
                                    description: 'Maximum video size is 5MB. For larger videos, please use a YouTube link instead.',
                                    variant: 'destructive'
                                  });
                                  return;
                                }
                                try {
                                  toast({ title: 'Uploading video...', description: 'Please wait' });
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64 = reader.result as string;
                                    const steps = [...moduleForm.steps];
                                    steps[idx].videoUrl = base64;
                                    setModuleForm(prev => ({ ...prev, steps }));
                                    toast({ title: 'Video uploaded successfully' });
                                  };
                                  reader.onerror = () => {
                                    toast({ title: 'Upload failed', description: 'Could not read video file', variant: 'destructive' });
                                  };
                                  reader.readAsDataURL(file);
                                } catch (error) {
                                  toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                                }
                              }
                            };
                            input.click();
                          }}>Upload Video</Button>
                        </div>
                        {s.videoUrl && (
                          <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                            {s.videoUrl.startsWith('data:') ? (
                              <span>✓ Video uploaded (embedded)</span>
                            ) : s.videoUrl.includes('youtube.com') || s.videoUrl.includes('youtu.be') ? (
                              <span>✓ YouTube: {s.videoUrl}</span>
                            ) : (
                              <span>✓ Video URL: {s.videoUrl}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inline Question Editor for Quiz Steps */}
                    {s.type === 'quiz' && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-md">
                        <h4 className="font-medium mb-2 text-sm">Quiz Questions</h4>

                        {/* List existing questions */}
                        <div className="space-y-2 mb-3">
                          {(s.questions || []).map((q: any, qIdx: number) => (
                            <div key={q.id || qIdx} className="flex items-center justify-between p-2 bg-background rounded border">
                              <div className="flex-1">
                                <div className="text-sm font-medium">{q.text?.en || 'Untitled Question'}</div>
                                <div className="text-xs text-muted-foreground">{q.type} • {q.difficulty}</div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => {
                                  // Edit question inline
                                  setQuestionForm({
                                    id: q.id,
                                    moduleId: moduleForm.id || '',
                                    stepId: s.id,
                                    text: q.text || {},
                                    type: q.type,
                                    options: q.options || {},
                                    correct: q.answer ?? 0,
                                    difficulty: q.difficulty ?? 'simple',
                                    imageUrl: q.imageUrl ?? '',
                                    optionImages: q.optionImages ?? [],
                                  });
                                }}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  // Remove question
                                  if (q.id) deleteQuestion(q.id);
                                  setModuleForm(prev => {
                                    const steps = [...prev.steps];
                                    steps[idx].questions = (steps[idx].questions || []).filter((_, i) => i !== qIdx);
                                    return { ...prev, steps };
                                  });
                                }}>Delete</Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add new question button */}
                        <Button size="sm" variant="outline" onClick={() => {
                          setQuestionForm({
                            moduleId: moduleForm.id || '',
                            stepId: s.id,
                            text: {},
                            type: 'single',
                            options: {},
                            correct: 0,
                            difficulty: 'simple',
                          });
                        }}>+ Add Question</Button>

                        {/* Inline question form */}
                        {questionForm.stepId === s.id && (
                          <div className="mt-3 p-3 border rounded-md bg-background">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                              <select className="input" value={questionForm.type} onChange={(e) => setQuestionForm(prev => ({ ...prev, type: (e.target as HTMLSelectElement).value as any }))}>
                                <option value="single">Single choice</option>
                                <option value="multi">Multiple choice</option>
                                <option value="fill">Fill</option>
                              </select>
                              <select className="input" value={questionForm.difficulty} onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: (e.target as HTMLSelectElement).value as any }))}>
                                <option value="simple">Simple</option>
                                <option value="complex">Complex</option>
                              </select>
                            </div>

                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium">Question Text</h5>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    const englishText = questionForm.text.en || '';
                                    if (!englishText.trim()) {
                                      toast({ title: 'Please enter English question first', variant: 'destructive' });
                                      return;
                                    }
                                    try {
                                      toast({ title: 'Translating...' });
                                      const translations = await translateToAllLanguages(englishText);
                                      setQuestionForm(prev => ({
                                        ...prev,
                                        text: {
                                          ...prev.text,
                                          ta: translations.ta,
                                          hi: translations.hi,
                                          te: translations.te,
                                        }
                                      }));
                                      toast({ title: 'Translation complete!' });
                                    } catch (error) {
                                      toast({ title: 'Translation failed', variant: 'destructive' });
                                    }
                                  }}
                                >
                                  🌐 Translate
                                </Button>
                              </div>
                              <div className="grid gap-2">
                                {languageKeys.map((lk) => (
                                  <Input key={lk} placeholder={`Question (${languageNames[lk]})`} value={questionForm.text[lk] ?? ''} onChange={(e) => setQuestionForm(prev => ({ ...prev, text: { ...prev.text, [lk]: (e.target as HTMLInputElement).value } }))} />
                                ))}
                              </div>
                            </div>

                            {/* Question Image */}
                            <div className="mb-3">
                              <Label className="text-sm">Question Image URL or Upload (optional)</Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="https://example.com/question-image.jpg"
                                  value={questionForm.imageUrl || ''}
                                  onChange={(e) => setQuestionForm(prev => ({ ...prev, imageUrl: (e.target as HTMLInputElement).value }))}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={async () => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      try {
                                        const base64 = await handleImageUpload(file);
                                        setQuestionForm(prev => ({ ...prev, imageUrl: base64 }));
                                        toast({ title: 'Image uploaded' });
                                      } catch (error) {
                                        toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                                      }
                                    }
                                  };
                                  input.click();
                                }}>Upload</Button>
                              </div>
                              {questionForm.imageUrl && (
                                <div className="mt-2">
                                  <img src={questionForm.imageUrl} alt="Question preview" className="max-w-xs max-h-32 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                              )}
                            </div>

                            {questionForm.type === 'single' || questionForm.type === 'multi' ? (
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-medium">Options</h5>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      const englishOptions = questionForm.options.en || [];
                                      if (!englishOptions.some(opt => opt && opt.trim())) {
                                        toast({ title: 'Please enter English options first', variant: 'destructive' });
                                        return;
                                      }
                                      try {
                                        toast({ title: 'Translating all options...', description: 'Please wait' });
                                        const translatedOptions: Record<string, string[]> = { ...questionForm.options };

                                        // Translate each option
                                        for (let i = 0; i < englishOptions.length; i++) {
                                          if (englishOptions[i] && englishOptions[i].trim()) {
                                            const translations = await translateToAllLanguages(englishOptions[i]);
                                            if (!translatedOptions.ta) translatedOptions.ta = [];
                                            if (!translatedOptions.hi) translatedOptions.hi = [];
                                            if (!translatedOptions.te) translatedOptions.te = [];
                                            translatedOptions.ta[i] = translations.ta;
                                            translatedOptions.hi[i] = translations.hi;
                                            translatedOptions.te[i] = translations.te;
                                          }
                                        }

                                        setQuestionForm(prev => ({ ...prev, options: translatedOptions }));
                                        toast({ title: 'All options translated!' });
                                      } catch (error) {
                                        toast({ title: 'Translation failed', variant: 'destructive' });
                                      }
                                    }}
                                  >
                                    🌐 Translate All Options
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {(() => {
                                    const optionCount = (Object.values(questionForm.options)[0] || []).length || 0;
                                    const rows = Math.max(optionCount, 1);
                                    return Array.from({ length: rows }).map((_, optIdx) => (
                                      <div key={optIdx} className="p-2 border rounded">
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center mb-2">
                                          <div className="col-span-1">
                                            {questionForm.type === 'single' ? (
                                              <input type="radio" name={`correct-${s.id}`} checked={questionForm.correct === optIdx} onChange={() => setQuestionForm(prev => ({ ...prev, correct: optIdx }))} />
                                            ) : (
                                              <input type="checkbox" checked={Array.isArray(questionForm.correct) ? (questionForm.correct as number[]).includes(optIdx) : false} onChange={(e) => {
                                                const checked = (e.target as HTMLInputElement).checked;
                                                setQuestionForm(prev => {
                                                  const prevArr = Array.isArray(prev.correct) ? [...(prev.correct as number[])] : [];
                                                  if (checked) prevArr.push(optIdx); else {
                                                    const pos = prevArr.indexOf(optIdx); if (pos >= 0) prevArr.splice(pos, 1);
                                                  }
                                                  return { ...prev, correct: prevArr };
                                                });
                                              }} />
                                            )}
                                          </div>
                                          {languageKeys.map((lk) => (
                                            <Input key={String(lk)} placeholder={`${languageNames[lk]}`} value={(questionForm.options[lk] || [])[optIdx] ?? ''} onChange={(e) => setQuestionForm(prev => {
                                              const opts = { ...prev.options } as Record<string, string[]>;
                                              opts[lk] = opts[lk] ? [...opts[lk]] : [];
                                              opts[lk][optIdx] = (e.target as HTMLInputElement).value;
                                              return { ...prev, options: opts };
                                            })} />
                                          ))}
                                          <Button size="sm" variant="destructive" onClick={() => {
                                            setQuestionForm(prev => {
                                              const opts = { ...prev.options } as Record<string, string[]>;
                                              for (const k of Object.keys(opts)) {
                                                opts[k] = opts[k].filter((_, i) => i !== optIdx);
                                              }
                                              const optImgs = [...(prev.optionImages || [])];
                                              optImgs.splice(optIdx, 1);
                                              let correct = prev.correct;
                                              if (typeof correct === 'number') {
                                                if (correct === optIdx) correct = 0; else if (correct > optIdx) correct = (correct as number) - 1;
                                              } else if (Array.isArray(correct)) {
                                                correct = (correct as number[]).filter(c => c !== optIdx).map(c => c > optIdx ? c - 1 : c);
                                              }
                                              return { ...prev, options: opts, optionImages: optImgs, correct };
                                            });
                                          }}>×</Button>
                                        </div>
                                        {/* Option Image URL */}
                                        <div className="mt-2">
                                          <div className="flex gap-2">
                                            <Input
                                              placeholder="Option Image URL or Upload (optional)"
                                              value={(questionForm.optionImages || [])[optIdx] || ''}
                                              onChange={(e) => setQuestionForm(prev => {
                                                const imgs = [...(prev.optionImages || [])];
                                                imgs[optIdx] = (e.target as HTMLInputElement).value;
                                                return { ...prev, optionImages: imgs };
                                              })}
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={async () => {
                                              const input = document.createElement('input');
                                              input.type = 'file';
                                              input.accept = 'image/*';
                                              input.onchange = async (e) => {
                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                if (file) {
                                                  try {
                                                    const base64 = await handleImageUpload(file);
                                                    setQuestionForm(prev => {
                                                      const imgs = [...(prev.optionImages || [])];
                                                      imgs[optIdx] = base64;
                                                      return { ...prev, optionImages: imgs };
                                                    });
                                                    toast({ title: 'Image uploaded' });
                                                  } catch (error) {
                                                    toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                                                  }
                                                }
                                              };
                                              input.click();
                                            }}>Upload</Button>
                                          </div>
                                          {(questionForm.optionImages || [])[optIdx] && (
                                            <img src={(questionForm.optionImages || [])[optIdx]} alt={`Option ${optIdx + 1}`} className="mt-1 max-w-xs max-h-24 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                          )}
                                        </div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                                <Button size="sm" className="mt-2" onClick={() => {
                                  setQuestionForm(prev => {
                                    const opts = { ...prev.options } as Record<string, string[]>;
                                    for (const k of languageKeys) {
                                      opts[k] = opts[k] ? [...opts[k], ''] : [''];
                                    }
                                    return { ...prev, options: opts };
                                  });
                                }}>+ Add Option</Button>
                              </div>
                            ) : null}

                            {/* Fill in the blank answer */}
                            {questionForm.type === 'fill' && (
                              <div className="mb-3">
                                <Label className="text-sm">Correct Answer</Label>
                                <Input
                                  placeholder="Enter the correct answer (e.g., MSDS, Safety Data Sheet)"
                                  value={questionForm.correct as string || ''}
                                  onChange={(e) => setQuestionForm(prev => ({ ...prev, correct: (e.target as HTMLInputElement).value }))}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Answer matching is case-insensitive and allows minor spelling variations
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button size="sm" onClick={() => {
                                // Save question
                                const q = {
                                  id: questionForm.id ?? crypto.randomUUID(),
                                  moduleId: moduleForm.id || '',
                                  stepId: s.id,
                                  text: questionForm.text,
                                  type: questionForm.type,
                                  options: Object.keys(questionForm.options).length ? questionForm.options : undefined,
                                  answer: questionForm.correct,
                                  difficulty: questionForm.difficulty,
                                  imageUrl: questionForm.imageUrl,
                                  optionImages: questionForm.optionImages,
                                };
                                saveQuestion(q);
                                addAuditLog({ userId: user?.id ?? 'system', action: questionForm.id ? 'update' : 'create', entityType: 'question', entityId: q.id, details: JSON.stringify({ text: q.text }) });
                                toast({ title: 'Question saved' });

                                // Update the step's questions list
                                setModuleForm(prev => {
                                  const steps = [...prev.steps];
                                  const existingIdx = (steps[idx].questions || []).findIndex((qq: any) => qq.id === q.id);
                                  if (existingIdx >= 0) {
                                    steps[idx].questions![existingIdx] = q;
                                  } else {
                                    steps[idx].questions = [...(steps[idx].questions || []), q];
                                  }
                                  return { ...prev, steps };
                                });

                                // Clear form
                                setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple' });
                              }}>Save Question</Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple' });
                              }}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Button onClick={addModuleStep}>Add Step</Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveModuleFromForm}>Save Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Editor Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{testForm.id ? 'Edit Test' : 'Create Test'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-medium mb-2">Test Title (all languages)</h3>
                <div className="grid gap-2">
                  {languageKeys.map((lk) => (
                    <Input key={lk} placeholder={`Title (${languageNames[lk]})`} value={testForm.title[lk] ?? ''} onChange={(e) => setTestForm(prev => ({ ...prev, title: { ...prev.title, [lk]: (e.target as HTMLInputElement).value } }))} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Module</Label>
                  <select className="input" value={testForm.moduleId} onChange={(e) => setTestForm(prev => ({ ...prev, moduleId: (e.target as HTMLSelectElement).value }))}>
                    <option value="">Select module</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.title?.en ?? m.id}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Time Limit (minutes)</Label>
                  <Input type="number" placeholder="Time limit (minutes)" value={String(testForm.timeLimitMinutes)} onChange={(e) => setTestForm(prev => ({ ...prev, timeLimitMinutes: Number(e.target.value) || 0 }))} />
                </div>
                <div>
                  <Label>Pass Score (%)</Label>
                  <Input type="number" placeholder="Pass score (%)" value={String(testForm.passScore)} onChange={(e) => setTestForm(prev => ({ ...prev, passScore: Number(e.target.value) || 0 }))} />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="font-medium mb-2">Test Questions</h3>

              {/* List existing questions */}
              <div className="space-y-2 mb-3">
                {(testForm.questions || []).map((q: any, qIdx: number) => (
                  <div key={q.id || qIdx} className="flex items-center justify-between p-2 bg-muted/10 rounded border">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{q.text?.en || 'Untitled Question'}</div>
                      <div className="text-xs text-muted-foreground">{q.type} • {q.difficulty}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => {
                        // Edit question inline
                        setQuestionForm({
                          id: q.id,
                          moduleId: testForm.moduleId || '',
                          stepId: undefined,
                          text: q.text || {},
                          type: q.type,
                          options: q.options || {},
                          correct: q.answer ?? 0,
                          difficulty: q.difficulty ?? 'simple',
                          imageUrl: q.imageUrl ?? '',
                          optionImages: q.optionImages ?? [],
                        });
                      }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => {
                        // Remove question
                        if (q.id) deleteQuestion(q.id);
                        setTestForm(prev => ({
                          ...prev,
                          questions: (prev.questions || []).filter((_, i) => i !== qIdx)
                        }));
                      }}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new question button */}
              <Button size="sm" variant="outline" onClick={() => {
                setQuestionForm({
                  moduleId: testForm.moduleId || '',
                  stepId: undefined,
                  text: {},
                  type: 'single',
                  options: {},
                  correct: 0,
                  difficulty: 'simple',
                });
              }}>+ Add Question</Button>

              {/* Inline question form - show when moduleId matches and stepId is undefined (for tests) */}
              {questionForm.moduleId === testForm.moduleId && !questionForm.stepId && (
                <div className="mt-3 p-3 border rounded-md bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <select className="input" value={questionForm.type} onChange={(e) => setQuestionForm(prev => ({ ...prev, type: (e.target as HTMLSelectElement).value as any }))}>
                      <option value="single">Single choice</option>
                      <option value="multi">Multiple choice</option>
                      <option value="fill">Fill</option>
                    </select>
                    <select className="input" value={questionForm.difficulty} onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: (e.target as HTMLSelectElement).value as any }))}>
                      <option value="simple">Simple</option>
                      <option value="complex">Complex</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium">Question Text</h5>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const englishText = questionForm.text.en || '';
                          if (!englishText.trim()) {
                            toast({ title: 'Please enter English question first', variant: 'destructive' });
                            return;
                          }
                          try {
                            toast({ title: 'Translating...' });
                            const translations = await translateToAllLanguages(englishText);
                            setQuestionForm(prev => ({
                              ...prev,
                              text: {
                                ...prev.text,
                                ta: translations.ta,
                                hi: translations.hi,
                                te: translations.te,
                              }
                            }));
                            toast({ title: 'Translation complete!' });
                          } catch (error) {
                            toast({ title: 'Translation failed', variant: 'destructive' });
                          }
                        }}
                      >
                        🌐 Translate
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {languageKeys.map((lk) => (
                        <Input key={lk} placeholder={`Question (${languageNames[lk]})`} value={questionForm.text[lk] ?? ''} onChange={(e) => setQuestionForm(prev => ({ ...prev, text: { ...prev.text, [lk]: (e.target as HTMLInputElement).value } }))} />
                      ))}
                    </div>
                  </div>

                  {/* Question Image */}
                  <div className="mb-3">
                    <Label className="text-sm">Question Image URL or Upload (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/question-image.jpg"
                        value={questionForm.imageUrl || ''}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, imageUrl: (e.target as HTMLInputElement).value }))}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={async () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            try {
                              const base64 = await handleImageUpload(file);
                              setQuestionForm(prev => ({ ...prev, imageUrl: base64 }));
                              toast({ title: 'Image uploaded' });
                            } catch (error) {
                              toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                            }
                          }
                        };
                        input.click();
                      }}>Upload</Button>
                    </div>
                    {questionForm.imageUrl && (
                      <div className="mt-2">
                        <img src={questionForm.imageUrl} alt="Question preview" className="max-w-xs max-h-32 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                  </div>

                  {questionForm.type === 'single' || questionForm.type === 'multi' ? (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium">Options</h5>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const englishOptions = questionForm.options.en || [];
                            if (!englishOptions.some(opt => opt && opt.trim())) {
                              toast({ title: 'Please enter English options first', variant: 'destructive' });
                              return;
                            }
                            try {
                              toast({ title: 'Translating all options...', description: 'Please wait' });
                              const translatedOptions: Record<string, string[]> = { ...questionForm.options };

                              // Translate each option
                              for (let i = 0; i < englishOptions.length; i++) {
                                if (englishOptions[i] && englishOptions[i].trim()) {
                                  const translations = await translateToAllLanguages(englishOptions[i]);
                                  if (!translatedOptions.ta) translatedOptions.ta = [];
                                  if (!translatedOptions.hi) translatedOptions.hi = [];
                                  if (!translatedOptions.te) translatedOptions.te = [];
                                  translatedOptions.ta[i] = translations.ta;
                                  translatedOptions.hi[i] = translations.hi;
                                  translatedOptions.te[i] = translations.te;
                                }
                              }

                              setQuestionForm(prev => ({ ...prev, options: translatedOptions }));
                              toast({ title: 'All options translated!' });
                            } catch (error) {
                              toast({ title: 'Translation failed', variant: 'destructive' });
                            }
                          }}
                        >
                          🌐 Translate All Options
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(() => {
                          const optionCount = (Object.values(questionForm.options)[0] || []).length || 0;
                          const rows = Math.max(optionCount, 1);
                          return Array.from({ length: rows }).map((_, optIdx) => (
                            <div key={optIdx} className="p-2 border rounded">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                <div className="col-span-1">
                                  {questionForm.type === 'single' ? (
                                    <input type="radio" name="test-correct" checked={questionForm.correct === optIdx} onChange={() => setQuestionForm(prev => ({ ...prev, correct: optIdx }))} />
                                  ) : (
                                    <input type="checkbox" checked={Array.isArray(questionForm.correct) ? (questionForm.correct as number[]).includes(optIdx) : false} onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      setQuestionForm(prev => {
                                        const prevArr = Array.isArray(prev.correct) ? [...(prev.correct as number[])] : [];
                                        if (checked) prevArr.push(optIdx); else {
                                          const pos = prevArr.indexOf(optIdx); if (pos >= 0) prevArr.splice(pos, 1);
                                        }
                                        return { ...prev, correct: prevArr };
                                      });
                                    }} />
                                  )}
                                </div>
                                {languageKeys.map((lk) => (
                                  <Input key={String(lk)} placeholder={`${languageNames[lk]}`} value={(questionForm.options[lk] || [])[optIdx] ?? ''} onChange={(e) => setQuestionForm(prev => {
                                    const opts = { ...prev.options } as Record<string, string[]>;
                                    opts[lk] = opts[lk] ? [...opts[lk]] : [];
                                    opts[lk][optIdx] = (e.target as HTMLInputElement).value;
                                    return { ...prev, options: opts };
                                  })} />
                                ))}
                                <Button size="sm" variant="destructive" onClick={() => {
                                  setQuestionForm(prev => {
                                    const opts = { ...prev.options } as Record<string, string[]>;
                                    for (const k of Object.keys(opts)) {
                                      opts[k] = opts[k].filter((_, i) => i !== optIdx);
                                    }
                                    const optImgs = [...(prev.optionImages || [])];
                                    optImgs.splice(optIdx, 1);
                                    let correct = prev.correct;
                                    if (typeof correct === 'number') {
                                      if (correct === optIdx) correct = 0; else if (correct > optIdx) correct = (correct as number) - 1;
                                    } else if (Array.isArray(correct)) {
                                      correct = (correct as number[]).filter(c => c !== optIdx).map(c => c > optIdx ? c - 1 : c);
                                    }
                                    return { ...prev, options: opts, optionImages: optImgs, correct };
                                  });
                                }}>×</Button>
                              </div>
                              {/* Option Image */}
                              <div className="mt-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Option Image URL or Upload (optional)"
                                    value={(questionForm.optionImages || [])[optIdx] || ''}
                                    onChange={(e) => setQuestionForm(prev => {
                                      const imgs = [...(prev.optionImages || [])];
                                      imgs[optIdx] = (e.target as HTMLInputElement).value;
                                      return { ...prev, optionImages: imgs };
                                    })}
                                  />
                                  <Button type="button" variant="outline" size="sm" onClick={async () => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = async (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        try {
                                          const base64 = await handleImageUpload(file);
                                          setQuestionForm(prev => {
                                            const imgs = [...(prev.optionImages || [])];
                                            imgs[optIdx] = base64;
                                            return { ...prev, optionImages: imgs };
                                          });
                                          toast({ title: 'Image uploaded' });
                                        } catch (error) {
                                          toast({ title: 'Upload failed', description: (error as Error).message, variant: 'destructive' });
                                        }
                                      }
                                    };
                                    input.click();
                                  }}>Upload</Button>
                                </div>
                                {(questionForm.optionImages || [])[optIdx] && (
                                  <img src={(questionForm.optionImages || [])[optIdx]} alt={`Option ${optIdx + 1}`} className="mt-1 max-w-xs max-h-24 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                )}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      <Button size="sm" className="mt-2" onClick={() => {
                        setQuestionForm(prev => {
                          const opts = { ...prev.options } as Record<string, string[]>;
                          for (const k of languageKeys) {
                            opts[k] = opts[k] ? [...opts[k], ''] : [''];
                          }
                          return { ...prev, options: opts };
                        });
                      }}>+ Add Option</Button>
                    </div>
                  ) : null}

                  {/* Fill in the blank answer */}
                  {questionForm.type === 'fill' && (
                    <div className="mb-3 space-y-3">
                      <div>
                        <Label className="text-sm">Correct Answer</Label>
                        <Input
                          placeholder="Enter the correct answer (e.g., MSDS, Safety Data Sheet)"
                          value={questionForm.correct as string || ''}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, correct: (e.target as HTMLInputElement).value }))}
                        />
                      </div>

                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={!(questionForm as any).caseSensitive}
                            onChange={(e) => setQuestionForm(prev => ({ ...prev, caseSensitive: !e.target.checked } as any))}
                          />
                          <span className="text-sm">Case-insensitive matching</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={(questionForm as any).allowSpelling !== false}
                            onChange={(e) => setQuestionForm(prev => ({ ...prev, allowSpelling: e.target.checked } as any))}
                          />
                          <span className="text-sm">Allow spelling mistakes</span>
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {(questionForm as any).caseSensitive
                          ? "✓ Exact case required"
                          : "✓ Case-insensitive"}
                        {" • "}
                        {(questionForm as any).allowSpelling !== false
                          ? "✓ Allows minor typos/spacing"
                          : "✓ Exact spelling required"}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => {
                      // Save question
                      const q = {
                        id: questionForm.id ?? crypto.randomUUID(),
                        moduleId: testForm.moduleId || '',
                        stepId: undefined,
                        text: questionForm.text,
                        type: questionForm.type,
                        options: Object.keys(questionForm.options).length ? questionForm.options : undefined,
                        answer: questionForm.correct,
                        difficulty: questionForm.difficulty,
                        imageUrl: questionForm.imageUrl,
                        optionImages: questionForm.optionImages,
                        caseSensitive: (questionForm as any).caseSensitive,
                        allowSpelling: (questionForm as any).allowSpelling,
                      };
                      saveQuestion(q);
                      addAuditLog({ userId: user?.id ?? 'system', action: questionForm.id ? 'update' : 'create', entityType: 'question', entityId: q.id, details: JSON.stringify({ text: q.text }) });
                      toast({ title: 'Question saved' });

                      // Update the test's questions list
                      setTestForm(prev => {
                        const existingIdx = (prev.questions || []).findIndex((qq: any) => qq.id === q.id);
                        if (existingIdx >= 0) {
                          const questions = [...(prev.questions || [])];
                          questions[existingIdx] = q;
                          return { ...prev, questions };
                        } else {
                          return { ...prev, questions: [...(prev.questions || []), q] };
                        }
                      });

                      // Clear form
                      setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple' });
                    }}>Save Question</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setQuestionForm({ moduleId: '', text: {}, type: 'single', options: {}, correct: 0, difficulty: 'simple' });
                    }}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveTestFromForm}>Save Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {editingUserId && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Edit User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input value={editingUserRole} onChange={(e) => setEditingUserRole((e.target as HTMLInputElement).value as any)} />
              <Input placeholder="New password (leave blank to keep)" value={editingUserPassword} onChange={(e) => setEditingUserPassword((e.target as HTMLInputElement).value)} />
              <div className="flex gap-2">
                <Button onClick={saveUserEdits}>Save</Button>
                <Button variant="outline" onClick={() => setEditingUserId(null)}>Cancel</Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout >
  );
}


