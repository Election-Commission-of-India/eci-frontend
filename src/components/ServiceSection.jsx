import React from "react";
import GenericActionCard from "./GenericCard";
import complaint from "../assets/complaint.png"
import { useNavigate } from "react-router";

function ServiceSection() {

  const navigate  = useNavigate();
  return (
    <div className="border rounded-md h-full">
      <h3 className="text-white text-md md:text-lg bg-eci-primary rounded-t-md px-3 py-2">
        SERVICES
      </h3>

      <div className="p-3 flex flex-col gap-4">
        <GenericActionCard  title={"Register Complaint/Track Complaint Application"}  imageSrc={complaint} 
  primaryAction={{ label: "Register", onClick: () => { navigate("/complaint") } }}    theme={{
            border: "border-blue-400",
            bg: "bg-blue-50",
            iconBg: "bg-blue-200",
            primaryBtn: "bg-blue-500 hover:bg-blue-600",
            }}/>
        <GenericActionCard 
          title={"Search Voter Information"} 
          primaryAction={{ label: "Search", onClick: () => { navigate("/voters/search") } }}
          theme={{
            border: "border-green-400",
            bg: "bg-green-50",
            iconBg: "bg-green-200",
            primaryBtn: "bg-green-500 hover:bg-green-600",
          }}
        />
      </div>
    </div>
  );
}

export default ServiceSection;
