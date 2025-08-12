import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", designation: "", department: "" });
  const [editForm, setEditForm] = useState(null);


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

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    setEmployees(prev => prev.filter(emp => emp.id !== id));
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);

    } catch (error) {
         console.error("Failed to delete employee", error);
    }
  };

//add and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editForm) {
        const res = await axios.put(`http://localhost:5000/api/employees/${editForm}`, form);
        console.log("Full update response:", res.data);

        // Extract employee data - handle both response formats
        const updatedEmployee = res.data.employee || res.data;

        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id == editForm ? updatedEmployee : emp  // Use == for type coercion
          )
        );
      } else {
        const res = await axios.post('http://localhost:5000/api/employees', form);
        const newEmployee = res.data.employee || res.data;
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      }

      setForm({ name: "", email: "", designation: "", department: "" });
      setEditForm(null);
      setShowModal(false);
    } catch (error) {
      console.error('Operation failed:', {
        message: error.message,
        response: error.response?.data
      });
    }
  }

  return (
    <div className="container py-5">
      <div className='card shadow'>
        <div className='card-body'>

          {/* Headder */}
          <div className=' d-flex justify-content-between align-items-center border-bottom pb-3 mb-3'>
            <h4>Employee Management System</h4>
            <button onClick={handleAdd} className='btn btn-success'>Add Employee</button>
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
                          <button onClick={() => handleEdit(emp)} className='btn btn-lg'><FaRegEdit /></button>
                          <button onClick={() => handleDelete(emp.id)} className='btn btn-lg'><MdDelete /></button>
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
                    <button type="submit" className="btn btn-primary">{editForm ? "Update" : "Save"}</button>
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
