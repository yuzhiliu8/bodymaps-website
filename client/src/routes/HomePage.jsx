import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import image from '../assets/images/BodyMapsIcon.png';
import "./HomePage.css"

import "./HomePage.css"


export default function HomePage() {
  const [nifti, setNifti] = useState();
  const [masks, setMasks] = useState();
  const navigate = useNavigate();


  const handleUpload = (event) => {
    const f = event.target.files[0]
    if (f){
      setNifti(f);
    }
  }

  const handleMaskUpload = (event) => {
    const m = Array.from(event.target.files);
    setMasks(m);
  }

   
  useEffect(() => {
    if (nifti && masks){ 
      const formData = new FormData();    
      formData.append('MAIN_NIFTI', nifti)
      masks.forEach((file) => { 
        formData.append(file.name, file) 
      })  
      fetch('/api/upload', { method: 'POST', body: formData})
      .then((response) => response.text()) 
      .then((path) => {
        console.log(path); 
        navigate('/visualization', {state: {serverDir: path}});   
      });
    
    }

  }, [nifti, masks]);




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
        <button onClick={() => {
          fetch('/api/download/files||aorta.nii.gz')
          .then((response) => response.blob())
          .then((blob) => {
            console.log(blob);
            const link = URL.createObjectURL(blob);
            console.log(link);
          })
        }}> Debug </button>
      </div>
    </div>    
  )
}