import { Box, Button, Paper } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const bgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // 🔹 Функция замены фона
  const handleChangeBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;

          const canvasWidth = canvas.width!;
          const canvasHeight = canvas.height!;
          const imgWidth = img.width!;
          const imgHeight = img.height!;

          // 🔹 Масштабирование фона по принципу `cover`
          const scaleFactor = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

          img.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            left: (canvasWidth - imgWidth * scaleFactor) / 2,
            top: (canvasHeight - imgHeight * scaleFactor) / 2,
          });

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Функция добавления изображения
  const handleAddImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;

          // 🔹 Масштабирование, если изображение больше 300px по ширине
          let scaleFactor = 1;
          if (img.width > 300) {
            scaleFactor = 300 / img.width;
          }

          img.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            left: canvas.width! / 2 - (img.width * scaleFactor) / 2,
            top: canvas.height! / 2 - (img.height * scaleFactor) / 2,
            hasBorders: true,
            hasControls: true,
          });

          canvas.add(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Функция добавления текста
  const handleAddText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Введите текст", {
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 20,
        fontSize: 24,
        fill: "#000",
        editable: true,
        hasBorders: true,
        hasControls: true,
      });

      canvas.add(text);
    }
  };

  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}

      {/* 🔹 Кнопка смены фона */}
      <Button variant="contained" color="primary" onClick={() => bgInputRef.current?.click()}>🎨</Button>
      <input type="file" accept="image/*" ref={bgInputRef} style={{ display: "none" }} onChange={handleChangeBackground} />

      {/* 🔹 Кнопка добавления изображения */}
      <Button variant="contained" color="primary" onClick={() => imgInputRef.current?.click()}>🖼</Button>
      <input type="file" accept="image/*" ref={imgInputRef} style={{ display: "none" }} onChange={handleAddImage} />

      {/* 🔹 Кнопка добавления текста */}
      <Button variant="contained" color="primary" onClick={handleAddText}>🔤</Button>

      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary">📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
