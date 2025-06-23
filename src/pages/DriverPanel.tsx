
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Navigation, 
  Phone, 
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Calendar,
  Users,
  Route,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";

const DriverPanel = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState<any>(null);
  const [pendingRides, setPendingRides] = useState([
    {
      id: 1,
      pickup: "📍 Mall Road, Sector 15",
      destination: "🏢 Cyber City, Gurgaon",
      fare: 125,
      distance: "8.5 km",
      eta: "12 min",
      rider: "Priya Singh",
      rating: 4.8
    },
    {
      id: 2,
      pickup: "🏠 Residential Area, Block A",
      destination: "🏥 Max Hospital",
      fare: 85,
      distance: "5.2 km", 
      eta: "8 min",
      rider: "Raj Kumar",
      rating: 4.9
    }
  ]);

  const [stats] = useState({
    todayEarnings: 850,
    todayRides: 12,
    rating: 4.7,
    acceptance: 92
  });

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      alert('🟢 You are now ONLINE! Ride requests will start coming in.');
    } else {
      alert('🔴 You are now OFFLINE! No new ride requests will be received.');
    }
  };

  const handleAcceptRide = (rideId: number) => {
    const ride = pendingRides.find(r => r.id === rideId);
    if (ride) {
      setCurrentRide(ride);
      setPendingRides(prev => prev.filter(r => r.id !== rideId));
      alert(`✅ Ride accepted! Navigate to pickup: ${ride.pickup}`);
    }
  };

  const handleRejectRide = (rideId: number) => {
    setPendingRides(prev => prev.filter(r => r.id !== rideId));
    alert('❌ Ride rejected');
  };

  const handleCompleteRide = () => {
    if (currentRide) {
      alert(`🎉 Ride completed! You earned ₹${currentRide.fare}`);
      setCurrentRide(null);
    }
  };

  const handleCancelRide = () => {
    if (currentRide) {
      alert('❌ Ride cancelled. Returning to available rides.');
      setCurrentRide(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚗 Driver <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-600">
              Manage your rides, earnings, and availability
            </p>
          </div>

          {/* Status Toggle */}
          <div className="mb-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Status: {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                      </h3>
                      <p className="text-gray-600">
                        {isOnline ? 'Ready to accept rides' : 'Not accepting rides'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleToggleOnline}
                    size="lg"
                    className={`${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {isOnline ? <ToggleRight className="mr-2 h-5 w-5" /> : <ToggleLeft className="mr-2 h-5 w-5" />}
                    {isOnline ? 'Go Offline' : 'Go Online'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-green-600">₹{stats.todayEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rides Today</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.todayRides}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.rating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Acceptance</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.acceptance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Ride */}
            {currentRide && (
              <Card className="border-0 shadow-lg border-l-4 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-green-600" />
                    🚗 Current Ride
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">👤 Rider:</span>
                      <span>{currentRide.rider}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{currentRide.pickup}</span>
                      </div>
                      <div className="border-l-2 border-gray-300 ml-2 h-4"></div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{currentRide.destination}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>💰 Fare: <strong>₹{currentRide.fare}</strong></span>
                      <span>📏 Distance: {currentRide.distance}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCompleteRide}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        ✅ Complete Ride
                      </Button>
                      <Button
                        onClick={handleCancelRide}
                        variant="outline"
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Navigation className="mr-2 h-4 w-4" />
                        🗺️ Navigate
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        📞 Call Rider
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        💬 Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Ride Requests */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  🚨 Pending Ride Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isOnline ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Go online to receive ride requests</p>
                  </div>
                ) : pendingRides.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">🔍 Looking for rides near you...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRides.map((ride) => (
                      <div key={ride.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">👤 {ride.rider}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{ride.rating}</span>
                            </div>
                          </div>
                          <Badge variant="secondary">💰 ₹{ride.fare}</Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{ride.pickup}</span>
                          </div>
                          <div className="border-l-2 border-gray-300 ml-2 h-3"></div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600" />
                            <span className="text-sm">{ride.destination}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-gray-600">📏 {ride.distance}</span>
                          <span className="text-xs text-gray-600">⏱️ ETA: {ride.eta}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptRide(ride.id)}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            ✅ Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRide(ride.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                          >
                            ❌ Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPanel;
