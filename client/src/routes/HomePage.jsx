import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { accepted_exts, API_ORIGIN } from '../helpers/constants';
import image from '../assets/images/BodyMapsIcon.png';
import "./HomePage.css"



export default function HomePage() {
  const [nifti, setNifti] = useState({});
  const [masks, setMasks] = useState();
  const navigate = useNavigate();


  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (!file){
      return
    }

    const ext = file.name.substring(file.name.indexOf('.'))
    if (accepted_exts.includes(ext)){
      setNifti(file);
    } else {
      window.alert(`file extension ${ext} not accepted!`);
    }
  }

  const handleMaskUpload = (event) => {
    const masks = Array.from(event.target.files);
    if (masks.length === 0 ){
      return 
    }

    let accept = true;

    for (let i = 0; i < masks.length; i++){
      const mask = masks[i];
      const ext = mask.name.substring(mask.name.indexOf('.'))
      if (!accepted_exts.includes(ext)){
        window.alert(`file extension ${ext} not accepted!`);
        accept = false;
        event.target.value = '';
        break;
      }
    }

    if (accept){
      setMasks(masks);
    }
  }

   
  useEffect(() => {
    if (nifti.name && masks){ 
      try {
        const formData = new FormData();    
        formData.append('MAIN_NIFTI', nifti)
        masks.forEach((file) => { 
          formData.append(file.name, file) 
        }) 
        fetch(`${API_ORIGIN}/api/upload`, { method: 'POST', body: formData})
        .then((response) => {
          if (!response.ok){
            throw new Error("Could not connect to server");
          }
          return response.text();
        }) 
        .then((sessionKey) => {
          const fileNames = masks.map((mask) => {
            return mask.name;
          });
        const fileInfo = {};
        fileInfo.MAIN_NIFTI = nifti;
        fileInfo.masks = fileNames;
        console.log(fileInfo);
        console.log(sessionKey); 
        navigate('/visualization', {state: {sessionKey: sessionKey, fileInfo: fileInfo}});   
        });
      } catch (error) {
        console.error(error.message);
      }
      
    
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
            {
              (typeof nifti.name === "undefined") ? (
                <></>
              ) : (
                <div> {nifti.name} </div>
              )
            }
          </div>
          <input className="fileInput" type="file" accept=".nii.gz, .nii" onChange={handleUpload}/>
        </div>
        <div className="note">
          By using this online service ​<br/> you agree that the data can be used to improve the model.​
        </div>
        <br/>
        <div>Upload CT Masks Here: (Development Phase only)</div> <br/>
        <input type="file" multiple accept=".nii.gz, .nii" onChange={handleMaskUpload}/>
      </div>
    </div>    
  )
}