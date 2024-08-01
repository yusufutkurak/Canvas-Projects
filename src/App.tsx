import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import ParticleCanvas from './Components/ParticleCanvas';
import TextCanvas from './Components/TextCanvas';

const App: React.FC = () => {
 
  return (
    <div className="App">
      <ParticleCanvas />
      </div>
  );
}

export default App;
