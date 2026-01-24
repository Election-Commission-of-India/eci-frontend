import PersonalSection from "./PersonDetails";
import LocationSection from "./LocationSection"
import AddressSection from "./AddressSection";
import DobGenderSection from "./DobGenderSection";
import PhotoUploadSection from "./PhotoUpload";
import SubmitSection from "./SubmitSection";
export default function Form6() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Form 6</h1>
        <p className="text-sm text-gray-600">
          Application for inclusion of name in electoral roll for new voters
        </p>
      </div>

      <div className="flex flex-col space-y-10">
        <section id="location">
         <LocationSection/> 
        </section>

        <section id="personal">
          <PersonalSection />
        </section>

        <section id="address">
          <AddressSection />
        </section>

        <section id="dob">
          <DobGenderSection />
        </section>

        <section id="photo">
          <PhotoUploadSection />
        </section>

        <section id="submit">
          <SubmitSection />
        </section>
      </div>
    </div>
  );
}
