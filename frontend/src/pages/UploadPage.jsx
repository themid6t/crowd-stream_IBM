import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [movieFile, setMovieFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMovieFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMovieFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Movie title is required');
      return;
    }
    
    if (!thumbnail) {
      setError('Thumbnail image is required');
      return;
    }
    
    if (!movieFile) {
      setError('Movie file is required');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    // Create form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail);
    formData.append('movie', movieFile);
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/upload`, formData, { // <----------------------------------   Upload endpoint
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setSuccess(true);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading movie:', err);
      setError(err.response?.data?.message || 'Failed to upload movie');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload a Movie</h1>
      
      {success ? (
        <div className="bg-green-100 text-green-700 p-6 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-medium mt-3">Upload Successful!</h2>
          <p className="mt-2">Your movie is being processed and will be available soon.</p>
          <p className="mt-1 text-sm">Redirecting to home page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-lighter rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Movie Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter movie title"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Enter movie description"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail Image *
            </label>
            <div className="mt-1 flex items-center">
              <div className="flex-shrink-0">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-5">
                <label htmlFor="thumbnail-upload" className="btn btn-outline cursor-pointer">
                  Choose Image
                </label>
                <input
                  id="thumbnail-upload"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="sr-only"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Movie File *
            </label>
            <div className="mt-1">
              <label
                htmlFor="movie-upload"
                className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer hover:border-primary dark:hover:border-primary-light"
              >
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <span className="relative rounded-md font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light">
                      Upload a movie file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4, MKV, AVI up to 10GB
                  </p>
                  {movieFile && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                      Selected: {movieFile.name}
                    </p>
                  )}
                </div>
              </label>
              <input
                id="movie-upload"
                name="movie"
                type="file"
                accept=".mp4, .mkv, .avi, .mov, .flv, .wmv"//"video/*"
                onChange={handleMovieFileChange}
                className="sr-only"
              />
            </div>
          </div>
          
          {isUploading && (
            <div className="mb-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-primary">
                      Uploading...
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Movie'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UploadPage;