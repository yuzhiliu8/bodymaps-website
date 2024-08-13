import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { organ_names } from '../helpers/constants';
import image from '../assets/images/BodyMapsIcon.png';
import "./HomePage.css"


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

  const getMasks = async (basePath) => {
    const filenames = [...organ_names];
    const promises = filenames.map(async (name) => { 
      const blob = await fetch(`/api/download/${basePath}||${name}.nii.gz`).then((resp) => resp.blob());
      return new File([blob], name, {type: blob.type}); 
    });
    await Promise.all(promises);
    return promises;
  }
   
  useEffect(() => {
    (async () => {
      if (file && masks){
        const formData = new FormData();    
        // console.log(masks); 
        masks.forEach((file) => {
          formData.append(file.name, file) 
        })   
        // console.log(formData); 
        const response = await fetch('/api/upload', {method: 'POST', body: formData});
        const basePath = await response.text();
        console.log(basePath);
        const maskFiles = Array.from(await getMasks(basePath));
        console.log(maskFiles); 
        if (maskFiles){
          navigate('/visualization', {state: {file: file, masks: maskFiles}})
        }
      }
    }) 
    ();
  }, [file, masks]);




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