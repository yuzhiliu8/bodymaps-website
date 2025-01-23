import React from 'react'
import { APP_CONSTANTS } from '../../helpers/constants';

import './NestedCheckBox.css'

function CheckBox({itemData, checkStateProp, update}) {
    const isChecked = checkStateProp[itemData.id];
    console.log(itemData);

    let backgroundColor;
    if (itemData.id === 0){
        backgroundColor = `rgba(0, 0, 0, 0)`;
    } else {
        const rgbaVals = APP_CONSTANTS.cornerstoneCustomColorLUT[itemData.id];
        backgroundColor = `rgba(${rgbaVals.join(',')})`;
    }
    return (
        <>
        <div className='item-label'> {itemData.label} 
            <div className="checkbox-icons">
                <div className="colorbox" style={{backgroundColor: backgroundColor}}></div>
                <input className='checkmark' type="checkbox" checked={isChecked} onChange={() => update(itemData.id, !isChecked)}/>
            </div>
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