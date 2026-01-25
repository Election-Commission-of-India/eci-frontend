import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function SubmitSection() {
  const navigate = useNavigate();
  const form6Data = useSelector((state) => state.form6);

  const handlePreview = () => {
   
    navigate("/form6/preview", { state: form6Data  });
  };

  return (
    <div className="border rounded p-4 bg-green-50">
      <h2 className="font-semibold mb-3">Preview & Submit</h2>

    
      {form6Data.error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {form6Data.error}
        </div>
      )}

      <button
        onClick={handlePreview}
        disabled={form6Data.isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {form6Data.isLoading ? "Processing..." : "Preview Application"}
      </button>
    </div>
  );
}

export default SubmitSection;
