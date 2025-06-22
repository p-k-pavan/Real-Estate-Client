import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ListingItem from '../components/ListingItem';

const MyListings = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/user/listing/${id}`,
          { withCredentials: true }
        );
        setListings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading listings...</div>;
  if (error) return <div className="text-red-500 mt-10 text-center">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
