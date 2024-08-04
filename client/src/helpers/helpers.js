import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
    getRenderingEngine,
    geometryLoader
  } from '@cornerstonejs/core';
import {
  init as csTools3dInit,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  addTool,
  Enums as csToolsEnums, 
  SegmentationDisplayTool,
  segmentation
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';



export async function renderVisualization(ref1, ref2, ref3, niftiURL){
  csTools3dInit();
  await csInit();

  const segmentationId = "mySegmentation";
  const toolGroupId = "myToolGroup";
  const renderingEngineId = "myRenderingEngine";

  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();

  addTool(StackScrollMouseWheelTool);
  addTool(SegmentationDisplayTool);

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
  
  const volumeId = 'nifti:' + niftiURL;
  const volume = await volumeLoader.createAndCacheVolume(volumeId);

  const segmentationData = await fetch('/api/segmentations').then((resp) => resp.json());

  const geometryIds = []
  const promises = segmentationData.contourSets.axial.map((contourSet) => {
    const geometryId = contourSet.id;
    geometryIds.push(geometryId);
    return geometryLoader.createAndCacheGeometry(geometryId, {
      type: Enums.GeometryType.CONTOUR,
      geometryData: contourSet,
    });
  });

  await Promise.all(promises);

  segmentation.addSegmentations([
    {
      segmentationId,
      representation: {
        type: csToolsEnums.SegmentationRepresentations.Contour,
        data:{
          geometryIds: geometryIds,
        },
      },
    },
  ]);

  const renderingEngine = new RenderingEngine(renderingEngineId);

  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  const viewportIds = [viewportId1, viewportId2, viewportId3];

  const viewportInputArray = [
      {
        viewportId: viewportId1, 
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: ref1.current,
        defaultOptions: {
          orientation: Enums.OrientationAxis.AXIAL,
        },
      },
      {
        viewportId: viewportId2,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: ref2.current,
        defaultOptions: {
          orientation: Enums.OrientationAxis.SAGITTAL,
        },
      },
      {
        viewportId: viewportId3,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: ref3.current, 
        defaultOptions: {
          orientation: Enums.OrientationAxis.CORONAL,
        },
      },
    ];

  renderingEngine.setViewports(viewportInputArray);

  toolGroup.addViewport(viewportId1, renderingEngineId)
  toolGroup.addViewport(viewportId2, renderingEngineId)
  toolGroup.addViewport(viewportId3, renderingEngineId)


  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      viewportIds
  );

  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId,
      type: csToolsEnums.SegmentationRepresentations.Contour,
    },
  ]);

  renderingEngine.render();
}




export const debug = async () => {
  const axial_viewport = getEnabledElements()[0].viewport;
  const axial_camera = axial_viewport.getCamera();
  const axial_imageData = axial_viewport.getImageData();
  // console.log(getEnabledElements())
  
  const sagittal_viewport = getEnabledElements()[1].viewport;
  const sagittal_camera = sagittal_viewport.getCamera();
  const sagittal_imageData = sagittal_viewport.getImageData();

  const coronal_viewport = getEnabledElements()[2].viewport;
  const coronal_camera = coronal_viewport.getCamera();
  const coronal_imageData = coronal_viewport.getImageData();

  // axial_camera.focalPoint[2] = -144.3599964477612;
  // console.log("AXIAL: ", axial_camera);
  console.log(segmentation.state.getSegmentations());
  console.log(segmentation.state.getAllSegmentationRepresentations());
  

  // console.log("SAGITTAL: ", sagittal_camera);
  // console.log("CORONAL: ", coronal_camera);
  // console.log("AXIAL: ", axial_imageData);
  // console.log("SAGITTAL: ", sagittal_imageData);
  // console.log("CORONAL: ", coronal_imageData);
}

