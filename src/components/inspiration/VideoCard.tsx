import React from "react";

import ButtonBase from "@material-ui/core/ButtonBase";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";

import type { Video } from "types/models/video.type";

interface VideoProps {
  video: Video;
  width: number;
  onClick?(): void;
}

const colors = ["rgb(96, 105, 243)", "rgb(213, 89, 84)", "rgb(250, 225, 108)", "rgb(62, 65, 87)", "rgb(215, 213, 209)", "rgb(162, 220, 174)"];

export const VideoCard: React.FC<VideoProps> = ({ video, width, onClick = () => {} }: VideoProps) => {
  const hours = Math.floor(video.duration / 3600);
  const minutes = Math.floor((video.duration - 3600 * hours) / 60);
  const seconds = video.duration - 3600 * hours - 60 * minutes;
  return (
    <div className="video-card_container" style={{ width: `${width}%`, minWidth: `${width}%` }}>
      <div
        className="video-card"
        style={{
          backgroundColor: video.thumbnailUrl ? "black" : colors[video.id % colors.length],
          backgroundImage: video.thumbnailUrl ? `url(${video.thumbnailUrl})` : "unset",
        }}
      >
        <ButtonBase onClick={onClick}>
          <div className="video-card_play-icon">
            <PlayArrowRoundedIcon />
          </div>
        </ButtonBase>
        <div className="video-card_time">
          {hours > 0 ? `${hours}:` : ""}
          {hours > 0 ? `0${minutes}`.slice(-2) : minutes}:{`0${seconds}`.slice(-2)}
        </div>
      </div>
      <div style={{ marginTop: "0.25rem" }}>{video.title}</div>
    </div>
  );
};
