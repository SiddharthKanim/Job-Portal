import { useEffect, useState } from 'react';
import api from '../../api';
import { BookmarkMinus } from 'lucide-react';


const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved jobs on mount
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const idResponse = await api.get('/user/getsavedjobs');
        const jobIds = idResponse.data.job_ids || [];

        if (jobIds.length === 0) {
          setSavedJobs([]);
          return;
        }

        const jobDetailPromises = jobIds.map(id =>
          api.get(`/job/jobid/`, { params: { id } })
            .then(res => res.data)
            .catch(() => null)
        );

        const jobDetails = await Promise.all(jobDetailPromises);
        const validJobs = jobDetails.filter(job => job !== null);

        setSavedJobs(validJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // Handle unsave click
  const handleUnsave = async (jobId) => {
    try {
      await api.put('/user/unsavedjobs', { job_id: jobId });

      // Remove from local state
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error("Failed to unsave job:", err);
    }
  };

  

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && savedJobs.length === 0 && <p>No saved jobs found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <div key={job._id} className="bg-white p-4 shadow-md rounded-lg border flex flex-col justify-between h-full">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-blue-700">{job.job_title}</h3>
              <p className="text-gray-700">{job.company_name}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-green-600 font-semibold mt-2">Rs {job.salary} / Year</p>
              <p className="text-gray-600 mt-2">{job.description}</p>
            </div>

            <div className="mt-4 flex justify-between items-center">
            <a href={`/anow/${job._id}`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
            Apply Now
            </a>


              <button
                onClick={() => handleUnsave(job._id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
                title="Unsave Job"
              >
                <BookmarkMinus className="w-5 h-5" />
                Unsave
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
