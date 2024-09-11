import React, { useState } from 'react';
import moment from 'moment';
import { Button, Card } from 'antd';

const PersonalSchedule = () => {
  // Get today's date using moment
  const today = moment().format('DD');
  const days = [
    { day: '03', month: 'Th12' },
    { day: '04', month: 'Th12' },
    { day: '05', month: 'Th12' },
    { day: '06', month: 'Th12' },
  ];

  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <Card title="Personal Calendar" className="personal-schedule">
      {/* Date selection buttons */}
      <div className="schedule-date mb-4 flex space-x-2">
        {days.map((date) => (
          <Button
            key={date.day}
            type={selectedDate === date.day ? 'primary' : 'default'}
            className={today === date.day ? 'highlighted' : ''}
            onClick={() => setSelectedDate(date.day)}
          >
            {`${date.month} ${date.day}`}
          </Button>
        ))}
      </div>

      {/* Schedule details */}
      <div className="schedule-details">
        <p>
          <strong>Thiết kế giao diện Web Portal</strong>
        </p>
        <p>Người giao: Đặng Vũ</p>
        <p>
          <strong>Seminar</strong>
        </p>
        <p>Lầu G, chia sẻ về cuộc đời</p>
        <p>10:00AM - 11:30AM</p>
        <p>
          <strong>Phỏng vấn</strong>
        </p>
        <p>Lầu 4, ứng viên Front-End</p>
        <p>09:00AM - 10:30AM</p>
      </div>
    </Card>
  );
};

export default PersonalSchedule;
