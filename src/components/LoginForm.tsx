import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Lock, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Brand & Information */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient p-12 flex-col justify-between">
        <div>
          {/* Logo and Company Name */}
          <div className="flex items-center gap-4 mb-12">
            <img
              src="/assets/images/delphi-tvs-logo.png"
              alt="Delphi TVS"
              className="h-16 w-auto bg-white p-2 rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Delphi TVS</h1>
              <p className="text-white/80 text-sm">Technologies Ltd</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-4">
              <span>EHS Induction Program</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Empowering Excellence<br />Through Training
            </h2>
            <p className="text-white/90 text-lg">
              Comprehensive safety training and skill development platform for a world-class workforce
            </p>
          </div>

          {/* Company Info Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">30+</div>
              <div className="text-white/80 text-sm">Years of Excellence</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/80 text-sm">Employees Trained</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">BS6</div>
              <div className="text-white/80 text-sm">Emission Compliance</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80 text-sm">Safety Standards</div>
            </div>
          </div>

          {/* About Company */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">About Delphi TVS</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Delphi-TVS Technologies Ltd is a joint venture between PHINIA (erstwhile Delphi Technologies),
              USA and TVS Group, specializing in advanced fuel injection systems for diesel engines.
              We are committed to innovation, quality, and employee excellence.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-white/60 text-sm">
          <p>Joint Venture: PHINIA Inc. (USA) × TVS Group (India)</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <img
              src="/assets/images/delphi-tvs-logo.png"
              alt="Delphi TVS"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">Delphi TVS Training</h1>
            <p className="text-muted-foreground">Safety Training Management System</p>
          </div>

          {/* Login Card */}
          <div className="card-elevated p-8 animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground text-sm">Sign in to access your training portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-scale-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-hero text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Admin:</span> admin / admin123</p>
                <p><span className="font-medium text-foreground">Trainee:</span> trainee1 / pass1</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2024 Delphi-TVS Technologies Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
