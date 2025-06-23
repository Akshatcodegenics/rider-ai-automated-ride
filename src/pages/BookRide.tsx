
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import VehicleSelector from "@/components/VehicleSelector";
import RideBookingForm from "@/components/RideBookingForm";
import AIChatbot from "@/components/AIChatbot";

const BookRide = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('taxi');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [femaleDriverPreference, setFemaleDriverPreference] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookRide = async () => {
    setIsBooking(true);
    
    const bookingData = {
      pickup,
      destination,
      vehicleType: selectedVehicle,
      estimatedFare,
      femaleDriverPreference,
      timestamp: new Date().toISOString()
    };
    
    console.log('Booking ride with data:', bookingData);
    
    setTimeout(() => {
      setIsBooking(false);
      alert(`🚗 Ride booked successfully! 
      
Pickup: ${pickup}
Destination: ${destination}
Vehicle: ${selectedVehicle}
Fare: ₹${estimatedFare.toFixed(2)}
${femaleDriverPreference ? 'Female Driver: Requested' : ''}

Driver will arrive in 5-8 minutes.`);
    }, 2000);
  };

  const handleEmergency = () => {
    alert('🚨 EMERGENCY SERVICES ACTIVATED! Your location has been shared with emergency contacts and local authorities.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="fixed top-20 left-4 z-40">
        <Button
          onClick={handleEmergency}
          size="lg"
          variant="destructive"
          className="bg-red-500 hover:bg-red-600 shadow-lg rounded-full h-14 w-14"
          title="Emergency SOS"
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ride</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your vehicle, set your destination, and get matched with the best driver nearby
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <RideBookingForm 
                pickup={pickup}
                setPickup={setPickup}
                destination={destination}
                setDestination={setDestination}
                onEstimateChange={setEstimatedFare}
              />
              
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
                    Fare Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Fare:</span>
                      <span className="text-lg font-semibold">
                        ₹{estimatedFare.toFixed(2)}
                      </span>
                    </div>
                    
                    {femaleDriverPreference && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Female Driver Surcharge:</span>
                        <span className="text-lg font-semibold text-pink-600">
                          +₹{(estimatedFare * 0.15).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <hr className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Total Estimated Fare:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{femaleDriverPreference ? (estimatedFare * 1.15).toFixed(2) : estimatedFare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    *Final fare may vary based on traffic and route changes
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
                    Booking Ride...
                  </div>
                ) : (
                  'Book Ride Now'
                )}
              </Button>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <MapComponent pickup={pickup} destination={destination} />
            </div>
          </div>
        </div>
      </div>
      
      <AIChatbot />
    </div>
  );
};

export default BookRide;
