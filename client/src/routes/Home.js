import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import "./Home.css"
import image from '../assets/images/BodyMapsIcon.png';

export default function Home() {
  const [file, setFile] = useState();
  const [masks, setMasks] = useState();
  const navigate = useNavigate();


  const handleUpload = (event) => {
    const f = event.target.files[0]
    if (f){
      setFile(f);
    }
  }

  const handleMaskUpload = (event) => {
    const m = event.target.files;
    setMasks(m);
  }

  useEffect(() => {
    console.log(file);
    console.log(masks);
    if (file && masks){
      navigate('/visualization', {"state": {"nifti": file, "masks": masks}});
    }
  })




  return (
    <div className="App">
      <div className="container">
        <div className="header">
          BodyMaps
        </div>
        <img className="image" src={image} alt="BodyMaps" />
        <div className="input-container">
          <div className="label-container">
            <div className="input-label">
              Drop <b>NIFTI.nii.gz</b> here 
            </div>
            <div className="input-label">
              or Click to Upload
            </div>
          </div>
          
          
          
          <input className="fileInput" type="file" onChange={handleUpload}/>
          
        </div>
        <div className="note">
          By using this online service ​<br/> you agree that the data can be used to improve the model.​
        </div>
        <br/>
        <div>Upload CT Masks Here: (Development Phase only)</div> <br/>
        <input type="file" multiple onChange={handleMaskUpload}/>
      </div>
    </div>    
  )
}
