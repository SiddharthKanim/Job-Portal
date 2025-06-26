import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter the email address associated with your account, and we'll send you OTP to reset your password."
  },
  {
    id: 2,
    question: "How do I create a job posting?",
    answer: "Login to your Job Poster Account, navigate to the 'Post Jobs' section, and click on 'Post a New Job'. Fill out all the required information about the position and click 'Submit'. Your job will be published after a brief review process."
  },
  {
    id: 3,
    question: "How do I update my account information?",
    answer: "You can update your account information by going to your 'Profile Settings'. From there, you can modify your personal details, contact information, notification preferences, and more."
  },
  {
    id: 4,
    question: "When will I hear back after applying for a job?",
    answer: "Response times vary by employer. Some employers review applications immediately, while others may take several weeks. You can check the status of your applications in the 'Notifiaction' section of your account or on your registered email."
  }
  
];

const ContactFaq = () => {
  const [openItemId, setOpenItemId] = useState(1);
  
  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find quick answers to common questions. If you need more assistance, don't hesitate to contact us directly.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {faqs.map((faq) => (
          <div key={faq.id} className="py-4">
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
              {openItemId === faq.id ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openItemId === faq.id && (
              <div className="mt-3 text-gray-600 pr-12 transition-all duration-300 ease-in-out">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <h2 className="text-gray-600 mb-4">You can contact us using the email address above.</h2>
      </div>
    </div>
  );
};

export default ContactFaq;
