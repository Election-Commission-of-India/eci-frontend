import FormSectionCard from "./FormSectionCard";

function DobGenderSection() {
  return (

    <FormSectionCard title={"3.Date of birth and Gender Details"}>
    <div className="border rounded p-4 bg-gray-50">
      <h2 className="font-semibold mb-3">Date of Birth & Gender</h2>

      <input type="date" className="input" />

      <select className="input mt-2">
        <option>Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>

      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" />
        Married
      </label>
    </div>
    </FormSectionCard>
  );
}



export default DobGenderSection;