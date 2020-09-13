import Croppie from "croppie";
import React, { forwardRef, memo, useEffect, useImperativeHandle } from "react";

// import "croppie/croppie.css";

interface ImgCroppieProps {
  src: string;
  alt: string;
  imgWidth?: number;
  imgHeight?: number;
}

export interface ImgCroppieRef {
  getBlob(): Promise<Blob>;
}

const ImgCroppieComponent: React.ForwardRefRenderFunction<ImgCroppieRef, ImgCroppieProps> = ({ src, alt, imgWidth = 340, imgHeight = 340 }: ImgCroppieProps, ref: React.Ref<ImgCroppieRef>) => {
  const croppie = React.useRef<Croppie | null>(null);

  useImperativeHandle(ref, () => ({
    async getBlob() {
      if (croppie.current === null) {
        return null;
      }
      return await croppie.current.result({
        type: "blob",
        format: "jpeg",
        circle: false,
      });
    },
  }));

  // init croppie
  useEffect(() => {
    croppie.current = new Croppie(document.getElementById("my-croppie-img"), {
      viewport: {
        width: imgWidth,
        height: imgHeight,
        type: "square",
      },
    });
    return () => {
      croppie.current = null;
    };
  }, [imgHeight, imgWidth]);

  return <img id="my-croppie-img" alt={alt} src={src} />;
};

export const ImgCroppie = memo(forwardRef(ImgCroppieComponent));
