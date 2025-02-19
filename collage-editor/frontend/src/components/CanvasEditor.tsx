import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";

const CanvasEditor = ({ layout }: { layout: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas } = useEditorStore();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Функция для установки размеров холста под экран
    const updateCanvasSize = () => {
      const maxWidth = window.innerWidth * 0.8; // 80% ширины экрана
      const maxHeight = window.innerHeight * 0.8; // 80% высоты экрана
      const aspectRatio = layout === "vertical" ? 1080 / 1920 : 1920 / 1080;

      let width = maxWidth;
      let height = maxWidth / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight * aspectRatio;
      }

      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [layout]);

  useEffect(() => {
    if (!fabric || canvas || !canvasRef.current || canvasSize.width === 0) return;

    // Создаём новый холст с адаптивными размерами
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#f8f8f8",
    });

    setCanvas(canvasInstance);
    loadLayout(canvasInstance, layout);

    return () => {
      canvasInstance.dispose();
      setCanvas(null);
    };
  }, [fabric, setCanvas, canvas, layout, canvasSize]);

  // 🔹 Функция загрузки макета
  const loadLayout = (canvasInstance: fabric.Canvas, layout: string) => {
    const width = canvasInstance.width!;
    const height = canvasInstance.height!;

    const bgSrc = layout === "vertical" ? "/layouts/vertical-bg.jpg" : "/layouts/horizontal-bg.jpg";
    const img1Src = "/layouts/img1.jpg";
    const img2Src = "/layouts/img2.jpg";

    // Фон адаптируется к холсту
    fabric.Image.fromURL(bgSrc, (img) => {
      img.set({
        left: 0,
        top: 0,
        scaleX: width / img.width!,
        scaleY: height / img.height!,
      });
      canvasInstance.setBackgroundImage(img, canvasInstance.renderAll.bind(canvasInstance));
    });

    // Первая картинка (слева)
    fabric.Image.fromURL(img1Src, (img) => {
      img.set({
        left: width / 2 - 320,
        top: height / 2 - 150,
        width: 300,
        height: 300,
      });
      canvasInstance.add(img);
    });

    // Вторая картинка (справа)
    fabric.Image.fromURL(img2Src, (img) => {
      img.set({
        left: width / 2 + 20,
        top: height / 2 - 150,
        width: 300,
        height: 300,
      });
      canvasInstance.add(img);
    });

    // Текстовые блоки
    const text1 = new fabric.Textbox("Текст 1", {
      left: width / 2 - 320,
      top: height / 2 + 180,
      fontSize: 24,
      fill: "#000",
    });
    const text2 = new fabric.Textbox("Текст 2", {
      left: width / 2 + 20,
      top: height / 2 + 180,
      fontSize: 24,
      fill: "#000",
    });

    canvasInstance.add(text1);
    canvasInstance.add(text2);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc", maxWidth: "100%", maxHeight: "100%" }} />
    </div>
  );
};

export default CanvasEditor;
