import React, { useState } from "react";
import { Search, Briefcase, DollarSign, LocateFixed } from "lucide-react";
import SelectField from "./SelectField";

export default function Searchbar() {
  const [filters, setFilters] = useState({
    query: "",
    jobType: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
 

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </h1>
          <p className="text-lg text-gray-600">
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="query"
                  value={filters.query}
                  onChange={handleChange}
                  placeholder="Job title, keywords, or company"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectField
                icon={Briefcase}
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                options={[
                  // { label: "Job Type", value: "" },
                  // { label: "Full-time", value: "full-time" },
                  // { label: "Part-time", value: "part-time" },
                  // { label: "Remote", value: "remote" },
                  // { label: "Internship", value: "internship" },
                ]}
              />
              <SelectField
                icon={LocateFixed}
                name="location"
                value={filters.location}
                onChange={handleChange}
                options={[
                  { label: "Location", value: "" },
                  { label: "Bangalore", value: "bangalore" },
                  { label: "Hyderabad", value: "hyderabad" },
                  { label: "Mumbai", value: "mumbai" },
                  { label: "Pune", value: "pune" },
                  { label: "Chennai", value: "chennai" },
                  { label: "Delhi", value: "delhi" },
                  { label: "Gurgaon", value: "gurgaon" },
                  { label: "Noida", value: "noida" },
                  { label: "Kolkata", value: "kolkata" },
                  { label: "Ahmedabad", value: "ahmedabad" },
                  { label: "Jaipur", value: "jaipur" },
                  { label: "Chandigarh", value: "chandigarh" },
                  { label: "Indore", value: "indore" },
                  { label: "Surat", value: "surat" },
                  { label: "Coimbatore", value: "coimbatore" },
                  { label: "Vadodara", value: "vadodara" },
                  { label: "Visakhapatnam", value: "visakhapatnam" },
                  { label: "Nagpur", value: "nagpur" },
                  { label: "Bhubaneswar", value: "bhubaneswar" },
                  { label: "Lucknow", value: "lucknow" }
                ]}
              />

              <SelectField
                icon={DollarSign}
                name="salary"
                value={filters.salary}
                onChange={handleChange}
                options={[
                  { label: "Salary Range", value: "" },
                  { label: "0-4 Lakh", value: "0-50" },
                  { label: "4-6 Lakh", value: "50-100" },
                  { label: "6-8 Lakh", value: "100-150" },
                  { label: "8-12 Lakh", value: "150-200" },
                  { label: "12+ Lakh", value: "200+" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
 
