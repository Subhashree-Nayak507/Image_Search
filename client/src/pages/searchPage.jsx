import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchImages, fetchSearchHistory } from '../redux/search/index';
import { logoutUser } from '../redux/auth/index';
import { LogOut, User, Search, Loader, Image } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { images, isLoading, error } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.auth);
  console.log("user",user);

  // Debug logging
  useEffect(() => {
    console.log('Images from Redux:', images);
  }, [images]);

  useEffect(() => {
    dispatch(fetchSearchHistory());
  }, [dispatch]);

  // Handle modal close on Escape key
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
      console.log('Searching for:', query);
      dispatch(searchImages(query));
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

  const getImageUrl = (image) => {
    console.log('Image object in getImageUrl:', image);
    if (image.url) return image.url;
    if (image.webformatURL) return image.webformatURL;
    if (image.previewURL) return image.previewURL;
    if (image.thumbnailUrl) return image.thumbnailUrl;
    if (image.id) return `https://pixabay.com/get/${image.id}-640.jpg`;
    return '/api/placeholder/400/320'; // Uncommented fallback
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Enhanced Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with improved styling */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                <Image className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ImageSearch Pro
              </span>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleModal}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-label="View Profile"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    <User className="h-4 w-4" />
                  </div>
                  {user && (
                    <span className="ml-2 text-white text-sm hidden md:inline">
                      {user.username || user.fullName}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300 hover:text-red-200"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Modal */}
      {isModalOpen && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleModalClose}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" className="text-xl font-bold text-white mb-4">
              User Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.fullName || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-white/5 border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={toggleModal}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 flex-1">
        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto mt-4 md:mt-8 mb-8 md:mb-12 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
            Find the Perfect Image
          </h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for stunning images..."
              className="w-full pl-10 pr-20 py-6 rounded-xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:bg-white/30 transition-all duration-200"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Search
            </Button>
          </div>
        </div>

        {/* Search Results - Image Grid */}
        <div className="mt-8 w-full">
          {error && (
            <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-12 w-12 text-white animate-spin" />
            </div>
          ) : (
            <>
              {images && images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {images.map((image, index) => {
                    console.log(`Rendering image ${index}:`, image);
                    return (
                      <div
                        key={image.id || index}
                        className="relative group overflow-hidden rounded-lg shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 h-full"
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={image.alt || image.title || 'Search result'}
                          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            console.error('Image failed to load:', getImageUrl(image));
                            if (image.id) {
                              e.target.src = `https://pixabay.com/get/${image.id}-180.jpg`;
                            } else {
                              e.target.src = '/api/placeholder/400/320';
                            }
                            e.target.alt = 'Image failed to load';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <h3 className="text-white font-medium truncate text-sm md:text-base">
                            {image.title || 'Image'}
                          </h3>
                          <p className="text-gray-300 text-xs flex items-center md:text-sm">
                            {image.description || 'No description available'}
                          </p>
                        </div>
                        <div className="p-2 bg-black/30">
                          <p className="text-white text-xs truncate">{image.title || 'Image'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-8 md:p-12 text-center max-w-md mx-auto">
                  <div className="bg-indigo-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Image className="h-8 w-8 text-indigo-200" />
                  </div>
                  <h2 className="text-xl font-medium text-white">No images found</h2>
                  <p className="text-gray-300 mt-2">Try another search term</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 shadow">
                <Image className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ImageSearch Pro
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} ImageSearch Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;