import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { path } from '../../common/path';
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from '../../components/Animations/LoadingAnimation';
import {
  handleTurnOffLoading,
  handleTurnOnLoading,
} from '../../redux/Slice/loadingSlice';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const isLoading = useSelector((state) => state.loadingSlice.isLoading);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleTurnOnLoading());
    setTimeout(() => {
      dispatch(handleTurnOffLoading());
    }, 3525);
  }, []);

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
        <title>AWS Manager | Sign Up</title>
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
        {/* Sign Up Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Register</h3>
          <p className="text-sm text-gray-500">
            Create a new AWS Manager account
          </p>
        </div>

        {/* Sign Up Form */}
        <form>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="name"
                type="text"
                placeholder="Your Name"
                required
              />
            </div>
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
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Terms & Privacy */}
          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a
                href="#"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Terms & Privacy
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF9900] hover:bg-[#ec7211]"
            >
              Sign Up
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

        {/* Social Sign Up */}
        <div className="flex space-x">
          <button className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-[#787878] bg-[#a1a1a1] transition-all">
            <img
              src="/img/aws-console.png"
              alt="AWS-Console"
              className="w-5 h-5 mx-auto"
            />
          </button>
        </div>

        {/* Already have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href={path.login}
              className="font-medium text-[#146EB4] hover:text-[#1457b4]"
            >
              Sign In Instead
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

export default SignUpPage;
