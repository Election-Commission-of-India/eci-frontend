import React from "react";
import GenericActionCard from "./GenericCard";

function FormSection() {
  return (
    <div className="border rounded-md h-full">
      <h3 className="text-white text-md md:text-lg bg-eci-primary rounded-t-md px-3 py-2">
        FORMS
      </h3>

      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <GenericActionCard />
        <GenericActionCard />
        <GenericActionCard />
      </div>
    </div>
  );
}

export default FormSection;
