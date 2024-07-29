import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeCornerstone } from '../helpers/helpers';

import Visual from '../components/Visual';
import ReportScreen from '../components/ReportScreen';
import TaskMenu from '../components/TaskMenu';
import './VisualizationPage.css';

function VisualizationPage() {
  const [csInitializationState, setInitializationState] = useState(false);
  const [visualizationContent, setVisualizationContent] = useState(null);
  const [niftiFile, setNiftiFile] = useState(null);
  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initState = initializeCornerstone();
    setInitializationState(initState);
  }, [])

  useEffect(() => {
    const niftiURL = 'https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz';
    // const niftiURL = 'http://localhost:5000/api/download/MRHead.nii.gz';
    if (csInitializationState) {
      setVisualizationContent(<Visual niftiURL={niftiURL} />)
    }
  }, [csInitializationState, niftiFile])

  const showTaskMenu = () => {
    if (TaskMenu_ref.current.style.display === "none"){
      TaskMenu_ref.current.style.display = "block";
    }
    else{
      TaskMenu_ref.current.style.display = "none";
    }
  }

  const showReportScreen = () => {
    if (ReportScreen_ref.current.style.display === "none"){
      ReportScreen_ref.current.style.display = "block";
      VisualizationContainer_ref.current.style.opacity = "30%";
    }
    else{
      ReportScreen_ref.current.style.display = "none";
      VisualizationContainer_ref.current.style.opacity = "100%";
    }

  }

  const handleChecked = (event) => {
    const selectedInputElement = event.target; //<input> element
    const selectedTaskMenuItemComponent = event.target.parentElement.parentElement; //TaskMenuItem component
    const TaskMenuItemArray = TaskMenu_ref.current.children;

    if (selectedInputElement.checked === true){
      for (let i = 0; i < TaskMenuItemArray.length; i++){
        const currentInputElement = TaskMenuItemArray[i].children[0].children[0];
        if (TaskMenuItemArray[i] !== selectedTaskMenuItemComponent && currentInputElement.checked === true){
          currentInputElement.checked = false;
        }
      }
    }
  }

  return (
    <div className="VisualizationPage">

      <div className="sidebar">
        <div className="tasks-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showTaskMenu}>Selected Task</div>
            <TaskMenu 
            innerRef={TaskMenu_ref}
            handleChecked={handleChecked}/>
          </div>
        </div>
        <div className="report-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showReportScreen}>Report</div>
          </div>
        </div>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
      
      <div className="visualization-container" ref={VisualizationContainer_ref}>
        {visualizationContent}
      </div>

      <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div>

    </div>
  )
}

export default VisualizationPage