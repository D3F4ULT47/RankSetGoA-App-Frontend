import { useState, useEffect } from 'react';
import { Hash, MessageCircle, Settings, Edit2, Save, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Channel, CHANNELS } from '@/types/community';
import RolesModal, { UserRoles } from './RolesModal';
import RolePill from './RolePill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { isUserLoggedIn } from '@/components/Header';

interface CommunitySidebarProps {
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
}

const CommunitySidebar = ({ activeChannel, onChannelSelect }: CommunitySidebarProps) => {
  const { toast } = useToast();
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRoles>({
    counsellingInterests: [],
    collegeProbabilities: [],
  });
  const [username, setUsername] = useState<string>('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user data
  useEffect(() => {
    if (!isUserLoggedIn()) {
      setIsLoadingUser(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/v1/user/current-user', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const user = data?.data?.user || data?.user;
          if (user) {
            setUsername(user.username || '');
            setUsernameValue(user.username || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handleRemoveRole = (type: 'counselling' | 'college', value: string) => {
    if (type === 'counselling') {
      setUserRoles((prev) => ({
        ...prev,
        counsellingInterests: prev.counsellingInterests.filter((v) => v !== value),
      }));
    } else {
      setUserRoles((prev) => ({
        ...prev,
        collegeProbabilities: prev.collegeProbabilities.filter((v) => v !== value),
      }));
    }
  };

  const hasRoles = userRoles.counsellingInterests.length > 0 || userRoles.collegeProbabilities.length > 0;

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Community</h2>
        <p className="text-xs text-muted-foreground mt-1">Connect with fellow aspirants</p>
      </div>

      {/* Roles Section */}
      <div className="p-2 border-b border-border">
        <button
          onClick={() => setIsRolesModalOpen(true)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Roles</span>
        </button>

        {/* Display Role Pills */}
        {hasRoles && (
          <div className="px-2 py-2 flex flex-wrap gap-1">
            {userRoles.counsellingInterests.map((interest) => (
              <RolePill
                key={interest}
                label={interest}
                variant="counselling"
                onRemove={() => handleRemoveRole('counselling', interest)}
              />
            ))}
            {userRoles.collegeProbabilities.map((college) => (
              <RolePill
                key={college}
                label={college}
                variant="college"
                onRemove={() => handleRemoveRole('college', college)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Channels List */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
          Channels
        </p>
        {CHANNELS.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={activeChannel === channel.id}
            onClick={() => onChannelSelect(channel.id)}
          />
        ))}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-border bg-secondary/30">
        {isLoadingUser ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {username ? username.substring(0, 2).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {isEditingUsername ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={usernameValue}
                      onChange={(e) => setUsernameValue(e.target.value)}
                      placeholder="Enter username"
                      className="h-7 text-sm px-2"
                      disabled={isSavingUsername}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={async () => {
                        if (!usernameValue.trim()) {
                          toast({
                            title: 'Error',
                            description: 'Username cannot be empty',
                            variant: 'destructive',
                          });
                          return;
                        }
                        setIsSavingUsername(true);
                        try {
                          const response = await fetch('/api/v1/user/update-account', {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({ username: usernameValue.trim() }),
                          });

                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData?.message || 'Failed to update username');
                          }

                          const data = await response.json();
                          setUsername(usernameValue.trim());
                          setIsEditingUsername(false);
                          toast({
                            title: 'Success',
                            description: data?.message || 'Username updated successfully',
                          });
                        } catch (error: any) {
                          console.error('Error updating username:', error);
                          toast({
                            title: 'Error',
                            description: error.message || 'Failed to update username',
                            variant: 'destructive',
                          });
                        } finally {
                          setIsSavingUsername(false);
                        }
                      }}
                      disabled={isSavingUsername}
                    >
                      {isSavingUsername ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        setIsEditingUsername(false);
                        setUsernameValue(username);
                      }}
                      disabled={isSavingUsername}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 group">
                    <p className="text-sm font-medium text-foreground truncate flex-1">
                      {username || 'Set username'}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setUsernameValue(username || '');
                        setIsEditingUsername(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Aspirant</p>
              </div>
            </div>
            {!isEditingUsername && (
              <p className="text-xs text-muted-foreground/70 italic">
                Username for anonymity
              </p>
            )}
          </div>
        )}
      </div>

      {/* Roles Modal */}
      <RolesModal
        isOpen={isRolesModalOpen}
        onClose={() => setIsRolesModalOpen(false)}
        roles={userRoles}
        onSave={setUserRoles}
      />
    </aside>
  );
};

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

const ChannelItem = ({ channel, isActive, onClick }: ChannelItemProps) => {
  const Icon = channel.icon === 'hash' ? Hash : MessageCircle;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{channel.name}</span>
    </button>
  );
};

export default CommunitySidebar;
