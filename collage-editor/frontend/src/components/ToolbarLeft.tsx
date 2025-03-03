import { Button, Paper } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { useNavigate } from "react-router-dom";

const ToolbarLeft = () => {
  const { canvas } = useEditorStore();
  const navigate = useNavigate(); // ✅ Добавляем навигацию внутри приложения

  const handleExport = () => {
    if (!canvas) return;

    // 📌 Сохраняем текущее состояние холста в sessionStorage
    const json = JSON.stringify(canvas.toJSON());
    sessionStorage.setItem("canvasState", json);

    // 📌 Получаем изображение в формате base64
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0, // Высокое качество
    });

    try {
      sessionStorage.setItem("previewImage", dataURL);
      navigate("/preview"); // 🔹 Переход в предпросмотр без новой вкладки
    } catch (error) {
      console.error("❌ Ошибка сохранения изображения:", error);
      alert("Ошибка: изображение слишком большое для сохранения.");
    }
  };
  

  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      <Button variant="contained" color="primary">🎨</Button> {/* Заменить фон */}
      <Button variant="contained" color="primary">🖼</Button> {/* Добавить изображение */}
      <Button variant="contained" color="primary">🔤</Button> {/* Добавить текст */}
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary" onClick={handleExport}>📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
