import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import "./HomePage.css"
import image from '../assets/images/BodyMapsIcon.png';

export default function HomePage() {
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
    const m = Array.from(event.target.files);
    setMasks(m);
  }

  useEffect(() => {
    console.log(file);
    console.log(masks);
    if (file && masks){
      // const formData = new FormData();
      // formData.append('file', file)
      // fetch("/api/send", {
      //   method: 'POST',
      //   body: formData,
      // })
      // .then((response) => response.text())
      // .then((data) => {
      //   console.log(data)
      //   console.log("filename: ", file.filename)
      //   navigate('/visualization', {state: {path: data, file: file}})
      // });
      navigate('/visualization', {state: {file: file, masks: masks}});
    }
  })




  return (
    <div className="HomePage">
      <div className="container">
        <div className="header">
          BodyMaps
        </div>
        <img className="image" src={image} alt="BodyMaps" />
        <div className="input-container">
          <div className="label-container">
            <div className="input-label">
              Drop <span style={{fontFamily: "AptosBold"}}>NIFTI.nii.gz</span> here 
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