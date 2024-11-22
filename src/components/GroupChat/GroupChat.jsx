import React from 'react';
import { List, Avatar } from 'antd';

const GroupChat = ({ rooms, handleChatSelect }) => (
  <List
    itemLayout="horizontal"
    dataSource={rooms}
    renderItem={(room) => (
      <List.Item className="chat-item" onClick={() => handleChatSelect(room)}>
        <List.Item.Meta
          avatar={
            <Avatar
              size="large"
              src={'/img/Amazon-Web-Services-AWS-Logo.png'}
            />
          }
          title={<span className="font-bold">{room.name}</span>}
        />
      </List.Item>
    )}
  />
);

export default GroupChat;
