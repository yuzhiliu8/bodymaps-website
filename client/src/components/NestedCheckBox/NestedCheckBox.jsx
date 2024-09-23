import React from 'react'
import { useState, useEffect } from 'react'

import './NestedCheckBox.css'



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