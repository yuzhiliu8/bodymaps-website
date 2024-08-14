const RED = [230, 25, 75, 255];
const BLUE = [0, 130, 200, 255];
const MAROON = [128, 0, 0, 255];
const BROWN = [170, 110, 40, 255];
const OLIVE = [128, 128, 0, 255];
const TEAL = [0, 128, 128, 255];
const PURPLE = [145, 30, 180, 255];
const MAGENTA = [240, 50, 230, 255];
const LIME = [50, 205, 50, 255];
export const defaultColors = [RED, BLUE, MAROON, BROWN, OLIVE, TEAL, PURPLE, MAGENTA, LIME];
export const NVcolorMaps = [
    {
        name: 'RED',
        cmap: {
            R: [0, 230],
            G: [0, 25],
            B: [0, 225],
            A: [0, 255],
        }
    },
    {
        name: 'BLUE',
        cmap: {
            R: [0, 0],
            G: [0, 130],
            B: [0, 200],
            A: [0, 255],
        }
    },
    {
        name: 'MAROON',
        cmap: {
            R: [0, 128],
            G: [0, ],
            B: [0, ],
            A: [0, 255],
        }
    },
    {
        name: 'BROWN',
        cmap: {
            R: [0, 170],
            G: [0, 110],
            B: [0, 40],
            A: [0, 255],
        }
    },
    {
        name: 'OLIVE',
        cmap: {
            R: [0, 128],
            G: [0, 128],
            B: [0, 0],
            A: [0, 255],
        }
    },
    {
        name: 'TEAL',
        cmap: {
            R: [0, 0],
            G: [0, 128],
            B: [0, 128],
            A: [0, 255],
        }
    },
    {
        name: 'PURPLE',
        cmap: {
            R: [0, 145],
            G: [0, 30],
            B: [0, 180],
            A: [0, 255],
        }
    },
    {
        name: 'MAGENTA',
        cmap: {
            R: [0, 240],
            G: [0, 50],
            B: [0, 230],
            A: [0, 255],
        }
    },
    {
        name: 'LIME',
        cmap: {
            R: [0, 50],
            G: [0, 205],
            B: [0, 50],
            A: [0, 255],
        }
    },
]

export const trueCheckState = [true, true, true, true, true, true, true, true, true, true];
export const case1 = '[false,true,true,true,true,true,true,true,true,true]';
export const organ_ids = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach']
export const API_ORIGIN = 'http://localhost:5000';