import React from 'react'
import './Test.css';
import { getGPUTier } from 'detect-gpu';

const gpu = async () => {
    const gpuTier = await getGPUTier({
        override: {
            gpu: "amd radeon rx 580"
        }
    });
    console.log(gpuTier);
}

function Test() {
    return (
        <div className="TestPage">
            Test
            <button onClick={gpu}> press </button>
        </div>
    )
}

export default Test