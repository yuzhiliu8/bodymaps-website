import React from 'react'
import { useRef, useState } from 'react';
import { Enums, RenderingEngine, init } from '@cornerstonejs/core'

import { useLocation, useNavigate } from 'react-router-dom'

import './Visualization.css'


export default function Visualization() {
  
  const location = useLocation();
  const [nii_file, setFile] = useState();
  const content = useRef();
  const navigate = useNavigate();
  const { ViewportType } = Enums;
  

  const RenderVolume = async () => {
    const {file} = location.state;
    setFile(file);
    console.log(nii_file);
    if (file !== ' '){
      console.log("FILE: ", file instanceof File);
      const link = URL.createObjectURL(file);
      console.log(link);
    }
    
      const initResult = await init();
      if (initResult) console.log("init!");
      if(content.current.children.length === 0){
        console.log("rendering...");
        console.log(content);
        const viewPortGrid = document.createElement('div');
        viewPortGrid.style.display = "flex";
        viewPortGrid.style.flexDirection = "row";

        //axial
        const axial = document.createElement('div');
        axial.style.height = "500px";
        axial.style.width = "500px";
        // axial.style.backgroundColor = "grey";
        axial.innerHTML = "axial";

        //sagittal
        // const sagittal = document.createElement('div');
        // sagittal.style.height = "500px";
        // sagittal.style.width = "500px";
        // sagittal.innerHTML = "sagittal";

        viewPortGrid.appendChild(axial);
        // viewPortGrid.appendChild(sagittal);

        content.current.appendChild(viewPortGrid);

        // const imageIds = await createImageIdsAndCacheMetaData({
        //   StudyInstanceUID:
        //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
        //   SeriesInstanceUID:
        //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
        //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
        // });

        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);

        const viewportId = 'CT_AXIAL_STACK';

        const viewPortInput = {
          viewportId: viewportId,
          element: axial,
          type: ViewportType.STACK,
        };
        const imageIds = ["client/src/routes/x002.DCM", "client/src/routes/x009.DCM"];
        renderingEngine.enableElement(viewPortInput);
        const viewport = renderingEngine.getViewport(viewPortInput.viewportId);
        viewport.setStack(imageIds, 1);
        viewport.render();

        // const volumeId = 'cornerstoneStreamingImageVolume: myVolume';
        // console.log("before vol");
        // const volume = await volumeLoader.createAndCacheVolume(volumeId, {imageIds});
        // console.log("VOLUME: ", volume); 
  
      }
    
  }
    


  // useEffect(() => {
  //   const {file} = location.state;
  //   setFile(file)
  //   console.log(nii_file);
  //   // const link = URL.createObjectURL(nii_file);
  //   // console.log(link);
  //   RenderVolume()
  // }, []);


  
  
  return (
    
    <div className="Visualization">
    <p>Visualization</p>

    <div className="content" ref={content}>

    </div>

    <button onClick={() => {
      navigate("/");
    }}> Back </button>
    
    <button onClick={RenderVolume}> Render </button>
    </div>

  )
}
