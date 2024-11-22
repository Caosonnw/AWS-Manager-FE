import React from 'react';
import './Dashboard.scss';
import { Button, Row, Col, Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import PersonalSchedule from '../../components/PersonalSchedule/PersonalSchedule';
import BirthdayCard from '../../components/BirthdayCard/BirthdayCard';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../common/path';

const Dashboard = () => {
  const navigate = useNavigate();

  // Data for the work progress chart (middle)
  const workProgressOptions = {
    chart: {
      type: 'line',
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    },
    dataLabels: {
      enabled: false,
    },
  };

  const workProgressSeries = [
    {
      name: 'Công việc',
      data: [10, 20, 30, 40, 20, 50],
    },
  ];

  // Data for the HR pie chart (right)
  const hrStatusOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Làm việc', 'Ngày nghỉ', 'Tăng ca', 'Đi trễ'],
    colors: ['#2E93fA', '#FF9800', '#FF4560', '#775DD0'],
  };

  const hrStatusSeries = [210, 16, 24, 4];

  const handleClickNavigate = () => {
    navigate(path.timekeeping);
  };
  return (
    <>
      <div className="flex gap-20 items-center mb-10">
        <div>
          {/* Row 1 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button
                className="w-full h-full text-black flex items-center justify-start p-3 rounded-[6px] shadow text-[15px]"
                onClick={handleClickNavigate}
              >
                <span className="bg-yellow-500 rounded-[4px]">
                  <i className="fa-solid fa-fingerprint p-[5px] text-white"></i>
                </span>
                <span className="font-semibold">Timekeeping</span>
              </Button>
            </Col>
            <Col span={12}>
              <Button className="w-full h-full text-black flex items-center justify-start p-3 rounded-[6px] shadow text-[15px]">
                <span className="bg-purple-500 rounded-[4px]">
                  <i className="fa-solid fa-calendar-days p-[5px] text-white"></i>
                </span>
                <span className="font-semibold">Leave of absence</span>
              </Button>
            </Col>
            <Col span={12}>
              <Button className="w-full h-full text-black flex items-center justify-start p-3 rounded-[6px] shadow text-[15px]">
                <span className="bg-red-500 rounded-[4px]">
                  <i className="fa-solid fa-clock p-[5px] text-white"></i>
                </span>
                <span className="font-semibold">Overtime</span>
              </Button>
            </Col>
            <Col span={12}>
              <Button className="w-full h-full text-black flex items-center justify-start p-3 rounded-[6px] shadow text-[15px]">
                <span className="bg-green-500 rounded-[4px]">
                  <i className="fa-solid fa-suitcase-rolling p-[5px] text-white"></i>
                </span>
                <span className="font-semibold">Business trip</span>
              </Button>
            </Col>
          </Row>
        </div>
        <div className="w-full border-2 border-gray-100 p-2 px-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
          <div className="grid grid-cols-6 gap-4 w-full">
            <button className="flex flex-col items-center justify-center p-3 px-8 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-regular fa-calendar-check text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">Công</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 px-6 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-solid fa-id-card text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">Hồ sơ cá nhân</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 px-6 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-solid fa-fingerprint text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">DS quên chấm công</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 px-6 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-solid fa-calendar-xmark text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">DS ngày nghỉ</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 px-6 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-solid fa-clock-rotate-left text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">DS tăng ca</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 px-6 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150">
              <i className="fa-solid fa-ellipsis-h text-[40px] mb-2 text-[#ff9900]"></i>
              <span className="font-bold">Xem thêm</span>
            </button>
          </div>
        </div>
      </div>
      {/* Dashboard Cards */}
      <div className="dashboard">
        <Row gutter={[16, 16]}>
          {/* Personal Schedule */}

          <Col span={7}>
            <Card
              title="Personal Calendar"
              className="personal-schedule max-h-[520px] overflow-y-auto"
            >
              <PersonalSchedule />
            </Card>
          </Col>

          {/* Work Progress Chart */}
          <Col span={10}>
            <Card title="Work Progress" className="dashboard-card">
              <div className="flex justify-between">
                <span className="flex flex-col font-bold text-[30px]">
                  50
                  <p className="text-[15px]">Tổng công việc</p>
                </span>
                <span className="flex flex-col items-end font-bold text-[30px] text-[#FF9900]">
                  42
                  <p className="text-[15px] text-black">Hoàn thành</p>
                </span>
              </div>
              <ReactApexChart
                options={workProgressOptions}
                series={workProgressSeries}
                type="line"
                height={330}
              />
            </Card>
          </Col>

          {/* HR Status with smaller size */}
          <Col span={7}>
            <Card title="Human Resources Situation" className="dashboard-card">
              <ReactApexChart
                options={hrStatusOptions}
                series={hrStatusSeries}
                type="donut"
                height={233}
              />
              <p className="mt-4">210/254 Tổng nhân sự</p>
            </Card>

            {/* Birthday Card right below HR Status */}
            <BirthdayCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
