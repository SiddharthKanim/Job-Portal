import { useEffect, useState } from "react";
import { Clock, Briefcase, Users } from "lucide-react";
import api from "../../api";

export default function JobStats() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    active_jobs: 0,
    applicant_job: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/job/dashboard_data");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <Briefcase className="text-blue-500" size={32} />
        <div>
          <p className="text-gray-500">Total Jobs</p>
          <h2 className="text-xl font-bold">{stats.total_jobs}</h2>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <Clock className="text-green-500" size={32} />
        <div>
          <p className="text-gray-500">Active Jobs</p>
          <h2 className="text-xl font-bold">{stats.active_jobs}</h2>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <Users className="text-purple-500" size={32} />
        <div>
          <p className="text-gray-500">Total Applicants</p>
          <h2 className="text-xl font-bold">{stats.applicant_job}</h2>
        </div>
      </div>
    </div>
  );
}
