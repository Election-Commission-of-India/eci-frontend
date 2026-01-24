import FormSectionCard from "./FormSectionCard";

function PersonalSection() {
  return (

    <FormSectionCard title="Personal Details">
    <div className="border rounded p-4 bg-gray-50">
      <h2 className="font-semibold mb-3">Personal Details</h2>

      <input className="input" placeholder="First Name" />
      <input className="input mt-2" placeholder="Last Name" />
      <input className="input mt-2" placeholder="Full Name" />
    </div>
    </FormSectionCard>
  );
}



export default PersonalSection;