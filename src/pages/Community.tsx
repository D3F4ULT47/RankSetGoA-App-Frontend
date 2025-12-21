import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, GraduationCap, Users, CreditCard, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import ChatChannel from '@/components/community/ChatChannel';
import DoubtChannel from '@/components/community/DoubtChannel';
import { CHANNELS } from '@/types/community';
import { isUserLoggedIn, setUserLoggedIn } from '@/components/Header';
const Community = () => {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('general');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const currentChannel = CHANNELS.find(c => c.id === activeChannel);

  useEffect(() => {
    const handleAuthChange = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);
  const menuItems = [{
    name: 'College Predictor',
    icon: GraduationCap,
    active: false,
    disabled: false,
    path: '/'
  }, {
    name: 'Community',
    icon: Users,
    active: true,
    disabled: false,
    path: '/community'
  }, {
    name: 'Paid Subscription',
    icon: CreditCard,
    active: false,
    disabled: false,
    path: '/subscription'
  }];
  return <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left - Logo & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary transition-colors">
              {isMobileSidebarOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:block">RankSetGo</span>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {menuItems.map(item => <button key={item.name} disabled={item.disabled} onClick={() => !item.disabled && item.path && navigate(item.path)} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', item.active ? 'bg-primary/10 text-primary' : item.disabled ? 'text-muted-foreground/50 cursor-not-allowed' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                <item.icon className="h-4 w-4 text-[#1f272e]" />
                {item.name}
                {item.disabled && <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">Soon</span>}
              </button>)}
          </nav>

          {/* Right - Theme Toggle, Profile, Logout & Back Button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - positioned to the left of profile icon */}
            <ThemeToggle className="hidden md:flex" />
            {/* Profile icon - always visible */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hidden md:flex"
              onClick={() => navigate('/profile')}
            >
              <User className="h-5 w-5" />
            </Button>
            {/* Logout button - only shown when logged in (desktop) */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={async () => { 
                    try {
                     const res= await fetch('https://ranksetgoa-app-backend.onrender.com/api/v1/user/logout', {
                        method: 'POST',
                        credentials: 'include',
                      })
                      .then(res =>res.json())
                      .then((data) =>console.log(data));
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
            {/* Mobile - Theme Toggle, Profile and Logout */}
            <div className="md:hidden flex items-center gap-1">
              {/* Theme Toggle - positioned to the left of profile icon */}
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5" />
              </Button>
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
                       const res = await fetch('https://ranksetgoa-app-backend.onrender.com/api/v1/user/logout', {
                          method: 'POST',
                          credentials: 'include',
                        })
                        .then(res =>res.json())
                        .then((data) =>console.log(data));
                        
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
            {/* Back Button */}
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Predictor</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CommunitySidebar activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}>
            <div className="absolute left-0 top-14 bottom-0 w-60 animate-slide-up" onClick={e => e.stopPropagation()}>
              <CommunitySidebar activeChannel={activeChannel} onChannelSelect={id => {
            setActiveChannel(id);
            setIsMobileSidebarOpen(false);
          }} />
            </div>
          </div>}

        {/* Channel Content */}
        <main className="flex-1 overflow-hidden">
          {currentChannel?.type === 'chat' ? <ChatChannel channelId={activeChannel} /> : <DoubtChannel />}
        </main>
      </div>
    </div>;
};
export default Community;