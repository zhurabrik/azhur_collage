import { Box, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/useEditorStore";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const navigate = useNavigate();

  const handleExport = () => {
    if (!canvas) return;

    // 🔹 Сохраняем изображение и размеры в `localStorage`
    const imageData = canvas.toDataURL({ format: "png", quality: 1 });
    localStorage.setItem("previewImage", imageData);
    localStorage.setItem("canvasWidth", String(canvas.width));
    localStorage.setItem("canvasHeight", String(canvas.height));

    // 🔹 Переход на страницу предварительного просмотра
    navigate("/preview");
  };

  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      <Button variant="contained" color="primary">🎨</Button> {/* Заменить фон */}
      <Button variant="contained" color="primary">🖼</Button> {/* Добавить изображение */}
      <Button variant="contained" color="primary">🔤</Button> {/* Добавить текст */}
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}

      {/* 🔹 Кнопка экспорта */}
      <Button variant="contained" color="primary" onClick={handleExport}>📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
