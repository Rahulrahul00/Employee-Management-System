

// export default EmployeeReport;
import React, { useEffect, useState } from "react";
import { Table, Input, DatePicker, Dropdown, Space, Button, } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload } from "react-icons/fa";


const { Search } = Input;
// const { RangePicker } = DatePicker;

const EmployeeReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })

  // Fetch report data
  const fetchReport = async (employeeName = "", page = pagination.current, pageSize = pagination.pageSize) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      const res = await axios.get(
        "http://localhost:5000/api/attendances/employee-report",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { employeeName, startDate, endDate, page, pageSize },
        }
      );
     console.log(res.data)
      //backend should return { rows: [...], total: number }
      setData(res.data.data);
      setPagination({
        ...pagination,
        current: res.data.pagination.current,
        pageSize: res.data.pagination.pageSize,
        total: res.data.pagination.total,

      })
      // console.log(res.data)
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
    fetchReport(value, 1, pagination.pageSize);//reset to first page on search
  };
  const formatHours = (decimalHours) => {
    if (!decimalHours) return "0 h 0 m";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h  ${minutes}m`;
  };

  //Export pdf formatte
  const exportPDF = () => {
    const doc = new jsPDF();

    //title
    doc.setFontSize(16);
    doc.text('Employee Report', 14, 15)

    //Table heading
    const tableColumn = ["Employee Name", "Total Working Days", "Total Leaves", "Total Working Hours"]
    const tableRows = [];

    data.forEach((row) => {
      const rowData = [
        row.employee_name,
        row.total_working_days,
        row.total_leaves,
        formatHours(row.total_working_days),
      ];
      tableRows.push(rowData)
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });
    doc.save('employee_report.pdf');
  }


  const columns = [
    { title: "SL No", key: "slno", render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, align: "center" },
    { title: "Employee Name", dataIndex: "employee_name", key: "employee_name", align: "center" },
    { title: "Total Working Days", dataIndex: "total_working_days", key: "total_working_days", align: "center" },
    { title: " Total Present", dataIndex: "total_present", key: "total_present", align: "center" },
    { title: " Total Absent", dataIndex: "total_absent", key: "total_absent", align: "center" },
    { title: "Total Leaves", dataIndex: "total_leaves", key: "total_leaves", align: "center" },
    { title: " Total Active days", dataIndex: "total_active_days", key: "total_active_days", align: "center" },

    {
      title: "Total Working Hours", dataIndex: "total_working_hours", key: "total_working_hours",
      render: (value) => formatHours(value), // formatt HH:MM
      align: "center"
    },
    { title: " Average working Hours", dataIndex: "average_working_hours", key: "average_working_hours", align: "center" },

  ];

  const items = [
    {
      key: "1",
      label: (
        <div onClick={async () => {
          const token = localStorage.getItem('token');
          try {
            const res = await axios.get("http://localhost:5000/api/attendances/employee-report/export", {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employee_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (error) {
            console.log("Error exporting report:", error);
          }
        }}>
          Export to Excel
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={exportPDF}>
          Export to PDF
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <h2 className="text-center m-3 fw-semibold" style={{ color: "#386641" }}>Employee Attendance Report</h2>


      {/* Search + Date Filter */}
      <Space style={{ marginBottom: 20, width: '100%' }}>
        <Search
          placeholder="Search employee by name"
          onSearch={onSearch}
          enterButton
          style={{ width: 300 }}
        />
        {/* <div className="d-flex justify-content-end" style={{ position: 'absolute', right: '2rem', top: '5rem' }}>
           <FaDownload className="fs-4"/> 
          <Button className="" type="primary"
            onClick={async () => {
              const token = localStorage.getItem('token');
              try {
                const res = await axios.get("http://localhost:5000/api/attendances/employee-report/export", {
                  headers: { Authorization: `Bearer ${token}` },
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

              } catch (error) {
                console.log("Error exporting report:", error);
              }
            }}
          >
            Export to Excel
          </Button>
          <Button danger onClick={exportPDF}>
            Export to PDF
          </Button>
        </div> */}
        <div className="d-flex justify-content-end" style={{ position: 'absolute', right: '2rem', top: '5rem' }}>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button icon={<FaDownload className="fs-5" />}>Export</Button>
          </Dropdown>
        </div>


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
        // pagination={{ pageSize: 5 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchReport("", page, pageSize),
        }}
      />


    </div>
  );
};

export default EmployeeReport;

