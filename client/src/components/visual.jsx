import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { 
  render,
  debug, 
  createRenderingEngineAndRegisterVolumeLoader,
  createToolGroupAndAddTools
} from '../helpers/helpers';
import './Visual.css';

function Visual({ niftiURL, filename }) {
  const axial_ref = useRef(null);
  const sagittal_ref = useRef(null);
  const coronal_ref = useRef(null);
  
  useEffect(() => {              //TODO: Need to not make a new renderingEngine on every render. 
    (async () => {
      if (axial_ref && sagittal_ref && coronal_ref){
        console.log("setup");  
        const renderingEngineId = createRenderingEngineAndRegisterVolumeLoader();
        const toolGroupId = createToolGroupAndAddTools()
        await render(axial_ref, sagittal_ref, coronal_ref, niftiURL, renderingEngineId, toolGroupId);
      }  
    }) ();
    }, [])
 
  return ( 
    <div className="Visual">
        <div className="viewport">
          <div className="axial" ref={axial_ref} style={{height: "50vh", width: "39.5vw"}}></div>
          <div className="sagittal" ref={sagittal_ref}></div>
          <div className="coronal" ref={coronal_ref}></div>
          <div className="tools"></div>
        </div>
    </div>
  )
}

export default Visual