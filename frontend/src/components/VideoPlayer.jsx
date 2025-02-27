import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    let hls;
    
    // Function to initialize HLS
    const initializeHls = () => {
      if (hls) {
        hls.destroy();
      }
      
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hls.loadSource(src);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.error('Unrecoverable HLS error:', data);
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari, which has native HLS support
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        });
      }
    };
    
    initializeHls();
    
    // Cleanup
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);
  
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        controls
        playsInline
      />
    </div>
  );
}

export default VideoPlayer;