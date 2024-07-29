import React from 'react'
import { useState, useEffect } from 'react'
import Visual from '../components/Visual'
import { initializeCornerstone } from '../helpers/helpers'
import './Test.css';



function Test() {
    const [csInitializationState, setInitializationState] = useState(false);
    const [visualizationContent, setVisualizationContent] = useState(null);

    useEffect(() => {
        const initState = initializeCornerstone();
        setInitializationState(initState);
      }, [])

    initializeCornerstone();
    return (
        <div className="Test">
            <div className="test-container">
                <div className="vis-container">
                <Visual niftiURL={"https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz"}/>
                </div>
            </div>
            
        </div>
    )
}

export default Test