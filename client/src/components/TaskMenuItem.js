import React from 'react'
import "./TaskMenuItem.css"


function TaskMenuItem( { name, handleChanged } ) {

    return (
        <div className="TaskMenuItem">
        <div className="item-label">
            {name}
            <input className="checkmark" type="checkbox" onChange={handleChanged}/>
        </div>
        </div>
    )
}

export default TaskMenuItem