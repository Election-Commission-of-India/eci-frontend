import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { PreviewSection } from "../PreviewSection";
import { PreviewField } from "../PreviewField";
import { applicationAPI } from "../../services/applicationApis";
import { resetForm } from "../../store/slices/form6Slice";
import { toast } from "react-toastify";
import LoadingSmall from "../SmallLoading";

export default function Form6Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [ ,setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Prevent back navigation after submission
  useEffect(() => {
    if (submitted) {
      // Block browser back button
      const handlePopState = (e) => {
        e.preventDefault();
        toast.warning("Application already submitted. Cannot go back.");
        navigate(`/form6/${state.applicationId}/uploaddoc`, { replace: true });
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [submitted]);

  if (!state) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>No preview data available. Please fill the form first.</p>
          <button
            onClick={() => navigate("/form6")}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitForm = async () => {
    if (submitted) {
      toast.warning("Application already submitted!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = {
        formType: "FORM6",
        firstName: state.firstName,
        lastName: state.lastName,
        fullName: state.fullName,
        dob: state.dob,
        gender: state.gender,
        fatherName: state.fatherName,
        motherName: state.motherName,
        husbandName: state.husbandName || "",
        marital_status: state.marital_status,
        address: state.address,
        city: state.city,
        postalCode: state.postalCode,
        assemblyConstituencyId: state.assemblyConstituencyId,
        pollingStationId: state.pollingStationId,
        partNumber: state.partNumber || null,
        photoPath: state.photoPath || "default.jpg",
        relatedEpicNumber: null,
        fieldToCorrect: null,
        oldValue: null,
        newValue: null,
        deletionReason: null,
        fromConstituencyId: null,
        toConstituencyId: null,
        fromPartNumber: null,
        toPartNumber: null,
        newAddress: null,
      };

      const response = await applicationAPI.createApplication(formData);
      console.log(response);

      if (response.success) {
        const respData = response.data;
        console.log(respData)
        const applicationNumber = respData.applicationNumber;
        const applicationId = respData.applicationId;
        
        setSubmitted(true); // Mark as submitted
        
        toast.success(
          `Application submitted successfully! Application Number: ${applicationNumber}`
        );

        // Reset form in Redux
        dispatch(resetForm());

        // Navigate to document upload (use replace to prevent back navigation)
        navigate(`/form6/${applicationId}/uploaddoc`, {
          replace: true, // This prevents going back
          state: { applicationId, applicationNumber, isNewSubmission: true },
        });
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Form 6 – Application Preview
        </h1>
        <p className="text-sm text-gray-600">
          Application for inclusion of name in electoral roll for new voters
        </p>
      </div>

   

      {/* Preview sections - same as before */}
      <PreviewSection title="A. Location Details">
        <PreviewField
          label="Assembly Constituency ID"
          value={state.assemblyConstituencyId}
        />
        <PreviewField
          label="Polling Station ID"
          value={state.pollingStationId}
        />
      </PreviewSection>

      <PreviewSection title="B. Personal Details">
        <PreviewField label="First Name" value={state.firstName} />
        <PreviewField label="Last Name" value={state.lastName} />
        <PreviewField label="Full Name" value={state.fullName} />
        <PreviewField label="Father's Name" value={state.fatherName} />
        <PreviewField label="Mother's Name" value={state.motherName} />
      </PreviewSection>

      <PreviewSection title="C. Address Details">
        <PreviewField label="Address" value={state.address} />
        <PreviewField label="City" value={state.city} />
        <PreviewField label="Postal Code" value={state.postalCode} />
      </PreviewSection>

      <PreviewSection title="D. Date of Birth & Gender">
        <PreviewField label="Date of Birth" value={state.dob} />
        <PreviewField label="Gender" value={state.gender} />
      </PreviewSection>

      <PreviewSection title="F. Declaration">
        <p className="text-sm text-gray-700">
          I hereby declare that the information furnished above is true to the
          best of my knowledge and belief.
        </p>
      </PreviewSection>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          onClick={() => navigate(-1)}
          disabled={loading || submitted}
          className="border px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit Application
        </button>

        <button
          onClick={handleSubmitForm}
          disabled={loading || submitted}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <LoadingSmall size="sm" />}
          {submitted ? "Already Submitted" : loading ? "Submitting..." : "Final Submit"}
        </button>
      </div>
    </div>
  );
}
