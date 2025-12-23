import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTests, getModuleById, getAttemptsByUser, getAttempts, deleteAttempt, addAuditLog, getUsers, type TestAttempt } from '@/lib/storage';
import { ArrowLeft, Clock, Target, ChevronRight, Trophy, XCircle, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Testing() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tests = getTests();
  const attempts = user ? getAttemptsByUser(user.id) : [];
  const allAttempts = isAdmin ? getAttempts() : [];
  const users = isAdmin ? getUsers() : [];

  // Sorting state for admin table
  const [sortField, setSortField] = useState<'user' | 'test' | 'score' | 'status' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort and filter attempts
  const sortedAttempts = useMemo(() => {
    if (!isAdmin) return [];

    // First filter by search query
    let filtered = allAttempts;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = allAttempts.filter(att => {
        const userData = users.find(u => u.id === att.userId);
        const testData = tests.find(t => t.id === att.testId);
        const moduleData = testData?.moduleId ? getModuleById(testData.moduleId) : null;

        return (
          userData?.username.toLowerCase().includes(query) ||
          testData?.title.en?.toLowerCase().includes(query) ||
          moduleData?.title.en?.toLowerCase().includes(query)
        );
      });
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'user':
          const userA = users.find(u => u.id === a.userId)?.username || '';
          const userB = users.find(u => u.id === b.userId)?.username || '';
          compareValue = userA.localeCompare(userB);
          break;
        case 'test':
          const testA = tests.find(t => t.id === b.testId)?.title.en || '';
          const testB = tests.find(t => t.id === a.testId)?.title.en || '';
          compareValue = testA.localeCompare(testB);
          break;
        case 'score':
          compareValue = a.score - b.score;
          break;
        case 'status':
          compareValue = (a.passed === b.passed) ? 0 : a.passed ? 1 : -1;
          break;
        case 'date':
          compareValue = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [allAttempts, sortField, sortDirection, searchQuery, users, tests, isAdmin]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getTestStats = (testId: string) => {
    const testAttempts = attempts.filter(a => a.testId === testId && a.status === 'completed');
    const passed = testAttempts.filter(a => a.passed).length;
    const best = testAttempts.length > 0
      ? Math.max(...testAttempts.map(a => a.score))
      : null;
    return { attempts: testAttempts.length, passed, best };
  };

  const handleResetAttempt = (attemptId: string) => {
    const attempt = allAttempts.find(a => a.id === attemptId);
    if (!attempt) return;

    deleteAttempt(attemptId);
    addAuditLog({
      userId: user!.id,
      action: 'delete',
      entityType: 'test',
      entityId: attempt.testId,
      details: JSON.stringify({ action: 'reset_attempt', userId: attempt.userId, attemptId })
    });
    toast({ title: 'Test attempt reset', description: 'User can now retake the test' });
    window.location.reload(); // Refresh to update the list
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
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Testing Center</h1>
            <p className="text-muted-foreground">Assess your safety knowledge</p>
          </div>
        </div>

        {/* Test Cards - Only for Trainees */}
        {!isAdmin && (
          <>
            <div className="grid gap-6">
              {tests.map((test, index) => {
                const module = getModuleById(test.moduleId);
                const stats = getTestStats(test.id);
                const hasCompleted = attempts.some(a => a.testId === test.id && a.status === 'completed');

                return (
                  <button
                    key={test.id}
                    onClick={() => {
                      if (hasCompleted) {
                        alert('You have already completed this test. Contact admin to reset your attempt.');
                        return;
                      }
                      navigate(`/testing/${test.id}`);
                    }}
                    className="card-elevated p-6 text-left group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {t(test.title)}
                        </h2>

                        {module && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Module: {t(module.title)}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{test.timeLimitMinutes} minutes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="w-4 h-4" />
                            <span>Pass: {test.passScore}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{test.questionIds.length} questions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Stats */}
                        {stats.attempts > 0 && (
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-bold text-foreground">{stats.attempts}</p>
                              <p className="text-xs text-muted-foreground">Attempts</p>
                            </div>
                            <div className="text-center">
                              <p className={`font-bold ${stats.passed > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                                {stats.passed}
                              </p>
                              <p className="text-xs text-muted-foreground">Passed</p>
                            </div>
                            {stats.best !== null && (
                              <div className="text-center">
                                <p className="font-bold text-foreground">{stats.best}%</p>
                                <p className="text-xs text-muted-foreground">Best</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status Badge */}
                        {stats.passed > 0 ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                            <Trophy className="w-4 h-4" />
                            <span>Passed</span>
                          </div>
                        ) : stats.attempts > 0 ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                            <XCircle className="w-4 h-4" />
                            <span>Try Again</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                            Not Started
                          </div>
                        )}

                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {tests.length === 0 && (
              <div className="text-center py-12 card-elevated">
                <p className="text-muted-foreground">No tests available yet.</p>
              </div>
            )}
          </>
        )}

        {/* Admin Test Management */}
        {isAdmin && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Test Management</h2>
            <p className="text-muted-foreground mb-6">Manage all user test attempts</p>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by user, test, or module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-2">
                  Showing {sortedAttempts.length} of {allAttempts.length} results
                </p>
              )}
            </div>

            {sortedAttempts.length === 0 ? (
              <div className="text-center py-12 card-elevated">
                <p className="text-muted-foreground">No test attempts yet</p>
              </div>
            ) : (
              <div className="card-elevated overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('user')}>
                        <div className="flex items-center gap-2">
                          User
                          <SortIcon field="user" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('test')}>
                        <div className="flex items-center gap-2">
                          Test Name
                          <SortIcon field="test" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('score')}>
                        <div className="flex items-center gap-2">
                          Score
                          <SortIcon field="score" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-2">
                          Status
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-foreground">Duration</th>
                      <th className="p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('date')}>
                        <div className="flex items-center gap-2">
                          Started At
                          <SortIcon field="date" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-foreground">Finished At</th>
                      <th className="p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAttempts.map(att => {
                      const testData = tests.find(t => t.id === att.testId);
                      const userData = users.find(u => u.id === att.userId);

                      return (
                        <tr key={att.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-foreground font-medium">{userData?.username || 'Unknown'}</td>
                          <td className="p-4 text-foreground">{testData ? t(testData.title) : 'Unknown Test'}</td>
                          <td className="p-4 text-foreground font-semibold">{att.score}%</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${att.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                              }`}>
                              {att.passed ? '✓ Passed' : '✗ Failed'}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {Math.floor(att.durationSeconds / 60)}m {att.durationSeconds % 60}s
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {new Date(att.startedAt).toLocaleString()}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {att.finishedAt ? new Date(att.finishedAt).toLocaleString() : '-'}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Reset test attempt for ${userData?.username}? They will be able to retake "${testData ? t(testData.title) : 'this test'}".`)) {
                                  handleResetAttempt(att.id);
                                }
                              }}
                            >
                              Reset
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
