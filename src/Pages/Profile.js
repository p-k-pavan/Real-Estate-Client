import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiLogOut, FiPlusCircle, FiUpload, FiX } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    password: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
   const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || '',
        password: ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateImage = useCallback((file) => {
    if (!file) return 'No file selected';
    if (file.size > 1 * 1024 * 1024) return 'Image must be less than 1MB';
    if (!file.type.startsWith('image/')) return 'Only image files are allowed';
    return '';
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const error = validateImage(selectedFile);
    
    if (error) {
      setFileUploadError(error);
      setFile(null);
      setPreviewUrl('');
      return;
    }

    setFileUploadError('');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setFilePerc(0);
  };

  const handleFileUpload = useCallback(async () => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setFileUploadError('');
      
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/upload/profile`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (e) => {
            const progress = Math.round((e.loaded * 100) / e.total);
            setFilePerc(progress);
          },
        }
      );

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      setFileUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      let avatarUrl = formData.avatar;
      if (file) {
        avatarUrl = await handleFileUpload();
        if (!avatarUrl) return;
      }

      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/update/${currentUser._id}`,
        { ...formData, avatar: avatarUrl },
        { withCredentials: true }
      );
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    } catch (error) {
      dispatch(updateUserFailure(error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account?')) return;
    
    try {
      dispatch(deleteUserStart());
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        withCredentials: true,
      });
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message || error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signout`);
      dispatch(signOutUserSuccess());
      navigate("/")
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Profile Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {isUploading ? (
                <div className="rounded-full h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center bg-gray-100 border-4 border-orange-100">
                  <div className="text-center">
                    <FaSpinner className="animate-spin text-orange-500 text-2xl mx-auto" />
                    <span className="text-xs text-gray-500 mt-1 block">{filePerc}%</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    onClick={() => fileRef.current.click()}
                    src={previewUrl || formData.avatar || "/default-avatar.png"}
                    alt="profile"
                    className="rounded-full h-28 w-28 sm:h-32 sm:w-32 object-cover cursor-pointer border-4 border-orange-100 hover:border-orange-200 transition-all"
                  />
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl('');
                        setFileUploadError('');
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <FiX className="text-sm" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <FiUpload className="text-white text-xl sm:text-2xl" />
              </div>
            </div>
            
            <input
              onChange={handleFileChange}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="flex items-center gap-2 text-sm sm:text-base text-orange-600 hover:text-orange-700 font-medium"
              >
                <FiEdit2 /> {previewUrl ? 'Change' : 'Upload'} Photo
              </button>
            </div>

            <div className="min-h-6 text-center">
              {fileUploadError && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                  <FaTimesCircle /> {fileUploadError}
                </p>
              )}
              
              {!fileUploadError && filePerc === 100 && (
                <p className="text-green-500 text-sm flex items-center justify-center gap-1">
                  <FaCheckCircle /> Ready to update!
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="name"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 sm:py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
            
            <Link
              to="/create-listing"
              className="flex-1 bg-white border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium py-2 sm:py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FiPlusCircle /> Create Listing
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link to={`/my-listings/${currentUser._id}`}>
            <button
              className="text-orange-600 hover:text-orange-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border-2"
            >
              Show My Listings
            </button>
            </Link>
            
            <div className="flex gap-4">
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiLogOut /> Sign Out
              </button>
              
              <button
                onClick={handleDeleteUser}
                className="text-red-600 hover:text-red-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiTrash2 /> Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {error && (
            <p className="text-red-500 flex items-center gap-2">
              <FaTimesCircle /> {error}
            </p>
          )}
          
          {updateSuccess && (
            <p className="text-green-500 flex items-center gap-2">
              <FaCheckCircle /> Profile updated successfully!
            </p>
          )}
          
          {showListingsError && (
            <p className="text-red-500 flex items-center gap-2">
              <FaTimesCircle /> Error loading listings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}