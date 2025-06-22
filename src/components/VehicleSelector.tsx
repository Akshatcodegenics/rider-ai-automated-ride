
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Truck, Users, Crown } from "lucide-react";

interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicle: string) => void;
  estimatedFare: number;
}

const VehicleSelector = ({ selectedVehicle, onVehicleSelect, estimatedFare }: VehicleSelectorProps) => {
  const vehicles = [
    {
      id: 'taxi',
      name: 'Taxi',
      description: 'Affordable rides for everyday travel',
      icon: Car,
      capacity: '1-4 passengers',
      multiplier: 1,
      eta: '3-5 min',
      color: 'text-blue-600'
    },
    {
      id: 'cab',
      name: 'Premium Cab',
      description: 'Comfortable sedans with professional drivers',
      icon: Crown,
      capacity: '1-4 passengers',
      multiplier: 1.3,
      eta: '5-8 min',
      color: 'text-purple-600'
    },
    {
      id: 'auto',
      name: 'Auto Rickshaw',
      description: 'Quick and economical for short distances',
      icon: Truck,
      capacity: '1-3 passengers',
      multiplier: 0.7,
      eta: '2-4 min',
      color: 'text-green-600'
    },
    {
      id: 'suv',
      name: 'SUV',
      description: 'Spacious rides for groups and families',
      icon: Users,
      capacity: '1-6 passengers',
      multiplier: 1.8,
      eta: '8-12 min',
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Choose Your Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicles.map((vehicle) => {
            const VehicleIcon = vehicle.icon;
            const vehicleFare = estimatedFare * vehicle.multiplier;
            const isSelected = selectedVehicle === vehicle.id;
            
            return (
              <div
                key={vehicle.id}
                onClick={() => onVehicleSelect(vehicle.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${vehicle.color}`}>
                      <VehicleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{vehicle.capacity}</span>
                        <span className="text-xs text-gray-500">ETA: {vehicle.eta}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${vehicleFare.toFixed(2)}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-blue-600 font-medium">Selected</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
