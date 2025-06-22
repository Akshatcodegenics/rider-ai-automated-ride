
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Star, Clock, Users, Phone } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your driver's location in real-time with precise GPS technology"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Advanced safety features including SOS, trip sharing, and verified drivers"
    },
    {
      icon: Star,
      title: "Rated Drivers",
      description: "All drivers are verified and rated by the community for your peace of mind"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Book rides anytime, anywhere with our round-the-clock service"
    },
    {
      icon: Users,
      title: "AI Assistant",
      description: "Get instant help and book rides through our intelligent chatbot"
    },
    {
      icon: Phone,
      title: "Customer Support",
      description: "24/7 customer support with multiple contact options"
    }
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Rider?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next generation of ride-sharing with cutting-edge technology and unmatched convenience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
