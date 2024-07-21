import React from 'react'
import "./TaskMenuItem.css"


function TaskMenuItem( { name, handleChecked } ) {

    return (
        <div className="TaskMenuItem">
        <div className="item-label">
            {name}
            <input className="checkmark" type="checkbox" onChange={handleChecked}/>
        </div>
        </div>
    )
}

export default TaskMenuItem