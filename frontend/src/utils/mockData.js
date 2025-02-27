// This file provides mock data for development purposes
// In a real application, this would be replaced with actual API calls

import axios from 'axios';

export const mockMovies = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '9:56',
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Sintel',
    description: 'Sintel is a fantasy computer animated short film. It\'s the third Blender Open Movie Project.',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sintel_poster.jpg/800px-Sintel_poster.jpg',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '14:48',
    createdAt: '2023-06-22T14:20:00Z'
  },
  {
    id: '3',
    title: 'Tears of Steel',
    description: 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender.',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '12:14',
    createdAt: '2023-07-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Elephant\'s Dream',
    description: 'Elephant\'s Dream is the world\'s first open movie, made entirely with open source graphics software.',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Elephants_Dream_poster.jpg/800px-Elephants_Dream_poster.jpg',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '10:54',
    createdAt: '2023-08-05T16:45:00Z'
  }
];

// Mock user data
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

// Setup mock API handlers
export const setupMockAPI = () => {
  // Create a mock adapter to intercept requests
  const originalAdapter = axios.defaults.adapter;
  
  axios.defaults.adapter = async (config) => {
    // Mock GET /api/movies
    if (config.url === '/api/movies' && config.method === 'get') {
      console.log('Mocking GET /api/movies request, returning mock data');
      return {
        data: mockMovies,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // Mock GET /api/movies/:id
    if (config.url.match(/\/api\/movies\/\d+/) && config.method === 'get') {
      const id = config.url.split('/').pop();
      const movie = mockMovies.find(m => m.id === id);
      
      if (movie) {
        console.log(`Mocking GET /api/movies/${id} request, returning mock data`);
        return {
          data: movie,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        };
      }
    }
    
    // Mock POST /api/auth/login
    if (config.url === '/api/auth/login' && config.method === 'post') {
      console.log('Mocking POST /api/auth/login request, returning mock token');
      return {
        data: {
          token: 'mock-jwt-token',
          user: mockUser
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // Mock POST /api/auth/signup
    if (config.url === '/api/auth/signup' && config.method === 'post') {
      console.log('Mocking POST /api/auth/signup request, returning mock token');
      const requestData = JSON.parse(config.data);
      return {
        data: {
          token: 'mock-jwt-token',
          user: {
            ...mockUser,
            name: requestData.name
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // Mock GET /api/users/me
    if (config.url === '/api/users/me' && config.method === 'get') {
      console.log('Mocking GET /api/users/me request, returning mock user');
      return {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // Mock POST /api/movies/request
    if (config.url === '/api/movies/request' && config.method === 'post') {
      console.log('Mocking POST /api/movies/request, returning success');
      return {
        data: { success: true, message: 'Movie request submitted successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // Mock POST /api/movies/upload
    if (config.url === '/api/movies/upload' && config.method === 'post') {
      console.log('Mocking POST /api/movies/upload, returning success');
      return {
        data: { success: true, message: 'Movie uploaded successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
    
    // For any other requests, use the original adapter
    return originalAdapter(config);
  };
};