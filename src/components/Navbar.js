import React, { useEffect, useState } from "react";
import { FaSearch, FaHome, FaInfoCircle, FaUser, FaPlus, FaBuilding } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-[#FF7D29] shadow-sm sticky top-0 z-50 border-b border-[#FEFFD2]/20 h-14">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 h-full">

        <Link to="/" className="flex items-center group h-full">
          <h1 className="text-xl font-bold cursor-pointer">
            <span className="text-gray-50 group-hover:text-[#d65e1a] transition-colors">PK</span>
            <span className="text-gray-800 group-hover:text-[#FEFFD2] transition-colors">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex bg-white p-1 rounded-full items-center w-1/3 min-w-[180px] transition-all duration-200 focus-within:ring-1 focus-within:ring-[#FEFFD2] mx-4 h-8"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full px-2 text-gray-800 placeholder-gray-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="p-1 text-gray-600 hover:text-[#FEFFD2] transition-colors"
          >
            <FaSearch className="text-sm" />
          </button>
        </form>

        <nav className="hidden md:flex items-center space-x-4 h-full">
          <Link
            to="/"
            className="flex items-center text-gray-800 hover:text-[#FEFFD2] transition-colors text-m h-full px-2 border-b-2 border-transparent hover:border-[#FEFFD2]"
          >
            <FaHome className="mr-1 text-m font-semibold" />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center text-gray-800 hover:text-[#FEFFD2] transition-colors text-m h-full px-2 border-b-2 border-transparent hover:border-[#FEFFD2]"
          >
            <FaInfoCircle className="mr-1 text-m font-semibold" />
            <span>About</span>
          </Link>

          {currentUser && (
            <>
              <Link
                to="/create-listing"
                className="flex items-center text-gray-800 hover:text-[#FEFFD2] transition-colors text-m h-full px-2 border-b-2 border-transparent hover:border-[#FEFFD2]"
              >
                <FaPlus className="mr-1 text-m font-semibold" />
                <span>Create Listing</span>
              </Link>
              <Link
                to={`my-listings/${currentUser._id}`}
                className="flex items-center text-gray-800 hover:text-[#FEFFD2] transition-colors text-m h-full px-2 border-b-2 border-transparent hover:border-[#FEFFD2]"
              >
                <FaBuilding className="mr-1 text-m font-semibold" />
                <span>My Properties</span>
              </Link>
            </>
          )}

          <Link
            to={currentUser ? "/profile" : "/signin"}
            className="ml-2 h-full flex items-center"
          >
            {currentUser ? (
              <div className="group relative h-7 w-7">
                {currentUser?.avatar ? (
                  <img
                    className="w-full h-full rounded-full object-cover border border-[#FEFFD2]/50 group-hover:border-[#FEFFD2] transition-all"
                    src={currentUser.avatar}
                    alt="profile"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#FF7D29] text-gray-50 flex items-center justify-center text-s font-bold uppercase border-2">
                    {currentUser?.name?.slice(0, 1)}
                  </div>
                )}
              </div>
            ) : (
              <button className="bg-white text-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors flex items-center text-sm h-7">
                <FaUser className="mr-1 text-xs" />
                <span className="text-xs">Sign In</span>
              </button>
            )}
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-800 focus:outline-none hover:text-[#FEFFD2] transition-colors p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#FF7D29] border-t border-[#FEFFD2]/30">
          <div className="px-3 py-1 space-y-1">
            <div className="flex p-1">
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-white outline-none w-full px-2 text-sm text-gray-800 placeholder-gray-500 rounded-l-full h-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="bg-[#FEFFD2] text-white px-2 rounded-r-full h-8 flex items-center justify-center"
              >
                <FaSearch className="text-xs" />
              </button>
            </div>
            <Link
              to="/"
              className="block px-2 py-1.5 rounded text-gray-800 hover:bg-[#FEFFD2]/10 flex items-center text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome className="mr-2 text-[#FEFFD2] text-xs" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className="block px-2 py-1.5 rounded text-gray-800 hover:bg-[#FEFFD2]/10 flex items-center text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaInfoCircle className="mr-2 text-[#FEFFD2] text-xs" />
              <span>About</span>
            </Link>

            {currentUser && (
              <>
                <Link
                  to="/create-listing"
                  className="block px-2 py-1.5 rounded text-gray-800 hover:bg-[#FEFFD2]/10 flex items-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPlus className="mr-2 text-[#FEFFD2] text-xs" />
                  <span>Create Listing</span>
                </Link>
                <Link
                  to={`my-listings/${currentUser._id}`}
                  className="block px-2 py-1.5 rounded text-gray-800 hover:bg-[#FEFFD2]/10 flex items-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaBuilding className="mr-2 text-[#FEFFD2] text-xs" />
                  <span>My Properties</span>
                </Link>
              </>
            )}

            <Link
              to={currentUser ? "/profile" : "/signin"}
              className="block px-2 py-1.5 rounded text-gray-800 hover:bg-[#FEFFD2]/10 flex items-center text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {currentUser ? (
                <>
                  {currentUser.avatar ? (
                    <img
                      className="w-4 h-4 rounded-full object-cover mr-2 border border-[#FEFFD2]"
                      src={currentUser.avatar}
                      alt="profile"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#FF7D29] text-black flex items-center justify-center text-xs font-bold uppercase border border-[#FEFFD2] mr-2">
                      {currentUser?.name?.slice(0, 1)}
                    </div>
                  )}
                  <span>Profile</span>
                </>
              ) : (
                <>
                  <FaUser className="mr-2 text-black text-xs" />
                  <span>Sign In</span>
                </>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}