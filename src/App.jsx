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

        <Route path="/form8" element={<VoterCorrection/>}/>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
