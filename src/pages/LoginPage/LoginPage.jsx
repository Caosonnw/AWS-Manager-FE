import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { path } from '../../common/path';
import { handleGetValueUser } from '../../redux/Slice/userSlice';
import { authServ } from '../../services/authServ';
import { useAlert } from '../../utils/AlertContext/AlertContext';
import { saveLocalStorage } from '../../utils/localStorage';
import LoadingAnimation from '../../components/Animations/LoadingAnimation';
import {
  handleTurnOffLoading,
  handleTurnOnLoading,
} from '../../redux/Slice/loadingSlice';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const isLoading = useSelector((state) => state.loadingSlice.isLoading);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showAlert = useAlert();

  useEffect(() => {
    dispatch(handleTurnOnLoading());
    setTimeout(() => {
      dispatch(handleTurnOffLoading());
    }, 3525);
  }, []);
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: async (values) => {
        // console.log(values);
        try {
          const res = await authServ.login(values);
          showAlert(res.data.message, 'success');
          navigate(path.home);
          saveLocalStorage('LOGIN_USER', res.data.data);
          dispatch(handleGetValueUser(res.data.data));
        } catch (err) {
          showAlert(err.response?.data?.message || 'Login failed', 'error');
        }
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .required('This field is required')
          .email('Please enter the correct email format'),
        password: Yup.string().required('This field is required'),
      }),
    });

  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    if (token) {
      setIsLogin(true);
    }
    if (isLogin === true) {
      navigate(path.home);
    }
  }, [isLogin]);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {isLoading && <LoadingAnimation />}
      <Helmet>
        <title>AWS Manager | Login</title>
      </Helmet>
      <div className="text-center text-black mb-5">
        <h1 className="text-4xl font-bold">Welcome to AWS Manager</h1>
      </div>
      {/* Logo Section */}
      <img
        className="mb-4 w-[100px]"
        src="/img/Amazon-Web-Services-AWS-Logo.png"
        alt="AWS Logo"
      />

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Sign In Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Access the AWS Management panel using your email and password
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="you@example.com"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[FF9900] focus:border-[FF9900]"
                id="password"
                type="password"
                name="password"
                autoComplete="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="••••••••"
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember Me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF9900] hover:bg-[#ec7211]"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* OR Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Social Sign In */}
        <div className="flex space-x">
          <button className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-[#787878] bg-[#a1a1a1] transition-all">
            <img
              src="/img/aws-console.png"
              alt="AWS-Console"
              className="w-5 h-5 mx-auto"
            />
          </button>
        </div>

        {/* Create Account Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New on our platform?{' '}
            <a
              href={path.signup}
              className="font-medium text-[#146EB4] hover:text-[#1457b4]"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        © 2024 - AWS Manager
      </footer>
    </div>
  );
};

export default LoginPage;
