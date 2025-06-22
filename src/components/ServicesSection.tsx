
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      name: "RiderGo",
      description: "Affordable everyday rides",
      price: "From $5",
      features: ["Shared rides", "Eco-friendly", "Budget-friendly"],
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "RiderX",
      description: "Premium comfort rides",
      price: "From $12",
      features: ["Private rides", "Premium cars", "Professional drivers"],
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "RiderXL",
      description: "Group rides up to 6 people",
      price: "From $18",
      features: ["Large vehicles", "Group travel", "Extra luggage space"],
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ride</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From budget-friendly shared rides to premium comfort, we have the perfect option for every journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-4">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-white/90 mb-4">{service.description}</p>
                  <div className="text-3xl font-bold">{service.price}</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
