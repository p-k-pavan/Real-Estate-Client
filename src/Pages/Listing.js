import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
} from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing/${params.listingId}`);
        setListing(res.data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleDeleteListing = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/listing/delete/${params.listingId}`, {
        withCredentials: true
      });
      toast.success('Listing deleted successfully');
      navigate(`/my-listings/${currentUser._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete listing');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7D29]"></div>
        </div>
      )}

      {error && (
        <div className="text-center my-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      )}

      {listing && !loading && !error && (
        <div className="max-w-7xl mx-auto py-4">

          <div className="relative z-0">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="rounded-b-xl"
            >
              {listing.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    alt="Property"
                    className="h-[500px] md:h-[600px] w-full object-cover rounded-b-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>


            <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-bold text-white ${
              listing.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {listing.status}
            </div>


            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => setFavorite(!favorite)}
                className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <FaHeart className={`w-5 h-5 ${favorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <FaShare className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {copied && (
              <div className="absolute top-16 right-4 bg-white px-3 py-1 rounded-md shadow-md text-sm z-20">
                Link copied!
              </div>
            )}
          </div>


          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaMapMarkerAlt className="text-[#FF7D29] mr-1" />
                  <span>{listing.address}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-2xl font-bold text-[#FF7D29]">
                  ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                  {listing.type === 'rent' && (
                    <span className="text-gray-500 text-base font-normal">/month</span>
                  )}
                </p>
                {listing.offer && (
                  <p className="text-gray-500 line-through text-sm">
                    ${listing.regularPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>


            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                listing.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {listing.parking ? 'Parking Available' : 'No Parking'}
              </span>
            </div>


            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>


            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Feature icon={<FaBed />} label="Bedrooms" value={`${listing.bedrooms} bed${listing.bedrooms > 1 ? 's' : ''}`} />
                <Feature icon={<FaBath />} label="Bathrooms" value={`${listing.bathrooms} bath${listing.bathrooms > 1 ? 's' : ''}`} />
                <Feature icon={<FaParking />} label="Parking" value={listing.parking ? 'Available' : 'Not Available'} />
                <Feature icon={<FaChair />} label="Furnishing" value={listing.furnished ? 'Furnished' : 'Unfurnished'} />
              </div>
            </div>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="w-full sm:w-auto bg-[#FF7D29] hover:bg-[#e56e21] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Contact Landlord
                <IoIosArrowForward />
              </button>
            )}


           {currentUser && listing.userRef === currentUser._id && (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to={`/update/listing/${listing._id}`}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Edit Listing
            </Link>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Delete Listing
            </button>
          </div>
        )}

          
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                  <p className="text-gray-700 mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteListing}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Deleting...
                        </>
                      ) : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-[#FF7D29]/10 rounded-full text-[#FF7D29]">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}