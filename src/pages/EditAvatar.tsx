import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isUserLoggedIn, setUserLoggedIn } from '@/components/Header';

interface UserData {
  fullName: string;
  avatar?: string;
}

const EditAvatar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      navigate('/auth');
      return;
    }

    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://ranksetgoa-app-backend.onrender.com/api/v1/user/current-user', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        if (data?.data?.user) {
          setUserData(data.data.user);
        } else if (data?.user) {
          setUserData(data.user);
        } else {
          throw new Error('User data not found in response');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load user data',
          variant: 'destructive',
        });
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('https://ranksetgoa-app-backend.onrender.com/api/v1/user/avatar', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to upload avatar');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: data?.message || 'Avatar updated successfully',
      });

      // Update local user data with new avatar
      if (data?.data?.user?.avatar) {
        setUserData((prev) => prev ? { ...prev, avatar: data.data.user.avatar } : null);
      }

      // Navigate back to profile after successful upload
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        setUserLoggedIn(false);
        navigate('/auth');
      }
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Change Avatar</CardTitle>
            <CardDescription>
              Upload a new profile picture. Recommended size: 400x400px. Max file size: 5MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current/Preview Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-card shadow-lg overflow-hidden">
                  {/* Avatar with center crop styling - CSS ensures image center is captured */}
                  <AvatarImage 
                    src={preview || userData?.avatar} 
                    alt={userData?.fullName || 'User'} 
                    className="object-cover object-center w-full h-full"
                    style={{ objectPosition: 'center center' }}
                  />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {userData?.fullName ? getInitials(userData.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* File Input */}
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? 'Change Image' : 'Select Image'}
              </Button>

              {selectedFile && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedFile.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                className="flex-1 gap-2"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Upload Avatar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAvatar;

