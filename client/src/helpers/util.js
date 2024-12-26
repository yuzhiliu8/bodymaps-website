export function filenameToName(filename) {
    let index = filename.indexOf('.');
    if (index === -1){
        return filename;
    }

    return filename.substring(0, index);
}

export function arrayIsEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
        return true;
    }
}