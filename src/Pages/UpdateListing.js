import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign } from 'react-icons/fi';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

export default function UpdateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                

                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing/${params.listingId}`);

                if (!res.data) {
                    toast.error('Listing not found');
                    return navigate('/');
                }

                if (res.data.userRef !== currentUser._id) {
                    toast.error('You can only edit your own listings!');
                    return navigate('/');
                }

                setFormData(res.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch listing data');
                console.error('Fetch error:', error);
                navigate('/');
            }
        };

        fetchListing();
    }, [params.listingId, currentUser._id, navigate]);

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
                return setError('You must have at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');

            setLoading(true);
            setError('');

            

            const res = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/listing/update/${params.listingId}`,
                {
                    ...formData,
                    userRef: currentUser._id,
                },
                {
                    withCredentials: true
                }
            );
            if(res.data.success){
            toast.success('Listing updated successfully');
            navigate(`/listing/${params.listingId}`);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setError(errorMsg);
            toast.error(`Failed to update listing: ${errorMsg}`);
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Update Listing</h1>
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
                            <span className="text-xs text-gray-500 ml-auto">First image is the cover</span>
                        </label>

                        <div className="rounded-xl overflow-hidden">
                            <Swiper
                                navigation
                                pagination={{ clickable: true }}
                                className="rounded-xl"
                            >
                                {formData.imageUrls.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={url}
                                            alt={`Listing ${index + 1}`}
                                            className="h-64 w-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Note: Images cannot be modified in this view. To change images, please delete and recreate the listing.
                        </p>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[#FF7D29] text-white font-medium rounded-lg hover:bg-[#e56e21] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                </div>
            </form>
        </div>
    );
}
