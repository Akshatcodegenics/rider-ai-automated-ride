
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, AlertTriangle, Phone, MessageSquare, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Rider AI assistant. I can help you book rides, answer questions, or handle emergencies. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSOS = () => {
    const sosMessage: Message = {
      id: Date.now().toString(),
      text: 'SOS EMERGENCY ACTIVATED! 🚨 Your location has been shared with emergency contacts and local authorities. Stay calm, help is on the way.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sosMessage]);
    
    // Simulate emergency services activation
    console.log('SOS ACTIVATED: Emergency services contacted');
    alert('🚨 EMERGENCY ALERT: Your location has been shared with emergency contacts!');
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with common patterns
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('book') || lowercaseMessage.includes('ride')) {
      return 'I can help you book a ride! Please specify your pickup location and destination, or would you like me to use your current location?';
    }
    
    if (lowercaseMessage.includes('emergency') || lowercaseMessage.includes('help') || lowercaseMessage.includes('sos')) {
      return 'If this is an emergency, please use the SOS button immediately. For non-emergency assistance, I\'m here to help with your ride needs.';
    }
    
    if (lowercaseMessage.includes('female driver')) {
      return 'You can request a female driver during booking. This option ensures you\'re matched with verified female drivers for your safety and comfort.';
    }
    
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('fare')) {
      return 'Ride fares depend on distance, time, and vehicle type. You can get an instant estimate on the booking page before confirming your ride.';
    }
    
    if (lowercaseMessage.includes('cancel')) {
      return 'You can cancel your ride before the driver arrives. Cancellation fees may apply if cancelled after driver acceptance.';
    }
    
    // Default responses
    const responses = [
      'I understand you need assistance. Could you please provide more details about what you\'re looking for?',
      'I\'m here to help! You can ask me about booking rides, fares, safety features, or any other questions.',
      'Let me help you with that. What specific information do you need about our ride services?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { text: 'Book a ride', action: () => setInputText('I want to book a ride') },
    { text: 'Female driver', action: () => setInputText('I need a female driver') },
    { text: 'Fare estimate', action: () => setInputText('How much will my ride cost?') },
    { text: 'Cancel ride', action: () => setInputText('How do I cancel my ride?') }
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="h-full border-0 shadow-2xl">
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Rider AI Assistant
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleSOS}
                size="sm"
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 h-8 px-2"
              >
                <AlertTriangle className="h-4 w-4" />
                SOS
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t space-y-2">
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  size="sm"
                  variant="outline"
                  className="text-xs h-6 px-2"
                >
                  {action.text}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm" className="px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatbot;
