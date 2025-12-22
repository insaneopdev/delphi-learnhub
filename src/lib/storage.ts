// Storage adapter for localStorage (can be extended to server mode)

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'trainee';
  createdAt: string;
}

export interface Module {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  imageUrl?: string;
  steps: Step[];
}

export interface Step {
  id: string;
  type: 'intro' | 'video' | 'content' | 'quiz';
  title: Record<string, string>;
  content?: Record<string, string>;
  videoUrl?: string;
  imageUrl?: string;
  quiz?: QuizStep;
  testId?: string;
}

export interface QuizStep {
  question: Record<string, string>;
  options: Record<string, string[]>;
  correctIndex: number;
  hint?: Record<string, string>;
}

export interface Question {
  id: string;
  moduleId: string;
  stepId?: string;
  text: Record<string, string>;
  type: 'single' | 'multi' | 'code' | 'fill';
  options?: Record<string, string[]>;
  answer: string | string[] | number | number[];
  hint?: Record<string, string>;
  difficulty: 'simple' | 'complex';
  imageUrl?: string;
  optionImages?: string[];
}

export interface Test {
  id: string;
  title: Record<string, string>;
  moduleId: string;
  questionIds: string[];
  timeLimitMinutes: number;
  passScore: number;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  answers: { questionId: string; answer: string | string[]; timeSpent: number }[];
  score: number;
  passed: boolean;
  startedAt: string;
  finishedAt?: string;
  durationSeconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  completedSteps: string[];
  lastAccessedAt: string;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'user' | 'module' | 'test' | 'question';
  entityId: string;
  details: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  USERS: 'delphi_tvs_users',
  MODULES: 'delphi_tvs_modules',
  QUESTIONS: 'delphi_tvs_questions',
  TESTS: 'delphi_tvs_tests',
  ATTEMPTS: 'delphi_tvs_attempts',
  PROGRESS: 'delphi_tvs_progress',
  AUDIT_LOG: 'delphi_tvs_audit',
  INITIALIZED: 'delphi_tvs_initialized',
};

// SHA-256 hash function for passwords
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// User operations
export function getUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  saveToStorage(STORAGE_KEYS.USERS, users);
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  saveToStorage(STORAGE_KEYS.USERS, users);
}

// Module operations
export function getModules(): Module[] {
  return getFromStorage<Module[]>(STORAGE_KEYS.MODULES, []);
}

export function getModuleById(id: string): Module | undefined {
  return getModules().find(m => m.id === id);
}

export function saveModule(module: Module): void {
  const modules = getModules();
  const index = modules.findIndex(m => m.id === module.id);
  if (index >= 0) {
    modules[index] = module;
  } else {
    modules.push(module);
  }
  saveToStorage(STORAGE_KEYS.MODULES, modules);
}

// Question operations
export function getQuestions(): Question[] {
  return getFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, []);
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestions().find(q => q.id === id);
}

export function getQuestionsByModule(moduleId: string): Question[] {
  return getQuestions().filter(q => q.moduleId === moduleId);
}

export function getQuestionsByModuleAndStep(moduleId: string, stepId: string): Question[] {
  return getQuestions().filter(q => q.moduleId === moduleId && q.stepId === stepId);
}

export function saveQuestion(question: Question): void {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === question.id);
  if (index >= 0) {
    questions[index] = question;
  } else {
    questions.push(question);
  }
  saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
}

export function deleteQuestion(id: string): void {
  const questions = getQuestions().filter(q => q.id !== id);
  saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
}

// Test operations
export function getTests(): Test[] {
  return getFromStorage<Test[]>(STORAGE_KEYS.TESTS, []);
}

export function getTestById(id: string): Test | undefined {
  return getTests().find(t => t.id === id);
}

export function saveTest(test: Test): void {
  const tests = getTests();
  const index = tests.findIndex(t => t.id === test.id);
  if (index >= 0) {
    tests[index] = test;
  } else {
    tests.push(test);
  }
  saveToStorage(STORAGE_KEYS.TESTS, tests);
}

export function deleteTest(id: string): void {
  const tests = getTests().filter(t => t.id !== id);
  saveToStorage(STORAGE_KEYS.TESTS, tests);
}

// Test Attempt operations
export function getAttempts(): TestAttempt[] {
  return getFromStorage<TestAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function getAttemptsByUser(userId: string): TestAttempt[] {
  return getAttempts().filter(a => a.userId === userId);
}

export function getAttemptsByTest(testId: string): TestAttempt[] {
  return getAttempts().filter(a => a.testId === testId);
}

export function getAttemptById(id: string): TestAttempt | undefined {
  return getAttempts().find(a => a.id === id);
}

export function saveAttempt(attempt: TestAttempt): void {
  const attempts = getAttempts();
  const index = attempts.findIndex(a => a.id === attempt.id);
  if (index >= 0) {
    attempts[index] = attempt;
  } else {
    attempts.push(attempt);
  }
  saveToStorage(STORAGE_KEYS.ATTEMPTS, attempts);
}

export function deleteAttempt(id: string): void {
  const attempts = getAttempts().filter(a => a.id !== id);
  saveToStorage(STORAGE_KEYS.ATTEMPTS, attempts);
  // Also remove from sessionStorage if it exists
  const allKeys = Object.keys(sessionStorage);
  allKeys.forEach(key => {
    if (sessionStorage.getItem(key) === id) {
      sessionStorage.removeItem(key);
    }
  });
}

// Progress operations
export function getProgress(): UserProgress[] {
  return getFromStorage<UserProgress[]>(STORAGE_KEYS.PROGRESS, []);
}

export function getUserProgress(userId: string): UserProgress[] {
  return getProgress().filter(p => p.userId === userId);
}

export function getModuleProgress(userId: string, moduleId: string): UserProgress | undefined {
  return getProgress().find(p => p.userId === userId && p.moduleId === moduleId);
}

export function saveProgress(progress: UserProgress): void {
  const allProgress = getProgress();
  const index = allProgress.findIndex(p => p.userId === progress.userId && p.moduleId === progress.moduleId);
  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }
  saveToStorage(STORAGE_KEYS.PROGRESS, allProgress);
}

// Audit Log operations
export function getAuditLogs(): AuditLog[] {
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOG, []);
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  logs.push({
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, logs);
}

// Initialize with seed data
export function isInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
}

export function markInitialized(): void {
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}
