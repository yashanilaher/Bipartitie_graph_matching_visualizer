import React, { useEffect, useRef } from "react";
import './index.css'
import { group } from "d3";
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from './components/Home/Home';
import G1 from './components/G1/G1';
import G2 from './components/G2/G2';
import G3 from './components/G3/G3';
import Custom from "./components/Custom/Custom";

function App() {
  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='graph1' element={<G1/>}/>
        <Route path='graph2' element={<G2/>}/>
        <Route path='graph3' element={<G3/>}/>
        <Route path='customgraph' element={<Custom/>}/>
      </Route>
    )
  )


  return (
    <RouterProvider router={router}>
      
    </RouterProvider>
  )
}

export default App




