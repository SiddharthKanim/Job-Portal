import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LazyStore } from "@tauri-apps/plugin-store";
import { jwtDecode } from 'jwt-decode';

const store = new LazyStore(".auth.json");

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await store.get("jwt");
            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken);
                    setEmail(decoded.email);
                    setToken(storedToken);
                } catch (err) {
                    console.error("Invalid token:", err);
                    setEmail("");
                }
            } else {
                setToken(null);
                setEmail("");
            }
        };

        fetchToken();

        // Optional polling to keep token in sync if updated externally
        const interval = setInterval(fetchToken, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await store.delete("jwt");
        setToken(null);
        setDropdownOpen(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-blue-600">JobPortal</div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                        <a href="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</a>
                        <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
                    </div>

                    {/* Buttons / Profile Icon */}
                    <div className="hidden md:flex space-x-4 relative ">
                        {token ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-700 hover:text-blue-600">
                                    <User size={28} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-fit bg-white border rounded-lg shadow-lg ">
                                        <div className="px-4 py-2 text-gray-700 border-b">{email}</div>
                                        <button 
                                            onClick={() => navigate("/profile")} 
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </button>
                                        <button 
                                            onClick={handleLogout} 
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50" onClick={() => navigate("/login")}>Login</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => navigate("/signup")}>Sign Up</button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md p-4">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Home</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Jobs</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Contact</a>
                    <div className="flex flex-col space-y-2 mt-4">
                        {token ? (
                            <div>
                                <div className="px-4 py-2 text-gray-700 border-b">{email}</div>
                                <button onClick={() => navigate("/jphome")} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                                    Dashboard
                                </button>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-100">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50" onClick={() => navigate("/login")}>Login</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => navigate("/signup")}>Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
