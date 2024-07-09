import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home'
import Visualization from './routes/Visualization';

function App() {
    return (
    <>
    <Router basename="/bodymaps-website">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualization" element={<Visualization/>} />
        </Routes>
    </Router>
    </>

  )
}

export default App