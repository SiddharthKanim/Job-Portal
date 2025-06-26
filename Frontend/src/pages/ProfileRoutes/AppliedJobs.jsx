import { useEffect, useState } from "react";
import api from "../../api";
import { CalendarDays, MapPin } from "lucide-react";

const statusStyles = {
  Approved: "text-green-600 bg-green-100",
  "Application Submitted": "text-blue-600 bg-blue-100",
  Declined: "text-red-600 bg-red-100",
  Hold: "text-yellow-600 bg-yellow-100", // support for "Hold" status
};

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get("/applicant/get_appliedJobs");
        if (response.status === 200) {
          const mappedJobs = response.data.map((job) => ({
            id: job._id,
            title: job.job_title,
            company: job.job_mail, // or company name if available
            location: "Not specified", // update if backend adds location
            dateApplied: new Date(job.applicant_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            rawDate: new Date(job.applicant_date), // for sorting
            status: job.applicant_status,
            logo: "https://via.placeholder.com/40", // replace if you have logos
          }));

          // Sort by most recent first
          const sortedJobs = mappedJobs.sort((a, b) => b.rawDate - a.rawDate);

          setJobs(sortedJobs);
        } else {
          console.error("Failed to fetch applicants", response);
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Applied Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Applied on {job.dateApplied}
                </span>
              </div>
            </div>
            <div
              className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                statusStyles[job.status] || "text-gray-600 bg-gray-100"
              }`}
            >
              {job.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
