import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { debug, setVisibilities } from '../helpers/helpers';
import Visual from '../components/Visual/Visual';
import ReportScreen from '../components/ReportScreen/ReportScreen';
import NestedCheckBox from '../components/NestedCheckBox/NestedCheckBox';

import './VisualizationPage.css';

const trueCheckState = [true, true, true, true, true, true, true, true, true, true];
const case1 = '[false,true,true,true,true,true,true,true,true,true]';

function VisualizationPage() {
  const [visualizationContent, setVisualizationContent] = useState(null);
  const [taskMenuContent, setTaskMenuContent] = useState(null);
  const [checkState, setCheckState] = useState(trueCheckState);
  const [segmentationRepresentationUIDs, setSegmentationRepresentationUIDs] = useState(null);

  if (segmentationRepresentationUIDs && checkState){
    setVisibilities(segmentationRepresentationUIDs, checkState);
  }
  
  // const [serverPath, setServerPath] = useState('');

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (!state){
      navigate('/');
      return;
    }
    const niftiURL = URL.createObjectURL(state.file);
    const maskData = []
    Array.from(state.masks).forEach((file) => {
      maskData.push({
        id: file.name,
        url: URL.createObjectURL(file),
      });
    });
    setVisualizationContent(<Visual niftiURL={niftiURL} maskData={maskData} setSegRepUIDs = {setSegmentationRepresentationUIDs}/>);
    
  }, [])

  useEffect(() => {
    if (segmentationRepresentationUIDs){
      setTaskMenuContent(<NestedCheckBox innerRef={TaskMenu_ref} checkState={checkState} update={update} />);
    }
  },[segmentationRepresentationUIDs, checkState])

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

  const update = (id, checked) => {
    let newCheckState = [...checkState];
    newCheckState[id] = checked;
    if (JSON.stringify(newCheckState) === case1) newCheckState = trueCheckState;
    if (id !== 0 && checked === false && newCheckState[0] === true) newCheckState[0] = false;
    newCheckState = (id === 0) ? Array(10).fill(checked) : newCheckState;
    // console.log(newCheckState);
    setCheckState(newCheckState);
}


 


  return (
    <div className="VisualizationPage">

      <div className="sidebar">
        <div className="tasks-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showTaskMenu}>Selected Task</div>
            {taskMenuContent}
          </div>
        </div>
        <div className="report-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showReportScreen}>Report</div>
          </div>
        </div>
        <button onClick={() => navigate("/")}>Back</button>
        <div><br/></div> 
        <button onClick={() => debug}>Debug</button>
      </div>
      
      <div className="visualization-container" ref={VisualizationContainer_ref} >
        {visualizationContent}
      </div>

      <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div>

    </div>
  )
}

export default VisualizationPage