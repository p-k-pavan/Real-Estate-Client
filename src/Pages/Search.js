import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios';


export default function Search() {
  const navigate = useNavigate()
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing?${urlParams.toString()}`);
      const data = res.data.data;
      setShowMore(data.length >= 9);
      setListings(data);


      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (['all', 'rent', 'sale'].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    setShowMore(data.length >= 9);
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden p-4 border-b">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FiFilter className="text-[#FF7D29]" />
            <span className="font-medium">Filters</span>
          </div>
          {mobileFiltersOpen ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        <div
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-80 p-6 border-b md:border-r border-gray-200 bg-white`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search properties..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF7D29] focus:border-[#FF7D29]"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Property Type</h3>
              <div className="space-y-2">
                {['all', 'rent', 'sale', 'offer'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={type}
                      className="h-4 w-4 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                      checked={
                        type === 'offer'
                          ? sidebardata.offer
                          : sidebardata.type === type
                      }
                      onChange={handleChange}
                    />
                    <label htmlFor={type} className="ml-3 text-sm text-gray-700 capitalize">
                      {type === 'all' ? 'Rent & Sale' : type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Amenities</h3>
              <div className="space-y-2">
                {['parking', 'furnished'].map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      className="h-4 w-4 text-[#FF7D29] border-gray-300 rounded focus:ring-[#FF7D29]"
                      checked={sidebardata[amenity]}
                      onChange={handleChange}
                    />
                    <label htmlFor={amenity} className="ml-3 text-sm text-gray-700 capitalize">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Sort By</h3>
              <select
                id="sort_order"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FF7D29] focus:border-[#FF7D29] rounded-lg"
                value={`${sidebardata.sort}_${sidebardata.order}`}
                onChange={handleChange}
              >
                <option value="regularPrice_desc">Price (High to Low)</option>
                <option value="regularPrice_asc">Price (Low to High)</option>
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF7D29] hover:bg-[#e56e21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7D29]"
            >
              Apply Filters
            </button>
          </form>
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {listings.length} {listings.length === 1 ? 'Property' : 'Properties'} Found
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7D29]"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <FiSearch className="w-full h-full" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>

              {showMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={onShowMoreClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#FF7D29] bg-[#FF7D29]/10 hover:bg-[#FF7D29]/20"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}