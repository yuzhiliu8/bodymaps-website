import React from 'react'
import { useState } from 'react'
import './OpacitySlider.css'

export default function OpacitySlider( { opacityValue, handleOpacityChange } ) {

    return (
        <div className="op-slider">
            <div className="opacity-slider-label">Overall label opacity: </div>
            <div className="op-slider-container">
                <input className="slider-value-label" type="text" value={opacityValue} onChange={handleOpacityChange}/>
                <input className="slider" type="range" min="0" max="100" value={opacityValue} onChange={handleOpacityChange}/>
            </div>
        </div>
    )
}