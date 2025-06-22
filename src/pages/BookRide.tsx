
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, User, DollarSign, Car, Truck, Users as UsersIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import VehicleSelector from "@/components/VehicleSelector";
import RideBookingForm from "@/components/RideBookingForm";

const BookRide = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('taxi');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
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
            {/* Left Panel - Booking Form */}
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
              />

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Fare Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Fare:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${estimatedFare.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    *Final fare may vary based on traffic and route changes
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                disabled={!pickup || !destination}
              >
                Book Ride Now
              </Button>
            </div>

            {/* Right Panel - Map */}
            <div className="lg:sticky lg:top-24 h-fit">
              <MapComponent pickup={pickup} destination={destination} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide;
