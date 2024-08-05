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
  CONSTANTS,
  SegmentationDisplayTool,
  segmentation,
  TrackballRotateTool
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
import { defaultColors } from './colors';

const segmentationId = "mySegmentation";
const toolGroupId = "myToolGroup";
const toolGroup3DId = "3DToolGroup";
const renderingEngineId = "myRenderingEngine";
const labelMapIds = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach']

const DEFAULT_SEGMENTATION_CONFIG = {
  fillAlpha: 0.5,
  fillAlphaInactive: 0.5,
  outlineOpacity: 1,
  outlineOpacityInactive: 1,
  outlineWidth: 0,
  outlineWidthInactive: 1,
};

const toolGroupSpecificRepresentationConfig = {
  renderInactiveSegmentations: true,
  representations: {
    [csToolsEnums.SegmentationRepresentations.Labelmap]: DEFAULT_SEGMENTATION_CONFIG
  },
};




export async function renderVisualization(ref1, ref2, ref3, ref4, niftiURL){
  csTools3dInit();
  await csInit();

  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();
  ref4.current.oncontextmenu = (e) => e.preventDefault();

  addTool(StackScrollMouseWheelTool);
  addTool(SegmentationDisplayTool);
  addTool(TrackballRotateTool);

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  const toolGroup3D = ToolGroupManager.createToolGroup(toolGroup3DId);

  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup3D.addTool(TrackballRotateTool.toolName);
  toolGroup3D.addTool(StackScrollMouseWheelTool.toolName);

  toolGroup3D.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: csToolsEnums.MouseBindings.Primary,
      },
    ],
  });
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);


  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  const volumeId = 'nifti:' + niftiURL;

  await createAndRenderVolume(volumeId, renderingEngine, toolGroup, toolGroup3D, ref1, ref2, ref3, ref4); //async
  // createAndRenderSegmentations();                                            //async
  loadLabelMaps();
  
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

async function createAndRenderVolume(volumeId, renderingEngine, toolGroup, toolGroup3D, ref1, ref2, ref3, ref4){
  const volume = await volumeLoader.createAndCacheVolume(volumeId);
  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  const viewportId4 = 'CT_NIFTI_3DVOLUME'
  const viewportIds = [viewportId1, viewportId2, viewportId3, viewportId4];

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
      {
        viewportId: viewportId4,
        type: Enums.ViewportType.VOLUME_3D,
        element: ref4.current,
        defaultOptions: {
          orientation: Enums.OrientationAxis.SAGITTAL,
          background: [0.2, 0, 0.2]
        }
      },
    ];

  renderingEngine.setViewports(viewportInputArray);

  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
  toolGroup3D.addViewport(viewportId4, renderingEngineId);

  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      viewportIds
  );

  renderingEngine.render();
  console.log("volume rendered");
}

async function createAndRenderSegmentations() {
  const segmentationData = await fetch('/api/segmentations').then((resp) => resp.json());

  const geometryIds = []
  const promises = segmentationData.axial.map((contourSet) => {
    const geometryId = contourSet.id;
    geometryIds.push(geometryId);
    return geometryLoader.createAndCacheGeometry(geometryId, {
      type: Enums.GeometryType.CONTOUR,
      geometryData: contourSet,
    });
  });

  await Promise.all(promises);

  console.log(geometryIds);
  let segmentIndex = 1;
  const segmentationRepresentationUIDs = [] //promises
  geometryIds.forEach((geometryId) => {
    segmentation.addSegmentations([
      {
        segmentationId: geometryId,
        representation: {
          type: csToolsEnums.SegmentationRepresentations.Contour,
          data: {
            geometryIds: [geometryId],
          },
        },
      },
    ]);
    segmentation.segmentIndex.setActiveSegmentIndex(geometryId, segmentIndex);
    const segmentationRepresentationUID = 
    segmentation.addSegmentationRepresentations(toolGroupId, [   //Fix so addSegmentationRepresentations is ran once
      {
        segmentationId: geometryId,
        type: csToolsEnums.SegmentationRepresentations.Contour,
      },
    ]);
    segmentationRepresentationUIDs.push(segmentationRepresentationUID);
    segmentIndex++;
  });
  
  await Promise.all(segmentationRepresentationUIDs);
  // console.log(segmentationRepresentationUIDs)

  
  console.log("Segmentations rendered");
}

async function loadLabelMaps(){
  const segmentationInputArray = []
  const segRepInputArray = []
  const segmentationVols = []
  let i = 0;
  labelMapIds.forEach((id) => {
    const url = `/api/download/nifti||masks||${id}.nii.gz`
    const volId = "nifti:" + url;
    const vol = volumeLoader.createAndCacheVolume(volId);
    segmentationVols.push(vol);
    segmentationInputArray.push(
      {
        segmentationId: id,
        representation: {
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
          data:{
            volumeId: volId,
          },
        },
      },
    );
    segRepInputArray.push({
      segmentationId: id,
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      options: {
        colorLUTOrIndex: [
          defaultColors[i],
          defaultColors[i],
        ],
      },
    });
    i++;
  });
  await Promise.all(segmentationVols)

  segmentation.addSegmentations(segmentationInputArray);
  let segmentIndex = 1;
  segmentationInputArray.forEach((seg) => {
    segmentation.segmentIndex.setActiveSegmentIndex(seg.segmentationId, segmentIndex);
    segmentIndex++;
  })
  const segRepUIDs = 
  await segmentation.addSegmentationRepresentations(toolGroupId, segRepInputArray, toolGroupSpecificRepresentationConfig)

  
  
  console.log("labelmaps");
}

