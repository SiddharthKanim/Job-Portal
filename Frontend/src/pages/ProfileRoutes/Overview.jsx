import { useState, useEffect } from "react";
import { Calendar, Award, Briefcase, FileText, TrendingUp, CheckCircle } from "lucide-react";
import api from "../../api";

const Overview = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/user/jobseekerdashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1> 
      </div>

      {/* Profile Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: "Applied Jobs", value: dashboardData.applied_jobs, icon: <Briefcase />, color: "blue" },
          { label: "Approved Jobs", value: dashboardData.approved_jobs, icon: <CheckCircle />, color: "green" },
          { label: "Pending Jobs", value: dashboardData.pending_jobs, icon: <TrendingUp />, color: "yellow" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl bg-opacity-60 backdrop-blur-lg shadow-lg transform transition hover:scale-105 bg-${item.color}-50 border-l-4 border-${item.color}-600 flex items-center space-x-4`}
          >
            <div className={`text-${item.color}-600 w-12 h-12 p-2 rounded-full bg-${item.color}-200 flex justify-center items-center`}>
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-gray-700">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white w-full h-[400px] p-6 rounded-xl shadow-lg flex-grow md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
          <ul className="space-y-3 overflow-y-auto">
            {dashboardData.recent_applications.map((application, index) => (
              <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                <div> 
                  <span className="text-lg  text-black ml-2">{application.job_title}</span>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    application.applicant_status === "Approved" ? "bg-green-100 text-green-800" :
                    application.applicant_status === "Declined" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {application.applicant_status}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(application.applicant_date).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div> 
  );
};

export default Overview;
