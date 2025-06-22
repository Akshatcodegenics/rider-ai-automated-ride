
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Careers = () => {
  const jobs = [
    {
      title: "🚗 Senior Driver Partner",
      location: "📍 Multiple Cities",
      type: "⏰ Full-time",
      salary: "💰 $50,000 - $70,000",
      description: "Join our elite driver network and earn premium rates with flexible schedules."
    },
    {
      title: "🤖 AI Engineer",
      location: "📍 Remote/San Francisco",
      type: "⏰ Full-time",
      salary: "💰 $120,000 - $180,000",
      description: "Build the future of transportation AI and ride optimization algorithms."
    },
    {
      title: "📱 Mobile App Developer",
      location: "📍 Remote",
      type: "⏰ Full-time",
      salary: "💰 $90,000 - $130,000",
      description: "Create amazing mobile experiences for millions of riders and drivers."
    },
    {
      title: "🎨 UX/UI Designer",
      location: "📍 New York",
      type: "⏰ Full-time",
      salary: "💰 $80,000 - $120,000",
      description: "Design intuitive and beautiful interfaces that delight our users."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💼 Join Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build the future of transportation with us! We're looking for passionate individuals who want to make a difference.
            </p>
          </div>

          <div className="grid gap-8 mb-16">
            {jobs.map((job, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">{job.salary}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">{job.description}</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                    🚀 Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🌟 Why Work With Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <span className="text-4xl mb-4 block">💡</span>
                <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
                <p className="text-gray-600">Work with cutting-edge AI and transportation technology</p>
              </div>
              <div>
                <span className="text-4xl mb-4 block">🎯</span>
                <h3 className="text-xl font-semibold mb-2">Flexible Work</h3>
                <p className="text-gray-600">Remote-friendly culture with work-life balance</p>
              </div>
              <div>
                <span className="text-4xl mb-4 block">📈</span>
                <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">Continuous learning and career advancement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
