import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../store/slices/form6Slice";
import FormSectionCard from "./FormSectionCard";

function RelativeSection() {
  const form6Data = useSelector((state) => state.form6);
  const dispatch = useDispatch();

  return (
    <FormSectionCard title={"Relative Details"}>
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Relative Details</h2>

        {/* Father's Name */}
        <input
          className="input"
          placeholder="Father's Name"
          value={form6Data.fatherName}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "fatherName",
                value: e.target.value,
              })
            )
          }
        />

        {/* Mother's Name */}
        <input
          className="input mt-2"
          placeholder="Mother's Name"
          value={form6Data.motherName}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "motherName",
                value: e.target.value,
              })
            )
          }
        />

        {/* Husband's Name (Optional) */}
        <input
          className="input mt-2"
          placeholder="Husband's Name (if applicable)"
          value={form6Data.husbandName || ""}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "husbandName",
                value: e.target.value,
              })
            )
          }
        />
      </div>
    </FormSectionCard>
  );
}

export default RelativeSection;
