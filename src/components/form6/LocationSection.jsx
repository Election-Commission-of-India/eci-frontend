import FormSectionCard from "./FormSectionCard";

export default function LocationSection() {
  return (
    <FormSectionCard title="A. Select State, District & Assembly Constituency">
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Location Details</h2>

        <select className="input">
          <option>Select Assembly Constituency</option>
        </select>

        <select className="input mt-2">
          <option>Select Polling Station</option>
        </select>

        <input className="input mt-2" placeholder="Part Number (Optional)" />
      </div>
    </FormSectionCard>
  );
}
