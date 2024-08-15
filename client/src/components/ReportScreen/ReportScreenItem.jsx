import React from 'react'
import { useRef, useEffect } from 'react';


import './ReportScreenItem.css';

function ReportScreenItem({ tissue, crossSectionArea, meanHU, isHeader}) {

  return (
    <div className="ReportScreenItem">
        <div> {tissue} </div>
        <div> {crossSectionArea} </div>
        <div> {meanHU} </div>
    </div>
  )
}

export default ReportScreenItem