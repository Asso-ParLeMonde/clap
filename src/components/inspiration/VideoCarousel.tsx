import classnames from "classnames";
import React from "react";

import Typography from "@material-ui/core/Typography";

import { VideoCard } from "src/components/inspiration/VideoCard";
import { useWindowDimensions } from "src/hooks/useWindowDimensions";

interface VideoCarouselProps {
  themeName: string;
  videos: number;
}

const getSizes = (width: number): { tilesCount: number; tileWidth: number; sideSize: number } => {
  if (width >= 1500) {
    return { tilesCount: 6, tileWidth: (3 / 20) * 100, sideSize: (1 / 20) * 100 };
  } else if (width >= 960) {
    return { tilesCount: 4, tileWidth: (3 / 14) * 100, sideSize: (1 / 14) * 100 };
  } else if (width >= 650) {
    return { tilesCount: 3, tileWidth: (6 / 20) * 100, sideSize: (1 / 20) * 100 };
  }
  return { tilesCount: 2, tileWidth: (6 / 14) * 100, sideSize: (1 / 14) * 100 };
};

export const VideoCarousel: React.FC<VideoCarouselProps> = ({ themeName, videos }: VideoCarouselProps) => {
  const { width } = useWindowDimensions();
  const { tilesCount, tileWidth, sideSize } = getSizes(width);
  const [carousel, setCarousel] = React.useState<{ page: number; position: number; animate: boolean }>({
    page: 0,
    position: sideSize,
    animate: false,
  });
  const timeout = React.useRef<NodeJS.Timeout | null>(null);
  const pageCount = Math.ceil(videos / tilesCount);

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
        <div
          className={classnames("video-carousel__container", {
            "video-carousel__container--no-transition": !carousel.animate,
          })}
          style={{ transform: `translateX(${carousel.position}%)` }}
        >
          {carousel.page > 1 && <VideoCard key={tilesCount * (carousel.page - 1) - 1} id={0} videoUrl="" thumbnailUrl="" title={`item ${tilesCount * (carousel.page - 1) - 1}`} width={tileWidth} onClick={goPrevious} />}

          {/* FROM 1 TO tilesCount (left not visible) */}
          {carousel.page !== 0 &&
            new Array(tilesCount)
              .fill(0)
              .map((_: unknown, index: number) => <VideoCard key={tilesCount * (carousel.page - 1) + index} id={0} videoUrl="" thumbnailUrl="" title={`item ${tilesCount * (carousel.page - 1) + index}`} width={tileWidth} onClick={goPrevious} />)}

          {/* FROM 1 TO tilesCount (visible) */}
          {new Array(tilesCount).fill(0).map((_: unknown, index: number) => {
            const videoNumber = tilesCount * carousel.page + index;
            if (videoNumber >= videos) {
              return null;
            }
            return <VideoCard key={videoNumber} id={0} videoUrl="" thumbnailUrl="" title={`item ${videoNumber}`} width={tileWidth} />;
          })}

          {/* FROM 1 TO tilesCount (right not visible) */}
          {carousel.page < pageCount - 1 &&
            new Array(tilesCount).fill(0).map((_: unknown, index: number) => {
              const videoNumber = tilesCount * (carousel.page + 1) + index;
              if (videoNumber >= videos) {
                return null;
              }
              return <VideoCard key={videoNumber} id={0} videoUrl="" thumbnailUrl="" title={`item ${videoNumber}`} width={tileWidth} onClick={goNext} />;
            })}

          {carousel.page < pageCount - 2 && <VideoCard key={tilesCount * (carousel.page + 2)} id={0} videoUrl="" thumbnailUrl="" title={`item ${tilesCount * (carousel.page + 1)}`} width={tileWidth} onClick={goPrevious} />}
        </div>
      </div>
    </>
  );
};
