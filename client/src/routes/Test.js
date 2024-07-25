import React from 'react';

import TestComp from '../components/TestComp';
import './Test.css';

import  * as fflate  from 'fflate';
function Test() {

  

const data = new TextEncoder().encode("Hello, fflate!");
const compressedData = fflate.compressSync(data);
const decompressedData = fflate.decompressSync(compressedData);
const decompressedString = new TextDecoder().decode(decompressedData);
console.log("Original Data:", new TextDecoder().decode(data));
console.log("Compressed Data:", compressedData);
console.log("Decompressed Data:", decompressedString);
  

  return (
    <div className="test">
      test
      <TestComp/>
      <TestComp/>
    </div>
  )
}

export default Test