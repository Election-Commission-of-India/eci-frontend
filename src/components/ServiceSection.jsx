import React from "react";
import GenericActionCard from "./GenericCard";

function ServiceSection() {
  return (
    <div className="border rounded-md h-full">
      <h3 className="text-white text-md md:text-lg bg-eci-primary rounded-t-md px-3 py-2">
        SERVICES
      </h3>

      <div className="p-3 flex flex-col gap-4">
        <GenericActionCard />
        <GenericActionCard />
        <GenericActionCard />
      </div>
    </div>
  );
}

export default ServiceSection;
