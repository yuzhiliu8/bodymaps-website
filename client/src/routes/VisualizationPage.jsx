import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { debug } from '../helpers/helpers';

import Visual from '../components/Visual';
import ReportScreen from '../components/ReportScreen';
import TaskMenu from '../components/TaskMenu';
import './VisualizationPage.css';

function VisualizationPage() {
  const [visualizationContent, setVisualizationContent] = useState(null);
  const [serverPath, setServerPath] = useState('');
  const [filename, setFilename] = useState();

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const state = location.state
      if (!state){
        navigate('/')
      }
      const path = state.path
      console.log("PATH: ", path)
      setServerPath(path)
      setFilename(state.filename)
    }) ();
  }, [])

  useEffect(() => {    
    if (serverPath) {
      const niftiURL = `/api/download/${serverPath}`;
      setVisualizationContent(<Visual niftiURL={niftiURL} filename={filename}/>)
    }
  }, [serverPath])

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
      VisualizationContainer_ref.current.style.opacity = "25%";
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

    if (selectedTaskMenuItemComponent === TaskMenuItemArray[0] && selectedInputElement.checked === true){
      for (let i = 0; i < TaskMenuItemArray.length; i++){
        let currentElement = TaskMenuItemArray[i].children[0].children[0];
        currentElement.checked = true;
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
        <div><br/></div>
        <button onClick={debug}>Check Volume</button>
      </div>
      
      <div className="visualization-container" ref={VisualizationContainer_ref} >
        {visualizationContent}
      </div>

      {/* <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div> */}

    </div>
  )
}

export default VisualizationPage