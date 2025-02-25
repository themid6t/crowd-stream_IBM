import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = ({ onSelectVideo }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/list')
      .then(response => setVideos(response.data))
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  const handleVideoClick = (videoId) => {
    axios.get(`http://127.0.0.1:5000/stream/${videoId}`)
      .then(response => {
        console.log('HLS URL:', response.data.hls_url);
        onSelectVideo(`http://127.0.0.1:5000/${response.data.hls_url}`);
      })
      .catch(error => console.error('Error fetching stream URL:', error));
  };

  return (
    <div className="video-list">
      {videos.map(video => (
        <div key={video.id} className="video-item" onClick={() => handleVideoClick(video.id)}>
          {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} className="video-thumbnail" />}
          <div>{video.title}</div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
