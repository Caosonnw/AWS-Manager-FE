import React, { useEffect, useState } from 'react';
import { Table, Avatar, Button } from 'antd';
import { employeeServ } from '../../services/employeeServ';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UserManagement = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    employeeServ
      .getAllEmployees()
      .then((res) => {
        setUserList(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleEdit = (record) => {
    // console.log('Edit:', record);
    // Xử lý logic chỉnh sửa
  };

  const handleDelete = (record) => {
    // console.log('Delete:', record);
    // Xử lý logic xóa
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => (
        <Avatar src={`http://localhost:8080/public/img/${text}`} size="large" />
      ),
      className: 'text-center',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      className: 'text-left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'text-left',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (dateOfBirth) =>
        new Date(dateOfBirth).toLocaleDateString('vi-VN'),
      className: 'text-left',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      className: 'text-left',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
        {
          text: 'Manager',
          value: 'MANAGER',
        },
        {
          text: 'Developer',
          value: 'DEVELOPER',
        },
        {
          text: 'Tester',
          value: 'TESTER',
        },
        {
          text: 'Designer',
          value: 'DESIGNER',
        },
        {
          text: 'HR',
          value: 'HR',
        },
      ],
      onFilter: (value, record) => record.role === value,
      className: 'text-left',
    },
    {
      title: 'Hire Date',
      dataIndex: 'hire_date',
      key: 'hire_date',
      render: (hireDate) => new Date(hireDate).toLocaleDateString('vi-VN'),
      className: 'text-left',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) =>
        salary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      className: 'text-right',
    },
    {
      title: 'Chức năng',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="danger"
            className="bg-red-500 text-white"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </div>
      ),
      className: 'text-center',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
      <Table
        columns={columns}
        dataSource={userList}
        rowKey="employee_id"
        bordered
        pagination={{ pageSize: 10 }}
        className="shadow-lg bg-white rounded"
      />
    </div>
  );
};

export default UserManagement;
