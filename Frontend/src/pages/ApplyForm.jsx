import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../api";
import { useParams } from "react-router-dom";

export default function ApplyForm() {
    const { job_id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        resume: null,
        coverLetter: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;w
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        console.log("Submit button1")
        e.preventDefault();
        console.log("Submit button2")
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("resume", formData.resume); 
        data.append("coverLetter", formData.coverLetter);
        data.append("job_id", job_id);

    
        try {
            const response = await api.post("/applicant/create_applicant", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            if (response.status === 200 || response.status === 201) {
                alert("Application submitted successfully!");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting the application.");
        }
    };
    

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative max-w-2xl w-full p-10 bg-white shadow-2xl rounded-3xl border border-gray-300"
            >
                {/* Back Arrow */}
                <button onClick={goBack} className="absolute top-4 left-4 text-gray-700 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Apply for Job</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* <div>
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div> */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Resume (PDF or DOCX)</label>
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange} 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Cover Letter</label>
                        <textarea 
                            name="coverLetter" 
                            value={formData.coverLetter} 
                            onChange={handleChange} 
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-full py-3 rounded-lg text-lg font-semibold shadow-md transition-all"
                        onClick={handleSubmit}
                    >
                        Submit Applications 
                        {/* {job_id} */}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
