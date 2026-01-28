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
        <GenericActionCard title={"Track Application Status"} description={"Track all your form status here."} imageSrc={
          "https://voters.eci.gov.in/static/media/trackApplication.44d58f300a875a5c5732.png"
        } primaryAction={{ label: "Track", onClick: () => { navigate("/track/status") } }}  theme={{
            border: "border-orange-400",
            bg: "bg-orange-50",
            iconBg: "bg-orange-200",
            primaryBtn: "bg-orange-500 hover:bg-orange-600",
            }}  />
        <GenericActionCard />
      </div>
    </div>
  );
}

export default ServiceSection;
