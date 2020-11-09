import React from "react";

interface VideoProps {
  id: number;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  width: number;
  onClick?(): void;
}

export const VideoCard: React.FC<VideoProps> = ({ id, videoUrl, thumbnailUrl, title, width, onClick = () => {} }: VideoProps) => {
  return (
    <div className="video-card_container" style={{ width: `${width}%`, minWidth: `${width}%` }}>
      <div className="video-card">
        <div onClick={onClick}></div>
      </div>
      <div style={{ marginTop: "0.25rem" }}>{title}</div>
    </div>
  );
};
