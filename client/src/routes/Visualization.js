import React from 'react'
import { useRef, useEffect } from 'react';
// import { Enums, RenderingEngine, init } from '@cornerstonejs/core';
import { useLocation, useNavigate } from 'react-router-dom';

import TaskMenu from '../components/TaskMenu';
import ReportScreen from '../components/ReportScreen';
import Demo_img_TL from '../assets/images/Demo_img_TL.png';
import Demo_img_TR from '../assets/images/Demo_img_TR.png';
import Demo_img_BL from '../assets/images/Demo_img_BL.png';
import Demo_img_BR from '../assets/images/Demo_img_BR.png';
import './Visualization.css';


export default function Visualization() {
  const state = useLocation();
  if (state){
    const {niftiMain, masks} = state;
  }
  const navigate = useNavigate();

  const TaskMenu_ref = useRef(null);
  const ReportScreen_ref = useRef(null);
  const VisualizationContainer_ref = useRef(null);

  

  
  // const { ViewportType } = Enums;
  

  // const RenderVolume = async () => {
  //   const {file} = location.state;
  //   setFile(file);
  //   console.log(nii_file);
  //   if (file !== ' '){
  //     console.log("FILE: ", file instanceof File);
  //     const link = URL.createObjectURL(file);
  //     console.log(link);
  //   }
    
  //     const initResult = await init();
  //     if (initResult) console.log("init!");
  //     if(content.current.children.length === 0){
  //       console.log("rendering...");
  //       console.log(content);
  //       const viewPortGrid = document.createElement('div');
  //       viewPortGrid.style.display = "flex";
  //       viewPortGrid.style.flexDirection = "row";

  //       //axial
  //       const axial = document.createElement('div');
  //       axial.style.height = "500px";
  //       axial.style.width = "500px";
  //       // axial.style.backgroundColor = "grey";
  //       axial.innerHTML = "axial";

  //       //sagittal
  //       // const sagittal = document.createElement('div');
  //       // sagittal.style.height = "500px";
  //       // sagittal.style.width = "500px";
  //       // sagittal.innerHTML = "sagittal";

  //       viewPortGrid.appendChild(axial);
  //       // viewPortGrid.appendChild(sagittal);

  //       content.current.appendChild(viewPortGrid);

  //       // const imageIds = await createImageIdsAndCacheMetaData({
  //       //   StudyInstanceUID:
  //       //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  //       //   SeriesInstanceUID:
  //       //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  //       //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  //       // });

  //       const renderingEngineId = 'myRenderingEngine';
  //       const renderingEngine = new RenderingEngine(renderingEngineId);

  //       const viewportId = 'CT_AXIAL_STACK';

  //       const viewPortInput = {
  //         viewportId: viewportId,
  //         element: axial,
  //         type: ViewportType.STACK,
  //       };
  //       // const imageIds = ["client/src/routes/x002.DCM", "client/src/routes/x009.DCM"];
  //       // renderingEngine.enableElement(viewPortInput);
  //       // const viewport = renderingEngine.getViewport(viewPortInput.viewportId);
  //       // viewport.setStack(imageIds, 1);
  //       // viewport.render();

  //       // const volumeId = 'cornerstoneStreamingImageVolume: myVolume';
  //       // console.log("before vol");
  //       // const volume = await volumeLoader.createAndCacheVolume(volumeId, {imageIds});
  //       // console.log("VOLUME: ", volume); 
  
  //     }
    
  // }
    

 
  // // useEffect(() => {
  // //   const {file} = location.state;
  // //   setFile(file)
  // //   console.log(nii_file);
  // //   // const link = URL.createObjectURL(nii_file);
  // //   // console.log(link);
  // //   RenderVolume()
  // // }, []);

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
          <img src={Demo_img_TL} alt="top left"/>
        </div>
        <div className="visual2">
          <img src={Demo_img_TR} alt="top right" />
        </div>
        <div className="visual3">
          <img src={Demo_img_BL} alt="bottom left"/>
        </div>
        <div className="visual4">
          <img src={Demo_img_BR} alt="bottom right"/>
        </div>
      </div>

        
      
      
      <div className="report" ref={ReportScreen_ref} style={{display: "none"}}>
        <ReportScreen />
      </div>

    </div>
  )
}
