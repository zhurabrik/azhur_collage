import { Button, Paper } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { ChangeEvent, useRef } from "react";
import { fabric } from "fabric";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!canvas) return;
  
    // 📌 Получаем изображение в формате base64
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0, // 📌 Высокое качество
    });
  
    try {
      sessionStorage.setItem("previewImage", dataURL);
      window.open("/preview", "_blank"); // 📌 Открываем `Preview` в новой вкладке
    } catch (error) {
      console.error("❌ Ошибка сохранения изображения:", error);
      alert("Ошибка: изображение слишком большое для сохранения.");
    }
  };
  
  
  // 🔹 Обработчик загрузки изображения
  const handleAddImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;

        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;

          // 🔹 Масштабируем изображение, если оно больше 300px в ширину
          let scale = 1;
          if (img.width > 300) {
            scale = 300 / img.width;
          }

          img.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            scaleX: scale,
            scaleY: scale,
            originX: "center",
            originY: "center",
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Обработчик добавления текста
  const handleAddText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("Новый текст", {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 24,
      fill: "#000",
      textAlign: "center",
      originX: "center",
      originY: "center",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      <Button variant="contained" color="primary">🎨</Button> {/* Заменить фон */}
      <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>🖼</Button>
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAddImage} />
      <Button variant="contained" color="primary" onClick={handleAddText}>🔤</Button>
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary" onClick={handleExport}>📤</Button>
    </Paper>
  );
};

export default ToolbarLeft;
