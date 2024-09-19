export function filenameToName(filename) {
    return filename.substring(0, filename.indexOf('.')).replace('_', '');
}

export function arrayIsEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
        return true;
    }
}