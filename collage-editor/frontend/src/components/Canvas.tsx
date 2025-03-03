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
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (canvas) {
      console.log("🔄 Обновление существующего холста...");
      return;
    }

    console.log("🎨 Создание нового холста...");
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: layoutConfig.width,
      height: layoutConfig.height,
      backgroundColor: "#f8f8f8",
    });

    setCanvas(newCanvas);
    setIsCanvasReady(true);

    // 🛠 Восстанавливаем холст из sessionStorage (если есть)
    const savedState = sessionStorage.getItem("canvasState");
    if (savedState) {
      newCanvas.loadFromJSON(savedState, () => {
        console.log("✅ Холст восстановлен!");
        newCanvas.renderAll();
      });
    } else {
      loadLayout(newCanvas, layoutConfig);
    }

    return () => {
      if (newCanvas && newCanvas.getElement()) {
        try {
          console.log("🗑 Удаление холста...");
          newCanvas.clear();
          newCanvas.dispose();
        } catch (error) {
          console.warn("❌ Ошибка при удалении canvas:", error);
        }
      }
      setCanvas(null);
    };
  }, [layoutConfig, setCanvas]);

  useEffect(() => {
    if (canvas && isCanvasReady) {
      console.log(`🔍 Применение масштаба: ${zoom}x`);
      canvas.setZoom(zoom);
      canvas.setDimensions({
        width: layoutConfig.width * zoom,
        height: layoutConfig.height * zoom,
      });
      canvas.renderAll();
    }
  }, [zoom, canvas, layoutConfig, isCanvasReady]);

  // ✅ Функция загрузки макета
  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    if (!canvasInstance.getElement()) {
      console.warn("❌ Ошибка: canvasInstance не существует!");
      return;
    }

    const { width, height, background, images, texts } = config;

    if (background) {
      fabric.Image.fromURL(background, (img) => {
        if (!img || !img.width || !img.height) {
          console.warn("❌ Ошибка загрузки фона");
          return;
        }
        img.set({
          scaleX: width / img.width!,
          scaleY: height / img.height!,
        });

        if (canvasInstance.getElement()) {
          canvasInstance.setBackgroundImage(img, canvasInstance.renderAll.bind(canvasInstance));
        }
      });
    }

    images.forEach(({ src, left, top, width }) => {
      fabric.Image.fromURL(src, (img) => {
        if (!img || !img.width || !img.height) {
          console.warn(`❌ Ошибка загрузки ${src}`);
          return;
        }

        let scale = width / img.width!;
        img.set({ left, top, scaleX: scale, scaleY: scale });

        if (canvasInstance.getElement()) {
          canvasInstance.add(img);
        }
      });
    });

    texts.forEach(({ text, left, top, fontSize }) => {
      if (canvasInstance.getElement()) {
        canvasInstance.add(new fabric.Textbox(text, { left, top, fontSize, fill: "#000" }));
      }
    });
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <canvas ref={canvasRef} style={{ border: "2px solid #555", background: "#fff" }} />
    </div>
  );
};

export default Canvas;
