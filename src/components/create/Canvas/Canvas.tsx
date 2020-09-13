import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import { IconButton, withStyles, Tooltip } from "@material-ui/core";
import AdjustIcon from "@material-ui/icons/Adjust";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import ClearIcon from "@material-ui/icons/Clear";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";

import { useTranslation } from "src/i18n/useTranslation";

import { ClearModal } from "./ClearModal";
import { ColorModal } from "./ColorModal";
import { SizeModal } from "./SizeModal";

const ActionButton = withStyles({
  root: {
    border: "1px solid",
    borderBottom: "none",
    borderRadius: 0,
  },
})(IconButton);

const sizes = [2, 4, 8];

export interface CanvasRef {
  getBlob(): Promise<Blob>;
}

interface Path {
  color: string;
  size: number;
  lines: Array<number[]>;
}

const CanvasComponent: React.ForwardRefRenderFunction<CanvasRef> = (_, ref: React.Ref<CanvasRef>) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [paths, setPaths] = useState<Array<Path>>([]);
  const [redoPaths, setRedoPaths] = useState<Array<Path>>([]);
  const [clear, setClear] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [color, setColor] = useState<string>("#444");
  const [size, setSize] = useState<number>(0);
  const [showModalColor, setShowModalColor] = useState<boolean>(false);
  const [showModalSize, setShowModalSize] = useState<boolean>(false);
  const [showModalClear, setShowModalClear] = useState<boolean>(false);

  const getCtx = React.useCallback(() => (canvasRef.current ? canvasRef.current.getContext("2d") : null), []);

  // Listen for resize events
  useEffect(() => {
    const resize = () => {
      setClear(true);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const getXY = (event: React.MouseEvent<HTMLCanvasElement>) => ({
    x: event.clientX - canvasRef.current.getBoundingClientRect().left,
    y: event.clientY - canvasRef.current.getBoundingClientRect().top,
  });

  const drawPath = React.useCallback(
    (x1: number, y1: number, x2: number, y2: number, isNew: boolean, save: boolean, specificColor?: string, specificSize?: number) => {
      const ctx = getCtx();
      if (ctx === null) return;
      const delta = (specificSize !== undefined ? sizes[specificSize] : sizes[size]) / 4;
      ctx.beginPath();
      ctx.strokeStyle = specificColor || color;
      ctx.lineWidth = specificSize !== undefined ? sizes[specificSize] : sizes[size];
      ctx.lineCap = "round";
      ctx.moveTo(x1 - delta, y1 - delta);
      ctx.lineTo(x2 - delta, y2 - delta);
      ctx.stroke();
      ctx.closePath();

      if (!save) return;
      const allPaths = [...paths];
      if (isNew) {
        allPaths.push({ color, size, lines: [[x1, y1, x2, y2]] });
      } else {
        (allPaths[paths.length - 1] || { lines: [] }).lines.push([x1, y1, x2, y2]);
      }
      setPaths(allPaths);
    },
    [color, getCtx, paths, size],
  );

  const drawAllPaths = React.useCallback(() => {
    for (const path of paths) {
      for (const line of path.lines) {
        const [x1, y1, x2, y2] = line;
        drawPath(x1, y1, x2, y2, false, false, path.color, path.size);
      }
    }
  }, [drawPath, paths]);

  // Resize canvas
  useEffect(() => {
    setClear(false);
    const ctx = getCtx();
    if (canvasRef.current && ctx !== null) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      drawAllPaths();
    }
  }, [canvasRef, getCtx, clear, drawAllPaths]);

  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (ctx === null) return;
    const { x, y } = getXY(event);
    drawPath(x, y, x, y, true, true);
    setIsDrawing(true);
    setPosition({ x, y });
    setRedoPaths([]);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (ctx === null || !isDrawing) return;
    const { x, y } = getXY(event);
    const { x: prevX, y: prevY } = position;
    drawPath(prevX, prevY, x, y, false, true);
    setPosition({ x, y });
  };

  const onMouseUpOrOut = () => {
    const ctx = getCtx();
    if (ctx === null || !isDrawing) return;
    setIsDrawing(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    setRedoPaths([...redoPaths, ...paths.splice(paths.length - 1, 1)]);
    setPaths(paths);
    setClear(true);
  };
  const handleRedo = () => {
    if (redoPaths.length === 0) return;
    setPaths([...paths, ...redoPaths.splice(redoPaths.length - 1, 1)]);
    setRedoPaths(redoPaths);
    setClear(true);
  };

  const handleOpenModalColor = () => {
    setShowModalColor(true);
  };
  const handleOpenModalSize = () => {
    setShowModalSize(true);
  };
  const handleOpenModalClear = () => {
    setShowModalClear(true);
  };
  const handleCloseModalClear = (confirm: boolean) => () => {
    setShowModalClear(false);
    if (confirm) {
      setPaths([]);
      setRedoPaths([]);
      setClear(true);
    }
  };

  useImperativeHandle(ref, () => ({
    getBlob() {
      const ctx = getCtx();
      if (ctx === null)
        return new Promise((_, reject) => {
          reject();
        });
      return new Promise((resolve) => {
        canvasRef.current.toBlob(function (blob) {
          resolve(blob);
        });
      });
    },
  }));

  return (
    <div>
      <div className="draw-canvas-container-max-width">
        <div>
          <div role="group" className="actions-buttons-container" aria-label="outlined primary button group">
            <Tooltip title={t("tool_color")}>
              <ActionButton aria-label={t("tool_color")} onClick={handleOpenModalColor}>
                <BorderColorIcon
                  style={{
                    color,
                    stroke: `${color === "white" ? "#444" : "none"}`,
                  }}
                />
              </ActionButton>
            </Tooltip>
            <Tooltip title={t("tool_stroke_width")}>
              <ActionButton aria-label={t("tool_stroke_width")} onClick={handleOpenModalSize}>
                <AdjustIcon />
              </ActionButton>
            </Tooltip>
            <Tooltip title={t("tool_go_back")}>
              <ActionButton aria-label={t("tool_go_back")} onClick={handleUndo}>
                <UndoIcon color="secondary" />
              </ActionButton>
            </Tooltip>
            <Tooltip title={t("tool_go_forward")}>
              <ActionButton aria-label={t("tool_go_forward")} style={{ borderRight: "1px solid" }} onClick={handleRedo}>
                <RedoIcon color="secondary" />
              </ActionButton>
            </Tooltip>
            <div style={{ flex: 1 }} />
            <Tooltip title={t("tool_clear")}>
              <ActionButton aria-label={t("tool_clear")} onClick={handleOpenModalClear}>
                <ClearIcon color="error" />
              </ActionButton>
            </Tooltip>
          </div>
        </div>
        <div className="draw-canvas-container">
          <canvas ref={canvasRef} className="draw-canvas" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUpOrOut} onMouseOut={onMouseUpOrOut} />
        </div>
      </div>

      <ColorModal open={showModalColor} setOpen={setShowModalColor} setColor={setColor} />
      <SizeModal open={showModalSize} setOpen={setShowModalSize} setSize={setSize} />
      <ClearModal open={showModalClear} onClear={handleCloseModalClear} />
    </div>
  );
};

export const Canvas = forwardRef(CanvasComponent);
