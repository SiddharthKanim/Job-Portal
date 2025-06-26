import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { ChevronDown, LogOut } from "lucide-react";
import { LazyStore } from "@tauri-apps/plugin-store";
import { jwtDecode } from "jwt-decode";

const authStore = new LazyStore(".auth.json");

export default function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mail, setMail] = useState('');
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();  

  const handleLogout = async () => {
    try {
      await authStore.delete("jwt");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authStore.get('jwt');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded JWT:', decoded);
          setMail(decoded.email);
          setFullname(decoded.fullname);
          console.log('Decoded JWT:', decoded);
        } catch (error) {
          console.error('Invalid JWT token:', error);
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <aside className="w-64 bg-white p-4 border-r">
      {/* User Info at Top */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-semibold">{fullname}</h2>
        <p className="text-sm text-gray-600">{mail}</p>
      </div>

      <nav className="space-y-4">
        <a className="block p-2 hover:bg-gray-100 rounded-md" href="/jphome">Dashboard</a>
        <a className="block p-2 hover:bg-gray-100 rounded-md" href="/jobs1">Jobs</a>
        <a className="block p-2 hover:bg-gray-100 rounded-md" href="/jobpost">Jobs Post</a>
        <a className="block p-2 hover:bg-gray-100 rounded-md" href="/applicant">Applicant</a>

        {/* Settings with Dropdown */}
        <div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md"
          >
            <span>Settings</span>
            <ChevronDown size={18} className={`transform transition ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left p-2 text-red-600 hover:bg-red-100 rounded-md mt-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
