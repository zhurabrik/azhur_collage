import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

const Preview = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // 📌 Слушаем сообщение из редактора
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "preview") {
        setImageSrc(event.data.dataURL);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 📌 Функция для скачивания изображения
  const handleDownload = () => {
    if (!imageSrc) return;

    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "collage.png"; // ✅ Исходное разрешение
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="grey.900">
      {imageSrc ? (
        <img src={imageSrc} alt="Preview" style={{ maxWidth: "100%", maxHeight: "90vh", border: "2px solid white" }} />
      ) : (
        <Box color="white">🔄 Загрузка...</Box>
      )}

      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleDownload}>📥 Экспорт</Button>
        <Button variant="contained" color="secondary" onClick={() => window.close()}>❌ Закрыть</Button>
      </Box>
    </Box>
  );
};

export default Preview;
