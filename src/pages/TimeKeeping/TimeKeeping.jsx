import * as faceapi from 'face-api.js';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { timekeepingServ } from '../../services/timekeepingServ';

const TimeKeeping = () => {
  const videoRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [employeeId, setEmployeeId] = useState();

  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    const employee_id = jwtDecode(token).employee_id;
    setEmployeeId(employee_id);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      // Bật camera
      startVideo();
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  };

  const handleVideoPlay = async () => {
    setInitializing(false);

    const intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        console.log(detections.descriptor); // Log khi phát hiện khuôn mặt
        const body = {
          employee_id: employeeId,
          embeddings: detections.descriptor,
        };
        console.log(body);
        timekeepingServ
          .registerFace(body)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('No face detected'); // Log khi không phát hiện khuôn mặt
      }
    }, 1000);
  };
  return (
    <div className="App">
      <h1>Đăng ký Khuôn mặt</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        onPlay={handleVideoPlay}
        style={{ display: 'block', transform: 'scaleX(-1)' }}
      />
      {initializing && <p>Đang tải các mô hình và bật camera...</p>}
    </div>
  );
};

export default TimeKeeping;
