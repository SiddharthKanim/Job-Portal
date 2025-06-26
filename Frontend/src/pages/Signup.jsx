import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LazyStore } from '@tauri-apps/plugin-store';

export default function Signup() {
    const [isJobPoster, setIsJobPoster] = useState(false);
    const navigate = useNavigate();
    const authStore = new LazyStore('.auth.json');

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "", 
        companyName: "",
        jobType: ""
    });

    async function saveToken(token) {
        try {
            await authStore.set('jwt', token);
            await authStore.save();  
            console.log('Token saved successfully!');
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            jobType: isJobPoster ? "job_poster" : "job_seeker",
        };
        try {
            const response = await axios.post("http://localhost:8000/auth/signup", updatedFormData);
            
            if (response.status === 200) {
                await saveToken(response.data.access_token);
                toast.success("Signup Successful");
                navigate(isJobPoster ? "/jphome" : "/", { replace: true });
            } else {
                toast.error("Signup Failed");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    const errorMsg = error.response.data.detail.map(err => err.msg).join(", ");
                    toast.error(errorMsg);
                } else {
                    toast.error(error.response.data.detail);
                }
            } else {
                toast.error("Signup Failed");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2">
                    <ArrowLeft className="w-6 h-6 text-gray-700 hover:text-gray-900 transition" />
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setIsJobPoster(false)}
                        className={`w-1/2 px-4 py-2 rounded-lg ${!isJobPoster ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Job Seeker
                    </button>
                    <button
                        onClick={() => setIsJobPoster(true)}
                        className={`w-1/2 px-4 py-2 rounded-lg ${isJobPoster ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Job Poster
                    </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="John" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Doe" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="example@gmail.com" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobileNumber" 
                            value={formData.mobileNumber} 
                            onChange={handleChange} 
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="1234567890" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    {isJobPoster && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input 
                                type="text" 
                                name="companyName" 
                                value={formData.companyName} 
                                onChange={handleChange} 
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Company Inc." 
                                required 
                            />
                        </div>
                    )}
                    <p className="text-sm text-center text-gray-600">
                        Already have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/login")}>Login</span>
                    </p>
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}