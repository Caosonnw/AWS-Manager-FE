import React from 'react';
import { path } from '../../common/path';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
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
        <form>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[FF9900] focus:border-[FF9900]"
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
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
