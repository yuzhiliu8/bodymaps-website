import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import "./Home.css"
import image from '../assets/images/BodyMapsIcon.png';

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
          
          
          <form>
            <input type="file" multiple onChange={handleUpload}/>
          </form>
        </div>
      <div className="note">
        By using this online service ​<br/> you agree that the data can be used to improve the model.​
      </div>
      {/* <button onClick={handleInference}>Inference</button> */}
      </div>
    </div>    
  )
}
