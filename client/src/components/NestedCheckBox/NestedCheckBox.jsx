import React from 'react'
import { useState, useEffect } from 'react'

import './NestedCheckBox.css'






const data = [
    {label: "All (Default)", id: 0},
    {label: 'Aorta', id:1},
    {label: 'Gallbladder', id: 2},
    {label: 'Kidney (L)', id: 3},
    {label: 'Kidney (R)', id: 4},
    {label: 'Liver', id: 5},
    {label: 'Pancreas', id: 6},
    {label: 'Postcava', id:7},
    {label: 'Spleen', id: 8},
    {label: 'Stomach', id: 9},
]

function CheckBox({itemData, checkStateProp, update}) {
    const isChecked = checkStateProp[itemData.id];

    return (
        <>
        <div className='item-label'> {itemData.label} 
            <input className='checkmark' type="checkbox" checked={isChecked} onChange={() => update(itemData.id, !isChecked)}/>
        </div>
        </>
    )
}

function NestedCheckBox({ checkBoxData, innerRef, checkState, update }) {
    return (
        <div className="NestedCheckBox" style={{display:"block"}} ref={innerRef}>
            {
            
            (typeof checkBoxData === "undefined" && checkState.length > 0) ? (
                <p>Undefined</p>
            ) : (
                checkBoxData.map((itemData) => (
                    <CheckBox key={itemData.id} itemData={itemData} checkStateProp={checkState} update={update}/>
                ))
            )
            }
        </div>
    )
}

export default NestedCheckBox