import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    check_in: '',
    check_out: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  //Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, attendanceRes] = await Promise.all([
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/attendance')
        ]);
        setEmployees(employeeRes.data);
        setAttendance(attendanceRes.data);
        console.log(employeeRes.data)
        
      } catch (error) {
        toast.error('Failed to fetch data')
        console.log('failed to fecth data', error)
      }
    };
    fetchData();
  }, []);

  //Input Changes
  const handleInputChanges = (e)=>{
     const {name, value} = e.target;
     setForm(prev => ({...prev, [name]: value}));
  }

//Updating date format
const formatDate = (dateString) =>{
  if(!dateString) return 'N/A';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() +1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}` ;
}

// Format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  // Create a date object (using arbitrary date + your time)
  const date = new Date(`2000-01-01T${timeString}`);
  
// Format as 12-hour time with AM/PM
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


//form submission
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      await axios.post('http://localhost:5000/api/attendance', form);
      toast.success('Attendance marked successfully');
      setShowModal(false);

      //Refresh Data
      const res = await axios.get('http://localhost:5000/api/attendance');
      setAttendance(res.data);
    }catch(error){
      toast.error(error.response?.data?.error || 'Failed to mark attendance')
    }
  }
  
  return (

    <div className="container my-5">
      <div className='card shadow'>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h4>Attendance Records</h4>
            <Button onClick={() => setShowModal(true)}>Mark Attendance</Button>
          </div>
        
        
          {/* Table */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Check In</th>
                <th className='text-center'>Check Out</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
                {attendance.map(record =>(
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.employee_name}</td>
                    <td className='text-center'>
                      <Badge
                        bg={
                          record.status === 'present' ? 'success' :
                          record.status === 'absent' ? 'danger' : 'warning'
                        }
                      >{record.status} </Badge>
                    </td>
                    <td className='text-center'>{formatTime(record.check_in )|| 'N/A'}</td>
                    <td className='text-center'>{formatTime(record.check_out) || 'N/A'}</td>

                  </tr>
                ))}
            </tbody>

          </Table>

        </div>

      </div>
      {/* Mark Attendance Modal  */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton >
          <Modal.Title >Mark Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Select
                 name="employee_id"
                 value={form.employee_id}
                 onChange={handleInputChanges}
                 required
              >
                <option value="">Select Employee</option>
                {
                  employee.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))
                }

              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type='date'
                name='date'
                value={form.data}
                onChange={handleInputChanges}
                required
              />
            </Form.Group >

            <Form.Group className="mb-3" >
                <Form.Label>Status</Form.Label>
                <Form.Select
                   name="status"
                   value={form.status}
                   onChange={handleInputChanges}
                   required 
                >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                

                </Form.Select>
            </Form.Group>

            {form.status !== 'absent' &&(
              <>
                <Form.Group className='mb-3'>
                  <Form.Label>Check In Time</Form.Label>
                  <Form.Control
                    type='time'
                    name='check_in'
                    value={form.check_in}
                    onChange={handleInputChanges}
                    required={form.status !== 'absent'}                  
                  />
                </Form.Group>

                {form.status !== '' &&(
                  <Form.Group className="mb-3">
                    <Form.Label>Check Out Time</Form.Label>
                    <Form.Control
                       type='time'
                       name='check_out'
                       onChange={handleInputChanges}
                       value={form.check_out}
                       
                    />
                  </Form.Group>
                )}
              </>
            )}

             <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>

          </Form>

        </Modal.Body>
      </Modal>




    </div>
  )
}

export default Attendance
