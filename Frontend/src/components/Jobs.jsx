import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LazyStore } from "@tauri-apps/plugin-store";
export default function Jobs() {
  const store = new LazyStore(".auth.json");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/job/jobs/all");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  const handleApplynow = async (job_id) => {
    const token = await store.get("jwt");
        if (!token) {
          navigate('/login')
          setSavedJobs([]);
          return;
        }
    navigate(`/anow/${job_id}`)
  }
  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 mt-28 mb-8">
      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="max-h-150 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div 
            key={index} 
            className="bg-slate-200 p-6 rounded-lg shadow-md border flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-600">{job.job_title}</h3>
                <span className="text-gray-500 text-sm bg-gray-300 px-2 py-1 rounded">
                  {job.job_type}
                </span>
              </div>
              <p className="text-gray-700 font-medium">{job.company_name}</p>
              <p className="text-gray-500">{job.location},India</p>
              <p className="text-green-600 font-semibold">Rs {job.salary} / Year</p>
              <p className="text-gray-600 mt-2">{job.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 text-white rounded-lg hover:opacity-90 w-full mr-2" onClick={()=>handleApplynow(job._id)}>
                Apply Now
              </button>
              <button className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                <Bookmark className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}