'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Camera, Check, X, Loader } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  profileImage: string | null;
}

export function UserProfileDialog({
  open,
  onOpenChange,
  userId,
  userName,
  userEmail,
  profileImage,
}: UserProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempName, setTempName] = useState(userName || '');
  const [tempImage, setTempImage] = useState(profileImage);
  const [imagePreview, setImagePreview] = useState(profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUserProfile = useMutation(api.auth.updateUserProfile);

  useEffect(() => {
    if (open) {
      setTempName(userName || '');
      setTempImage(profileImage);
      setImagePreview(profileImage);
      setIsEditing(false);
    }
  }, [open, userName, profileImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error('Image size must be less than 500KB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > 800 || height > 800) {
          if (width > height) {
            height = (height * 800) / width;
            width = 800;
          } else {
            width = (width * 800) / height;
            height = 800;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          setTempImage(base64String);
          setImagePreview(base64String);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    if (!tempName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        userId,
        name: tempName,
        profileImage: tempImage || undefined,
      });

      // Update localStorage
      localStorage.setItem('userName', tempName);
      if (tempImage) {
        localStorage.setItem('userProfileImage', tempImage);
      }

      // Dispatch event to update UserMenuButton
      window.dispatchEvent(new Event('profile-updated'));

      setIsEditing(false);
      toast.success('Profile updated! 🎉');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempName(userName || '');
    setTempImage(profileImage);
    setImagePreview(profileImage);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="relative w-24 h-24">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={tempName || 'Avatar'}
                  fill
                  className="rounded-full object-cover border-2 border-primary/20"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold border-2 border-primary/20">
                  {tempName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Upload new avatar"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload profile image"
            />
          </div>

          {/* User Info */}
          {!isEditing ? (
            <div className="text-center w-full">
              <p className="text-lg font-semibold">{userName}</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="bg-secondary/50 border-border/50"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 w-full pt-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex-1 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="w-full"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
