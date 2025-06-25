
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Shield, Star, Users, Phone, Camera, Heart, Package, Dog, Calendar, BarChart3, DollarSign, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";
import CustomerReviews from "@/components/CustomerReviews";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const advancedFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Panic Button & Live Tracking",
      description: "Alert emergency contacts and share real-time GPS location instantly",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Camera className="h-8 w-8 text-blue-500" />,
      title: "Facial Recognition Verification",
      description: "Verify driver matches registered photo before starting trip",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-500" />,
      title: "Driver-User Matchmaking",
      description: "Select favorite drivers to ride with again, Tinder-style",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Package className="h-8 w-8 text-green-500" />,
      title: "Parcel Delivery Mode",
      description: "Send small items with nearby drivers, like Uber Connect",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Dog className="h-8 w-8 text-yellow-500" />,
      title: "Pet Ride Mode",
      description: "Filter drivers who accept pets with safety kits",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      title: "Event Mode",
      description: "Book round-trip rides for concerts/events with price lock",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const adminFeatures = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      title: "Heatmap Dashboard",
      description: "Real-time demand areas and driver distribution"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Dynamic Pricing Control",
      description: "Admin tool for pricing simulation and forecasting"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Auto Incentive Engine",
      description: "Automatic driver incentives in low-driver areas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <HeroSection />
      
      {/* Advanced Features Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Next-generation ride booking with cutting-edge safety and convenience features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/book-ride">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                🚗 Experience Advanced Booking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <ServicesSection />
      <StatsSection />
      
      {/* Admin Panel Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📊 Admin Panel Upgrades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools for managing your ride-sharing platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {adminFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/admin-panel">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4">
                🔧 Access Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <div id="reviews" className="py-16">
        <CustomerReviews />
      </div>
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
