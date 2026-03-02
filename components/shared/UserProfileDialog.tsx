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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Show preview while uploading
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new window.Image();
      img.onload = async () => {
        // Compress image before uploading
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions: 1200x1200 to preserve quality but reduce file size
        const maxSize = 1200;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to blob for better compression
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                toast.error('Failed to process image');
                return;
              }

              // Create preview
              const previewUrl = canvas.toDataURL('image/jpeg', 0.7);
              setImagePreview(previewUrl);

              // Upload compressed file
              setIsUploadingImage(true);
              try {
                const formData = new FormData();
                formData.append('file', blob, 'profile-image.jpeg');

                const response = await fetch('/api/upload-profile-image', {
                  method: 'POST',
                  body: formData,
                });

                if (!response.ok) {
                  const error = await response.json();
                  toast.error(error.error || 'Failed to upload image');
                  setImagePreview(profileImage);
                  return;
                }

                const data = await response.json();
                setTempImage(data.url);

                // Auto-save immediately after successful upload
                if (!userId) {
                  toast.error('User not authenticated');
                  return;
                }

                setIsLoading(true);
                try {
                  await updateUserProfile({
                    userId,
                    name: tempName,
                    profileImage: data.url,
                  });

                  // Update localStorage
                  localStorage.setItem('userName', tempName);
                  localStorage.setItem('userProfileImage', data.url);

                  // Dispatch event to update UserMenuButton
                  window.dispatchEvent(new Event('profile-updated'));

                  setIsEditing(false);
                  toast.success('Profile image updated! 🎉');
                } catch (error) {
                  toast.error('Failed to save profile image');
                } finally {
                  setIsLoading(false);
                }
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Failed to upload image',
                );
                setImagePreview(profileImage);
              } finally {
                setIsUploadingImage(false);
              }
            },
            'image/jpeg',
            0.75, // 75% quality for better file size
          );
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

      toast.success('Profile updated! 🎉');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
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
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
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
              disabled={isUploadingImage}
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
                className="bg-secondary border-border rounded-xs focus:border-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 w-full pt-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="orange"
                  size="sm"
                  className="gap-1.5 flex-1 cursor-pointer py-5 rounded-none hover:bg-amber-500 transition-all duration-300 ease-in-out"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  variant={'orange'}
                  onClick={handleSave}
                  size="sm"
                  className="gap-1.5 flex-1 cursor-pointer py-5 rounded-none hover:bg-amber-500 transition-all duration-300 ease-in-out"
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
                variant={'orange'}
                onClick={() => setIsEditing(true)}
                size="sm"
                className="gap-1.5 w-full cursor-pointer py-5 rounded-none hover:bg-amber-500 transition-all duration-300 ease-in-out"
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
