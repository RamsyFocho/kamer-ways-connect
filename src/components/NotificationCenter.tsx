import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, MailOpen } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { notifications, isLoading, error, markAsRead } = useNotifications();

  if (isLoading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">Error loading notifications: {error.message}</div>;
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center"><BellRing className="mr-2" /> Notifications</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground">No new notifications.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-3 rounded-md ${notif.read ? 'bg-muted/50' : 'bg-primary/5'}`}>
                <p className="text-sm font-medium">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                {!notif.read && (
                  <Button variant="link" size="sm" onClick={() => markAsRead(notif.id)} className="p-0 h-auto mt-1">
                    <MailOpen className="h-3 w-3 mr-1" /> Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
