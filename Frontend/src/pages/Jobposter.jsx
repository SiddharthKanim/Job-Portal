import Sidebar from "../components/Jobposter/Sidebar";
import Header from "../components/Jobposter/Header";
import JobStats from "../components/Jobposter/JobStats";
import JobListings from "../components/Jobposter/JobListings";

export default function Jobposter() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="">
        <Header />
        </div>
        <JobStats />
        <JobListings />
      </main>
    </div>
  );
}
