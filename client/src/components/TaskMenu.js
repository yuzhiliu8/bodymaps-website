import React from 'react'
import TaskMenuItem from './TaskMenuItem'

import './TaskMenu.css'

function TaskMenu({ handleChecked, innerRef }) {
  return (
    <div className="TaskMenu" style={{display:"none"}} ref={innerRef}>
       <TaskMenuItem
        name="All (default)"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Aorta"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Gallbladder"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Kidney (L)"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Kidney (R)"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Liver"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Pancreas"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Postcava"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Spleen"
        handleChecked={handleChecked}/>
       <TaskMenuItem
        name="Stomach"
        handleChecked={handleChecked}/>
    </div>
  )
}

export default TaskMenu