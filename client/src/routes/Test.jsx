import React from 'react'
import { useRef, useEffect } from 'react';
import Visual from '../components/Visual'
import './Test.css';





function Test() {
    return (
        <div className="Test">
            <div className="test-container">
                <div className="side">
                    sidebar
                </div>
                <div className="vis-container">
                <Visual />
                </div>
            </div>
            
        </div>
    )
}

export default Test