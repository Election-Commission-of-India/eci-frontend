import React from "react";
import EpicSection from "../components/form8/EpicSection";
import FieldToCorrect from "../components/form8/FieldToCorrect";
import LocationSection from "../components/form6/LocationSection";
import SubmitSection from "../components/form8/SubmitSection";

function VoterCorrection() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6  flex flex-col gap-6">
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Form 8</h1>
        <p className="text-sm text-gray-600">
          Application for correction in electoral roll for existing voters
        </p>
      </div>

      <div className="flex flex-col space-y-10">
        <section id="epic">
          <EpicSection />
        </section>
        <section id="fieldToCorrect">
          <FieldToCorrect />
        </section>
        <section id="location">
          <LocationSection />
        </section>
        <section id="submit">
          <SubmitSection />
        </section>
      </div>
    </div>
  );
}

export default VoterCorrection;
