import { useNavigate } from "react-router";

export default function ApplicationCard({ application }) {
  const navigate = useNavigate();

  const statusColors = {
    SUBMITTED: "bg-blue-100 text-blue-800 border-blue-300",
    UNDER_VERIFICATION: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
  };

  const formTypeLabels = {
    FORM6: "New Voter Registration",
    FORM8: "Electoral Roll Correction",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {application.applicationNumber}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formTypeLabels[application.formType]}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
              statusColors[application.applicationStatus]
            }`}
          >
            {application.applicationStatus.replace(/_/g, " ")}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b">
          <div>
            <p className="text-xs text-gray-500 mb-1">Applicant Name</p>
            <p className="font-medium text-gray-900">
              {application.fullName ||
                `${application.firstName} ${application.lastName}`}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Submitted Date</p>
            <p className="font-medium text-gray-900">
              {formatDate(application.submittedDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Assembly Constituency</p>
            <p className="font-medium text-gray-900">
              {application.assemblyConstituencyName || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Polling Station</p>
            <p className="font-medium text-gray-900">
              {application.pollingStationName || "N/A"}
            </p>
          </div>
        </div>

        {/* BLO Info (if assigned) */}
        {application.assignedBloName && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-600 font-semibold mb-1">
              Assigned BLO
            </p>
            <p className="text-sm font-medium text-blue-900">
              {application.assignedBloName}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/application/${application.id}`)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => navigate(`/track/${application.applicationNumber}`)}
            className="flex-1 border-2 border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Track Status
          </button>
        </div>
      </div>
    </div>
  );
}
