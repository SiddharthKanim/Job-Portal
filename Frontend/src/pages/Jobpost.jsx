import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { LazyStore } from "@tauri-apps/plugin-store";
import { jwtDecode } from "jwt-decode";

export default function Jobpost() {
  const navigate = useNavigate();
  const authStore = new LazyStore(".auth.json");
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    email: "",
    job_title: "",
    company_name: "",
    location: "",
    job_type: "Full Time",
    description: "",
    requirements: "",
    salary: "",
    experience: "",
    posted_date: today,
    deadline: ""
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = await authStore.get("jwt");

        if (!token || typeof token !== "string") {
          throw new Error("JWT token not found or not a valid string");
        }

        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        const email_data = decoded.email;
        const company_data = decoded.companyname;
        setFormData((prev) => ({ ...prev, email: email_data, company_name: company_data }));
      } catch (error) {
        console.error("Error fetching job details:", error.message || error);
        toast.error("Failed to load job details.");
      }
    };

    fetchJobDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      experience: formData.experience ? Number(formData.experience) : 0,
      posted_date: formData.posted_date ? new Date(formData.posted_date).toISOString().split("T")[0] : null,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : null,
      requirements: formData.requirements
        ? formData.requirements.split(",").map((req) => req.trim())
        : []
    };

    try {
      await axios.post("http://localhost:8000/job/jobs", formattedData);
      toast.success("Job posted successfully!");
      navigate("/jobpost", { replace: true });
    } catch (error) {
      console.error("Error posting job:", error.response?.data || error);
      toast.error(error.response?.data?.detail || "Failed to post job.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 relative">
      <ArrowLeft
        size={28}
        className="absolute top-6 left-6 cursor-pointer text-gray-600 hover:text-gray-900"
        onClick={() => navigate(-1)}
      />

      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Post a New Job</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key}>
              {key === "job_type" ? (
                <select
                  name="job_type"
                  className="border p-2 rounded w-full"
                  value={formData.job_type}
                  onChange={handleChange}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              ) : key === "posted_date" ? (
                <div>
                  <input
                    name="posted_date"
                    type="date"
                    min={today}
                    className="border p-2 rounded w-full"
                    value={formData.posted_date}
                    onChange={handleChange}
                  />
                  <small className="text-gray-600">Posted date must be today or later</small>
                </div>
              ) : key === "deadline" ? (
                <div>
                  <input
                    name="deadline"
                    type="date"
                    min={formData.posted_date || today}
                    className="border p-2 rounded w-full"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                  <small className="text-gray-600">Deadline must be after the posted date</small>
                </div>
              ) : key === "email" || key === "company_name" ? (
                <input
                  name={key}
                  type="text"
                  value={formData[key]}
                  disabled
                  className="border p-2 rounded w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              ) : (
                <>
                  <input
                    name={key}
                    placeholder={key.replace(/_/g, " ").toUpperCase()}
                    className="border p-2 rounded w-full"
                    value={formData[key]}
                    onChange={handleChange}
                    type="text"
                  />
                  {key === "requirements" && (
                    <small className="text-gray-600">
                      Enter requirements as comma-separated values (e.g., Python, React, FastAPI)
                    </small>
                  )}
                  {key === "salary" && (
                    <small className="text-gray-600">
                      Enter salary in numbers (e.g., 60000 or 5 LPA)
                    </small>
                  )}
                  {key === "experience" && (
                    <small className="text-gray-600">
                      Enter experience in years (e.g., 0, 1, 2...)
                    </small>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
