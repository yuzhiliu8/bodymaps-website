import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import "./Home.css"
import image from '../assets/BodyMaps.png';

export default function Home() {
  const [file, setFile] = useState(' ');
  const navigate = useNavigate();

  const handleUpload = (event) => {
    const f = event.target.files[0]
    if (f){
      setFile(f);
      console.log(file);
    }
    
  }

  const handleInference = (event) => {
    navigate("/visualization", {"state": {"file": file}})
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
            Drop <b>NIFTI.nii.gz</b> here or Click to Upload
          </div>
          
          <form>
            <input type="file" multiple onChange={handleUpload}/>
          </form>
        </div>
        <div>
        {file.name}
      </div>
      <button onClick={handleInference}>Inference</button>
      </div>
    </div>    
  )
}
