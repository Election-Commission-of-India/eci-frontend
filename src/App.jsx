import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Header from "./components/HeaderCitizen";
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
import ComplaintSuccess from "./pages/ComplaintSuccess";
import MyApplications from "./pages/MyApplication";
import ApplicationDetails from "./pages/ApplicationDetail";
import TrackComplaint from "./pages/TrackComplaint";



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

// Admin Components
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminUserManagementPage from "./admin/pages/AdminUserManagementPage";
import AdminConstituencyManagementPage from "./admin/pages/AdminConstituencyManagementPage";
import AdminPollingStationManagementPage from "./admin/pages/AdminPollingStationManagementPage";
import AdminDocumentTypeManagementPage from "./admin/pages/AdminDocumentTypeManagementPage";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
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
              </Routes>
              <Footer />
            </div>
          } />

          {/* ERO Routes */}
          <Route path="/ero/login" element={<EroLoginPage />} />
          <Route path="/ero" element={<EroLayout />}>
            <Route path="dashboard" element={<EroDashboardPage />} />
            <Route path="applications" element={<EroApplicationsPage />} />
            <Route path="applications/:applicationId/details" element={<EroApplicationDetailsPage />} />
            <Route path="voters" element={<EroVotersPage />} />
            <Route path="blo-assignment" element={<EroBloAssignmentPage />} />
            <Route path="complaints" element={<EroComplaintsPage />} />
            <Route path="documents/application/:applicationId" element={<EroDocumentsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUserManagementPage />} />
            <Route path="constituencies" element={<AdminConstituencyManagementPage />} />
            <Route path="polling-stations" element={<AdminPollingStationManagementPage />} />
            <Route path="document-types" element={<AdminDocumentTypeManagementPage />} />
          </Route>

        </Routes>

        <ToastContainer limit={2000} />
      </div>
    </AuthProvider>

  );
}

export default App;
