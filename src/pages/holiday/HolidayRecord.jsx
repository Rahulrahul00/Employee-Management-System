import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';

const { Option } = Select;


const HolidayRecord = () => {

  const [holiday, setHoliday] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchHolidays = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/holidayreport');
      setHoliday(res.data);
      console.log(res.data);

    } catch (error) {
      message.error('Failed to fetch holidays')
    }
  };

  useEffect(() => {
    fetchHolidays()
  }, [])
  // Table columns
  const columns = [
    {
      title: 'Date', dataIndex: 'date', key: 'date', align: 'center',
      render: (date) => dayjs(date).format("DD-MM-YYYY")
    },
    { title: 'Holiday Name', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Type', dataIndex: 'type', align: 'center',
      render: (type) => {
        let color = "blue";
        if (type === "Weekend") color = "orange";
        if (type === "Special") color = "green";
        if (type === "Other") color = "purple";

        const label = type === "Special" ? "Special Holiday" : type;
        return <Tag color={color}>{label}</Tag>;
      }

    }
  ]

  //open modal
  const showModal = () => setIsModalOpen(true);

  //close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  }

  //Handle form submit
  const handleAddHoliday = async (values) => {
    const newHoliday = {
      date: values.date.format('YYYY-MM-DD'),
      name: values.name,
      type: values.type,
    };

    try {
      await axios.post('http://localhost:5000/api/holidayreport', newHoliday);
      toast.success("Holiday added successfully!");
      fetchHolidays();
      handleCancel();

    } catch (error) {
      console.log("Backend error response:", error.response?.data);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error || "Duplicate date not allowed");
      } else {
        toast.error("Failed to add holiday");
      }
    }
    // setHoliday([...holiday, newHoliday]);
    // message.success("Holiday added successfull!");
    // handleCancel();
  }

  return (
    <div>
      <h3 className='text-center m-3' style={{ color: "#fb4b28ff" }}>Holiday Records</h3>
      <div>

      </div>

      <div className='text-end'>
        <Button onClick={showModal} style={{ marginRight: '8rem', marginBottom: '0.01rem' }}>Add Holiday</Button>
      </div>

      <h5 className='' style={{ color: "#933333ff", marginLeft: '8rem' }}>Holiday List</h5>
      <Table
        dataSource={holiday}
        columns={columns}
        rowKey='id'
        pagination={{ pageSize: 6 }}
        size='small'
        bordered={true}
        style={{ width: '80%', margin: '0 auto' }}

      />
      <Modal
        title='Add Holiday'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}>

        <Form form={form} layout="vertical" onFinish={handleAddHoliday}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Holiday Name"
            name="name"
            rules={[{ required: true, message: "Please enter holiday name" }]}
          >
            {/* <Input placeholder="Enter holiday name" /> */}
            <Select
              placeholder='Enter holiday name'
              mode='tags'
              option={[
                {value: "Sunday", label:"Sunday"},
                {value: "Saturday", label:"Saturday"},


              ]}
            >
              <Select.Option value="Sunday">Sunday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>

            </Select>
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select placeholder="Select type">
              <Option value="Weekend">Weekend</Option>
              <Option value="Special">Special Holiday</Option>

            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: "1rem" }}>
              Add
            </Button>
            <Button onClick={handleCancel} >Cancel</Button>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}

export default HolidayRecord
