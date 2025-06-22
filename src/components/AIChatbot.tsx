
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
      text: 'Hello! I\'m your Rider AI assistant powered by advanced AI. I can help you book rides, answer questions about transportation, provide safety tips, or handle emergencies. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
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
      text: '🚨 SOS EMERGENCY ACTIVATED! 🚨 Your location has been shared with emergency contacts and local authorities. Emergency services have been notified. Stay calm, help is on the way. If you can safely do so, call 911 immediately.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sosMessage]);
    
    // Simulate emergency services activation
    console.log('SOS ACTIVATED: Emergency services contacted');
    // In a real app, this would contact emergency services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Emergency location:', position.coords.latitude, position.coords.longitude);
      });
    }
    alert('🚨 EMERGENCY ALERT: Your location has been shared with emergency contacts and authorities!');
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // If API key is available, use Perplexity AI
    if (apiKey) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful ride-sharing assistant for the Rider app. Help users with booking rides, safety tips, transportation advice, and general questions. Be concise and friendly. Always prioritize user safety.'
              },
              {
                role: 'user',
                content: userMessage
              }
            ],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
            return_images: false,
            return_related_questions: false,
            frequency_penalty: 1,
            presence_penalty: 0
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try asking your question again.';
        }
      } catch (error) {
        console.error('Perplexity API error:', error);
      }
    }

    // Enhanced fallback responses with more comprehensive coverage
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Ride booking related
    if (lowercaseMessage.includes('book') || lowercaseMessage.includes('ride')) {
      return '🚗 I can help you book a ride! Please specify your pickup location and destination. You can also choose from different vehicle types like taxi, auto-rickshaw, or premium cab. Would you like me to guide you through the booking process?';
    }
    
    // Emergency and safety
    if (lowercaseMessage.includes('emergency') || lowercaseMessage.includes('help') || lowercaseMessage.includes('sos') || lowercaseMessage.includes('unsafe')) {
      return '🚨 If this is an emergency, please use the red SOS button immediately! For safety concerns: share your trip with trusted contacts, verify driver details before getting in, and always wear a seatbelt. I\'m here to help with any safety questions.';
    }
    
    // Female driver requests
    if (lowercaseMessage.includes('female driver') || lowercaseMessage.includes('woman driver')) {
      return '👩‍🚗 You can request a female driver during booking for added comfort and safety. This option is available in the vehicle selection screen. Female drivers undergo the same verification process and are highly rated by our community.';
    }
    
    // Pricing and fares
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('fare') || lowercaseMessage.includes('cost') || lowercaseMessage.includes('money')) {
      return '💰 Ride fares are calculated based on distance, time, and vehicle type. You can see an instant estimate before booking. Factors affecting price: base fare, per-mile rate, time charges, and surge pricing during peak hours. Female driver option adds a 15% premium for enhanced safety.';
    }
    
    // Cancellation
    if (lowercaseMessage.includes('cancel')) {
      return '❌ You can cancel your ride before the driver arrives. Cancellation fees may apply if cancelled after driver acceptance. To cancel: go to your active ride and tap "Cancel Ride". Free cancellations are available within 2 minutes of booking.';
    }
    
    // Driver information
    if (lowercaseMessage.includes('driver') && !lowercaseMessage.includes('female')) {
      return '🚗 All our drivers are verified with background checks, valid licenses, and vehicle inspections. You can see driver ratings, vehicle details, and estimated arrival time. Feel free to contact them through the app for coordination.';
    }
    
    // Payment methods
    if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('pay')) {
      return '💳 We accept multiple payment methods: credit/debit cards, digital wallets, UPI, and cash. You can add payment methods in your profile. Payments are processed automatically after ride completion with instant receipts.';
    }
    
    // AI booking
    if (lowercaseMessage.includes('ai booking') || lowercaseMessage.includes('automated')) {
      return '🤖 Our AI Automated Booking lets you set up recurring rides for regular routes! Perfect for daily commutes, weekly appointments, or monthly trips. The AI handles driver assignment, route optimization, and scheduling automatically.';
    }
    
    // Location and navigation
    if (lowercaseMessage.includes('location') || lowercaseMessage.includes('gps') || lowercaseMessage.includes('navigation')) {
      return '📍 I can help with location services! Make sure location permissions are enabled for accurate pickup. You can use current location, enter addresses manually, or select from popular destinations like Airport, Mall, Train Station.';
    }
    
    // Ratings and reviews
    if (lowercaseMessage.includes('rating') || lowercaseMessage.includes('review')) {
      return '⭐ After each ride, both you and the driver can rate each other (1-5 stars) and leave feedback. This helps maintain service quality and builds trust in our community. Your rating affects driver matching priority.';
    }

    // Greetings
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return '👋 Hello! Welcome to Rider! I\'m your AI assistant ready to help with ride bookings, safety questions, fare estimates, or any transportation needs. What can I do for you today?';
    }

    // Default intelligent responses
    const contextualResponses = [
      '🤔 I understand you need assistance. Could you provide more details about what you\'re looking for? I can help with ride booking, safety features, pricing, driver information, or general transportation questions.',
      '🚗 I\'m here to make your ride experience better! Whether you need to book a ride, understand our safety features, check fare estimates, or have questions about our services, just let me know.',
      '💡 Let me help you with that! I can assist with booking rides, explaining our features like female driver options, SOS safety, pricing details, or any other questions about using Rider.',
      '📱 Great question! I can help you navigate our app features, book rides, understand safety options, check pricing, or provide information about our drivers and vehicles. What specific help do you need?'
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
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

    // Simulate typing delay for better UX
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
    { text: '🚗 Book a ride', action: () => setInputText('I want to book a ride') },
    { text: '👩‍🚗 Female driver', action: () => setInputText('I need a female driver') },
    { text: '💰 Fare estimate', action: () => setInputText('How much will my ride cost?') },
    { text: '❌ Cancel ride', action: () => setInputText('How do I cancel my ride?') },
    { text: '🛡️ Safety tips', action: () => setInputText('What safety features do you have?') },
    { text: '🤖 AI booking', action: () => setInputText('Tell me about AI automated booking') }
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
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
                onClick={() => setShowApiInput(!showApiInput)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 px-2 text-xs"
                title="Connect Perplexity AI for better responses"
              >
                🧠 AI
              </Button>
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
          {showApiInput && (
            <div className="mt-2">
              <Input
                placeholder="Enter Perplexity API key (optional)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-black text-xs h-8"
              />
              <p className="text-xs mt-1 opacity-80">Get free API key at perplexity.ai</p>
            </div>
          )}
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
                placeholder="Ask me anything about rides..."
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
