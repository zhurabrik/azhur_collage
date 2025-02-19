import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";

interface CanvasProps {
  layout: string;
}

const Canvas = ({ layout }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas } = useEditorStore();
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const updateSize = () => {
      const maxWidth = window.innerWidth * 0.7;
      const maxHeight = window.innerHeight * 0.7;
      const aspectRatio = layout === "vertical" ? 1080 / 1920 : 1920 / 1080;

      let width = maxWidth;
      let height = maxWidth / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight * aspectRatio;
      }

      setDimensions({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [layout]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 🔹 Удаляем старый `canvas`, если он существует
    if (canvas) {
      try {
        if (canvas._objects?.length) {
          canvas.clear(); // ✅ Очищаем объекты перед `dispose()`
        }
        if (canvas.getElement()?.parentNode) {
          canvas.dispose(); // ✅ Проверяем `getElement()`, а не `lowerCanvasEl`
        }
      } catch (error) {
        console.warn("❌ Ошибка при удалении canvas:", error);
      }
      if (canvas !== null) setCanvas(null); // ✅ Проверяем перед установкой `null`
    }

    // ✅ Проверяем, что `canvasRef` существует перед созданием `fabric.Canvas`
    if (!canvasRef.current) return;

    // ✅ Создаём новый холст
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: "#f8f8f8",
    });

    setCanvas(newCanvas);
    loadLayout(newCanvas, layout);

    return () => {
      try {
        if (newCanvas._objects?.length) {
          newCanvas.clear(); // ✅ Перед `dispose()` очищаем холст
        }
        if (newCanvas.getElement()?.parentNode) {
          newCanvas.dispose();
        }
      } catch (error) {
        console.warn("❌ Ошибка при очистке canvas:", error);
      }
      if (canvas !== null) setCanvas(null); // ✅ Проверяем перед установкой `null`
    };
  }, [layout, setCanvas, dimensions]);

  // 🔹 Функция загрузки макета
  const loadLayout = (canvasInstance: fabric.Canvas, layout: string) => {
    const { width = 1, height = 1 } = canvasInstance;

    const bgSrc = layout === "vertical" ? "/layouts/vertical-bg.jpg" : "/layouts/horizontal-bg.jpg";
    const img1Src = "/layouts/img1.jpg";
    const img2Src = "/layouts/img2.jpg";

    // ✅ Проверяем, что `canvasInstance` активен перед загрузкой фона
    if (!canvasInstance.getElement()) {
      console.warn("❌ canvasInstance не существует!");
      return;
    }

    // Фон
    fabric.Image.fromURL(bgSrc, (img) => {
      if (!img || !img.width || !img.height) {
        console.warn(`❌ Фон ${bgSrc} не загрузился.`);
        return;
      }
      img.set({
        left: 0,
        top: 0,
        scaleX: width / img.width!,
        scaleY: height / img.height!,
      });

      // ✅ Проверяем перед `setBackgroundImage()`
      if (canvasInstance.getElement()) {
        canvasInstance.setBackgroundImage(img, () => {
          if (canvasInstance.getElement()) {
            canvasInstance.renderAll();
          }
        });
      }
    });

    // Картинки
    fabric.Image.fromURL(img1Src, (img) => {
      if (!img) {
        console.warn(`❌ Картинка ${img1Src} не загрузилась.`);
        return;
      }
      img.set({
        left: width / 2 - 320,
        top: height / 2 - 150,
        width: 300,
        height: 300,
      });
      if (canvasInstance.getElement()) canvasInstance.add(img);
    });

    fabric.Image.fromURL(img2Src, (img) => {
      if (!img) {
        console.warn(`❌ Картинка ${img2Src} не загрузилась.`);
        return;
      }
      img.set({
        left: width / 2 + 20,
        top: height / 2 - 150,
        width: 300,
        height: 300,
      });
      if (canvasInstance.getElement()) canvasInstance.add(img);
    });

    // Текстовые блоки
    if (canvasInstance.getElement()) {
      canvasInstance.add(new fabric.Textbox("Текст 1", { left: width / 2 - 320, top: height / 2 + 180, fontSize: 24, fill: "#000" }));
      canvasInstance.add(new fabric.Textbox("Текст 2", { left: width / 2 + 20, top: height / 2 + 180, fontSize: 24, fill: "#000" }));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ border: "2px solid #555", background: "#fff" }} />
    </div>
  );
};

export default Canvas;
