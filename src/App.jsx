import React from 'react'
import AddEmployee from './components/AddEmployee'
import { ToastContainer } from 'react-toastify'


const App = () => {
  return (
    <div>
      <AddEmployee />
      <ToastContainer position="top-right" autoClose={3000}/>
    </div>
  )
}

export default App
