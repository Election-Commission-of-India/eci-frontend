import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import FormSection from "../components/FormSection";
import Header from "../components/HeaderCitizen";
import ServiceSection from "../components/ServiceSection";

export default function Home() {
  return (
    <div className="px-3 md:px-6">
      <div className="flex flex-col md:flex-row gap-4 mt-4 mb-4">
        <div className="w-full md:w-2/3">
          <FormSection />
        </div>

        <div className="w-full md:w-1/3">
          <ServiceSection />
        </div>
      </div>

      <AboutUs />
      <div className="mt-6">
        <ContactUs />
      </div>
    </div>
  );
}
