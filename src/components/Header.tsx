import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Users, CreditCard, User, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  activeTab?: 'predictor' | 'community' | 'subscription';
}

// Auth state helper functions
export const isUserLoggedIn = () => localStorage.getItem('ranksetgo_auth') === 'true';
export const setUserLoggedIn = (value: boolean) => {
  localStorage.setItem('ranksetgo_auth', value ? 'true' : 'false');
  window.dispatchEvent(new Event('auth-change'));
};

const Header = ({ activeTab = 'predictor' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();
  
  // CHANGED: Detect if we're on profile page
  const isProfilePage = location.pathname.startsWith('/profile');

  useEffect(() => {
    const handleAuthChange = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleNavigation = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isLoggedIn) {
      localStorage.setItem('ranksetgo_redirect', path);
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  // CHANGED: Don't show navigation items as active when on profile page
  const menuItems = [
    { name: 'College Predictor', icon: GraduationCap, active: !isProfilePage && activeTab === 'predictor', disabled: false, path: '/', requiresAuth: false },
    { name: 'Community', icon: Users, active: !isProfilePage && activeTab === 'community', disabled: false, path: '/community', requiresAuth: true },
    { name: 'Paid Subscription', icon: CreditCard, active: !isProfilePage && activeTab === 'subscription', disabled: false, path: '/subscription', requiresAuth: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">RankSetGo</span>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleNavigation(item.path, item.requiresAuth)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                item.active
                  ? 'bg-primary/10 text-primary'
                  : item.disabled
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {item.disabled && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">Soon</span>
              )}
            </button>
          ))}
        </nav>

        {/* Right side - Theme Toggle, Profile & Logout */}
        {/* CHANGED: Added theme toggle to the left of profile icon */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle - positioned to the left of profile icon */}
          <ThemeToggle />
          {/* Profile icon - always navigates to profile page */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
          {/* Logout button - only shown when logged in */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <LogOut className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={async () => { 
                  try {
                    await fetch('https://ranksetgoa-app-backend.onrender.com/api/v1/user/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                  setUserLoggedIn(false); 
                  setIsLoggedIn(false);
                  navigate('/');
                }} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        {/* CHANGED: Added theme toggle and profile icon now always visible */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle - positioned to the left of profile icon */}
          <ThemeToggle />
          {/* Profile icon - shows as active when on profile page */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-all duration-200",
              isProfilePage 
                ? "bg-primary/10 text-primary hover:bg-primary/15" 
                : "hover:bg-primary/5"
            )}
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
          {/* Logout button - only shown when logged in */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <LogOut className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={async () => { 
                  try {
                    await fetch('/api/v1/user/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                  setUserLoggedIn(false); 
                  setIsLoggedIn(false);
                  navigate('/');
                }} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    handleNavigation(item.path, item.requiresAuth);
                    setIsMenuOpen(false);
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  item.active
                    ? 'bg-primary/10 text-primary'
                    : item.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.disabled && (
                  <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">Coming Soon</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
