import React from 'react'
import { 
  useRef,
  useEffect,
  useState,
} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

// import { Enums, RenderingEngine, init } from '@cornerstonejs/core';
import { initializeCornerstone } from '../cornerstonejs/helper/init';

import TaskMenu from '../components/TaskMenu';
import ReportScreen from '../components/ReportScreen';
import './Visualization.css';

export default function Visualization() {

  const [csInitializationState, setInitializationState] = useState(false);
  const [niftiFile, setNiftiFile] = useState();
  const [niftiMasks, setMasks] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);

  useEffect(() => {
    console.log("init after  location");
    const {nifti, masks} = location.state;
    setNiftiFile(nifti);
    setMasks(masks); 
      (async () => {
        const init = await initializeCornerstone();
        setInitializationState(init);
      })();
    }, [location])

  useEffect(() => {
    if (!csInitializationState || !niftiFile || !niftiMasks) {
      console.log('initialization not completed'); 
    } else {
      console.log("everything initialized");
    }
  }, [niftiFile, niftiMasks, csInitializationState])

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
    <div className="Visualization">

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
        <div className="visual1">
          Top Left
        </div>
        <div className="visual2">
          Top Right
        </div>
        <div className="visual3">
          Bottom Left
        </div>
        <div className="visual4">
          Bottom Right
        </div>
      </div>

        
      
      
      <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div>

    </div>
  )
}
