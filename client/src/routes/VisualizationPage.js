import React from 'react'
import { 
  useRef,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { Enums, RenderingEngine, init } from '@cornerstonejs/core';
import { initializeCornerstone } from '../cornerstonejs/helper/init';
import  * as fflate  from 'fflate';


import TaskMenu from '../components/TaskMenu';
import ReportScreen from '../components/ReportScreen';
import Visual from '../components/Visual';
import './VisualizationPage.css';

export default function Visualization() {
  const data = new TextEncoder().encode("Hello, fflate!");
  console.log(fflate);
  const compressedData = fflate.compressSync(data);
  const decompressedData = fflate.decompressSync(compressedData);
  const decompressedString = new TextDecoder().decode(decompressedData);
  console.log("Original Data:", new TextDecoder().decode(data));
  console.log("Compressed Data:", compressedData);
  console.log("Decompressed Data:", decompressedString);

  const [csInitializationState, setInitializationState] = useState(false);
  const [niftiFile, setNiftiFile] = useState();
  const [niftiMasks, setMasks] = useState();
  const [visualizationContent, setVisualizationContent] = useState(null);
  

  const location = useLocation();
  const navigate = useNavigate();

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);


  useEffect(() => {            //set niftiFile, niftiMasks, and initialize cornerstone libraries
    const {nifti, masks} = location.state;
    setNiftiFile(nifti);
    setMasks(masks); 
      (async () => {
        const init = await initializeCornerstone();
        setInitializationState(init);
      })();
    }, [location])

  useEffect(() => {           //If nifti files are set && cornerstone is initialized, load visualizations
    if (!csInitializationState || !niftiFile || !niftiMasks) {
      console.log('initialization not completed'); 
      return
    }
    console.log("initialization complete");
    const url = 'http://localhost:5000/api/download/ct.nii.gz';
    setVisualizationContent(<Visual selectedTask={"All (default)"} niftiURL={url}/>);
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
