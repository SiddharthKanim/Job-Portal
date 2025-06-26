import React from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from 'lucide-react';

const ContactInfo = () => {
  return (
    
    <div className="bg-white rounded-lg shadow-md p-8 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-800">Email Us</h3>
            <p className="mt-1 text-gray-600">Our friendly team is here to help.</p>
            <a
              href="mailto:support@jobportal.com"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              jobportal.professional@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-blue-100 rounded-full">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-800">Call Us</h3>
            <p className="mt-1 text-gray-600">Mon-Fri from 9am to 6pm (EST).</p>
            <a
              href="tel:+18001234567"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              +91 7045484935
            </a>
          </div>
        </div>

        

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-600" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-blue-600" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
              <Instagram className="h-5 w-5 text-gray-600 hover:text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
