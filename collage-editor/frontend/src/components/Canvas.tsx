import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { LayoutConfig } from "../data/layouts";
import { Box, Typography, List, ListItem, Paper } from "@mui/material";

interface CanvasProps {
  layoutConfig: LayoutConfig;
  zoom: number;
}

const Canvas = ({ layoutConfig, zoom }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, canvas } = useEditorStore();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [layers, setLayers] = useState<fabric.Object[]>([]);

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
        setTimeout(() => {
          if (!newCanvas || !newCanvas.getElement()) return;
          newCanvas.loadFromJSON(savedState, () => {
            console.log("✅ Холст восстановлен!");
            restoreElements(newCanvas, layoutConfig);
            updateLayerList(newCanvas);
            centerCanvas(newCanvas);
            newCanvas.renderAll();
          });
        }, 200);
      } catch (error) {
        console.error("❌ Ошибка загрузки холста:", error);
      }
    } else {
      loadLayout(newCanvas, layoutConfig);
      updateLayerList(newCanvas);
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

  /** 🔥 Отключаем автоматический подъем элемента */
  useEffect(() => {
    if (!canvas) return;

    console.log("🔄 Добавляем обработчик порядка слоев...");

    const initialLayerOrder = new Map<fabric.Object, number>();

    canvas.getObjects().forEach((obj, index) => {
      initialLayerOrder.set(obj, index);
    });

    const restoreLayerOrder = (event: fabric.IEvent) => {
      const activeObject = event.target;
      if (!activeObject || !initialLayerOrder.has(activeObject)) return;

      const originalIndex = initialLayerOrder.get(activeObject);
      if (originalIndex === undefined) return;

      // 📌 Восстанавливаем объект на его место
      canvas.remove(activeObject);
      canvas.insertAt(activeObject, originalIndex, false);
      canvas.renderAll();
    };

    canvas.on("selection:created", restoreLayerOrder);
    canvas.on("selection:updated", restoreLayerOrder);
    canvas.on("object:added", () => updateLayerList(canvas));
    canvas.on("object:removed", () => updateLayerList(canvas));

    return () => {
      canvas.off("selection:created", restoreLayerOrder);
      canvas.off("selection:updated", restoreLayerOrder);
      canvas.off("object:added", updateLayerList);
      canvas.off("object:removed", updateLayerList);
    };
  }, [canvas]);

  /** 🔥 Обновляет список слоев */
  const updateLayerList = (canvasInstance: fabric.Canvas) => {
    setLayers([...canvasInstance.getObjects()].reverse()); // ✅ Слои идут от верхнего к нижнему
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

  const restoreElements = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    if (!canvasInstance.getElement()) return;
    console.log("🔄 Восстанавливаем элементы...");

    const { width, height, background, images, texts } = config;

    if (background) {
      fabric.Image.fromURL(background, (img) => {
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

    updateLayerList(canvasInstance);
    canvasInstance.renderAll();
  };

  const loadLayout = (canvasInstance: fabric.Canvas, config: LayoutConfig) => {
    console.log("🖼 Загрузка макета...");
    restoreElements(canvasInstance, config);
  };

  return (
    <Box display="flex" width="100%" height="100%">
      <Box ref={containerRef} flex={1} display="flex" justifyContent="center" alignItems="center" overflow="auto">
        <canvas ref={canvasRef} style={{ border: "2px solid #555", background: "#fff" }} />
      </Box>

      {/* 🔥 Панель слоев справа */}
      <Paper elevation={3} sx={{ width: 200, p: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6">📂 Слои</Typography>
        <List>
          {layers.map((layer, index) => (
            <ListItem key={index}>{layer.type === "textbox" ? `Текст: ${(layer as fabric.Textbox).text}` : `Изображение`}</ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Canvas;
