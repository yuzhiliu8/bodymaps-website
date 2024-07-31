import React from 'react'
import { useRef, useEffect } from 'react'
import { setup } from '../helpers/helpers';

import './Visual.css';



function Visual({ niftiURL, filename }) {
  const axial_ref = useRef(null);
  const sagittal_ref = useRef(null);
  const coronal_ref = useRef(null);
  const acq_ref = useRef(null);
  
  useEffect(() => {              //TODO: Need to not make a new renderingEngine on every render. 
    if (axial_ref && sagittal_ref && coronal_ref){
      console.log("setup");  
      setup(axial_ref, sagittal_ref, coronal_ref, acq_ref, niftiURL);
    }  
    }, [])
 
  return ( 
    <div className="Visual">
        <div className="viewport">
          <div className="axial" ref={axial_ref} style={{height: "50vh", width: "39.5vw"}}></div>
          <div className="sagittal" ref={sagittal_ref}></div>
          <div className="coronal" ref={coronal_ref}></div>
          <div className="tools" ref={acq_ref}></div>
        </div>
    </div>
  )
}

export default Visual