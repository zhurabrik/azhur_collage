import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { LayoutConfig } from "../data/layouts";
import { Box } from "@mui/material";

interface CanvasProps {
  layoutConfig: LayoutConfig;
  zoom: number;
}

const Canvas = ({ layoutConfig, zoom }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    setCanvas,
    canvas,
    setLayers,
    setSelectedObject,
    skipLockedCheck,
    setSkipLockedCheck
  } = useEditorStore();
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: layoutConfig.width,
      height: layoutConfig.height,
      backgroundColor: "#f8f8f8",
    });

    setCanvas(newCanvas);
    setIsCanvasReady(true);

    loadLayout(newCanvas, layoutConfig).then(() => {
      centerCanvas(newCanvas);
    });

    return () => {
      if (newCanvas.getElement()) {
        newCanvas.dispose();
        setCanvas(null);
      }
    };
  }, [layoutConfig, setCanvas]);

  useEffect(() => {
    if (!canvas || !isCanvasReady) return;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: layoutConfig.width * zoom,
      height: layoutConfig.height * zoom,
    });

    requestAnimationFrame(() => centerCanvas(canvas));
    canvas.renderAll();
  }, [zoom, canvas, layoutConfig, isCanvasReady]);

  useEffect(() => {
    if (!canvas) return;

    canvas.preserveObjectStacking = true;

    const updateLayers = () => updateLayerList(canvas);

    const handleSelection = (e: fabric.IEvent) => {
      const selected = e.selected?.[0] || null;

      if (selected && (selected as any).locked && !skipLockedCheck) {
        canvas.discardActiveObject();
        setSelectedObject(null);
        canvas.renderAll();
        return;
      }

      setSelectedObject(selected);
      setSkipLockedCheck(false);
    };

    const preventLockedSelect = (e: fabric.IEvent) => {
      const target = e.target as any;
    
      // 💡 Разрешаем выбор, если это был программный обход
      if (skipLockedCheck) return;
    
      if (target?.locked) {
        e.e.preventDefault();
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    };
    

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("mouse:down", preventLockedSelect);
    canvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("mouse:down", preventLockedSelect);
      canvas.off("selection:cleared", () => setSelectedObject(null));
    };
  }, [canvas, skipLockedCheck]);

  const updateLayerList = (canvasInstance: fabric.Canvas) => {
    const sortedLayers = canvasInstance.getObjects().slice().reverse();
    setLayers(sortedLayers);
  };

  const centerCanvas = (canvasInstance: fabric.Canvas) => {
    if (!containerRef.current || !canvasInstance.getElement()) return;

    const container = containerRef.current;
    const canvasWidth = canvasInstance.width!;
    const canvasHeight = canvasInstance.height!;
    const scrollPadding = 300;

    container.style.overflow = "auto";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "100%";

    container.style.minWidth = `${canvasWidth + scrollPadding}px`;
    container.style.minHeight = `${canvasHeight + scrollPadding}px`;

    container.scrollLeft = (canvasWidth + scrollPadding) / 2 - container.clientWidth / 2;
    container.scrollTop = (canvasHeight + scrollPadding) / 2 - container.clientHeight / 2;
  };

  // 🔥 Асинхронная и безопасная загрузка слоёв
  const loadLayout = async (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    const { width, height, background, layers } = config as any;

    canvasInstance.clear(); // очистка от старых объектов

    // 📦 Загружаем фон
    if (background) {
      await new Promise<void>((resolve) => {
        fabric.Image.fromURL(background, (img) => {
          img.set({
            left: 0,
            top: 0,
            scaleX: width / img.width!,
            scaleY: height / img.height!,
            selectable: false,
            evented: false,
          });
          canvasInstance.setBackgroundImage(img, () => {
            canvasInstance.renderAll();
            resolve();
          });
        });
      });
    }

    const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    for (const layer of sorted) {
      if (layer.type === "image") {
        await new Promise<void>((resolve) => {
          fabric.Image.fromURL(layer.src, (img) => {
            const scale = layer.width / img.width!;
            img.set({
              left: layer.left,
              top: layer.top,
              scaleX: scale,
              scaleY: scale,
              selectable: !layer.locked,
              evented: !layer.locked,
              hasBorders: !layer.locked,
              hasControls: !layer.locked,
            });
            (img as any).locked = layer.locked;
            canvasInstance.add(img);
            resolve();
          });
        });
      } else if (layer.type === "text") {
        const textBox = new fabric.Textbox(layer.text, {
          left: layer.left,
          top: layer.top,
          fontSize: layer.fontSize,
          fill: layer.fill || "#000",
          fontFamily: layer.fontFamily || "Roboto",
          textAlign: layer.textAlign || "left",
          selectable: !layer.locked,
          evented: !layer.locked,
          hasBorders: !layer.locked,
          hasControls: !layer.locked,
        });
        (textBox as any).locked = layer.locked;
        canvasInstance.add(textBox);
      }
    }

    canvasInstance.renderAll();
  };

  return (
    <Box
      ref={containerRef}
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        overflow: "auto",
        minWidth: `${layoutConfig.width + 300}px`,
        minHeight: `${layoutConfig.height + 300}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #555",
          background: "#fff",
          display: "block",
        }}
      />
    </Box>
  );
};

export default Canvas;
