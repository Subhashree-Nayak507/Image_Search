import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchImages } from '../redux/search/index';
import { logoutUser } from '../redux/auth/index';
import { LogOut, User, Search, Loader, Image } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { images, isLoading, error } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.auth);

  // Show toast error when the search fails
  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : error.message || 'Failed to search for images. Please try again.';
      toast.error(errorMessage);
    }
  }, [error]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchImages(query));
    } else {
      toast.error('Please enter a search term');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        toast.error('Logout failed. You will be redirected to login page.');
        navigate('/login');
      });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = (e) => {
    if (e.target.id === 'modal-backdrop') {
      setIsModalOpen(false);
    }
  };

  // Improved function to get image URL with better fallbacks
  const getImageUrl = (image) => {
    if (!image) return '/api/placeholder/400/320';
    
    // Try different possible image URL properties
    const possibleUrls = [
      image.url,
      image.webformatURL,
      image.previewURL,
      image.thumbnailUrl,
      image.id ? `https://pixabay.com/get/${image.id}-640.jpg` : null
    ];
    
    // Find the first non-null URL
    const validUrl = possibleUrls.find(url => url);
    return validUrl || '/api/placeholder/400/320';
  };

  // Function to handle image load errors
  const handleImageError = (e, image) => {
    console.warn('Image failed to load:', image);
    
    // Try a smaller version if we have an ID
    if (image.id) {
      e.target.src = `https://pixabay.com/get/${image.id}-180.jpg`;
    } else {
      e.target.src = '/api/placeholder/400/320';
    }
    e.target.alt = 'Image failed to load';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Enhanced Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo with improved styling */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                <Image className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ImageSearch Pro
              </span>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="relative">
                <button
                  onClick={toggleModal}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-label="View Profile"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300 hover:text-red-200"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Modal */}
      {isModalOpen && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-0"
          onClick={handleModalClose}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex justify-center">
              User Profile
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.fullName || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-center">
              <Button
                onClick={toggleModal}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 flex-1">
        {/* Search Bar */}
        <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto mt-2 sm:mt-4 md:mt-8 mb-4 sm:mb-8 md:mb-12 px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-4 sm:mb-6">
            Find the Perfect Image
          </h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for images..."
              className="w-full pl-10 pr-16 sm:pr-20 py-4 sm:py-6 rounded-xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:bg-white/30 transition-all duration-200 text-sm sm:text-base"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-1 sm:mr-2" />
              ) : (
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              )}
              <span className="hidden xs:inline-block">Search</span>
            </Button>
          </div>
        </div>

        {/* Search Results - Image Grid */}
        <div className="mt-4 sm:mt-8 w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <Loader className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-spin" />
            </div>
          ) : (
            <>
              {images && images.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 md:gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="relative group overflow-hidden rounded-lg shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 h-full"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={image.alt || image.title || 'Search result'}
                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => handleImageError(e, image)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
                        <h3 className="text-white font-medium truncate text-xs sm:text-sm md:text-base">
                          {image.title || 'Image'}
                        </h3>
                        <p className="text-gray-300 text-xs flex items-center">
                          {image.description || 'No description available'}
                        </p>
                      </div>
                      <div className="p-1.5 sm:p-2 bg-black/30">
                        <p className="text-white text-xs truncate">{image.title || 'Image'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-12 text-center max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                  <div className="bg-indigo-500/20 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Image className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-200" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-white">
                    {query ? "No images found" : "Enter a search term to find images"}
                  </h2>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-4">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 shadow">
                <Image className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ImageSearch Pro
              </span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} ImageSearch Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;