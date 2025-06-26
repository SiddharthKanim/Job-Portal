import { useEffect, useState } from "react";
import api from "../../api";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job/jobs");
        console.log("Fetched jobs:", response.data);  
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDeactivate = async (jobId) => {
    try {
      console.log(`Deactivating job with ID: ${jobId}`);
      await api.put(`/job/change_jobstatus/?id=${jobId}`);
      const updatedJobs = jobs.map((job) =>
        job._id === jobId ? { ...job, status: "inactive" } : job
      );
      setJobs(updatedJobs);
    } catch (err) {
      setError("Failed to update job status");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mx-auto mt-10 w-full">
      <h2 className="text-lg font-semibold mb-4">Job Listings</h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Job Title</th>
            <th className="p-2">Company</th>
            <th className="p-2">Status</th>
            <th className="p-2">Location</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Posted Date</th>
            <th className="p-2 text-right">Deactivate</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job._id} className="border-b">
                <td className="p-2">{job.job_title}</td>
                <td className="p-2">{job.company_name}</td>
                <td className={`p-2 ${job.status === "active" ? "text-green-600" : "text-gray-500"}`}>
                  {job.status}
                </td>
                <td className="p-2">{job.location}</td>
                <td className="p-2">Rs {job.salary}</td>
                <td className="p-2">{job.posted_date}</td>
                <td className="p-2 text-right">
                  <input
                    type="checkbox"
                    checked={job.status === "inactive"}
                    disabled={job.status === "inactive"} // disable after deactivation
                    onChange={() => handleDeactivate(job._id)}
                    className="ml-auto"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                No jobs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
