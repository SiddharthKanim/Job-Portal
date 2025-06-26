import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Signup from "../pages/Signup";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Jobs from "../components/Jobs";
import Jobposter from "../pages/Jobposter";
import Jobpost from "../pages/Jobpost";
import Profile from "../pages/Profile";
import ApplyForm from "../pages/ApplyForm";
import Applynow from "../pages/Applynow";
import Applicant from "../components/Jobposter/Applicant";
import Jobs1 from "../components/Jobposter/Jobs1";
import Resume from "../pages/Resume";
import Contact from "../pages/Contact";
import Viewprofile from "../pages/Viewprofile";

function Layout() {
  const location = useLocation();

  // Routes that should hide the Navbar
  const hideNavbarPaths = [
    "/applicant",
    "/jobpost",
    "/jphome",
    "/login",
    "/signup",
    "/profile",
    "/jobs1"
  ];

  // Check if current path starts with any of the hidden paths
  const hideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jphome" element={<Jobposter />} />
        <Route path="/jobpost" element={<Jobpost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/aform/:job_id" element={<ApplyForm />} />
        <Route path="/anow/:id" element={<Applynow />} />
        <Route path="/applicant" element={<Applicant />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/viewprofile/:profile_mail" element={<Viewprofile />} />
        <Route path="/jobs1" element={<Jobs1/>} />

      </Routes>
    </div>
  );
}

export function Approute() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
