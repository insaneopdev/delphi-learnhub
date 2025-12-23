import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, languageNames, type Language } from '@/contexts/LanguageContext';
import { useDisplay } from '@/contexts/DisplayContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Globe, User, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import delphiLogo from '@/assets/delphi-tvs-logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useDisplay();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    ...(!isAdmin ? [{ path: '/training', label: 'Training' }] : []),
    { path: '/testing', label: 'Testing' },
    ...(isAdmin ? [{ path: '/review', label: 'Review' }, { path: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="h-10 w-auto bg-white rounded p-1">
                <img
                  src={delphiLogo}
                  alt="Delphi TVS"
                  className="h-full w-auto"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-extrabold text-primary tracking-tight">
                  Delphi TVS
                </h1>
                <p className="text-xs text-muted-foreground">Technologies Ltd</p>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={location.pathname === item.path ? 'bg-secondary' : ''}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {zoomLevel >= 100 ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                    <span className="hidden sm:inline">{zoomLevel}%</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => resetZoom()}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset (100%)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={decreaseZoom} disabled={zoomLevel <= 90}>
                    <ZoomOut className="w-4 h-4 mr-2" />
                    Zoom Out
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={increaseZoom} disabled={zoomLevel >= 150}>
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Zoom In
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{languageNames[language]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={language === lang ? 'bg-muted' : ''}
                    >
                      {languageNames[lang]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user?.username}</span>
                    {isAdmin && (
                      <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground">
                        ADMIN
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex-col h-auto py-2 px-4 ${location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">{children}</main>
    </div>
  );
}
