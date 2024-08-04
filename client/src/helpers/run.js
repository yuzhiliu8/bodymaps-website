import {
    RenderingEngine,
    Enums,
    setVolumesForViewports,
    volumeLoader,
    geometryLoader,
    init
  } from '@cornerstonejs/core';
  import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
  
  import * as cornerstoneTools from '@cornerstonejs/tools';
  
  const {
    SegmentationDisplayTool,
    ToolGroupManager,
    Enums: csToolsEnums,
    segmentation,
    StackScrollMouseWheelTool,
  } = cornerstoneTools;
  const { ViewportType, GeometryType } = Enums;
  const segmentationId = 'mySegmentation';
  const toolGroupId = 'myToolGroup';

export async function run(axial_ref, sag_ref, cor_ref) {
    const element1 = axial_ref.current;
    const element2 = sag_ref.current;
    const element3 = cor_ref.current;

    await init()
    await cornerstoneTools.init();
  
    // Add tools to Cornerstone3D
    cornerstoneTools.addTool(SegmentationDisplayTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
  
    // Define tool groups to add the segmentation display tool to
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  
    toolGroup.addTool(SegmentationDisplayTool.toolName);
    toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  
    toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  
  
    volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
  
    // Define a volume in memory
    const niftiURL = "http://localhost:5000/api/download/nifti||file||ct.nii.gz";
    const volumeId = 'nifti:' + niftiURL;
  
    const volume = await volumeLoader.createAndCacheVolume(volumeId);
  
    
    // Add some segmentations based on the source data volume
    const contour = await fetch('http://localhost:5000/api/segmentations').then((res) =>
      res.json()
    );
  
    const geometryIds = [];
    const promises = contour.contourSets.axial.map((contourSet) => {
      const geometryId = contourSet.id;
      geometryIds.push(geometryId);
      return geometryLoader.createAndCacheGeometry(geometryId, {
        type: GeometryType.CONTOUR,
        geometryData: contourSet,
      });
    });
  
    await Promise.all(promises);
  
    // Add the segmentations to state
    segmentation.addSegmentations([
      {
        segmentationId,
        representation: {
          // The type of segmentation
          type: csToolsEnums.SegmentationRepresentations.Contour,
          // The actual segmentation data, in the case of contour geometry
          // this is a reference to the geometry data
          data: {
            geometryIds: geometryIds
          },
        },
      },
    ]);
    // Instantiate a rendering engine
    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);
  
    // Create the viewports
    const viewportId1 = 'CT_AXIAL';
    const viewportId2 = 'CT_SAGITTAL';
    const viewportId3 = 'CT_CORONAL';
    
  
    const viewportInputArray = [
      {
        viewportId: viewportId1,
        type: ViewportType.ORTHOGRAPHIC,
        element: element1,
        defaultOptions: {
          orientation: Enums.OrientationAxis.AXIAL,
        },
      },
      {
        viewportId: viewportId2,
        type: ViewportType.ORTHOGRAPHIC,
        element: element2,
        defaultOptions: {
          orientation: Enums.OrientationAxis.SAGITTAL,
        },
      },
      {
        viewportId: viewportId3,
        type: ViewportType.ORTHOGRAPHIC,
        element: element3,
        defaultOptions: {
          orientation: Enums.OrientationAxis.CORONAL,
        },
      }
    ];
  
    renderingEngine.setViewports(viewportInputArray);
  
    toolGroup.addViewport(viewportId1, renderingEngineId);
    toolGroup.addViewport(viewportId2, renderingEngineId);
    toolGroup.addViewport(viewportId3, renderingEngineId);
  
    // Set the volume to load
    // volume.load();
  
    // Set volumes on the viewports
    setVolumesForViewports(renderingEngine, [{ volumeId:volumeId }], [viewportId1, viewportId2, viewportId3]);
  
    // // Add the segmentation representation to the toolgroup
    await segmentation.addSegmentationRepresentations(toolGroupId, [
      {
        segmentationId,
        type: csToolsEnums.SegmentationRepresentations.Contour,
      },
    ]);

    // renderingEngine.getViewports().forEach((v) => {
    //     console.log(v);
    //     v.canvas.style.position = "relative";
    //   });
  
    // Render the image
    renderingEngine.render();
  
    // document.getElementById('button').addEventListener("click", debug);
    
  }