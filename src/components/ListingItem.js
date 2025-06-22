import { Link } from 'react-router-dom';
import { MdLocationOn, MdKingBed, MdBathtub } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative">
          <img
            src={listing.imageUrls[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}
            alt={listing.name}
            className="h-64 w-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-500 hover:text-[#FF7D29] transition-colors"
            onClick={(e) => {
              e.preventDefault();

            }}
          >
            <FaHeart className="w-4 h-4" />
          </button>
          {listing.offer && (
            <div className="absolute top-3 left-3 bg-[#FF7D29] text-white text-xs font-bold px-2 py-1 rounded">
              Special Offer
            </div>
          )}
        </div>


        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {listing.name}
            </h3>
            <p className="text-[#FF7D29] font-bold">
              ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className="text-gray-500 text-sm font-normal">/mo</span>}
            </p>
          </div>

          <div className="flex items-center mt-2 text-gray-600">
            <MdLocationOn className="flex-shrink-0 text-[#FF7D29]" />
            <span className="ml-1 text-sm truncate">{listing.address}</span>
          </div>

          <p className="mt-2 text-gray-500 text-sm line-clamp-2">
            {listing.description}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdKingBed className="mr-1 text-[#FF7D29]" />
              <span>
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MdBathtub className="mr-1 text-[#FF7D29]" />
              <span>
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}