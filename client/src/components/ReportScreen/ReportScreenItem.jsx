import React from 'react'
import { useRef, useEffect } from 'react';


import './ReportScreenItem.css';

function ReportScreenItem({ tissue, crossSectionArea, meanHU, isHeader}) {
    const tissue_ref = useRef();
    const crossSection_ref = useRef();
    const meanHU_ref = useRef();


    useEffect(() => {
        if (isHeader === true){
            tissue_ref.current.style.fontFamily = "AptosBold";
            crossSection_ref.current.style.fontFamily = "AptosBold";
            meanHU_ref.current.style.fontFamily = "AptosBold";
        }
    })
    


  return (
    <div className="ReportScreenItem">
        <div className="tissue-column" ref={tissue_ref}> {tissue} </div>
        <div className="crossSectionArea-column" ref={crossSection_ref}> {crossSectionArea} </div>
        <div className="meanHU-column" ref={meanHU_ref}> {meanHU} </div>
    </div>
  )
}

export default ReportScreenItem