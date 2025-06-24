
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Phone, MapPin, Share, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencySOSProps {
  userLocation?: [number, number];
}

const EmergencySOS = ({ userLocation }: EmergencySOSProps) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emergencyContacts] = useState([
    { name: 'Police', number: '100' },
    { name: 'Ambulance', number: '108' },
    { name: 'Women Helpline', number: '1091' }
  ]);
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

  const activateEmergency = () => {
    setIsEmergencyActive(true);
    setCountdown(30); // 30 second countdown
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          shareEmergencyLocation(location);
        },
        () => {
          shareEmergencyLocation(userLocation ? `${userLocation[1]},${userLocation[0]}` : 'Location unavailable');
        }
      );
    }

    toast({
      title: "🚨 Emergency SOS Activated",
      description: "Your location is being shared with emergency contacts",
      variant: "destructive"
    });
  };

  const shareEmergencyLocation = (location: string) => {
    const message = `🚨 EMERGENCY ALERT! I need help. My current location: https://maps.google.com/maps?q=${location}. Time: ${new Date().toLocaleString()}`;
    
    // Share via Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Alert',
        text: message,
        url: `https://maps.google.com/maps?q=${location}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        toast({
          title: "Emergency info copied",
          description: "Location copied to clipboard. Share with emergency contacts."
        });
      });
    }
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(0);
    toast({
      title: "Emergency cancelled",
      description: "SOS alert has been cancelled",
    });
  };

  const callEmergency = (number: string) => {
    window.open(`tel:${number}`);
  };

  if (isEmergencyActive) {
    return (
      <Card className="border-red-500 bg-red-50 p-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <span className="font-bold text-lg">EMERGENCY ACTIVE</span>
          </div>
          
          {countdown > 0 && (
            <div className="bg-red-600 text-white rounded-lg p-3">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm">Auto-sharing location in</div>
              <div className="text-2xl font-bold">{countdown}s</div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-red-700">
              Your location is being shared with emergency services
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {emergencyContacts.map((contact) => (
                <Button
                  key={contact.number}
                  onClick={() => callEmergency(contact.number)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-xs"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {contact.name}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={cancelEmergency}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              Cancel Emergency
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Button
      onClick={activateEmergency}
      size="lg"
      variant="destructive"
      className="bg-red-500 hover:bg-red-600 shadow-lg rounded-full h-14 w-14 fixed top-20 left-4 z-50"
      title="Emergency SOS - Hold to activate"
    >
      <AlertTriangle className="h-6 w-6" />
    </Button>
  );
};

export default EmergencySOS;
