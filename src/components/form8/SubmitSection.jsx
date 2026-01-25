import React from 'react'
import { useNavigate } from 'react-router';

function SubmitSection() {
    const navigate = useNavigate()
  return (
    <div className="border rounded p-4 bg-green-50">
         <h2 className="font-semibold mb-3">Submit</h2>
   
         <button
           onClick={() => {
             navigate("/form8/2394823/uploaddoc");
           }}
           className="bg-blue-600 text-white px-6 py-2 rounded"
         >
           Submit Application
         </button>
       </div>
  )
}

export default SubmitSection