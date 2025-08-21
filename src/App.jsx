import React from 'react'
import AddEmployee from './pages/addEmploye/AddEmployee.jsx'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar.jsx'
import Attendance from './pages/attendance/Attendance.jsx'
import { Routes, Route, Link } from "react-router-dom";
import Login from './pages/login/Login.jsx'




const App = () => {
  return (
    <div>
     <Navbar/>
{/*   
      <AddEmployee /> */}
      {/* <Attendance/>  */}
     
      <ToastContainer position="top-right" autoClose={3000}/>
      <Routes>
        <Route path='/' element={<AddEmployee/>}></Route>
        <Route path='/attendance' element={<Attendance/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
      
    </div>
  )
}

export default App
