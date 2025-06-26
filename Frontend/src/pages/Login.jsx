import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import { LazyStore } from '@tauri-apps/plugin-store';

export default function Login() {
    const navigate = useNavigate();
    const authStore = new LazyStore('.auth.json');

    const [form, setForm] = useState({
        mobileNumber: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [step, setStep] = useState("email");
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

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
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/auth/login", {
                mobileNumber: form.mobileNumber,
                password: form.password
            });
            if (response.status === 200) {
                const token = response.data.access_token;
                await saveToken(token);
                const decoded = jwtDecode(token);
                toast.success("Login Successful");
                navigate(decoded.jobType === "job_poster" ? "/jphome" : "/");
            } else {
                toast.error("Login Failed");
            }
        } catch (error) {
            if (!error.response) {
                toast.error("Network Error: Unable to connect to server");
            } else if (error.response.data?.detail) {
                const details = error.response.data.detail;
                toast.error(Array.isArray(details) ? details.map(err => err.msg).join(", ") : details);
            } else {
                toast.error("Login Failed");
            }
        }
    };

    const handleVerifyEmail = async () => {
        if (!forgotEmail) {
            toast.error("Enter your registered email");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/auth/verifyemail", {
                email: forgotEmail,
            });

            if (response.status === 200) {
                await axios.post("http://localhost:8000/auth/sendotp", {
                    email: forgotEmail,
                });
                toast.success("OTP sent to email!");
                setStep("otp");
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (err) {
            toast.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
                <button onClick={() => navigate("/")} className="absolute top-4 left-4 p-2">
                    <ArrowLeft className="w-6 h-6 text-gray-700 hover:text-gray-900 transition" />
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            placeholder="1234567890"
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Login
                    </button>

                    <p className="text-sm text-center text-blue-600 mt-2 cursor-pointer hover:underline" onClick={() => {
                        setShowOtpModal(true);
                        setStep("email");
                    }}>
                        Forgot Password?
                    </p>

                    <p className="text-sm text-center text-gray-600 mt-1">
                        Don&apos;t have an account?{" "}
                        <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>

            {/* OTP & Reset Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4 text-center">Forgot Password</h3>

                        {step === "email" && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setShowOtpModal(false)}
                                        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === "otp" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep("email")}
                                        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!otp || otp.length !== 6) {
                                                toast.error("Enter 6-digit OTP");
                                                return;
                                            }

                                            setLoading(true);
                                            try {
                                                const res = await axios.post("http://localhost:8000/auth/verifyotp", {
                                                    email: forgotEmail,
                                                    otp,
                                                });

                                                if (res.status === 200) {
                                                    toast.success("OTP verified!");
                                                    setStep("newPassword");
                                                } else {
                                                    toast.error("Invalid OTP");
                                                }
                                            } catch (err) {
                                                toast.error("Verification failed");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === "newPassword" && (
                            <>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={form.newPassword}
                                    onChange={(e) => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg mb-3"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg mb-4"
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep("otp")}
                                        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const { newPassword, confirmPassword } = form;
                                            if (!newPassword || !confirmPassword) {
                                                toast.error("Please fill both password fields");
                                                return;
                                            }
                                            if (newPassword !== confirmPassword) {
                                                toast.error("Passwords do not match");
                                                return;
                                            }

                                            setLoading(true);
                                            try {
                                                const res = await axios.post("http://localhost:8000/auth/forgotpassword", {
                                                    email: forgotEmail,
                                                    password: newPassword,
                                                });
                                                if (res.status === 200) {
                                                    toast.success("Password updated!");
                                                    setShowOtpModal(false);
                                                } else {
                                                    toast.error("Reset failed");
                                                }
                                            } catch (err) {
                                                toast.error("Failed to reset password");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Update Password"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
