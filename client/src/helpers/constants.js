const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

const RED = [230, 25, 75, 255];
const BLUE = [0, 130, 200, 255];
const MAROON = [128, 0, 0, 255];
const BROWN = [170, 110, 40, 255];
const OLIVE = [128, 128, 0, 255];
//const OLIVE = [0, 0, 0, 0];
const TEAL = [0, 128, 128, 255];
const PURPLE = [145, 30, 180, 255];
const MAGENTA = [240, 50, 230, 255];
const LIME = [50, 205, 50, 255];

const cornerstoneCustomColorLUT = {
    0: [0, 0, 0, 0],       // transparent for background
    1: RED,
    2: BLUE,   
    3: MAROON,   
    4: BROWN,
    5: OLIVE,
    6: TEAL,
    7: PURPLE,
    8: MAGENTA,
    9: LIME,
    // Add more mappings as needed
  };
const NVCmapAlpha = 128;

function createNVColorMapFromCornerstoneLUT(){
    const R = [];
    const G = [];
    const B = [];
    const A = [];
    const I = [];
    Object.keys(cornerstoneCustomColorLUT).forEach((intensity) => {
        I.push(Number(intensity));
        const RGBA = cornerstoneCustomColorLUT[intensity];
        R.push(RGBA[0]);
        G.push(RGBA[1]);
        B.push(RGBA[2]);
        if (intensity === '0') {
            A.push(0);
        } else {
            A.push(NVCmapAlpha);
        }
    });

    const cmap = {
        R: R,
        G: G,
        B: B,
        A: A,
        I: I
    }
    return cmap;
}

export const APP_CONSTANTS = {};

APP_CONSTANTS.DEFAULT_SEGMENTATION_OPACITY = 0.60;
APP_CONSTANTS.API_ORIGIN = API_ORIGIN;
APP_CONSTANTS.cornerstoneCustomColorLUT = cornerstoneCustomColorLUT;
APP_CONSTANTS.NVCmapAlpha = NVCmapAlpha;
APP_CONSTANTS.NVColormap = createNVColorMapFromCornerstoneLUT();

/* EXAMPLE CMAP

const NVColormap = {
        R: [0, 230, 0, 128, 170, 128, 0, 145, 240, 50],
        G: [0, 25, 130, 0, 110, 128, 128, 30, 50, 205],
        B: [0, 75, 200, 0, 40, 0, 128, 180, 230, 50],
        A: [0, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        I: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
} */
export const accepted_exts = ['.nii.gz', '.nii']

