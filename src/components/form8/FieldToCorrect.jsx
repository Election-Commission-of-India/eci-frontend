import React, { useState } from "react";
import FormSectionCard from "../form6/FormSectionCard";
import renderFieldInput from "./NewValueField";

function FieldToCorrect() {
  const [field, setField] = useState("");
  const [newValue, setNewValue] = useState("");

  return (
    <FormSectionCard title="A. Select Field for Correction">
      <div className="space-y-4">

        {/* Field selector */}
        <select
          className="input"
          value={field}
          onChange={(e) => {
            setField(e.target.value);
            setNewValue(""); // reset on change
          }}
        >
          <option value="">-- Select Field --</option>
          <option value="FULL_NAME">Full Name</option>
          <option value="DOB">Date of Birth</option>
          <option value="GENDER">Gender</option>
          <option value="ADDRESS">Address</option>
          <option value="RELATIVE_NAME">Relative Name</option>
        </select>

        {/* Dynamic field */}   
        {renderFieldInput(field, newValue, setNewValue)}
      </div>
    </FormSectionCard>
  );
}

export default FieldToCorrect;
