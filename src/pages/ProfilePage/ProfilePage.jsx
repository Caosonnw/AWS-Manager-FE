import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List, Progress, Table, Tag } from 'antd';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { employeeServ } from '../../services/employeeServ';
import { httpImage } from '../../services/config';
import moment from 'moment';

const ProfilePage = () => {
  const [userLogin, setUserLogin] = useState();

  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    if (token) {
      const userID = jwtDecode(token);

      employeeServ
        .getEmployeeById(userID.employee_id)
        .then((res) => {
          setUserLogin(res.data.data);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
        });
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <Card
            title="Personal Information"
            className="shadow-lg rounded-lg"
            extra={
              <div className="flex space-x-2">
                <Button icon={<EditOutlined />} />
              </div>
            }
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="text-center md:w-1/3 border-r-[1px]">
                <Avatar
                  size={150}
                  src={httpImage.defaults.baseURL + userLogin?.avatar}
                  className="mx-auto"
                />
              </div>
              <div className="md:w-2/3 md:pl-6">
                <h6 className="text-lg font-bold"> {userLogin?.full_name}</h6>
                <span className="text-sm font-semibold text-gray-700">
                  Software Engineer
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  The purpose of lorem ipsum is to create a natural looking
                  block of text that doesn't distract from the layout. A
                  practice not without controversy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center text-sm">
                    <i className="fa-solid fa-mobile-screen-button mr-2" />
                    <span>{userLogin?.phone_number}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fa-solid fa-envelope mr-2" />
                    <span>{userLogin?.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fa-solid fa-cake-candles mr-2" />
                    <span>
                      {moment(userLogin?.date_of_birth).format('YYYY-MM-DD')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fa-brands fa-aws mr-2" />
                    <span>
                      {moment(userLogin?.hire_date).format('Do MMMM YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Project Section */}
          <div className="mt-6">
            <h3 className="font-bold mb-4">Current Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project 1 */}
              <Card
                title={<div className="text-center">Social Geek Made</div>}
                className="shadow-lg rounded-lg"
                extra={
                  <div className="flex space-x-2">
                    <Button icon={<EditOutlined />} />
                    <Button icon={<DeleteOutlined />} />
                  </div>
                }
              >
                <h6 className="font-bold">UI/UX Design</h6>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <span className="flex items-center">
                    <i className="fa-solid fa-paperclip mr-2" /> Attach
                  </span>
                  <span className="flex items-center">
                    <i className="fa-regular fa-hourglass-half mr-2" /> 4 Months
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-user-group mr-2" /> 5 Members
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-message mr-2" /> 10
                  </span>
                </div>
                <div className="mt-4">
                  <Avatar.Group>
                    <Avatar src="https://i.pravatar.cc/150?img=1" />
                    <Avatar src="https://i.pravatar.cc/150?img=2" />
                    <Avatar src="https://i.pravatar.cc/150?img=3" />
                  </Avatar.Group>
                </div>
                <div className="mt-4">
                  <h4 className="small font-bold mb-2">Progress</h4>
                  <Progress percent={60} size="small" status="active" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>35 Days Left</span>
                    <Tag color="magenta">Social Geek Made</Tag>
                  </div>
                </div>
              </Card>

              {/* Project 2 */}
              <Card
                title={<div className="text-center">Practice to Perfect</div>}
                className="shadow-lg rounded-lg"
                extra={
                  <div className="flex space-x-2">
                    <Button icon={<EditOutlined />} />
                    <Button icon={<DeleteOutlined />} />
                  </div>
                }
              >
                <h6 className="font-bold">Website Design</h6>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <span className="flex items-center">
                    <i className="fa-solid fa-paperclip mr-2" /> 5 Attach
                  </span>
                  <span className="flex items-center">
                    <i className="fa-regular fa-hourglass-half mr-2" /> 4 Months
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-user-group mr-2" /> 5 Members
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-message mr-2" /> 10
                  </span>
                </div>
                <div className="mt-4">
                  <Avatar.Group>
                    <Avatar src="https://i.pravatar.cc/150?img=1" />
                    <Avatar src="https://i.pravatar.cc/150?img=2" />
                    <Avatar src="https://i.pravatar.cc/150?img=3" />
                  </Avatar.Group>
                </div>
                <div className="mt-4">
                  <h4 className="small font-bold mb-2">Progress</h4>
                  <Progress percent={45} size="small" status="active" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>45 Days Left</span>
                    <Tag color="cyan">Practice to Perfect</Tag>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Table for Project Details */}
          <div className="mt-6">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </div>

        {/* Task Section */}
        <div>
          <Card title="Task" className="shadow-lg rounded-lg">
            <List
              itemLayout="horizontal"
              dataSource={tasks}
              renderItem={(task, idx) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between items-center">
                        {/* Task Title */}
                        <div className="flex flex-col">
                          <h6 className="font-bold">{task.title}</h6>
                          <Avatar.Group max={{ count: 4 }}>
                            <Avatar src="https://i.pravatar.cc/150?img=1" />
                            <Avatar src="https://i.pravatar.cc/150?img=2" />
                            <Avatar src="https://i.pravatar.cc/150?img=3" />
                            <Avatar src="https://i.pravatar.cc/150?img=4" />
                            <Avatar src="https://i.pravatar.cc/150?img=5" />
                          </Avatar.Group>
                        </div>
                        {/* Task Status */}
                        <Tag color={task.statusColor}>{task.status}</Tag>
                      </div>
                    }
                    description={
                      <>
                        <p className="text-sm text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. In id nec scelerisque massa.
                        </p>
                        <div className="text-right">
                          <Tag color="magenta">Social Geek Made</Tag>
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

const tasks = [
  {
    title: 'UI/UX Design',
    status: 'Inprogress',
    statusColor: 'yellow',
    members: [56, 14],
  },
  {
    title: 'Website Design',
    status: 'Review',
    statusColor: 'red',
    members: [7],
  },
  {
    title: 'Quality Assurance',
    status: 'Completed',
    statusColor: 'green',
    members: [24, 32],
  },
  {
    title: 'UI/UX Design',
    status: 'Inprogress',
    statusColor: 'yellow',
    members: [2, 9],
  },
];

const columns = [
  { title: 'NO', dataIndex: 'no', key: 'no' },
  { title: 'PROJECT', dataIndex: 'project', key: 'project' },
  { title: 'START DATE', dataIndex: 'startDate', key: 'startDate' },
  { title: 'END DATE', dataIndex: 'endDate', key: 'endDate' },
  { title: 'AMOUNT', dataIndex: 'amount', key: 'amount' },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'Pending' ? 'yellow' : 'green'}>{status}</Tag>
    ),
  },
];

const dataSource = [
  {
    no: '#00011',
    project: 'Social Geek Made',
    startDate: '10-01-2021',
    endDate: '12-04-2021',
    amount: '$3250',
    status: 'Pending',
  },
  {
    no: '#00002',
    project: 'Practice to Perfect',
    startDate: '12-02-2021',
    endDate: '15-05-2021',
    amount: '$1578',
    status: 'Paid',
  },
];
