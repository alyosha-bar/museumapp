import { useState } from 'react';
import './App.css';
import ArtForm from './components/ArtForm';
import MapContainer from './components/Map';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <Navbar></Navbar>
      <div className='main'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/yo' element={<> <div> YOO </div></>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
