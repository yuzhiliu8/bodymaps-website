import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom';


import Home from './routes/Home'
import Visualization from './routes/Visualization';
import Test from './routes/Test';
import './App.css';

function App() {
    return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/test" element={<Test />} />
        </Routes>
    </Router>
    </>

  )
}

export default App