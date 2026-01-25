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

function App() {
  return (
    <div>
      <Header />
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
        <Route path="/complaints/:complaintId/uploaddoc" element= {<ComplaintDocuments/>}/>
        <Route path="/application/:applicationId/complete" element = {<ApplicationComplete/>} />
        <Route path="/track/status" element = {<TrackApplicaiton/>}/>

              </Routes>

      <Footer />
      <ToastContainer limit={2000}/>
    </div>
  );
}

export default App;
