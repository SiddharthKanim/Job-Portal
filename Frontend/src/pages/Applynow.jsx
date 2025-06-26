import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api";  

export default function Applynow() {
    const [job, setJob] = useState(null); 
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { jobId } = useParams();  

    useEffect(() => {
        async function fetchJob() {
            try {

                const response = await api.get(`/job/jobid?id=${id}`);
                const jobs = response.data; 
                setJob(response.data); 
            } catch (err) {
                setError("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        }

        fetchJob();
    }, [jobId]);

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!job) return <div className="text-center p-10">Job not found</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-4xl p-10 bg-white shadow-2xl rounded-3xl border border-gray-300 text-left"
            >
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center">
                    <ArrowLeft size={24} className="mr-2" /> 
                </button>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.job_title}</h1>
                <p className="text-gray-700 text-lg mb-2"><strong>Company:</strong> {job.company_name}</p>
                <p className="text-gray-700 text-lg mb-2"><strong>Location:</strong> {job.location}</p>
                <p className="text-gray-700 text-lg mb-2"><strong>Job Type:</strong> {job.job_type}</p>
                <p className="text-gray-700 text-lg mb-4"><strong>Email:</strong> {job.email}</p>
                <hr className="my-4 border-gray-300" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Job Description</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{job.description}</p>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Requirements</h2>
                <ul className="list-disc list-inside text-gray-700 mb-6 text-lg space-y-2">
                    {job.requirements.map((req, index) => (
                        <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>{req}</motion.li>
                    ))}
                </ul>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <p className="text-gray-700 text-lg"><strong>Salary:</strong> {job.salary}</p>
                    <p className="text-gray-700 text-lg"><strong>Experience:</strong> {job.experience} years</p>
                    <p className="text-gray-700 text-lg"><strong>Posted:</strong> {job.posted_date}</p>
                    <p className="text-gray-700 text-lg"><strong>Deadline:</strong> {job.deadline}</p>
                </div>
                <p className="text-gray-700 text-lg mb-6"><strong>Status:</strong> {job.status}</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-full py-3 rounded-lg text-lg font-semibold shadow-md transition-all" 
                    onClick={() => navigate(`/aform/${id}`)}
                >
                    Apply Now 
                    {/* {id} */}
                </motion.button>
            </motion.div>
        </div>
    );
}