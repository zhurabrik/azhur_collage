import { Box, Button, Paper, Select, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Preview = () => {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const [quality, setQuality] = useState<number>(2); // 🔹 По умолчанию 2x качество

  useEffect(() => {
    const storedImage = localStorage.getItem("previewImage");
    const width = localStorage.getItem("canvasWidth");
    const height = localStorage.getItem("canvasHeight");

    if (storedImage && width && height) {
      setImageData(storedImage);
      setCanvasSize({ width: parseInt(width), height: parseInt(height) });
    }
  }, []);

  useEffect(() => {
    if (!imageData || !previewRef.current) return;

    const previewCanvas = previewRef.current;
    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    previewCanvas.width = canvasSize.width;
    previewCanvas.height = canvasSize.height;

    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    };
  }, [imageData, canvasSize]);

  // 🔹 Функция скачивания изображения в высоком качестве
  const handleDownload = () => {
    if (!imageData) return;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // 🔹 Увеличиваем размер холста
    tempCanvas.width = canvasSize.width * quality;
    tempCanvas.height = canvasSize.height * quality;

    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

      const link = document.createElement("a");
      link.href = tempCanvas.toDataURL("image/png", 1.0);
      link.download = `collage_${quality}x.png`;
      link.click();
    };
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
      <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box>📸 Предварительный просмотр</Box>
        <canvas ref={previewRef} style={{ border: "2px solid #555", background: "#fff", maxWidth: "100%", height: "auto" }} />
      </Paper>

      {/* 🔹 Выбор качества экспорта */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box>Качество:</Box>
        <Select value={quality} onChange={(e) => setQuality(Number(e.target.value))}>
          <MenuItem value={1}>Обычное (1x)</MenuItem>
          <MenuItem value={2}>Высокое (2x)</MenuItem>
          <MenuItem value={3}>Очень высокое (3x)</MenuItem>
          <MenuItem value={4}>Ультра HD (4x)</MenuItem>
        </Select>
      </Box>

      <Button variant="contained" color="primary" onClick={handleDownload}>📥 Скачать изображение</Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>🔙 Назад</Button>
    </Box>
  );
};

export default Preview;
