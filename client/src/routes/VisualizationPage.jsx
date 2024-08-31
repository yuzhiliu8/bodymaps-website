import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { setVisibilities, renderVisualization } from '../helpers/helpers';
import ReportScreen from '../components/ReportScreen/ReportScreen';
import NestedCheckBox from '../components/NestedCheckBox/NestedCheckBox';
import { create3DVolume, updateOpacities } from '../helpers/Volume3D';
import { trueCheckState, case1, API_ORIGIN } from '../helpers/constants';
import './VisualizationPage.css';




function VisualizationPage() {
  const [checkState, setCheckState] = useState(trueCheckState);
  const [segmentationRepresentationUIDs, setSegmentationRepresentationUIDs] = useState(null);
  const [NV, setNV] = useState(null);
  const [sessionKey, setSessionKey] = useState(undefined);
  const axial_ref = useRef();
  const sagittal_ref = useRef();
  const coronal_ref = useRef();
  const render_ref = useRef();

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log('beforeunload');
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    const fetchNiftiFilesForCornerstoneAndNV = async () => {
      const state = location.state; 
      console.log(location);
      if (!state){
        window.alert('No Nifti Files Uploaded!');
        navigate('/');
        return;
      }
      const sessionKey = state.sessionKey;
      const fileInfo = state.fileInfo;
      setSessionKey(sessionKey);
      console.log(fileInfo);
      const masks = fileInfo.masks;
      console.log(masks);
      console.log(sessionKey);

      const formData = new FormData();
      formData.append('sessionKey', sessionKey);
      formData.append('isSegmentation', true);
 
      const segmentationBuffers = await Promise.all(masks.map(async (mask) => {
        const response = await fetch(`${API_ORIGIN}/api/download/${mask}`, {
          method: 'POST',
          body: formData,
        });
        const buffer = await response.arrayBuffer();
        return {
          volumeId: mask,
          buffer: buffer
        }
      }));

      const mainNifti = fileInfo.MAIN_NIFTI;
      const mainNiftiURL = URL.createObjectURL(mainNifti);
      console.log(mainNiftiURL);


      console.log(segmentationBuffers);

      renderVisualization(axial_ref, sagittal_ref, coronal_ref, segmentationBuffers, mainNiftiURL)
      .then((UIDs) => setSegmentationRepresentationUIDs(UIDs));
      const nv = await create3DVolume(render_ref, segmentationBuffers);
      setNV(nv);
    }

    fetchNiftiFilesForCornerstoneAndNV();
  }, []);


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

const navBack = () => {
  const formData = new FormData()
  formData.append('sessionKey', sessionKey)
  fetch(`${API_ORIGIN}/api/terminate-session`, {
    method: 'POST', 
    body: formData,
  }).then((response) => response.json())
  .then((data) => console.log(data.message))
  navigate('/');
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
        <button onClick={navBack}>Back</button>
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
        <ReportScreen sessionKey={sessionKey}/>
      </div>

    </div>
  )
}

export default VisualizationPage