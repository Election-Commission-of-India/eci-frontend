import { useNavigate } from "react-router";
import { dummyPreviewData } from "../../util/dummy";

function SubmitSection() {
  const navigate = useNavigate();
  return (
    <div className="border rounded p-4 bg-green-50">
      <h2 className="font-semibold mb-3">Preview & Submit</h2>

      <button
        onClick={() => {
          navigate("/form6/preview", { state: dummyPreviewData });
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit Application
      </button>
    </div>
  );
}

export default SubmitSection;
