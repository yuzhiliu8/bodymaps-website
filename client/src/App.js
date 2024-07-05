import React from 'react'
import { useState } from 'react'
import "./App.css"
import image from './assets/BodyMaps.png';

export default function App() {
  const [files, setFiles] = useState(' ');

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (file){
      setFiles(file);
      console.log(files);
    }
    
  }



  return (
    <div className="App">
      
      <div className="container">
        <div className="header">
          BodyMaps
        </div>
        <img src={image} alt="BodyMaps" />
        <div className="input-container">
          <div className="input-label">
            Upload NIFTI.nii.gz Here
          </div>
          <form>
            <input type="file" multiple onChange={handleUpload}/>
          </form>
        </div>
        <div>
        {files.name}
      </div>
      </div>
      
    </div>    
  )
}
