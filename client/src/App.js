import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom';


import HomePage from './routes/HomePage'
import VisualizationPage from './routes/VisualizationPage'
import Test from './routes/Test';
import './App.css';

function App() {
    return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visualization" element={<VisualizationPage />} />
        <Route path="/test" element={<Test />} />
        </Routes>
    </Router>
    </>

  )
}

export default App