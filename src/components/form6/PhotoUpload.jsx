import FormSectionCard from "./FormSectionCard";

function PhotoUploadSection() {
  return (
    <FormSectionCard title={"Upload Photograph"}>
      <div className="border rounded p-4 bg-gray-50">
        <input type="file" accept="image/*" />

        <p className="text-sm text-gray-500 mt-2">
          Upload passport size photo (JPG/PNG, max 2MB)
        </p>
      </div>
    </FormSectionCard>
  );
}

export default PhotoUploadSection;
