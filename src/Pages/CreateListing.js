import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { IoIosImages } from 'react-icons/io';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateImage = useCallback((file) => {
    if (!file) return 'No file selected';
    if (file.size > 2 * 1024 * 1024) return 'Image must be less than 2MB';
    if (!file.type.startsWith('image/')) return 'Only image files are allowed';
    return '';
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const errors = selectedFiles.map(file => validateImage(file)).filter(Boolean);
    if (errors.length > 0) {
      setUploadError(errors[0]);
      return;
    }

    if (selectedFiles.length + formData.imageUrls.length > 6) {
      setUploadError('You can only upload 6 images per listing');
      return;
    }

    setUploadError('');
    setFiles(selectedFiles);

    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleImageUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      setUploadError('');

      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('images', file);

        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/upload/listing`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      });

      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.flatMap(res => res.data.urls);

      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));

      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    if (index < previewUrls.length) {
      URL.revokeObjectURL(previewUrls[index]);
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);

      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    } else {
      const adjustedIndex = index - previewUrls.length;
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== adjustedIndex)
      }));
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError('');

      const res = await axios.post('${process.env.react_app_api_base_url}/api/listing/create', {
        ...formData,
        userRef: currentUser._id,
      }, {
        withCredentials: true
      });

      navigate(`/listing/${res.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Property name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              placeholder="Property description"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29] min-h-[100px]"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Property address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                id="sale"
                className={`px-4 py-2 rounded-lg ${formData.type === 'sale' ? 'bg-[#FF7D29] text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={handleChange}
              >
                For Sale
              </button>
              <button
                type="button"
                id="rent"
                className={`px-4 py-2 rounded-lg ${formData.type === 'rent' ? 'bg-[#FF7D29] text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={handleChange}
              >
                For Rent
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="h-4 w-4 text-[#FF7D29] focus:ring-[#FF7D29] border-gray-300 rounded"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className="flex items-center gap-1">
                  <FaParking /> Parking
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="h-4 w-4 text-[#FF7D29] focus:ring-[#FF7D29] border-gray-300 rounded"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className="flex items-center gap-1">
                  <FaChair /> Furnished
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="h-4 w-4 text-[#FF7D29] focus:ring-[#FF7D29] border-gray-300 rounded"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className="flex items-center gap-1">
                  <FiDollarSign /> Offer
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FaBed /> Beds
              </label>
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FaBath /> Baths
              </label>
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiDollarSign /> Regular Price
              </label>
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              {formData.type === 'rent' && (
                <p className="text-xs text-gray-500">($ / month)</p>
              )}
            </div>
            {formData.offer && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FiDollarSign /> Discounted Price
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                {formData.type === 'rent' && (
                  <p className="text-xs text-gray-500">($ / month)</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <IoIosImages /> Images
              <span className="text-xs text-gray-500 ml-auto">First image will be cover (max 6)</span>
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleFileChange}
                className="hidden"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <label
                htmlFor="images"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <FiUpload /> Select Images
              </label>
              <button
                type="button"
                disabled={uploading || files.length === 0}
                onClick={handleImageUpload}
                className="px-4 py-2 bg-[#FF7D29] text-white rounded-lg hover:bg-[#e56e21] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Preview Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* Show previews of selected but not yet uploaded images */}
            {previewUrls.map((url, index) => (
              <div key={`preview-${index}`} className="relative group">
                <img
                  src={url}
                  alt="listing preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Show already uploaded images */}
            {formData.imageUrls.map((url, index) => (
              <div key={`uploaded-${index}`} className="relative group">
                <img
                  src={url}
                  alt="listing preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(previewUrls.length + index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || uploading || formData.imageUrls.length === 0}
            className="w-full py-3 px-4 bg-[#FF7D29] text-white font-medium rounded-lg hover:bg-[#e56e21] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </button>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>
      </form>
    </div>
  );
}