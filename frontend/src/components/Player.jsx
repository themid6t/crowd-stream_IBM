import React from 'react';
import ReactHlsPlayer from "react-hls-player";

const Player = ({ hlsUrl }) => {
  return (
    <ReactHlsPlayer
      src={hlsUrl}
      autoPlay={false}
      controls={true}
      width="80%"
      height="auto"
    />
  );
};

export default Player;
