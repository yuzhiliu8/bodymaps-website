import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { debug, setVisibilities, renderVisualization } from '../helpers/helpers';
import ReportScreen from '../components/ReportScreen/ReportScreen';
import NestedCheckBox from '../components/NestedCheckBox/NestedCheckBox';
import NiftiVolume3D from '../components/NiftiVolume3D/NiftiVolume3D';
import { create3DVolume, updateOpacities } from '../helpers/Volume3D';
import { trueCheckState, case1 } from '../helpers/constants';
import './VisualizationPage.css';




function VisualizationPage() {
  const [checkState, setCheckState] = useState(trueCheckState);
  const [segmentationRepresentationUIDs, setSegmentationRepresentationUIDs] = useState(null);
  const [NV, setNV] = useState();
  const axial_ref = useRef(null);
  const sagittal_ref = useRef(null);
  const coronal_ref = useRef(null);
  const render_ref = useRef(null);

  
  
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
    if (axial_ref, sagittal_ref, coronal_ref, render_ref){
      const niftiURL = URL.createObjectURL(state.file);
      const maskFiles = Array.from(state.masks);
      const maskData = [];
          maskFiles.forEach((file) => {
            maskData.push({
              id: file.name,
              url: URL.createObjectURL(file),
            });
          });
      renderVisualization(axial_ref, sagittal_ref, coronal_ref, niftiURL, maskData)
      .then((UIDs) => setSegmentationRepresentationUIDs(UIDs));
      const nv = create3DVolume(render_ref, maskFiles);
      setNV(nv);
    }
  }, [axial_ref, sagittal_ref, coronal_ref, render_ref]);


  useEffect(() => {
    if (segmentationRepresentationUIDs && checkState && NV){
      setVisibilities(segmentationRepresentationUIDs, checkState);
      updateOpacities(NV, checkState);
    }
  }, [segmentationRepresentationUIDs, checkState, NV])

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
    setCheckState(newCheckState);
}


 


  return (
    <div className="VisualizationPage">
      <div className="sidebar">
        <div className="tasks-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showTaskMenu}>Selected Task</div>
            <NestedCheckBox innerRef={TaskMenu_ref} checkState={checkState} update={update} />
          </div>
        </div>
        <div className="report-container">
          <div className="dropdown">
            <div className="dropdown-header" onClick={showReportScreen}>Report</div>
          </div>
        </div>
        <button onClick={() => navigate("/")}>Back</button>
        <div><br/></div> 
        <button onClick={() => {
          console.log(NV.volumes[0]);
          // NV.setOpacity(0, 0);
          NV.setOpacity(1, false);
          NV.setOpacity(2, false);
          NV.setOpacity(3, false);
          NV.setOpacity(4, 0);
          NV.setOpacity(5, 0);
          NV.setOpacity(6, 0);
          NV.setOpacity(7, 0);
          NV.setOpacity(8, 0); 
        }}>Debug</button>
      </div>
      
      <div className="visualization-container" ref={VisualizationContainer_ref} >
        <div className="axial" ref={axial_ref}></div>
        <div className="sagittal" ref={sagittal_ref}></div>
        <div className="coronal" ref={coronal_ref}></div>
        <div className="render">
          <div className="canvas">
            <canvas ref={render_ref}></canvas>
          </div>
        </div>
      </div>

      <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div>

    </div>
  )
}

export default VisualizationPage