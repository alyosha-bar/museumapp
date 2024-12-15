import { useState } from 'react';
import './App.css';
import ArtForm from './components/ArtForm';
import MapContainer from './components/Map';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';

function App() {

  return (
    <>
      <Navbar></Navbar>
      <div className='main'>
        <Routes>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/' element={<Landing />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
