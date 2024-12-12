import { useState } from 'react';
import './App.css';
import ArtForm from './components/ArtForm';
import MapContainer from './components/Map';

function App() {

  return (
    <>
      <div className='main'>
        <ArtForm></ArtForm>
        <MapContainer></MapContainer>
      </div>
    </>
  );
}

export default App;
