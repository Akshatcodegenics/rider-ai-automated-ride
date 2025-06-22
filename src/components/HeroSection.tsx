
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your ride is just a
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> tap away</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience the future of transportation with Rider. Fast, safe, and reliable rides with real-time tracking and AI-powered customer support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                Book a Ride
              </Button>
              <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                Become a Driver
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Real-time tracking</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Ride Booking</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Your location</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Where to?</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Find Rides
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              AI Powered ✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
