
import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: "1M+", label: "Happy Riders" },
    { number: "50K+", label: "Active Drivers" },
    { number: "100+", label: "Cities" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by millions worldwide
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join the growing community of riders and drivers who choose Rider for their daily transportation needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
