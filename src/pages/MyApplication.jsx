import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { applicationAPI } from "../services/applicationApis";
import LoadingSmall from "../components/SmallLoading";
import { toast } from "react-toastify";
import ApplicationCard from "../components/ApplicationCard";

export default function MyApplications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, FORM6, FORM8
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.getAllApplications();

      console.log("Applications Response:", response);

      if (response.success) {
        setApplications(response.data);
      } else {
        toast.error(response.message || "Failed to load applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter !== "ALL" && app.formType !== filter) return false;
    if (statusFilter !== "ALL" && app.applicationStatus !== statusFilter)
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSmall size="lg" />
        <p className="ml-3 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">
          {filteredApplications.length} application
          {filteredApplications.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Type
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Forms</option>
              <option value="FORM6">Form 6 (Registration)</option>
              <option value="FORM8">Form 8 (Correction)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_VERIFICATION">Under Verification</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchApplications}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-500 text-lg mb-4">No applications found</p>
          <p className="text-gray-400 text-sm mb-6">
            {applications.length === 0
              ? "You haven't submitted any applications yet"
              : "No applications match your filters"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/voter-registration")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              New Registration (Form 6)
            </button>
            <button
              onClick={() => navigate("/voter-correction")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Correction Request (Form 8)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

// Application Card Component
