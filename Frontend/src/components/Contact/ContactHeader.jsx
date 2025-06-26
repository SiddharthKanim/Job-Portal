import React from 'react';
import { Headphones } from 'lucide-react';

const ContactHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              We're here to help with any questions about our job portal. 
              Our dedicated support team is ready to assist you.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <Headphones size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="font-medium">Average Response Time:</span>
              <span className="ml-2">Under 2 hours</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium">Support Hours:</span>
              <span className="ml-2">Mon-Fri, 9AM - 6PM EST</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium">Satisfaction Rate:</span>
              <span className="ml-2">98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHeader;
