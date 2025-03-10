import { Box, Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";

const Preview = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // 📌 Загружаем изображение из sessionStorage
    const savedImage = sessionStorage.getItem("previewImage");
    if (savedImage) {
      setImageSrc(savedImage);
    }
  }, []);

  const handleExport = () => {
    if (!imageSrc) return;

    // 📌 Скачивание изображения
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "collage.png";
    link.click();
  };

  const handleClose = () => {
    if (window.opener) {
      window.close(); // 📌 Закрываем вкладку, если она была открыта скриптом
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f8f8f8">
      {imageSrc ? (
        <>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "white" }}>
            <img src={imageSrc} alt="Предпросмотр" style={{ maxWidth: "90%", maxHeight: "80vh", border: "2px solid #555" }} />
          </Paper>
          <Box display="flex" gap={2} mt={3}>
            <Button variant="contained" color="success" onClick={handleExport}>📥 Экспорт</Button>
            <Button variant="contained" color="error" onClick={handleClose}>❌ Закрыть вкладку</Button>
          </Box>
        </>
      ) : (
        <Box>❌ Ошибка: Изображение не найдено</Box>
      )}
    </Box>
  );
};

export default Preview;
