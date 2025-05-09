import React, { useEffect, useRef } from "react";
import './index.css'
import { group } from "d3";
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from "react-router-dom";
import Layout from "./Layout";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import Home from './components/Home/Home';
import G1 from './components/Berge/G1';
import G2 from './components/Berge/G2';
import G3 from './components/Berge/G3';
import G4 from "./components/Berge/G4";
import G5 from "./components/Berge/G5";
import Custom from "./components/Custom/Custom";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Berge from "./components/Berge/Berge";


import Gale from "./components/Gale/Gale";
import S1 from './components/Gale/S1';
import SCustom from './components/Gale/SCustom';


function App() {
  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='berge' element={<Berge/>}/>
        <Route path='graph1' element={<G1/>}/>
        <Route path='graph2' element={<G2/>}/>
        <Route path='graph3' element={<G3/>}/>
        <Route path='graph4' element={<G4/>}/>
        <Route path='graph5' element={<G5/>}/>
        <Route path='custom' element={<Custom/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='contact' element={<Contact/>}/>
        {/* <Route path='graph1' element={<G1/>}/>
        <Route path='graph2' element={<G2/>}/>
        <Route path='graph3' element={<G3/>}/> */}

        <Route path='gale' element={<Gale/>}/>
        <Route path='sgraph1' element={<S1/>}/>
        <Route path='scustom' element={<SCustom/>}/>

      </Route>
    )
  )


  return (
    <RouterProvider router={router}>
      
    </RouterProvider>
  )
}

export default App




