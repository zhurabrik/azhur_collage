import { Box, Button, Paper } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          // 🔹 Вычисляем масштаб с сохранением пропорций (background-size: cover)
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

  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      
      {/* 🔹 Кнопка смены фона */}
      <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>🎨</Button>
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleChangeBackground} />
      
      <Button variant="contained" color="primary">🖼</Button> {/* Добавить изображение */}
      <Button variant="contained" color="primary">🔤</Button> {/* Добавить текст */}
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary">📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
