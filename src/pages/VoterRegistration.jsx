import React from "react";
import Form6Sidebar from "../components/form6/Form6SideBar";
import Form6 from "../components/form6/Form6";

function VoterRegistration() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:block w-64">
        <Form6Sidebar />
      </aside>

      {/* Form Content */}
      <main className="flex-1 p-4">
        <Form6 />
      </main>
    </div>
  );
}

export default VoterRegistration;
