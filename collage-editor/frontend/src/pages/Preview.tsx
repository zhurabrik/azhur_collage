import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Preview = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem("previewImage"); // ✅ Берём из sessionStorage
    if (storedImage) {
      setPreviewImage(storedImage);
    } else {
      navigate("/layouts"); // ✅ Если нет изображения – возвращаем в выбор макета
    }
  }, [navigate]);

  // ✅ Возвращаем пользователя в редактор с правильным макетом
  const handleBackToEditor = () => {
    const layoutId = sessionStorage.getItem("layoutId") || "vertical"; // 🔹 Берём id макета
    navigate(`/editor/${layoutId}`); // ✅ Теперь редиректим в нужный макет
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" height="100vh" bgcolor="#333">
      {/* 🔹 Шапка */}
      <Box sx={{ height: 60, width: "100%", bgcolor: "grey.900", color: "white", display: "flex", alignItems: "center", px: 3, gap: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleBackToEditor}>
          Назад в редактор
        </Button>
      </Box>

      {/* 🔹 Область предпросмотра */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" width="100%" overflow="auto">
        {previewImage ? (
          <img src={previewImage} alt="Предпросмотр" style={{ maxWidth: "90%", maxHeight: "90%", border: "2px solid white" }} />
        ) : (
          <Box color="white">Нет изображения для предпросмотра</Box>
        )}
      </Box>
    </Box>
  );
};

export default Preview;
