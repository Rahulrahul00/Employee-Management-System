import React, { useEffect, useState } from 'react'
import { Button, Drawer, Table, Form, Input, DatePicker, Select, Radio, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Toast } from 'bootstrap';

const { Option } = Select;
const LeaveReport = () => {

    const [leaveModal, setLeaveModal] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [employee, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null)
    const [form] = Form.useForm();


    // Fetch employee from API
    const fetchEmployee = async () => {
        const token = localStorage.getItem("token")
        try {
            const res = await axios.get('http://localhost:5000/api/employees', { headers: { Authorization: `Bearer ${token}` } });
            setEmployees(res.data)
            // console.log(res.data);
        } catch (error) {
            console.log("Error fetching employees", error)
        }
    }

    const fetchLeaveReport = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/leavereports');
            setLeaves(res.data)
            console.log(res.data)
        } catch (error) {
            console.log("Error fetching leave", error);
        }
    }
    useEffect(() => {
        fetchEmployee();
        fetchLeaveReport();
    }, [])

    //submitt leave form
    const onFinish = async (values) => {
        try {
            // const res = await axios.post('http://localhost:5000/api/leavereports', {
            // employee_id: values.employeeName,
            // employee_name: employee.find(e => e.id === values.employeeName)?.name,
            // date: values.date.format("YYYY-MM-DD"),
            // leave_type: values.leaveType,
            // status: values.status,
            const selectedEmployee = employee.find(e => e.id === values.employeeName);
            const payload = {
                employee_id: selectedEmployee.id,
                employee_name: selectedEmployee.name,
                date: values.date.format("YYYY-MM-DD"),
                leave_type: values.leaveType,
                status: values.status,
                reason: values.reason || "", 

            };

            if (editingLeave) {
                await axios.put(`http://localhost:5000/api/leavereports/${editingLeave.id}`, payload);
                toast.success('Leave report updated successfully');
                await fetchLeaveReport();

                // //update table
                // setLeaves(leaves.map(l => l.id === editingLeave.id ? { ...l, ...payload } : l))
            } else {
                const res = await axios.post(`http://localhost:5000/api/leavereports`, payload);
                message.success("Leave report created successfully");
                setLeaves([res.data, ...leaves]);
               
            
            }
            form.resetFields();
            setLeaveModal(false);
            setEditingLeave(null);
        } catch (error) {
            console.log("Error posting leave", error);
            if(error.response && error.response.status === 400){
                toast.error(error.response.data.error || "Duplicate date not allowed")
            }else{
                toast.error("Failed to Update Leave");
            }
        }
    }

    //Edit Leave
    const handleEdit = (record) => {
        setEditingLeave(record);
        form.setFieldsValue({
            employeeName: record.employee_id,
            date: dayjs(record.date),
            leaveType: record.leave_type,
            status: record.status,
            reason:record.reason || "",
        })
        setLeaveModal(true);
    }

    //Delete Leave
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/leavereports/${id}`);
            toast.success("Leave report deleted successfully");
            setLeaves(leaves.filter(l => l.id !== id));
        } catch (error) {
            console.log("Error deleting leave", error);
            message.error("Error deleting leave report");
        }
    }

    // Table Columns
    const columns = [
        { title: "SL No", dataIndex: "slno", key: "slno" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Employee Name", dataIndex: "employee_name", key: "employee_name" },
        { title: "Leave Type", dataIndex: "leave_type", key: "leave_type", 
            render:(text, record) =>(
                <Tooltip title={record.reason || "No Reason Provided"}>
                    {text.charAt(0).toUpperCase() + text.slice(1)}
                </Tooltip>
            )
         },
        { title: "Paid/Unpaid", dataIndex: "status", key: "status" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ color: "#1890ff", fontSize: '21px' }}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        style={{ color: "red", fontSize: '21px' }}
                    />
                </div>


            ),
        },
    ];

    return (
        <div>
            <h2 className='text-center m-3' style={{ color: '#479f14ff' }} >Leave Record</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginRight: 35 }}>
                <Button onClick={() => setLeaveModal(true)} className='fw-semibold ' style={{ backgroundColor: "#92d675ff", }}>
                    Leave Marking</Button>
            </div>

            <Table className='m-4'
                columns={columns}
                dataSource={leaves.map((leave, index) => ({
                    key: leave.id,
                    id: leave.id,
                    slno: index + 1,
                    employee_id: leave.employee_id,
                    date: dayjs(leave.date).format('YYYY-MM-DD'),
                    employee_name: leave.employee_name,
                    leave_type: leave.leave_type,
                    status: leave.status,
                    reason: leave.reason
                }))}
                pagination={{pageSize:5}}

            />
            {/* Leave marking modal */}
            <Drawer
                title={editingLeave ? "Edit Leave" : "Leave Marking"}
                placement='right'
                onClose={() => {
                    setLeaveModal(false);
                    setEditingLeave(null);
                    form.resetFields();
                }}
                open={leaveModal}
                width={400}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Employee Name" name="employeeName" rules={[{ required: true }]}>
                        
                        <Select placeholder='Select Employee' disabled={!!editingLeave}>
                            {employee.map((emp) => (
                                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Leave Type" name="leaveType" rules={[{ required: true }]}>
                        <Select placeholder="Select Leave Type">
                            <Option value="sick">Sick Leave</Option>
                            <Option value="casual">Casual Leave</Option>
                            <Option value="personal">Personal Leave</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Reason" name="reason">
                            <Input.TextArea placeholder='Reason for leave'/>
                    </Form.Item>

                    <Form.Item label="Paid / Unpaid" name="status" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="paid">Paid</Radio>
                            <Radio value="unpaid">Unpaid</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default LeaveReport;
