import React from 'react'
import AddEmployee from './pages/addEmploye/AddEmployee.jsx'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar.jsx'
import Attendance from './pages/attendance/Attendance.jsx'
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from './pages/login/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'




const App = () => {
  return (
    // <div>
    //  <Navbar/>
     
    //   <ToastContainer position="top-right" autoClose={3000}/>
    //   <Routes>
        
    //     <Route path='/' element={<ProtectedRoute><AddEmployee/></ProtectedRoute> }></Route>
    //     <Route path='/attendance' element={<ProtectedRoute><Attendance/></ProtectedRoute> }></Route>
    //     {/* Default */}
    //     <Route path='*' element={<Navigate to='/login'/>}></Route>
    //   </Routes>
      
    // </div>

    <>
      <Routes>
        {/* public route */}
        <Route path='/login' element={<Login/>}></Route>

        {/* Protected route */}
        <Route path='/employee'element={
          <ProtectedRoute>
            <Navbar/>
            <AddEmployee/>
          </ProtectedRoute>
        } ></Route>

        <Route path='/attendance' element={
          <ProtectedRoute>
            <Navbar/>
            <Attendance/>
          </ProtectedRoute>
        }></Route>

        {/*default redirect  */}
        <Route path='*' element={<Navigate to='/login'/>}></Route>
      </Routes>
    </>
  )
}

export default App
