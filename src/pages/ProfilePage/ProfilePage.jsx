import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  List,
  Modal,
  Progress,
  Table,
  Tag,
  Upload,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { httpImage } from '../../services/config';
import { employeeServ } from '../../services/employeeServ';
import * as faceapi from 'face-api.js';
import { timekeepingServ } from '../../services/timekeepingServ';
import { useAlert } from '../../utils/AlertContext/AlertContext';

const ProfilePage = () => {
  const showAlert = useAlert();
  const [userLogin, setUserLogin] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const videoRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

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

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setIsModelLoaded(true);
      } catch (err) {
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleVideoPlay = async () => {
    setInitializing(false);

    const id = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        const body = {
          employee_id: userLogin?.employee_id,
          embeddings: detections.descriptor,
        };

        timekeepingServ
          .registerFace(body)
          .then((res) => {
            showAlert(res.data.message, 'success');
            clearInterval(id);
            stopVideo();
            setOpen(false);
          })
          .catch((err) => {
            showAlert(
              err.response?.data?.message || 'Error registering face',
              'error'
            );
          });
      } else {
        showAlert('No face detected', 'error');
      }
    }, 1000);

    setIntervalId(id);
  };

  const showModal = () => {
    setModalText('Đang tải model, vui lòng đợi...');

    if (isModelLoaded) {
      setModalText('Model đã tải xong, bạn có thể đăng ký khuôn mặt.');
      setOpen(true);
      startVideo();
    } else {
      showAlert('Models are still loading. Please wait...', 'error');
    }
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
    stopVideo();
    clearInterval(intervalId);
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  // Xử lý file upload
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      showAlert('Please select an image to upload.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', fileList[0].originFileObj);

    try {
      console.log('Uploading avatar...');
      const res = await employeeServ.uploadAvatar(
        userLogin.employee_id,
        formData
      );

      if (res.data && res.data.message === 'Upload avatar successfully') {
        showAlert('Avatar uploaded successfully', 'success');

        // Có thể cần load lại user data để cập nhật avatar mới
        setUserLogin({
          ...userLogin,
          avatar: res.data.data?.avatar || userLogin.avatar,
        });

        // Đóng modal và reset lại danh sách file sau khi upload thành công
        setIsModalVisible(false);
        setFileList([]);
      } else {
        showAlert('Failed to retrieve new avatar URL', 'error');
      }
    } catch (error) {
      showAlert('Failed to upload avatar', 'error');
    }
  };

  const handleAvatarModalCancel = () => {
    setIsModalVisible(false);
    setFileList([]); // Reset lại danh sách file khi đóng modal
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Personal Information"
            className="shadow-lg rounded-lg"
            extra={
              <div className="flex space-x-2">
                <Button icon={<EditOutlined />} />
                <Button icon={<UploadOutlined />} onClick={showModal} />
              </div>
            }
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="text-center md:w-1/3 border-r-[1px]">
                <Avatar
                  size={150}
                  src={httpImage.defaults.baseURL + userLogin?.avatar}
                  className="mx-auto cursor-pointer"
                  onClick={handleAvatarClick}
                />
              </div>
              <div className="md:w-2/3 md:pl-6">
                <h6 className="text-lg font-bold"> {userLogin?.full_name}</h6>
                <span className="text-sm font-semibold text-gray-700">
                  Software Engineer
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  Some description about the employee.
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

          <div className="mt-6">
            <h3 className="font-bold mb-4">Current Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="mt-6">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </div>

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
                        <Tag color={task.statusColor}>{task.status}</Tag>
                      </div>
                    }
                    description={
                      <>
                        <p className="text-sm text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
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

      <Modal
        title="Register Face"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        afterClose={stopVideo}
      >
        {modalText}
        {isModelLoaded ? (
          <>
            <h1>Đăng ký Khuôn mặt</h1>
            <video
              ref={videoRef}
              autoPlay
              muted
              width="720"
              height="560"
              onPlay={handleVideoPlay}
              style={{ display: 'block', transform: 'scaleX(-1)' }}
            />
          </>
        ) : (
          <p>Đang tải model, vui lòng đợi...</p>
        )}
      </Modal>

      {/* Modal để chọn và upload avatar */}
      <Modal
        title="Chọn ảnh đại diện mới"
        visible={isModalVisible}
        onCancel={handleAvatarModalCancel}
        footer={[
          <Button key="back" onClick={handleAvatarModalCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpload}>
            Tải lên
          </Button>,
        ]}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          accept="image/*"
          beforeUpload={() => false} // Ngăn Antd tự động upload
        >
          {fileList.length >= 1 ? null : '+ Upload'}
        </Upload>
      </Modal>
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
