import React, { useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const TimekeepingSchedule = () => {
  const [viewHour, setViewHour] = useState(false);

  const toggleViewHour = () => {
    setViewHour(!viewHour);
  };

  // Các sự kiện ví dụ, bạn có thể thay thế bằng dữ liệu từ API hoặc cơ sở dữ liệu của bạn
  const events = [
    {
      title: 'Tăng ca',
      date: '2024-12-04',
      backgroundColor: 'red',
      textColor: 'white',
    },
    {
      title: 'Vắng mặt',
      date: '2024-12-11',
      backgroundColor: 'orange',
      textColor: 'white',
    },
    {
      title: 'Công tác',
      date: '2024-12-12',
      backgroundColor: 'green',
      textColor: 'white',
    },
    {
      title: 'Ca đủ công',
      date: '2024-12-15',
      backgroundColor: 'blue',
      textColor: 'white',
    },
    {
      title: 'Nghỉ lễ',
      date: '2024-12-25',
      backgroundColor: 'purple',
      textColor: 'white',
    },
  ];
  return (
    <div>
      <h2>Lịch Chấm Công - Kỳ Công Tháng 12</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input type="checkbox" onChange={toggleViewHour} />
          Xem giờ
        </label>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={viewHour ? 'timeGridWeek' : 'dayGridMonth'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: viewHour ? 'timeGridDay,timeGridWeek' : 'dayGridMonth',
        }}
        events={events}
        height="auto"
        locale="vi"
        eventContent={(eventInfo) => (
          <div>
            <i style={{ marginRight: '4px' }} className="fas fa-circle"></i>
            <b>{eventInfo.event.title}</b>
          </div>
        )}
        eventBackgroundColor="rgba(0, 0, 0, 0)"
      />
    </div>
  );
};

export default TimekeepingSchedule;
