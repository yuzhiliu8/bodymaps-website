import { NiftiImageVolume } from "@cornerstonejs/nifti-volume-loader";
import { modalityScaleNifti, makeVolumeMetadata } from "@cornerstonejs/nifti-volume-loader/dist/esm/helpers";
import { rasToLps } from "@cornerstonejs/nifti-volume-loader/dist/esm/helpers/convert";
import * as NiftiReader from 'nifti-reader-js';
import { cache } from "@cornerstonejs/core";

export async function createAndCacheVolumesFromArrayBuffers(volumeInfos){
    cache.purgeCache();
    const NiftiImageVolumes = []
    
    await Promise.all(volumeInfos.map(async (volumeInfo) => {
      let niftiBuffer = volumeInfo.buffer;
      const volumeId = volumeInfo.volumeId;
      const controller = new AbortController();

      let niftiHeader = null;
      let niftiImage = null;

      if (NiftiReader.isCompressed(niftiBuffer)) {
          niftiBuffer = NiftiReader.decompress(niftiBuffer);
        }
      
      if (NiftiReader.isNIFTI(niftiBuffer)) {
      niftiHeader = NiftiReader.readHeader(niftiBuffer);
      niftiImage = NiftiReader.readImage(niftiHeader, niftiBuffer);
      }

      const { scalarData, pixelRepresentation } = modalityScaleNifti(
          niftiHeader,
          niftiImage
        );
      
      const { orientation, origin, spacing } = rasToLps(niftiHeader);
      const { volumeMetadata, dimensions, direction } = makeVolumeMetadata(
      niftiHeader,
      orientation,
      scalarData,
      pixelRepresentation
      );
      const volume = new NiftiImageVolume({
        volumeId,
        metadata: volumeMetadata,
        dimensions,
        spacing,
        origin,
        direction,
        scalarData,
        sizeInBytes: scalarData.byteLength,
        imageIds: [],
        },
        {
          loadStatus: {
            loaded: false,
            loading: false,
            callbacks: [],
          },
          controller,
        });
      NiftiImageVolumes.push(volume);
      const volumePromise = objectToPromise(volume);

      try{
        await cache.putVolumeLoadObject(volumeId, {promise: volumePromise, cancel: {}});
        console.log(`${volumeId} added to CS cache`);
      } catch {
        console.error(`could not add ${volumeId} to cache`);
      }
    }));
  return NiftiImageVolumes
}

function objectToPromise(obj) {
  return new Promise((resolve) => {
    resolve(obj);
  });
}