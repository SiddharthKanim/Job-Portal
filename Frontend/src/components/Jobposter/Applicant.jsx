import { CheckCircle, XCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Applicant = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get("/applicant/get_applicant");
        setApplicants(response.data);
        setFilteredApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  useEffect(() => {
    const filtered = applicants.filter((applicant) => {
      const matchesSearch =
        (applicant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.job_title?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || applicant.applicant_status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredApplicants(filtered);
  }, [searchTerm, statusFilter, applicants]);

  const Actionbuttonhandling = async (applicant_id, job_status) => {
    try {
      await api.put("/applicant/change_applicant_status", {
        applicant_id,
        job_status,
      });
      const response = await api.get("/applicant/get_applicant");
      setApplicants(response.data);
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:max-w-md">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or job title..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Hold">Hold</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="text-center text-gray-600 mt-16">
            <p className="text-lg">No applicants match the criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant._id}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-blue-700 mb-4">
                    {applicant.job_title || "Job Title"}
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Full Name</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 font-medium">
                          {applicant.full_name || "N/A"}
                        </p>
                        <button
                          onClick={() => navigate(`/profile/viewprofile/${applicant.user_email}`)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium">
                        {applicant.user_email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Cover Letter</p>
                      <p className="text-gray-700">
                        {applicant.cover_letter || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Resume</p>
                      {applicant.resume_link ? (
                        <a
                        href={`http://localhost:8000${applicant.resume_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          download
                        >
                          View Resume 
                        </a>
                      ) : (
                        <p className="text-gray-600">No resume available</p>
                      )}
                    </div>
                  </div>
                </div>

                {applicant.applicant_status === "Hold" ? (
                  <div className="mt-6 flex gap-4">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                      onClick={() => Actionbuttonhandling(applicant._id, "Approved")}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                      onClick={() => Actionbuttonhandling(applicant._id, "Declined")}
                    >
                      <XCircle className="w-5 h-5" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <div
                    className={`mt-6 text-center text-sm font-semibold ${
                      applicant.applicant_status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {applicant.applicant_status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applicant;
