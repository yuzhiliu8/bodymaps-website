import { init as initCore } from '@cornerstonejs/core';
import { init as initTools } from '@cornerstonejs/tools';


export async function initializeCornerstone(){
    const isCoreInitialized = await initCore();
    initTools();

    return [isCoreInitialized];
}