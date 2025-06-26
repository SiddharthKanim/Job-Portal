import { useEffect, useState } from "react";
import Jobs from "../components/Jobs";
import SelectField from "../components/SelectField";
import { Search, Briefcase, DollarSign, LocateFixed, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import { LazyStore } from "@tauri-apps/plugin-store";
import axios from "axios";
export default function Home() {
  const store = new LazyStore(".auth.json");
  const [allJobs, setAllJobs] = useState([]); // Stores all jobs fetched from backend
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJobs] = useState([]); // Stores filtered jobs
  const [filters, setFilters] = useState({
    query: "",
    jobType: "",
    location: "",
    salary: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch jobs only once

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/job/jobs/all");
        if (!response.ok) throw new Error("Failed to fetch jobs");
      
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid response format");
        }
      
        const data = await response.json();
        setAllJobs(data);
        setJobs(data);
      } catch (err) {
        setError("Error fetching jobs: " + err.message);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = await store.get("jwt");
        if (!token) {
          console.log("No token found");
          setSavedJobs([]);
          return;
        }
  
        const response = await axios.get("http://localhost:8000/user/getsavedjobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const saved = response.data.job_ids || [];
        setSavedJobs(saved);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Failed to fetch saved jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSavedJobs();
  }, []);
  
  
  
  const isSalaryInRange = (jobSalary, range) => {
    const salary = Number(jobSalary); // Convert salary from string to number
    if (isNaN(salary)) return false;

    const [min, max] = range.split("-").map((val) => Number(val) * 100000); // Convert lakh values to actual salary
    return salary >= min && salary <= max;
  };

  // Handle search input and filter jobs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Apply filtering
    let filteredJobs = allJobs;

    if (newFilters.query) {
      filteredJobs = filteredJobs.filter((job) =>
        job.job_title.toLowerCase().includes(newFilters.query.toLowerCase())
      );
    }
    if (newFilters.jobType) {
      filteredJobs = filteredJobs.filter((job) => job.job_type === newFilters.jobType);
    }
    if (newFilters.location) {
      filteredJobs = filteredJobs.filter((job) => job.location === newFilters.location);
    }
    if (newFilters.salary) {
      filteredJobs = filteredJobs.filter((job) => isSalaryInRange(job.salary, newFilters.salary));
    }

    setJobs(filteredJobs);
  };

  const toggleSavedJob = async (job_id) => {
    try {
      if (savedJobs.includes(job_id)) {
        await api.put('/user/unsavedjobs', { job_id }); // Unsave job
        setSavedJobs((prev) => prev.filter(id => id !== job_id)); // Remove from state
      } else {
        await api.post('/user/savedjobs', { job_id }); // Save job
        setSavedJobs((prev) => [...prev, job_id]); // Add to state
      }
    } catch {
      console.log("Error toggling saved job");
    }
  };
  

  
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
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Find Your <span className="text-blue-600">Dream Job</span> Today
            </h1>
            <p className="text-lg text-gray-600">
              Discover opportunities that match your skills and aspirations
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="query"
                    value={filters.query}
                    onChange={handleChange}
                    placeholder="Job title, keywords, or company"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                  />
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Filters */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField
                  icon={Briefcase}
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleChange}
                  options={[
                    { label: "Job Type", value: "" },
                    { label: "Full Time", value: "Full Time" },
                    { label: "Part-time", value: "Part Time" },
                    { label: "Remote", value: "Remote" },
                    { label: "Internship", value: "Internship" },
                  ]}
                />
                <SelectField
                  icon={LocateFixed}
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  options={[
                    { label: "Location", value: "" },
                  { label: "Bangalore", value: "Bangalore" },
                  { label: "Hyderabad", value: "Hyderabad" },
                  { label: "Mumbai", value: "Mumbai" },
                  { label: "Pune", value: "Pune" },
                  { label: "Chennai", value: "Chennai" },
                  { label: "Delhi", value: "Delhi" },
                  { label: "Gurgaon", value: "Gurgaon" },
                  { label: "Noida", value: "Noida" },
                  { label: "Kolkata", value: "Kolkata" },
                  { label: "Ahmedabad", value: "Ahmedabad" },
                  { label: "Jaipur", value: "Jaipur" },
                  { label: "Chandigarh", value: "Chandigarh" },
                  { label: "Indore", value: "Indore" },
                  { label: "Surat", value: "Surat" },
                  { label: "Coimbatore", value: "Coimbatore" },
                  { label: "Vadodara", value: "Vadodara" },
                  { label: "Visakhapatnam", value: "Visakhapatnam" },
                  { label: "Nagpur", value: "Nagpur" },
                  { label: "Bhubaneswar", value: "Bhubaneswar" },
                  { label: "Lucknow", value: "Lucknow" }
                  ]}
                />
                <SelectField
                  icon={DollarSign}
                  name="salary"
                  value={filters.salary}
                  onChange={handleChange}
                  options={[
                    { label: "Salary Range", value: "" },
                    { label: "0-4 Lakh", value: "0-4" },
                    { label: "4-6 Lakh", value: "4-6" },
                    { label: "6-8 Lakh", value: "6-8" },
                    { label: "8-12 Lakh", value: "8-12" },
                    { label: "12-20 Lakh", value: "12-20" },
                    { label: "20+ Lakh", value: "20-100" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="-mt-28">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 mt-28 mb-8">
          {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="max-h-150 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 && !loading && !error && (
              <p className="text-center text-gray-500">No jobs found.</p>
            )}

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
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 text-white rounded-lg hover:opacity-90 w-full mr-2"
                    onClick={() => handleApplynow(job._id)}
                  >
                    Apply Now
                  </button>
                  <button className={`p-2 ${savedJobs.includes(job._id) ? "bg-blue-800" : "bg-gray-300"} rounded-lg hover:bg-gray-400`} onClick={() => toggleSavedJob(job._id)}>
                    <Bookmark className={`w-5 h-5 ${savedJobs.includes(job._id) ? "text-white" : "text-gray-700"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
