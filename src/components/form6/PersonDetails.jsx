import { useDispatch, useSelector } from "react-redux";
import FormSectionCard from "./FormSectionCard";
import { updateField } from "../../store/slices/form6Slice";

function PersonalSection() {
  const form6Date = useSelector((state) => state.form6);

  const dispatch = useDispatch();

  const handleChange = (fieldName, value) => {
    dispatch(updateField({ fieldName, value }));
  };

  return (
    <FormSectionCard title="Personal Details">
      <div className="border rounded p-4 bg-gray-50">
        <input
        required
          value={form6Date.firstName}
          name="firstName"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          className="input"
          placeholder="First Name"
        />
        <input
        required
          value={form6Date.lastName}
          name="lastName"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          className="input mt-2"
          placeholder="Last Name"
        />
        <input
        required
          value={form6Date.fullName}
          name="fullName"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          className="input mt-2"
          placeholder="Full Name"
        />
      </div>
    </FormSectionCard>
  );
}

export default PersonalSection;
