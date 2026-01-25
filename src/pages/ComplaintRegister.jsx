import React, { useState } from "react";
import FormSectionCard from "../components/form6/FormSectionCard";
import { useNavigate } from "react-router";

function RegisterComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    epicNumber: "",
    complaintType: "",
    subject: "",
    description: "",
    assemblyConstituency: "",
    pollingStation: "",
    priority: "MEDIUM",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final DTO ready to send
    const payload = {
      ...form,
      assemblyConstituency: Number(form.assemblyConstituency),
      pollingStation: Number(form.pollingStation),
    };

    console.log("Complaint DTO →", payload);

    // TODO: POST /api/complaints
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Register Complaint
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSectionCard title="EPIC Number">
          <input
            type="text"
            name="epicNumber"
            value={form.epicNumber}
            onChange={handleChange}
            maxLength={20}
            placeholder="Enter EPIC Number"
            className="input"
            required
          />
        </FormSectionCard>

        <FormSectionCard title="Complaint Type">
          <select
            name="complaintType"
            value={form.complaintType}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">-- Select Complaint Type --</option>
            <option value="NAME_MISSING_IN_ROLL">Name Missing in Roll</option>
            <option value="WRONG_VOTER_DETAILS">Wrong Voter Details</option>
            <option value="DUPLICATE_EPIC">Duplicate EPIC</option>
            <option value="DECEASED_VOTER_PRESENT">
              Deceased Voter Present
            </option>
            <option value="BLO_NOT_RESPONDING">BLO Not Responding</option>
            <option value="POLLING_STATION_TOO_FAR">
              Polling Station Too Far
            </option>
            <option value="MALPRACTICE_AT_BOOTH">Malpractice at Booth</option>
            <option value="TECHNICAL_ISSUE">Technical Issue</option>
            <option value="GENERAL_COMPLAINT">General Complaint</option>
          </select>
        </FormSectionCard>

        <FormSectionCard title="Subject">
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="input"
            placeholder="Short summary of complaint"
            required
          />
        </FormSectionCard>

        <FormSectionCard title="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Describe the issue in detail"
            required
          />
        </FormSectionCard>

        <FormSectionCard title="Your Jurisdiction">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value="Rajaji Nagar"
              disabled
              className="input bg-gray-100 cursor-not-allowed"
            />

            <input
              type="text"
              value="PS–123, Govt School Building"
              disabled
              className="input bg-gray-100 cursor-not-allowed"
            />
          </div>
        </FormSectionCard>
        {/* Priority */}
        <FormSectionCard title="Priority">
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="input"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </FormSectionCard>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              navigate("/complaints/23423/uploaddoc");
            }}
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterComplaint;
