'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Smartphone, Laptop, Trash2, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SessionManagerProps {
  userId: string;
}

export function SessionManager({ userId }: SessionManagerProps) {
  const [revokeSessionId, setRevokeSessionId] = useState<string | null>(null);
  const [showRevokeAll, setShowRevokeAll] = useState(false);

  // Fetch user sessions
  const sessions = useQuery(api.auth.getUserSessions, {
    userId: userId as Id<'users'>,
  });

  // Mutations
  const revokeSessionMutation = useMutation(api.auth.revokeSession);
  const revokeAllOtherSessionsMutation = useMutation(
    api.auth.revokeAllOtherSessions,
  );

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionMutation({
        sessionId: sessionId as Id<'sessions'>,
      });
      toast.success('Session revoked');
    } catch (error) {
      toast.error('Failed to revoke session');
    }
    setRevokeSessionId(null);
  };

  const handleRevokeAllOthers = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      await revokeAllOtherSessionsMutation({
        userId: userId as Id<'users'>,
        currentToken: token,
      });
      toast.success('All other sessions revoked');
    } catch (error) {
      toast.error('Failed to revoke sessions');
    }
    setShowRevokeAll(false);
  };

  const getDeviceIcon = (deviceName: string) => {
    if (
      deviceName.includes('iPhone') ||
      deviceName.includes('iPad') ||
      deviceName.includes('Android')
    ) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Laptop className="w-5 h-5" />;
  };

  const isLoading = sessions === undefined;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your account access across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading sessions...
            </div>
          ) : sessions && sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active sessions
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {sessions?.map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-gray-600 dark:text-gray-400">
                        {getDeviceIcon(session.deviceName)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{session.deviceName}</div>
                        <div className="text-sm text-gray-500">
                          IP: {session.ipAddress}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {session.isCurrentSession ? (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              Current device
                            </span>
                          ) : (
                            <>
                              Last active:{' '}
                              {formatDistanceToNow(
                                new Date(session.lastActivityAt),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Signed in:{' '}
                          {formatDistanceToNow(new Date(session.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrentSession && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRevokeSessionId(session._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {sessions && sessions.length > 1 && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200"
                    onClick={() => setShowRevokeAll(true)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out from all other devices
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Revoke Single Session Dialog */}
      <Dialog
        open={!!revokeSessionId}
        onOpenChange={(open) => !open && setRevokeSessionId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session?</DialogTitle>
            <DialogDescription>
              This will sign out this device. You can sign in again anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeSessionId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                revokeSessionId && handleRevokeSession(revokeSessionId)
              }
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke All Sessions Dialog */}
      <Dialog open={showRevokeAll} onOpenChange={setShowRevokeAll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out from All Other Devices?</DialogTitle>
            <DialogDescription>
              This action will sign out all other devices but keep your current
              session active. You can always sign in again if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeAll(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAllOthers}>
              Sign Out All Others
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
