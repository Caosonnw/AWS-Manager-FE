import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { jwtDecode } from 'jwt-decode';
import { timekeepingServ } from '../../services/timekeepingServ';
import { useAlert } from '../../utils/AlertContext/AlertContext';
import { Button, Card, Row, Col, Modal, Statistic } from 'antd';
import moment from 'moment';
import AttendanceCalendar from '../../components/AttendanceCalendar/AttendanceCalendar';
import './Timekeeping.scss';

const TimeKeeping = () => {
  const showAlert = useAlert();
  const videoRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [employeeId, setEmployeeId] = useState();
  const [totalTimeKeeping, setTotalTimeKeeping] = useState(null);
  const [timeCheckIn, setTimeCheckIn] = useState(null);
  const [timeCheckOut, setTimeCheckOut] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isFaceMatched, setIsFaceMatched] = useState(true); // Trạng thái xác định khuôn mặt có khớp không

  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    const employee_id = jwtDecode(token)?.employee_id;
    setEmployeeId(employee_id);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (employeeId) {
      timekeepingServ
        .checkTimekeeping(employeeId)
        .then((res) => {
          const { clock_in, clock_out } = res.data.data;
          setTimeCheckIn(clock_in);
          setTimeCheckOut(clock_out);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      timekeepingServ
        .totalTimekeeping(employeeId)
        .then((res) => {
          setTotalTimeKeeping(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [employeeId]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        showAlert('Error accessing camera', 'error');
      });
  };

  const handleVideoPlay = async () => {
    setInitializing(false);
    setIsFaceMatched(true); // Reset trạng thái khi bắt đầu

    const intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        const body = {
          embeddings: Array.isArray(detections.descriptor)
            ? detections.descriptor
            : Object.values(detections.descriptor),
        };

        if (isCheckingOut) {
          timekeepingServ
            .checkOut(employeeId, body)
            .then((res) => {
              // Kiểm tra trường hợp mặt không khớp trước
              if (res?.data?.statusCode === 401) {
                showAlert('Face does not match, please try again', 'error');
                setIsFaceMatched(false); // Cập nhật trạng thái không khớp, modal không bị đóng
              } else if (res.status === 200) {
                // Chỉ hiển thị thông báo success nếu trạng thái là 200
                showAlert(res.data.message, 'success');
                setTimeCheckOut(moment().format('HH:mm:ss'));
                clearInterval(intervalId);
                stopVideo();
                handleCloseModal();
              }
            })
            .catch((err) => {
              if (err.response?.data?.statusCode === 401) {
                showAlert('Face does not match, please try again', 'error');
                setIsFaceMatched(false); // Cập nhật trạng thái không khớp, modal không bị đóng
              } else {
                showAlert(
                  err.response?.data?.message || 'Error during check-out',
                  'error'
                );
                clearInterval(intervalId); // Dừng việc phát hiện khuôn mặt
                stopVideo(); // Đóng video nếu có lỗi khác
                handleCloseModal(); // Đóng modal nếu xảy ra lỗi nghiêm trọng khác
              }
            });
        } else {
          timekeepingServ
            .checkIn(employeeId, body)
            .then((res) => {
              console.log(res);
              // Kiểm tra trường hợp mặt không khớp trước
              if (res?.data?.statusCode === 401) {
                showAlert('Face does not match, please try again', 'error');
                setIsFaceMatched(false); // Cập nhật trạng thái không khớp, modal không bị đóng
              } else if (res.status === 200 || res.status === 201) {
                // Chỉ hiển thị thông báo success nếu trạng thái là 200
                showAlert(res.data.message, 'success');
                setTimeCheckIn(moment().format('HH:mm:ss'));
                clearInterval(intervalId);
                stopVideo();
                handleCloseModal();
              }
            })
            .catch((err) => {
              if (err.response?.data?.statusCode === 401) {
                showAlert('Face does not match, please try again', 'error');
                setIsFaceMatched(false); // Cập nhật trạng thái không khớp, modal không bị đóng
              } else {
                showAlert(
                  err.response?.data?.message || 'Error during check-in',
                  'error'
                );
                clearInterval(intervalId); // Dừng việc phát hiện khuôn mặt
                stopVideo(); // Đóng video nếu có lỗi khác
                handleCloseModal(); // Đóng modal nếu xảy ra lỗi nghiêm trọng khác
              }
            });
        }
      } else {
        showAlert('No face detected', 'error');
        setIsFaceMatched(false); // Khuôn mặt không khớp, modal không bị đóng
      }
    }, 1000);
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
  };

  const handleOpenModal = (checkOut = false) => {
    setIsModalVisible(true);
    setIsCheckingOut(checkOut); // Xác định nếu đang check-out
    startVideo();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    stopVideo();
  };

  return (
    <div className="timekeeping">
      <Row gutter={16}>
        {/* Dashboard Section */}
        <Col span={12}>
          <Card title="Dashboard">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Total Hours"
                  value={
                    totalTimeKeeping
                      ? `${totalTimeKeeping.hours}h${totalTimeKeeping.minutes}m`
                      : '0h0m'
                  }
                  suffix={<i className="fa-regular fa-clock"></i>}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Overtime"
                  value="12h"
                  suffix={<i className="fa-regular fa-clock"></i>}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Leave Time"
                  value="24h"
                  suffix={<i className="fa-regular fa-calendar"></i>}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Check-in/Check-out Section */}
        <Col span={12}>
          <Card title="Check-in/Check-out">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Check-in"
                  value={timeCheckIn ? timeCheckIn : 'No record'}
                  suffix={
                    <Button onClick={() => handleOpenModal(false)}>
                      Check-in
                    </Button>
                  }
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Check-out"
                  value={timeCheckOut ? timeCheckOut : 'No record'}
                  suffix={
                    <Button onClick={() => handleOpenModal(true)}>
                      Check-out
                    </Button>
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Attendance Calendar */}
      <AttendanceCalendar />

      {/* Modal for Face Recognition Check-in/Check-out */}
      <Modal
        title={isCheckingOut ? 'Check-Out Khuôn mặt' : 'Check-In Khuôn mặt'}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          width="720"
          height="560"
          onPlay={handleVideoPlay}
          style={{ display: 'block', transform: 'scaleX(-1)' }}
        />
        {!isFaceMatched && (
          <p className="text-red-500">Face does not match, please try again.</p>
        )}
        {initializing && <p>Đang tải các mô hình và bật camera...</p>}
      </Modal>
    </div>
  );
};

export default TimeKeeping;
