import React from 'react'
import TaskMenuItem from './TaskMenuItem'

import './TaskMenu.css'

function TaskMenu({ handleChanged, innerRef, innerStyle }) {
  return (
    <div className="TaskMenu" style={{display:"none"}} ref={innerRef}>
       <TaskMenuItem
        name="All (default)"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Aorta"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Gallbladder"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Kidney (L)"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Kidney (R)"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Liver"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Pancreas"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Postcava"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Spleen"
        handleChanged={handleChanged}/>
       <TaskMenuItem
        name="Stomach"
        handleChanged={handleChanged}/>
    </div>
  )
}

export default TaskMenu