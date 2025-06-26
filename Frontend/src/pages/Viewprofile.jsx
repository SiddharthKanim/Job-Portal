import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // You can change this to any other back arrow icon
import api from "../api";

const Viewprofile = () => {
  const { profile_mail } = useParams();
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate(); // To navigate programmatically

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/user/profile/view?user_mail=${profile_mail}`);
        setProfileData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, [profile_mail]);

  if (!profileData) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-1">Profile Details</h1>
          <p className="text-gray-500">Viewing profile of <span className="font-medium">{profileData.full_name}</span></p>
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
          <p><span className="font-medium text-gray-600">Email:</span> {profileData.email}</p>
          <p><span className="font-medium text-gray-600">Mobile Number:</span> {profileData.mobileNumber}</p>
          <p><span className="font-medium text-gray-600">Job Title:</span> {profileData.job_title}</p>
          <p><span className="font-medium text-gray-600">Location:</span> {profileData.location}</p>
          <p><span className="font-medium text-gray-600">LinkedIn:</span> {profileData.linkedin_url}</p>

          {/* <p><span className="font-medium text-gray-600">Job Type:</span> {profileData.jobType}</p> */}
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Experience</h2>
          {profileData.experience.length === 0 ? (
            <p className="text-gray-500">No experience listed.</p>
          ) : (
            <div className="space-y-4">
              {profileData.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <p className="font-medium text-gray-700">{exp.position}</p>
                  <p className="text-gray-500">{exp.company_name}</p>
                  <p className="text-sm text-gray-600">{exp.start_date} - {exp.end_date}</p>
                  <p className="mt-2 text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Education</h2>
          {profileData.education.length === 0 ? (
            <p className="text-gray-500">No education details provided.</p>
          ) : (
            <div className="space-y-4">
              {profileData.education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <p className="font-medium text-gray-700">{edu.degree_name}</p>
                  <p className="text-gray-500">{edu.college_name}</p>
                  <p className="text-sm text-gray-600">{edu.start_year} - {edu.end_year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewprofile;
