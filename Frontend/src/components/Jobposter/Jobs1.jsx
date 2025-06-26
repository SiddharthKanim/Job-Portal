import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../../api";
import Sidebar from "./Sidebar";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job/get_all_job");
        const data = await response.data;
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) return <div className="text-center text-2xl text-gray-600 mt-12">Loading jobs...</div>;
  if (error) return <div className="text-center text-2xl text-red-500 mt-12">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="flex items-center mb-8">
          {/* <button onClick={handleBack} className="mr-4 text-gray-600 hover:text-black transition">
            <ArrowLeft className="w-7 h-7" />
          </button> */}
          <h2 className="text-4xl font-bold text-gray-800">Job Listings</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-full overflow-x-auto">
          <table className="min-w-full text-base text-gray-800">
            <thead className="bg-gray-100 text-lg font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Job Title</th>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Salary</th>
                <th className="px-6 py-4 text-left">Posted Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{job.job_title}</td>
                    <td className="px-6 py-4">{job.company_name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-red-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4">Rs {job.salary}</td>
                    <td className="px-6 py-4">{job.posted_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-lg">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
