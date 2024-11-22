import React from 'react';
import { Calendar, Badge } from 'antd';
import moment from 'moment';

const attendanceData = [
  { date: '2024-10-04', type: 'overtime' },
  { date: '2024-10-05', type: 'off' },
  { date: '2024-10-07', type: 'overtime' },
  { date: '2024-10-11', type: 'work' },
  { date: '2024-10-12', type: 'work' },
  { date: '2024-10-19', type: 'meeting' },
  { date: '2024-10-29', type: 'holiday' },
];

const getAttendanceType = (date) => {
  const formattedDate = date.format('YYYY-MM-DD');
  const dayData = attendanceData.find((item) => item.date === formattedDate);
  return dayData ? dayData.type : null;
};

const renderDateCell = (date) => {
  const type = getAttendanceType(date);
  if (type) {
    switch (type) {
      case 'overtime':
        return <Badge status="error" text="Tăng ca" />;
      case 'work':
        return <Badge status="success" text="Đi làm" />;
      case 'off':
        return <Badge status="warning" text="Nghỉ phép" />;
      case 'holiday':
        return <Badge status="default" text="Nghỉ lễ" />;
      case 'meeting':
        return <Badge status="processing" text="Công tác" />;
      default:
        return null;
    }
  }
  return null;
};

const AttendanceCalendar = () => {
  return (
    <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">
        Time Attendance Calendar - Monthly Work Period
      </h1>
      <Calendar
        dateCellRender={renderDateCell}
        headerRender={({ value, onChange }) => {
          const currentMonth = value.month();
          const formattedMonth = moment()
            .month(currentMonth)
            .format('MMMM YYYY');

          return (
            <div className="text-center">
              <h3 className="font-semibold text-lg">{formattedMonth}</h3>
            </div>
          );
        }}
      />
    </div>
  );
};

export default AttendanceCalendar;
