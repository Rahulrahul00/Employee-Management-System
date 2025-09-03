import React from 'react'
import '../report/report.css'
import { FaCalendarAlt, FaCheckCircle, FaUsers} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Report = () => {
    const navigate = useNavigate();
    return (
        <div className='container'>
            <header className='headName'>
                <h1 className='hname'>Company Reports</h1>
                <p className='subtitle'>Access comprehensive reports for attendance and employee management</p>
            </header>

            <div className='cards-containerr'>
                <div className='cardss'>
                    <div className='card-headerss attendance-header '>
                        <div className='card-icon'>
                            <FaCalendarAlt />
                        </div>
                        <h2 className='text-white fw-semibold'>Attendance Report</h2>
                    </div>
                    <div className='card-body'>
                        <p className='card-description'>Track and analyze employee attendance patterns, punctuality, and leave history with detailed visual reports</p>
                        <div className='features'>
                            <div className='feature'>
                                <FaCheckCircle className='icon' />
                                <span className='list'>Daily attendance tracking</span>
                            </div>
                            <div className='feature' >
                                <FaCheckCircle className='icon'/>
                                <span className='list'>Leave and absence reports</span>
                            </div>
                            <div className='feature'>
                                <FaCheckCircle className='icon' />
                                <span className='list'>Leave and absence reports</span>
                            </div>
                            <div class="feature">
                                <FaCheckCircle className='icon'/>
                                <span className='list'>Punctuality analytics</span>
                            </div>



                        </div>
                        <div className='text-center'>
                            <button className='btnn' onClick={()=>navigate('/')}>View Attendance Reports</button>
                        </div>
                         
                    </div>


                </div>

                <div className='cardss'>
                    <div className='card-headerss eattendance-header '>
                        <div className='card-icon'>
                            <FaUsers />
                        </div>
                        <h2 className='text-white fw-semibold'>Employee Report</h2>
                    </div>
                    <div className='card-body'>
                        <p className='card-description'>Track and analyze employee attendance patterns, punctuality, and leave history with detailed visual reports</p>
                        <div className='features'>
                            <div className='feature'>
                                <FaCheckCircle className='eicon' />
                                <span className='list'>Daily attendance tracking</span>
                            </div>
                            <div className='feature' >
                                <FaCheckCircle className='eicon'/>
                                <span className='list'>Leave and absence reports</span>
                            </div>
                            <div className='feature'>
                                <FaCheckCircle className='eicon' />
                                <span className='list'>Leave and absence reports</span>
                            </div>
                            <div class="feature">
                                <FaCheckCircle className='eicon'/>
                                <span className='list'>Punctuality analytics</span>
                            </div>



                        </div>
                        <div className='text-center'>
                            <button className='ebtnn' onClick={()=>navigate('/employeereport')}>View Employee Reports</button>
                        </div>
                         
                    </div>
                    

                </div>

            </div>
        </div>
    )
}

export default Report
