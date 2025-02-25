import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Player from './components/Player';
import VideoList from './components/VideoList';

function App() {
  const [hlsUrl, setHlsUrl] = useState("");

  return (
    <div className="container">
      <div className="row justify-content-center">
        <VideoList onSelectVideo={setHlsUrl} />
      </div>
      {hlsUrl && (
        <div className="row justify-content-center">
          <Player hlsUrl={hlsUrl} />
        </div>
      )}
    </div>
  );
}

export default App;
