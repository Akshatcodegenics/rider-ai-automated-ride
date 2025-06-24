
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Route, Bell, Gift, Users, Calendar, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import RealisticMapComponent from "@/components/RealisticMapComponent";
import VehicleSelector from "@/components/VehicleSelector";
import RideBookingForm from "@/components/RideBookingForm";
import AIChatbot from "@/components/AIChatbot";
import VoiceBooking from "@/components/VoiceBooking";
import EmergencySOS from "@/components/EmergencySOS";
import DriverSimulation from "@/components/DriverSimulation";
import RoutePreview from "@/components/RoutePreview";
import SavedLocations from "@/components/SavedLocations";
import RideScheduler from "@/components/RideScheduler";
import PaymentSplitter from "@/components/PaymentSplitter";
import LoyaltyRewards from "@/components/LoyaltyRewards";
import NotificationCenter from "@/components/NotificationCenter";

type ActiveTab = 'book' | 'schedule' | 'split' | 'rewards';

const BookRide = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('taxi');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [femaleDriverPreference, setFemaleDriverPreference] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);
  const [activeTab, setActiveTab] = useState<ActiveTab>('book');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const handleVoiceLocationDetected = (voicePickup: string, voiceDestination: string) => {
    setPickup(voicePickup);
    setDestination(voiceDestination);
  };

  const handleBookRide = async () => {
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination locations');
      return;
    }
    
    setIsBooking(true);
    
    const bookingData = {
      pickup,
      destination,
      vehicleType: selectedVehicle,
      estimatedFare,
      femaleDriverPreference,
      selectedRoute,
      selectedDriver,
      timestamp: new Date().toISOString()
    };
    
    console.log('Advanced booking with data:', bookingData);
    
    setTimeout(() => {
      setIsBooking(false);
      
      const earnedPoints = Math.floor(estimatedFare * 0.1);
      setLoyaltyPoints(prev => prev + earnedPoints);
      
      alert(`🚗 Smart Ride Booked Successfully! 
      
✅ Pickup: ${pickup}
🎯 Destination: ${destination}
🚙 Vehicle: ${selectedVehicle.toUpperCase()}
💰 Fare: ₹${estimatedFare.toFixed(2)}
${femaleDriverPreference ? '👩 Female Driver: Requested' : ''}
${selectedRoute ? `🛣️ Route: ${selectedRoute.name}` : ''}
${selectedDriver ? `👨‍✈️ Driver: ${selectedDriver.name}` : ''}
🏆 Points Earned: +${earnedPoints}

🕐 Driver will arrive in 5-8 minutes.
📱 Track your ride in real-time!`);
    }, 2000);
  };

  const handlePaymentComplete = (splitDetails: any) => {
    console.log('Payment completed:', splitDetails);
  };

  const finalFare = femaleDriverPreference ? estimatedFare * 1.15 : estimatedFare;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ActiveTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <EmergencySOS userLocation={userLocation} />
      
      <Button
        className="fixed top-20 right-20 z-40 rounded-full w-12 h-12 shadow-xl bg-white hover:bg-gray-50 text-gray-700"
        onClick={() => setShowNotifications(true)}
      >
        <Bell className="h-5 w-5" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">3</span>
        </div>
      </Button>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Smart Ride</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Next-generation ride booking with AI optimization, voice commands, payment splitting, and comprehensive safety features
            </p>
            
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Zap className="h-3 w-3 mr-1" />
                AI Optimized
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                🌱 Eco Friendly
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                🎙️ Voice Enabled
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                🏆 Rewards Integrated
              </Badge>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-lg p-1 flex">
              {[
                { id: 'book', label: 'Book Ride', icon: <DollarSign className="h-4 w-4" /> },
                { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
                { id: 'split', label: 'Split Pay', icon: <Users className="h-4 w-4" /> },
                { id: 'rewards', label: 'Rewards', icon: <Gift className="h-4 w-4" /> }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex items-center gap-2 px-6"
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'book' && (
                <>
                  <RideBookingForm 
                    pickup={pickup}
                    setPickup={setPickup}
                    destination={destination}
                    setDestination={setDestination}
                    onEstimateChange={setEstimatedFare}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <VoiceBooking onLocationDetected={handleVoiceLocationDetected} />
                    <SavedLocations 
                      onLocationSelect={(address) => {
                        if (!pickup) setPickup(address);
                        else if (!destination) setDestination(address);
                      }}
                    />
                  </div>
                  
                  {pickup && destination && (
                    <RoutePreview
                      pickup={pickup}
                      destination={destination}
                      onRouteSelect={setSelectedRoute}
                    />
                  )}
                  
                  <VehicleSelector 
                    selectedVehicle={selectedVehicle}
                    onVehicleSelect={setSelectedVehicle}
                    estimatedFare={estimatedFare}
                    femaleDriverPreference={femaleDriverPreference}
                    onFemaleDriverToggle={setFemaleDriverPreference}
                  />

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-green-600">₹</span>
                        AI-Powered Smart Fare
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Base Fare:</span>
                          <span className="text-lg font-semibold">₹{estimatedFare.toFixed(2)}</span>
                        </div>
                        
                        {selectedRoute && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Route Optimization:</span>
                            <span className="text-sm text-blue-600">
                              {selectedRoute.name} (+₹{((selectedRoute.fare || estimatedFare) - estimatedFare).toFixed(2)})
                            </span>
                          </div>
                        )}
                        
                        {femaleDriverPreference && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Female Driver Preference:</span>
                            <span className="text-lg font-semibold text-pink-600">+₹{(estimatedFare * 0.15).toFixed(2)}</span>
                          </div>
                        )}
                        
                        <hr className="my-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">Total Estimated:</span>
                          <span className="text-2xl font-bold text-green-600">₹{finalFare.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Loyalty Points to Earn:</span>
                          <span className="font-semibold text-purple-600">+{Math.floor(finalFare * 0.1)} points</span>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        *AI-powered dynamic pricing based on traffic, weather, demand, and route optimization
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                    disabled={!pickup || !destination || isBooking}
                    onClick={handleBookRide}
                  >
                    {isBooking ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking AI-Optimized Ride...
                      </div>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Book Smart Ride Now - ₹{finalFare.toFixed(2)}
                      </>
                    )}
                  </Button>
                </>
              )}

              {activeTab === 'schedule' && (
                <RideScheduler
                  pickup={pickup}
                  destination={destination}
                  estimatedFare={finalFare}
                  selectedVehicle={selectedVehicle}
                />
              )}

              {activeTab === 'split' && (
                <PaymentSplitter
                  totalFare={finalFare}
                  onPaymentComplete={handlePaymentComplete}
                />
              )}

              {activeTab === 'rewards' && (
                <LoyaltyRewards
                  currentPoints={loyaltyPoints}
                  onPointsUpdate={setLoyaltyPoints}
                />
              )}
            </div>

            <div className="space-y-6">
              <RealisticMapComponent 
                pickup={pickup} 
                destination={destination}
                selectedRoute={selectedRoute}
                onLocationSelect={(location) => {
                  if (location.pickup) setPickup(location.pickup);
                  if (location.destination) setDestination(location.destination);
                }}
              />
              
              {userLocation && (
                <DriverSimulation
                  userLocation={userLocation}
                  onDriverSelect={setSelectedDriver}
                />
              )}
              
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{loyaltyPoints}</div>
                    <div className="text-sm opacity-90">Loyalty Points</div>
                    <div className="text-xs opacity-75 mt-1">
                      {(1500 - loyaltyPoints)} points to next reward
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <AIChatbot />
    </div>
  );
};

export default BookRide;
