

// export default EmployeeReport;
import React, { useEffect, useState } from "react";
import { Table, Input, DatePicker, Space, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Search } = Input;
// const { RangePicker } = DatePicker;

const EmployeeReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  // Fetch report data
  const fetchReport = async (employeeName = "") => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      const res = await axios.get(
        "http://localhost:5000/api/attendances/employee-report",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { employeeName, startDate, endDate },
        }
      );

      setData(res.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(); // load initial data
  }, [dateRange]);

  const onSearch = (value) => {
    fetchReport(value);
  };
  const formatHours = (decimalHours) => {
    if (!decimalHours) return "0 h 0 m";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h  ${minutes}m`;
  };


  const columns = [
     { title: "Employee ID", dataIndex: "employee_id", key: "employee_id" },
    { title: "Employee Name", dataIndex: "employee_name", key: "employee_name" },
    { title: "Total Working Days", dataIndex: "total_working_days", key: "total_working_days" },
    { title: "Total Leaves", dataIndex: "total_leaves", key: "total_leaves" },
    {
      title: "Total Working Hours", dataIndex: "total_working_hours", key: "total_working_hours",
      render: (value) => formatHours(value) // fromat HH:MM
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-center fw-semibold" style={{ color: "#386641" }}>Employee Report</h2>

      {/* Search + Date Filter */}
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Search employee by name"
          onSearch={onSearch}
          enterButton
          style={{ width: 300 }}
        />
        {/* <RangePicker
          value={dateRange}
          onChange={(values) => setDateRange(values)}
          format="YYYY-MM-DD"
        />
        <Button type="primary" onClick={() => fetchReport()}>Filter</Button> */}
      </Space>

      {/* Table */}
      <Table style={{ textAlign: "center" }}
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
     

      <Button type="primary"
       onClick={async ()=>{
        const token = localStorage.getItem('token');
        try{
          const res = await axios.get("http://localhost:5000/api/attendances/employee-report/export",{
            headers: { Authorization: `Bearer ${token}`},
            responseType: 'blob', // import for excel files
          });

          //Create a URL for the blob
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'employee_report.xlsx'); //file name
          document.body.appendChild(link);
          link.click();
          link.remove();

        }catch(error){
          console.log("Error exporting report:", error);
        }
       }}
      >
        Export to Excel 
      </Button>
    </div>
  );
};

export default EmployeeReport;

