
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, X, Mic, MicOff, Zap, MapPin, Car, Calendar, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  isVoice?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize AI chatbot with enhanced features
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "Hi! I'm your smart ride assistant! 🚗✨ I can help you book rides, find the best routes, split payments, schedule trips, and much more. What would you like to do today?",
        timestamp: new Date(),
        quickActions: [
          {
            id: 'book-ride',
            label: 'Book Ride',
            icon: <Car className="h-4 w-4" />,
            action: () => handleQuickAction("I want to book a ride")
          },
          {
            id: 'find-route',
            label: 'Best Route',
            icon: <MapPin className="h-4 w-4" />,
            action: () => handleQuickAction("Show me the best route options")
          },
          {
            id: 'schedule',
            label: 'Schedule Ride',
            icon: <Calendar className="h-4 w-4" />,
            action: () => handleQuickAction("I want to schedule a ride for later")
          },
          {
            id: 'rewards',
            label: 'My Rewards',
            icon: <Gift className="h-4 w-4" />,
            action: () => handleQuickAction("Show my loyalty points and rewards")
          }
        ]
      };
      setMessages([welcomeMessage]);
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI() as SpeechRecognition;
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-IN';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript, true);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input failed",
          description: "Please try again or type your message",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  const handleSendMessage = (content?: string, isVoice = false) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with intelligent logic
    setTimeout(() => {
      const botResponse = generateAIResponse(messageContent);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let content = '';
    let quickActions: QuickAction[] = [];

    // Enhanced AI logic with contextual responses
    if (input.includes('book') || input.includes('ride')) {
      content = "I'll help you book a ride! 🚗 To get started, I need your pickup and destination locations. You can also use voice commands by saying 'Book a ride from [pickup] to [destination]'. Would you like me to detect your current location?";
      quickActions = [
        {
          id: 'current-location',
          label: 'Use Current Location',
          icon: <MapPin className="h-4 w-4" />,
          action: () => handleQuickAction("Use my current location as pickup")
        },
        {
          id: 'voice-booking',
          label: 'Voice Booking',
          icon: <Mic className="h-4 w-4" />,
          action: () => handleQuickAction("I want to use voice booking")
        }
      ];
    } else if (input.includes('route') || input.includes('path')) {
      content = "I can show you multiple route options with real-time traffic, tolls, and eco-friendly alternatives! 🛣️ Each route includes:\n\n• Time estimates with traffic\n• Toll costs\n• Carbon footprint\n• Weather considerations\n\nWhich locations do you want routes between?";
      quickActions = [
        {
          id: 'fastest-route',
          label: 'Fastest Route',
          icon: <Zap className="h-4 w-4" />,
          action: () => handleQuickAction("Show me the fastest route")
        }
      ];
    } else if (input.includes('schedule') || input.includes('later')) {
      content = "Great! I can help you schedule rides in advance with smart reminders! 📅 You can:\n\n• Set one-time or recurring rides\n• Get traffic-aware notifications\n• Auto-adjust for weather conditions\n\nWhen would you like to schedule your ride?";
      quickActions = [
        {
          id: 'schedule-tomorrow',
          label: 'Tomorrow Morning',
          icon: <Calendar className="h-4 w-4" />,
          action: () => handleQuickAction("Schedule a ride for tomorrow morning")
        }
      ];
    } else if (input.includes('split') || input.includes('payment')) {
      content = "I can help you split ride costs with friends! 💰 Features include:\n\n• Equal or custom splits\n• QR code sharing\n• UPI, card, wallet payments\n• Real-time payment tracking\n\nHow many people are sharing this ride?";
    } else if (input.includes('reward') || input.includes('points') || input.includes('loyalty')) {
      content = "Here's your loyalty status! 🏆\n\n• Current points: 1,250 🪙\n• Next reward: Free ride at 1,500 points\n• Badges earned: 5/12\n• Eco rides: 15 🌱\n\nYou're 250 points away from a free ride! Take 5 more rides to unlock it.";
      quickActions = [
        {
          id: 'view-rewards',
          label: 'View All Rewards',
          icon: <Gift className="h-4 w-4" />,
          action: () => handleQuickAction("Show all available rewards")
        }
      ];
    } else if (input.includes('driver') || input.includes('eta')) {
      content = "I can show you nearby drivers with detailed info! 🚗👨‍✈️\n\n• Real-time locations\n• Driver ratings & reviews\n• Vehicle details\n• Estimated arrival times\n• Safety scores\n\nCurrently 8 drivers available in your area with average ETA of 4 minutes.";
    } else if (input.includes('safety') || input.includes('emergency')) {
      content = "Your safety is our priority! 🛡️ Available features:\n\n• Emergency SOS button\n• Live location sharing\n• Driver verification\n• 24/7 support\n• Trip monitoring\n\nThe SOS button is always visible in the top-left corner for instant emergency assistance.";
    } else if (input.includes('eco') || input.includes('environment') || input.includes('green')) {
      content = "Love your eco-consciousness! 🌱 Green features include:\n\n• Eco-friendly route options\n• Carbon footprint tracking\n• Electric vehicle options\n• Carpooling suggestions\n• Green rewards & badges\n\nYour eco-score: 85/100 - Keep it up!";
    } else if (input.includes('price') || input.includes('cost') || input.includes('fare')) {
      content = "Smart pricing with transparency! 💰 Features:\n\n• Real-time fare estimates\n• Dynamic pricing alerts\n• Multiple route cost comparison\n• Toll and traffic cost breakdown\n• Payment splitting options\n\nI can show exact costs once you provide pickup and destination.";
    } else if (input.includes('weather') || input.includes('rain') || input.includes('traffic')) {
      content = "Smart routing considers live conditions! 🌦️\n\n• Real-time weather updates\n• Traffic pattern analysis\n• Route adjustments for conditions\n• Driver notifications\n• ETA updates\n\nCurrent conditions: Light traffic, clear weather. Perfect for your ride!";
    } else if (input.includes('cancel') || input.includes('refund')) {
      content = "I can help with cancellations and refunds! 📋\n\n• Free cancellation within 5 minutes\n• Instant refunds for eligible cancellations\n• Rescheduling options\n• Driver compensation for late cancellations\n\nNeed to cancel a current or scheduled ride?";
    } else if (input.includes('help') || input.includes('support')) {
      content = "I'm here to help with everything! 🤖 I can assist with:\n\n🚗 Booking & scheduling rides\n🛣️ Route planning & optimization\n💰 Payments & splitting costs\n🏆 Rewards & loyalty points\n🛡️ Safety features\n🌱 Eco-friendly options\n📱 Voice commands\n\nWhat specific help do you need?";
    } else if (input.includes('voice') || input.includes('speak')) {
      content = "Voice features are active! 🎙️ You can:\n\n• Say 'Book a ride from [pickup] to [destination]'\n• Use voice for location input\n• Get audio confirmations\n• Hands-free interaction\n\nTry the microphone button to start voice booking!";
      quickActions = [
        {
          id: 'start-voice',
          label: 'Start Voice Command',
          icon: <Mic className="h-4 w-4" />,
          action: () => startListening()
        }
      ];
    } else {
      // Default intelligent response
      content = "I understand you're looking for assistance! 🤖 I'm equipped with advanced AI to help with:\n\n• Intelligent ride booking\n• Smart route optimization\n• Payment solutions\n• Ride scheduling\n• Loyalty rewards\n• Safety features\n\nCould you be more specific about what you'd like to do?";
      quickActions = [
        {
          id: 'main-features',
          label: 'Show Main Features',
          icon: <Zap className="h-4 w-4" />,
          action: () => handleQuickAction("Show me all main features")
        }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      quickActions
    };
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
      toast({
        title: "🎙️ Listening...",
        description: "Speak your request clearly",
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 transition-all duration-300 hover:scale-110"
        size="lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </Button>

      {/* Enhanced chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[32rem] shadow-2xl z-40 border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              Smart AI Assistant
              <Badge variant="secondary" className="ml-auto text-xs bg-white/20 text-white border-0">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col h-80 p-0">
            {/* Messages area with enhanced styling */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      {message.isVoice && (
                        <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
                          <Mic className="h-3 w-3" />
                          Voice message
                        </div>
                      )}
                      
                      {/* Quick actions */}
                      {message.quickActions && message.quickActions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.quickActions.map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant="outline"
                              onClick={action.action}
                              className="text-xs h-7 bg-white/80 hover:bg-white border-gray-300"
                            >
                              {action.icon}
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Enhanced input area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your ride..."
                    className="pr-12 rounded-full border-gray-300 focus:border-blue-500"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 ${
                      isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-600'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                🎙️ Voice enabled • 🧠 AI powered • 🚗 Ride optimized
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
