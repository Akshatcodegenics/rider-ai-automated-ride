
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Car, CreditCard, Star, AlertTriangle, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'ride',
      title: 'Ride Completed',
      message: 'Your ride from Connaught Place to Airport has been completed. Fare: ₹450',
      time: '2 minutes ago',
      read: false,
      icon: Car,
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of ₹450 has been processed successfully via UPI',
      time: '5 minutes ago',
      read: false,
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'rating',
      title: 'Rate Your Driver',
      message: 'How was your ride with Rajesh Kumar? Please rate your experience',
      time: '10 minutes ago',
      read: true,
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      type: 'promo',
      title: 'New Offer Available!',
      message: 'Get 30% off on your next 3 rides. Use code RIDE30',
      time: '1 hour ago',
      read: true,
      icon: Bell,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Driver Assignment',
      message: 'Priya Sharma is on the way to pick you up. ETA: 5 minutes',
      time: '2 hours ago',
      read: true,
      icon: AlertTriangle,
      color: 'bg-orange-500'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 mt-2">Stay updated with your rides and account activity</p>
            </div>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.icon;
                
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-all duration-300 hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full ${notification.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                                )}
                              </h3>
                              <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.type === 'rating' && !notification.read && (
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                                Rate Driver
                              </Button>
                              <Button size="sm" variant="outline">
                                Skip
                              </Button>
                            </div>
                          )}
                          
                          {notification.type === 'promo' && (
                            <div className="mt-4">
                              <Button size="sm" variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                Use Offer
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" className="text-gray-500">
                Load More Notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
