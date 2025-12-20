import { UserRole } from '@/types/community';
import { UserRoles } from './RolesModal';
import RolePill from './RolePill';
import ModBadge from './ModBadge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface UserProfilePopupProps {
  username: string;
  userRole: UserRole;
  roles?: UserRoles;
  children: React.ReactNode;
}

const UserProfilePopup = ({ username, userRole, roles, children }: UserProfilePopupProps) => {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-4">
          {/* Avatar & Username */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-primary">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground truncate">{username}</span>
                {userRole === 'moderator' && <ModBadge />}
              </div>
              <p className="text-xs text-muted-foreground">Aspirant</p>
            </div>
          </div>

          {/* Role Pills */}
          {roles && (roles.counsellingInterests.length > 0 || roles.collegeProbabilities.length > 0) && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {roles.counsellingInterests.map((interest) => (
                  <RolePill key={interest} label={interest} variant="counselling" />
                ))}
                {roles.collegeProbabilities.map((college) => (
                  <RolePill key={college} label={college} variant="college" />
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfilePopup;
