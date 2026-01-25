import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../store/slices/form6Slice";
import FormSectionCard from "./FormSectionCard";

function DobGenderSection() {
  const form6Data = useSelector((state) => state.form6);
  const dispatch = useDispatch();

  return (
    <FormSectionCard title={"3. Date of birth and Gender Details"}>
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Date of Birth & Gender</h2>

        {/* Date of Birth */}
        <input
          type="date"
          className="input"
          value={form6Data.dob}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "dob",
                value: e.target.value,
              })
            )
          }
        />

        {/* Gender */}
        <select
          className="input mt-2"
          value={form6Data.gender}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "gender",
                value: e.target.value,
              })
            )
          }
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Marital Status */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form6Data.marital_status}
            onChange={(e) =>
              dispatch(
                updateField({
                  fieldName: "marital_status",
                  value: e.target.checked,
                })
              )
            }
          />
          Married
        </label>
      </div>
    </FormSectionCard>
  );
}

export default DobGenderSection;
