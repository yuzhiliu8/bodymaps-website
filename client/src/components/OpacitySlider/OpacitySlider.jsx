import React from 'react'
import { useState } from 'react'
import './OpacitySlider.css'

export default function OpacitySlider( { opacityValue, handleOpacityOnSliderChange, handleOpacityOnFormSubmit } ) {
    const [textValue, setTextValue] = useState(opacityValue);

    const handleTextChange = (e) => {
        setTextValue(e.target.value);
    }

    const handleOpacitySubmit = (e) => {
        e.preventDefault();
        let v = textValue;
        if (textValue > 100){
            v = 100; 
        } else if (textValue < 0){
            v = 0;
        }
        setTextValue(v);
        console.log(v);
        handleOpacityOnFormSubmit(v);
    }

    return (
        <div className="op-slider">
            <div className="opacity-slider-label">Overall label opacity: </div>
            <div className="op-slider-container">
                <form onSubmit={handleOpacitySubmit}>
                    <input className="slider-value-label" type="text" value={textValue} onChange={handleTextChange}/>
                </form>
                <input className="slider" type="range" min="0" max="100" value={opacityValue} onChange={handleOpacityOnSliderChange}/>
            </div>
        </div>
    )
}