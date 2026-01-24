import { useLocation, useNavigate } from "react-router";
import { PreviewSection } from "../PreviewSection";
import { PreviewField } from "../PreviewField";

export default function Form6Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p className="p-4">No preview data available</p>;
  }

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

      {/* A. Location Details */}
      <PreviewSection title="A. Location Details">
        <PreviewField
          label="Assembly Constituency"
          value={state.assemblyConstituencyName}
        />
        <PreviewField
          label="Polling Station"
          value={state.pollingStationName}
        />
        <PreviewField label="Part Number" value={state.partNumber} />
      </PreviewSection>

      {/* B. Personal Details */}
      <PreviewSection title="B. Personal Details">
        <PreviewField label="First Name" value={state.firstName} />
        <PreviewField label="Last Name" value={state.lastName} />
        <PreviewField label="Full Name" value={state.fullName} />
        <PreviewField label="Father's Name" value={state.fatherName} />
        <PreviewField label="Mother's Name" value={state.motherName} />
        <PreviewField
          label="Marital Status"
          value={state.marital_status ? "Married" : "Unmarried"}
        />
      </PreviewSection>

      {/* C. Address Details */}
      <PreviewSection title="C. Address Details">
        <PreviewField label="Address" value={state.address} />
        <PreviewField label="City" value={state.city} />
        <PreviewField label="Postal Code" value={state.postalCode} />
      </PreviewSection>

      {/* D. DOB & Gender */}
      <PreviewSection title="D. Date of Birth & Gender">
        <PreviewField label="Date of Birth" value={state.dob} />
        <PreviewField label="Gender" value={state.gender} />
      </PreviewSection>

      {/* E. Photo */}
      <PreviewSection title="E. Uploaded Photograph">
        {state.photoPreview ? (
          <img
            src={state.photoPreview}
            alt="Uploaded"
            className="w-32 h-40 object-cover border rounded"
          />
        ) : (
          <span className="text-gray-500">No photo uploaded</span>
        )}
      </PreviewSection>

      {/* F. Declaration */}
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
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Edit Application
        </button>

        <button
          onClick={() => {
            /* call createApplication API */
            navigate("/form6/3534/uploaddoc")
          }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Final Submit
        </button>
      </div>
    </div>
  );
}
