
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Car, Gift, AlertTriangle, Calendar, MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'ride' | 'promotion' | 'alert' | 'reminder' | 'social' | 'rating';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'ride' | 'promotion'>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [isOpen]);

  const loadNotifications = () => {
    // Simulate notifications - in real app, these would come from API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'ride',
        title: 'Driver Arriving Soon',
        message: 'Your driver Rajesh is 2 minutes away. Vehicle: DL 12X 3456',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: false,
        priority: 'high',
        actionable: true,
        actionText: 'Track Driver',
        actionUrl: '/track'
      },
      {
        id: '2',
        type: 'promotion',
        title: '🎉 Special Offer!',
        message: 'Get 25% off your next 3 rides. Use code SAVE25. Valid till tomorrow!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        actionable: true,
        actionText: 'Use Now',
        actionUrl: '/book'
      },
      {
        id: '3',
        type: 'alert',
        title: 'Route Update',
        message: 'Traffic alert on your usual route to work. Consider leaving 15 mins early.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        priority: 'medium',
        actionable: false
      },
      {
        id: '4',
        type: 'reminder',
        title: 'Scheduled Ride Reminder',
        message: 'Your ride to airport is scheduled for tomorrow 8:00 AM',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        actionable: true,
        actionText: 'View Details',
        actionUrl: '/scheduled'
      },
      {
        id: '5',
        type: 'social',
        title: 'Friend Joined!',
        message: 'Your friend Priya just joined using your referral code. You earned 100 points!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low',
        actionable: false
      },
      {
        id: '6',
        type: 'rating',
        title: 'Rate Your Recent Ride',
        message: 'How was your ride with Suresh? Your feedback helps us improve.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isRead: false,
        priority: 'low',
        actionable: true,
        actionText: 'Rate Now',
        actionUrl: '/rate'
      }
    ];

    setNotifications(mockNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification center is now up to date",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleAction = (notification: Notification) => {
    if (notification.actionUrl) {
      // In real app, this would navigate to the URL
      toast({
        title: "Action triggered",
        description: `Navigating to ${notification.actionText}`,
      });
    }
    markAsRead(notification.id);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ride': return <Car className="h-4 w-4 text-blue-600" />;
      case 'promotion': return <Gift className="h-4 w-4 text-green-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'reminder': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'social': return <MessageSquare className="h-4 w-4 text-pink-600" />;
      case 'rating': return <Star className="h-4 w-4 text-yellow-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-white';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'ride') return notif.type === 'ride';
    if (filter === 'promotion') return notif.type === 'promotion';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 mt-3">
            {(['all', 'unread', 'ride', 'promotion'] as const).map(filterType => (
              <Button
                key={filterType}
                size="sm"
                variant={filter === filterType ? 'default' : 'outline'}
                onClick={() => setFilter(filterType)}
                className="text-xs capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-y-auto max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${getPriorityColor(notif.priority)} ${
                      !notif.isRead ? 'font-medium' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notif.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">
                            {notif.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notif.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notif.timestamp)}
                          </span>
                          
                          {notif.actionable && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(notif)}
                              className="text-xs"
                            >
                              {notif.actionText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {unreadCount > 0 && (
            <div className="p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="w-full"
              >
                Mark All as Read
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
