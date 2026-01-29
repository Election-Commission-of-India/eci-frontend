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
import "react-toastify/dist/ReactToastify.css";
import ApplicationComplete from "./pages/ApplicationComplete";
import TrackApplicaiton from "./pages/TrackApplicaiton";

// Auth Components
import { LoginPage as AuthLoginPage, SignupPage as AuthSignupPage } from "./auth";

// ERO Components
import EroLoginPage from "./ero/pages/EroLoginPage";
import EroLayout from "./ero/components/EroLayout";
import EroDashboardPage from "./ero/pages/EroDashboardPage";
import EroApplicationsPage from "./ero/pages/EroApplicationsPage";
import EroApplicationDetailsPage from "./ero/pages/EroApplicationDetailsPage";
import EroVotersPage from "./ero/pages/EroVotersPage";
import EroBloAssignmentPage from "./ero/pages/EroBloAssignmentPage";
import EroComplaintsPage from "./ero/pages/EroComplaintsPage";
import EroDocumentsPage from "./ero/pages/EroDocumentsPage";

// BLO Components
import BloLoginPage from "./blo/pages/BloLoginPage";
import BloLayout from "./blo/components/BloLayout";
import BloDashboardPage from "./blo/pages/BloDashboardPage";
import BloProfilePage from "./blo/pages/BloProfilePage";
import AssignedApplicationsPage from "./blo/pages/AssignedApplicationsPage";
import ApplicationDetailsPage from "./blo/pages/ApplicationDetailsPage";
import ApplicationDocumentsPage from "./blo/pages/ApplicationDocumentsPage";
import ApplicationRecommendationPage from "./blo/pages/ApplicationRecommendationPage";
import BloAuthGuard from "./blo/components/BloAuthGuard";

// Voter Search Components
import VoterSearch from "./pages/voter/VoterSearch";
import VoterDetails from "./pages/voter/VoterDetails";

// Admin Components
import AuditLogs from "./pages/admin/AuditLogs";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={
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
              <Route path="/complaints/:complaintId/uploaddoc" element={<ComplaintDocuments />} />
              <Route path="/application/:applicationId/complete" element={<ApplicationComplete />} />
              <Route path="/track/status" element={<TrackApplicaiton />} />
              <Route path="/voters/search" element={<VoterSearch />} />
              <Route path="/voters/:voterId" element={<VoterDetails />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Routes>
            <Footer />
          </div>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/signup" element={<AuthSignupPage />} />

        {/* ERO Routes - No Auth for Testing */}
        <Route path="/ero/login" element={<EroLoginPage />} />
        <Route path="/ero" element={<EroLayout />}>
          <Route path="dashboard" element={<EroDashboardPage />} />
          <Route path="applications" element={<EroApplicationsPage />} />
          <Route path="applications/:applicationId/details" element={<EroApplicationDetailsPage />} />
          <Route path="voters" element={<EroVotersPage />} />
          <Route path="voter-search" element={<VoterSearch />} />
          <Route path="blo-assignment" element={<EroBloAssignmentPage />} />
          <Route path="complaints" element={<EroComplaintsPage />} />
          <Route path="documents/application/:applicationId" element={<EroDocumentsPage />} />
        </Route>

        {/* BLO Routes - Protected */}
        <Route path="/blo/login" element={<BloLoginPage />} />
        <Route path="/blo" element={<BloAuthGuard><BloLayout /></BloAuthGuard>}>
          <Route path="dashboard" element={<BloDashboardPage />} />
          <Route path="profile" element={<BloProfilePage />} />
          <Route path="applications" element={<AssignedApplicationsPage />} />
          <Route path="applications/:applicationId/details" element={<ApplicationDetailsPage />} />
          <Route path="applications/:applicationId/documents" element={<ApplicationDocumentsPage />} />
          <Route path="applications/:applicationId/recommend" element={<ApplicationRecommendationPage />} />
        </Route>

      </Routes>

      <ToastContainer limit={2000} />
    </div>
  );
}

export default App;
