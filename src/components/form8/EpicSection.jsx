import React from 'react'
import FormSectionCard from '../form6/FormSectionCard'

function EpicSection() {
  return (
     <FormSectionCard title="Epic Number">
        <div className="border rounded p-4 bg-gray-50">
         
    
          <input className="input" type='text' value={"234234234"} readOnly placeholder="Epic_Number" />
          
        </div>
        </FormSectionCard>
  )
}

export default EpicSection