import VisualizationPage from './routes/VisualizationPage'
import HomePage from './routes/HomePage';
import Test from './routes/Test';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/visualization' element={<VisualizationPage/>}/>
          <Route path='/test' element={<Test />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
