
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? Need support? Our team is here to help you 24/7
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Available 24/7 for immediate assistance</p>
              <p className="text-blue-600 font-semibold">+1 (555) 123-RIDE</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Come visit our headquarters</p>
              <p className="text-blue-600 font-semibold">123 Tech Avenue, Silicon Valley, CA</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Hours</h3>
              <p className="text-gray-600 mb-4">We're always here for you</p>
              <p className="text-blue-600 font-semibold">24/7 Customer Support</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start riding?</h3>
          <p className="text-gray-600 mb-6">Download our app and get your first ride for free!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Download for Android
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
