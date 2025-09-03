import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", designation: "", department: "" });
  const [editForm, setEditForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch employees
  const employeesData = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('http://localhost:5000/api/employees',
       {headers:{Authorization:`Bearer ${token}`}});

      // console.log(data)
      setEmployees(data)
    } catch (error) {
      console.log("Data not found", error)
    }
  }
  useEffect(() => {
    employeesData()
  }, [])


  // Open modal for adding
  const handleAdd = () => {
    setEditForm(null);
    setForm({ name: "", email: "", designation: "", department: "" });
    setShowModal(true);

  };

  //open modal for editing
  const handleEdit = (emp) => {
    setEditForm(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      designation: emp.designation,
      department: emp.department
    })

    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Optimistic UI update - remove immediately
        setEmployees(prev => prev.filter(emp => emp.id !== id));

        await axios.delete(`http://localhost:5000/api/employees/${id}`,
          {headers:{Authorization:`Bearer ${token}`}}
        );

        if (response.data.message) {
          toast.success(response.data.message);
        }   

        Swal.fire(
          'Deleted!',
          'Employee has been deleted.',
          'success'
        );

      } catch (error) {
        // Revert if deletion fails
        employeesData(); // Refresh data from server

        // Swal.fire(
        //   'Error!',
        //   error.response?.data?.error || 'Failed to delete employee',
        //   'error'
        // );
      }
    }
  };

  //add and update
  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    //Frontend validation
    if (!form.name || !form.email || !form.designation || !form.department) {
      toast.error('Please fill all fields');
      return;
    }

    //Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      if (editForm) {
        const res = await axios.put(`http://localhost:5000/api/employees/${editForm}`, form,
          {headers:{Authorization:`Bearer ${token}`}}
        );
        console.log(res)

        //backend valiation
        if (res.data.success === false) {
          toast.error(res.data.error || 'Update Failed');
          return;
        }

        const updatedEmployee = res.data.employee || res.data;
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id == editForm ? updatedEmployee : emp
          )
        );
        toast.success(res.data.message);
      } else {
        const res = await axios.post('http://localhost:5000/api/employees', form,
          {headers:{Authorization:`Bearer ${token}`}}
        );
        const newEmployee = res.data.employee || res.data;
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);

        toast.success(res.data.message);
      }
      setForm({ name: "", email: "", designation: "", department: "" });
      setEditForm(null);
      setShowModal(false);
    } catch (error) {
      console.error('Operation failed:', error)

      // Handle different error scenarios
      if (error.response) {
        const serverError = error.response.data;
        toast.error(serverError.error || 'Server error')
      } else if (error.request) {
        toast.error('Network error-Please check your connection');
      } else {
        toast.error('Request failed to send');
      }
    }
  }

  return (
    <div className="container py-5">
      <div className='card shadow'>
        <div className='card-body'>

          {/* Headder */}
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h4>Employee Management System</h4>
            <div className="">
              <button onClick={()=>navigate('/attendance')} className="btn btn-warning text-black mx-3 fw-semibold">Attendance</button>
              <button onClick={handleAdd} className="btn btn-success fw-semibold ">Add Employee</button>
            </div>
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
                          <button onClick={() => handleEdit(emp)} className='btn btn-lg text-info'><FaRegEdit size={25} /></button>
                          <button onClick={() => handleDelete(emp.id)} className='btn btn-lg text-danger '><MdDelete size={27} /></button>
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
                <h5 className="modal-title text-center" >{editForm ? "Edit Employee" : "Add Employee"}</h5>
                <button type='button' className='btn-close' onClick={() => setShowModal(false)}></button>
              </div>

              {/* modal body */}
              <form onSubmit={handleSubmit}>
                <div className='modal-body'>
                  <div className='mb-3'>
                    <input className='form-control' type="text" placeholder='Name'
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
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
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>{editForm ? "Update" : "Save"}</button>
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
