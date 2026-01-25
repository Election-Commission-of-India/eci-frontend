import { useDispatch, useSelector } from "react-redux";
import FormSectionCard from "./FormSectionCard";
import { updateField } from "../../store/slices/form6Slice";

function AddressSection() {
  const form6Data = useSelector((state) => state.form6);

  const dispatch = useDispatch();
  const handleChange = (fieldName, value) => {
    dispatch(updateField({ fieldName, value }));
  };

  return (
    <FormSectionCard title={"Address Details"}>
      <div className="border rounded p-4 bg-gray-50">
        <textarea
          className="input"
          placeholder="Full Address"
          name="address"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          value={form6Data.address}
        />
        <input
          className="input mt-2"
          placeholder="City"
          name="city"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          value={form6Data.city}
        />
        <input
          className="input mt-2"
          placeholder="Postal Code"
          name="postalCode"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          value={form6Data.postalCode}
        />
      </div>
    </FormSectionCard>
  );
}

export default AddressSection;
