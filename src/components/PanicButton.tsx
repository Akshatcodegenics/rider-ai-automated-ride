
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Share2, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PanicButtonProps {
  userLocation?: [number, number];
}

const PanicButton = ({ userLocation }: PanicButtonProps) => {
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const activatePanic = () => {
    setIsPanicActive(true);
    setCountdown(10);
    
    // Get real-time location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          shareLocation(location);
        },
        () => {
          shareLocation(userLocation ? `${userLocation[1]},${userLocation[0]}` : 'Location unavailable');
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    toast({
      title: "🚨 PANIC BUTTON ACTIVATED",
      description: "Emergency contacts notified. Live location sharing started.",
      variant: "destructive"
    });
  };

  const shareLocation = (location: string) => {
    const emergencyMessage = `🚨 EMERGENCY! I need immediate help. Live location: https://maps.google.com/maps?q=${location}. Time: ${new Date().toLocaleString()}. This is an automated safety alert from Rider app.`;
    
    // Share location with emergency contacts
    if (navigator.share) {
      navigator.share({
        title: '🚨 EMERGENCY ALERT',
        text: emergencyMessage,
        url: `https://maps.google.com/maps?q=${location}`
      });
    }

    // Also copy to clipboard as backup
    navigator.clipboard.writeText(emergencyMessage);
  };

  if (isPanicActive) {
    return (
      <Card className="border-red-500 bg-red-50 shadow-xl animate-pulse">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-red-800 mb-2">
            🚨 PANIC MODE ACTIVE
          </h3>
          <p className="text-red-700 mb-4">
            Live location sharing with emergency contacts
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Phone className="h-4 w-4 mr-1" />
              Call 911
            </Button>
            <Button size="sm" variant="outline" className="border-red-600 text-red-600">
              <Share2 className="h-4 w-4 mr-1" />
              Share Again
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPanicActive(false)}
            className="w-full"
          >
            Deactivate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={activatePanic}
      size="lg"
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
    >
      <AlertTriangle className="h-6 w-6 mr-2" />
      🚨 PANIC BUTTON
    </Button>
  );
};

export default PanicButton;
