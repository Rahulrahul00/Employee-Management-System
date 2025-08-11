import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", designation: "", department: "" })

  // Fetch employees
  const employeesData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/employees');
      console.log(data)
      setEmployees(data)
    } catch (error) {
      console.log("Data not found", error)
    }
  }
  useEffect(() => {
    employeesData()
  }, [])

  //Add employee
  const handleSubmit = async(e) =>{
    e.preventDefault();
  
      try {
        const res = await axios.post('http://localhost:5000/api/employees', form);
        console.log("server response:", res.data);
        setEmployees([...employees, res.data.employee]);

        setForm({ name: "", email: "", designation: "", department: "" });
        setShowModal(false);
      } catch (error) {
        console.log('cannot add employee');
      }
  }
  return (
    <div className="container py-5">
      <div className='card shadow'>
        <div className='card-body'>

          {/* Headder */}
          <div className=' d-flex justify-content-between align-items-center border-bottom pb-3 mb-3'>
            <h4>Employee Management System</h4>
            <button onClick={()=>setShowModal(true)} className='btn btn-success'>Add Employee</button>
          </div>
          {/* table */}
          <div className='table-responsive'>
            <table className=' table table-bordered table-hover align-middle'>
              <thead className='table-light'>
                <tr>
                  <th>Slno</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>

              </thead>
              <tbody>
                {
                  employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.department}</td>
                      <td>
                        <div>
                          <button className='btn btn-lg'><FaRegEdit /></button>
                          <button className='btn btn-lg'><MdDelete /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>


            </table>

          </div>

        </div>

      </div>

    {/* Modelbox */}
    {
      showModal &&
       <div className='modal fade show ' style={{ display: "block" }} tabIndex="-1">
        <div className='modal-dialog'>
          <div className='modal-content'>

            {/* modal header */}
            <div className='modal-header'>
              <h5 className="modal-title text-center" >Add Employee</h5>
              <button type='button' className='btn-close' onClick={()=> setShowModal(false)}></button>
            </div>

            {/* modal body */}
             <form onSubmit={handleSubmit}>
              <div className='modal-body'>
                <div className='mb-3'>
                  <input className='form-control' type="text" placeholder='Name'
                   value={form.name} onChange={ e => setForm({...form, name: e.target.value}) }
                  />
                </div>
                 <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Designation"
                      value={form.designation}
                      onChange={e => setForm({ ...form, designation: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Department"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                

                 <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>

              </div>
             </form>
          </div>

        </div>

       </div>
    }
     {/* Backdrop for modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  )
}

export default AddEmployee
