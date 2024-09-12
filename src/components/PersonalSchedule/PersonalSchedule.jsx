import React, { useState, useEffect } from 'react';
import moment from 'moment';

const PersonalSchedule = () => {
  // State lưu danh sách ngày và lịch trình từ API (hiện tại là dữ liệu cứng)
  const [days, setDays] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  // Giả lập API call
  const fetchScheduleData = async () => {
    // Dữ liệu giả lập từ API, có thể thay thế sau này bằng API thật.
    const apiData = {
      days: [
        { day: '03', month: 'Th12' },
        { day: '04', month: 'Th12' },
        { day: '05', month: 'Th12' },
        { day: '06', month: 'Th12' },
      ],
      schedules: {
        '03': [
          {
            title: 'Thiết kế giao diện Web Portal',
            sub: 'Người giao: Đặng Vũ',
            date: '04 Th12',
          },
          {
            title: 'Seminar',
            sub: 'Lầu G, chia sẻ về cuộc đời',
            time: '10:00AM - 11:30AM',
          },
          {
            title: 'Phỏng vấn',
            sub: 'Lầu 4, ứng viên Front-End',
            time: '09:00AM - 10:30AM',
          },
        ],
      },
    };

    // Cập nhật dữ liệu từ API
    setDays(apiData.days);
    setSchedules(apiData.schedules);
  };

  // Gọi API và thiết lập ngày hiện tại theo chuẩn UTC khi component được mount
  useEffect(() => {
    fetchScheduleData();

    // Lấy ngày hiện tại theo chuẩn UTC
    const today = moment.utc().format('DD');
    setSelectedDate(today); // Thiết lập ngày hiện tại là ngày được chọn
  }, []);

  // Hiển thị lịch trình theo ngày được chọn
  const renderSchedule = () => {
    if (schedules[selectedDate]) {
      return schedules[selectedDate].map((item, index) => (
        <div key={index} className="schedule-item">
          <p className="schedule-title">{item.title}</p>
          <p className="schedule-sub">{item.sub}</p>
          {item.time && <p className="schedule-time">{item.time}</p>}
          <span className="schedule-date">{item.date}</span>
        </div>
      ));
    } else {
      return <p>There is no schedule today.</p>;
    }
  };

  return (
    <>
      {/* Nút chọn ngày */}
      <div className="date-selector flex justify-around mb-4">
        {days.map((date) => (
          <button
            key={date.day}
            className={`date-button ${
              selectedDate === date.day ? 'selected' : ''
            }`}
            onClick={() => setSelectedDate(date.day)}
          >
            <div className="flex flex-col items-center">
              <span className="month-label">{date.month}</span>
              <span className="day-label">{date.day}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Chi tiết lịch trình */}
      <div className="schedule-details">{renderSchedule()}</div>
    </>
  );
};

export default PersonalSchedule;
