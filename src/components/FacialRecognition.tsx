
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CheckCircle, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacialRecognitionProps {
  driverPhoto?: string;
  onVerificationComplete: (verified: boolean) => void;
}

const FacialRecognition = ({ driverPhoto, onVerificationComplete }: FacialRecognitionProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const startVerification = async () => {
    setIsScanning(true);
    setShowCamera(true);
    
    // Simulate facial recognition process
    setTimeout(() => {
      const verified = Math.random() > 0.2; // 80% success rate simulation
      setIsScanning(false);
      setIsVerified(verified);
      setShowCamera(false);
      
      if (verified) {
        toast({
          title: "✅ Driver Verified!",
          description: "Facial recognition successful. Safe to proceed.",
        });
      } else {
        toast({
          title: "❌ Verification Failed",
          description: "Driver does not match registered photo. Please be cautious.",
          variant: "destructive"
        });
      }
      
      onVerificationComplete(verified);
    }, 3000);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          Driver Facial Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {driverPhoto && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">✓</span>
              </div>
            </div>
            <div>
              <div className="font-medium">Registered Driver Photo</div>
              <div className="text-sm text-gray-600">John Smith - License verified</div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="bg-black rounded-lg p-8 text-center">
            <Camera className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
            <div className="text-white">
              {isScanning ? 'Scanning driver face...' : 'Position camera towards driver'}
            </div>
            {isScanning && (
              <div className="mt-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {isVerified !== null && !isScanning && !showCamera && (
          <div className={`p-4 rounded-lg ${isVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Verification Successful</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Verification Failed</span>
                </>
              )}
            </div>
            <p className="text-sm mt-1 text-gray-600">
              {isVerified 
                ? 'Driver identity confirmed. You can proceed safely.'
                : 'Driver does not match registered photo. Consider canceling the ride.'
              }
            </p>
          </div>
        )}

        <Button
          onClick={startVerification}
          disabled={isScanning}
          className="w-full"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying Driver...
            </div>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Face Verification
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          🔒 Facial recognition data is processed locally and not stored
        </div>
      </CardContent>
    </Card>
  );
};

export default FacialRecognition;
