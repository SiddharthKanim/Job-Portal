import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  GraduationCap,
  Briefcase,
  Award,
  Code
} from 'lucide-react';
import { ResumePreview } from '../components/Resumebuilder/ResumePreview';
import { InputSlide } from '../components/Resumebuilder/InputSlide';

const initialResumeData = {
  contactInfo: {
    fullName: '',
    phone: '',
    email: '',
    linkedin: '',
    location: '',
  },
  summary: '',
  skills: [],
  languages: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
};

const slides = [
  { title: 'Contact Information', icon: Mail },
  { title: 'Professional Summary', icon: Award },
  { title: 'Education', icon: GraduationCap },
  { title: 'Skills', icon: Code },
  { title: 'Projects & Certifications', icon: Award },
  { title: 'Work Experience', icon: Briefcase },
];

function Resume() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resumeData, setResumeData] = useState(initialResumeData);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
         Resume Builder
        </h1>

        <div className="flex gap-8">
          {/* Left side - Input Form */}
          <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <span className="text-lg font-semibold flex items-center gap-2">
                {React.createElement(slides[currentSlide].icon, { className: "w-5 h-5" })}
                {slides[currentSlide].title}
              </span>

              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <InputSlide
              currentSlide={currentSlide}
              resumeData={resumeData}
              updateResumeData={updateResumeData}
            />
          </div>

          {/* Right side - Resume Preview */}
          <div className="w-1/2">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
