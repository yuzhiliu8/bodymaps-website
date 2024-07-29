import React from 'react'
import { useEffect, useState } from 'react'
import { initializeCornerstone } from '../helpers/helpers';

import Visual from '../components/visual'

function Visualization() {
  const [csInitializationState, setInitializationState] = useState(false);
  const [visualizationContent, setVisualizationContent] = useState(null);

  useEffect(() => {
    const initState = initializeCornerstone();
    setInitializationState(initState);
  }, [])

  useEffect(() => {
    const niftiURL = 'https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz';
    // const niftiURL = 'http://localhost:5000/api/download/MRHead.nii.gz';
    if(csInitializationState){
      setVisualizationContent(<Visual niftiURL={niftiURL}/>)
    }
  }, [csInitializationState])

  return (
    <div className="Visualization">
        {visualizationContent}
    </div>
  )
}

export default Visualization