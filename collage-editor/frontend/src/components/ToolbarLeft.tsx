import { IconButton, Button, Paper } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { ChangeEvent, useRef } from "react";
import { fabric } from "fabric";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppStore } from "../store/useAppStore";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const toggleHeader = useAppStore((s) => s.toggleHeader);

  const handleExport = () => {
    if (!canvas) return;
  
    // Сохраняем текущие параметры
    const zoom = canvas.getZoom();
    const originalWidth = canvas.width!;
    const originalHeight = canvas.height!;
  
    // Временно устанавливаем 100% масштаб и оригинальные размеры
    canvas.setZoom(1);
    canvas.setDimensions({
      width: originalWidth,
      height: originalHeight,
    });
  
    canvas.renderAll();
  
    // Получаем изображение в оригинальном размере
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1, // ✅ масштаб = 1, т.е. оригинальный размер
    });
  
    // Восстанавливаем размеры и масштаб после экспорта
    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: originalWidth * zoom,
      height: originalHeight * zoom,
    });
  
    canvas.renderAll();
  
    // Открываем preview
    const previewWindow = window.open("/preview", "_blank");
    setTimeout(() => {
      if (previewWindow) {
        previewWindow.postMessage({ type: "preview", dataURL }, "*");
      }
    }, 1000);
  };
  

  // 🔹 Замена фона без изменения размеров холста
  const handleReplaceBackground = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const file = event.target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
  
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;
  
          const canvasWidth = canvas.width!;
          const canvasHeight = canvas.height!;
  
          // 🔥 Вычисляем масштаб так, чтобы фон **полностью покрывал холст**
          const scaleX = canvasWidth / img.width;
          const scaleY = canvasHeight / img.height;
          const scale = Math.max(scaleX, scaleY); // ✅ Берём **наибольший** масштаб для "cover"
  
          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
          });
  
          // ✅ Устанавливаем фон
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Добавление изображения
  const handleAddImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
  
        // 🔹 Запрашиваем название перед загрузкой
        const imageName = prompt("Введите название слоя для изображения:", file.name.split(".")[0]);
  
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;
  
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
            name: imageName || "Изображение", // ✅ Сохраняем кастомное имя
          });
  
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };
  

  // 🔹 Добавление текста
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
      <IconButton onClick={toggleHeader} sx={{ color: "#fff", mb: 2 }}>
        <MenuIcon />
      </IconButton>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      
      {/* 🔹 Кнопка для замены фона */}
      <Button variant="contained" color="primary" onClick={() => bgInputRef.current?.click()}>🎨</Button>
      <input type="file" accept="image/*" ref={bgInputRef} style={{ display: "none" }} onChange={handleReplaceBackground} />

      {/* 🔹 Кнопка для добавления изображения */}
      <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>🖼</Button>
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAddImage} />

      <Button variant="contained" color="primary" onClick={handleAddText}>🔤</Button> {/* Добавить текст */}
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary" onClick={handleExport}>📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
