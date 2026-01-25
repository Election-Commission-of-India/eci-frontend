import React from "react";
import GenericActionCard from "./GenericCard";
import voterImg from "../assets/voter_registration.png";
import { useNavigate } from "react-router";

function FormSection() {
  const navigate = useNavigate();

  return (
    <div className="border rounded-md h-full">
      <h3 className="text-white text-md md:text-lg bg-eci-primary rounded-t-md px-3 py-2">
        FORMS
      </h3>

      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <GenericActionCard
          title="New Voter Registration"
          description="Fill Form 6 if you are 18 years or above."
          primaryAction={{ label: "Fill Form 6", onClick: () => { navigate("/form6")} }}
         
         imageSrc={voterImg}
          theme={{
            border: "border-pink-400",
            bg: "bg-pink-50",
            iconBg: "bg-pink-200",
            primaryBtn: "bg-pink-500 hover:bg-pink-600",
          }}
        />

        <GenericActionCard
          title={"Correction of Enties"}
          description={
            "Fill Form 8 to get EPIC with updated or replacement or marking of PwD."
          }
          imageSrc={
            "https://voters.eci.gov.in/static/media/form8Filled.a087b41a5768be7e375ada95a730025f.svg"
          }
          primaryAction={{
            label: "Fill Form 8",
            onClick: () => navigate("/form8"),
          }}
            theme={{
            border: "border-green-400",
            bg: "bg-green-50",
            iconBg: "bg-green-200",
            primaryBtn: "bg-green-500 hover:bg-green-600",
          }}
        />
        <GenericActionCard />
      </div>
    </div>
  );
}

export default FormSection;
