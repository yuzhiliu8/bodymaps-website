import React from 'react'

import './ReportScreenItem.css';

function ReportScreenItem({ tissue, crossSectionArea, meanHU }) {

  return (
    <div className="ReportScreenItem">
        <div> {tissue} </div>
        <div> {crossSectionArea} </div>
        <div> {meanHU} </div>
    </div>
  )
}

export default ReportScreenItem