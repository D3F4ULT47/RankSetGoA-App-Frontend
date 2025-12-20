import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full relative transition-all duration-300",
        "hover:bg-primary/10 hover:scale-110 active:scale-95",
        "group overflow-hidden",
        "border border-transparent hover:border-primary/20",
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={cn(
            "absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out",
            theme === 'light'
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-180 scale-0 opacity-0"
          )}
        />
        {/* Moon Icon */}
        <Moon
          className={cn(
            "absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out",
            theme === 'dark'
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-180 scale-0 opacity-0"
          )}
        />
      </div>
      {/* Animated glow effect */}
      <span
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-md",
          theme === 'light'
            ? "bg-gradient-to-br from-yellow-400 to-orange-400"
            : "bg-gradient-to-br from-blue-400 to-indigo-400"
        )}
      />
      {/* Ripple effect on click */}
      <span
        className={cn(
          "absolute inset-0 rounded-full scale-0 group-active:scale-150 opacity-0 group-active:opacity-20 transition-all duration-300",
          theme === 'light'
            ? "bg-yellow-400"
            : "bg-blue-400"
        )}
      />
    </Button>
  );
};

export default ThemeToggle;

