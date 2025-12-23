import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getUsers,
  getModules,
  getTests,
  getAttempts,
  getAuditLogs,
  saveUser,
  hashPassword,
  deleteUser,
  addAuditLog,
  type User,
  type TestAttempt,
} from '@/lib/storage';
import {
  ArrowLeft,
  Users,
  FileText,
  BarChart3,
  History,
  Plus,
  Trash2,
  Eye,
  Printer,
  Download,
  Edit,
  Search,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Review() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [users, setUsers] = useState(getUsers());
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'trainee' | 'admin'>('trainee');
  const [selectedTrainee, setSelectedTrainee] = useState<User | null>(null);

  // Edit user state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<'trainee' | 'admin'>('trainee');
  const [editPassword, setEditPassword] = useState('');

  // Search and Sort State for Users
  const [userSortField, setUserSortField] = useState<'username' | 'role' | 'created'>('created');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('desc');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Filter and Sort Users
  const sortedUsers = React.useMemo(() => {
    let filtered = users;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      filtered = users.filter((u) => u.username.toLowerCase().includes(q));
    }

    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      switch (userSortField) {
        case 'username':
          compareValue = a.username.localeCompare(b.username);
          break;
        case 'role':
          compareValue = a.role.localeCompare(b.role);
          break;
        case 'created':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return userSortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [users, userSearchQuery, userSortField, userSortDirection]);

  const handleUserSort = (field: typeof userSortField) => {
    if (userSortField === field) {
      setUserSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
  };

  const modules = getModules();
  const tests = getTests();
  const allAttempts = getAttempts();
  const auditLogs = getAuditLogs();

  // Redirect non-admins
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    if (users.find((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      toast({ title: 'Error', description: 'Username already exists', variant: 'destructive' });
      return;
    }

    const passwordHash = await hashPassword(newPassword);
    const newUser: User = {
      id: crypto.randomUUID(),
      username: newUsername,
      passwordHash,
      role: newRole,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setUsers(getUsers());

    addAuditLog({
      userId: user!.id,
      action: 'create',
      entityType: 'user',
      entityId: newUser.id,
      details: `Created user: ${newUser.username} (${newUser.role})`,
    });

    setNewUsername('');
    setNewPassword('');
    setShowCreateUser(false);

    toast({ title: 'Success', description: 'User created successfully' });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.username === 'admin') {
      toast({ title: 'Error', description: 'Cannot delete admin user', variant: 'destructive' });
      return;
    }

    deleteUser(userId);
    setUsers(getUsers());

    addAuditLog({
      userId: user!.id,
      action: 'delete',
      entityType: 'user',
      entityId: userId,
      details: `Deleted user: ${userToDelete.username}`,
    });

    toast({ title: 'Success', description: 'User deleted' });
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    const updatedUser: User = { ...editingUser, role: editRole };
    if (editPassword) {
      updatedUser.passwordHash = await hashPassword(editPassword);
    }

    saveUser(updatedUser);
    setUsers(getUsers());

    addAuditLog({
      userId: user!.id,
      action: 'update',
      entityType: 'user',
      entityId: editingUser.id,
      details: `Updated user: ${editingUser.username} (role: ${editRole})${editPassword ? ', password changed' : ''}`,
    });

    setEditingUser(null);
    setEditPassword('');

    toast({ title: 'Success', description: 'User updated successfully' });
  };

  const getTraineeStats = (traineeId: string) => {
    const attempts = allAttempts.filter((a) => a.userId === traineeId && a.status === 'completed');
    const passed = attempts.filter((a) => a.passed).length;
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
    const totalTime = attempts.reduce((sum, a) => sum + a.durationSeconds, 0);

    return { attempts: attempts.length, passed, avgScore, totalTime };
  };

  const getModuleAccuracy = (traineeId: string) => {
    const attempts = allAttempts.filter((a) => a.userId === traineeId && a.status === 'completed');
    const moduleStats: Record<string, { attempts: number; avgScore: number }> = {};

    attempts.forEach((attempt) => {
      const test = tests.find((t) => t.id === attempt.testId);
      if (!test) return;

      if (!moduleStats[test.moduleId]) {
        moduleStats[test.moduleId] = { attempts: 0, avgScore: 0 };
      }
      moduleStats[test.moduleId].attempts++;
      moduleStats[test.moduleId].avgScore =
        (moduleStats[test.moduleId].avgScore * (moduleStats[test.moduleId].attempts - 1) +
          attempt.score) /
        moduleStats[test.moduleId].attempts;
    });

    return moduleStats;
  };

  const renderTraineeReview = (trainee: User) => {
    const stats = getTraineeStats(trainee.id);
    const moduleAccuracy = getModuleAccuracy(trainee.id);
    const traineeAttempts = allAttempts.filter(
      (a) => a.userId === trainee.id && a.status === 'completed'
    );

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">{trainee.username}</h3>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(trainee.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Summary
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Total Attempts</p>
            <p className="text-2xl font-bold text-foreground">{stats.attempts}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Tests Passed</p>
            <p className="text-2xl font-bold text-success">{stats.passed}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground">Time Spent</p>
            <p className="text-2xl font-bold text-foreground">
              {Math.floor(stats.totalTime / 60)}m
            </p>
          </div>
        </div>

        {/* Module Accuracy Chart */}
        <div className="card-elevated p-6">
          <h4 className="font-semibold text-foreground mb-4">Performance by Module</h4>
          <div className="space-y-3">
            {modules.map((module) => {
              const accuracy = moduleAccuracy[module.id];
              const score = accuracy ? Math.round(accuracy.avgScore) : 0;
              const hasData = accuracy && accuracy.attempts > 0;

              return (
                <div key={module.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{t(module.title)}</span>
                    <span className={hasData ? 'text-foreground' : 'text-muted-foreground'}>
                      {hasData ? `${score}%` : 'No data'}
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        background:
                          score >= 80
                            ? 'var(--gradient-success)'
                            : score >= 60
                              ? 'var(--gradient-accent)'
                              : 'hsl(var(--destructive))',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card-elevated p-6">
          <h4 className="font-semibold text-foreground mb-4">Recommendations</h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(moduleAccuracy)
              .filter(([_, data]) => data.avgScore < 70)
              .map(([moduleId]) => {
                const module = modules.find((m) => m.id === moduleId);
                return module ? (
                  <li key={moduleId} className="flex items-center gap-2 text-warning">
                    • Review "{t(module.title)}" module (score below 70%)
                  </li>
                ) : null;
              })}
            {stats.attempts === 0 && (
              <li className="text-muted-foreground">No test attempts yet. Encourage training.</li>
            )}
            {stats.avgScore >= 80 && stats.attempts > 0 && (
              <li className="text-success">✓ Excellent performance! Ready for advanced modules.</li>
            )}
          </ul>
        </div>

        {/* Recent Attempts */}
        <div className="card-elevated p-6">
          <h4 className="font-semibold text-foreground mb-4">Recent Test Attempts</h4>
          <div className="admin-table overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {traineeAttempts.slice(0, 5).map((attempt) => {
                  const test = tests.find((t) => t.id === attempt.testId);
                  return (
                    <tr key={attempt.id}>
                      <td>{test ? t(test.title) : 'Unknown'}</td>
                      <td className="font-medium">{attempt.score}%</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${attempt.passed
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                            }`}
                        >
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {new Date(attempt.finishedAt || attempt.startedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/testing/${attempt.testId}/results/${attempt.id}`, { state: { returnTo: '/review' } })}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {traineeAttempts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted-foreground py-8">
                      No test attempts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Review</h1>
              <p className="text-muted-foreground text-lg">Manage users, content, and view system analytics</p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <div className="glass-card rounded-3xl p-6 flex items-center justify-between group hover-lift shadow-sm hover:shadow-xl transition-all duration-300">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{users.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 drop-shadow-sm" />
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex items-center justify-between group hover-lift shadow-sm hover:shadow-xl transition-all duration-300">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Attempts</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{allAttempts.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 drop-shadow-sm" />
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex items-center justify-between group hover-lift shadow-sm hover:shadow-xl transition-all duration-300">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">System Events</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{auditLogs.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <History className="w-7 h-7 drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="trainees" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Trainee Review</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Log</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="animate-fade-in space-y-6">
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground">User Management</h2>
                <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
                  <DialogTrigger asChild>
                    <Button className="btn-hero text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Username</Label>
                        <Input
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trainee">Trainee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateUser} className="w-full btn-hero text-primary-foreground">
                        Create User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by username..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="admin-table overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserSort('username')}
                      >
                        <div className="flex items-center gap-2">
                          Username
                          {userSortField === 'username' && (
                            userSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserSort('role')}
                      >
                        <div className="flex items-center gap-2">
                          Role
                          {userSortField === 'role' && (
                            userSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserSort('created')}
                      >
                        <div className="flex items-center gap-2">
                          Created
                          {userSortField === 'created' && (
                            userSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="font-medium p-4">{u.username}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                              }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="text-muted-foreground p-4">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingUser(u);
                                setEditRole(u.role);
                                setEditPassword('');
                              }}
                              className="text-primary hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.username === 'admin'}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sortedUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted-foreground py-8">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit User Dialog */}
              <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User: {editingUser?.username}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Role</Label>
                      <Select value={editRole} onValueChange={(v) => setEditRole(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trainee">Trainee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>New Password (optional)</Label>
                      <Input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                    <Button onClick={handleEditUser} className="w-full btn-hero text-primary-foreground">
                      Update User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Trainee Review Tab */}
          <TabsContent value="trainees" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Trainee List */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Trainees</h2>
                <div className="space-y-2">
                  {users
                    .filter((u) => u.role === 'trainee')
                    .map((trainee) => {
                      const stats = getTraineeStats(trainee.id);
                      return (
                        <button
                          key={trainee.id}
                          onClick={() => setSelectedTrainee(trainee)}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${selectedTrainee?.id === trainee.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted'
                            }`}
                        >
                          <p className="font-medium text-foreground">{trainee.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.attempts} attempts • {stats.avgScore}% avg
                          </p>
                        </button>
                      );
                    })}
                  {users.filter((u) => u.role === 'trainee').length === 0 && (
                    <p className="text-muted-foreground text-sm">No trainees found</p>
                  )}
                </div>
              </div>

              {/* Trainee Details */}
              <div className="lg:col-span-2">
                {selectedTrainee ? (
                  renderTraineeReview(selectedTrainee)
                ) : (
                  <div className="card-elevated p-12 text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a trainee to view their details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Modules ({modules.length})
                </h2>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div key={module.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <p className="font-medium text-foreground">{t(module.title)}</p>
                      <p className="text-xs text-muted-foreground">
                        {module.steps.length} steps
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Tests ({tests.length})</h2>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="space-y-3">
                  {tests.map((test) => {
                    const module = modules.find((m) => m.id === test.moduleId);
                    return (
                      <div key={test.id} className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-foreground">{t(test.title)}</p>
                        <p className="text-xs text-muted-foreground">
                          {test.questionIds.length} questions • {test.timeLimitMinutes}min •{' '}
                          {test.passScore}% to pass
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="animate-fade-in">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Audit Log</h2>
              <div className="admin-table overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 50)
                      .map((log) => {
                        const logUser = users.find((u) => u.id === log.userId);
                        return (
                          <tr key={log.id}>
                            <td className="text-muted-foreground text-sm">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="font-medium">{logUser?.username || 'Unknown'}</td>
                            <td>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${log.action === 'create'
                                  ? 'bg-success/10 text-success'
                                  : log.action === 'delete'
                                    ? 'bg-destructive/10 text-destructive'
                                    : 'bg-warning/10 text-warning'
                                  }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="text-sm">{log.details}</td>
                          </tr>
                        );
                      })}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted-foreground py-8">
                          No audit logs yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
