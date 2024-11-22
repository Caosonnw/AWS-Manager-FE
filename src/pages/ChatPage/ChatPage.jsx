import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Input, Layout, Avatar } from 'antd';
import './ChatPage.scss';
import UserChat from '../../components/UserChat/UserChat';
import GroupChat from '../../components/GroupChat/GroupChat';
import { employeeServ } from '../../services/employeeServ';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { projectServ } from '../../services/projectServ';

const { TabPane } = Tabs;
const { Header, Sider, Content } = Layout;

const socket = io('http://localhost:8081');

const ChatPage = () => {
  const [user_id, setUserId] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dataChat, setDataChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef(null);

  console.log(selectedUser);

  // Lấy danh sách nhóm chat (Project)
  useEffect(() => {
    projectServ
      .getAllProjects()
      .then((res) => {
        const projects = res.data.map((project) => ({
          project_id: project.project_id,
          name: project.project_name,
          avatar: '/group-avatar.png',
        }));
        setRooms(projects);
      })
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  // Lấy danh sách người dùng
  useEffect(() => {
    employeeServ
      .getAllEmployees()
      .then((res) => setAllUser(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.employee_id);
    }

    socket.on('load-chat', (lstChat) => setDataChat(lstChat));
    socket.on('mess-server', (data) =>
      setDataChat((prevData) => [...prevData, data])
    );
    socket.on('group-message', (message) => {
      setDataChat((prevData) => [...prevData, message]);
    });
  }, []);

  const handleChatSelect = (chat, isGroup = false) => {
    if (isGroup) {
      setSelectedRoom(chat);
      setSelectedUser(null);
      socket.emit('join-group', chat.project_id);
    } else {
      setSelectedUser(chat);
      setSelectedRoom(null);
      const roomId =
        user_id < chat.employee_id
          ? `${user_id}-${chat.employee_id}`
          : `${chat.employee_id}-${user_id}`;
      socket.emit('join-room', roomId);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (selectedRoom) {
      // Gửi tin nhắn nhóm
      socket.emit('group-message', {
        projectId: selectedRoom.project_id,
        content: newMessage,
        senderId: user_id,
      });
    } else if (selectedUser) {
      // Gửi tin nhắn cá nhân
      const roomId =
        user_id < selectedUser.employee_id
          ? `${user_id}-${selectedUser.employee_id}`
          : `${selectedUser.employee_id}-${user_id}`;
      socket.emit('send-mess', { roomId, user_id, content: newMessage });
    }

    setNewMessage('');
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [dataChat]);

  return (
    <Layout style={{ height: '100vh' }} className="chat">
      <Sider width={330} className="chat-sidebar">
        <Tabs defaultActiveKey="1" className="chat-tabs">
          <TabPane tab="Group Project Chat" key="1">
            <GroupChat
              rooms={rooms}
              handleChatSelect={(chat) => handleChatSelect(chat, true)}
            />
          </TabPane>
          <TabPane tab="User Chat" key="2">
            <UserChat
              allUser={allUser}
              onSelectUser={(chat) => handleChatSelect(chat)}
            />
          </TabPane>
        </Tabs>
      </Sider>
      <Layout style={{ height: '84vh' }}>
        <Header className="bg-gray-100 p-4 flex items-center">
          {selectedRoom ? (
            <>
              <Avatar
                size="large"
                src={'/img/Amazon-Web-Services-AWS-Logo.png'}
              />
              <span className="ml-4 text-lg font-bold">
                {selectedRoom.name}
              </span>
            </>
          ) : selectedUser ? (
            <>
              <Avatar
                size="large"
                src={
                  selectedUser.avatar
                    ? `http://localhost:8080/public/img/${selectedUser?.avatar}`
                    : '/default-avatar.png'
                }
              />
              <span className="ml-4 text-lg font-bold">
                {selectedUser.full_name}
              </span>
            </>
          ) : (
            <span>Please select a chat</span>
          )}
        </Header>
        <Content className="p-4 flex flex-col justify-between">
          <div
            className="chat-messages bg-white p-4 mb-4 h-full border rounded overflow-y-auto"
            ref={chatBoxRef}
          >
            {dataChat.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  (chat.sender_id || chat.employee_id) === user_id
                    ? 'justify-end'
                    : 'justify-start'
                } items-center mb-4`}
              >
                {(chat.sender_id || chat.employee_id) !== user_id && (
                  <Avatar
                    size="small"
                    src={
                      chat.Employees?.avatar
                        ? `http://localhost:8080/public/img/${chat.Employees.avatar}`
                        : '/default-avatar.png'
                    }
                    className="mr-2"
                  />
                )}
                <div
                  className={`p-3 rounded-lg ${
                    (chat.sender_id || chat.employee_id) === user_id
                      ? 'bg-[#ff9900] text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
          </div>

          <div>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
              className="py-5"
              placeholder="Type your message here..."
            />
            <button
              onClick={sendMessage}
              className="mt-2 w-full bg-[#ff9900] text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
