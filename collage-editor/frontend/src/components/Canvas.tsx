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
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, canvas } = useEditorStore();
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (canvas) {
      console.log("🔄 Обновление холста...");
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

    const savedState = sessionStorage.getItem("canvasState");
    if (savedState) {
      newCanvas.loadFromJSON(savedState, () => {
        console.log("✅ Холст восстановлен!");
        restoreImages(newCanvas, layoutConfig);
        centerCanvas(newCanvas);
      });
    } else {
      loadLayout(newCanvas, layoutConfig);
      centerCanvas(newCanvas);
    }

    return () => {
      if (newCanvas && newCanvas.getElement()) {
        console.log("🗑 Сохранение и удаление холста...");
        sessionStorage.setItem("canvasState", JSON.stringify(newCanvas.toJSON()));
        newCanvas.dispose();
      }
      setCanvas(null);
    };
  }, [layoutConfig, setCanvas]);

  useEffect(() => {
    if (canvas && isCanvasReady) {
      console.log(`🔍 Применение масштаба: ${zoom}x`);

      const scaledWidth = layoutConfig.width * zoom;
      const scaledHeight = layoutConfig.height * zoom;

      canvas.setDimensions({ width: scaledWidth, height: scaledHeight });
      canvas.setZoom(zoom);
      canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);

      centerCanvas(canvas);

      canvas.renderAll();
    }
  }, [zoom, canvas, layoutConfig, isCanvasReady]);

  const centerCanvas = (canvasInstance: fabric.Canvas) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvasWidth = canvasInstance.width!;
    const canvasHeight = canvasInstance.height!;

    // 🔥 Добавляем запас скролла
    const scrollPadding = 200;

    container.style.overflow = "auto";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "100%";

    // Устанавливаем размер контейнера больше холста
    container.style.minWidth = `${canvasWidth + scrollPadding}px`;
    container.style.minHeight = `${canvasHeight + scrollPadding}px`;

    // Центрируем холст в контейнере
    container.scrollLeft = (canvasWidth + scrollPadding) / 2 - container.clientWidth / 2;
    container.scrollTop = (canvasHeight + scrollPadding) / 2 - container.clientHeight / 2;
  };

  const restoreImages = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    console.log("🔄 Восстанавливаем изображения...");
    const { width, height, background, images } = config;

    if (background) {
      fabric.Image.fromURL(background, (img) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: width / img.width!,
          scaleY: height / img.height!,
        });
        canvasInstance.setBackgroundImage(img, canvasInstance.renderAll.bind(canvasInstance));
      });
    }

    images.forEach(({ src, left, top, width }) => {
      fabric.Image.fromURL(src, (img) => {
        let scale = width / img.width!;
        img.set({ left, top, scaleX: scale, scaleY: scale });
        canvasInstance.add(img);
      });
    });

    canvasInstance.renderAll();
  };

  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    console.log("🖼 Загрузка макета...");
    restoreImages(canvasInstance, config);

    config.texts.forEach(({ text, left, top, fontSize }) => {
      canvasInstance.add(new fabric.Textbox(text, { left, top, fontSize, fill: "#000" }));
    });

    canvasInstance.renderAll();
  };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} style={{ border: "2px solid #555", background: "#fff" }} />
    </div>
  );
};

export default Canvas;
