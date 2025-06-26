import React from 'react';
import ContactHeader from '../components/Contact/ContactHeader';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import ContactFaq from '../components/Contact/ContactFaq';

const Contact = () => {
  return (
    <div className="w-full">
      <ContactHeader />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 space-y-20 ">
        {/* Full-width ContactInfo */}
        <div>
          <ContactInfo />
        </div>

        {/* Full-width ContactFaq */}
        <div>
          <ContactFaq />
        </div>
      </div>
    </div>
  );
};

export default Contact;
