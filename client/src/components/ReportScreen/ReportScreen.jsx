import React from 'react';
import { useEffect, useState } from 'react';
import ReportScreenItem from './ReportScreenItem';
import { API_ORIGIN } from '../../helpers/constants';
import './ReportScreen.css';

function ReportScreen({ sessionKey }) {
  const [maskData, setMaskData] = useState({});

  useEffect(() => {
    if (typeof sessionKey !== 'undefined'){
      const formData = new FormData();
      formData.append('sessionKey', sessionKey)
      fetch(`${API_ORIGIN}/api/mask-data`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (!response.ok){
          console.error("Cannot connect to server!");
        }
        return response.json()
      }).then((data) => {
        setMaskData(data);
      })
    }
  }, [sessionKey])
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
            const crossSectionArea = (typeof organData.volume_cm === 'number') ? <>{organData.volume_cm} cm<sup>3</sup></> : organData.volume_cm
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