import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import FormSectionCard from "../components/form6/FormSectionCard";
import LoadingSmall from "../components/SmallLoading";
import { complaintAPI } from "../services/applicationApis";
import { locationApis } from "../services/locationApis";
import { 
  updateField, 
  setAssemblies, 
  setPollingStations,
  resetForm

} from "../store/slices/complaintSlice";
import { toast } from "react-toastify";

function RegisterComplaint() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const complaintData = useSelector((state) => state.complaint);
  
  const [submitting, setSubmitting] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

 
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const assemblies = await locationApis.fetchAssemblyStation();
        const pollingStations = await locationApis.fetchPollingStation();
        
        dispatch(setAssemblies(assemblies));
        dispatch(setPollingStations(pollingStations));
      } catch (error) {
        toast.error("Failed to load locations"+ error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ fieldName: name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (!complaintData.complaintType) {
      toast.error("Please select complaint type");
      return;
    }

    if (!complaintData.subject || complaintData.subject.trim() === "") {
      toast.error("Please enter subject");
      return;
    }

    if (!complaintData.description || complaintData.description.trim() === "") {
      toast.error("Please enter description");
      return;
    }

    if (!complaintData.assemblyConstituency || !complaintData.pollingStation) {
      toast.error("Please select assembly constituency and polling station");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare payload
      const payload = {
        epicNumber: complaintData.epicNumber || null,
        complaintType: complaintData.complaintType,
        subject: complaintData.subject,
        description: complaintData.description,
        assemblyConstituency: complaintData.assemblyConstituency,
        pollingStation: complaintData.pollingStation,
        priority: complaintData.priority,
      };

      console.log("Complaint Payload:", payload);

      const response = await complaintAPI.createComplaint(payload);

      console.log("Backend Response:", response);

      if (response.success) {
       
        const complaintId = response.data?.complaintId || response.data?.id || response.data;
        const complaintNumber = response.data?.complaintNumber || `CMP-${complaintId}`;

        toast.success("Complaint registered successfully!");

        // Reset form
        dispatch(resetForm());

        // Navigate to upload documents
        navigate(`/complaints/${complaintId}/uploaddoc`, {
          replace: true,
          state: {
            complaintId,
            complaintNumber,
            isNewSubmission: true,
          },
        });
      } else {
        throw new Error(response.message || "Failed to register complaint");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to register complaint. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLocations) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSmall size="lg" />
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          📢 Register Complaint
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Report issues related to electoral roll, polling stations, or voting process
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* EPIC Number (Optional) */}
        <FormSectionCard title="EPIC Number (Optional)">
          <input
            type="text"
            name="epicNumber"
            value={complaintData.epicNumber}
            onChange={handleChange}
            maxLength={20}
            placeholder="Enter EPIC Number (if applicable)"
            className="input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank if complaint is not related to a specific voter
          </p>
        </FormSectionCard>

        {/* Complaint Type */}
        <FormSectionCard title="Complaint Type *">
          <select
            name="complaintType"
            value={complaintData.complaintType}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">-- Select Complaint Type --</option>
            <option value="NAME_MISSING_IN_ROLL">Name Missing in Roll</option>
            <option value="WRONG_VOTER_DETAILS">Wrong Voter Details</option>
            <option value="DUPLICATE_EPIC">Duplicate EPIC</option>
            <option value="DECEASED_VOTER_PRESENT">Deceased Voter Present</option>
            <option value="BLO_NOT_RESPONDING">BLO Not Responding</option>
            <option value="POLLING_STATION_TOO_FAR">Polling Station Too Far</option>
            <option value="MALPRACTICE_AT_BOOTH">Malpractice at Booth</option>
            <option value="TECHNICAL_ISSUE">Technical Issue</option>
            <option value="GENERAL_COMPLAINT">General Complaint</option>
          </select>
        </FormSectionCard>

        {/* Subject */}
        <FormSectionCard title="Subject *">
          <input
            type="text"
            name="subject"
            value={complaintData.subject}
            onChange={handleChange}
            className="input"
            placeholder="Brief summary of the complaint"
            maxLength={200}
            required
          />
        </FormSectionCard>

        {/* Description */}
        <FormSectionCard title="Description *">
          <textarea
            name="description"
            value={complaintData.description}
            onChange={handleChange}
            rows={5}
            className="input"
            placeholder="Describe the issue in detail..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {complaintData.description.length} characters
          </p>
        </FormSectionCard>

        {/* Location */}
        <FormSectionCard title="Location Details *">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assembly Constituency
              </label>
              <select
                name="assemblyConstituency"
                value={complaintData.assemblyConstituency || ""}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Assembly Constituency</option>
                {complaintData.assemblies.map((assembly) => (
                  <option key={assembly.id} value={assembly.id}>
                    {assembly.constituencyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Polling Station
              </label>
              <select
                name="pollingStation"
                value={complaintData.pollingStation || ""}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Polling Station</option>
                {complaintData.pollingStations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.stationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormSectionCard>

        {/* Priority */}
        <FormSectionCard title="Priority">
          <select
            name="priority"
            value={complaintData.priority}
            onChange={handleChange}
            className="input"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            High priority complaints are processed faster
          </p>
        </FormSectionCard>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your complaint will be registered with a unique complaint number</li>
            <li>• You can upload supporting documents (optional)</li>
            <li>• A BLO will be assigned to investigate</li>
            <li>• You'll receive updates via SMS and email</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <LoadingSmall size="sm" />}
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterComplaint;
