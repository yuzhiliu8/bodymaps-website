import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { accepted_exts, APP_CONSTANTS} from '../helpers/constants';
import image from '../assets/images/BodyMapsIcon.png';
import "./HomePage.css"



export default function HomePage() {
  const [mainNifti, setMainNifti] = useState({});
  const [masks, setMasks] = useState();
  
  const navigate = useNavigate();


  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (!file){
      return
    }

    const ext = file.name.substring(file.name.indexOf('.'))
    if (accepted_exts.includes(ext)){
      setMainNifti(file);
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

  const setup = () => {
    if (mainNifti.name && masks){ 
      try {
        const formData = new FormData();    
        formData.append('MAIN_NIFTI', mainNifti)
        masks.forEach((file) => { 
          formData.append(file.name, file) 
        }) 
        fetch(`${APP_CONSTANTS.API_ORIGIN}/api/upload`, { method: 'POST', body: formData})
        .then((response) => {
          if (!response.ok){
            throw new Error("Could not connect to server");
          }
          return response.json();
        }) 
        .then((data) => {
          const fileNames = masks.map((mask) => {
            return mask.name;
          });
        const fileInfo = {};
        fileInfo.MAIN_NIFTI = mainNifti;
        fileInfo.masks = fileNames;
        console.log(data);
        navigate('/visualization', {state: data});   
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  }

   
  useEffect(() => {
    setup();
  }, [mainNifti, masks]);

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
              (typeof mainNifti.name === "undefined") ? (
                <></>
              ) : (
                <div> {mainNifti.name} </div>
              )
            }
          </div>
          <input className="fileInput" type="file" onChange={handleUpload}/>
        </div>
        
        <div className="note">
          By using this online service ​<br/> you agree that the data can be used to improve the model.​
        </div>
        <br/>
        {/* <div className="segmentation-mode-selector-container">
            <div className="seg-mode-select-header">
              <div className="seg-mode">
                <p>Use AI Segmentation</p>
              </div>
              <div className="seg-mode">
                <p>Use Own Segmentations</p>
              </div>
            </div>
            

        </div> */}
        <div>Upload CT Masks Here:</div> <br/>
        <input type="file" multiple onChange={handleMaskUpload}/>
        {/* <button>Go!</button> */}
      </div>
    </div>    
  )
}