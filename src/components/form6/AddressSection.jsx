import FormSectionCard from "./FormSectionCard";

function AddressSection() {
  return (

    <FormSectionCard title={ "Address Details"}>
    <div className="border rounded p-4 bg-gray-50">
     

      <textarea className="input" placeholder="Full Address" />
      <input className="input mt-2" placeholder="City" />
      <input className="input mt-2" placeholder="Postal Code" />
    </div>
    </FormSectionCard>
  );
}



export default AddressSection;