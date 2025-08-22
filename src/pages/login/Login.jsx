import axios from "axios";
import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) =>{
    e.preventDefault()
    setLoading(true);
    try{
      if( state === 'Sign Up'){
        //register API
        const {data} = await axios.post('http://localhost:5000/api/register',{email, password,name});
        if(data.success){
          toast.success('Registration successful! Please log in');
          setState('LogIn')
          setEmail('')
          setPassword('')
          setName('')
        }else{
          toast.error(data.message)
        }
      }else{
      //Login API
     const {data} = await axios.post('http://localhost:5000/api/login', {email, password});
        if(data.success){
          localStorage.setItem('token', data.token)
          setEmail('')
          setPassword('')
          
          toast.success('Login Successful!')
          navigate('/employee');
          
        }else{
          console.log(error);
          toast.error(error.message || 'Authentication failed');
        }
    }
  }catch(error){
      console.log("Auth Error");
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: "28rem", boxShadow: "0 4px 10px #c77dff" }}>
        <h3 className="text-center mb-3" style={{color:"#5a189a"}}> 
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h3>
        <p className="text-center text-muted">
          Please {state === "Sign Up" ? "Sign Up" : "Login"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button disabled={loading}  type="submit" className="btn rounded-pill text-white fw-semibold  w-100" style={{ backgroundColor: "#5a189a" }}>
            { loading ? "Processing..." : (state === "Sign Up" ? "Create Account" : "Login")}
  
          </button>
        </form>

        <div className="mt-3 text-center">
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                className="fw-bold"
                style={{ cursor: "pointer", color:"#5a189a",textDecoration:"underline"}}
                onClick={() => setState("Login")}
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <span
                className=" fw-bold "
                style={{ cursor: "pointer", color:"#5a189a", textDecoration:"underline" }}
                onClick={() => setState("Sign Up")}
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
