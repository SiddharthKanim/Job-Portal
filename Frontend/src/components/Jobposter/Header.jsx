import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Jobposter() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Job Poster Dashboard</h1>
        <button
          onClick={() => navigate("/jobpost")} // Navigate to Job Post Page
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus size={20} />
          <span>Post New Job</span>
        </button>
      </div>
    </div>
  );
}

