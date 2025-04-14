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
  const { setCanvas, canvas, setLayers, setSelectedObject } = useEditorStore();
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

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
      try {
        newCanvas.loadFromJSON(savedState, () => {
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
      if (!newCanvas.getElement()) return;

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

  /** 🔥 Отключаем автоматический подъем объекта */
  useEffect(() => {
    if (!canvas) return;

    console.log("🔄 Отключаем автоматический подъем элементов...");
    canvas.preserveObjectStacking = true;

    // ✅ Обновляем слои только при добавлении/удалении объектов
    const updateLayers = () => updateLayerList(canvas);

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);

    // ✅ Обновляем **только выделенный объект**, не обновляя весь список слоев
    const handleSelection = (e: fabric.IEvent) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", () => setSelectedObject(null));
    };
  }, [canvas]);

  /** 🔥 Обновляет список слоев */
  const updateLayerList = (canvasInstance: fabric.Canvas) => {
    const sortedLayers = canvasInstance.getObjects().slice().reverse(); // ✅ Верхние слои первыми
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

  /** ✅ Функция загрузки элементов */
  const restoreElements = async (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    if (!canvasInstance.getElement()) return;
    console.log("🔄 Восстанавливаем элементы по слоям...");
  
    const { width, height, background, layers } = config;
  
    // Очистка
    canvasInstance.getObjects().forEach((obj) => canvasInstance.remove(obj));
  
    // Установка фона
    if (background) {
      await new Promise<void>((resolve) => {
        fabric.Image.fromURL(background, (img) => {
          img.set({
            left: 0,
            top: 0,
            scaleX: width / img.width!,
            scaleY: height / img.height!,
            selectable: false
          });
          canvasInstance.setBackgroundImage(img, () => {
            canvasInstance.renderAll();
            resolve();
          });
        });
      });
    }
  
    // 🔄 Сортировка по zIndex
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  
    for (const layer of sortedLayers) {
      if (layer.type === "image") {
        await new Promise<void>((resolve) => {
          fabric.Image.fromURL(layer.src, (img) => {
            const scale = layer.width / img.width!;
            img.set({
              left: layer.left,
              top: layer.top,
              scaleX: scale,
              scaleY: scale
            });
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
        });
        canvasInstance.add(textBox);
      }
    }
  
    updateLayerList(canvasInstance);
    canvasInstance.renderAll();
  };
  
  

  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    console.log("🖼 Загрузка макета...");
    restoreElements(canvasInstance, config);
  };

  return (
    <Box
      ref={containerRef}
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        overflow: "auto", // ✅ прокрутка включена
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
