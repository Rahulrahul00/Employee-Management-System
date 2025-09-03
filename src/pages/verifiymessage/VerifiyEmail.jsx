import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft,FaThumbsUp } from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // get token from ?token=...
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setStatus(res.data.success ? "success" : "error");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Invalid or expired link.");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    //   <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "500px" }}>
    //     {status === "loading" ? (
    //       <>
    //         <div className="spinner-border text-primary mb-3" role="status">
    //           <span className="visually-hidden">Loading...</span>
    //         </div>
    //         <h4 className="text-muted">Verifying your email...</h4>
    //       </>
    //     ) : (
    //       <>
    //         <h3
    //           className={`fw-bold mb-3 ${
    //             status === "success" ? "text-success" : "text-danger"
    //           }`}
    //         >
    //           {message}
    //         </h3>
    //         {status === "success" && (
    //           <button
    //             onClick={() => navigate("/")}
    //             className="btn btn-primary btn-lg px-4"
    //           >
    //             Go to Login
    //           </button>
    //         )}
    //         {status === "error" && (
    //           <button
    //             onClick={() => navigate("/")}
    //             className="btn btn-outline-secondary btn-lg px-4"
    //           >
    //             Back to Home
    //           </button>
    //         )}
    //       </>
    //     )}
    //   </div>
    // </div>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  <div
    className="card shadow-lg border-0 p-5 text-center rounded-4"
    style={{ maxWidth: "480px", width: "100%" }}
  >
    {status === "loading" ? (
      <>
        <div className="spinner-border text-primary mb-4" style={{ width: "4rem", height: "4rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-secondary fw-semibold">Verifying your email...</h4>
      </>
    ) : (
      <>
        <h2
          className={`fw-bold mb-4 ${
            status === "success" ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </h2>

        {status === "success" && (
          <button
            onClick={() => navigate("/")}
            className="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
          >
            <FaThumbsUp /> Go to Login
          </button>
        )}

        {status === "error" && (
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline-danger btn-lg px-5 rounded-pill shadow-sm"
          >
           <FaArrowLeft /> Back to Home
          </button>
        )}
      </>
    )}
  </div>
</div>

  );
};

export default VerifyEmail;
