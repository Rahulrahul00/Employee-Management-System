import React, { useState } from 'react';
import { Form, Table, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AttendanceReport = () => {

    const [report, setReport] = useState([]);
    const [dates, setDates] = useState({
        startDate: "",
        endDate: "",
    });
    const navigate = useNavigate();
    const [showSummary, setShowSummary] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");

    }

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const date = new Date(`2000-01-01T${timeString}`);
        return date.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    //Calculate total hours
    const calculateHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "N/A";
        const start = new Date(`2000-01-01T${checkIn}`);
        const end = new Date(`2000-01-01T${checkOut}`);


        // if(diffMs <= 0) return 'N/A';
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }
        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    //Employe summary
    // Convert "xh ym" -> total minutes
    const parseWorkedTime = (timeStr) => {
        if (!timeStr || timeStr === "N/A") return 0;
        const [h, m] = timeStr.split(/[hm ]+/).filter(Boolean);
        return (parseInt(h) * 60) + (parseInt(m) || 0);
        
    };
    

    // Build employee-wise summary
    const getEmployeeSummary = () => {
        const summary = {};

        report.forEach((rec) => {
            const emp = rec.employee_name;
            if (!summary[emp]) {
                summary[emp] = { totalDays: 0, totalLeave: 0, totalMinutes: 0 };
            }

            if (rec.status === "present") {
                summary[emp].totalDays += 1;
                const worked = calculateHours(rec.check_in, rec.check_out);
                summary[emp].totalMinutes += parseWorkedTime(worked);
            } else if (rec.status === "absent") {
                summary[emp].totalLeave += 1;
            }
        });

        // Convert minutes → hh:mm
        Object.keys(summary).forEach(emp => {
            const mins = summary[emp].totalMinutes;
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            summary[emp].totalHours = `${hours}h ${minutes}m`;
        });

        return summary;
    };



    const fetchReport = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/attendances/report', {
                headers: { Authorization: `Bearer ${token}` },
                params: { startDate: dates.startDate, endDate: dates.endDate },

            });
            setReport(res.data);
            console.log(res.data);
        } catch (error) {
            toast.error("Failed to fetch report");
        }
    }
    return (
        <div className='container my-5'>
            <div className='card shadow'>
                <div className='card-body'>
                    <h4 className='mb-4 text-center' style={{color:'#003049', fontSize:'1.8rem'}}>Employee Attendance Log</h4>
                    <div className='d-flex justify-content-end '>
                        <Button onClick={()=>navigate('/employeereport')} className='bg-black'>Employee Report</Button>
                    </div>
                    

                    {/* Date filter */}
                    <div className='d-flex gap-2 mb-3 align-items-center'>
                        <Form.Control
                            type='date'
                            size='sm'
                            style={{ maxWidth: "150px" }}
                            value={dates.startDate}
                            onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                            className="border border-dark shadow-sm"
                        />
                        <Form.Control
                            type='date'
                            size='sm'
                            style={{ maxWidth: "150px" }}
                            value={dates.endDate}
                            onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                            className="border border-dark shadow-sm"
                        />
                        {/* <button onClick={fetchReport}>Filter</button> */}
                        <button
                            onClick={fetchReport}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "#217f8b",
                                color: "white",
                                fontWeight: 600,
                                padding: "4px 8px",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            <FaFilter />
                            Filter
                        </button>
                    </div>
                    {/* Report Table */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Employee</th>
                                <th className='text-center'>Status</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Total Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.length === 0 ? (
                                <tr>
                                    <td colSpan='6' className='text-center'>No records found</td>
                                </tr>
                            ) : (

                                report.map((rec) => (
                                    <tr key={rec.id}>
                                        <td>{formatDate(rec.date)}</td>
                                        <td>{rec.employee_name}</td>
                                        <td className="text-center">
                                            <Badge bg={rec.status === "present" ? "success" : rec.status === "absent" ? "danger" : "warning"}>
                                                {rec.status}
                                            </Badge>
                                        </td>
                                        <td>{formatTime(rec.check_in)}</td>
                                        <td>{formatTime(rec.check_out)}</td>
                                        <td>{calculateHours(rec.check_in, rec.check_out)}</td>
                                    </tr>
                                ))

                            )}
                        </tbody>
                    </Table>

                    {/* Button to toggle summary */}
                    {/* <Button onClick={() => setShowSummary(!showSummary)} className="mt-3">
                        {showSummary ? "Hide Summary" : "Show Summary"}
                    </Button> */}

                    {/* Employee Summary Table */}
                    {
                    //     showSummary && (
                    //         <>
                    //             <h5 className="mt-5">Employee Summary</h5>
                    //             <Table striped bordered hover>
                    //     <thead>
                    //         <tr>
                    //             <th className='text-center'>Employee</th>
                    //             <th className='text-center'>Total Working Days</th>
                    //             <th className='text-center'>Total Leaves</th>
                    //             <th className='text-center'>Total Hours</th>
                    //         </tr>
                    //     </thead>
                    //     <tbody>
                    //         {Object.entries(getEmployeeSummary()).map(([emp, data]) => (
                    //             <tr key={emp}>
                    //                 <td className='text-center'>{emp}</td>
                    //                 <td className='text-center'>{data.totalDays}</td>
                    //                 <td className='text-center'>{data.totalLeave}</td>
                    //                 <td className='text-center'>{data.totalHours}</td>
                    //             </tr>
                    //         ))}
                    //     </tbody>
                    // </Table>

                    //         </>
                    //     )
                    }
                    


                </div>

            </div>

        </div>
    )
}

export default AttendanceReport
