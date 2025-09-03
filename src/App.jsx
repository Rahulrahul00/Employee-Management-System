import React from 'react'
import AddEmployee from './pages/addEmploye/AddEmployee.jsx'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar.jsx'
import Attendance from './pages/attendance/Attendance.jsx'
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from './pages/login/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './pages/not found/NotFound.jsx'
import VerifyEmail from './pages/verifiymessage/VerifiyEmail.jsx';
import AttendanceReport from './pages/attendance report/AttendanceReport.jsx';
import EmployeeReport from './pages/employeeReport/EmployeeReport.jsx'
import Report from './pages/report/report.jsx'







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
        <Route path='/' element={<Login />}></Route>
        <Route path='/verify' element={<VerifyEmail/>}></Route>

        {/* Protected route */}
        <Route path='/employee' element={
          <ProtectedRoute>
            <Navbar />
            <AddEmployee />
          </ProtectedRoute>
        } ></Route>

        <Route path='/attendance' element={
          <ProtectedRoute>
            <Navbar />
            <Attendance />
            
          </ProtectedRoute>
        }></Route>
        <Route path='/report' element={
          <ProtectedRoute>
            <Navbar/>
            <Report/>
          </ProtectedRoute>
        }>

        </Route>
        <Route path='/attendancereport' element={
          <ProtectedRoute>
            <Navbar/>
          <AttendanceReport/>
          </ProtectedRoute>}>
          </Route>

          <Route path='/employeereport' element={
            <ProtectedRoute>
              <Navbar/>
              <EmployeeReport/>
            </ProtectedRoute>
          }>

          </Route>

        {/* 404 Page Not Found */}
         <Route path='*' element={<NotFound/>} />

        <Route path='/' element={<Navigate to='/login' />}></Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />

    </>
  )
}

export default App
