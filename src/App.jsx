import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form6 from "./components/form6/Form6";
import VoterRegistration from "./pages/VoterRegistration";
import Form6Preview from "./components/form6/Form6Preview";
import UploadDocuments from "./pages/UploadDocumentPage";
import VoterCorrection from "./pages/VoterCorrection";
import UploadSupportingDocuments from "./pages/UploadSupportingDcoument";
import Complaint from "./pages/ComplaintLanding";
import ComplaintRegister from "./pages/ComplaintRegister";
import ComplaintDocuments from "./pages/ComplaintDocuments";
import { ToastContainer } from "react-toastify";
import ApplicationComplete from "./pages/ApplicationComplete";
import TrackApplicaiton from "./pages/TrackApplicaiton";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import MyApplications from "./pages/MyApplication";
import ApplicationDetails from "./pages/ApplicationDetail";
import TrackComplaint from "./pages/TrackComplaint";

function App() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Header />

        {/* Main Content - Takes up remaining space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/form6" element={<VoterRegistration />} />
            <Route path="/form6/preview" element={<Form6Preview />} />
            <Route
              path="/form6/:applicationId/uploaddoc"
              element={<UploadDocuments />}
            />
            <Route
              path="/form8/:applicationId/uploaddoc"
              element={<UploadSupportingDocuments />}
            />

            <Route path="/form8" element={<VoterCorrection />} />
            <Route path="/complaint" element={<Complaint />} />
            <Route path="/complaints/new" element={<ComplaintRegister />} />
            <Route
              path="/complaints/:complaintId/uploaddoc"
              element={<ComplaintDocuments />}
            />
            <Route
              path="/application/:applicationId/complete"
              element={<ApplicationComplete />}
            />
            <Route path="/track/status" element={<TrackApplicaiton />} />
            <Route path="/complaints/success" element={<ComplaintSuccess />} />

            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/application/:id" element={<ApplicationDetails />} />
            <Route path="/complaints/track" element ={<TrackComplaint />}/>
            
          </Routes>
        </main>

        {/* Footer - Always at bottom */}
        <Footer />
      </div>

      <ToastContainer limit={2000} />
    </div>
  );
}

export default App;
