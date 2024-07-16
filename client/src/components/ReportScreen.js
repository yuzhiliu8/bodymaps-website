import React from 'react';

import ReportScreenItem from './ReportScreenItem.js';
import './ReportScreen.css';

function ReportScreen() {
  return (
    <div className="ReportScreen">
      <div className="header-line"></div>
      <ReportScreenItem 
      tissue={"Tissue"}
      crossSectionArea={"Cross-sectional Area"}
      meanHU={"Mean HU"}
      isHeader={true}/>
      <div className="header-line"></div>

      <div className="items">
        <ReportScreenItem 
        tissue={"Aorta"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Gallbladder"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Kidney (L)"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Kidney (R)"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Liver"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Pancreas"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Postcava"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Spleen"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>

        <ReportScreenItem 
        tissue={"Stomach"}
        crossSectionArea={"placeholder"}
        meanHU={"placeholder"}
        isHeader={false}/>
      </div>
      <div className="header-line"></div>
    </div>
  )
}

export default ReportScreen