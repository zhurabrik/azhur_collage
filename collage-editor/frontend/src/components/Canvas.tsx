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

    console.log("🎨 Создание нового холста...");
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: layoutConfig.width,
      height: layoutConfig.height,
      backgroundColor: "#f8f8f8",
    }) as fabric.Canvas; // ✅ Приводим к `fabric.Canvas`

    setCanvas(newCanvas);
    setIsCanvasReady(true);

    const savedState = sessionStorage.getItem("canvasState");
    if (savedState) {
      try {
        newCanvas.loadFromJSON(savedState, () => {
          if (!newCanvas.getElement()) return console.error("❌ Ошибка: Холст удалён до загрузки!");
          console.log("✅ Холст восстановлен!");
          restoreElements(newCanvas, layoutConfig);
          centerCanvas(newCanvas);
          newCanvas.renderAll();
        });
      } catch (error) {
        console.error("❌ Ошибка загрузки холста:", error);
      }
    } else {
      loadLayout(newCanvas, layoutConfig);
      centerCanvas(newCanvas);
    }

    return () => {
      if (!newCanvas.getElement()) return; // ✅ Фикс удаления холста

      console.log("🗑 Сохранение и удаление холста...");
      sessionStorage.setItem("canvasState", JSON.stringify(newCanvas.toJSON()));

      try {
        newCanvas.dispose();
        setCanvas(null);
      } catch (error) {
        console.warn("❌ Ошибка при удалении canvas:", error);
      }
    };
  }, [layoutConfig, setCanvas]);

  useEffect(() => {
    if (!canvas || !isCanvasReady) return;

    console.log(`🔍 Применение масштаба: ${zoom}x`);
    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: layoutConfig.width * zoom,
      height: layoutConfig.height * zoom,
    });

    requestAnimationFrame(() => centerCanvas(canvas));
    canvas.renderAll();
  }, [zoom, canvas, layoutConfig, isCanvasReady]);

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

  const restoreElements = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    if (!canvasInstance.getElement()) return;
    console.log("🔄 Восстанавливаем элементы...");

    const { width, height, background, images, texts } = config;

    if (background) {
      fabric.Image.fromURL(background, (img) => {
        if (!img || !img.width || !img.height) {
          console.warn("❌ Ошибка загрузки фона");
          return;
        }
        img.set({
          left: 0,
          top: 0,
          scaleX: width / img.width!,
          scaleY: height / img.height!,
        });

        canvasInstance.setBackgroundImage(img, () => {
          if (!canvasInstance.getElement()) return;
          canvasInstance.renderAll();
        });
      });
    }

    images.forEach(({ src, left, top, width }) => {
      fabric.Image.fromURL(src, (img) => {
        let scale = width / img.width!;
        img.set({ left, top, scaleX: scale, scaleY: scale });
        if (!canvasInstance.getElement()) return;
        canvasInstance.add(img);
      });
    });

    texts.forEach(({ text, left, top, fontSize }) => {
      if (!text) return;
      const textBox = new fabric.Textbox(text, { left, top, fontSize, fill: "#000" });
      if (!canvasInstance.getElement()) return;
      canvasInstance.add(textBox);
    });

    canvasInstance.renderAll();
  };

  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    console.log("🖼 Загрузка макета...");
    restoreElements(canvasInstance, config);
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
