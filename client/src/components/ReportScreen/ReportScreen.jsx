import React from 'react';
import { useEffect, useState } from 'react';
import ReportScreenItem from './ReportScreenItem';
import { APP_CONSTANTS } from '../../helpers/constants';
import './ReportScreen.css';
import { filenameToName } from '../../helpers/util';

function ReportScreen({ sessionKey }) {
  const [maskData, setMaskData] = useState({});

  useEffect(() => {
    if (typeof sessionKey !== 'undefined'){
      const formData = new FormData();
      formData.append('sessionKey', sessionKey)
      fetch(`${APP_CONSTANTS.API_ORIGIN}/api/mask-data`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (!response.ok){
          console.error("Cannot connect to server!");
        }
        return response.json()
      }).then((data) => {
        console.log(data);
        setMaskData(data);
      })
    }
  }, [sessionKey])
  return (
    <div className="ReportScreen">
      <div className="header-line"></div>
      <div className="ReportScreenHeader">
        <div>Tissue</div>
        <div>Volume</div>
        <div>Mean HU</div>
      </div>
      <div className="header-line"></div>
 
      <div className="items"> 
        {(typeof maskData.organ_metrics === 'undefined') ? (
          <div>Loading...</div>
        ) : (
          console.log('render'),
          maskData.organ_metrics.map((organData, i) => {
            const crossSectionArea = (typeof organData.volume_cm3 === 'number') ? <>{organData.volume_cm3} cm<sup>3</sup></> : organData.volume_cm3
            return (<ReportScreenItem
              key={i}
              tissue={filenameToName(organData.organ_name)}
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