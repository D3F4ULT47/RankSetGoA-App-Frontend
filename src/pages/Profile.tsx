import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Lock, Camera, KeyRound, Loader2, LogOut, Edit2, Save, X, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isUserLoggedIn, setUserLoggedIn } from '@/components/Header';
import { Input } from '@/components/ui/input';

interface UserData {
  fullName: string;
  email: string;
  username?: string;
  avatar?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      navigate('/auth');
      return;
    }

    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('ttps://ranksetgoa-app-backend.onrender.com/api/v1/user/current-user', {
          method: 'POST',
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        // API returns: { statusCode, data: { user }, message, success }
        if (data?.data?.user) {
          setUserData(data.data.user);
          setUsernameValue(data.data.user.username || '');
        } else if (data?.user) {
          setUserData(data.user);
          setUsernameValue(data.user.username || '');
        } else {
          throw new Error('User data not found in response');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load profile data',
          variant: 'destructive',
        });
        // If unauthorized, redirect to auth
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          setUserLoggedIn(false);
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-card shadow-lg overflow-hidden">
                  {/* Avatar with center crop styling - CSS ensures image center is captured */}
                  <AvatarImage 
                    src={userData?.avatar} 
                    alt={userData?.fullName || 'User'} 
                    className="object-cover object-center w-full h-full"
                    style={{ objectPosition: 'center center' }}
                  />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {userData?.fullName ? getInitials(userData.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/profile/edit-avatar')}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Change Avatar
              </Button>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              {/* Username - Editable */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Username
                  <span className="text-xs text-muted-foreground ml-1">(for anonymity)</span>
                </label>
                {isEditingUsername ? (
                  <div className="flex gap-2">
                    <Input
                      value={usernameValue}
                      onChange={(e) => setUsernameValue(e.target.value)}
                      placeholder="Enter username"
                      className="flex-1"
                      disabled={isSavingUsername}
                    />
                    <Button
                      size="sm"
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
                          const response = await fetch('ttps://ranksetgoa-app-backend.onrender.com/api/v1/user/update-account', {
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
                          setUserData((prev) => prev ? { ...prev, username: usernameValue.trim() } : null);
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
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingUsername(false);
                        setUsernameValue(userData?.username || '');
                      }}
                      disabled={isSavingUsername}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                    <p className="text-foreground font-medium">
                      {userData?.username || 'Not set (click edit to set username)'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUsernameValue(userData?.username || '');
                        setIsEditingUsername(true);
                      }}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Your username is displayed in the community for anonymity. You can change it anytime.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-foreground font-medium">{userData?.fullName || 'Not set'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-foreground font-medium">{userData?.email || 'Not set'}</p>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                  <p className="text-foreground font-medium">••••••••</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile/change-password')}
                    className="gap-2"
                  >
                    <KeyRound className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await fetch('ttps://ranksetgoa-app-backend.onrender.com/api/v1/user/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                  setUserLoggedIn(false);
                  navigate('/auth');
                }}
                className="flex-1 gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

