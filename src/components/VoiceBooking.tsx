
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface VoiceBookingProps {
  onLocationDetected: (pickup: string, destination: string) => void;
}

const VoiceBooking = ({ onLocationDetected }: VoiceBookingProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-IN'; // Indian English
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        speak("I'm listening. Say something like 'Book a ride from Connaught Place to Mumbai Airport'");
      };
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcriptResult);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak("Sorry, I couldn't understand. Please try again.");
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Extract locations using various patterns
    const patterns = [
      /book a ride from (.+?) to (.+)/,
      /go from (.+?) to (.+)/,
      /take me from (.+?) to (.+)/,
      /ride from (.+?) to (.+)/,
      /from (.+?) to (.+)/
    ];
    
    for (const pattern of patterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        const pickup = match[1].trim();
        const destination = match[2].trim();
        
        speak(`Great! I'll book a ride from ${pickup} to ${destination}`);
        onLocationDetected(pickup, destination);
        return;
      }
    }
    
    // If no pattern matches, try to extract destinations
    if (lowerCommand.includes('book') || lowerCommand.includes('ride')) {
      speak("I heard you want to book a ride. Please say 'from [pickup location] to [destination]'");
    } else {
      speak("I didn't understand the booking request. Try saying 'Book a ride from [your location] to [destination]'");
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-4 bg-gray-50 border-dashed">
        <div className="text-center text-gray-600">
          <Volume2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Voice booking is not supported in this browser</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-2 border-dashed border-blue-200 bg-blue-50/50">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <Volume2 className="h-5 w-5" />
          <span className="font-medium">Voice Booking</span>
        </div>
        
        <p className="text-sm text-gray-600">
          Say: "Book a ride from [pickup] to [destination]"
        </p>
        
        <Button
          onClick={isListening ? stopListening : startListening}
          className={`w-full ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          size="lg"
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Booking
            </>
          )}
        </Button>
        
        {transcript && (
          <div className="mt-3 p-2 bg-white rounded border text-sm">
            <span className="text-gray-600">You said: </span>
            <span className="font-medium">{transcript}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceBooking;
