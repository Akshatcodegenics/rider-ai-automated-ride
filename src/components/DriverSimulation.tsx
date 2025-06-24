
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Navigation, Phone } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  location: [number, number];
  isAvailable: boolean;
  rating: number;
  eta: number;
  vehicleNumber: string;
  fare: number;
  profilePhoto: string;
  completedTrips: number;
  safetyScore: number;
  punctualityScore: number;
  cleanlinessScore: number;
  badges: string[];
  isEcoFriendly: boolean;
  acceptsPets: boolean;
}

interface DriverSimulationProps {
  userLocation: [number, number] | null;
  onDriverSelect: (driver: Driver) => void;
}

const DriverSimulation = ({ userLocation, onDriverSelect }: DriverSimulationProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const generateRealisticDrivers = (center: [number, number]) => {
    const driverNames = ['Rajesh Kumar', 'Priya Sharma', 'Mohammad Ali', 'Sita Devi', 'Arjun Singh', 'Kavitha Nair', 'Suresh Patel', 'Amit Verma', 'Neha Gupta', 'Vikram Singh'];
    const vehicleTypes = ['bike', 'auto', 'taxi', 'suv', 'luxury'];
    const badges = ['Safe Driver', 'Eco Warrior', 'Pet Friendly', 'Top Rated', '5-Star', 'Punctual', 'Clean Vehicle'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `driver-${i}`,
      name: driverNames[i] || `Driver ${i + 1}`,
      vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      location: [
        center[0] + (Math.random() - 0.5) * 0.05,
        center[1] + (Math.random() - 0.5) * 0.05
      ] as [number, number],
      isAvailable: Math.random() > 0.2,
      rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
      eta: Math.floor(Math.random() * 12) + 2,
      vehicleNumber: `DL ${Math.floor(Math.random() * 99)}X ${Math.floor(Math.random() * 9999)}`,
      fare: Math.floor(Math.random() * 100) + 50,
      profilePhoto: `https://i.pravatar.cc/150?img=${i + 1}`,
      completedTrips: Math.floor(Math.random() * 500) + 50,
      safetyScore: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      punctualityScore: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      cleanlinessScore: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      badges: badges.slice(0, Math.floor(Math.random() * 3) + 1),
      isEcoFriendly: Math.random() > 0.6,
      acceptsPets: Math.random() > 0.7
    }));
  };

  useEffect(() => {
    if (userLocation) {
      const newDrivers = generateRealisticDrivers(userLocation);
      setDrivers(newDrivers);
      
      // Simulate driver movement every 5 seconds
      const interval = setInterval(() => {
        setDrivers(prev => prev.map(driver => ({
          ...driver,
          location: [
            driver.location[0] + (Math.random() - 0.5) * 0.001,
            driver.location[1] + (Math.random() - 0.5) * 0.001
          ] as [number, number],
          eta: Math.max(1, driver.eta + (Math.random() > 0.5 ? 1 : -1)),
          isAvailable: Math.random() > 0.1 ? driver.isAvailable : !driver.isAvailable
        })));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [userLocation]);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return '🏍️';
      case 'auto': return '🛺';
      case 'taxi': return '🚗';
      case 'suv': return '🚙';
      case 'luxury': return '🏎️';
      default: return '🚗';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Drivers ({drivers.filter(d => d.isAvailable).length})</h3>
      
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {drivers.filter(d => d.isAvailable).map(driver => (
          <Card 
            key={driver.id} 
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedDriver?.id === driver.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedDriver(driver);
              onDriverSelect(driver);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={driver.profilePhoto} 
                  alt={driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{driver.name}</h4>
                  <div className="text-lg">{getVehicleIcon(driver.vehicleType)}</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{driver.rating}</span>
                  <span>•</span>
                  <span>{driver.completedTrips} trips</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{driver.eta} min away</span>
                  <span>•</span>
                  <span className="font-semibold text-green-600">₹{driver.fare}</span>
                </div>
                
                <div className="flex gap-1 mt-2">
                  {driver.badges.slice(0, 2).map(badge => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                  {driver.isEcoFriendly && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      🌱 Eco
                    </Badge>
                  )}
                  {driver.acceptsPets && (
                    <Badge variant="outline" className="text-xs text-purple-600">
                      🐕 Pets OK
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverSimulation;
