import classnames from "classnames";
import React from "react";

import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { VideoCard } from "src/components/inspiration/VideoCard";
import type { Video } from "types/models/video.type";

interface VideoCarouselProps {
  themeName: string;
  videos: Video[];
  tilesCount: number;
  tileWidth: number;
  sideSize: number;
  setSelectedVideo(video: Video): void;
}

export const VideoCarousel: React.FC<VideoCarouselProps> = ({ themeName, videos, tilesCount, tileWidth, sideSize, setSelectedVideo }: VideoCarouselProps) => {
  const [carousel, setCarousel] = React.useState<{ page: number; position: number; animate: boolean }>({
    page: 0,
    position: sideSize,
    animate: false,
  });
  const timeout = React.useRef<NodeJS.Timeout | null>(null);
  const pageCount = Math.ceil(videos.length / tilesCount);

  const onSelectVideo = (index: number) => () => {
    setSelectedVideo(videos[index]);
  };

  const reset = React.useCallback(
    (pageDelta: number) => {
      setCarousel((c) => ({
        page: c.page + pageDelta,
        position: c.page + pageDelta === 0 ? sideSize : sideSize - (tilesCount + (c.page + pageDelta > 1 ? 1 : 0)) * tileWidth,
        animate: false,
      }));
      timeout.current = null;
    },
    [sideSize, tileWidth, tilesCount],
  );
  const goNext = () => {
    if (timeout.current) {
      return;
    }
    setCarousel((c) => ({ page: c.page, position: sideSize - ((c.page === 0 ? 1 : 2) * tilesCount + (c.page > 1 ? 1 : 0)) * tileWidth, animate: true }));
    timeout.current = setTimeout(() => {
      reset(1);
    }, 610);
  };
  const goPrevious = () => {
    if (timeout.current) {
      return;
    }
    setCarousel((c) => ({ page: c.page, position: sideSize - (c.page > 1 ? tileWidth : 0), animate: true }));
    timeout.current = setTimeout(() => {
      reset(-1);
    }, 610);
  };

  React.useEffect(() => {
    setCarousel((c) => ({ ...c, page: 0 }));
    reset(0);
  }, [reset]);

  return (
    <>
      <Typography variant="h2" className="video-carousel__title" style={{ marginLeft: `${sideSize}%` }}>
        {themeName}
      </Typography>
      <div className="video-carousel__mask">
        <div className="video-carousel__indicator" style={{ margin: `0 ${sideSize}%` }}>
          {new Array(pageCount).fill(0).map((_: unknown, index: number) => (
            <div
              key={`indicator_${index}`}
              className={classnames("video-carousel__page-indicator", {
                "video-carousel__page-indicator--selected": carousel.page === index,
                "video-carousel__page-indicator--not-visible": pageCount < 2,
              })}
            ></div>
          ))}
        </div>
        <div
          className={classnames("video-carousel__container", {
            "video-carousel__container--no-transition": !carousel.animate,
          })}
          style={{ transform: `translateX(${carousel.position}%)` }}
        >
          {carousel.page > 1 && <VideoCard key={tilesCount * (carousel.page - 1) - 1} width={tileWidth} video={videos[tilesCount * (carousel.page - 1) - 1]} />}

          {/* FROM 1 TO tilesCount (left not visible) */}
          {carousel.page !== 0 && new Array(tilesCount).fill(0).map((_: unknown, index: number) => <VideoCard key={tilesCount * (carousel.page - 1) + index} width={tileWidth} video={videos[tilesCount * (carousel.page - 1) + index]} />)}

          {/* FROM 1 TO tilesCount (visible) */}
          {new Array(tilesCount).fill(0).map((_: unknown, index: number) => {
            const videoNumber = tilesCount * carousel.page + index;
            if (videoNumber >= videos.length) {
              return null;
            }
            return <VideoCard key={videoNumber} width={tileWidth} video={videos[videoNumber]} onClick={onSelectVideo(videoNumber)} />;
          })}

          {/* FROM 1 TO tilesCount (right not visible) */}
          {carousel.page < pageCount - 1 &&
            new Array(tilesCount).fill(0).map((_: unknown, index: number) => {
              const videoNumber = tilesCount * (carousel.page + 1) + index;
              if (videoNumber >= videos.length) {
                return null;
              }
              return <VideoCard key={videoNumber} width={tileWidth} video={videos[videoNumber]} />;
            })}

          {carousel.page < pageCount - 2 && <VideoCard key={tilesCount * (carousel.page + 2)} width={tileWidth} video={videos[tilesCount * (carousel.page + 2)]} />}
        </div>
        {carousel.page !== 0 && (
          <div className="video-carousel__button" style={{ width: `${sideSize}%` }} onClick={goPrevious}>
            {!carousel.animate && <ChevronLeftIcon color="primary" fontSize="inherit" />}
          </div>
        )}
        {carousel.page < pageCount - 1 && (
          <div className="video-carousel__button video-carousel__button--right" style={{ width: `${sideSize}%` }} onClick={goNext}>
            {!carousel.animate && <ChevronRightIcon color="primary" fontSize="inherit" />}
          </div>
        )}
      </div>
    </>
  );
};
