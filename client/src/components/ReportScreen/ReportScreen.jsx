import React from 'react';
import { useEffect, useState } from 'react';
import ReportScreenItem from './ReportScreenItem';
import './ReportScreen.css';

function ReportScreen({ serverDir }) {
  const [maskData, setMaskData] = useState({});

  useEffect(() => {
    if (typeof serverDir !== 'undefined'){
      fetch(`/api/mask-data/${serverDir}`)
      .then((response) => {
        if (!response.ok){
          console.error("Cannot connect to server!");
        }
        return response.json()
      }).then((data) => {
        console.log('fetched mask data');
        setMaskData(data);
      })
    }
  }, [serverDir])
  return (
    <div className="ReportScreen">
      <div className="header-line"></div>
      <div className="ReportScreenHeader">
        <div>Tissue</div>
        <div>Cross-sectional Area</div>
        <div>Mean HU</div>
      </div>
      <div className="header-line"></div>
 
      <div className="items"> 
        {(typeof maskData.data === 'undefined') ? (
          <div>Loading...</div>
        ) : (
          maskData.data.map((organData, i) => {
            const crossSectionArea = (typeof organData.volume_cm === 'number') ? <div>{organData.volume_cm} cm<sup>3</sup></div> : "Incomplete Organ"
            return (<ReportScreenItem
              key={i}
              tissue={organData.id}
              crossSectionArea={crossSectionArea}
              meanHU={organData.mean_hu}/>
          )})
            
          
        )} 
        <div className="header-line"></div>
      </div>
      
      
    </div>
  )
}

export default ReportScreen