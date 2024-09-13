import { Avatar, Button, Card } from 'antd';
import React from 'react';

const BirthdayCard = () => {
  return (
    <Card title="Birthday Today" className="birthday-card mt-2">
      <div className="flex gap-4 items-center">
        <Avatar
          shape="square"
          size={78}
          src="https://i.pravatar.cc/150?img=68"
        />
        <div className="flex flex-col">
          <div className="flex flex-col text-[15px]">
            <p className="text-gray-500">Hôm nay là sinh nhật</p>
            <p className="font-bold">Hoàng Vũ</p>
          </div>
          <div>
            <Button
              className="bg-[#FF9900] text-white"
              icon={<i className="fa-solid fa-gift"></i>}
            >
              Gửi lời chúc
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BirthdayCard;
