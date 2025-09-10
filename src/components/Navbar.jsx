import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn]= useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token);
  },[])
  
  const handleLogout = () =>{
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
       {/* <h1><a className="navbar-brand "style={{ fontSize: "2rem" }} href="#">EMS</a></h1>
         */}
        
         <div className='mx-3'>
           <img style={{width:'4rem'}} src="https://www.codester.com/static/uploads/items/000/028/28925/icon.png" alt="Logo" />
         </div>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse mx-5 navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" aria-current="page" to="/employee">Dashboard</Link>
            </li>
       <li className="nav-item">
              <Link className="nav-link fw-semibold" aria-current="page" to="/attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className='nav-link fw-semibold' to='/leave'>Leave</Link>

            </li>
            <li className="nav-item">
              <Link className='nav-link fw-semibold' to='/holiday'>Holiday</Link>

            </li>
            <li className="nav-item">
              
              <Link className="nav-link fw-semibold" to="/report">Report</Link>

            </li>
           
          </ul>
          {
            isLoggedIn ? (
               <button onClick={handleLogout} className="btn btn-outline-danger">
              Logout
            </button>
            ):(
              <button onClick={()=>navigate('/')}  className="btn btn-outline-primary">Login</button>
            )
          }
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
