import React from 'react'
import { useRef, useEffect } from 'react';
import { RenderingEngine, Enums, volumeLoader, setVolumesForViewports} from '@cornerstonejs/core';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

import './Visual.css';

function Visual({ selectedTask, niftiURL}) {
    const axialViewport_ref = useRef(null);
    const coronalViewport_ref = useRef(null);
    const sagittalViewport_ref = useRef(null);

    const { ViewportType } = Enums;

    useEffect(() => {
        volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
        console.log(volumeLoader.getVolumeLoaderSchemes())
        const volumeId = "nifti:" + niftiURL;
        console.log(volumeId);
        
        const AXIAL_VIEWPORT_ID = "AXIAL";
        const SAGITTAL_VIEWPORT_ID = "SAGITTAL";
        const CORONAL_VIEWPORT_ID = "CORONAL";
        const VIEWPORT_IDs = [AXIAL_VIEWPORT_ID, SAGITTAL_VIEWPORT_ID, CORONAL_VIEWPORT_ID];


        const renderingEngineId = "MyRenderingEngine";
        const RENDERING_ENGINE = new RenderingEngine(renderingEngineId);

        const ViewportInputArray = [
            {
                viewportId: AXIAL_VIEWPORT_ID,
                type: ViewportType.ORTHOGRAPHIC,
                element: axialViewport_ref.current,
                defaultOptions: {
                    orientation: Enums.OrientationAxis.AXIAL,
                }
            },
            {
                viewportId: CORONAL_VIEWPORT_ID,
                type: ViewportType.ORTHOGRAPHIC,
                element: coronalViewport_ref.current,
                defaultOptions: {
                    orientation: Enums.OrientationAxis.CORONAL,
                }
            },
            {
                viewportId: SAGITTAL_VIEWPORT_ID,
                type: ViewportType.ORTHOGRAPHIC,
                element: sagittalViewport_ref.current,
                defaultOptions: {
                    orientation: Enums.OrientationAxis.SAGITTAL,
                }
            }
        ]
        RENDERING_ENGINE.setViewports(ViewportInputArray);

        (async () => {
            const volume = await volumeLoader.createAndCacheVolume(volumeId);
            console.log('volume: ', volume);
            setVolumesForViewports(
                RENDERING_ENGINE,
                [{volumeId: volumeId}],
                VIEWPORT_IDs,
            );
    
            RENDERING_ENGINE.render();
        }) ();


        // const IVolInput = new IVolumeInput();
        // console.log(IVolInput);
        
        
    }, [ViewportType.ORTHOGRAPHIC, niftiURL])

    
    
    return (
        <div className="Visual">
            <div className="task"> {selectedTask} </div>
            <div className="axialViewport" ref={axialViewport_ref}>
                axial
            </div>
            <div className="coronalViewport" ref={coronalViewport_ref}>
                coronal
            </div>
            <div className="sagittalViewport" ref={sagittalViewport_ref}>
                sagittal
            </div>
            <div className="tools">
                Tools
            </div>
        </div>
    )
}

export default Visual