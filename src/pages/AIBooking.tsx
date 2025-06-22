
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, Zap, Star, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AIBooking = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isBooking, setIsBooking] = useState(false);

  const handleAutomatedBooking = async () => {
    setIsBooking(true);
    
    setTimeout(() => {
      setIsBooking(false);
      alert('🤖 AI Automated Booking Activated! \n\n✅ Your rides have been scheduled automatically\n🚗 AI will assign best drivers daily\n💰 Fixed rate: $25 per ride\n📅 Duration: ' + startDate + ' to ' + endDate);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🤖 AI Automated Ride Booking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Set your routes once, and our AI will handle everything! 
              ✨ Automatic driver assignment • 🎯 Fixed pricing • 📅 Scheduled rides
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Zap className="h-8 w-8" />
                  Setup Automated Rides
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      📍 Pickup Location
                    </Label>
                    <Input
                      placeholder="🏠 Enter pickup address..."
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="mt-2 h-12 text-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                      🎯 Destination
                    </Label>
                    <Input
                      placeholder="🏢 Enter destination address..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="mt-2 h-12 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        📅 Start Date
                      </Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        📅 End Date
                      </Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      ⏰ Preferred Time
                    </Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">🔄 Frequency</Label>
                    <select 
                      className="w-full mt-2 h-12 px-4 border rounded-lg text-lg"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="daily">📅 Daily</option>
                      <option value="weekdays">🏢 Weekdays Only</option>
                      <option value="weekends">🎉 Weekends Only</option>
                      <option value="custom">⚙️ Custom Schedule</option>
                    </select>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                  disabled={!pickup || !destination || !startDate || !endDate || isBooking}
                  onClick={handleAutomatedBooking}
                >
                  {isBooking ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      🤖 AI Processing...
                    </div>
                  ) : (
                    '🚀 Activate AI Booking'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Features & Pricing */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
                    <Star className="h-6 w-6" />
                    ✨ AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <h4 className="font-semibold">Smart Driver Assignment</h4>
                      <p className="text-sm text-gray-600">AI selects best available drivers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <span className="text-2xl">💰</span>
                    <div>
                      <h4 className="font-semibold">Fixed Pricing</h4>
                      <p className="text-sm text-gray-600">No surge pricing, predictable costs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <span className="text-2xl">📱</span>
                    <div>
                      <h4 className="font-semibold">Auto Notifications</h4>
                      <p className="text-sm text-gray-600">SMS & app alerts before each ride</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
                    <CreditCard className="h-6 w-6" />
                    💳 Pricing & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-white/70 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">$25</div>
                    <div className="text-lg text-gray-700">per ride</div>
                    <div className="text-sm text-gray-500 mt-2">Fixed rate • No hidden fees</div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    size="lg"
                  >
                    💳 Setup Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIBooking;
