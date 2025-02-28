import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { LayoutConfig } from "../data/layouts";

interface CanvasProps {
  layoutConfig: LayoutConfig;
  zoom: number;
}

const Canvas = ({ layoutConfig, zoom }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas } = useEditorStore();
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    setDimensions({ width: layoutConfig.width, height: layoutConfig.height });
  }, [layoutConfig]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (canvas) {
      try {
        if (canvas.getElement() && canvas.getElement().parentNode) {
          canvas.dispose();
        }
      } catch (error) {
        console.warn("❌ Ошибка при очистке canvas:", error);
      }
      setCanvas(null);
    }

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: "#f8f8f8",
    });

    setCanvas(newCanvas);
    loadLayout(newCanvas, layoutConfig);

    return () => {
      try {
        if (newCanvas.getElement() && newCanvas.getElement().parentNode) {
          newCanvas.dispose();
        }
      } catch (error) {
        console.warn("❌ Ошибка при удалении canvas:", error);
      }
    };
  }, [layoutConfig, setCanvas, dimensions]);

  useEffect(() => {
    if (canvas && canvas.getElement()) {
      canvas.setZoom(zoom);
      canvas.setDimensions({
        width: dimensions.width * zoom,
        height: dimensions.height * zoom,
      });
      canvas.renderAll();
    }
  }, [zoom, canvas, dimensions]);

  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    const { width, height, background, images, texts } = config;

    // Фон
    fabric.Image.fromURL(background, (img) => {
      img.set({ scaleX: width / img.width!, scaleY: height / img.height! });
      canvasInstance.setBackgroundImage(img, canvasInstance.renderAll.bind(canvasInstance));
    });

    // Картинки
    images.forEach(({ src, left, top, width }) => {
      fabric.Image.fromURL(src, (img) => {
        let scale = width / img.width!;
        img.set({ left, top, scaleX: scale, scaleY: scale });
        canvasInstance.add(img);
      });
    });

    // Текст
    texts.forEach(({ text, left, top, fontSize }) => {
      canvasInstance.add(new fabric.Textbox(text, { left, top, fontSize, fill: "#000" }));
    });
  };

  return (
    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ border: "2px solid #555", background: "#fff" }} />
    </div>
  );
};

export default Canvas;
