import React from 'react';
import { List, Avatar } from 'antd';

const UserChat = ({ allUser, onSelectUser }) => (
  <List
    itemLayout="horizontal"
    dataSource={allUser}
    renderItem={(user) => (
      <List.Item className="chat-item" onClick={() => onSelectUser(user)}>
        <List.Item.Meta
          avatar={
            <Avatar
              size="large"
              src={
                user.avatar
                  ? `http://localhost:8080/public/img/${user.avatar}`
                  : '/default-avatar.png'
              }
            />
          }
          title={<span className="font-bold">{user.full_name}</span>}
          description={<span className="text-gray-500">{user.email}</span>}
        />
      </List.Item>
    )}
  />
);

export default UserChat;
