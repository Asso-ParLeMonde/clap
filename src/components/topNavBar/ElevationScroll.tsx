import useScrollTrigger from "@material-ui/core/useScrollTrigger/useScrollTrigger";
import React, { ReactElement } from "react";

interface ElevationScrollProps {
  children: ReactElement;
}

const ElevationScroll: React.FunctionComponent<ElevationScrollProps> = ({ children }: ElevationScrollProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

export default ElevationScroll;
