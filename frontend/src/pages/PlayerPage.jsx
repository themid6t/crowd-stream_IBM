import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';

function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`/api/movies/${id}`);   // <----------------------------------  Stream movie by ID
      const response = await axios.get(`http://127.0.0.1:5000/stream/${id}`);   // <----------------------------------  Stream movie by ID
      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Failed to load movie. It may have been removed or is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error || 'Movie not found'}
        </div>
        <button onClick={goBack} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={goBack}
        className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
      >
        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-lg overflow-hidden">
        <VideoPlayer 
          src={`http://127.0.0.1:5000/${movie.hls_url}`} 
          poster={movie.thumbnailUrl} 
        />
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {movie.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="mr-4">
              Added {new Date(movie.createdAt).toLocaleDateString()}
            </span>
            {movie.duration && (
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {movie.duration}
              </span>
            )}
          </div>
          
          {movie.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {movie.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;