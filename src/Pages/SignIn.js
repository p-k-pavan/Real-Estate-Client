import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Toast from "../components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {    
    if (!formData.email.trim()) {
      toast.error("Email is required", { toastId: 'email-error' });
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address", { toastId: 'email-format-error' });
      return false;
    }
    
    if (!formData.password) {
      toast.error("Password is required", { toastId: 'password-error' });
      return false;
    }
    
    return true;
  };

  console.log(process.env.REACT_APP_API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      dispatch(signInStart());
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/signin`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!res.data.success) {
        dispatch(signInFailure(res.data.message));
        throw new Error(res.data.message || "Login failed");

      }

      toast.success("🎉 Login successful! Redirecting...", {
        autoClose: 2000,
        hideProgressBar: true,
      });
      
      // Store user data in local storage if needed
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      dispatch(signInSuccess(res.data.user));
      
      setTimeout(() => navigate("/"), 2000);
      
    } catch (err) {
      dispatch(signInFailure(err.message));
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      toast.error("Invalid email or password", {
        toastId: 'auth-error',
        autoClose: 5000
      });
    } else if (status === 400) {
      toast.error(message || "Validation error", {
        toastId: 'validation-error',
        autoClose: 5000
      });
    } else {
      toast.error(message || "An unexpected error occurred", {
        toastId: 'server-error',
        autoClose: 6000
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFFD2] py-12 px-4 sm:px-6 lg:px-8">
      <Toast />
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#FF7D29]">
            Welcome to PK Real Estate
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleChange}
                value={formData.email}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF7D29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}