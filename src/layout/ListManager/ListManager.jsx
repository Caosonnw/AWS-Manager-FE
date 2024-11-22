import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Avatar,
  Card,
  Progress,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { employeeServ } from '../../services/employeeServ';
import { projectServ } from '../../services/projectServ';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ListManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Hủy modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Xử lý khi submit form
  const handleFinish = async (values) => {
    const { projectName, dateRange, members } = values;

    if (!members || members.length === 0) {
      console.error('Members are required');
      return;
    }

    const newProject = {
      project_name: projectName,
      start_date: dateRange[0].toDate(),
      end_date: dateRange[1].toDate(),
      assignedMembers: members, // API mới yêu cầu trường này
    };

    try {
      // Gọi API tạo project
      await projectServ.createProject(newProject);

      // Lấy danh sách project mới từ backend để cập nhật state
      const res = await projectServ.getAllProjects();
      setProjects(res.data); // Cập nhật lại danh sách project từ backend

      // Đóng modal và reset form
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  // Hàm tính toán số tháng giữa start_date và end_date
  const calculateMonths = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, 'months', true).toFixed(0); // Lấy số tháng với 1 chữ số thập phân
  };

  // Hàm tính toán số ngày còn lại
  const calculateDaysLeft = (endDate) => {
    const currentDate = moment();
    const end = moment(endDate);
    const daysLeft = end.diff(currentDate, 'days');
    return daysLeft > 0 ? `${daysLeft} Days Left` : 'Project Ended';
  };

  // Lấy danh sách project khi component được mount
  useEffect(() => {
    projectServ.getAllProjects().then((res) => {
      setProjects(res.data); // Lưu tất cả project vào state
    });

    // Lấy danh sách nhân viên khi component được mount
    employeeServ.getAllEmployees().then((res) => {
      setMembers(res.data.data);
    });
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`); // Điều hướng đến TaskManager với projectId
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        className="mb-4 py-5"
      >
        Create Project
      </Button>

      <div className="mt-6">
        <h3 className="font-bold mb-4">Current Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Render các project ở đây */}
          {projects.map((project) => (
            <Card
              key={project.project_id}
              title={<div className="text-center">{project.project_name}</div>}
              className="shadow-lg rounded-lg cursor-pointer"
              extra={
                <div className="flex space-x-2">
                  <Button icon={<EditOutlined />} />
                  <Button icon={<DeleteOutlined />} />
                </div>
              }
            >
              <div onClick={() => handleProjectClick(project.project_id)}>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <span className="flex items-center">
                    <i className="fa-solid fa-paperclip mr-2" />
                    10 Attach
                  </span>
                  <span className="flex items-center">
                    <i className="fa-regular fa-hourglass-half mr-2" />
                    {calculateMonths(project.start_date, project.end_date)}{' '}
                    Months
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-user-group mr-2" />
                    {project.Team_Members?.length || 0} Members
                  </span>
                </div>
                <div className="mt-4">
                  {project.Team_Members?.length > 0 ? (
                    <Avatar.Group>
                      {project.Team_Members.map((member, index) => (
                        <Avatar
                          key={index}
                          src={`http://localhost:8080/public/img/${member?.Employees?.avatar}`}
                          alt={member?.Employees?.full_name}
                        />
                      ))}
                    </Avatar.Group>
                  ) : (
                    <span>No members yet</span>
                  )}
                </div>
                <div className="mt-4">
                  <h4 className="small font-bold mb-2">Progress</h4>
                  <Progress
                    percent={project.progress || 0}
                    size="small"
                    status="active"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{calculateDaysLeft(project.end_date)}</span>
                    <Tag color="magenta">{project.project_name}</Tag>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title="Create New Project"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Project Duration"
            rules={[
              { required: true, message: 'Please select project duration' },
            ]}
          >
            <RangePicker disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            name="members"
            label="Members"
            rules={[{ required: true, message: 'Please select members' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select members"
              className="w-full"
              optionLabelProp="label"
            >
              {members.map((member) => (
                <Option
                  key={member.employee_id}
                  value={member.employee_id} // Gửi ID của nhân viên
                  label={member.full_name}
                >
                  <div className="flex items-center">
                    <Avatar
                      src={`http://localhost:8080/public/img/${member.avatar}`}
                      alt={member.full_name}
                      className="mr-2"
                    />
                    {member.full_name}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListManager;
