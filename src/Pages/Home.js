import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import axios from 'axios';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing?offer=true&limit=4`);
        setOfferListings(res.data.data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing?type=rent&limit=4`);
        setRentListings(res.data.data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/listing?type=sale&limit=4`);
        setSaleListings(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>

      <div className="relative gray-50  overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
          <div className="relative z-10 flex flex-col gap-6">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7D29] to-[#ff9a52]">
                Find your next perfect
              </span>
              <br />
              <span className="text-gray-800">place with ease</span>
            </h1>


            <div className="relative max-w-xl">
              <p className="text-gray-600 text-base sm:text-lg">
                PK Estate is the best place to find your next perfect place to live.
                We have a wide range of properties for you to choose from.
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-24 bg-[#FF7D29] opacity-30 -z-10"></div>
            </div>


            <Link
              to="/search"
              className="group relative w-fit px-8 py-3 font-medium text-white overflow-hidden rounded-lg shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#FF7D29] to-[#ff9a52] group-hover:from-[#ff9a52] group-hover:to-[#FF7D29] transition-all duration-300"></span>
              <span className="relative flex items-center gap-2">
                Let's get started
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </Link>

            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7D29] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-[#FF7D29] opacity-5 rounded-full"></div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden -z-0">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FF7D29] opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7D29] opacity-3 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 gray-50 "> 
        <Swiper
          navigation
          loop={true}
          autoplay={{ delay: 5000 }}
          effect="fade"
          grabCursor={true}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {offerListings && offerListings.length > 0 ? (
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className="relative h-[400px] sm:h-[500px]"> 
                  <div
                    style={{
                      background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                    className="absolute inset-0"
                  ></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-6xl mx-auto">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {listing.name}
                      </h3>
                      <p className="text-[#FF7D29] font-semibold mt-2">
                        ${listing.offer ? listing.discountPrice : listing.regularPrice}
                        {listing.type === 'rent' && '/month'}
                      </p>
                      <div className="flex items-center mt-3 text-white/90 text-sm">
                        <span>{listing.bedrooms} beds</span>
                        <span className="mx-2">•</span>
                        <span>{listing.bathrooms} baths</span>
                        {listing.discountPrice && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-[#FF7D29] font-medium">Special Offer</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="h-[400px] sm:h-[500px] gray-50  flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-[#FF7D29]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-[#FF7D29]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Featured Listings</h3>
                  <p className="text-gray-600 mb-4">Check back later for special offers</p>
                  <Link
                    to="/search"
                    className="inline-block px-6 py-2 bg-[#FF7D29] text-white rounded-lg hover:bg-[#e56e21] transition-colors"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <div className='gray-50 '>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
          {offerListings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Recent <span className="text-[#FF7D29]">Offers</span>
                </h2>
                <Link
                  to="/search?offer=true"
                  className="flex items-center text-[#FF7D29] hover:text-[#e56e21] font-medium transition-colors group"
                >
                  View all offers
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {rentListings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Places for <span className="text-[#FF7D29]">Rent</span>
                </h2>
                <Link
                  to="/search?type=rent"
                  className="flex items-center text-[#FF7D29] hover:text-[#e56e21] font-medium transition-colors group"
                >
                  View all rentals
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {saleListings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Places for <span className="text-[#FF7D29]">Sale</span>
                </h2>
                <Link
                  to="/search?type=sale"
                  className="flex items-center text-[#FF7D29] hover:text-[#e56e21] font-medium transition-colors group"
                >
                  View all properties
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
