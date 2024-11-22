import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleClearDataUser } from '../../redux/Slice/userSlice';
import {
  handleTurnOffLoading,
  handleTurnOnLoading,
} from '../../redux/Slice/loadingSlice';
import { path } from '../../common/path';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleTurnOnLoading());

    localStorage.removeItem('LOGIN_USER');

    dispatch(handleClearDataUser());

    dispatch(handleTurnOffLoading());

    window.location.href = path.login;
  }, [dispatch]);

  return <div></div>;
};

export default Logout;
